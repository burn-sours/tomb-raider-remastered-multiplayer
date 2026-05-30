const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const gameCore = require("../game-core").template;

const getMapsDir = () => path.join(app.getPath('userData'), 'maps', 'trr-6');

const scanModdedLevels = () => {
    const dir = getMapsDir();
    const result = {};
    try {
        if (fs.existsSync(dir)) {
            for (const f of fs.readdirSync(dir)) {
                if (f.toLowerCase().endsWith('.gmx')) {
                    result[f.toUpperCase()] = path.join(dir, f);
                }
            }
        }
    } catch (e) {
        console.warn('[TR6 MP] Failed to scan maps dir:', e.message);
    }
    return result;
};

module.exports = async (session, manifest, userData, memoryAddresses, supportedFeatures, gameFeaturesCore) => {
    const moddedLevels = scanModdedLevels();
    // language=JavaScript
    return await session.createScript(`
        let userData = ${JSON.stringify(userData)};
        const memoryAddresses = ${JSON.stringify(memoryAddresses)};
        const manifest = ${JSON.stringify(manifest)};
        const supportedFeatures = ${JSON.stringify(supportedFeatures)};
        const moddedLevels = ${JSON.stringify(moddedLevels)};

        const MAX_PLAYERS = 32;

        const ENTITY_SIZE = 0x1240;
        const FLAGS_SIZE = 0x2A0;
        const VIS_ARRAY_SIZE = 0x1E8;
        const SWAP_NODE_SIZE = 0x18;
        const BONE_MATRIX_STRIDE = 0x120;
        const BONE_MATRIX_SIZE = 0x40;
        const BONE_PARENT_OFFSET = 0xB0;
        const BONE_ENCODED_SIZE = 18;
        const ROT_SCALE = 16384;
        const POS_SCALE = 16;
        const MAX_BONE_COUNT = 128;
        const MAX_BONE_BUFFER = MAX_BONE_COUNT * BONE_ENCODED_SIZE;
        const ATTR_STATE_SIZE = 0x830;

        const ENTITY_CUE_HANDLE = 0x18;
        const ENTITY_MESH_DESC = 0x50;
        const ENTITY_FLAGS_PTR = 0x60;
        const ENTITY_BONE_MATRICES = 0x68;
        const ENTITY_ANIM_HASH_TABLE = 0x08;
        const ENTITY_SKELETON = 0x78;
        const ENTITY_VIS_ARRAY = 0x100;
        const ENTITY_NULL_130 = 0x130;
        const ENTITY_ATTR_PTR = 0x178;
        const ENTITY_RENDER_DATA = 0x1200;
        const RENDER_DATA_SIZE = 0x1000;
        const RENDER_DATA_ENTITY_BACKREF = 0x300;
        const ENTITY_LEGACY_SWAPS = 0x1208;
        const ENTITY_HD_SWAPS = 0x1210;

        const SCENE_POS = 0x40;
        const SCENE_POS_Z = 0x48;
        const SCENE_TYPE = 0x1E0;
        const SCENE_FLAGS = 0x1FC;
        const SCENE_ENTITY_PTR = 0x208;
        const SCENE_ANIM_ARCHIVE = 0x210;
        const DONOR_SCENE_SIZE = 0x300;
        const MESH_DESC_PART_COUNT = 0x04;
        const MAX_VALID_PTR = ptr("0x7fffffffffff");

        const SKEL_MESH_PART_COUNT = 0x6C;
        const SKEL_MESH_PART_ARRAY = 0x70;
        const SKEL_BONE_COUNT = 0x78;
        const SKEL_GROUP_ARRAY = 0x80;
        const SKEL_LEGACY_MESH = 0xE8;
        const SKEL_HD_MESH = 0xF0;
        const SKELETON_SIZE = 0xF8;
        const GAME_STATE_PLAYING = 1;
        const GAME_STATE_DIALOG = 3;
        const GAME_STATE_PAUSED = 8;
        const GAME_STATE_MAIN_MENU = 10;

        const ENTITY_ANIM_DB = 0x58;

        const ATTR_MODULAR_OUTFIT_BIT = 0x3C;

        const FLAGS_BACK_REF = 0x1F0;
        const FLAGS_NULL_08 = 0x8;
        const FLAGS_NULL_160 = 0x160;
        const FLAGS_NULL_198 = 0x198;
        const FLAGS_ANIM_STATE = 0x140;
        const ANIM_STATE_HASH = 0x7C;
        const FLAGS_POS_X = 0x200;
        const FLAGS_POS_Y = 0x204;
        const FLAGS_POS_Z = 0x208;
        const FLAGS_ROT_END = 0x21C;
        const FLAGS_VELOCITY = 0x260;

        const OUTFIT_LEGACY_MESH = 0x00;
        const OUTFIT_HD_MESH = 0x08;
        const OUTFIT_PART_ARRAY = 0x10;
        const OUTFIT_PART_COUNT = 0x20;
        const OUTFIT_ENTRY_SIZE = 0x30;

        const POSITION_BLOCK_OFFSET = FLAGS_POS_X;
        const POSITION_BLOCK_SIZE = FLAGS_ROT_END - FLAGS_POS_X;

        const LARA_TEX_HASH = 0x1b491;
        const KURTIS_TEX_HASH = 0x1ee96;

        let laraPointer = null;
        let laraSlots = [];
        let otherPlayers = [];
        let levelsInfo = [];
        let isRendering = false;
        let lastCapturedSFX = {};
        let isReplayingSound = false;
        let isReplayingVfx = false;
        
        let levelLastLoadedId = null;
        let multiplayerText = "Burn's Multiplayer v2.5";
        let modsText = "Burn's Mods v2.5";
        let playerNamesMode = isNaN(parseInt(userData.playerNamesMode)) ? 1 : parseInt(userData.playerNamesMode);

        const TEXT_BUFFER_SIZE = 256;
        const MENU_LIST_MAX_ROWS = 32;
        let topLeftLabelBuffer = null;
        let menuListBuffer = null;

        let modMenuState = {
            isOpen: false,
            selectedIndex: 0,
            activeSubmenu: null,
            submenuSelectedIndex: 0,
            submenuLastIndex: {},
            lastInteraction: 0
        };
        const MOD_MENU_TIMEOUT = 3000;
        const MOD_MENU_CONFIRM_TIMEOUT = 2000;
        const MOD_MENU_MAX_VISIBLE = 5;
        let modMenuConfirmMessage = null;
        let modMenuConfirmTime = 0;
        const CHAT_MAX_LEN = 50;
        const CHAT_HISTORY_MAX = 6;
        const CHAT_RECENT_MS = 60 * 1000;
        const CHAT_NAMED_MS = 900 * 1000;
        const PLAYER_LABEL_MAX_DIST = 6000;
        let chatHeaderBuffer = null;
        let chatInputBuffer = null;
        let chatHistoryBuffers = null;
        let chatSuppressKey = false;

        let modMenuLabelBuffer = null;
        let modMenuRowBuffers = null;
        let modMenuTitleBuffer = null;
        let modMenuConfirmBuffer = null;
        let donorLaraEntity = null;
        let donorKurtisEntity = null;
        let donorScene = null;
        let localCharacterType = 0;
        let levelLaraVariant = 0x16;

        let pendingSwapType = null;
        let primeReturnType = null;
        let preBuildIntendedType = null;
        let preferredCharSide = null;

        const backupsCache = {};
        const audioQueue = [];
        const vfxQueue = [];

        let laraEntity = null;
        let laraType = 0;
        let laraSlotIndex = -1;
        let laraSavedPos = null;

        let kurtisEntity = null;
        let kurtisType = 0x18;
        let kurtisSlotIndex = -1;
        let kurtisSavedPos = null;

        let laraSwapSkeleton = null;
        let kurtisSwapSkeleton = null;

        const CC_SLOT_SIZE = 0x40;
        const POSITION_BLOCK_BYTES = 0x20;
        const lastKeyPressTime = {};

        const MOD_MENU_ITEMS = [
            {
                id: "teleport",
                label: () => "Teleport to Player",
                hasSubmenu: true,
                getSubmenuItems: () => otherPlayers.map((p, i) => ({
                    id: "player_" + i,
                    label: p.name,
                    player: p
                })),
                onSubmenuConfirm: (submenuItem, module) => {
                    if (submenuItem && submenuItem.player) {
                        game.teleportToPlayer(submenuItem.player);
                        return "Teleported to " + submenuItem.label;
                    }
                },
                isDisabled: () => otherPlayers.length === 0
            },
            {
                id: "levelskip",
                label: () => "Skip Level",
                hasSubmenu: false,
                onConfirm: (module) => {
                    if (game.readMemoryVariable("GameState", "tomb6.dll") !== GAME_STATE_PLAYING) {
                        return "Can't skip levels during dialog";
                    }
                    const cur = (typeof currentLevel === 'number' ? currentLevel : 0);
                    const next = cur + 1;
                    game.writeMemoryVariable("PreviousLevel", cur, module);
                    game.writeMemoryVariable("Level", next, module);
                    game.writeMemoryVariable("PendingStateTransition", 6, module);
                    return "Loading: " + game.levelName(next);
                },
                isDisabled: () => false
            },
            {
                id: "levelselect",
                label: () => "Level Select",
                hasSubmenu: true,
                getSubmenuItems: () => {
                    const list = (game.supportedLevels[game.getGameModule()] || []).slice();
                    return list.map(lvl => ({ id: lvl, label: game.levelName(lvl) }));
                },
                onSubmenuConfirm: (submenuItem, module) => {
                    if (!submenuItem) return;
                    if (game.readMemoryVariable("GameState", "tomb6.dll") !== GAME_STATE_PLAYING) {
                        return "Can't skip levels during dialog";
                    }
                    game.writeMemoryVariable("PreviousLevel", submenuItem.id, module);
                    game.writeMemoryVariable("Level", submenuItem.id, module);
                    game.writeMemoryVariable("PendingStateTransition", 6, module);
                    return "Loading: " + submenuItem.label;
                },
                isDisabled: () => false
            },
            {
                id: "displaymode",
                label: () => {
                    const modes = ["Hidden", "Top Left", "Name & Health", "Name"];
                    return "Display: " + modes[playerNamesMode];
                },
                hasSubmenu: false,
                closeOnConfirm: false,
                onConfirm: (module) => {
                    playerNamesMode = (playerNamesMode + 1) % 4;
                    send({event: "multiplayer:playerNamesMode", args: {mode: playerNamesMode}});
                },
                isVisible: () => !!userData.multiplayer,
                isDisabled: () => false
            },
            {
                id: "character-swap",
                label: () => {
                    const localIsKurtis = game.detectLocalCharacterType() === 0x18;
                    return localIsKurtis ? "Play as Lara" : "Play as Kurtis";
                },
                hasSubmenu: false,
                onConfirm: (module) => {
                    const localIsKurtis = game.detectLocalCharacterType() === 0x18;
                    const newType = localIsKurtis ? (levelLaraVariant || 0x16) : 0x18;
                    pendingSwapType = newType;
                    return localIsKurtis ? "Swapping to Lara..." : "Swapping to Kurtis...";
                },
                isVisible: () => !!userData.multiplayer &&
                    Object.keys(moddedLevels).length > 0,
                isDisabled: () => false
            },
        ];
        
        globalThis.keepAlive = globalThis.keepAlive || [];

        let hooksExecution;
        let hooks = {};
        ${gameCore}
        ${gameFeaturesCore}

        chatMessages = [
            {time: Date.now(), name: null, text: "Welcome to Tomb Raider Multiplayer"},
            {time: Date.now(), name: null, text: "[F2] Menu, [F4] Confirm, [F8] Chat"}
        ];

        const SWAP_CONTROL_SIZE = 0x10;
        const SWAP_NODE_NEXT = 0x00;
        const SWAP_NODE_PREV = 0x08;
        const SWAP_NODE_DATA = 0x10;
        const SWAP_CONTROL_COUNT = 0x08;

        const game = {
            ...gameCoreFunctions,

            supportedLevels: {
                "tomb6.dll": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]
            },

            levelNames: {
                "tomb6.dll": {
                    0:  "Parisian Back Streets",
                    1:  "Derelict Apartment Block",
                    2:  "Margot Carvier's Apartment",
                    3:  "Industrial Rooftops",
                    4:  "Parisian Ghetto",
                    5:  "Parisian Ghetto 2",
                    6:  "Parisian Ghetto 3",
                    7:  "The Serpent Rouge",
                    8:  "Rennes' Pawnshop",
                    9:  "Willowtree Herbalist",
                    10: "St Aicard's Church",
                    11: "Cafe Metro",
                    12: "St Aicard's Graveyard",
                    13: "Bouchard's Hideout",
                    14: "Louvre Storm Drains",
                    15: "Louvre Galleries",
                    16: "Galleries Under Siege",
                    17: "Tomb of Ancients",
                    18: "The Archaeological Dig",
                    19: "Von Croy's Apartment",
                    20: "Monstrum Crimescene",
                    21: "The Strahov Fortress",
                    22: "Bio-Research Facility",
                    23: "Aquatic Research Area",
                    24: "The Sanitarium",
                    25: "Max Containment Area",
                    26: "Vault of Trophies",
                    27: "Boaz Returns",
                    28: "Eckhardt's Lab",
                    29: "The Lost Domain",
                    30: "Hall of Seasons",
                    31: "Neptune's Hall",
                    32: "Wrath of the Beast",
                    33: "Sanctuary of Flame",
                    34: "Breath of Hades"
                }
            },

            levelName: (level) => {
                return game.levelNames[game.getGameModule()][String(level)] || "Level " + level;
            },

            isLevelSupported: (level) => {
                return game.supportedLevels[game.getGameModule()]?.includes(parseInt(level)) || false;
            },

            isLevelMenu: (level) => {
                try { return game.readMemoryVariable("GameState", "tomb6.dll") === 10; }
                catch (e) { return false; }
            },

            isInGame: () => {
                if (game.isInMenu()) return false;
                const lara = game.getLara();
                return lara && !lara.isNull() && game.isLevelSupported(currentLevel);
            },

            isInMenu: () => game.isLevelMenu(currentLevel),

            getGameModule: () => "tomb6.dll",

            waitForGame: async () => {
                const invalidVer = () => game.readMemoryVariable("GameVersion", manifest.executable) !== 2;
                while (invalidVer() || game.readMemoryVariable("Level", "tomb6.dll") === null ||
                       game.readMemoryVariable("Level", "tomb6.dll") === -1 ||
                       game.readMemoryVariable("GameState", "tomb6.dll") !== 10) {
                    await game.delay(500);
                }
            },

            allocLaraBackups: () => {
                laraSwapSkeleton = game.allocMemory(SKELETON_SIZE);
                kurtisSwapSkeleton = game.allocMemory(SKELETON_SIZE);
            },

            _ptrLooksValid: (p) => {
                if (!p || p.isNull()) return false;

                const s = p.toString();
                if (s.length >= 18 && s.startsWith('0xffff')) return false;
                return true;
            },

            isPaused: () => game.readMemoryVariable("GameState", "tomb6.dll") === 8,

            isGameplayStable: () => {
                const gs = game.readMemoryVariable("GameState", "tomb6.dll");
                return (gs === GAME_STATE_PLAYING || gs === GAME_STATE_DIALOG)
                    && game.readMemoryVariable("PendingStateTransition", "tomb6.dll") === 0;
            },

            _readBackupCached: (field, fn) => {
                try {
                    const value = fn();
                    if (value != null) { 
                        backupsCache[field] = value; 
                        return value;
                    }
                } catch (e) {
                    console.warn("[TR6 MP] backup read failed field=" + field + ":", e.message);
                }
                return backupsCache[field];
            },

            getLaraBonesBackup: () => game._readBackupCached('bones', () => {
                if (!game.isGameplayStable()) return null;

                const lara = game.getLara();
                if (!game._ptrLooksValid(lara)) return null;

                const boneMatPtr = lara.add(ENTITY_BONE_MATRICES).readPointer();
                if (!game._ptrLooksValid(boneMatPtr)) return null;

                const count = game.getFullBoneCount(lara);
                if (count <= 0 || count > MAX_BONE_COUNT) return null;

                // Read entity world position for local-space conversion
                const flags = lara.add(ENTITY_FLAGS_PTR).readPointer();
                if (!game._ptrLooksValid(flags)) return null;

                const worldX = flags.add(FLAGS_POS_X).readFloat();
                const worldY = flags.add(FLAGS_POS_Y).readFloat();
                const worldZ = flags.add(FLAGS_POS_Z).readFloat();

                const result = new ArrayBuffer(count * BONE_ENCODED_SIZE);
                const out = new DataView(result);
                for (let i = 0; i < count; i++) {
                    const src = new DataView(boneMatPtr.add(i * BONE_MATRIX_STRIDE).readByteArray(BONE_MATRIX_SIZE));
                    const o = i * BONE_ENCODED_SIZE;
                    out.setInt16(o + 0,  Math.max(-32767, Math.min(32767, Math.round(src.getFloat32(0x00, true) * ROT_SCALE))), true); // R00
                    out.setInt16(o + 2,  Math.max(-32767, Math.min(32767, Math.round(src.getFloat32(0x04, true) * ROT_SCALE))), true); // R10
                    out.setInt16(o + 4,  Math.max(-32767, Math.min(32767, Math.round(src.getFloat32(0x08, true) * ROT_SCALE))), true); // R20
                    out.setInt16(o + 6,  Math.max(-32767, Math.min(32767, Math.round(src.getFloat32(0x10, true) * ROT_SCALE))), true); // R01
                    out.setInt16(o + 8,  Math.max(-32767, Math.min(32767, Math.round(src.getFloat32(0x14, true) * ROT_SCALE))), true); // R11
                    out.setInt16(o + 10, Math.max(-32767, Math.min(32767, Math.round(src.getFloat32(0x18, true) * ROT_SCALE))), true); // R21
                    out.setInt16(o + 12, Math.max(-32767, Math.min(32767, Math.round((src.getFloat32(0x30, true) - worldX) * POS_SCALE))), true);
                    out.setInt16(o + 14, Math.max(-32767, Math.min(32767, Math.round((src.getFloat32(0x34, true) - worldY) * POS_SCALE))), true);
                    out.setInt16(o + 16, Math.max(-32767, Math.min(32767, Math.round((src.getFloat32(0x38, true) - worldZ) * POS_SCALE))), true);
                }
                return result;
            }),

            getLaraPositionsBackup: () => game._readBackupCached('positions', () => {
                if (!game.isGameplayStable()) return null;

                const lara = game.getLara();
                if (!game._ptrLooksValid(lara)) return null;

                const flags = lara.add(ENTITY_FLAGS_PTR).readPointer();
                if (!game._ptrLooksValid(flags)) return null;

                return game.readByteArray(flags.add(POSITION_BLOCK_OFFSET), POSITION_BLOCK_SIZE);
            }),

            getVisArrayBackup: () => game._readBackupCached('visArray', () => {
                if (!game.isGameplayStable()) return null;

                const lara = game.getLara();
                if (!game._ptrLooksValid(lara)) return null;

                const visPtr = lara.add(ENTITY_VIS_ARRAY).readPointer();
                if (!game._ptrLooksValid(visPtr)) return null;

                const actual = game.getVisArraySize(lara);
                const size = (actual > 0 && actual < VIS_ARRAY_SIZE) ? actual : VIS_ARRAY_SIZE;
                return game.readByteArray(visPtr, size);
            }),

            getHealthBackup: () => game._readBackupCached('health', () => {
                if (!game.isGameplayStable()) return null;

                return game.readMemoryVariable("PlayerHealth", "tomb6.dll");
            }),

            getOutfitIdBackup: () => game._readBackupCached('outfitId', () => {
                if (!game.isGameplayStable()) return null;

                const inPhoto = game.readMemoryVariable("IsPhotoMode", manifest.executable);
                const varName = (inPhoto && inPhoto !== 0) ? "PhotoModeAppliedOutfitId" : "ActiveOutfitId";
                const v = game.readMemoryVariable(varName, "tomb6.dll");

                return (typeof v === 'number' && !isNaN(v)) ? (v & 0xff) : null;
            }),

            getSwapListsBackup: () => game._readBackupCached('swapLists', () => {
                if (!game.isGameplayStable()) return null;

                const lara = game.getLara();
                if (!game._ptrLooksValid(lara)) return null;

                const skeleton = lara.add(ENTITY_SKELETON).readPointer();
                if (!game._ptrLooksValid(skeleton)) return null;

                const legacyBase = skeleton.add(SKEL_LEGACY_MESH).readPointer();
                const hdBase = skeleton.add(SKEL_HD_MESH).readPointer();
                const legacyControl = lara.add(ENTITY_LEGACY_SWAPS).readPointer();
                const hdControl = lara.add(ENTITY_HD_SWAPS).readPointer();
                const legacyOffsets = game.serializeSwapList(legacyControl, legacyBase);
                const hdOffsets = game.serializeSwapList(hdControl, hdBase);
                const buf = new ArrayBuffer(2 + (legacyOffsets.length + hdOffsets.length) * 4);
                const view = new DataView(buf);
                let pos = 0;

                view.setUint8(pos, legacyOffsets.length); pos += 1;
                for (const off of legacyOffsets) { view.setInt32(pos, off, true); pos += 4; }
                view.setUint8(pos, hdOffsets.length); pos += 1;
                for (const off of hdOffsets) { view.setInt32(pos, off, true); pos += 4; }

                return buf;
            }),

            setupLaraSlots: () => {
                for (let n = 0; n < MAX_PLAYERS; n++) {
                    const slotPtr = game.allocMemory(ENTITY_SIZE);
                    const renderData = game.allocMemory(RENDER_DATA_SIZE);
                    renderData.add(RENDER_DATA_ENTITY_BACKREF).writePointer(slotPtr);
                    laraSlots.push({
                        used: false,
                        pointer: slotPtr,
                        flags: game.allocMemory(FLAGS_SIZE),
                        visArray: game.allocMemory(VIS_ARRAY_SIZE),
                        boneArray: game.allocMemory(MAX_BONE_BUFFER),
                        boneMatrixBuf: game.allocMemory(MAX_BONE_COUNT * BONE_MATRIX_STRIDE),
                        skeleton: game.allocMemory(SKELETON_SIZE),
                        renderData: renderData,
                        sfxScratch: game.allocMemory(0x10),
                        vfxScratch: game.allocMemory(0xa0),
                        emptyLegacyHead: game.createEmptySwapList(),
                        emptyHDHead: game.createEmptySwapList(),
                        savedLegacyMesh: ptr(0),
                        savedHDMesh: ptr(0),
                        savedLegacySwaps: null,
                        savedHDSwaps: null,
                        attrState: game.allocMemory(ATTR_STATE_SIZE),
                    });
                }
            },

            cleanupLaraSlots: () => {
                isRendering = false;
                for (let conn of otherPlayers) {
                    game.cleanupOtherPlayer(conn);
                }
                otherPlayers.length = 0;
                laraSlots = laraSlots.map(s => ({...s, used: false}));
            },

            cleanupOtherPlayer: (connection) => {
                if (!connection) return;
                const slot = laraSlots.find(s => s.pointer === connection.laraPointer);
                if (slot) slot.used = false;
                otherPlayers = otherPlayers.filter(o => o.id !== connection.id);
            },

            receivePlayerDisconnect: (playerId) => {
                const conn = otherPlayers.find(p => p.id === playerId);
                if (conn) game.cleanupOtherPlayer(conn);
            },

            receiveAudio: (sound, soundFactor, playerId) => {
                if (exiting || !userData.multiplayer) return;
                if (!game.isGameplayStable()) return;
                if (audioQueue.length >= 64) return;

                audioQueue.push({ playerId, hash: sound >>> 0, attach: (soundFactor || 0) & 0xff });
            },

            receiveVfx: (type, descriptor, flags, weaponId, playerId) => {
                if (exiting || !userData.multiplayer) return;
                if (!game.isGameplayStable()) return;
                if (!descriptor || !descriptor.length) return;
                if (vfxQueue.length >= 64) return;

                vfxQueue.push({ playerId, weaponId: weaponId | 0, flags: flags >>> 0, descriptor });
            },

            drainAudioQueue: () => {
                if (audioQueue.length === 0) return;
                const module = game.getGameModule();
                while (audioQueue.length > 0) {
                    const ev = audioQueue.shift();
                    const conn = otherPlayers.find(o => o.id === ev.playerId);
                    if (!conn || !conn.laraPointer || !conn.isLoaded) continue;

                    const req = conn.slot.sfxScratch;
                    req.writeU32(ev.attach << 16);
                    req.add(0x4).writeU32(2);
                    req.add(0x8).writeU32(ev.hash);
                    conn.laraPointer.add(ENTITY_CUE_HANDLE).writeU32(0);
                    isReplayingSound = true;
                    try {
                        game.runFunction(module, "PlayEntitySound", req, conn.laraPointer);
                    } catch (e) {
                        console.error("[SFX] drain playback failed for " + ev.playerId + ":", e.message);
                    } finally {
                        isReplayingSound = false;
                    }
                }
            },

            drainVfxQueue: () => {
                if (vfxQueue.length === 0) return;
                const module = game.getGameModule();
                const weaponIdVar = game.getMemoryVariable("ActiveWeaponId", module);
                while (vfxQueue.length > 0) {
                    const ev = vfxQueue.shift();
                    const conn = otherPlayers.find(o => o.id === ev.playerId);
                    if (!conn || !conn.laraPointer || !conn.isLoaded) continue;

                    const buf = conn.slot.vfxScratch;
                    buf.writeByteArray(ev.descriptor);
                    const savedWeapon = weaponIdVar.readS32();
                    weaponIdVar.writeS32(ev.weaponId);
                    isReplayingVfx = true;
                    try {
                        game.runFunction(module, "SpawnVfxByType", conn.laraPointer, buf, ev.flags);
                    } catch (e) {
                        console.error("[VFX] drain playback failed for " + ev.playerId + ":", e.message);
                    } finally {
                        isReplayingVfx = false;
                        weaponIdVar.writeS32(savedWeapon);
                    }
                }
            },

            keyBindingPressed: (key) => {
                const module = game.getGameModule();

                const activeItems = game.getActiveMenuItems();
                switch (key) {
                    case "F2": {
                        modMenuState.lastInteraction = Date.now();
                        if (!modMenuState.isOpen) {
                            modMenuState.isOpen = true;
                            modMenuState.activeSubmenu = null;
                            modMenuState.selectedIndex = 0;
                        } else if (modMenuState.activeSubmenu) {
                            const item = activeItems[modMenuState.selectedIndex];
                            const submenuItems = item.getSubmenuItems();
                            if (submenuItems.length > 0) {
                                modMenuState.submenuSelectedIndex =
                                    (modMenuState.submenuSelectedIndex + 1) % submenuItems.length;
                            }
                        } else {
                            modMenuState.selectedIndex =
                                (modMenuState.selectedIndex + 1) % Math.max(activeItems.length, 1);
                        }
                        break;
                    }
                    case "F4": {
                        if (!modMenuState.isOpen) return;
                        if (Date.now() - modMenuState.lastInteraction > MOD_MENU_TIMEOUT) {
                            game.closeModMenu();
                            return;
                        }
                        modMenuState.lastInteraction = Date.now();
                        const selectedItem = activeItems[modMenuState.selectedIndex];
                        if (!selectedItem) return;
                        if (selectedItem.isDisabled && selectedItem.isDisabled()) return;

                        if (modMenuState.activeSubmenu) {
                            if (selectedItem.onSubmenuConfirm) {
                                const submenuItems = selectedItem.getSubmenuItems();
                                const submenuItem = submenuItems[modMenuState.submenuSelectedIndex];
                                const msg = selectedItem.onSubmenuConfirm(submenuItem, module);
                                if (msg) {
                                    modMenuConfirmMessage = msg;
                                    modMenuConfirmTime = Date.now();
                                }
                            }
                            game.closeModMenu();
                        } else if (selectedItem.hasSubmenu) {
                            modMenuState.activeSubmenu = selectedItem.id;
                            modMenuState.submenuSelectedIndex = modMenuState.submenuLastIndex[selectedItem.id] || 0;
                        } else {
                            if (selectedItem.onConfirm) {
                                const msg = selectedItem.onConfirm(module);
                                if (msg) {
                                    modMenuConfirmMessage = msg;
                                    modMenuConfirmTime = Date.now();
                                }
                            }
                            if (selectedItem.closeOnConfirm !== false) {
                                game.closeModMenu();
                            } else {
                                modMenuState.lastInteraction = Date.now();
                            }
                        }
                        break;
                    }
                }
            },

            closeModMenu: () => {
                if (modMenuState.activeSubmenu) {
                    modMenuState.submenuLastIndex[modMenuState.activeSubmenu] = modMenuState.submenuSelectedIndex;
                }
                modMenuState.isOpen = false;
                modMenuState.activeSubmenu = null;
                modMenuState.lastInteraction = 0;
            },

            isModMenuTimedOut: () => modMenuState.isOpen &&
                (Date.now() - modMenuState.lastInteraction > MOD_MENU_TIMEOUT),

            teleportToPlayer: (playerConnection) => {
                const module = game.getGameModule();
                if (!playerConnection) return;

                const posData = playerConnection.lastPositionBytes;
                if (!posData) return;

                const laraScene = game.getMemoryVariable("PlayerSceneObject", module).readPointer();
                if (!laraScene || laraScene.isNull()) return;
                laraScene.add(SCENE_POS).writeByteArray(posData.slice(0, 12));
                send({
                    event: "multiplayer:sendChat",
                    args: { text: userData.name + " teleported to " + playerConnection.name, chatAction: true }
                });
            },

            openChat: () => {
                chatOpened = true;
            },
            closeChat: () => {
                chatOpened = false; chatMessage = "";
            },
            toggleChat: () => {
                chatOpened ? game.closeChat() : game.openChat();
            },
            receiveChat: (name, time, text, chatAction = false) => {
                if (exiting) return;
                chatMessages.push({
                    name: name || "",
                    time: time || Date.now(),
                    text: text || "",
                    chatAction: !!chatAction
                });
                chatMessages.sort((a, b) => a.time - b.time);
                if (chatMessages.length > CHAT_HISTORY_MAX) {
                    chatMessages = chatMessages.slice(-CHAT_HISTORY_MAX);
                }
            },

            setLara: (_ignored) => {
                const module = game.getGameModule();
                try {
                    laraPointer = game.getMemoryVariable("MainPlayerEntity", module).readPointer();
                    if (!laraPointer || laraPointer.isNull()) {
                        laraPointer = null;
                    }
                    currentLevel = game.readMemoryVariable("Level", module);

                    const donorsReady = donorLaraEntity !== null && donorKurtisEntity !== null;

                    if (laraPointer && !donorsReady && !game.isInMenu()) {
                        try {
                            game.createDonorEntities();
                        } catch (e) {
                            console.warn("[TR6 MP] donor setup failed:", e.message);
                        }
                    }

                    return laraPointer;
                } catch (err) {
                    console.error("Unable to detect Lara", err);
                    return null;
                }
            },

            getLara: () => laraPointer,

            detectLocalCharacterType: () => {
                const module = game.getGameModule();
                const scene = game.getMemoryVariable("PlayerSceneObject", module).readPointer();
                if (!scene || scene.isNull()) return 0;
                const t = scene.add(SCENE_TYPE).readU32();
                return t === 0x18 ? 0x18 : 0x16;
            },

            restoreDialog: (oldEntity) => {
                try {
                    if (!oldEntity || oldEntity.isNull()) return;
                    if (game.readMemoryVariable("GameState", "tomb6.dll") !== GAME_STATE_DIALOG) return;

                    const playerScene = game.getMemoryVariable("PlayerSceneObject", "tomb6.dll").readPointer();
                    if (playerScene.isNull()) return;

                    const cscA = game.getMemoryVariable("CutsceneEntityA", "tomb6.dll").readPointer();
                    const cscB = game.getMemoryVariable("CutsceneEntityB", "tomb6.dll").readPointer();
                    const isA = cscA.equals(playerScene);
                    const isB = !isA && cscB.equals(playerScene);
                    if (!isA && !isB) return;

                    const savedName = isA ? "CutsceneAnimDB_A" : "CutsceneAnimDB_B";
                    const savedAnimDB = game.getMemoryVariable(savedName, "tomb6.dll").readPointer();
                    if (savedAnimDB.isNull()) return;

                    oldEntity.add(ENTITY_ANIM_DB).writePointer(savedAnimDB);
                } catch (e) {
                    console.warn("[TR6 MP] dialog unmarry failed:", e.message);
                }
            },

            updateDialog: () => {
                try {
                    if (game.readMemoryVariable("GameState", "tomb6.dll") !== GAME_STATE_DIALOG) return;

                    const playerScene = game.getMemoryVariable("PlayerSceneObject", "tomb6.dll").readPointer();
                    if (playerScene.isNull()) return;

                    const cscA = game.getMemoryVariable("CutsceneEntityA", "tomb6.dll").readPointer();
                    const cscB = game.getMemoryVariable("CutsceneEntityB", "tomb6.dll").readPointer();
                    const isA = cscA.equals(playerScene);
                    const isB = !isA && cscB.equals(playerScene);
                    if (!isA && !isB) return;

                    const newEntity = playerScene.add(SCENE_ENTITY_PTR).readPointer();
                    if (newEntity.isNull()) return;

                    const newAnimDB = newEntity.add(ENTITY_ANIM_DB).readPointer();
                    const renderData = newEntity.add(ENTITY_FLAGS_PTR).readPointer();
                    if (renderData.isNull()) return;

                    const animState = renderData.add(FLAGS_ANIM_STATE).readPointer();
                    if (animState.isNull()) return;

                    const newAnimHash = animState.add(ANIM_STATE_HASH).readU32();
                    const dbName = isA ? "CutsceneAnimDB_A" : "CutsceneAnimDB_B";
                    const hashName = isA ? "CutsceneAnimHash_A" : "CutsceneAnimHash_B";
                    game.getMemoryVariable(dbName, "tomb6.dll").writePointer(newAnimDB);
                    game.writeMemoryVariable(hashName, newAnimHash, "tomb6.dll");
                } catch (e) {
                    console.warn("[TR6 MP] dialog state sync failed:", e.message);
                }
            },

            createDonorEntity: (donorType) => {
                try {
                    donorScene = game.allocMemory(DONOR_SCENE_SIZE);
                    donorScene.writeByteArray(new Uint8Array(DONOR_SCENE_SIZE));
                    const lara = game.getMemoryVariable("PlayerSceneObject", "tomb6.dll").readPointer();
                    if (lara && !lara.isNull()) {
                        const pose = lara.add(SCENE_POS).readByteArray(POSITION_BLOCK_BYTES);
                        donorScene.add(SCENE_POS).writeByteArray(pose);
                    }
                    donorScene.add(SCENE_POS_Z).writeFloat(-1000000.0);
                    donorScene.add(SCENE_TYPE).writeU32(donorType);
                    game.runFunction("tomb6.dll", "LoadCharacterEntity", donorScene);

                    const ent = donorScene.add(SCENE_ENTITY_PTR).readPointer();
                    if (!ent || ent.isNull() || ent.compare(MAX_VALID_PTR) > 0) {
                        console.warn("[TR6 MP] donor type=0x" + donorType.toString(16) +
                                     " LoadCharacterEntity invalid entity=" + ent);
                        return null;
                    }

                    const skel = ent.add(ENTITY_SKELETON).readPointer();
                    const parts = skel.isNull() ? 0 : skel.add(SKEL_MESH_PART_COUNT).readU32();
                    console.log("[TR6 MP] donor type=0x" + donorType.toString(16) + " entity=" + ent);

                    return ent;
                } catch (e) {
                    console.warn("[TR6 MP] donor type=0x" + donorType.toString(16) +
                                 " spawn failed: " + e.message);
                    return null;
                }
            },

            createDonorEntities: () => {
                donorLaraEntity = null;
                donorKurtisEntity = null;
                donorScene = null;
                const local = game.getLara();
                if (!local || local.isNull()) return;
                localCharacterType = game.detectLocalCharacterType();
                if (localCharacterType === 0) return;

                if (localCharacterType === 0x18) {
                    donorKurtisEntity = local;
                    const laraType = levelLaraVariant || 0x16;
                    donorLaraEntity = game.createDonorEntity(laraType);
                    console.log("[TR6 MP] local=Kurtis donorLara=" + donorLaraEntity + " (type=0x" + laraType.toString(16) + ")");
                } else {
                    donorLaraEntity = local;
                    const scene = game.getMemoryVariable("PlayerSceneObject", "tomb6.dll").readPointer();
                    if (scene && !scene.isNull()) {
                        levelLaraVariant = scene.add(SCENE_TYPE).readU32();
                    }
                    donorKurtisEntity = game.createDonorEntity(0x18);
                    console.log("[TR6 MP] local=Lara(0x" + localCharacterType.toString(16) + ") donorKurtis=" + donorKurtisEntity);
                }

                const donorsReady = donorLaraEntity !== null && donorKurtisEntity !== null;
                if (donorsReady) {
                    const naturalIsKurtis = (localCharacterType === 0x18);
                    const laraType = levelLaraVariant || 0x16;
                    const naturalType = naturalIsKurtis ? 0x18 : laraType;
                    const otherType = naturalIsKurtis ? laraType : 0x18;
                    const finalType = (preferredCharSide === null) ? naturalType : (preferredCharSide === 0x18 ? 0x18 : laraType);
                    pendingSwapType = otherType;
                    primeReturnType = (finalType !== otherType) ? finalType : null;
                    preBuildIntendedType = finalType;
                    console.log("[CHAR SWAP] pre-building characters: build=0x" + otherType.toString(16) + " final=0x" + finalType.toString(16));
                }
            },

            findControllerSlot: (entity) => {
                const module = game.getGameModule();
                if (!entity || entity.isNull()) return -1;

                const ccArr = game.getMemoryVariable("CharacterControllerArray", module);
                const ccCount = game.readMemoryVariable("CharacterControllerCount", module) | 0;
                for (let i = 0; i < ccCount && i < 0x40; i++) {
                    const slot = ccArr.add(i * CC_SLOT_SIZE);
                    if (slot.readPointer().equals(entity)) return i;
                }
                return -1;
            },

            performCharacterSwap: (newType) => {
                const module = game.getGameModule();
                try {
                    const scene = game.getMemoryVariable("PlayerSceneObject", module).readPointer();
                    if (!scene || scene.isNull()) return false;

                    const currentType = scene.add(SCENE_TYPE).readU32();
                    const currentIsKurtis = (currentType === 0x18);
                    const targetIsKurtis = (newType === 0x18);
                    if (currentIsKurtis === targetIsKurtis) {
                        console.log("[CHAR SWAP] target == current, skipping");
                        return false;
                    }

                    const ccArr = game.getMemoryVariable("CharacterControllerArray", module);
                    const currentEntity = scene.add(SCENE_ENTITY_PTR).readPointer();
                    const currentSlot = game.findControllerSlot(currentEntity);
                    if (currentSlot < 0) {
                        console.warn("[CHAR SWAP] couldn't find current player's controller slot");
                        return false;
                    }

                    game.restoreDialog(currentEntity);

                    const currentPos = scene.add(SCENE_POS).readByteArray(POSITION_BLOCK_BYTES);
                    if (currentIsKurtis) {
                        kurtisSavedPos = currentPos;
                        kurtisEntity = currentEntity;
                        kurtisType = currentType;
                        kurtisSlotIndex = currentSlot;
                    } else {
                        laraSavedPos = currentPos;
                        laraEntity = currentEntity;
                        laraType = currentType;
                        laraSlotIndex = currentSlot;
                    }

                    const targetEntity = targetIsKurtis ? kurtisEntity : laraEntity;
                    const targetSavedPos = targetIsKurtis ? kurtisSavedPos : laraSavedPos;
                    const targetType = targetIsKurtis ? 0x18 : (laraType || newType);

                    const isFirstActivation = (targetEntity === null || targetEntity.isNull());

                    if (isFirstActivation) {
                        console.log("[CHAR SWAP] first activation of " +
                                    (targetIsKurtis ? "Kurtis" : "Lara") +
                                    " (type=0x" + newType.toString(16) + ")");

                        scene.add(SCENE_TYPE).writeU32(newType);

                        game.runFunction(module, "LoadCharacterEntity", scene);

                        const swapEnt = scene.add(SCENE_ENTITY_PTR).readPointer();
                        const swapDonor = targetIsKurtis ? donorKurtisEntity : donorLaraEntity;
                        if (!swapEnt.isNull() && swapDonor && !swapDonor.isNull()) {
                            const donorAnimDb = swapDonor.add(ENTITY_ANIM_DB).readPointer();
                            if (!donorAnimDb.isNull()) {
                                swapEnt.add(ENTITY_ANIM_DB).writePointer(donorAnimDb);
                            }
                        }

                        const cicBefore = game.readMemoryVariable("CharacterInitCount", module);
                        game.runFunction(module, "InitEntitySpawn", scene, ptr(0), ptr(0), 0);
                        game.writeMemoryVariable("CharacterInitCount", cicBefore, module);

                        const newEntity = scene.add(SCENE_ENTITY_PTR).readPointer();
                        const newSlot = game.findControllerSlot(newEntity);
                        if (newSlot < 0) {
                            console.warn("[CHAR SWAP] target controller didn't materialize after InitEntitySpawn");
                            return false;
                        }
                        if (targetIsKurtis) {
                            kurtisEntity = newEntity;
                            kurtisType = newType;
                            kurtisSlotIndex = newSlot;
                        } else {
                            laraEntity = newEntity;
                            laraType = newType;
                            laraSlotIndex = newSlot;
                        }
                        console.log("[CHAR SWAP] captured: entity=" + newEntity + " slot=" + newSlot);

                        const donorEnt = targetIsKurtis ? donorKurtisEntity : donorLaraEntity;
                        if (donorEnt && !donorEnt.isNull() && !donorEnt.equals(newEntity)) {
                            const donorSkel = donorEnt.add(ENTITY_SKELETON).readPointer();
                            if (!donorSkel.isNull()) {
                                if (targetIsKurtis) {
                                    game.runFunction(module, "Clone", kurtisSwapSkeleton, donorSkel, SKELETON_SIZE);
                                    newEntity.add(ENTITY_SKELETON).writePointer(kurtisSwapSkeleton);
                                } else {
                                    game.runFunction(module, "Clone", laraSwapSkeleton, donorSkel, SKELETON_SIZE);
                                    newEntity.add(ENTITY_SKELETON).writePointer(laraSwapSkeleton);
                                }
                            }
                        }
                    } else {
                        console.log("[CHAR SWAP] resuming " + (targetIsKurtis ? "Kurtis" : "Lara") + " entity=" + targetEntity);

                        scene.add(SCENE_ENTITY_PTR).writePointer(targetEntity);
                        scene.add(SCENE_TYPE).writeU32(targetType);

                        if (targetSavedPos) {
                            scene.add(SCENE_POS).writeByteArray(targetSavedPos);
                        }

                        try {
                            game.getMemoryVariable("MainPlayerEntity", module).writePointer(targetEntity);
                            const subObj = targetEntity.add(ENTITY_FLAGS_PTR).readPointer();
                            if (!subObj.isNull()) {
                                game.getMemoryVariable("CameraTargetPtr", module).writePointer(subObj.add(FLAGS_POS_X));
                            }
                            game.writeMemoryVariable("ActiveCharacterTexHash", targetIsKurtis ? KURTIS_TEX_HASH : LARA_TEX_HASH, module);
                            game.writeMemoryVariable("PlayerIsKurtis", targetIsKurtis ? 1 : 0, module);
                            game.writeMemoryVariable("PlayerIsLara", targetIsKurtis ? 0 : 1, module);
                            game.writeMemoryVariable("ActiveWeaponId", 0, module);
                            game.getMemoryVariable("ActiveInteractiveScene", module).writePointer(ptr(0));
                        } catch (e) {
                            console.warn("[CHAR SWAP] global refresh failed: " + e.message);
                        }
                    }

                    const entity = scene.add(SCENE_ENTITY_PTR).readPointer();
                    if (entity && !entity.isNull()) {
                        const flags = entity.add(ENTITY_FLAGS_PTR).readPointer();
                        if (!flags.isNull()) {
                            const finalPos = scene.add(SCENE_POS).readByteArray(POSITION_BLOCK_BYTES);
                            flags.add(POSITION_BLOCK_OFFSET).writeByteArray(finalPos);
                            // Zero velocity (flags+0x260..+0x26F, 4 floats).
                            flags.add(FLAGS_VELOCITY).writeU64(0);
                            flags.add(FLAGS_VELOCITY + 8).writeU64(0);
                        }
                        entity.add(ENTITY_CUE_HANDLE).writeU32(0);
                    }

                    game.setLara();

                    game.updateDialog();

                    const postFlags = scene.add(SCENE_FLAGS).readU32();
                    const postGameState = game.readMemoryVariable("GameState", module);
                    console.log("[CHAR SWAP] post: entity=" + entity +
                                " scene+0x1fc=0x" + postFlags.toString(16) +
                                " GameState=" + postGameState +
                                " (first=" + isFirstActivation + ")");
                    preferredCharSide = targetIsKurtis ? 0x18 : 0x16;
                    return true;
                } catch (e) {
                    console.error("[CHAR SWAP] failed: " + e.message + " | stack=" + e.stack);
                    return false;
                }
            },

            getTemplateEntityFor: (characterType) => {
                if (characterType === 0x18) return donorKurtisEntity;
                if (characterType === 0x16 || characterType === 0) return donorLaraEntity;
                return null;
            },

            cloneLara: (templateEntity) => {
                const lara = templateEntity || game.getLara();
                if (!lara || lara.isNull()) return null;
                const module = game.getGameModule();
                try {
                    const slot = laraSlots.find(s => !s.used);
                    if (!slot) { console.warn("Max players reached"); return null; }
                    slot.used = true;
                    slot.templateEntity = lara;

                    const cloneEntity = slot.pointer;
                    const cloneFlags = slot.flags;
                    const mainFlags = lara.add(ENTITY_FLAGS_PTR).readPointer();

                    if (game.hasFunction(module, "Clone")) {
                        game.runFunction(module, "Clone", cloneEntity, lara, ENTITY_SIZE);
                        game.runFunction(module, "Clone", cloneFlags, mainFlags, FLAGS_SIZE);
                    } else {
                        console.warn("[TR6 MP] cloneLara: Clone function NOT found");
                        return null;
                    }

                    cloneEntity.add(ENTITY_FLAGS_PTR).writePointer(cloneFlags);
                    cloneFlags.add(FLAGS_BACK_REF).writePointer(cloneEntity);

                    const laraSkel = lara.add(ENTITY_SKELETON).readPointer();
                    if (!laraSkel.isNull()) {
                        game.runFunction(module, "Clone", slot.skeleton, laraSkel, SKELETON_SIZE);
                        cloneEntity.add(ENTITY_SKELETON).writePointer(slot.skeleton);
                    }

                    const localMain = game.getLara();
                    const localAttr = (localMain && !localMain.isNull())
                        ? localMain.add(ENTITY_ATTR_PTR).readPointer() : null;
                    if (localAttr && !localAttr.isNull()) {
                        const snapshot = localAttr.readByteArray(ATTR_STATE_SIZE);
                        slot.attrState.writeByteArray(snapshot);
                    } else {
                        slot.attrState.writeByteArray(new Uint8Array(ATTR_STATE_SIZE));
                    }
                    cloneEntity.add(ENTITY_ATTR_PTR).writePointer(slot.attrState);

                    cloneEntity.add(ENTITY_VIS_ARRAY).writePointer(slot.visArray);
                    cloneEntity.add(ENTITY_NULL_130).writePointer(ptr(0));

                    slot.renderData.writeByteArray(new Uint8Array(RENDER_DATA_SIZE));
                    slot.renderData.add(RENDER_DATA_ENTITY_BACKREF).writePointer(cloneEntity);
                    cloneEntity.add(ENTITY_RENDER_DATA).writePointer(slot.renderData);

                    cloneFlags.add(FLAGS_NULL_08).writePointer(ptr(0));
                    cloneFlags.add(FLAGS_NULL_160).writePointer(ptr(0));
                    cloneFlags.add(FLAGS_NULL_198).writePointer(ptr(0));

                    slot.boneCount = game.getFullBoneCount(lara);

                    const meshDesc = cloneEntity.add(ENTITY_MESH_DESC).readPointer();
                    game.runFunction(module, "SetupEntityRenderData", cloneFlags, meshDesc);

                    const mainFlagsBase = mainFlags.add(0x08).readPointer();
                    const cloneFlagsBase = cloneFlags.add(0x08).readPointer();
                    if (!mainFlagsBase.isNull() && !cloneFlagsBase.isNull()) {
                        const meshPartCount = meshDesc.add(MESH_DESC_PART_COUNT).readU32();
                        const bufSize = meshPartCount * 0x20;
                        cloneFlagsBase.writeByteArray(mainFlagsBase.readByteArray(bufSize));
                    }

                    game.runFunction(module, "FinalizeEntitySetup", cloneEntity);

                    const mainBonePtr = lara.add(ENTITY_BONE_MATRICES).readPointer();
                    if (!mainBonePtr.isNull()) {
                        slot.boneMatrixBuf.writeByteArray(mainBonePtr.readByteArray(MAX_BONE_COUNT * BONE_MATRIX_STRIDE));
                    }
                    cloneEntity.add(ENTITY_BONE_MATRICES).writePointer(slot.boneMatrixBuf);

                    slot.savedLegacySwaps = game.deepCopySwapList(lara.add(ENTITY_LEGACY_SWAPS).readPointer());
                    slot.savedHDSwaps = game.deepCopySwapList(lara.add(ENTITY_HD_SWAPS).readPointer());
                    cloneEntity.add(ENTITY_LEGACY_SWAPS).writePointer(slot.savedLegacySwaps);
                    cloneEntity.add(ENTITY_HD_SWAPS).writePointer(slot.savedHDSwaps);

                    const visSize = Math.min(game.getVisArraySize(lara), VIS_ARRAY_SIZE);
                    slot.visArraySize = visSize;
                    const mainVis = lara.add(ENTITY_VIS_ARRAY).readPointer();
                    if (visSize > 0 && !mainVis.isNull()) {
                        slot.visArray.writeByteArray(mainVis.readByteArray(visSize));
                    }

                    const skeleton = cloneEntity.add(ENTITY_SKELETON).readPointer();
                    if (!skeleton.isNull()) {
                        slot.savedLegacyMesh = skeleton.add(SKEL_LEGACY_MESH).readPointer();
                        slot.savedHDMesh = skeleton.add(SKEL_HD_MESH).readPointer();
                    }

                    console.log("[TR6 MP] Clone spawned at slot", laraSlots.indexOf(slot));
                    return slot;
                } catch (err) {
                    console.error("Failed to clone Lara", err);
                    return null;
                }
            },

            receivePlayerData: (playerId, playerData) => {
                if (exiting || !userData.multiplayer) return;
                if (!laraPointer || laraPointer.isNull()) return;
                if (!game.isGameplayStable()) return;

                const incomingType = (playerData.characterType === 0x18) ? 0x18 : 0x16;

                let conn = otherPlayers.find(p => p.id === playerId);
                if (!conn) {
                    conn = {
                        id: playerId,
                        name: playerData.name || "Player",
                        laraPointer: ptr(0),
                        slot: null,
                        characterType: incomingType,
                        isLoaded: false,
                        pendingClone: incomingType,
                        timeLastData: Date.now(),
                    };
                    otherPlayers.push(conn);
                } else if (conn.characterType !== incomingType) {
                    conn.pendingClone = incomingType;
                    conn.isLoaded = false;
                }

                conn.name = playerData.name || conn.name;
                conn.timeLastData = Date.now();

                if (typeof playerData.health === 'number') {
                    conn.health = playerData.health;
                }

                if (conn.pendingClone != null || !conn.laraPointer || conn.laraPointer.isNull()) return;

                const entity = conn.laraPointer;
                const flags = entity.add(ENTITY_FLAGS_PTR).readPointer();

                if (playerData.positions) {
                    const posData = game.decodeMemoryBlock(playerData.positions);
                    flags.add(POSITION_BLOCK_OFFSET).writeByteArray(posData);
                    conn.lastPositionBytes = posData;
                }

                if (playerData.bones) {
                    const boneData = game.decodeMemoryBlock(playerData.bones);
                    const boneLen = (boneData.byteLength !== undefined) ? boneData.byteLength : boneData.length;
                    conn.slot.boneArray.writeByteArray(boneData.slice(0, Math.min(boneLen, MAX_BONE_BUFFER)));
                    conn.slot.boneCount = Math.min(Math.floor(boneLen / BONE_ENCODED_SIZE), MAX_BONE_COUNT);
                    conn._hasBoneData = true;
                }

                if (playerData.visArray) {
                    const cloneVis = entity.add(ENTITY_VIS_ARRAY).readPointer();
                    if (!cloneVis.isNull()) {
                        const visData = game.decodeMemoryBlock(playerData.visArray);
                        const cap = conn.slot.visArraySize || VIS_ARRAY_SIZE;
                        const dataLen = visData.byteLength !== undefined ? visData.byteLength : visData.length;
                        if (dataLen <= cap) {
                            cloneVis.writeByteArray(visData);
                        } else {
                            const u8 = visData instanceof Uint8Array
                                ? visData
                                : new Uint8Array(visData instanceof ArrayBuffer ? visData : Array.from(visData));
                            cloneVis.writeByteArray(u8.subarray(0, cap));
                        }
                    }
                }

                if (conn.characterType !== 0x18
                    && typeof playerData.outfitId === 'number'
                    && playerData.outfitId >= 0 && playerData.outfitId < 16
                    && playerData.outfitId !== conn._lastOutfitId) {
                    conn._lastOutfitId = playerData.outfitId;
                    const tableBase = game.getMemoryVariable("OutfitDefinitionTable", "tomb6.dll");
                    if (tableBase && !tableBase.isNull()) {
                        const entryAddr = tableBase.add(playerData.outfitId * OUTFIT_ENTRY_SIZE);
                        const legacyMesh = entryAddr.add(OUTFIT_LEGACY_MESH).readPointer();
                        const hdMesh     = entryAddr.add(OUTFIT_HD_MESH).readPointer();
                        const partArray  = entryAddr.add(OUTFIT_PART_ARRAY).readPointer();
                        const partCount  = entryAddr.add(OUTFIT_PART_COUNT).readU32();
                        if (!legacyMesh.isNull() && !hdMesh.isNull() && !partArray.isNull() && partCount > 0) {
                            conn.slot.savedLegacyMesh = legacyMesh;
                            conn.slot.savedHDMesh     = hdMesh;
                            conn.slot.outfitPartArray = partArray;
                            conn.slot.outfitPartCount = partCount;
                            conn.slot.visArraySize = Math.min(partCount * 8, VIS_ARRAY_SIZE);
                        }
                    }
                }

                if (playerData.swapLists && playerData.swapLists !== conn._lastSwapHex) {
                    conn._lastSwapHex = playerData.swapLists;
                    const rawBytes = playerData.swapLists;
                    if (!rawBytes || rawBytes.length < 2) return;
                    const ab = new ArrayBuffer(rawBytes.length);
                    const u8 = new Uint8Array(ab);
                    for (let i = 0; i < rawBytes.length; i++) u8[i] = rawBytes[i];
                    const view = new DataView(ab);
                    const skeleton = entity.add(ENTITY_SKELETON).readPointer();
                    if (!skeleton.isNull()) {
                        const legacyBase = (conn.slot.savedLegacyMesh && !conn.slot.savedLegacyMesh.isNull())
                            ? conn.slot.savedLegacyMesh
                            : skeleton.add(SKEL_LEGACY_MESH).readPointer();
                        const hdBase = (conn.slot.savedHDMesh && !conn.slot.savedHDMesh.isNull())
                            ? conn.slot.savedHDMesh
                            : skeleton.add(SKEL_HD_MESH).readPointer();
                        let pos = 0;
                        const legacyCount = view.getUint8(pos); pos += 1;
                        const legacyOffsets = [];
                        for (let i = 0; i < legacyCount; i++) { legacyOffsets.push(view.getInt32(pos, true)); pos += 4; }
                        const hdCount = view.getUint8(pos); pos += 1;
                        const hdOffsets = [];
                        for (let i = 0; i < hdCount; i++) { hdOffsets.push(view.getInt32(pos, true)); pos += 4; }
                        conn.slot.savedLegacySwaps = game.buildSwapListFromOffsets(legacyOffsets, legacyBase);
                        conn.slot.savedHDSwaps = game.buildSwapListFromOffsets(hdOffsets, hdBase);
                        entity.add(ENTITY_LEGACY_SWAPS).writePointer(conn.slot.savedLegacySwaps);
                        entity.add(ENTITY_HD_SWAPS).writePointer(conn.slot.savedHDSwaps);
                    }
                }

                conn.isLoaded = true;
            },

            isOnlyPermaDamageEnabled: () => {
                if (userData.multiplayer) return false;
                const enabled = supportedFeatures.filter(f => userData[f.id]).map(f => f.id);
                return enabled.length === 1 && enabled[0] === 'perma-damage';
            },

            getActiveMenuItems: () => MOD_MENU_ITEMS.filter(item =>
                !item.isVisible || item.isVisible()
            ),

            createEmptySwapList: () => {
                const control = game.allocMemory(SWAP_CONTROL_SIZE);
                const sentinel = game.allocMemory(SWAP_NODE_SIZE);
                globalThis.keepAlive.push(control, sentinel);
                sentinel.writePointer(sentinel);
                sentinel.add(SWAP_NODE_PREV).writePointer(sentinel);
                sentinel.add(SWAP_NODE_DATA).writePointer(ptr(0));
                control.writePointer(sentinel);
                control.add(SWAP_CONTROL_COUNT).writeU64(0);
                return control;
            },

            deepCopySwapList: (controlPtr) => {
                if (controlPtr.isNull()) return game.createEmptySwapList();
                const sentinel = controlPtr.readPointer();
                if (sentinel.isNull()) return game.createEmptySwapList();

                const newControl = game.allocMemory(SWAP_CONTROL_SIZE);
                const newSentinel = game.allocMemory(SWAP_NODE_SIZE);
                globalThis.keepAlive.push(newControl, newSentinel);
                newSentinel.writePointer(newSentinel);
                newSentinel.add(SWAP_NODE_PREV).writePointer(newSentinel);
                newSentinel.add(SWAP_NODE_DATA).writePointer(ptr(0));

                let cur = sentinel.readPointer();
                let prev = newSentinel;
                let count = 0;
                while (!cur.equals(sentinel) && count < 64) {
                    const node = game.allocMemory(SWAP_NODE_SIZE);
                    globalThis.keepAlive.push(node);
                    node.add(SWAP_NODE_DATA).writePointer(cur.add(SWAP_NODE_DATA).readPointer());
                    node.add(SWAP_NODE_PREV).writePointer(prev);
                    prev.writePointer(node);
                    node.writePointer(newSentinel);
                    newSentinel.add(SWAP_NODE_PREV).writePointer(node);
                    prev = node;
                    count++;
                    cur = cur.readPointer();
                }

                newControl.writePointer(newSentinel);
                newControl.add(SWAP_CONTROL_COUNT).writeU64(count);
                return newControl;
            },

            serializeSwapList: (controlPtr, meshBase) => {
                if (controlPtr.isNull() || meshBase.isNull()) return [];
                const sentinel = controlPtr.readPointer();
                if (sentinel.isNull()) return [];
                const offsets = [];
                let cur = sentinel.readPointer();
                while (!cur.equals(sentinel) && offsets.length < 64) {
                    const dataPtr = cur.add(SWAP_NODE_DATA).readPointer();
                    if (!dataPtr.isNull()) {
                        offsets.push(dataPtr.sub(meshBase).toInt32());
                    }
                    cur = cur.readPointer();
                }
                return offsets;
            },

            buildSwapListFromOffsets: (offsets, meshBase) => {
                const control = game.allocMemory(SWAP_CONTROL_SIZE);
                const sentinel = game.allocMemory(SWAP_NODE_SIZE);
                globalThis.keepAlive.push(control, sentinel);
                sentinel.writePointer(sentinel);
                sentinel.add(SWAP_NODE_PREV).writePointer(sentinel);
                sentinel.add(SWAP_NODE_DATA).writePointer(ptr(0));
                let count = 0;
                if (offsets && offsets.length > 0 && !meshBase.isNull()) {
                    let prev = sentinel;
                    for (const off of offsets) {
                        const node = game.allocMemory(SWAP_NODE_SIZE);
                        globalThis.keepAlive.push(node);
                        node.add(SWAP_NODE_DATA).writePointer(meshBase.add(off));
                        node.add(SWAP_NODE_PREV).writePointer(prev);
                        prev.writePointer(node);
                        node.writePointer(sentinel);
                        sentinel.add(SWAP_NODE_PREV).writePointer(node);
                        prev = node;
                        count++;
                    }
                }
                control.writePointer(sentinel);
                control.add(SWAP_CONTROL_COUNT).writeU64(count);
                return control;
            },

            getVisArraySize: (entityPtr) => {
                if (!entityPtr || entityPtr.isNull()) return 0;

                const flagsPtr = entityPtr.add(ENTITY_FLAGS_PTR).readPointer();
                if (flagsPtr.isNull()) return 0;

                if ((flagsPtr.readU32() & 0x80000) !== 0) {
                    const meshDesc = entityPtr.add(ENTITY_MESH_DESC).readPointer();
                    return meshDesc.isNull() ? 0 : meshDesc.add(4).readU32() * 4;
                }

                const ent178 = entityPtr.add(ENTITY_ATTR_PTR).readPointer();
                if (!ent178.isNull() && (ent178.add(ATTR_MODULAR_OUTFIT_BIT).readU8() & 1) !== 0) {
                    return 0x7a * 4;
                }

                const skeleton = entityPtr.add(ENTITY_SKELETON).readPointer();
                return skeleton.isNull() ? 0 : (skeleton.add(SKEL_MESH_PART_COUNT).readU32() & 0x7fffffff) * 8;
            },

            getFullBoneCount: (entityPtr) => {
                const meshDesc = entityPtr.add(ENTITY_MESH_DESC).readPointer();
                if (meshDesc.isNull()) return 0;

                const mainBones = meshDesc.add(MESH_DESC_PART_COUNT).readS32();
                const skeleton = entityPtr.add(ENTITY_SKELETON).readPointer();
                if (skeleton.isNull()) return mainBones + 4;

                const groupCount = skeleton.add(SKEL_BONE_COUNT).readU32();
                let attachedBones = 0;
                if (groupCount > 0) {
                    const groupData = skeleton.add(SKEL_GROUP_ARRAY).readPointer();
                    for (let i = 0; i < groupCount; i++) {
                        attachedBones += groupData.add(i * 0x20 + 4).readS32();
                    }
                }

                return mainBones + 4 + attachedBones;
            },

            getCharacterTypeBackup: () => game.detectLocalCharacterType(),

            isBuildingCharacters: () => preBuildIntendedType !== null,

            receivePVP: (playerId, damage, weapon) => {},
            enterPhotoMode: () => {},
            exitPhotoMode: () => {},

            updateLaunchOptions: (options) => {
                userData = {...userData, ...options};
                playerNamesMode = isNaN(parseInt(userData.playerNamesMode)) ? 1 : parseInt(userData.playerNamesMode);
            },

            setupMenuPlayersText: (li) => {
                if (Array.isArray(li)) {
                    li.sort((a, b) => {
                        if (a.lvl === -1) return -1;
                        if (b.lvl === -1) return 1;
                        return a.lvl - b.lvl;
                    });
                }
                levelsInfo = li;
            },

            updateLoop: () => {
                if (exiting) return;
                for (let conn of otherPlayers) {
                    const lastTime = conn.timeLastData || 0;
                    if (Date.now() - lastTime >= 1000 * 11) {
                        game.cleanupOtherPlayer(conn);
                    }
                }
            },

            cleanup: async () => {
                exiting = true;
                game.cleanupFeatures(supportedFeatures);
                await game.cleanupHooks();
                game.cleanupLaraSlots();
            },

            getScreenCenter: () => {
                return {}; // not used
            },

            worldToScreenPos: (wx, wy, wz) => {
                const viewPtr = game.getMemoryVariable("MainViewMatrix", "tomb6.dll");
                const projPtr = game.getMemoryVariable("MainProjMatrix", "tomb6.dll");
                if (!viewPtr || !projPtr || viewPtr.isNull() || projPtr.isNull()) return null;

                const v = new Float32Array(viewPtr.readByteArray(64));
                const p = new Float32Array(projPtr.readByteArray(64));
                if (v[15] === 0 && v[0] === 0) return null;

                const m = new Float32Array(16);
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        let s = 0;
                        for (let k = 0; k < 4; k++) s += v[i*4+k] * p[k*4+j];
                        m[i*4+j] = s;
                    }
                }

                const cx = wx*m[0] + wy*m[4] + wz*m[8]  + m[12];
                const cy = wx*m[1] + wy*m[5] + wz*m[9]  + m[13];
                const cz = wx*m[2] + wy*m[6] + wz*m[10] + m[14];
                const cw = wx*m[3] + wy*m[7] + wz*m[11] + m[15];

                if (cw <= 0) return null;

                const ndcX = cx / cw;
                const ndcY = cy / cw;
                const ndcZ = cz / cw;

                if (ndcZ < 0 || ndcZ > 1) return null;
                if (Math.abs(ndcX) > 1.0 || Math.abs(ndcY) > 1.0) return null;

                const beginX = game.readMemoryVariable("DrawBeginX", "tomb6.dll");
                const endX   = game.readMemoryVariable("DrawEndX",   "tomb6.dll");
                const screenW = game.runFunction(manifest.executable, "GetScreenWidth");
                const screenH = game.runFunction(manifest.executable, "GetScreenHeight");
                const vpW = endX - beginX;
                const vpH = vpW * screenH / screenW;
                const sx = (ndcX + 1.0) * 0.5 * vpW + beginX;
                const sy = (1.0 - ndcY) * 0.5 * vpH;

                return { x: sx, y: sy };
            },
        };

        hooksExecution = {
            CullAndQueueSceneObject: {
                after: (module, sceneArg) => {
                    if (exiting || !userData.multiplayer) return;
                    if (!sceneArg) return;
                    if (!game.isGameplayStable()) return;

                    try {
                        const scene = ptr(sceneArg);
                        const playerScene = game.getMemoryVariable("PlayerSceneObject", module)?.readPointer();
                        if (!playerScene || playerScene.isNull()) return;
                        if (!scene.equals(playerScene)) return;

                        for (let conn of otherPlayers) {
                            if (conn.pendingClone == null) continue;
                            const type = conn.pendingClone;
                            conn.pendingClone = null;
                            if (conn.slot) conn.slot.used = false;
                            const template = game.getTemplateEntityFor(type);
                            if (!template || template.isNull()) continue;
                            const slot = game.cloneLara(template);
                            if (!slot) continue;
                            conn.slot = slot;
                            conn.laraPointer = slot.pointer;
                            conn.characterType = type;
                            conn._lastOutfitId = undefined;
                            conn._lastSwapHex = undefined;
                        }

                        for (let conn of otherPlayers) {
                            if (!conn.isLoaded || !conn.laraPointer) continue;
                            try {
                                game.runFunction(module, "PrepareEntityForRender", conn.laraPointer);

                                const countPtr = game.getMemoryVariable("VisibleEntityCount", module);
                                let count = countPtr.readU32();
                                const queuePtr = game.getMemoryVariable("VisibleEntityList", module);
                                queuePtr.add(count * Process.pointerSize).writePointer(conn.laraPointer);
                                countPtr.writeU32(count + 1);
                            } catch (e) {
                                console.warn("[TR6 MP] Queue error:", e.message);
                            }
                        }
                    } catch (e) {
                        console.warn("[TR6 MP] CullAndQueueSceneObject hook error:", e.message);
                    }
                }
            },

            DrawVisibleEntity: {
                after: (module, entityArg) => {
                    if (isRendering) return;

                    if (!entityArg) {
                        game.runFunction(module, "DrawVisibleEntity", ptr(0));
                        return;
                    }

                    const entityPtr = ptr(entityArg);
                    const conn = otherPlayers.find(p => p.laraPointer && entityPtr.equals(p.laraPointer));
                    if (!conn) {
                        isRendering = true;
                        game.runFunction(module, "DrawVisibleEntity", entityPtr);
                        isRendering = false;
                        return;
                    }

                    if (game.isPaused() || game.isInMenu()) return;

                    const entity = entityPtr;
                    const slot = conn.slot;

                    const template = game.getTemplateEntityFor(conn.characterType);
                    if (!template || template.isNull()) return;

                    const skeleton = entity.add(ENTITY_SKELETON).readPointer();
                    if (skeleton.isNull()) return;
                    const mainPlayer = template;

                    if (slot.savedLegacyMesh && !slot.savedLegacyMesh.isNull())
                        skeleton.add(SKEL_LEGACY_MESH).writePointer(slot.savedLegacyMesh);
                    if (slot.savedHDMesh && !slot.savedHDMesh.isNull())
                        skeleton.add(SKEL_HD_MESH).writePointer(slot.savedHDMesh);
                    if (slot.outfitPartArray && !slot.outfitPartArray.isNull())
                        skeleton.add(SKEL_MESH_PART_ARRAY).writePointer(slot.outfitPartArray);
                    if (typeof slot.outfitPartCount === 'number' && slot.outfitPartCount > 0)
                        skeleton.add(SKEL_MESH_PART_COUNT).writeU32(slot.outfitPartCount);

                    const mainLegacySwaps = mainPlayer.add(ENTITY_LEGACY_SWAPS).readPointer();
                    const mainHDSwaps = mainPlayer.add(ENTITY_HD_SWAPS).readPointer();
                    if (!mainLegacySwaps.isNull())
                        entity.add(ENTITY_LEGACY_SWAPS).writePointer(mainLegacySwaps);
                    if (!mainHDSwaps.isNull())
                        entity.add(ENTITY_HD_SWAPS).writePointer(mainHDSwaps);

                    if (conn._hasBoneData && slot.boneCount > 0) {
                        const engineBonePtr = entity.add(ENTITY_BONE_MATRICES).readPointer();
                        const cloneFlags = entity.add(ENTITY_FLAGS_PTR).readPointer();
                        if (!engineBonePtr.isNull() && !cloneFlags.isNull()) {
                            const cloneX = cloneFlags.add(FLAGS_POS_X).readFloat();
                            const cloneY = cloneFlags.add(FLAGS_POS_Y).readFloat();
                            const cloneZ = cloneFlags.add(FLAGS_POS_Z).readFloat();

                            const encoded = new DataView(slot.boneArray.readByteArray(slot.boneCount * BONE_ENCODED_SIZE));
                            for (let i = 0; i < slot.boneCount && i < MAX_BONE_COUNT; i++) {
                                const o = i * BONE_ENCODED_SIZE;
                                const mat = new ArrayBuffer(BONE_MATRIX_SIZE);
                                const mv = new DataView(mat);

                                const r00 = encoded.getInt16(o + 0, true) / ROT_SCALE;
                                const r10 = encoded.getInt16(o + 2, true) / ROT_SCALE;
                                const r20 = encoded.getInt16(o + 4, true) / ROT_SCALE;
                                const r01 = encoded.getInt16(o + 6, true) / ROT_SCALE;
                                const r11 = encoded.getInt16(o + 8, true) / ROT_SCALE;
                                const r21 = encoded.getInt16(o + 10, true) / ROT_SCALE;

                                const r02 = r10 * r21 - r20 * r11;
                                const r12 = r20 * r01 - r00 * r21;
                                const r22 = r00 * r11 - r10 * r01;

                                mv.setFloat32(0x00, r00, true);
                                mv.setFloat32(0x04, r10, true);
                                mv.setFloat32(0x08, r20, true);
                                mv.setFloat32(0x0C, 0, true);
                                mv.setFloat32(0x10, r01, true);
                                mv.setFloat32(0x14, r11, true);
                                mv.setFloat32(0x18, r21, true);
                                mv.setFloat32(0x1C, 0, true);
                                mv.setFloat32(0x20, r02, true);
                                mv.setFloat32(0x24, r12, true);
                                mv.setFloat32(0x28, r22, true);
                                mv.setFloat32(0x2C, 0, true);
                                
                                mv.setFloat32(0x30, encoded.getInt16(o + 12, true) / POS_SCALE + cloneX, true);
                                mv.setFloat32(0x34, encoded.getInt16(o + 14, true) / POS_SCALE + cloneY, true);
                                mv.setFloat32(0x38, encoded.getInt16(o + 16, true) / POS_SCALE + cloneZ, true);
                                mv.setFloat32(0x3C, 1.0, true);

                                const matBytes = new Uint8Array(mat);
                                const dstBase = engineBonePtr.add(i * BONE_MATRIX_STRIDE);
                                dstBase.writeByteArray(matBytes);
                                dstBase.add(BONE_PARENT_OFFSET).writeByteArray(matBytes);
                            }
                        }
                    }

                    const rd = entity.add(ENTITY_RENDER_DATA).readPointer();
                    if (!rd.isNull()) {
                        rd.add(RENDER_DATA_ENTITY_BACKREF).writePointer(entity);
                    }

                    isRendering = true;
                    game.runFunction(module, "DrawVisibleEntity", entity);
                    isRendering = false;
                }
            },

            PlayEntitySound: {
                before: (module, requestArg, entityArg) => {
                    if (exiting || !userData.multiplayer) return;
                    if (isReplayingSound) return;
                    if (!requestArg || !entityArg) return;
                    try {
                        const request = ptr(requestArg);
                        const entity = ptr(entityArg);
                        const lara = game.getLara();
                        if (!lara || lara.isNull()) return;

                        // Skip clone replays (avoid echo loop).
                        for (const o of otherPlayers) {
                            if (o.laraPointer && o.laraPointer.equals(entity)) return;
                        }

                        const hash = request.add(0x8).readU32();
                        const attach = request.add(0x2).readU8();
                        const fromLara = entity.equals(lara);

                        const cacheKey = "h" + hash.toString(16);
                        const now = Date.now();
                        if (lastCapturedSFX[cacheKey] && (now - lastCapturedSFX[cacheKey] < 30)) return;
                        lastCapturedSFX[cacheKey] = now;

                        const sounds = (game.getModuleAddresses(module) || {}).sounds || {};
                        const entity_sounds = sounds.entity_sounds || [];
                        const hashKey = "0x" + hash.toString(16);
                        const inEntityList = entity_sounds.includes(hashKey);

                        // Audit log — every SFX through PlayEntitySound, throttled per-hash.
                        // Suppress hashes already triaged: in the entity_sounds whitelist
                        // const AUDIT_MUTE = new Set([
                        //     0x13ae5, 0x13ae6, // rain (paired loop)
                        //     0xd0ea, 0xd0f1, 0xd0f2, // rain (paired loop)
                        //     0x768a, // ambient
                        // ]);
                        // (already syncing) or in the AUDIT_MUTE set at module top.
                        // if (!inEntityList && !AUDIT_MUTE.has(hash)) {
                        //     console.log("[SFX AUDIT] hash=0x" + hash.toString(16).padStart(8, '0') +
                        //                 " attach=" + attach + " from=" + (fromLara ? "Lara" : entity));
                        // }

                        if (!fromLara || !inEntityList) return;

                        send({
                            event: "multiplayer:sendSound",
                            args: {
                                sound: hashKey,
                                soundFactor: "0x" + attach.toString(16)
                            }
                        });
                    } catch (e) {
                        console.error("[SFX] hook error:", e.message);
                    }
                }
            },

            PlaySoundByHash: {
                before: (module, ctxArg, hashArg) => {
                    if (exiting || !userData.multiplayer) return;
                    if (isReplayingSound) return;
                    if (!hashArg) return;
                    try {
                        const raw = hashArg.toUInt32 ? hashArg.toUInt32() : (hashArg >>> 0);
                        const hash = (~raw) >>> 0;

                        const cacheKey = "h" + hash.toString(16);
                        const now = Date.now();
                        if (lastCapturedSFX[cacheKey] && (now - lastCapturedSFX[cacheKey] < 30)) return;
                        lastCapturedSFX[cacheKey] = now;

                        const sounds = (game.getModuleAddresses(module) || {}).sounds || {};
                        const byhash_sounds = sounds.byhash_sounds || [];
                        const hashKey = "0x" + hash.toString(16);
                        const inByHashList = byhash_sounds.includes(hashKey);

                        if (!inByHashList) return;

                        send({
                            event: "multiplayer:sendSound",
                            args: {
                                sound: hashKey,
                                soundFactor: "0x0"
                            }
                        });
                    } catch (e) {
                        console.error("[SFX-BYHASH] hook error:", e.message);
                    }
                }
            },

            SpawnVfxByType: {
                before: (module, entityArg, descriptorArg, flagsArg) => {
                    if (exiting || !userData.multiplayer) return;
                    if (isReplayingVfx) return;
                    if (!entityArg || !descriptorArg) return;
                    try {
                        const descPtr = ptr(descriptorArg);
                        if (!descPtr || descPtr.isNull()) return;

                        const entPtr = ptr(entityArg);
                        if (!entPtr || entPtr.isNull()) return;

                        const type = descPtr.add(0x7c).readS32();
                        if (type < 1 || type > 3) return;

                        const mainPlayer = game.getMemoryVariable("MainPlayerEntity", module)?.readPointer();
                        if (!mainPlayer || mainPlayer.isNull()) return;
                        if (!entPtr.equals(mainPlayer)) return;

                        if (game.readMemoryVariable("IsPhotoMode", manifest.executable) === 1) return;

                        const descBytes = new Uint8Array(descPtr.readByteArray(0xa0));
                        const descriptor = Array.from(descBytes);
                        const weaponId = game.readMemoryVariable("ActiveWeaponId", module);
                        const flags = flagsArg && flagsArg.toUInt32 ? flagsArg.toUInt32() : ((flagsArg >>> 0) || 0);

                        send({
                            event: "multiplayer:sendVfx",
                            args: { type, descriptor, flags, weaponId }
                        });
                    } catch (e) {
                        console.error("[VFX] hook error:", e.message);
                    }
                }
            },

            RenderHUD: {
                after: (module) => {
                    if (exiting) return;

                    const inMenu = game.isInMenu();
                    if (!game.isGameplayStable() && !game.isPaused() && !inMenu) return;

                    const lara = game.getLara();
                    const haveLara = lara && !lara.isNull();
                    if (!inMenu && !haveLara) return;

                    const inPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable) === 1;
                    if (inPhotoMode) return;

                    const origFontStyle = game.getMemoryVariable("UIFontStyleIndex", module).readS32();
                    const origTextScaleY = game.getMemoryVariable("TextScaleY", module).readFloat();
                    const origTextColor = game.getMemoryVariable("TextColorARGB", module).readU32();

                    try {

                        if (!topLeftLabelBuffer) {
                            topLeftLabelBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                        }

                        const isMultiplayer = !!userData.multiplayer;
                        const labelBase = isMultiplayer ? multiplayerText : modsText;
                        const players = otherPlayers.length + 1;
                        const lobbyName = (!userData.hideLobbyCode && userData.lobbyCode && userData.lobbyCode.length && userData.lobbyCode !== "_")
                            ? userData.lobbyCode + "; "
                            : "";
                        const levelLabel = inMenu ? "Main Menu" : game.levelName(currentLevel);
                        const displayText = isMultiplayer
                            ? labelBase + " (" + lobbyName + levelLabel + ": " + players + " players)"
                            : labelBase + " (" + levelLabel + ")";
                        game.updateString(topLeftLabelBuffer, displayText);

                        game.runFunction(module, "BeginUILayer", 0x45, ptr(0), ptr(0));
                        game.runFunction(module, "FlushUILayer");
                        game.getMemoryVariable("UIFontStyleIndex", module).writeS32(1);
                        game.getMemoryVariable("TextScaleY", module).writeFloat(100.0);

                        game.getMemoryVariable("TextColorARGB", module).writeU32(0xFEFEFEFE);

                        const drawBeginX = game.readMemoryVariable("DrawBeginX", module) || 0;
                        game.runFunction(module, "DrawTextAt", drawBeginX + 4, 6, topLeftLabelBuffer, 0);

                        if (inMenu && isMultiplayer && Array.isArray(levelsInfo) && levelsInfo.length > 0) {
                            if (!menuListBuffer) {
                                menuListBuffer = Memory.alloc(TEXT_BUFFER_SIZE * MENU_LIST_MAX_ROWS);
                            }
                            game.getMemoryVariable("TextScaleY", module).writeFloat(96.0);
                            let row = 0;
                            let y = 18;
                            for (const entry of levelsInfo) {
                                if (row >= MENU_LIST_MAX_ROWS) break;
                                const isMenuRow = entry.lvl === -1;
                                if (!isMenuRow && !game.isLevelSupported(entry.lvl)) continue;
                                const label = isMenuRow ? "Main Menu" : game.levelName(entry.lvl);
                                const text = "[" + label + "]: " + (entry.players || 0) + " players";
                                const rowBuf = menuListBuffer.add(row * TEXT_BUFFER_SIZE);
                                game.updateString(rowBuf, text);
                                game.runFunction(module, "DrawTextAt", drawBeginX + 4, y, rowBuf, 0);
                                row++;
                                y += 10;
                            }
                        }

                        if (game.isModMenuTimedOut()) {
                            game.closeModMenu();
                        }

                        if (modMenuState.isOpen) {
                            if (!modMenuTitleBuffer) modMenuTitleBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                            if (!modMenuLabelBuffer) modMenuLabelBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                            if (!modMenuRowBuffers) {
                                modMenuRowBuffers = [];
                                for (let i = 0; i < MOD_MENU_MAX_VISIBLE; i++) {
                                    modMenuRowBuffers.push(Memory.alloc(TEXT_BUFFER_SIZE));
                                }
                            }

                            let title = "Multiplayer Menu";
                            let items = [];
                            const activeMenuItems = game.getActiveMenuItems();
                            if (modMenuState.activeSubmenu) {
                                const sel = activeMenuItems[modMenuState.selectedIndex];
                                title = typeof sel.label === 'function' ? sel.label() : sel.label;
                                const subs = sel.getSubmenuItems();
                                items = subs.length > 0
                                    ? subs.map(s => ({ text: s.label, disabled: false }))
                                    : [{ text: "(No items)", disabled: true }];
                            } else {
                                items = activeMenuItems.map(mi => ({
                                    text: typeof mi.label === 'function' ? mi.label() : mi.label,
                                    disabled: mi.isDisabled ? mi.isDisabled() : false,
                                    hasSubmenu: !!mi.hasSubmenu
                                }));
                            }

                            const selectedIdx = modMenuState.activeSubmenu
                                ? modMenuState.submenuSelectedIndex
                                : modMenuState.selectedIndex;
                            const visibleCount = Math.min(items.length, MOD_MENU_MAX_VISIBLE);
                            let scrollOffset = 0;
                            if (items.length > MOD_MENU_MAX_VISIBLE) {
                                scrollOffset = Math.max(0, Math.min(selectedIdx - 2,
                                    items.length - MOD_MENU_MAX_VISIBLE));
                            }

                            const menuWidth = 130;
                            const titleH = 13;
                            const itemH = 11;
                            const padding = 3;
                            const totalH = titleH + (visibleCount * itemH) + padding * 2;
                            const drawEndX = game.readMemoryVariable("DrawEndX", module) || (drawBeginX + 320);
                            const centerX = ((drawBeginX + drawEndX) / 2) | 0;
                            const menuX = (centerX - (menuWidth / 2)) | 0;
                            const menuY = 30;

                            const panelHandle = game.getMemoryVariable("UIPanelLayerHandle", module).readPointer();
                            game.runFunction(module, "BeginUILayer", 0x49, ptr(0), panelHandle);
                            game.runFunction(module, "DrawFilledRect",
                                menuX, menuY, menuWidth, totalH, 0xCC101010);
                            game.runFunction(module, "DrawFilledRect",
                                menuX, menuY + titleH, menuWidth, 1, 0xFF333333);
                            if (items.length > 0 && selectedIdx < items.length) {
                                const relIdx = selectedIdx - scrollOffset;
                                const hY = menuY + titleH + padding + (relIdx * itemH);
                                game.runFunction(module, "DrawFilledRect",
                                    menuX + 2, hY, menuWidth - 4, itemH - 1, 0x80555555);
                            }
                            game.runFunction(module, "FlushUILayer");

                            game.runFunction(module, "BeginUILayer", 0x45, ptr(0), ptr(0));
                            game.runFunction(module, "FlushUILayer");
                            game.getMemoryVariable("UIFontStyleIndex", module).writeS32(1);

                            game.getMemoryVariable("TextScaleY", module).writeFloat(102.0);
                            game.getMemoryVariable("TextColorARGB", module).writeU32(0xFFFFFFFF);
                            game.updateString(modMenuTitleBuffer, title);
                            game.runFunction(module, "DrawTextAt", menuX + 4, menuY + 2, modMenuTitleBuffer, 0);

                            game.getMemoryVariable("TextScaleY", module).writeFloat(90.0);
                            for (let v = 0; v < visibleCount; v++) {
                                const itemIdx = scrollOffset + v;
                                const item = items[itemIdx];
                                const prefix = item.disabled ? "* " : "";
                                const suffix = item.hasSubmenu ? " >" : "";
                                const textColor = item.disabled
                                    ? 0xFF777777
                                    : (itemIdx === selectedIdx ? 0xFFFFEE80 : 0xFFFFFFFF);
                                game.getMemoryVariable("TextColorARGB", module).writeU32(textColor);
                                const rowBuf = modMenuRowBuffers[v];
                                game.updateString(rowBuf, prefix + item.text + suffix);
                                game.runFunction(module, "DrawTextAt",
                                    menuX + 4, menuY + titleH + padding + (v * itemH), rowBuf, 0);
                            }

                            game.getMemoryVariable("TextScaleY", module).writeFloat(70.0);
                            game.getMemoryVariable("TextColorARGB", module).writeU32(0xFFAAAAAA);
                            if (!modMenuConfirmBuffer) modMenuConfirmBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                            game.updateString(modMenuConfirmBuffer, "F2 navigate   F4 confirm");
                            game.runFunction(module, "DrawTextAt",
                                menuX + 4, menuY + totalH + 1, modMenuConfirmBuffer, 0);
                        }

                        if (modMenuConfirmMessage &&
                            Date.now() - modMenuConfirmTime < MOD_MENU_CONFIRM_TIMEOUT) {
                            if (!modMenuConfirmBuffer) modMenuConfirmBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                            game.runFunction(module, "BeginUILayer", 0x45, ptr(0), ptr(0));
                            game.runFunction(module, "FlushUILayer");
                            game.getMemoryVariable("UIFontStyleIndex", module).writeS32(1);
                            game.getMemoryVariable("TextScaleY", module).writeFloat(102.0);
                            game.getMemoryVariable("TextColorARGB", module).writeU32(0xFFFFEE80);
                            game.updateString(modMenuConfirmBuffer, modMenuConfirmMessage);
                            game.runFunction(module, "DrawTextAt", drawBeginX + 8, 50, modMenuConfirmBuffer, 0);
                        } else if (modMenuConfirmMessage) {
                            modMenuConfirmMessage = null;
                        }

                        if (playerNamesMode > 0 && otherPlayers.length > 0 && haveLara && !inMenu && !game.isPaused()) {
                            {
                                const isAboveHead = playerNamesMode > 1;
                                let listY = 50;
                                const visible = [];

                                // TODO: should use active camera position
                                const localFlags = lara.add(ENTITY_FLAGS_PTR).readPointer();
                                const localX = localFlags.isNull() ? 0 : localFlags.add(FLAGS_POS_X).readFloat();
                                const localY = localFlags.isNull() ? 0 : localFlags.add(FLAGS_POS_Y).readFloat();
                                const localZ = localFlags.isNull() ? 0 : localFlags.add(FLAGS_POS_Z).readFloat();

                                if (isAboveHead) {
                                    game.getMemoryVariable("UIFontStyleIndex", module).writeS32(1);
                                    game.getMemoryVariable("TextScaleY", module).writeFloat(80.0);
                                }

                                for (const conn of otherPlayers) {
                                    if (!conn.isLoaded || !conn.laraPointer || conn.laraPointer.isNull()) continue;
                                    const flags = conn.laraPointer.add(ENTITY_FLAGS_PTR).readPointer();
                                    if (flags.isNull()) continue;
                                    const wx = flags.add(FLAGS_POS_X).readFloat();
                                    const wy = flags.add(FLAGS_POS_Y).readFloat();
                                    const wz = flags.add(FLAGS_POS_Z).readFloat();

                                    const dx = wx - localX, dy = wy - localY, dz = wz - localZ;
                                    if (dx*dx + dy*dy + dz*dz > PLAYER_LABEL_MAX_DIST * PLAYER_LABEL_MAX_DIST) continue;

                                    const hpPercent = (typeof conn.health === 'number' && conn.health > 0)
                                        ? Math.max(0, Math.min(100, Math.round(conn.health)))
                                        : 0;
                                    if (!conn._nameBuffer) conn._nameBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                                    game.updateString(conn._nameBuffer, conn.name || "Player");
                                    let textX, textY, barX = 0, barY = 0, drawBar = false;
                                    if (isAboveHead) {
                                        const proj = game.worldToScreenPos(wx, wy, wz + 700);
                                        if (!proj) continue;
                                        const textW = game.runFunction(module, "MeasureTextWidth", conn._nameBuffer, 0, Memory.alloc(4));
                                        textX = Math.floor(proj.x - textW / 2);
                                        textY = Math.floor(proj.y);
                                        if (playerNamesMode === 2) {
                                            drawBar = true;
                                            barX = Math.floor(proj.x - 10);
                                            barY = textY + 10;
                                        }
                                    } else {
                                        textX = drawBeginX + 74;
                                        textY = listY - 1;
                                        drawBar = true;
                                        barX = drawBeginX + 24;
                                        barY = listY;
                                        listY += 8;
                                    }
                                    visible.push({ conn, textX, textY, drawBar, barX, barY, hpPercent });
                                }

                                if (visible.length > 0) {
                                    const panelHandle = game.getMemoryVariable("UIPanelLayerHandle", module).readPointer();
                                    game.runFunction(module, "BeginUILayer", 0x49, ptr(0), panelHandle);
                                    for (const v of visible) {
                                        if (!v.drawBar) continue;
                                        const barW = isAboveHead ? 20 : 40;
                                        const barH = 3;
                                        game.runFunction(module, "DrawFilledRect",
                                            v.barX, v.barY, barW, barH, 0x80000000);
                                        if (v.hpPercent > 0) {
                                            const fillW = Math.ceil(((barW - 2) / 100) * v.hpPercent);
                                            game.runFunction(module, "DrawFilledRect",
                                                v.barX + 1, v.barY + 1, fillW, barH - 2, 0xCC3228DC);
                                        }
                                    }
                                    game.runFunction(module, "FlushUILayer");

                                    game.runFunction(module, "BeginUILayer", 0x45, ptr(0), ptr(0));
                                    game.runFunction(module, "FlushUILayer");
                                    game.getMemoryVariable("UIFontStyleIndex", module).writeS32(1);
                                    game.getMemoryVariable("TextScaleY", module).writeFloat(80.0);
                                    game.getMemoryVariable("TextColorARGB", module).writeU32(0xFFFFFFFF);
                                    for (const v of visible) {
                                        game.runFunction(module, "DrawTextAt",
                                            v.textX, v.textY, v.conn._nameBuffer, 0);
                                    }
                                }
                            }
                        }

                        if (userData.enableChat && !inMenu && !game.isPaused()) {
                            const now = Date.now();
                            chatMessages = chatMessages.filter(m =>
                                m && (now - m.time < (m.name ? CHAT_NAMED_MS : CHAT_RECENT_MS)));

                            const haveAny = chatOpened || chatMessages.length > 0;
                            if (haveAny) {
                                if (!chatHeaderBuffer) chatHeaderBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                                if (!chatInputBuffer) chatInputBuffer = Memory.alloc(TEXT_BUFFER_SIZE);
                                if (!chatHistoryBuffers) {
                                    chatHistoryBuffers = [];
                                    for (let i = 0; i < CHAT_HISTORY_MAX; i++) {
                                        chatHistoryBuffers.push(Memory.alloc(TEXT_BUFFER_SIZE));
                                    }
                                }

                                const chatX = drawBeginX + 8;
                                const historyRowH = 8;
                                const inputY = 416;
                                const historyTopY = chatOpened ? inputY - 2 - CHAT_HISTORY_MAX * historyRowH : 384;
                                const headerY = historyTopY - 10;

                                if (chatOpened) {
                                    const panelHandle = game.getMemoryVariable("UIPanelLayerHandle", module).readPointer();
                                    game.runFunction(module, "BeginUILayer", 0x49, ptr(0), panelHandle);
                                    game.runFunction(module, "DrawFilledRect",
                                        chatX - 2, inputY - 2, 220, 11, 0xA0202020);
                                    game.runFunction(module, "FlushUILayer");
                                }

                                game.runFunction(module, "BeginUILayer", 0x45, ptr(0), ptr(0));
                                game.runFunction(module, "FlushUILayer");
                                game.getMemoryVariable("UIFontStyleIndex", module).writeS32(1);

                                game.getMemoryVariable("TextScaleY", module).writeFloat(90.0);
                                game.getMemoryVariable("TextColorARGB", module).writeU32(0xFFAAAAAA);
                                const headerText = game.levelName(currentLevel) + " Chat";
                                game.updateString(chatHeaderBuffer, headerText);
                                game.runFunction(module, "DrawTextAt", chatX, headerY, chatHeaderBuffer, 0);

                                game.getMemoryVariable("TextScaleY", module).writeFloat(84.0);
                                for (let i = 0; i < chatMessages.length && i < CHAT_HISTORY_MAX; i++) {
                                    const msg = chatMessages[i];
                                    const t = new Date(msg.time);
                                    const hh = String(t.getHours()).padStart(2, "0");
                                    const mm = String(t.getMinutes()).padStart(2, "0");
                                    const namePrefix = msg.name ? (String(msg.name).substring(0, 8) + ": ") : "";
                                    const line = "[" + hh + ":" + mm + "] " +
                                        (msg.chatAction ? "" : namePrefix) + String(msg.text);
                                    const buf = chatHistoryBuffers[i];
                                    game.updateString(buf, line);
                                    game.getMemoryVariable("TextColorARGB", module).writeU32(
                                        msg.chatAction ? 0xFFFFEE80 : 0xFFFFFFFF);
                                    const y = historyTopY + i * historyRowH;
                                    game.runFunction(module, "DrawTextAt", chatX, y, buf, 0);
                                }

                                if (chatOpened) {
                                    game.getMemoryVariable("TextScaleY", module).writeFloat(88.0);
                                    game.getMemoryVariable("TextColorARGB", module).writeU32(0xFFFFFFFF);
                                    const namePart = userData.name ? userData.name.substring(0, 20) : "you";
                                    game.updateString(chatInputBuffer, namePart + ": " + chatMessage + "_");
                                    game.runFunction(module, "DrawTextAt", chatX, inputY, chatInputBuffer, 0);
                                }
                            }
                        }

                    } finally {
                        game.getMemoryVariable("UIFontStyleIndex", module).writeS32(origFontStyle);
                        game.getMemoryVariable("TextScaleY", module).writeFloat(origTextScaleY);
                        game.getMemoryVariable("TextColorARGB", module).writeU32(origTextColor);
                    }
                }
            },

            ProcessGameState: {
                after: (module) => {
                    const scene = game.getMemoryVariable("PlayerSceneObject", module).readPointer();
                    if (!scene || scene.isNull() || !game.isGameplayStable()) return;

                    const liveType = scene.add(SCENE_TYPE).readU32();
                    if (liveType !== 0x18) levelLaraVariant = liveType;

                    if (pendingSwapType !== null) {
                        const char = pendingSwapType;
                        pendingSwapType = null;
                        game.performCharacterSwap(char);
                        if (primeReturnType !== null) {
                            const back = primeReturnType;
                            primeReturnType = null;
                            game.performCharacterSwap(back);
                        }
                        preBuildIntendedType = null;
                    }

                    game.drainAudioQueue();
                    game.drainVfxQueue();
                }
            },

            LoadedLevel: {
                before: (module) => {
                    laraPointer = null;
                    isRendering = false;
                    donorLaraEntity = null;
                    donorKurtisEntity = null;
                    donorScene = null;
                    pendingSwapType = null;
                    primeReturnType = null;
                    preBuildIntendedType = null;
                    laraEntity = null;
                    laraType = 0;
                    laraSlotIndex = -1;
                    laraSavedPos = null;
                    kurtisEntity = null;
                    kurtisType = 0x18;
                    kurtisSlotIndex = -1;
                    kurtisSavedPos = null;
                    audioQueue.length = 0;
                    vfxQueue.length = 0;
                    game.cleanupLaraSlots();
                }
            },

            InitEntitySpawn: {
                after: (module, sceneArg) => {
                    if (!sceneArg) return;
                    try {
                        const scene = ptr(sceneArg);
                        const entity = scene.add(SCENE_ENTITY_PTR).readPointer();
                        if (entity.isNull()) return;

                        const mainPlayer = game.getMemoryVariable("MainPlayerEntity", module).readPointer();
                        if (!mainPlayer || mainPlayer.isNull()) return;
                        if (!entity.equals(mainPlayer)) return;

                        game.setLara();
                    } catch (e) {
                        console.warn("[TR6 MP] InitEntitySpawn hook error:", e.message);
                    }
                }
            },

            KeyboardInput: {
                before: (module, keycodeArg) => {
                    if (exiting) return;
                    const lara = game.getLara();
                    if (!lara || lara.isNull()) return;

                    const keycode = parseInt(keycodeArg, 16);
                    const now = Date.now();
                    if (now - (lastKeyPressTime[keycode] || 0) < 175) return;
                    lastKeyPressTime[keycode] = now;

                    const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);
                    if (isPhotoMode === 1) return;
                    if (game.isInMenu() || game.isPaused()) return;

                    if (keycode >= 62 && keycode <= 73) {
                        if (keycode === 63) {
                            game.keyBindingPressed("F2"); 
                            return; 
                        }
                        if (keycode === 65) {
                            game.keyBindingPressed("F4"); 
                            return; 
                        }
                        if (keycode === 69 && userData.enableChat) { 
                            game.toggleChat(); 
                            return;
                        }
                        return;
                    }

                    if (!chatOpened || !userData.enableChat) return;

                    chatSuppressKey = true;

                    const charMap = {
                        "4": [" ", " "],
                        "5": ["    ", "    "],
                        "6": ["enter", "enter"],
                        "7": ["esc", "esc"],
                        "11": ["0", ")"], "12": ["1", "!"], "13": ["2", "\\""],
                        "14": ["3", "£"], "15": ["4", "$"], "16": ["5", "%"],
                        "17": ["6", "^"], "18": ["7", "&"], "19": ["8", "*"],
                        "20": ["9", "("],
                        "21": ["a", "A"], "22": ["b", "B"], "23": ["c", "C"],
                        "24": ["d", "D"], "25": ["e", "E"], "26": ["f", "F"],
                        "27": ["g", "G"], "28": ["h", "H"], "29": ["i", "I"],
                        "30": ["j", "J"], "31": ["k", "K"], "32": ["l", "L"],
                        "33": ["m", "M"], "34": ["n", "N"], "35": ["o", "O"],
                        "36": ["p", "P"], "37": ["q", "Q"], "38": ["r", "R"],
                        "39": ["s", "S"], "40": ["t", "T"], "41": ["u", "U"],
                        "42": ["v", "V"], "43": ["w", "W"], "44": ["x", "X"],
                        "45": ["y", "Y"], "46": ["z", "Z"],
                        "47": ["0", "0"], "48": ["1", "1"], "49": ["2", "2"],
                        "50": ["3", "3"], "51": ["4", "4"], "52": ["5", "5"],
                        "53": ["6", "6"], "54": ["7", "7"], "55": ["8", "8"],
                        "56": ["9", "9"],
                        "61": [".", "."],
                        "74": ["-", "_"], "75": ["=", "+"],
                        "76": ["[", "{"], "77": ["]", "}"],
                        "78": ["/", "?"], "79": ["\\\\", "|"],
                        "80": [",", "<"], "81": [".", ">"],
                        "82": ["'", "@"], "83": [";", ":"], "84": ["#", "~"],
                        "91": ["backspace", "backspace"]
                    };

                    const isShift = game.getMemoryVariable("KeyIsPressed", manifest.executable).add(0x8).readS8();
                    const key = charMap[keycode]?.[isShift ? 1 : 0];
                    if (!key) return;

                    if (key === "esc") {
                        game.closeChat();
                    } else if (key === "enter") {
                        if (chatMessage.length > 0) {
                            send({ event: "multiplayer:sendChat", args: { text: chatMessage } });
                            chatMessage = "";
                        }
                        game.closeChat();
                    } else if (key === "backspace") {
                        if (chatMessage.length > 0) {
                            chatMessage = chatMessage.substring(0, chatMessage.length - 1);
                        }
                    } else {
                        chatMessage += key;
                        if (chatMessage.length > CHAT_MAX_LEN) {
                            chatMessage = chatMessage.substring(0, CHAT_MAX_LEN);
                        }
                    }
                },
                after: (module, keycode) => {
                    if (chatOpened || chatSuppressKey) {
                        game.writeMemoryVariable("KeyToControl", 0, manifest.executable);
                        chatSuppressKey = false;
                        return 0x0;
                    }
                }
            },

            CreateFileW: {
                after: (module, lpFileName, dwAccess, dwShare, lpSecAttr, dwCreation, dwFlags, hTemplate) => {
                    let finalPath = lpFileName;
                    let redirectedPath = null;
                    if (userData.multiplayer && lpFileName && !ptr(lpFileName).isNull()) {
                        const origPath = ptr(lpFileName).readUtf16String();
                        if (origPath) {
                            const upper = origPath.toUpperCase();
                            if (upper.endsWith('.GMX')) {
                                const i = Math.max(upper.lastIndexOf('\\\\'), upper.lastIndexOf('/'));
                                const basename = (i >= 0) ? upper.substring(i + 1) : upper;
                                const moddedPath = moddedLevels[basename];
                                if (moddedPath) {
                                    console.log("[GMX] " + origPath + " | basename=" + basename + " => REDIRECT to " + moddedPath);
                                    finalPath = Memory.allocUtf16String(moddedPath);
                                    redirectedPath = moddedPath;
                                }
                            }
                        }
                    }

                    const result = game.runFunction(module, "CreateFileW", finalPath, dwAccess, dwShare, lpSecAttr, dwCreation, dwFlags, hTemplate);
                    if (redirectedPath) {
                        const h = result.toString();
                        const failed = (h === "-1" || h.toLowerCase().endsWith("ffffffff") || h.toLowerCase().endsWith("ffffffffffffffff"));
                        console.log("[GMX] handle=" + h + (failed ? " INVALID_HANDLE (file missing or unreadable?)" : " OK") + " for " + redirectedPath);
                    }
                    return result;
                }
            },
        };

        game.registerFeatureHooks(supportedFeatures, hooksExecution);
        game.registerHooks(hooksExecution);

        rpc.exports = game;
    `);
};
