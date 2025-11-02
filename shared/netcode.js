const zstdCodec = require('zstd-codec').ZstdCodec;
let zStdInst = null;

const PACKET_TYPE_HIGHFREQ = 0x01;
const PACKET_TYPE_LOWFREQ = 0x05;
const PACKET_TYPE_SOUND = 0x02;
const PACKET_TYPE_GLOBAL = 0x04;
const PACKET_TYPE_GLOBAL_REQ = 0x07;
const PACKET_TYPE_OUTDATED = 0x06;
const PACKET_TYPE_CONNECTION = 0x08;
const PACKET_TYPE_CHAT = 0x09;
const PACKET_TYPE_PVP = 0x0a;
const PACKET_TYPE_KEEPALIVE = 0x0b;

module.exports = {
    PACKET_TYPE_HIGHFREQ,
    PACKET_TYPE_LOWFREQ,
    PACKET_TYPE_SOUND,
    PACKET_TYPE_GLOBAL,
    PACKET_TYPE_GLOBAL_REQ,
    PACKET_TYPE_OUTDATED,
    PACKET_TYPE_CONNECTION,
    PACKET_TYPE_CHAT,
    PACKET_TYPE_PVP,
    PACKET_TYPE_KEEPALIVE,

    zStd: async () => {
        if (zStdInst) return zStdInst;
        return new Promise((resolve) => {
            zstdCodec.run((inst) => {
                zStdInst = inst;
                resolve(zStdInst);
            });
        });
    },

    compress: async (rawData) => {
        const inst = await module.exports.zStd();
        return (new inst.Simple()).compress(rawData, 3);
    },

    decompress: async (compressed) => {
        const inst = await module.exports.zStd();
        return Buffer.from(
            (new inst.Simple()).decompress(compressed)
        );
    },

    encodeGeneric: (playerState, packetType) => {
        const idBuffer = Buffer.from(playerState.id || "_", 'utf-8');
        const idLength = idBuffer.length;
        const nameBuffer = Buffer.from(playerState.name || "Unknown Name", 'utf-8');
        const nameLength = nameBuffer.length;
        const lobbyBuffer = Buffer.from(playerState.lobby || "_", 'utf-8');
        const lobbyLength = lobbyBuffer.length;
    
        const buffer = Buffer.alloc(23 + idLength + nameLength + lobbyLength);
        let bufferX = 0;
        buffer.writeUInt8(packetType, 0);
        buffer.writeInt32BE(playerState._v, 1);
        buffer.writeBigInt64BE(BigInt(playerState._t), 5);
        buffer.writeUInt16BE(idLength, 13);
        idBuffer.copy(buffer, 15);
        bufferX = 15 + idLength;
        buffer.writeUInt16BE(nameLength, bufferX);
        nameBuffer.copy(buffer, bufferX + 2);
        bufferX = bufferX + 2 + nameLength;
        buffer.writeUInt16BE(lobbyLength, bufferX);
        lobbyBuffer.copy(buffer, bufferX + 2);
        bufferX = bufferX + 2 + lobbyLength;
        buffer.writeInt8(isNaN(playerState.version) ? -1 : playerState.version, bufferX);
        buffer.writeInt16BE(isNaN(playerState.level) ? -1 : playerState.level, bufferX + 1);
        bufferX = bufferX + 3;
        buffer.writeInt8(Number(playerState.bundleId), bufferX);
        bufferX += 1;
    
        return buffer;
    },

    decodeGeneric: (buffer) => {
        const modVersion = Number(buffer.readInt32BE(1));
        const time = Number(buffer.readBigInt64BE(5));

        let bufferX = 13;
        const idLength = buffer.readUInt16BE(bufferX);
        const id = buffer.slice(bufferX + 2, bufferX + 2 + idLength).toString('utf-8');
        bufferX = bufferX + 2 + idLength;

        const nameLength = buffer.readUInt16BE(bufferX);
        const name = buffer.slice(bufferX + 2, bufferX + 2 + nameLength)
                            .toString('utf-8')
                            .substring(0, 20);
        bufferX = bufferX + 2 + nameLength;

        const lobbyLength = buffer.readUInt16BE(bufferX);
        const lobby = buffer.slice(bufferX + 2, bufferX + 2 + lobbyLength).toString('utf-8');
        bufferX = bufferX + 2 + lobbyLength;

        const version = buffer.readInt8(bufferX);
        const level = buffer.readInt16BE(bufferX + 1);
        bufferX = bufferX + 3;

        const bundleId = buffer.readInt8(bufferX);
        bufferX += 1;
        
        return {
            data: { 
                _v: modVersion,
                _t: time,
                id,
                name,
                lobby,
                version,
                level,
                bundleId,
            },
            size: bufferX,
        };
    },

    encodeHighFreq: (playerState) => {
        const genericBuffer = module.exports.encodeGeneric(playerState, PACKET_TYPE_HIGHFREQ);
        const bonesBuffer = playerState.bones ? Buffer.from(playerState.bones) : null;
        const bonesBufferLength = bonesBuffer?.length || 0;
        const bonesVehicleBuffer = playerState.vehicleBones ? Buffer.from(playerState.vehicleBones) : null;
        const bonesVehicleBufferLength = bonesVehicleBuffer?.length || 0;
        const positionsBuffer = playerState.positions ? Buffer.from(playerState.positions) : null;
        const positionsBufferLength = positionsBuffer?.length || 0;
        const basicDataBuffer = playerState.basicData ? Buffer.from(playerState.basicData) : null;
        const basicDataBufferLength = basicDataBuffer?.length || 0;
        const shadowsBuffer = playerState.shadows ? Buffer.from(playerState.shadows) : null;
        const shadowsBufferLength = shadowsBuffer?.length || 0;
        const appearanceBuffer = playerState.appearance ? Buffer.from(playerState.appearance) : null;
        const appearanceBufferLength = appearanceBuffer?.length || 0;
        const buffer = Buffer.alloc(26 + genericBuffer.length + appearanceBufferLength + bonesBufferLength + bonesVehicleBufferLength + positionsBufferLength + basicDataBufferLength + shadowsBufferLength);
        genericBuffer.copy(buffer, 0);

        let bufferX = genericBuffer.length;
        buffer.writeUInt16BE(bonesBufferLength, bufferX);
        if (bonesBufferLength > 0) {
            bonesBuffer.copy(buffer, bufferX + 2);
        }
        bufferX = bufferX + 2 + bonesBufferLength;

        buffer.writeUInt32BE(playerState.gunTypes, bufferX);
        bufferX += 4;
        
        buffer.writeInt8(playerState.gunFire1, bufferX);
        buffer.writeInt8(playerState.gunFire2, bufferX + 1);
        buffer.writeInt8(playerState.flareFire, bufferX + 2);
        bufferX += 3;

        buffer.writeInt16BE(isNaN(playerState.vehicleId) ? -1 : playerState.vehicleId, bufferX);
        bufferX += 2;

        buffer.writeUInt16BE(bonesVehicleBufferLength, bufferX);
        if (bonesVehicleBufferLength > 0) {
            bonesVehicleBuffer.copy(buffer, bufferX + 2);
        }
        bufferX = bufferX + 2 + bonesVehicleBufferLength;

        buffer.writeUInt16BE(positionsBufferLength, bufferX);
        if (positionsBufferLength > 0) {
            positionsBuffer.copy(buffer, bufferX + 2);
        }
        bufferX = bufferX + 2 + positionsBufferLength;

        buffer.writeUInt16BE(basicDataBufferLength, bufferX);
        if (basicDataBufferLength > 0) {
            basicDataBuffer.copy(buffer, bufferX + 2);
        }
        bufferX = bufferX + 2 + basicDataBufferLength;
        
        buffer.writeUInt16BE(shadowsBufferLength, bufferX);
        if (shadowsBufferLength > 0) {
            shadowsBuffer.copy(buffer, bufferX + 2);
        }
        bufferX = bufferX + 2 + shadowsBufferLength;

        buffer.writeInt16BE(isNaN(playerState.room) ? -1 : playerState.room, bufferX);
        bufferX = bufferX + 2;

        buffer.writeUInt16BE(appearanceBufferLength, bufferX);
        if (appearanceBufferLength > 0) {
            appearanceBuffer.copy(buffer, bufferX + 2);
        }
        bufferX = bufferX + 2 + appearanceBufferLength;

        buffer.writeInt16BE(isNaN(playerState.roomType) ? 0 : playerState.roomType, bufferX);
        bufferX += 2;

        buffer.writeInt8(playerState.pvpMode ? 1 : 0, bufferX);
        bufferX += 1;

        return buffer;
    },

    decodeHighFreq: (buffer) => {
        const generic = module.exports.decodeGeneric(buffer);
        let bufferX = generic.size;

        const bonesLength = buffer.readUInt16BE(bufferX);
        let bones;
        if (bonesLength > 0) {
            bones = buffer.slice(bufferX + 2, bufferX + 2 + bonesLength);
        } else {
            bones = null;
        }
        bufferX = bufferX + 2 + bonesLength;

        const gunTypes = buffer.readUInt32BE(bufferX);
        bufferX += 4;
        const gunFire1 = buffer.readInt8(bufferX);
        const gunFire2 = buffer.readInt8(bufferX + 1);
        const flareFire = buffer.readInt8(bufferX + 2);
        bufferX += 3;

        const vehicleId = buffer.readInt16BE(bufferX);
        bufferX += 2;

        const vehicleBonesLength = buffer.readUInt16BE(bufferX);
        let vehicleBones;
        if (vehicleBonesLength > 0) {
            vehicleBones = buffer.slice(bufferX + 2, bufferX + 2 + vehicleBonesLength);
        } else {
            vehicleBones = null;
        }
        bufferX = bufferX + 2 + vehicleBonesLength;

        const positionsLength = buffer.readUInt16BE(bufferX);
        let positions;
        if (positionsLength > 0) {
            positions = buffer.slice(bufferX + 2, bufferX + 2 + positionsLength);
        } else {
            positions = null;
        }
        bufferX = bufferX + 2 + positionsLength;
        
        const basicDataLength = buffer.readUInt16BE(bufferX);
        let basicData;
        if (basicDataLength > 0) {
            basicData = buffer.slice(bufferX + 2, bufferX + 2 + basicDataLength);
        } else {
            basicData = null;
        }
        bufferX = bufferX + 2 + basicDataLength;

        const shadowsLength = buffer.readUInt16BE(bufferX);
        let shadows;
        if (shadowsLength > 0) {
            shadows = buffer.slice(bufferX + 2, bufferX + 2 + shadowsLength);
        } else {
            shadows = null;
        }
        bufferX = bufferX + 2 + shadowsLength;

        const room = buffer.readInt16BE(bufferX);
        bufferX = bufferX + 2;

        const appearanceLength = buffer.readUInt16BE(bufferX);
        let appearance;
        if (appearanceLength > 0) {
            appearance = buffer.slice(bufferX + 2, bufferX + 2 + appearanceLength)
        } else {
            appearance = null;
        }
        bufferX = bufferX + 2 + appearanceLength;

        const roomType = buffer.readInt16BE(bufferX);
        bufferX = bufferX + 2;

        let pvpMode = !!buffer.readInt8(bufferX);
        bufferX = bufferX + 1;
        
        return { 
            ...generic.data,
            bones,
            gunTypes,
            gunFire1,
            gunFire2,
            flareFire,
            vehicleId,
            vehicleBones,
            positions,
            basicData,
            shadows,
            room,
            appearance,
            roomType,
            pvpMode,
        };
    },

    encodeChat: (chatState) => {
        const textBuffer = Buffer.from(chatState.text?.substring(0, 50) || "", 'utf-8');
        const textLength = textBuffer.length;

        const genericBuffer = module.exports.encodeGeneric(chatState, PACKET_TYPE_CHAT);
        const buffer = Buffer.alloc(genericBuffer.length + textLength + 3);
        genericBuffer.copy(buffer, 0);

        let bufferX = genericBuffer.length;

        buffer.writeUInt16BE(textLength, bufferX);
        textBuffer.copy(buffer, bufferX + 2);
        bufferX += 2 + textLength;
    
        buffer.writeUInt8(chatState.chatAction ? 1 : 0, bufferX);
        bufferX += 1;
    
        return buffer;
    },

    decodeChat: (buffer) => {
        const generic = module.exports.decodeGeneric(buffer);

        let bufferX = generic.size;

        const textLength = buffer.readUInt16BE(bufferX);
        const text = buffer.slice(bufferX + 2, bufferX + 2 + textLength)
                            .toString('utf-8')
                            .substring(0, 50);
        bufferX += 2 + textLength;
        
        let chatAction = false;
        try {
            chatAction = buffer.readInt8(bufferX);
            bufferX = bufferX + 1;
        } catch (err) {}

        return {
            ...generic.data,
            text,
            chatAction,
        };
    },

    encodePVP: (pvpState) => {
        const pvpPlayerIdBuffer = Buffer.from(pvpState.pvpPlayer, 'utf-8');
        const pvpPlayerIdLength = pvpPlayerIdBuffer.length;

        const genericBuffer = module.exports.encodeGeneric(pvpState, PACKET_TYPE_PVP);
        const buffer = Buffer.alloc(genericBuffer.length + pvpPlayerIdLength + 6);
        genericBuffer.copy(buffer, 0);

        let bufferX = genericBuffer.length;

        buffer.writeUInt16BE(pvpPlayerIdLength, bufferX);
        pvpPlayerIdBuffer.copy(buffer, bufferX + 2);
        bufferX += 2 + pvpPlayerIdLength;

        buffer.writeInt16BE(isNaN(pvpState.pvpDamage) ? 0 : pvpState.pvpDamage, bufferX);
        bufferX += 2;

        buffer.writeInt16BE(isNaN(pvpState.pvpWeapon) ? 0 : pvpState.pvpWeapon, bufferX);
    
        return buffer;
    },

    decodePVP: (buffer) => {
        const generic = module.exports.decodeGeneric(buffer);

        let bufferX = generic.size;

        const pvpPlayerIdLength = buffer.readUInt16BE(bufferX);
        const pvpPlayer = buffer.slice(bufferX + 2, bufferX + 2 + pvpPlayerIdLength).toString('utf-8');
        
        bufferX += 2 + pvpPlayerIdLength;

        const pvpDamage = buffer.readInt16BE(bufferX);
        const pvpWeapon = buffer.readInt16BE(bufferX + 2);

        return {
            ...generic.data,
            pvpPlayer,
            pvpDamage,
            pvpWeapon,
        };
    },

    encodeSound: (soundState) => {
        const genericBuffer = module.exports.encodeGeneric(soundState, PACKET_TYPE_SOUND);
        const buffer = Buffer.alloc(genericBuffer.length + 8);
        genericBuffer.copy(buffer, 0);

        let bufferX = genericBuffer.length;
        buffer.writeInt32BE(isNaN(soundState.sound) ? -1 : soundState.sound, bufferX);
        buffer.writeInt32BE(isNaN(soundState.soundFactor) ? 0x0 : soundState.soundFactor, bufferX + 4);
    
        return buffer;
    },
    
    decodeSound: (buffer) => {
        const generic = module.exports.decodeGeneric(buffer);

        let bufferX = generic.size;

        const sound = buffer.readInt32BE(bufferX);
        const soundFactor = buffer.readInt32BE(bufferX + 4);
        
        return { 
            ...generic.data,
            sound,
            soundFactor,
        };
    },
    
    encodeGlobalReq: (globalReqState) => {
        return module.exports.encodeGeneric(globalReqState, PACKET_TYPE_GLOBAL_REQ);
    },

    decodeGlobalReq: (buffer) => {
        return module.exports.decodeGeneric(buffer).data;
    },

    encodeKeepalive: (_v, _t) => {
        const buffer = Buffer.alloc(13);
        buffer.writeUInt8(PACKET_TYPE_KEEPALIVE, 0);
        buffer.writeInt32BE(_v, 1);
        buffer.writeBigInt64BE(BigInt(_t), 5);
        return buffer;
    },

    encodeGlobal: (globalState) => {
        const buffer = Buffer.alloc(6 + (globalState.list.length * 4));

        buffer.writeUInt8(PACKET_TYPE_GLOBAL, 0);
        buffer.writeInt32BE(globalState.major, 1);
        buffer.writeUInt8(globalState.list.length, 5);

        let bufferX = 6;
        for (let level of globalState.list) {
            buffer.writeInt16BE(parseInt(level.lvl), bufferX);
            buffer.writeInt16BE(parseInt(level.players), bufferX + 2);
            bufferX += 4;
        }
    
        return buffer;
    },

    decodeGlobal: (buffer) => {
        const globalSize = buffer.readUInt8(5);
        const global = [];

        let bufferX = 6;
        if (globalSize > 0) {
            for (let i = 0; i < globalSize; i++) {
                global.push({ 
                    lvl: buffer.readInt16BE(bufferX),
                    players: buffer.readInt16BE(bufferX + 2),
                });
                bufferX += 4;
            }
        }

        return global;
    },

    convertBuffersToHexStrings: (buffers) => {
        const hex = buffers;
        for (let _st in buffers) {
            if (Buffer.isBuffer(buffers[_st])) {
                hex[_st] = buffers[_st].toString('hex');
            }
        }
        return hex;
    },
};
