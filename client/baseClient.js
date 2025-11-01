const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const frida = require('frida');
const dgram = require('dgram');
const crypto = require('crypto');
const { netcode } = require('../shared');
const gameManifests = require("./games/manifest");
const featureManifests = require("./features/manifest");
const ui = require('./ui');
const userdata = require('./userdata');
const config = require("./config");

class BaseGameClient extends EventEmitter {
    socket;
    bundleId;
    bundleIdInteger;
    manifest;
    session = null;
    processPath = null;
    processHash = null;
    memoryAddresses = null;
    gameScript = null;
    launchOptions = {};
    exiting = false;
    lastFiredLeft = 0;
    lastFiringLeft = 0;
    lastFiredRight = 0;
    lastFiringRight = 0;
    lastFiredFlare = 0;
    lastFiringFlare = 0;
    pvpDamage = [null, 0, 0]; // player, damage, weapon
    pvpMode = false;
    inPhotoMode = false;

    constructor(socket, bundleId, bundleIdInteger = null) {
        super();
        this.socket = socket;
        this.bundleId = bundleId;
        this.bundleIdInteger = bundleIdInteger || (bundleId === "trr-123" ? 0 : 1);
        this.manifest = gameManifests.games.find(manifest => manifest.id === bundleId);
    }

    getPatchById(id) {
        return this.manifest?.patches?.[id];
    }

    getPatchByHash(hash) {
        return Object.values(this.manifest.patches || {}).find((patch) => patch.patch === hash);
    }

    getPatches() {
        return this.manifest?.patches;
    }

    get gameScriptModule() {
        // IMPLEMENTED BY GAME CLIENT
        return null;
    }

    async isLevelChanging() {
        // IMPLEMENTED BY GAME CLIENT
        return false;
    }

    sendToServer (message) {
        this.socket.send(message, (err) => {
            if (err) {
                this.socket?.close();
                this.socket = dgram.createSocket('udp4');
            }
        });
    }

    async setupSession(manualPatch = null, customExePath = null) {
        const target = customExePath ? path.basename(customExePath) : this.manifest.executable;
        this.session = await frida.attach(target);

        const hashScript = await this.session.createScript(`
            rpc.exports = {
              getExePath: function() {
                const modules = Process.enumerateModules();
                if (modules.length > 0) {
                  return modules[0].path;
                }
                return null;
              }
            };
        `);
        await hashScript.load();

        this.processPath = await hashScript.exports.getExePath();
        console.log('game path is ', this.processPath);

        const patchHash = crypto.createHash('sha256').update(fs.readFileSync(this.processPath)).digest('hex');
        this.processHash = patchHash;
        console.log('game version is ', patchHash);

        let supported = this.getPatchByHash(patchHash);
        if (!supported) {
            if (manualPatch) {
                supported = this.getPatchById(manualPatch);
            }
        }

        this.memoryAddresses = supported?.memory || null;

        await hashScript.unload();

        return supported;
    }

    resetSession() {
        this.session = null;
        this.processPath = null;
        this.processHash = null;
        this.memoryAddresses = null;
    }

    async setupGameScript(launcherOptions) {
        if (!!this.gameScript) return;
        const manifest = (({patches, ...o}) => o)(this.manifest);

        const supportedFeatures = featureManifests.features
            .filter(f => f.supportedGames.includes(manifest.id))
            .map(f => ({
                id: f.id,
                game: require(`./features/${f.id}/game`)
            }));

        const featureTemplates = supportedFeatures
            .map(f => f.game.template || '')
            .join('\n');

        const featureSupport = supportedFeatures.map(f => ({
            id: f.id,
            game: {
                hooks: f.game.hooks || {},
                loops: f.game.loops || [],
                cleanup: f.game.cleanup || null
            }
        }));

        try {
            this.gameScript = await this.gameScriptModule(
                this.session,
                manifest,
                launcherOptions,
                this.memoryAddresses,
                featureSupport,
                featureTemplates
            );

            await this.gameScript.load();
        } catch (err) {
            console.error('Error loading game script:', err);
            this.gameScript = null;
        }
    }

    get gameFunctions() {
        return this.gameScript.exports;
    }

    async setupGame() {
        await this.gameFunctions.setupGame();
    }

    async launchGame(launchOptions) {
        this.launchOptions = launchOptions;

        await this.gameFunctions.setLara(false);

        this.gameScript.message.connect(async event => {
            if (event.type === 'send') {
                if (this.launchOptions.multiplayer) {
                    await this.handleMultiplayerEvent(event);
                }
            } else if (event.type === 'error') {
                if (!this.exiting) console.error('Error from game script:', event);
            }
        });

        if (this.launchOptions.multiplayer) {
            await this.launchMultiplayer();
        }
    }

    async updateGame(launchOptions) {
        await this.gameFunctions.setLara(false);

        await this.gameFunctions.updateLaunchOptions(launchOptions);

        if (launchOptions.multiplayer && this.connectedId) {
            ui.sendLauncherMessage("serverConnected", this.connectedId);
        }
    }

    async launchMultiplayer() {
        this.socket.on('error', async (msg) => console.error('Error from TRR Multiplayer.', msg));

        this.socket.on('message', async (msg) => {
            if (this.exiting || !msg) return;
            try {
                await this.handleMultiplayerNetwork(msg);
            } catch (err) {
                if (!this.exiting) console.error('Failed to parse incoming message from server.', err, err.stack);
            }
        });

        this.socket.on('connect', async () => {
            await this.frameLoop(false, true);
        });

        const serverIp = this.launchOptions.customServer && this.launchOptions.serverIp
            ? this.launchOptions.serverIp
            : config.client.server;
        const serverPort = this.launchOptions.customServer && this.launchOptions.serverPort
            ? parseInt(this.launchOptions.serverPort)
            : config.client.port;

        console.log(`Connecting to ${serverIp}:${serverPort}${this.launchOptions.customServer ? ' (custom)' : ' (community)'}`);

        this.socket.connect(serverPort, serverIp);
    }

    async handleMultiplayerNetwork(msg) {
        msg = await netcode.decompress(msg);

        const _v = msg.readInt32BE(1);

        const checkMajor = () => _v === config.client.major;

        const checkKeys = () => {
            const _t = Number(msg.readBigInt64BE(5));
            return checkMajor() && _t && !isNaN(Number(_t));
        };

        const packetType = msg.readUInt8(0);

        switch (packetType) {
            case netcode.PACKET_TYPE_CONNECTION:
                if (!checkMajor()) return;
                const idLength = msg.readUInt16BE(5);
                const connectedId = msg.slice(7, 7 + idLength).toString('utf-8');
                const level = msg.readInt16BE(7 + idLength);

                if (!connectedId?.length) return;
                console.log('Connected to server. Player Id', connectedId);

                ui.sendLauncherMessage("serverConnected", connectedId);

                const reconnected = !!this.connectedId;
                this.connectedId = connectedId;
                if (!this.launchOptions.name) {
                    this.launchOptions.name = this.connectedId;
                    await this.gameFunctions.updateLaunchOptions(this.launchOptions);
                }

                const character = await this.gameFunctions.setLara(false);
                if (this.bundleId === "trr-123" && await this.gameFunctions.isLevelMenu(level)) {
                    await this.gameFunctions.setupMenuText();
                } else if (!!character) {
                    await this.gameFunctions.cleanupLaraSlots();
                }

                if (!reconnected) {
                    this.frameLoop().then(r => {});
                    this.updateLoop().then(r => {});
                    this.tickLoop().then(r => {});
                }
                break;

            case netcode.PACKET_TYPE_OUTDATED:
                this.emit("outdated");
                break;

            case netcode.PACKET_TYPE_HIGHFREQ:
                if (!checkKeys()) return;
                const playerData = netcode.decodeHighFreq(msg);
                try {
                    if (await this.gameFunctions.isInGame()) {
                        await this.gameFunctions.receivePlayerData(
                            playerData.id,
                            netcode.convertBuffersToHexStrings(playerData)
                        );
                    }
                } catch (err) {
                    if (!this.exiting) console.error('Error in playerdata gamescript: ', err);
                }
                break;

            case netcode.PACKET_TYPE_SOUND:
                if (!checkKeys()) return;
                const soundEvent = netcode.decodeSound(msg);
                try {
                    if (await this.gameFunctions.isInGame()) {
                        await this.gameFunctions.receiveAudio(
                            soundEvent.sound,
                            soundEvent.soundFactor,
                            soundEvent.id
                        );
                    }
                } catch (err) {
                    if (!this.exiting) console.error('Error in receiveAudio gamescript: ', err);
                }
                break;

            case netcode.PACKET_TYPE_PVP:
                if (!checkKeys()) return;
                const pvpEvent = netcode.decodePVP(msg);
                try {
                    if (await this.gameFunctions.isInGame()) {
                        if (this.connectedId === pvpEvent.pvpPlayer) {
                            await this.gameFunctions.receivePVP(
                                pvpEvent.id,
                                pvpEvent.pvpDamage,
                                pvpEvent.pvpWeapon
                            );
                        }
                    }
                } catch (err) {
                    if (!this.exiting) console.error('Error in receivePVP gamescript: ', err);
                }
                break;

            case netcode.PACKET_TYPE_CHAT:
                if (!checkKeys()) return;
                const chatEvent = netcode.decodeChat(msg);
                try {
                    if (await this.gameFunctions.isInGame()) {
                        await this.gameFunctions.receiveChat(
                            chatEvent.name,
                            Date.now(),
                            chatEvent.text,
                            chatEvent.chatAction
                        );
                    }
                } catch (err) {
                    if (!this.exiting) console.error('Error in chat gamescript: ', err);
                }
                break;

            case netcode.PACKET_TYPE_GLOBAL:
                if (!checkMajor()) return;
                const globalData = netcode.decodeGlobal(msg);
                try {
                    if (await this.gameFunctions.isInMenu()) {
                        globalData.sort((a, b) => {
                            if (a.lvl === 0) return -1;
                            if (b.lvl === 0) return 1;
                            return a.lvl - b.lvl;
                        });
                        await this.gameFunctions.setupMenuPlayersText(globalData);
                    }
                } catch (err) {
                    if (!this.exiting) console.error('Error in globalplayers gamescript: ', err);
                }
                break;

            default:
                console.error(`Unknown: ${packetType}`);
        }
    }

    async handleMultiplayerEvent(message) {
        const gameVersion = await this.gameFunctions.readMemoryVariable("GameVersion", this.manifest.executable);
        const levelId = await this.gameFunctions.readMemoryVariable("Level", this.manifest.executable);

        switch (message.payload?.event) {
            case "sendSound":
                this.sendToServer(
                    await netcode.compress(netcode.encodeSound({
                        _v: config.client.major,
                        _t: Date.now(),
                        id: this.connectedId,
                        name: this.launchOptions.name,
                        lobby: this.launchOptions.lobbyCode,
                        version: gameVersion,
                        bundleId: this.bundleIdInteger,
                        level: levelId,
                        sound: parseInt(message.payload.args.sound, 16),
                        soundFactor: parseInt(message.payload.args.soundFactor, 16),
                    }))
                );
                break;

            case "playerNamesMode":
                this.launchOptions.playerNamesMode = parseInt(message.payload.args.mode);
                if (isNaN(this.launchOptions.playerNamesMode)) {
                    this.launchOptions.playerNamesMode = 1;
                }

                userdata.writeOptions(this.launchOptions);
                ui.sendLauncherMessage("launcherOptions", this.launchOptions);
                break;

            case "sendChat":
                this.sendToServer(
                    await netcode.compress(netcode.encodeChat({
                        _v: config.client.major,
                        _t: Date.now(),
                        id: this.connectedId,
                        name: this.launchOptions.name,
                        lobby: this.launchOptions.lobbyCode,
                        version: gameVersion,
                        bundleId: this.bundleIdInteger,
                        level: levelId,
                        text: String(message.payload.args.text),
                        chatAction: !!message.payload.args.chatAction,
                    }))
                );
                break;

            case "sendDmg":
                if (message.payload.args.dealPlayer !== this.pvpDamage[0]) {
                    this.pvpDamage[1] = parseInt(message.payload.args.dealDmg);
                } else {
                    this.pvpDamage[1] += parseInt(message.payload.args.dealDmg);
                }
                this.pvpDamage[0] = message.payload.args.dealPlayer;
                this.pvpDamage[2] = parseInt(message.payload.args.dealWpn);
                break;

            case "sendPVPMode":
                this.pvpMode = message.payload.args.pvpMode;
                break;
        }
    }

    async updateLoop(loop = true, force = false) {
        if (this.exiting) return;

        const gameVersion = await this.gameFunctions.readMemoryVariable("GameVersion", this.manifest.executable);
        const levelId = await this.gameFunctions.readMemoryVariable("Level", this.manifest.executable);

        if (force || await this.gameFunctions.isInGame()) {
            try {
                await this.gameFunctions.updateLoop();
            } catch (err) {
                if (!this.exiting) console.error('Error in updateLoop gamescript: ', err);
            }
        } else if (await this.gameFunctions.isInMenu()) {
            this.sendToServer(
                await netcode.compress(netcode.encodeGlobalReq({
                    _v: config.client.major,
                    _t: Date.now(),
                    id: this.connectedId,
                    name: this.launchOptions.name,
                    lobby: this.launchOptions.lobbyCode,
                    version: gameVersion,
                    bundleId: this.bundleIdInteger,
                    level: levelId,
                }))
            );
        }

        loop && setTimeout(() => this.updateLoop(), 1000);
    }

    async frameLoop(loop = true, force = false) {
        if (this.exiting) return;

        const inGame = await this.gameFunctions.isInGame();

        if (force || inGame) {
            const module = await this.gameFunctions.getGameModule();
            const gameVersion = await this.gameFunctions.readMemoryVariable("GameVersion", this.manifest.executable);
            const levelId = await this.gameFunctions.readMemoryVariable("Level", this.manifest.executable);

            let vehicleId, vehicleBones;
            if ((this.bundleId === "trr-123" && gameVersion < 1) || (this.bundleId === "trr-45" && gameVersion === 1)) {
                // TR1 & TR5 no vehicles
                vehicleBones = undefined;
                vehicleId = -1;
            } else {
                const vehicle = inGame && await this.gameFunctions.getVehicleBonesBackup();
                if (vehicle) {
                    vehicleBones = vehicle[1] || undefined;
                    vehicleId = isNaN(vehicle[0]) ? -1 : vehicle[0];
                } else {
                    vehicleBones = undefined;
                    vehicleId = -1;
                }
            }

            const laraBones = await this.gameFunctions.getLaraBonesBackup();
            const laraGunTypes = await this.gameFunctions.getGunTypesBackup();
            const laraPositions = await this.gameFunctions.getLaraPositionsBackup();
            const laraBasic = await this.gameFunctions.getLaraBasicDataBackup();
            const laraShadows = await this.gameFunctions.getLaraCircleShadowBackup();
            const laraRoom = await this.gameFunctions.getLaraRoomIdBackup();
            const laraAppearance = await this.gameFunctions.getAppearanceBackup();
            const roomType = await this.gameFunctions.readMemoryVariable("RoomType", module);

            this.sendToServer(
                await netcode.compress(netcode.encodeHighFreq({
                    _v: config.client.major,
                    _t: Date.now(),
                    id: this.connectedId,
                    name: this.launchOptions.name,
                    lobby: this.launchOptions.lobbyCode,
                    version: gameVersion,
                    bundleId: this.bundleIdInteger,
                    level: levelId,
                    bones: laraBones,
                    gunTypes: laraGunTypes,
                    gunFire1: this.lastFiringLeft,
                    gunFire2: this.lastFiringRight,
                    flareFire: this.lastFiringFlare,
                    vehicleId,
                    vehicleBones,
                    positions: laraPositions,
                    basicData: laraBasic,
                    shadows: laraShadows,
                    room: laraRoom,
                    appearance: laraAppearance,
                    roomType,
                    pvpMode: this.pvpMode,
                }))
            );
        }

        loop && setTimeout(() => this.frameLoop(), 33);
    }

    async tickLoop(loop = true, force = false) {
        if (this.exiting) return;

        if (force || await this.gameFunctions.isInGame()) {
            const gameVersion = await this.gameFunctions.readMemoryVariable("GameVersion", this.manifest.executable);
            const levelId = await this.gameFunctions.readMemoryVariable("Level", this.manifest.executable);

            try {
                const time = Date.now();
                const laraGunFlags = await this.gameFunctions.getGunFlagsBackup();

                if (Array.isArray(laraGunFlags)) {
                    if (laraGunFlags[0]) this.lastFiredLeft = time;
                    this.lastFiringLeft = (time - this.lastFiredLeft) < 100 ? laraGunFlags[0] : 0;
                    if (laraGunFlags[1]) this.lastFiredRight = time;
                    this.lastFiringRight = (time - this.lastFiredRight) < 100 ? laraGunFlags[1] : 0;
                } else {
                    // noinspection JSBitwiseOperatorUsage
                    if (laraGunFlags & 4) this.lastFiredLeft = time;
                    this.lastFiringLeft = (time - this.lastFiredLeft) < 100 ? 1 : 0;
                    // noinspection JSBitwiseOperatorUsage
                    if (laraGunFlags & 8) this.lastFiredRight = time;
                    this.lastFiringRight = (time - this.lastFiredRight) < 100 ? 1 : 0;
                    // noinspection JSBitwiseOperatorUsage
                    if (laraGunFlags & 0x10) this.lastFiredFlare = time;
                    this.lastFiringFlare = (time - this.lastFiredFlare) < 100 ? 1 : 0;
                }

                const photomode = await this.gameFunctions.readMemoryVariable("IsPhotoMode", this.manifest.executable);
                if (!this.inPhotoMode && photomode === 1) {
                    this.inPhotoMode = true;
                    await this.gameFunctions.enterPhotoMode();
                } else if (this.inPhotoMode && photomode !== 1) {
                    this.inPhotoMode = false;
                    await this.gameFunctions.exitPhotoMode();
                }

                if (await this.isLevelChanging()) {
                    await this.gameFunctions.closeChat();
                }

                if (this.pvpMode && this.pvpDamage[0] && this.pvpDamage[1]) {
                    this.sendToServer(
                        await netcode.compress(netcode.encodePVP({
                            _v: config.client.major,
                            _t: Date.now(),
                            id: this.connectedId,
                            name: this.launchOptions.name,
                            lobby: this.launchOptions.lobbyCode,
                            version: gameVersion,
                            bundleId: this.bundleIdInteger,
                            level: levelId,
                            pvpPlayer: String(this.pvpDamage[0]),
                            pvpDamage: parseInt(this.pvpDamage[1]),
                            pvpWeapon: parseInt(this.pvpDamage[2]),
                        }))
                    );

                    this.pvpDamage[0] = null;
                    this.pvpDamage[1] = 0;
                    this.pvpDamage[2] = 0;
                }
            } catch (err) {
                if (!this.exiting) console.error("Error in tickLoop gamescript: ", err);
            }
        }

        loop && setTimeout(() => this.tickLoop(), 10);
    }

    async cleanup() {
        if (this.gameScript && !this.gameScript.isDestroyed) {
            try {
                await this.gameFunctions?.cleanup();
                await this.gameScript?.unload();
            } catch (err) {
                console.error(`Error unloading ${this.bundleId} game script:`, err);
            }
        }

        if (this.session) {
            try {
                this.session.detach();
                await this.delay(1000);
                this.session = null;
                this.processPath = null;
                this.processHash = null;
            } catch (err) {
                console.error(`Error detaching ${this.bundleId} session:`, err);
            }
        }
    }

    async delay(t) {
        return await new Promise(resolve => setTimeout(resolve, t));
    }
}

module.exports = BaseGameClient;
