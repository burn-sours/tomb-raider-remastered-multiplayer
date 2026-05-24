const dgram = require('dgram');
const { netcode } = require('../shared');
const { generatePlayerId, sanitizeMessage } = require('./utils');
const { server: config } = require('./config');
const fs = require('fs');

const RATE_LIMIT_TOKENS_PER_SEC = 3500;
const RATE_LIMIT_BURST = 500;
const PLAYER_TIMEOUT_MS = 10000;
const UPDATE_INTERVAL_MS = 33;
const CLEANUP_INTERVAL_MS = 1000;
const COUNT_INTERVAL_MS = 1000;
const KEEPALIVE_INTERVAL_MS = 5000;

class TRRServer {
    constructor(port = 41234) {
        this.port = port;
        this.socket = dgram.createSocket('udp4');
        this.players = new Map();
        this.lastDataTimes = new Map();
        this.rateLimitBuckets = new Map();
        this.levelsInfo = { "0": { "0": [], "1": [], "2": [] }, "1": { "0": [], "1": [], "2": [] }, "2": { "0": [], "1": [], "2": [] } };

        this.setupSocketHandlers();
    }

    start() {
        this.socket.bind(this.port);
        this.startCleanupLoop();
        this.startCountLoop();
        this.startBroadcastLoop();
        this.startKeepaliveLoop();
    }

    setupSocketHandlers() {
        this.socket.on('listening', () => {
            const address = this.socket.address();
            console.log(`Tomb Raider Remastered Multiplayer Server - listening on ${address.address}:${address.port}`);
            console.log(`Server version: ${config.major} (${config.majorHash})`);
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
            console.warn('[DBG] decompress failed:', err.message);
            return;
        }

        const packetType = msg.readUInt8(0);
        const _v = msg.readUInt32BE(1);
        const _seq = msg.readUInt8(5);

        if (packetType !== netcode.PACKET_TYPE_GLOBAL_REQ) {
            if (!this.validateCriticalKeys(_v, _seq)) {
                console.warn('[DBG] version rejected:', _v, 'expected:', config.majorHash);
                this.sendOutdated(rinfo).then(() => { });
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
                case netcode.PACKET_TYPE_VFX:
                    await this.handleVfxState(netcode.decodeVfx(msg), rinfo);
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
                case netcode.PACKET_TYPE_KEEPALIVE:
                    await this.handleKeepalive(netcode.decodeKeepalive(msg), rinfo);
                    break;
                case netcode.PACKET_TYPE_DISCONNECT:
                    await this.handleDisconnect(netcode.decodeDisconnect(msg), rinfo);
                    break;
                default:
                    console.error(`Unknown packet type: ${packetType}`);
            }
        } catch (err) {
            console.warn('Error handling packet', remoteAddr, err);
        }
    }

    checkRateLimit(remoteAddr, currentTime) {
        let bucket = this.rateLimitBuckets.get(remoteAddr);
        if (!bucket) {
            bucket = { tokens: RATE_LIMIT_BURST, lastTime: currentTime };
            this.rateLimitBuckets.set(remoteAddr, bucket);
        }

        const elapsed = currentTime - bucket.lastTime;
        bucket.tokens = Math.min(RATE_LIMIT_BURST, bucket.tokens + elapsed * RATE_LIMIT_TOKENS_PER_SEC / 1000);
        bucket.lastTime = currentTime;

        if (bucket.tokens >= 1) {
            bucket.tokens -= 1;
            return true;
        }

        console.warn('Rate limit exceeded:', remoteAddr);
        return false;
    }

    validateCriticalKeys(_v, _seq) {
        if (!_v || _v !== config.majorHash) return false;
        return !isNaN(_seq);
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
            if (!player) return;
            if (player._seq !== undefined) {
                const diff = (player._seq - decoded._seq) & 0xFF;
                if (diff > 0 && diff < 128) return;
            }
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

    async handleVfxState(decoded, rinfo) {
        if (!decoded.id || !this.players.has(decoded.id)) return;

        this.lastDataTimes.set(decoded.id, performance.now());
        const encoded = await netcode.compress(netcode.encodeVfx(decoded));

        for (const [otherId, otherPlayer] of this.players) {
            if (otherId !== decoded.id && this.arePlayersInSameSession(otherPlayer, decoded)) {
                this.socket.send(encoded, otherPlayer.port, otherPlayer.address);
            }
        }
    }

    async handleChatState(decoded, rinfo) {
        const player = this.players.get(decoded.id);
        if (!decoded.id || !player) return;

        this.lastDataTimes.set(decoded.id, performance.now());

        decoded.text = sanitizeMessage(decoded.text);
        const encodedChat = await netcode.compress(netcode.encodeChat(decoded));

        for (const [otherId, otherPlayer] of this.players) {
            if (this.arePlayersInSameSession(otherPlayer, decoded)) {
                this.socket.send(encodedChat, otherPlayer.port, otherPlayer.address);
            }
        }
    }

    async handleKeepalive(decoded, rinfo) {
        if (!decoded.id || !this.players.has(decoded.id)) return;
        this.lastDataTimes.set(decoded.id, performance.now());
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
            _seq: 0,
            _v: config.majorHash
        });

        this.socket.send(await netcode.compress(chatData), player.port, player.address);
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
            for (const [addr, bucket] of this.rateLimitBuckets) {
                if (now - bucket.lastTime > PLAYER_TIMEOUT_MS) {
                    this.rateLimitBuckets.delete(addr);
                }
            }
        }, CLEANUP_INTERVAL_MS);
    }

    startCountLoop() {
        setInterval(() => {
            const newLevelsInfo = { "0": { "0": [], "1": [], "2": [] }, "1": { "0": [], "1": [], "2": [] }, "2": { "0": [], "1": [], "2": [] } };

            for (const [playerId, player] of this.players) {
                for (let x = 0; x < 3; x++) {
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

            // Write player stats for external integrations (discord bot, etc.)
            // Only include players in public lobby ("" or "_")
            const publicPlayers = Array.from(this.players.values())
                .filter(p => p.lobby === '' || p.lobby === '_');
            const stats = {
                timestamp: Date.now(),
                totalPlayers: publicPlayers.length,
                players: publicPlayers.map(p => ({
                    name: p.name,
                    level: p.level,
                    version: p.version,
                    bundleId: p.bundleId
                }))
            };
            fs.writeFile('./player-stats.json', JSON.stringify(stats), () => { });

            // Private lobby stats (no lobby codes exposed)
            const privatePlayers = Array.from(this.players.values())
                .filter(p => p.lobby !== '' && p.lobby !== '_');
            const lobbyStats = {
                timestamp: Date.now(),
                totalPlayers: privatePlayers.length,
                players: privatePlayers.map(p => ({
                    name: p.name,
                    level: p.level,
                    version: p.version,
                    bundleId: p.bundleId,
                    lobby: p.lobby
                }))
            };
            fs.writeFile('./player-stats-lobbies.json', JSON.stringify(lobbyStats), () => { });
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
            const keepalive = await netcode.compress(netcode.encodeKeepalive({
                _v: config.majorHash,
                _seq: 0,
                id: "server",
                name: "Server",
                lobby: "_",
            }));
            for (const [playerId, player] of this.players) {
                this.socket.send(keepalive, player.port, player.address);
            }
        }, KEEPALIVE_INTERVAL_MS);
    }
}

module.exports = { TRRServer };
