const dgram = require('dgram');
const { netcode } = require('../shared');
const { generatePlayerId, sanitizeMessage } = require('./utils');
const { QuizChat, MAX_MESSAGE_LENGTH } = require('./quiz');
const { server: config } = require('./config');

const RATE_LIMIT_MS = 10;
const RATE_LIMIT_MAX = 100;
const PLAYER_TIMEOUT_MS = 10000;
const UPDATE_INTERVAL_MS = 33;
const CLEANUP_INTERVAL_MS = 1000;
const COUNT_INTERVAL_MS = 1000;
const KEEPALIVE_INTERVAL_MS = 5000;
const STATS_REPORT_COUNT = 5;
const MAX_STATS_DISPLAY_PLAYERS = 10;
const QUIZ_MESSAGE_SPLIT_DELAY_MS = 500;

class TRRServer {
    constructor(port = 41234) {
        this.port = port;
        this.socket = dgram.createSocket('udp4');
        this.players = new Map();
        this.lastDataTimes = new Map();
        this.lastPacketTimes = new Map();
        this.lastPacketAbuses = new Map();
        this.levelsInfo = { "0": { "0": [], "1": [], "2": [] }, "1": { "0": [], "1": [], "2": [] } };
        this.lastReportedStats = 0;

        if (config.quizEnabled) {
            this.quiz = new QuizChat(this.sendQuizMessage.bind(this));
        }

        this.setupSocketHandlers();
    }

    start() {
        this.socket.bind(this.port);
        this.startCleanupLoop();
        this.startCountLoop();
        this.startBroadcastLoop();
        this.startKeepaliveLoop();
        this.quiz?.start();
    }

    setupSocketHandlers() {
        this.socket.on('listening', () => {
            const address = this.socket.address();
            console.log(`TRR Multiplayer Server listening on ${address.address}:${address.port}`);
            console.log(`Version: ${config.major} (${config.majorHash})`);
        });

        this.socket.on('message', (msg, rinfo) => this.handleMessage(msg, rinfo));
    }

    async handleMessage(msg, rinfo) {
        const remoteAddr = `${rinfo.address}:${rinfo.port}`;
        const currentTime = performance.now();

        if (!this.checkRateLimit(remoteAddr, currentTime)) return;

        try {
            msg = await netcode.decompress(msg);
        } catch (err) {
            return;
        }

        const packetType = msg.readUInt8(0);
        const _v = msg.readUInt32BE(1);
        const _t = Number(msg.readBigInt64BE(5));

        if (packetType !== netcode.PACKET_TYPE_GLOBAL_REQ) {
            if (!this.validateCriticalKeys(_v, _t)) {
                this.sendOutdated(rinfo).then(() => {});
                return;
            }
        }

        try {
            switch (packetType) {
                case netcode.PACKET_TYPE_HIGHFREQ:
                    await this.handlePlayerState(netcode.decodeHighFreq(msg), rinfo);
                    break;
                case netcode.PACKET_TYPE_SOUND:
                    await this.handleSoundState(netcode.decodeSound(msg), rinfo);
                    break;
                case netcode.PACKET_TYPE_PVP:
                    await this.handlePVPState(netcode.decodePVP(msg), rinfo);
                    break;
                case netcode.PACKET_TYPE_CHAT:
                    await this.handleChatState(netcode.decodeChat(msg), rinfo);
                    break;
                case netcode.PACKET_TYPE_GLOBAL_REQ:
                    await this.handleGlobalRequest(netcode.decodeGlobalReq(msg), rinfo);
                    break;
                case netcode.PACKET_TYPE_DISCONNECT:
                    await this.handleDisconnect(netcode.decodeDisconnect(msg), rinfo);
                    break;
                default:
                    console.error(`Unknown packet type: ${packetType}`);
            }
        } catch (err) {
            console.warn('Failed to handle packet', remoteAddr, err);
        }
    }

    checkRateLimit(remoteAddr, currentTime) {
        if (this.lastPacketTimes.get(remoteAddr) && (currentTime - this.lastPacketTimes.get(remoteAddr) < RATE_LIMIT_MS)) {
            const abuses = (this.lastPacketAbuses.get(remoteAddr) || 0) + 1;
            this.lastPacketAbuses.set(remoteAddr, abuses);
            if (abuses >= RATE_LIMIT_MAX) {
                console.log('Rate limit exceeded:', remoteAddr);
                return false;
            }
        } else {
            this.lastPacketAbuses.set(remoteAddr, Math.max(0, (this.lastPacketAbuses.get(remoteAddr) || 0) - 1));
        }
        this.lastPacketTimes.set(remoteAddr, currentTime);
        return true;
    }

    validateCriticalKeys(_v, _t) {
        if (!_v || _v !== config.majorHash) return false;
        return !(!_t || isNaN(_t));
    }

    async sendOutdated(rinfo) {
        const buffer = Buffer.alloc(5);
        buffer.writeUInt8(netcode.PACKET_TYPE_OUTDATED, 0);
        buffer.writeInt32BE(config.majorHash, 1);
        this.socket.send(await netcode.compress(buffer), rinfo.port, rinfo.address);
    }

    async handlePlayerState(decoded, rinfo) {
        const isNewPlayer = !decoded.id || !this.players.has(decoded.id) || decoded.id === '_';
        let player;

        if (isNewPlayer) {
            const _id = (!decoded.id || decoded.id === '_') ? generatePlayerId() : decoded.id;
            decoded.id = _id;
            this.lastDataTimes.set(_id, performance.now());
            player = { ...decoded, address: rinfo.address, port: rinfo.port };
            this.players.set(_id, player);

            await this.sendConnectionResponse(player, rinfo);
            console.log(`[${player.id}: ${player.name}] Connected`);
        } else {
            player = this.players.get(decoded.id);
            if (!player || decoded._t < player._t) return;
            this.lastDataTimes.set(player.id, performance.now());
            Object.assign(player, decoded);
            this.players.set(player.id, player);
        }
    }

    async sendConnectionResponse(player, rinfo) {
        const idBuffer = Buffer.from(player.id || "_", 'utf-8');
        const idLength = idBuffer.length;
        const justConnected = Buffer.alloc(9 + idLength);
        justConnected.writeUInt8(netcode.PACKET_TYPE_CONNECTION, 0);
        justConnected.writeInt32BE(config.majorHash, 1);
        justConnected.writeUInt16BE(idLength, 5);
        idBuffer.copy(justConnected, 7);
        justConnected.writeInt16BE(player.level || -1, 7 + idLength);

        this.socket.send(await netcode.compress(justConnected), rinfo.port, rinfo.address);
    }

    async handlePVPState(decoded, rinfo) {
        if (!decoded.id || !this.players.has(decoded.id)) return;

        this.lastDataTimes.set(decoded.id, performance.now());
        const otherPlayer = this.players.get(decoded.pvpPlayer);

        if (otherPlayer && this.arePlayersInSameSession(otherPlayer, decoded)) {
            this.socket.send(
                await netcode.compress(netcode.encodePVP(decoded)),
                otherPlayer.port,
                otherPlayer.address
            );
        }
    }

    async handleSoundState(decoded, rinfo) {
        if (!decoded.id || !this.players.has(decoded.id)) return;

        this.lastDataTimes.set(decoded.id, performance.now());
        const encodedSound = await netcode.compress(netcode.encodeSound(decoded));

        for (const [otherId, otherPlayer] of this.players) {
            if (otherId !== decoded.id && this.arePlayersInSameSession(otherPlayer, decoded)) {
                this.socket.send(encodedSound, otherPlayer.port, otherPlayer.address);
            }
        }
    }

    async handleChatState(decoded, rinfo) {
        const player = this.players.get(decoded.id);
        if (!decoded.id || !player) return;

        this.lastDataTimes.set(decoded.id, performance.now());
        const message = decoded.text.toLowerCase().trim();

        if (this.quiz && message === "/quizoff") {
            this.quiz.handleOptOut(player.id);
            await this.sendServerMessage(player, "You won't get quiz messages for this session.");
            return;
        }

        decoded.text = sanitizeMessage(decoded.text);
        const encodedChat = await netcode.compress(netcode.encodeChat(decoded));

        for (const [otherId, otherPlayer] of this.players) {
            if (this.arePlayersInSameSession(otherPlayer, decoded)) {
                this.socket.send(encodedChat, otherPlayer.port, otherPlayer.address);
            }
        }
    }

    async handleGlobalRequest(decoded, rinfo) {
        if (!decoded.id || !this.players.has(decoded.id)) return;

        this.lastDataTimes.set(decoded.id, performance.now());
        const player = this.players.get(decoded.id);
        player.level = decoded.level;
        player.version = decoded.version;
        player.lobby = decoded.lobby;

        const globalState = netcode.encodeGlobal({
            major: config.majorHash,
            list: (this.levelsInfo[String(decoded.bundleId)][String(decoded.version)] || [])
                .filter(l => l.lobby === player.lobby && l.players > 0)
        });

        this.socket.send(await netcode.compress(globalState), rinfo.port, rinfo.address);
    }

    async handleDisconnect(decoded, rinfo) {
        const player = this.players.get(decoded.id);
        if (!decoded.id || !player) return;

        console.log(`[${player.id}: ${player.name}] Disconnected`);

        const encodedDisconnect = await netcode.compress(netcode.encodeDisconnect(decoded));
        for (const [otherId, otherPlayer] of this.players) {
            if (otherId !== decoded.id && this.arePlayersInSameSession(otherPlayer, decoded)) {
                this.socket.send(encodedDisconnect, otherPlayer.port, otherPlayer.address);
            }
        }

        this.removePlayer(decoded.id);
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
        this.lastDataTimes.delete(playerId);
        this.quiz?.cleanupPlayer(playerId);
    }

    async sendServerMessage(player, text) {
        await this.sendChatMessage("Server", player, text);
    }

    async sendChatMessage(name, player, text) {
        const chatData = netcode.encodeChat({
            name,
            level: player.level,
            version: player.version,
            lobby: player.lobby,
            bundleId: player.bundleId,
            text,
            _t: Number(Date.now()),
            _v: config.majorHash
        });

        this.socket.send(await netcode.compress(chatData), player.port, player.address);
    }

    async sendQuizMessage(name, text, filterFn, targetPlayerId = null, delay = 0) {
        const sendSplitMessage = async (player, messageText, messageDelay) => {
            const messages = [];

            if (messageText.length <= MAX_MESSAGE_LENGTH) {
                messages.push(messageText);
            } else {
                const words = messageText.split(' ');
                let currentMessage = '';

                for (const word of words) {
                    if ((currentMessage + ' ' + word).length <= MAX_MESSAGE_LENGTH) {
                        currentMessage = currentMessage ? currentMessage + ' ' + word : word;
                    } else {
                        if (currentMessage) messages.push(currentMessage);
                        currentMessage = word;
                    }
                }
                if (currentMessage) messages.push(currentMessage);
            }

            for (let i = 0; i < messages.length; i++) {
                setTimeout(async () => {
                    const chatData = netcode.encodeChat({
                        name,
                        level: player.level,
                        version: player.version,
                        lobby: player.lobby,
                        bundleId: player.bundleId,
                        text: messages[i],
                        _t: Number(Date.now()),
                        _v: config.majorHash
                    });
                    this.socket.send(await netcode.compress(chatData), player.port, player.address);
                }, messageDelay + (i * QUIZ_MESSAGE_SPLIT_DELAY_MS));
            }
        };

        if (targetPlayerId) {
            const player = this.players.get(targetPlayerId);
            if (player) {
                await sendSplitMessage(player, text, delay);
            }
        } else {
            for (const [playerId, player] of this.players) {
                const result = filterFn(playerId);
                if (result === false) continue;

                const messageDelay = typeof result === 'number' ? result : delay;
                await sendSplitMessage(player, text, messageDelay);
            }
        }
    }

    arePlayersInSameSession(player1, player2) {
        return player1.level === player2.level &&
            player1.version === player2.version &&
            player1.bundleId === player2.bundleId &&
            player1.lobby === player2.lobby;
    }

    startCleanupLoop() {
        setInterval(() => {
            const now = performance.now();
            for (const [playerId, player] of this.players) {
                const lastDataTime = this.lastDataTimes.get(playerId);
                if (!lastDataTime || (now - lastDataTime > PLAYER_TIMEOUT_MS)) {
                    console.log(`[${player.id}: ${player.name}] Timed out`);
                    this.removePlayer(playerId);
                }
            }
        }, CLEANUP_INTERVAL_MS);
    }

    startCountLoop() {
        setInterval(() => {
            const newLevelsInfo = { "0": { "0": [], "1": [], "2": [] }, "1": { "0": [], "1": [], "2": [] } };

            for (const [playerId, player] of this.players) {
                for (let x = 0; x < 2; x++) {
                    for (let i = 0; i < 3; i++) {
                        if (player.version !== i || player.bundleId !== x) continue;
                        let lvl = newLevelsInfo[String(x)][String(i)].find(l => l.lvl === player.level && l.lobby === player.lobby);
                        if (!lvl) {
                            lvl = { lvl: player.level, players: 0, lobby: player.lobby };
                            newLevelsInfo[String(x)][String(i)].push(lvl);
                        }
                        lvl.players += 1;
                    }
                }
            }

            this.levelsInfo = newLevelsInfo;

            this.lastReportedStats++;
            if (this.lastReportedStats > STATS_REPORT_COUNT) {
                this.lastReportedStats = 0;
                console.log('Players online:', this.players.size);
                let count = 0;
                for (const [playerId, player] of this.players) {
                    if (count++ >= MAX_STATS_DISPLAY_PLAYERS) break;
                    const trVersion = (player.bundleId !== undefined && player.version !== undefined)
                        ? (3 * player.bundleId) + player.version + 1
                        : '?';
                    console.log(`  > ${player.name} - in TR${trVersion} LVL ${player.level}`);
                }
            }
        }, COUNT_INTERVAL_MS);
    }

    startBroadcastLoop() {
        setInterval(async () => {
            const allPlayers = Array.from(this.players.entries());
            for (const [playerId, player] of allPlayers) {
                if (!this.players.has(playerId)) continue;
                const encodedState = await netcode.compress(netcode.encodeHighFreq(player));

                for (const [otherId, otherPlayer] of allPlayers) {
                    if (otherId !== playerId && this.arePlayersInSameSession(otherPlayer, player)) {
                        this.socket.send(encodedState, otherPlayer.port, otherPlayer.address);
                    }
                }
            }
        }, UPDATE_INTERVAL_MS);
    }

    startKeepaliveLoop() {
        setInterval(async () => {
            const keepalive = await netcode.compress(netcode.encodeKeepalive(config.majorHash, Date.now()));
            for (const [playerId, player] of this.players) {
                this.socket.send(keepalive, player.port, player.address);
            }
        }, KEEPALIVE_INTERVAL_MS);
    }
}

module.exports = { TRRServer };
