const gameCore = require("../game-core").template;

module.exports = async (session, manifest, userData, memoryAddresses, supportedFeatures, gameFeaturesCore) => {
    // language=JavaScript
    return await session.createScript(`
        let userData = ${JSON.stringify(userData)};
        const memoryAddresses = ${JSON.stringify(memoryAddresses)};
        const manifest = ${JSON.stringify(manifest)};
        const supportedFeatures = ${JSON.stringify(supportedFeatures)};

        const MAX_PLAYERS = 32;
        const ROOM_SIZE = 0x130;
        const ENTITY_SIZE = 0x24c8;
        const ENTITY_BONES_SIZE = 0x2f0;
        const ENTITY_MATRICES_SIZE = 0x630;
        const ENTITY_POS_SIZE = 0x10;
        const ENTITY_POS_NO_ROT_SIZE = 0xc;
        const LARA_HAIR_SIZE = 0x6ac; // 0xd58;
        const LARA_BASIC_SIZE = 0x1e;
        const LARA_SHADOW_SIZE = 0xc;
        const LARA_APPEARANCE_SIZE = 0x18;
        const LARA_GUNFLAG_SIZE = 0x2;
        const LARA_OUTFIT_SIZE = 0x38;
        const LARA_FACE_SIZE = 0x14;

        const ENTITY_X = 0x60;
        const ENTITY_Y = 0x64;
        const ENTITY_Z = 0x68;
        const ENTITY_LAST_X = 0x1840;
        const ENTITY_ROOM = 0x1c;
        const ENTITY_HEALTH = 0x26;
        const ENTITY_BONES = 0x1e98;
        const ENTITY_LAST_BONES = 0x1868;
        const ENTITY_XZ_SPEED = 0x22;
        const ENTITY_Y_SPEED = 0x24;
        const ENTITY_CURRENT_STATE = 0x12;
        const ENTITY_TARGET_STATE = 0x14;
        const ENTITY_QUEUED_STATE = 0x16;
        const ENTITY_ANIM_ID = 0x18;
        const ENTITY_ANIM_FRAME = 0x1a;
        const ENTITY_FLAGS = 0x2c;

        let appearanceBackup = null;
        let shadowCircleBackup = null;
        let gunFlagsBackupLeft = null;
        let gunFlagsBackupRight = null;
        let hairLeftBackup = null;
        let hairRightBackup = null;
        let gunTypesBackup = null;
        
        let isRendering = false;
        let isSimulatingHair = false;
        let laraPointer = null;
        let laraBackup = null;
        let laraSlots = [];
        let otherPlayers = [];
        let lastCapturedSFX = {};
        let levelLastLoadedId = null;
        let levelIsRestarting = false;
        let multiplayerText = "Burn's Multiplayer v2.2";
        let modsText = "Burn's Mods v2.2";
        let permaDamageText = "Burn's Perma-damage v2.2";
        let levelsInfo = [];

        // Mod menu system state
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
                isDisabled: () => pvpMode || otherPlayers.length === 0
            },
            {
                id: "levelskip",
                label: () => "Skip Level",
                hasSubmenu: false,
                onConfirm: (module) => {
                    game.writeMemoryVariable("LevelChange", currentLevel + 1, module);
                    return "Skipping level...";
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
                isDisabled: () => false
            },
            {
                id: "pvp",
                label: () => "PvP Mode: " + (pvpMode ? "On" : "Off"),
                hasSubmenu: false,
                closeOnConfirm: false,
                onConfirm: (module) => {
                    pvpMode = !pvpMode;
                    send({event: "multiplayer:sendPVPMode", args: {pvpMode}});
                },
                isDisabled: () => false
            },
            {
                id: "outfit",
                label: () => "Change Outfit",
                hasSubmenu: true,
                getSubmenuItems: () => [
                    { id: 0, label: "Classic" },
                    { id: 1, label: "FMV" },
                    { id: 2, label: "Young 1" },
                    { id: 3, label: "Young 2" },
                    { id: 4, label: "Camouflage" },
                    { id: 5, label: "Deep Dive" },
                    { id: 6, label: "Catsuit 1" },
                    { id: 7, label: "Catsuit 2" },
                    { id: 8, label: "X-ray" },
                    { id: 10, label: "Classic TR1" },
                    { id: 11, label: "Training TR1" },
                    { id: 12, label: "Bloody TR1" },
                    { id: 13, label: "Classic TR2" },
                    { id: 14, label: "Training TR2" },
                    { id: 15, label: "Wetsuit TR2" },
                    { id: 16, label: "Bomber TR2" },
                    { id: 17, label: "Bathrobe TR2" },
                    { id: 18, label: "Vegas TR2" },
                    { id: 19, label: "Training TR3" },
                    { id: 20, label: "Nevada TR3" },
                    { id: 21, label: "Pacific TR3" },
                    { id: 22, label: "Catsuit TR3" },
                    { id: 23, label: "Antarctica TR3" }
                ],
                onSubmenuConfirm: (submenuItem, module) => {
                    if (submenuItem) {
                        const execAddresses = game.getModuleAddresses(manifest.executable);
                        const appearancePointer = executableBase.add(execAddresses.variables.LaraAppearanceModern.Address);
                        const outfitsPointer = game.getMemoryVariable("OutfitsPointer", module);
                        const outfitPointerAddress = outfitsPointer.add(submenuItem.id * LARA_OUTFIT_SIZE);
                        appearancePointer.writePointer(outfitPointerAddress);

                        const isYoungLara = submenuItem.id === 2 || submenuItem.id === 3;
                        game.runFunction(
                            module,
                            "ApplySettings",
                            game.getMemoryVariable("OutfitsLaraSomeBasePointer", module),
                            game.getMemoryVariable(isYoungLara ? "OutfitsLaraHairYoung" : "OutfitsLaraHairOld", module)
                        );
                        return "Outfit: " + submenuItem.label;
                    }
                },
                isDisabled: () => false
            },
            {
                id: "levelselect",
                label: () => "Level Select",
                hasSubmenu: true,
                getSubmenuItems: () => {
                    const module = game.getGameModule();
                    const levelNames = game.levelNames[module] || {};
                    const levels = [];
                    for (const [id, name] of Object.entries(levelNames)) {
                        const levelId = parseInt(id);
                        if (game.isLevelSupported(levelId) && !game.isLevelMenu(levelId)) {
                            levels.push({ id: levelId, label: name });
                        }
                    }
                    levels.sort((a, b) => a.id - b.id);
                    return levels;
                },
                onSubmenuConfirm: (submenuItem, module) => {
                    if (submenuItem) {
                        const isPauseMenu = game.readMemoryVariable("IsGameMenu", manifest.executable);
                        game.writeMemoryVariable("LevelChange", submenuItem.id, module);
                        if (isPauseMenu) {
                            game.writeMemoryVariable("ReturnToMainMenu", 1, module);
                        }
                        return "Loading: " + submenuItem.label;
                    }
                },
                isDisabled: () => false
            },
            {
                id: "cheats",
                label: () => "Cheats",
                hasSubmenu: true,
                getSubmenuItems: () => [
                    { id: "health", label: "Fill Health" },
                    { id: "oxygen", label: "Fill Oxygen" }
                ],
                onSubmenuConfirm: (submenuItem, module) => {
                    if (!submenuItem) return;
                    const lara = game.getLara();
                    if (!lara || lara.isNull()) return;
                    switch (submenuItem.id) {
                        case "health":
                            lara.add(ENTITY_HEALTH).writeS16(1000);
                            game.runFunction(module, "SoundEffect", 0x74, ptr(0x0), 2);
                            return "Health filled";
                        case "oxygen":
                            game.writeMemoryVariable("LaraOxygen", 1800, module);
                            game.runFunction(module, "SoundEffect", 0x18, ptr(0x0), 2);
                            return "Oxygen filled";
                    }
                },
                isDisabled: () => false
            }
        ];
        let initiatedChat = false;
        let processingProjectiles = [];
        let changedPlayerRoom = null;
        let playerNamesMode = isNaN(parseInt(userData.playerNamesMode)) ? 1 : parseInt(userData.playerNamesMode);
        let lastKeyPressTime = {};

        let hooksExecution;
        let hooks = {};
        ${gameCore}
        ${gameFeaturesCore}

        const game = {
            ...gameCoreFunctions,

            supportedLevels: {
                "tomb4.dll": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40],
                "tomb5.dll": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
            },

            levelNames: {
                "tomb4.dll": {
                    "0": "Main Menu",
                    "1": "Angkor Wat",
                    "2": "Race For The Iris",
                    "3": "The Tomb Of Seth",
                    "4": "Burial Chambers",
                    "5": "Valley Of The Kings",
                    "6": "KV5",
                    "7": "Temple Of Karnak",
                    "8": "The Great Hypostyle Hall",
                    "9": "Sacred Lake",
                    "11": "Tomb Of Semerkhet",
                    "12": "Guardian Of Semerkhet",
                    "13": "Desert Railroad",
                    "14": "Alexandria",
                    "15": "Coastal Ruins",
                    "16": "Pharos, Temple Of Isis",
                    "17": "Cleopatra's Palaces",
                    "18": "Catacombs",
                    "19": "Temple Of Poseidon",
                    "20": "The Lost Library",
                    "21": "Hall Of Demetrius",
                    "22": "City Of The Dead",
                    "23": "Trenches",
                    "24": "Chambers Of Tulun",
                    "25": "Street Bazaar",
                    "26": "Citadel Gate",
                    "27": "Citadel",
                    "28": "The Sphinx Complex",
                    "30": "Underneath The Sphinx",
                    "31": "Menkaure's Pyramid",
                    "32": "Inside Menkaure's Pyramid",
                    "33": "The Mastabas",
                    "34": "The Great Pyramid",
                    "35": "Khufu's Queens Pyramids",
                    "36": "Inside The Great Pyramid",
                    "37": "Temple Of Horus",
                    "38": "Temple Of Horus",
                    "40": "The Times Exclusive"
                },
                "tomb5.dll": {
                    "0": "Main Menu",
                    "1": "Streets of Rome",
                    "2": "Trajan's Markets",
                    "3": "The Colosseum",
                    "4": "The Base",
                    "5": "The Submarine",
                    "6": "Deepsea Dive",
                    "7": "Sinking Submarine",
                    "8": "Gallows Tree",
                    "9": "Labyrinth",
                    "10": "Old Mill",
                    "11": "The 13th Floor",
                    "12": "Escape with the Iris",
                    "13": "Security Breach",
                    "14": "Red Alert!"
                }
            },

            levelName: (level) => {
                const name = game.levelNames[game.getGameModule()][String(level)] || "Unknown Level";
                const newGamePlus = game.readMemoryVariable("NewGamePlus", game.getGameModule());
                return name + (newGamePlus ? "+" : "");
            },

            isLevelSupported: (level) => {
                return game.supportedLevels[game.getGameModule()]?.includes(parseInt(level)) || false;
            },

            isLevelMenu: (level) => {
                if (level === null || typeof level === "undefined") level = currentLevel;
                return 0 === parseInt(level);
            },

            isInGame: () => {
                const lara = game.getLara();
                const foundLara = lara && !lara.isNull();
                return foundLara && game.isLevelSupported(currentLevel);
            },

            isInMenu: () => {
                return game.isLevelMenu(currentLevel);
            },

            getGameModule: () => {
                const gamever = game.readMemoryVariable("GameVersion", manifest.executable);
                const gameKey = (gamever === 1) ? "tr5" : "tr4";
                const gameModule = Object.entries(manifest.modules)
                    .find(([moduleName, moduleMeta]) => moduleMeta.id === gameKey);

                return gameModule[0] || null;
            },

            waitForGame: async () => {
                const invalidVer = () => ![0, 1].includes(game.readMemoryVariable("GameVersion", manifest.executable));
                while (invalidVer() || game.readMemoryVariable("Level", manifest.executable) === -1) {
                    await game.delay(500);
                }
            },

            allocLaraBackups: () => {
                appearanceBackup = game.allocMemory(LARA_APPEARANCE_SIZE);
                shadowCircleBackup = game.allocMemory(LARA_SHADOW_SIZE);
                gunFlagsBackupLeft = game.allocMemory(LARA_GUNFLAG_SIZE);
                gunFlagsBackupRight = game.allocMemory(LARA_GUNFLAG_SIZE);
                hairLeftBackup = game.allocMemory(LARA_HAIR_SIZE);
                hairRightBackup = game.allocMemory(LARA_HAIR_SIZE);
                gunTypesBackup = game.allocMemory(LARA_GUNFLAG_SIZE);
                laraBackup = game.allocMemory(ENTITY_SIZE);
            },

            getAppearanceBackup: () => {
                const module = game.getGameModule();
                const outfitsPointer = game.getMemoryVariable("OutfitsPointer", module);
                const facesPointer = game.getMemoryVariable("FacesPointer", module);

                const translatedAppearanceBackup = game.allocMemory(LARA_APPEARANCE_SIZE);
                game.runFunction(module, "Clone", translatedAppearanceBackup, appearanceBackup, LARA_APPEARANCE_SIZE);

                if (translatedAppearanceBackup && !translatedAppearanceBackup.isNull()) {
                    const outfitPointerAddress = translatedAppearanceBackup.add(0x0).readPointer();
                    const facePointerAddress = translatedAppearanceBackup.add(0x8).readPointer();

                    const outfitId = parseInt(outfitPointerAddress.sub(outfitsPointer).toString()) / LARA_OUTFIT_SIZE;
                    translatedAppearanceBackup.add(0x0).writePointer(ptr(outfitId));
                    
                    const faceId = parseInt(facePointerAddress.sub(facesPointer).toString()) / LARA_FACE_SIZE;
                    translatedAppearanceBackup.add(0x8).writePointer(ptr(faceId));

                    return game.readByteArray(ptr(translatedAppearanceBackup), LARA_APPEARANCE_SIZE);
                }

                return null;
            },

            getGunFlagsBackup: () => {
                const flags = [0, 0];

                if (gunFlagsBackupLeft && !gunFlagsBackupLeft.isNull()) {
                    flags[0] = gunFlagsBackupLeft.readS16();
                }

                if (gunFlagsBackupRight && !gunFlagsBackupRight.isNull()) {
                    flags[1] = gunFlagsBackupRight.readS16();
                }

                return flags;
            },

            getGunTypesBackup: () => {
                if (gunTypesBackup && !gunTypesBackup.isNull()) {
                    return gunTypesBackup.readS16();
                }
                return game.readMemoryVariable("LaraGunType", game.getGameModule());
            },

            getLaraBonesBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                return game.readByteArray(
                    lara.add(ENTITY_BONES),
                    ENTITY_BONES_SIZE
                );
            },

            getLaraPositionsBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                return game.readByteArray(
                    lara.add(ENTITY_X),
                    ENTITY_POS_SIZE
                );
            },

            getLaraCircleShadowBackup: () => {
                if (shadowCircleBackup && !shadowCircleBackup.isNull()) {
                    return game.readByteArray(shadowCircleBackup, LARA_SHADOW_SIZE);
                }
                return null;
            },

            getLaraBasicDataBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                const moduleVariables = game.getModuleAddresses(game.getGameModule()).variables;
                
                const basePtr = ptr(lara.add(moduleVariables.LaraBasicData.Pointer));
                const data = new Uint8Array(LARA_BASIC_SIZE);
                data.set(new Uint8Array(game.readByteArray(basePtr, LARA_BASIC_SIZE - 0x2)), 0);
                data.set(new Uint8Array(lara.add(0x26).readByteArray(2)), LARA_BASIC_SIZE - 0x2);

                return data.buffer;
            },

            getLaraRoomIdBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;
                
                return lara.add(ENTITY_ROOM).readS16();
            },

            getVehicleBonesBackup: () => {
                const module = game.getGameModule();
                if (module === "tomb5.dll") return null;

                const vehicleId = game.readMemoryVariable("VehicleId", module);
                if (vehicleId == null || isNaN(parseInt(vehicleId)) || parseInt(vehicleId) < 0) return null;

                const vehiclePointer = game.getEntityPointer(vehicleId);
                if (vehiclePointer && !vehiclePointer.isNull()) {
                    return [
                        vehicleId,
                        game.readByteArray(
                            vehiclePointer.add(ENTITY_BONES),
                            ENTITY_BONES_SIZE
                        )
                    ];
                }

                return null;
            },

            setupLaraSlots: () => {
                for (let n = 0; n < MAX_PLAYERS; n++) {
                    laraSlots.push({
                        used: false,
                        pointer: game.allocMemory(ENTITY_SIZE),
                        appearance: game.allocMemory(LARA_APPEARANCE_SIZE),
                        vehicle: game.allocMemory(ENTITY_SIZE),
                        shadowCircle: game.allocMemory(LARA_SHADOW_SIZE),
                        hairLeftPointer: game.allocMemory(LARA_HAIR_SIZE),
                        hairRightPointer: game.allocMemory(LARA_HAIR_SIZE)
                    });
                }
            },

            cleanupLaraSlots: () => {
                isRendering = false;

                for (let playerConnection of otherPlayers) {
                    game.cleanupOtherPlayer(playerConnection);
                }

                otherPlayers.length = 0;

                laraSlots = laraSlots.map(s => ({...s, used: false}));
            },

            isOnlyPermaDamageEnabled: () => {
                if (userData.multiplayer) return false;

                const enabledFeatures = supportedFeatures.filter(f => userData[f.id]).map(f => f.id);

                return enabledFeatures.length === 1 && enabledFeatures[0] === 'perma-damage';
            },

            receivePlayerDisconnect: (playerId) => {
                const playerConnection = otherPlayers.find(p => p.id === playerId);
                if (playerConnection) {
                    game.cleanupOtherPlayer(playerConnection);
                }
            },

            cleanupOtherPlayer: (connection) => {
                if (!connection) return;

                if (pvpMode) {
                    const aimingEnemy = game.readMemoryVariable("LaraAimingEnemy", game.getGameModule());
                    if (String(aimingEnemy) === String(connection.laraPointer)) {
                        game.writeMemoryVariable("LaraAimingEnemy", 0x0, game.getGameModule());
                        game.writeMemoryVariable("LaraAimingYaw", 0x0, game.getGameModule());
                        game.writeMemoryVariable("LaraAimingPitch", 0x0, game.getGameModule());
                        game.writeMemoryVariable("LaraAimingLeft", 0x0, game.getGameModule());
                        game.writeMemoryVariable("LaraAimingRight", 0x0, game.getGameModule());
                    }
                }

                const slot = laraSlots.find(s => s.pointer === connection.laraPointer);
                slot && (slot.used = false);

                otherPlayers = otherPlayers.filter(o => o.id !== connection.id);
            },

            setLara: (cloneBackup = true) => {
                const module = game.getGameModule();

                try {
                    laraPointer = game.getMemoryVariable("LaraBase", module).readPointer();

                    if (!laraBackup) {
                        laraBackup = Memory.alloc(ENTITY_SIZE);
                    }
                    
                    if (!laraPointer || laraPointer.isNull()) {
                        laraPointer = null;
                    } else if (cloneBackup) {
                        game.runFunction(module, "Clone", laraBackup, laraPointer, ENTITY_SIZE);
                    }

                    currentLevel = game.readMemoryVariable("Level", manifest.executable);

                    console.log("Lara =", laraPointer);

                    return laraPointer;
                } catch (err) {
                    console.error("Unable to detect Lara", err);
                    return null;
                }
            },

            getLara: () => {
                if (!isRendering || isRendering === laraPointer) {
                    return laraPointer;
                }
                return ptr(laraBackup);
            },

            restoreLara: () => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;

                game.runFunction(module, "Clone", laraPointer, laraBackup, ENTITY_SIZE);
                game.runFunction(module, "Clone",
                    executableBase.add(game.getModuleAddresses(manifest.executable).variables.LaraAppearanceModern.Address),
                    appearanceBackup,
                    LARA_APPEARANCE_SIZE
                );
                game.runFunction(module, "Clone",
                    game.getMemoryVariable("LaraCircleShadow", module),
                    shadowCircleBackup,
                    LARA_SHADOW_SIZE
                );
                game.runFunction(module, "Clone",
                    game.getMemoryVariable("LaraHairLeftX", module),
                    hairLeftBackup,
                    LARA_HAIR_SIZE
                );
                game.runFunction(module, "Clone",
                    game.getMemoryVariable("LaraHairRightX", module),
                    hairRightBackup,
                    LARA_HAIR_SIZE
                );
                game.writeMemoryVariable("LaraGunFlagsLeft", gunFlagsBackupLeft.readS16(), module);
                game.writeMemoryVariable("LaraGunFlagsRight", gunFlagsBackupRight.readS16(), module);
                game.writeMemoryVariable("LaraGunType", gunTypesBackup.readS16(), module);
            },

            cloneLara: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) {
                    console.error("Lara is not existing, cannot spawn others!");
                    return null;
                }

                const module = game.getGameModule();
                const execVariables = game.getModuleAddresses(manifest.executable).variables;

                try {
                    const cloneLaraSlot = laraSlots.find(s => !s.used);
                    const cloneLaraPointer = cloneLaraSlot?.pointer;
                    const cloneLaraAppearance = cloneLaraSlot?.appearance;
                    const cloneLaraVehicle = cloneLaraSlot?.vehicle;
                    const cloneLaraShadow = cloneLaraSlot?.shadowCircle;
                    const cloneLaraHairLeftPointer = cloneLaraSlot?.hairLeftPointer;
                    const cloneLaraHairRightPointer = cloneLaraSlot?.hairRightPointer;

                    if (!cloneLaraSlot) {
                        console.warn("Max " + MAX_PLAYERS + " players reached, cannot clone more!");
                        return null;
                    }
                    if (!cloneLaraPointer) return null;
                    if (!cloneLaraAppearance) return null;
                    if (!cloneLaraVehicle) return null;
                    if (!cloneLaraShadow) return null;
                    if (!cloneLaraHairLeftPointer) return null;
                    if (!cloneLaraHairRightPointer) return null;

                    cloneLaraSlot.used = true;

                    game.runFunction(
                        module, 
                        "Clone", 
                        cloneLaraPointer, 
                        lara, 
                        ENTITY_SIZE
                    );

                    game.runFunction(
                        module,
                        "Clone",
                        cloneLaraAppearance,
                        executableBase.add(execVariables.LaraAppearanceModern.Address),
                        LARA_APPEARANCE_SIZE
                    );

                    game.runFunction(
                        module,
                        "Clone",
                        cloneLaraShadow,
                        game.getMemoryVariable("LaraCircleShadow", module),
                        LARA_SHADOW_SIZE
                    );

                    game.runFunction(
                        module,
                        "Clone",
                        cloneLaraHairLeftPointer,
                        game.getMemoryVariable("LaraHairLeftX", module),
                        LARA_HAIR_SIZE
                    );

                    game.runFunction(
                        module,
                        "Clone",
                        cloneLaraHairRightPointer,
                        game.getMemoryVariable("LaraHairRightX", module),
                        LARA_HAIR_SIZE
                    );

                    // Clear the state behaviour reference to avoid pvp damage freezing
                    cloneLaraPointer.add(0x58).writeS64(0);

                    return {
                        pointer: cloneLaraPointer,
                        appearance: cloneLaraAppearance,
                        vehicle: cloneLaraVehicle,
                        shadowCircle: cloneLaraShadow,
                        hairLeftPointer: cloneLaraHairLeftPointer,
                        hairRightPointer: cloneLaraHairRightPointer
                    };
                } catch (err) {
                    console.error("Failed to clone Lara", err);
                }

                return null;
            },

            getEntityPointer: (entityId) => {
                if (entityId === -1) return null;

                const entitiesPointer = game.readMemoryVariable("Entities", game.getGameModule());

                return entitiesPointer.add(ENTITY_SIZE * entityId);
            },

            updateGunModelsOG: () => {
                const execVariables = game.getModuleAddresses(manifest.executable).variables;
                const modern = executableBase.add(execVariables.LaraAppearanceModern.Address);

                const backPocket = modern.add(0x14).readS8();
                game.setPocketBackOG(backPocket);

                const leftHand = modern.add(0x10).readS8();
                const rightHand = modern.add(0x11).readS8();
                game.setGunsOG(leftHand, rightHand);

                const leftPocket = modern.add(0x12).readS8();
                const rightPocket = modern.add(0x13).readS8();
                game.setPocketsOG(leftPocket, rightPocket);
            },

            updateFaceModelOG: (angry = false) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];

                const modelsOffset = moduleBase.add(moduleVariables.OgModelsOffset).readPointer();
                const ogFaceModel = moduleBase.add(moduleVariables.OgModelsFace);
                
                if (angry) {
                    const angwyModelIndex = moduleBase.add(moduleVariables.OgModelsAngwyOffset).readS16();
                    ogFaceModel.writePointer(
                        modelsOffset.add(0xe0).add(angwyModelIndex * 8).readPointer()
                    );
                } else {
                    const weaponModelIndex = moduleBase.add(moduleVariables.OgModelsWeaponOffset).readS16();
                    ogFaceModel.writePointer(
                        modelsOffset.add(0xe0).add(weaponModelIndex * 8).readPointer()
                    );
                }
            },

            setGunsOG: (leftGun, rightGun) => {
                const gun = leftGun || rightGun;
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];

                const modelsOffset = moduleBase.add(moduleVariables.OgModelsOffset).readPointer();
                const weaponModelIndexAddress = moduleBase.add(moduleVariables.OgModelsWeaponOffset);
                const ogLeftHandModel = moduleBase.add(moduleVariables.OgModelsLeftHand);
                const ogRightHandModel = moduleBase.add(moduleVariables.OgModelsRightHand);
                const weaponModelIndexEmpty = weaponModelIndexAddress.readS16();

                if (gun) {
                    let gunIndex;
                    let flareIndex = 14;
                    let twoHandedIndices = [];
                    let itemIndices = [];

                    if (module === "tomb4.dll") {
                        gunIndex = {
                            "0": 0,
                            "17": flareIndex,
                            "5": 2,
                            "6": 4,
                            "9": 12,
                            "11": 6,
                            "12": 10,
                            "13": 8,
                            "19": 58 // torch
                        }[gun];
                        twoHandedIndices = [12, 6, 10, 8];
                        itemIndices = [flareIndex, 58]; // items held in left hand like flare
                    } else {
                        gunIndex = {
                            "0": 0,
                            "17": flareIndex,
                            "5": 2,
                            "6": 4,
                            "7": 12,
                            "8": 24,
                            "9": 12,
                            "10": 24,
                            "11": 6,
                            "15": 10,
                            "16": 8
                        }[gun];
                        twoHandedIndices = [12, 24, 6, 8, 10];
                        itemIndices = [flareIndex]; // items held in left hand like flare
                    }

                    const weaponModelIndex = weaponModelIndexAddress.add(gunIndex * parseInt("0x768", 16)).readS16();

                    if (itemIndices.includes(gunIndex) || gunIndex === 0) {
                        // flare requires empty right hand
                        ogRightHandModel.writePointer(
                            modelsOffset.add(0xa0).add(weaponModelIndexEmpty * 8).readPointer()
                        );
                    } else {
                        ogRightHandModel.writePointer(
                            modelsOffset.add(0xa0).add(weaponModelIndex * 8).readPointer()
                        );
                    }

                    if (twoHandedIndices.includes(gunIndex) || gunIndex === 0) {
                        // Some 2handed require empty hand
                        ogLeftHandModel.writePointer(
                            modelsOffset.add(0xd0).add(weaponModelIndexEmpty * 8).readPointer()
                        );
                    } else {
                        ogLeftHandModel.writePointer(
                            modelsOffset.add(0xd0).add(weaponModelIndex * 8).readPointer()
                        );
                    }
                } else {
                    ogLeftHandModel.writePointer(
                        modelsOffset.add(0xd0).add(weaponModelIndexEmpty * 8).readPointer()
                    );
                    ogRightHandModel.writePointer(
                        modelsOffset.add(0xa0).add(weaponModelIndexEmpty * 8).readPointer()
                    );
                }
            },

            setPocketsOG: (leftGun, rightGun) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];

                const ogLeftPocketModel = moduleBase.add(moduleVariables.OgModelsLeftPocket);
                const ogRightPocketModel = moduleBase.add(moduleVariables.OgModelsRightPocket);

                const gunMap = {"0": 13, "1": 14, "2": 15, "4": 16};

                ogLeftPocketModel.writeS16(gunMap[leftGun] !== undefined ? gunMap[leftGun] : 0);
                ogRightPocketModel.writeS16(gunMap[rightGun] !== undefined ? gunMap[rightGun] : 0);
            },

            setPocketBackOG: (weaponId = 5) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];

                const ogBackPocketModel = moduleBase.add(moduleVariables.OgModelsBackPocket);
                const backGun = {"5": 3, "6": 5, "7": 4}[weaponId];
                ogBackPocketModel.writeS16(backGun !== undefined ? backGun : 0);
            },

            playExplosionGraphic: (x, y, z, roomId) => {
                const module = game.getGameModule();
                const gfx1 = 2;
                const gfx2 = 0;
                game.runFunction(module, "ModernGfx", x, y, z, gfx1, -2, gfx2, roomId);
                game.runFunction(module, "ModernGfx", x, y, z, gfx1, -1, gfx2, roomId);
                game.runFunction(module, "ModernGfx", x, y, z, gfx1, -1, gfx2, roomId);
            },

            drawTextLabel: (text, fontStyle, headerFont, anchorPosition, xPos, yPos, xScale, yScale) => {
                const module = game.getGameModule();

                // 0x0 topleft, 0x2 topright, 0x8 topcenter, 0x18 middlecenter
                // 0x20 bottomleft, 0x22 bottomright, 0x28 bottomcenter
                // 0x38 middlecenter diff font, 0x84 top left diff font
                // 0x88 top center diff font, 0x98 middlecenter

                let bits = headerFont ? 0x84 : 0x0;
                if (anchorPosition === "center") {
                    bits = headerFont ? 0x88 : 0x8;
                }

                const label = ptr(game.runFunction(module, "RenderText", 0, 0, fontStyle, game.allocString(text), bits));
                label.writeFloat(xPos);
                label.add(0x4).writeFloat(yPos);
                label.add(0x4 * 0x4).writeFloat(xScale);
                label.add(0x4 * 0x5).writeFloat(yScale);

                return label;
            },

            getScreenCenter: () => {
                const module = game.getGameModule();
                const screenOffsetX = game.readMemoryVariable("UiDrawX", module);
                const screenWidth = game.readMemoryVariable("UiDrawWidth", module);
                const screenHeight = game.readMemoryVariable("UiDrawHeight", module);

                return {x: (screenWidth - screenOffsetX) / 2, y: screenHeight / 2};
            },

            worldToScreenPos: (targetX, targetY, targetZ, roomId) => {
                const lara = game.getLara();
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;

                const screenHeight = game.readMemoryVariable("UiDrawHeight", module);
                const resolutionWidth = game.readMemoryVariable("UiResWidth", module);
                const resolutionHeight = game.readMemoryVariable("UiResHeight", module);
                const cameraX = game.readMemoryVariable("CameraFixedX", module);
                const cameraY = game.readMemoryVariable("CameraFixedY", module);
                const cameraZ = game.readMemoryVariable("CameraFixedZ", module);
                const cameraYaw = game.readMemoryVariable("CameraYaw", module);
                const cameraPitch = game.readMemoryVariable("CameraPitch", module);
                const laraRoom = lara.add(ENTITY_ROOM).readS16();

                let directionX = targetX - cameraX;
                let directionY = targetY - cameraY;
                let directionZ = targetZ - cameraZ;

                // Check Line of sight
                const fromPos = game.allocMemory(0xe);
                fromPos.writeS32(cameraX);
                fromPos.add(0x4).writeS32(cameraY);
                fromPos.add(0x8).writeS32(cameraZ);
                fromPos.add(0xc).writeS16(laraRoom);
                const targetPos = game.allocMemory(0xe);
                targetPos.writeS32(targetX);
                targetPos.add(0x4).writeS32(targetY);
                targetPos.add(0x8).writeS32(targetZ);
                targetPos.add(0xc).writeS16(roomId);
                let inRangeH;
                let inRangeV;
                if (((targetX - cameraX ^ directionX) - directionX) < ((targetY - cameraY ^ directionY) - directionY)) {
                    inRangeH = game.runFunction(module, "TraceRangeX", fromPos, targetPos);
                    inRangeV = game.runFunction(module, "TraceRangeZ", fromPos, targetPos);
                } else {
                    inRangeH = game.runFunction(module, "TraceRangeZ", fromPos, targetPos);
                    inRangeV = game.runFunction(module, "TraceRangeX", fromPos, targetPos);
                }
                if (inRangeH !== 1 || inRangeV !== 1) return null;
                const inLOS = game.runFunction(module, "GetLOS", fromPos, targetPos);
                if (inLOS === 0) return null;

                // Check field of view
                let relativeYawPitch = game.allocMemory(4);
                game.runFunction(module, "CalculateYawPitch", directionX, directionY, directionZ, relativeYawPitch);
                let yawDiff = (Math.abs(relativeYawPitch.readU16() - cameraYaw) + 32768) % 65536 - 32768;
                if (yawDiff < 0) yawDiff += 65536;
                let pitchDiff = (Math.abs(relativeYawPitch.add(0x2).readU16() - cameraPitch) + 32768) % 65536 - 32768;
                if (pitchDiff < 0) pitchDiff += 65536;
                const isWithinYawFOV = (yawDiff < 14071 || yawDiff > 50000);
                const isWithinPitchFOV = (pitchDiff < 10921 || pitchDiff > 34595);
                const isWithinFOV = isWithinYawFOV && isWithinPitchFOV;
                if (!isWithinFOV) return null;

                // Translate to 2d
                const cameraRightX = game.readMemoryVariable("CameraRightX", module);
                const cameraRightY = game.readMemoryVariable("CameraRightY", module);
                const cameraRightZ = game.readMemoryVariable("CameraRightZ", module);
                const cameraUpX = game.readMemoryVariable("CameraUpX", module);
                const cameraUpY = game.readMemoryVariable("CameraUpY", module);
                const cameraUpZ = game.readMemoryVariable("CameraUpZ", module);
                const cameraForwardX = game.readMemoryVariable("CameraForwardX", module);
                const cameraForwardY = game.readMemoryVariable("CameraForwardY", module);
                const cameraForwardZ = game.readMemoryVariable("CameraForwardZ", module);
                
                const cameraSpaceX = directionZ * cameraRightZ + directionY * cameraRightY + directionX * cameraRightX;
                const cameraSpaceY = directionX * cameraUpX + directionZ * cameraUpZ + directionY * cameraUpY;
                const cameraSpaceZ = directionX * cameraForwardX + directionZ * cameraForwardZ + directionY * cameraForwardY;
                
                const fovScaled = game.readMemoryVariable("CameraFov", module);
                let fovResolution = game.readMemoryVariable("ResolutionH", manifest.executable);

                const screenX = (screenHeight * (cameraSpaceX / (cameraSpaceZ / fovScaled) + resolutionWidth)) / fovResolution;
                const screenY = (screenHeight * (cameraSpaceY / (cameraSpaceZ / fovScaled) + resolutionHeight)) / fovResolution;
                
                return {x: screenX, y: screenY};
            },

            keyBindingPressed: (key) => {
                const module = game.getGameModule();

                switch (key) {
                    case "F2":
                        game.runFunction(module, "SoundEffect", 0x71, ptr(0x0), 2);
                        modMenuState.lastInteraction = Date.now();
                        if (!modMenuState.isOpen) {
                            modMenuState.isOpen = true;
                            modMenuState.activeSubmenu = null;
                        } else if (modMenuState.activeSubmenu) {
                            const item = MOD_MENU_ITEMS[modMenuState.selectedIndex];
                            const submenuItems = item.getSubmenuItems();
                            if (submenuItems.length > 0) {
                                modMenuState.submenuSelectedIndex =
                                    (modMenuState.submenuSelectedIndex + 1) % submenuItems.length;
                            }
                        } else {
                            modMenuState.selectedIndex =
                                (modMenuState.selectedIndex + 1) % MOD_MENU_ITEMS.length;
                        }
                        break;

                    case "F4":
                        if (!modMenuState.isOpen) return;
                        if (Date.now() - modMenuState.lastInteraction > MOD_MENU_TIMEOUT) {
                            game.closeModMenu();
                            return;
                        }

                        game.runFunction(module, "SoundEffect", 0x70, ptr(0x0), 2);
                        modMenuState.lastInteraction = Date.now();
                        const selectedItem = MOD_MENU_ITEMS[modMenuState.selectedIndex];

                        if (selectedItem.isDisabled()) return;

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

                    case "F8":
                        if (!userData.enableChat) break;
                        game.toggleChat();
                        break;
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

            teleportToPlayer: (playerConnection) => {
                const module = game.getGameModule();
                const lara = game.getLara();
                if (!lara || lara.isNull()) return;

                if (module === "tomb4.dll") {
                    const vehicleId = game.readMemoryVariable("VehicleId", module);
                    if (vehicleId != null && !isNaN(parseInt(vehicleId)) && parseInt(vehicleId) >= 0) return;
                }

                const otherLara = playerConnection?.laraPointer;
                if (!otherLara) return;

                game.writeByteArray(lara.add(ENTITY_X),
                    game.readByteArray(otherLara.add(ENTITY_X), ENTITY_POS_SIZE));

                const roomId = otherLara.add(ENTITY_ROOM).readS16();
                if (!isRendering || isRendering === lara) {
                    game.runFunction(module, "RoomChange",
                        game.readMemoryVariable("LaraId", module), roomId);
                } else {
                    changedPlayerRoom = roomId;
                }

                send({
                    event: "multiplayer:sendChat",
                    args: { text: userData.name + " teleported to " + playerConnection.name, chatAction: true }
                });
            },

            isModMenuTimedOut: () => modMenuState.isOpen && (Date.now() - modMenuState.lastInteraction > MOD_MENU_TIMEOUT),

            renderModMenu: (module) => {
                if (game.isModMenuTimedOut()) { game.closeModMenu(); return; }
                if (!modMenuState.isOpen) return;

                const moduleAddresses = game.getModuleAddresses(module);
                game.runFunction(module, "DrawSetup", moduleAddresses.uiLayer, ptr(0x0));

                const screenWidth = game.readMemoryVariable("UiDrawWidth", module);
                const screenX = game.readMemoryVariable("UiDrawX", module);
                const centerX = screenX + ((screenWidth - screenX) / 2);

                const menuWidth = 90, itemHeight = 12, padding = 3;
                const titleHeight = 19;

                let items = [], title = "Multiplayer Menu";
                if (modMenuState.activeSubmenu) {
                    const selectedItem = MOD_MENU_ITEMS[modMenuState.selectedIndex];
                    title = typeof selectedItem.label === 'function' ? selectedItem.label() : selectedItem.label;
                    const submenuItems = selectedItem.getSubmenuItems();
                    items = submenuItems.length > 0
                        ? submenuItems.map(si => ({ text: si.label, disabled: false }))
                        : [{ text: "(No items)", disabled: true }];
                } else {
                    items = MOD_MENU_ITEMS.map(mi => ({
                        text: typeof mi.label === 'function' ? mi.label() : mi.label,
                        disabled: mi.isDisabled(),
                        hasSubmenu: mi.hasSubmenu
                    }));
                }

                const selectedIdx = modMenuState.activeSubmenu ? modMenuState.submenuSelectedIndex : modMenuState.selectedIndex;

                const visibleCount = Math.min(items.length, MOD_MENU_MAX_VISIBLE);
                const needsScroll = items.length > MOD_MENU_MAX_VISIBLE;
                const arrowHeight = needsScroll ? 8 : 0;
                let scrollOffset = 0;
                if (needsScroll) {
                    scrollOffset = Math.max(0, Math.min(selectedIdx - 2, items.length - MOD_MENU_MAX_VISIBLE));
                }

                const totalHeight = titleHeight + arrowHeight + (visibleCount * itemHeight) + arrowHeight + padding;
                const menuX = centerX - (menuWidth / 2), menuY = 14;

                // Background
                const titleY = menuY + titleHeight;
                game.runFunction(module, "DrawRect", menuX, menuY, menuX + menuWidth, titleY, 0xFF000000, 0xFF000000);
                game.runFunction(module, "DrawRect", menuX, titleY, menuX + menuWidth, menuY + totalHeight, 0xCC1a1a1a, 0xCC1a1a1a);

                // Border
                const border = 0xFF3a3a3a;
                game.runFunction(module, "DrawRect", menuX, menuY, menuX + menuWidth, menuY, border, border);
                game.runFunction(module, "DrawRect", menuX, menuY + totalHeight, menuX + menuWidth, menuY + totalHeight, border, border);
                game.runFunction(module, "DrawRect", menuX, menuY, menuX, menuY + totalHeight, border, border);
                game.runFunction(module, "DrawRect", menuX + menuWidth, menuY, menuX + menuWidth, menuY + totalHeight, border, border);
                game.runFunction(module, "DrawRect", menuX, titleY, menuX + menuWidth, titleY, border, border);

                // Selection highlight
                const itemsStartY = titleY + arrowHeight + padding;
                const labelYOffset = 6; // Offset to align labels with DrawRect (same as TRR-123)
                if (items.length > 0 && selectedIdx < items.length) {
                    const relativeIdx = selectedIdx - scrollOffset;
                    const highlightY = itemsStartY + (relativeIdx * itemHeight);
                    game.runFunction(module, "DrawRect", menuX + 2, highlightY - 1, menuX + menuWidth - 2, highlightY + itemHeight - 2, 0x80555555, 0x80555555);
                }

                // Title
                game.drawTextLabel(title, 0, false, "center", 0, menuY + 3 + labelYOffset, 0.4, 0.4);

                // F2/F4 hints
                const hintY = menuY + 9 + labelYOffset;
                game.drawTextLabel("F2 Navigate", 0, false, "center", -22, hintY, 0.25, 0.25);
                game.drawTextLabel("F4 Confirm", 0, false, "center", 24, hintY, 0.25, 0.25);

                // Scroll arrows
                if (needsScroll) {
                    const canScrollUp = scrollOffset > 0;
                    const canScrollDown = scrollOffset + MOD_MENU_MAX_VISIBLE < items.length;
                    const upArrowY = titleY + labelYOffset;
                    const downArrowY = itemsStartY + (visibleCount * itemHeight) + 5;
                    if (canScrollUp) {
                        game.drawTextLabel("...", 0, false, "center", 0, upArrowY, 0.25, 0.25);
                    }
                    if (canScrollDown) {
                        game.drawTextLabel("...", 0, false, "center", 0, downArrowY, 0.25, 0.25);
                    }
                }

                // Item labels
                for (let v = 0; v < visibleCount; v++) {
                    const itemIdx = scrollOffset + v;
                    const item = items[itemIdx];
                    const itemY = itemsStartY + (v * itemHeight) + labelYOffset;
                    const prefix = item.disabled ? "* " : "";
                    const suffix = item.hasSubmenu ? " >" : "";
                    game.drawTextLabel(prefix + item.text + suffix, 0, false, "center", 0, itemY, 0.3, 0.3);
                }
            },
            
            enterPhotoMode: () => {
                game.closeChat();
            },

            exitPhotoMode: () => {
                //
            },

            openChat: () => {
                chatOpened = true;
            },

            closeChat: () => {
                chatOpened = false;
            },

            toggleChat: () => {
                if (chatOpened) game.closeChat();
                else game.openChat();
            },

            receiveChat: (name, time, text, chatAction = false) => {
                if (!userData.enableChat) return;
                if (!name || !time || !text?.length) return;
                chatMessages = chatMessages || [];
                chatMessages.push({name, time, text, chatAction});
                chatMessages.sort((a, b) => new Date(a.time) - new Date(b.time));
                chatMessages = chatMessages.slice(-6);
            },

            receivePlayerData: (playerId, playerData) => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return; // not ready for other players
                if (!playerId) return;

                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;

                let playerConnection = otherPlayers.find(p => p.id === playerId);
                if (!playerConnection) {
                    playerConnection = {
                        id: playerId,
                        hasFreshRenderState: true,
                        name: playerId,
                        laraPointer: null,
                        appearance: null,
                        shadowCircle: null,
                        hairLeftPointer: null,
                        hairRightPointer: null,
                        resetHair: true,
                        weaponEquipped: null,
                        firingGun1: 0,
                        firingGun2: 0,
                        firingFlare: 0,
                        health: 0,
                        roomType: 0,
                        vehicleId: null,
                        vehicle: null,
                        distance: 999999999,
                        withinFOV: true,
                        timeLastData: Date.now(),
                        timeConnected: Date.now(),
                        isLoaded: false,
                        vehicleLoaded: false,
                        pvpMode: false,
                        _seq: 0
                    };
                    otherPlayers.push(playerConnection);

                    const cloned = game.cloneLara();
                    if (!cloned?.pointer) {
                        return;
                    }

                    playerConnection.appearance = cloned.appearance;
                    playerConnection.shadowCircle = cloned.shadowCircle;
                    playerConnection.laraPointer = cloned.pointer;
                    playerConnection.vehicle = cloned.vehicle;
                    playerConnection.hairLeftPointer = cloned.hairLeftPointer;
                    playerConnection.hairRightPointer = cloned.hairRightPointer;
                } else {
                    if (playerData._seq !== undefined && playerConnection._seq !== undefined) {
                        const diff = (playerConnection._seq - playerData._seq) & 0xFF;
                        if (diff > 0 && diff < 128) return;
                    }
                    playerConnection._seq = playerData._seq;
                }

                playerConnection.hasFreshRenderState = true;
                playerConnection.timeLastData = Date.now();

                const otherLara = playerConnection.laraPointer;
                if (otherLara) {
                    if ("room" in playerData && !isNaN(parseInt(playerData.room))) {
                        otherLara.add(ENTITY_ROOM).writeS16(parseInt(playerData.room));
                    }

                    if ("basicData" in playerData && playerData.basicData) {
                        const decodedBasicData = game.decodeMemoryBlock(playerData.basicData);
                        if (decodedBasicData.length === LARA_BASIC_SIZE) {
                            game.writeByteArray(
                                otherLara.add(moduleVariables.LaraBasicData.Pointer),
                                decodedBasicData.slice(0, -0x2)
                            );
                            const newHealth = new DataView(new Uint8Array(decodedBasicData.slice(-0x2)).buffer).getInt16(0, true);
                            playerConnection.laraPointer.add(ENTITY_HEALTH).writeS16(newHealth);
                            playerConnection.health = Math.min(1000, Math.max(0, newHealth));
                        }
                    }

                    if ("positions" in playerData && playerData.positions) {
                        const decodedPosData = game.decodeMemoryBlock(playerData.positions);
                        if (decodedPosData.length === ENTITY_POS_SIZE) {
                            if (!playerConnection.isLoaded) {
                                game.writeByteArray(
                                    otherLara.add(ENTITY_LAST_X),
                                    decodedPosData
                                );

                                if (playerConnection.vehicle && !playerConnection.vehicle.isNull()) {
                                    game.writeByteArray(
                                        playerConnection.vehicle.add(ENTITY_LAST_X),
                                        decodedPosData
                                    );
                                }
                            } else {
                                // Store last pos
                                game.runFunction(
                                    module,
                                    "Clone",
                                    otherLara.add(ENTITY_LAST_X),
                                    otherLara.add(ENTITY_X),
                                    ENTITY_POS_NO_ROT_SIZE
                                );

                                if (playerConnection.vehicle && !playerConnection.vehicle.isNull()) {
                                    game.runFunction(
                                        module,
                                        "Clone",
                                        playerConnection.vehicle.add(ENTITY_LAST_X),
                                        playerConnection.vehicle.add(ENTITY_X),
                                        ENTITY_POS_NO_ROT_SIZE
                                    );
                                }
                            }

                            // Update pos
                            game.writeByteArray(
                                otherLara.add(ENTITY_X),
                                decodedPosData
                            );

                            if (playerConnection.vehicle && !playerConnection.vehicle.isNull()) {
                                // Update vehicle pos
                                game.writeByteArray(
                                    playerConnection.vehicle.add(ENTITY_X),
                                    decodedPosData
                                );
                            }
                        }
                    }

                    if ("bones" in playerData && playerData.bones) {
                        const decodedBonesData = game.decodeMemoryBlock(playerData.bones);
                        if (decodedBonesData.length === ENTITY_BONES_SIZE) {
                            if (!playerConnection.isLoaded) {
                                game.writeByteArray(
                                    otherLara.add(ENTITY_LAST_BONES),
                                    decodedBonesData
                                );
                            } else {
                                // Store last bones
                                game.runFunction(
                                    module,
                                    "Clone",
                                    otherLara.add(ENTITY_LAST_BONES),
                                    otherLara.add(ENTITY_BONES),
                                    ENTITY_MATRICES_SIZE
                                );
                            }

                            game.writeByteArray(
                                otherLara.add(ENTITY_BONES),
                                decodedBonesData
                            );
                        }
                    }

                    if ("shadows" in playerData && playerData.shadows) {
                        const decodedShadowData = game.decodeMemoryBlock(playerData.shadows);
                        if (decodedShadowData.length === LARA_SHADOW_SIZE) {
                            game.writeByteArray(playerConnection.shadowCircle, decodedShadowData);
                        }
                    }

                    if ("appearance" in playerData && playerData.appearance) {
                        const originalOutfitPointerAddress = playerConnection.appearance.add(0x0).readPointer();

                        const decodedAppearanceData = game.decodeMemoryBlock(playerData.appearance);
                        if (decodedAppearanceData.length === LARA_APPEARANCE_SIZE) {
                            const tempDecodedAppearance = game.allocMemory(LARA_APPEARANCE_SIZE);
                            game.writeByteArray(tempDecodedAppearance, decodedAppearanceData);

                            const outfitsPointer = game.getMemoryVariable("OutfitsPointer", module);
                            const outfitId = tempDecodedAppearance.add(0x0).readU64();
                            const outfitPointerAddress = outfitsPointer.add(outfitId * LARA_OUTFIT_SIZE);
                            tempDecodedAppearance.add(0x0).writePointer(outfitPointerAddress);

                            const facesPointer = game.getMemoryVariable("FacesPointer", module);
                            const faceId = tempDecodedAppearance.add(0x8).readU64();
                            const facePointerAddress = facesPointer.add(faceId * LARA_FACE_SIZE);
                            tempDecodedAppearance.add(0x8).writePointer(facePointerAddress);

                            game.writeByteArray(playerConnection.appearance, game.readByteArray(ptr(tempDecodedAppearance), LARA_APPEARANCE_SIZE));

                            if (!outfitPointerAddress.equals(originalOutfitPointerAddress)) {
                                playerConnection.resetHair = true;
                            }
                        }
                    }

                    if (module === "tomb4.dll" && "vehicleId" in playerData && !isNaN(parseInt(playerData.vehicleId))) {
                        const oldVehicleId = playerConnection.vehicleId;
                        playerConnection.vehicleId = parseInt(playerData.vehicleId);
                        if (playerConnection.vehicleId < 0) {
                            playerConnection.vehicleId = null;
                        }

                        if (playerConnection.vehicleId != null && oldVehicleId !== playerConnection.vehicleId) {
                            const vehiclePointer = game.getEntityPointer(playerConnection.vehicleId);
                            if (vehiclePointer && !vehiclePointer.isNull()) {
                                try {
                                    game.runFunction(
                                        module,
                                        "Clone",
                                        playerConnection.vehicle,
                                        vehiclePointer,
                                        ENTITY_SIZE
                                    );
                                    game.runFunction(
                                        module,
                                        "Clone",
                                        playerConnection.vehicle.add(ENTITY_X),
                                        otherLara.add(ENTITY_X),
                                        ENTITY_POS_NO_ROT_SIZE
                                    );
                                    game.runFunction(
                                        module,
                                        "Clone",
                                        playerConnection.vehicle.add(ENTITY_LAST_X),
                                        otherLara.add(ENTITY_LAST_X),
                                        ENTITY_POS_NO_ROT_SIZE
                                    );
                                } catch (err) { }
                            }
                        } else if (playerConnection.vehicleId === null) {
                            playerConnection.vehicleLoaded = false;
                        }
                    }

                    if (module === "tomb4.dll" && "vehicleBones" in playerData && playerData.vehicleBones) {
                        const decodedVehicleBonesData = game.decodeMemoryBlock(playerData.vehicleBones);
                        if (decodedVehicleBonesData.length === ENTITY_BONES_SIZE) {
                            if (!playerConnection.vehicleLoaded) {
                                game.writeByteArray(
                                    playerConnection.vehicle.add(ENTITY_LAST_BONES),
                                    decodedVehicleBonesData
                                );
                            } else {
                                // Store last bones
                                game.runFunction(
                                    module,
                                    "Clone",
                                    playerConnection.vehicle.add(ENTITY_LAST_BONES),
                                    playerConnection.vehicle.add(ENTITY_BONES),
                                    ENTITY_MATRICES_SIZE
                                );
                            }

                            game.writeByteArray(
                                playerConnection.vehicle.add(ENTITY_BONES),
                                decodedVehicleBonesData
                            );
                        }
                    }

                    if ("gunTypes" in playerData && !isNaN(parseInt(playerData.gunTypes))) {
                        playerConnection.weaponEquipped = parseInt(playerData.gunTypes);
                    }

                    if ("gunFire1" in playerData && !isNaN(parseInt(playerData.gunFire1))) {
                        playerConnection.firingGun1 = parseInt(playerData.gunFire1);
                    }

                    if ("gunFire2" in playerData && !isNaN(parseInt(playerData.gunFire2))) {
                        playerConnection.firingGun2 = parseInt(playerData.gunFire2);
                    }

                    if ("flareFire" in playerData && !isNaN(parseInt(playerData.flareFire)) && parseInt(playerData.flareFire) > 0) {
                        playerConnection.firingFlare = parseInt(playerData.flareFire);
                    }

                    if ("roomType" in playerData && !isNaN(parseInt(playerData.roomType))) {
                        playerConnection.roomType = parseInt(playerData.roomType);
                        if (isNaN(playerConnection.roomType)) {
                            playerConnection.roomType = 0;
                        }
                    }

                    if ("name" in playerData) {
                        playerConnection.name = playerData.name || "Unknown";
                    } else {
                        playerConnection.name = "Unknown";
                    }

                    if ("pvpMode" in playerData) {
                        playerConnection.pvpMode = !!playerData.pvpMode;
                    } else {
                        playerConnection.pvpMode = false;
                    }

                    playerConnection.vehicleLoaded = playerConnection.vehicleLoaded || "vehicleBones" in playerData && playerData.vehicleBones;
                    playerConnection.isLoaded = playerConnection.isLoaded || "positions" in playerData && playerData.positions;
                }
            },

            receivePVP: (pvpPlayer, pvpDamage, pvpWeapon) => {
                if (!pvpMode) return;
                if (pvpDamage > 30) return;

                const lara = game.getLara();
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;

                const playerConnection = otherPlayers.find(o => o.id === pvpPlayer);
                if (playerConnection?.laraPointer && playerConnection.isLoaded && playerConnection.distance < 16000 ** 2) {
                    const health = lara.add(ENTITY_HEALTH).readS16();
                    if (health > 0) {
                        let newHealth = health - (pvpDamage * 15);
                        if (newHealth < 0) newHealth = 0;
                        lara.add(ENTITY_HEALTH).writeS16(newHealth);

                        const flameWeapons = [0x12];
                        if (flameWeapons.includes(pvpWeapon)) {
                            game.playExplosionGraphic(
                                lara.add(ENTITY_X).readS32(), 
                                lara.add(ENTITY_Y).readS32() + -500, 
                                lara.add(ENTITY_Z).readS32(), 
                                lara.add(ENTITY_ROOM).readU16()
                            );
                        }

                        if (newHealth <= 0) {
                            send({
                                event: "multiplayer:sendChat",
                                args: {text: playerConnection.name + " killed " + userData.name, chatAction: true}
                            });
                        }
                    }
                }
            },

            receiveAudio: (s, sf, p) => {
                const playerConnection = otherPlayers.find(o => o.id === p);
                const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);
                if (playerConnection?.laraPointer && playerConnection.isLoaded && (isPhotoMode === 1 || playerConnection.distance < 15000 ** 2)) {
                    game.runFunction(game.getGameModule(), "SoundEffect", s, playerConnection.laraPointer.add(ENTITY_X), sf);
                }
            },

            setupMenuPlayersText: (_li) => {
                levelsInfo = _li;
            },

            updateLoop: () => {
                if (exiting) return;

                const lara = game.getLara();

                for (let playerConnection of otherPlayers) {
                    // remove players who didnt update recently
                    const lastTime = playerConnection.timeLastData || playerConnection.timeConnected;
                    if (Date.now() - lastTime >= 1000 * 11) {
                        game.cleanupOtherPlayer(playerConnection);
                    }

                    if (!lara || !playerConnection?.laraPointer) continue;

                    // calc distance to the player
                    const them = playerConnection.laraPointer;
                    let xDiff = them.add(ENTITY_X).readS32() - lara.add(ENTITY_X).readS32();
                    let yDiff = them.add(ENTITY_X).add(0x4).readS32() - lara.add(ENTITY_X).add(0x4).readS32();
                    let zDiff = them.add(ENTITY_X).add(0x8).readS32() - lara.add(ENTITY_X).add(0x8).readS32();
                    playerConnection.distance = xDiff ** 2 + yDiff ** 2 + zDiff ** 2;
                }

                // chat messages
                chatMessages = chatMessages.filter(msg => msg && (Date.now() - msg.time < (1000 * (msg.name ? 900 : 60))));
            },

            updateLaunchOptions(options) {
                playerNamesMode = isNaN(parseInt(options.playerNamesMode)) ? 1 : parseInt(options.playerNamesMode);
                userData = {...userData, ...options};

                if (!userData.enableChat) {
                    game.closeChat();
                    chatMessage = "";
                }
            },

            cleanup: async () => {
                exiting = true;

                if (userData.multiplayer) {
                    if (isRendering && isRendering !== laraPointer) {
                        game.restoreLara();
                    }

                    for (let playerConnection of otherPlayers) {
                        game.cleanupOtherPlayer(playerConnection);
                    }

                    game.cleanupLaraSlots();
                }

                game.cleanupFeatures(supportedFeatures);
                await game.cleanupHooks();
                console.log('TRR-45 game cleanup complete');
            }
        };

        hooksExecution = {
            KeyboardInput: {
                before: (module, keycode) => {
                    const lara = game.getLara();
                    if (exiting || !lara || lara.isNull()) {
                        return;
                    }

                    keycode = parseInt(keycode, 16);

                    const gameModule = game.getGameModule();
                    
                    const currentTime = Date.now();
                    if (!(currentTime - (lastKeyPressTime[keycode] || 0) >= 175)) {
                        return;
                    }
                    lastKeyPressTime[keycode] = currentTime;

                    if (userData.multiplayer) {
                        const isGameMenu = game.readMemoryVariable("IsGameMenu", manifest.executable);
                        const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);
                        if (isPhotoMode === 1 || isGameMenu === 1) {
                            return;
                        }

                        const charMap = {
                            "0": ["\x11", "\x11"],
                            "1": ["\x12", "\x12"],
                            "2": ["\x10", "\x10"],
                            "3": ["\x0f", "\x0f"],
                            "4": [" ", " "],
                            "5": ["    ", "    "],
                            "6": ["enter", "enter"],
                            "7": ["esc", "esc"],
                            "11": ["0", ")"],
                            "12": ["1", "!"],
                            "13": ["2", "\\""],
                            "14": ["3", "£"],
                            "15": ["4", "$"],
                            "16": ["5", "%"],
                            "17": ["6", "^"],
                            "18": ["7", "&"],
                            "19": ["8", "*"],
                            "20": ["9", "("],
                            "21": ["a", "A"],
                            "22": ["b", "B"],
                            "23": ["c", "C"],
                            "24": ["d", "D"],
                            "25": ["e", "E"],
                            "26": ["f", "F"],
                            "27": ["g", "G"],
                            "28": ["h", "H"],
                            "29": ["i", "I"],
                            "30": ["j", "J"],
                            "31": ["k", "K"],
                            "32": ["l", "L"],
                            "33": ["m", "M"],
                            "34": ["n", "N"],
                            "35": ["o", "O"],
                            "36": ["p", "P"],
                            "37": ["q", "Q"],
                            "38": ["r", "R"],
                            "39": ["s", "S"],
                            "40": ["t", "T"],
                            "41": ["u", "U"],
                            "42": ["v", "V"],
                            "43": ["w", "W"],
                            "44": ["x", "X"],
                            "45": ["y", "Y"],
                            "46": ["z", "Z"],
                            "47": ["0", "0"],
                            "48": ["1", "1"],
                            "49": ["2", "2"],
                            "50": ["3", "3"],
                            "51": ["4", "4"],
                            "52": ["5", "5"],
                            "53": ["6", "6"],
                            "54": ["7", "7"],
                            "55": ["8", "8"],
                            "56": ["9", "9"],
                            "57": ["+", "\x13"],
                            "58": ["-", "\x14"],
                            "59": ["*", "\x15"],
                            "60": ["/", "\x16"],
                            "61": [".", "."],
                            "62": ["F1", "F1"],
                            "63": ["F2", "F2"],
                            "64": ["F3", "F3"],
                            "65": ["F4", "F4"],
                            "66": ["F5", "F5"],
                            "67": ["F6", "F6"],
                            "68": ["F7", "F7"],
                            "69": ["F8", "F8"],
                            "70": ["F9", "F9"],
                            "71": ["F10", "F10"],
                            "72": ["F11", "F11"],
                            "73": ["F12", "F12"],
                            "74": ["-", "_"],
                            "75": ["=", "+"],
                            "76": ["[", "{"],
                            "77": ["]", "}"],
                            "78": ["/", "?"],
                            "79": ["\\\\", "|"],
                            "80": [",", "<"],
                            "81": [".", ">"],
                            "82": ["'", "@"],
                            "83": [";", ":"],
                            "84": ["#", "~"],
                            "85": ["<on-icon>", "<on-icon>"],
                            "86": ["<on-icon>", "<on-icon>"],
                            "87": ["<on-icon>", "<on-icon>"],
                            "88": ["<off-icon>", "<off-icon>"],
                            "89": ["<off-icon>", "<off-icon>"],
                            "90": ["<on-icon>", "<on-icon>"],
                            "91": ["backspace", "backspace"]
                        };

                        if (keycode >= 62 && keycode <= 73) {
                            // F Keys
                            const fKey = charMap[keycode]?.[0];
                            if (fKey && ["F2", "F4", "F8"].includes(fKey)) {
                                game.keyBindingPressed(fKey);
                            }
                        } else if (chatOpened && userData.enableChat) {
                            const isPressingShift = game.getMemoryVariable("KeyIsPressed", manifest.executable).add(0x8).readS8();
                            const key = charMap[keycode]?.[isPressingShift ? 1 : 0];
                            if (key) {
                                if (key === "esc") {
                                    game.closeChat();
                                } else if (key === "enter") {
                                    if (chatMessage.length > 0) {
                                        if (chatMessage.toLowerCase().trim() === "/quiz") {
                                            game.runQuiz();
                                        } else {
                                            send({event: "multiplayer:sendChat", args: {text: chatMessage}});
                                        }
                                        chatMessage = "";
                                    }
                                    game.closeChat();
                                } else if (key === "backspace") {
                                    if (chatMessage.length > 0) {
                                        chatMessage = chatMessage.substring(0, chatMessage.length - 1);
                                    }
                                } else {
                                    chatMessage += key;
                                    if (chatMessage.length > 50) {
                                        chatMessage = chatMessage.substring(0, 50);
                                    }
                                }
                            }
                        }
                    }
                },
                after: (module, keycode) => {
                    if (chatOpened) {
                        game.writeMemoryVariable("KeyToControl", 0, manifest.executable);
                        return 0x0;
                    }
                }
            },

            LoadedLevel: {
                before: (module, p1) => {
                    levelIsRestarting = (levelLastLoadedId === currentLevel);
                    levelLastLoadedId = currentLevel;
                    laraPointer = null;
                    isRendering = false;
                    isSimulatingHair = false;

                    if (userData.multiplayer) {
                        game.cleanupLaraSlots();
                    }
                }
            },

            InitializeLevelAI: {
                after: (module, p1) => {
                    laraPointer = null;
                    isRendering = false;
                    game.setLara();

                    const lara = game.getLara();

                    if (userData.multiplayer) {
                        game.cleanupLaraSlots();
                        game.closeModMenu();

                        if (!initiatedChat) {
                            initiatedChat = true;
                            chatMessages = [
                                {time: Date.now(), name: null, text: "Welcome to Tomb Raider Multiplayer.  [ko-fi.com/burn_sours]"},
                                {time: Date.now(), name: null, text: "Type /quiz for trivia - credits to @joef93"},
                                {time: Date.now(), name: null, text: "[F2] Menu, [F4] Confirm, [F8] Chat"}
                            ];
                        }
                    }
                }
            },

            RenderUI: {
                before: (module) => {
                    const lara = game.getLara();
                    if (exiting || !lara || lara.isNull()) return;

                    const moduleAddresses = game.getModuleAddresses(module);
                    const moduleVariables = moduleAddresses.variables;
                    const moduleUiLayer = moduleAddresses.uiLayer;

                    const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);
                    if (isPhotoMode > 0) return;

                    const levelChange = game.readMemoryVariable("LevelChange", module);
                    if (levelChange > 0) return;

                    if (!userData.multiplayer) {
                        // Top label
                        const levelName = game.isInMenu() ? "Main Menu" : game.levelName(currentLevel);
                        if (levelName === "Unknown Level") return;

                        const isPermaDamageOnly = game.isOnlyPermaDamageEnabled();
                        const labelText = isPermaDamageOnly ? permaDamageText : modsText;
                        let displayText = labelText + " (" + levelName + ")";
                        if (isPermaDamageOnly) {
                            displayText += " - " + userData.gameHash.substring(0, 8);
                            if (game.isInGame()) {
                                const health = Math.max(0, lara.add(ENTITY_HEALTH).readS16());
                                displayText += " - HP: " + health;
                            }
                        }
                        game.drawTextLabel(displayText, 0, true, null, 2, 5, .25, .25);
                        return;
                    }

                    if (game.isInMenu()) {
                        // Main Menu
                        game.runFunction(module, "DrawSetup", moduleUiLayer, ptr(0x0));

                        // Top label
                        const lobbyName = (!userData.hideLobbyCode && userData.lobbyCode?.length && userData.lobbyCode !== "_" ? userData.lobbyCode + "; " : "");
                        game.drawTextLabel(multiplayerText + " (" + lobbyName + "Main Menu)", 0, true, null, 2, 5, .25, .25);

                        let labelsYOffset = 19;
                        for (let lvl of levelsInfo) {
                            const isMenu = game.isLevelMenu(lvl.lvl);
                            if (game.isLevelSupported(lvl.lvl) || isMenu) {
                                const levelName = isMenu ? "Main Menu" : game.levelName(lvl.lvl);
                                game.drawTextLabel("[" + levelName + "]: " + Number(lvl.players) + " players", 0, true, null, 6, labelsYOffset, .25, .25);

                                labelsYOffset += 8;
                            }
                        }

                        return;
                    }

                    const isGameMenu = game.readMemoryVariable("IsGameMenu", manifest.executable);
                    if (isGameMenu > 0) {
                        const players = otherPlayers.length + 1;
                        const lobbyName = (!userData.hideLobbyCode && userData.lobbyCode?.length && userData.lobbyCode !== "_" ? userData.lobbyCode + "; " : "");
                        const topTextFinal = multiplayerText + " (" + lobbyName + game.levelName(currentLevel) + ": " + players + " players)";
                        game.drawTextLabel(topTextFinal, 0, true, null, 2, 5, .25, .25);
                        return;
                    }

                    game.runFunction(module, "DrawSetup", moduleUiLayer, ptr(0x0));

                    //
                    const othersCount = otherPlayers.length;
                    if (playerNamesMode > 0) {
                        let drawYOffset = 20;
                        let labelsYOffset = 20 + 3.5;
                        for (let playerConnection of otherPlayers) {
                            if (!playerConnection.isLoaded || (playerConnection.distance > 12000 ** 2) || !playerConnection.withinFOV) {
                                continue;
                            }

                            let isFacing;
                            let x = game.readMemoryVariable("UiDrawX", module);
                            let y;

                            if (playerNamesMode > 1) {
                                // Above head
                                const yOffset = (playerConnection.roomType === 1 || playerConnection.roomType === 2 ? -400 : -850);
                                const interpolate = Math.min(1, (Date.now() - playerConnection.timeLastData) / 33);
                                const lerp = (oldVal, newVal) => oldVal + (newVal - oldVal) * interpolate;

                                const currPos = playerConnection.laraPointer.add(ENTITY_X);
                                const oldPos = playerConnection.laraPointer.add(ENTITY_LAST_X);

                                const smoothX = lerp(oldPos.readS32(), currPos.readS32());
                                const smoothY = lerp(oldPos.add(4).readS32(), currPos.add(4).readS32());
                                const smoothZ = lerp(oldPos.add(8).readS32(), currPos.add(8).readS32());
                                
                                isFacing = game.worldToScreenPos(
                                    smoothX,
                                    smoothY + yOffset,
                                    smoothZ,
                                    playerConnection.laraPointer.add(ENTITY_ROOM).readS16()
                                );
                                
                                if (!isFacing || !("x" in isFacing && "y" in isFacing)) {
                                    continue;
                                }
                                
                                x = Math.floor(x + isFacing.x) - 10;
                                y = Math.floor(isFacing.y - 10);
                            } else {
                                x += 65;
                                y = drawYOffset - 1;
                            }

                            const hpPercent = playerConnection.health > 0 ? Math.round((playerConnection.health / 1000) * 100) : 0;

                            // Health bar
                            if (playerNamesMode < 3) {
                                const width = playerNamesMode === 2 ? 20 : 40;
                                const height = 3;
                                let maxX = x + width;
                                let maxY = y + height;
                                const blackColor = 0x80000000;
                                const blackFadedColor = 0x40000000;
                                game.runFunction(module, "DrawRect", x, y, maxX, y, blackColor, blackColor);
                                game.runFunction(module, "DrawRect", x, maxY, maxX, maxY, blackColor, blackColor);
                                game.runFunction(module, "DrawRect", x, y, x, maxY, blackColor, blackColor);
                                game.runFunction(module, "DrawRect", maxX, y, maxX, maxY, blackColor, blackColor);
                                game.runFunction(module, "DrawRect", x, y, maxX, maxY, blackFadedColor, blackFadedColor);
                                if (hpPercent > 0) {
                                    const redColor = 0xAA1A3EB2;
                                    const red2Color = 0xEE021150;
                                    game.runFunction(module, "DrawRect",
                                        x + 1,
                                        y + 1,
                                        x + 1 + Math.ceil(((width - 2) / 100) * hpPercent),
                                        y + (height - 1),
                                        redColor,
                                        red2Color
                                    );
                                }
                            }

                            drawYOffset += 8;

                            // Ui name
                            let theX = 6;
                            let theY = labelsYOffset;

                            if (playerNamesMode > 1) {
                                theX = isFacing.x - game.getScreenCenter().x;
                                theY = isFacing.y;
                            }

                            game.drawTextLabel(playerConnection.name, 0, true, playerNamesMode > 1 ? "center" : null, theX, theY, .2, .2);

                            labelsYOffset += 8;
                        }
                    }

                    // Top label
                    const players = othersCount + 1;
                    const lobbyName = (!userData.hideLobbyCode && userData.lobbyCode?.length && userData.lobbyCode !== "_" ? userData.lobbyCode + "; " : "");
                    const topTextFinal = multiplayerText + " (" + lobbyName + game.levelName(currentLevel) + ": " + players + " players)";
                    game.drawTextLabel(topTextFinal, 0, true, null, 2, 5, .25, .25);

                    // Mod menu
                    game.renderModMenu(module);

                    // Confirmation message
                    if (modMenuConfirmMessage && Date.now() - modMenuConfirmTime < MOD_MENU_CONFIRM_TIMEOUT) {
                        game.drawTextLabel(modMenuConfirmMessage, 0, false, "center", 0, 10, .5, .5);
                    }

                    // Chat
                    const screenHeight = game.readMemoryVariable("UiDrawHeight", module);
                    const screenX = 5 + game.readMemoryVariable("UiDrawX", module);
                    if (chatOpened) {
                        game.runFunction(
                            module, 
                            "DrawRect",
                            screenX + 1,
                            screenHeight - 54,
                            screenX + 149,
                            screenHeight - 14,
                            0x90000000,
                            0x90000000
                        );
                        game.runFunction(
                            module, 
                            "DrawRect",
                            screenX,
                            screenHeight - 54,
                            screenX,
                            screenHeight - 15,
                            0xFF000000,
                            0xFF000000
                        );
                        game.runFunction(
                            module, 
                            "DrawRect",
                            screenX + 150,
                            screenHeight - 54,
                            screenX + 150,
                            screenHeight - 15,
                            0xFF000000,
                            0xFF000000
                        );
                        game.runFunction(
                            module, 
                            "DrawRect",
                            screenX,
                            screenHeight - 55,
                            screenX + 150,
                            screenHeight - 55,
                            0xFF000000,
                            0xFF000000
                        );
                        game.runFunction(
                            module, 
                            "DrawRect",
                            screenX,
                            screenHeight - 14,
                            screenX + 150,
                            screenHeight - 5,
                            0xFF000000,
                            0xFF000000
                        );
                        game.runFunction(
                            module, 
                            "DrawRect",
                            screenX + 1,
                            screenHeight - 13,
                            screenX + 149,
                            screenHeight - 6,
                            0x701a1a1a,
                            0x701a1a1a
                        );
                    }

                    if (userData.enableChat) {
                        if (chatOpened || chatMessages.length > 0) {
                            game.drawTextLabel(
                                game.levelName(currentLevel) + " Chat",
                                0,
                                false,
                                null,
                                8,
                                screenHeight - 48,
                                .2,
                                .2
                            );
                        }

                        if (chatOpened) {
                            game.drawTextLabel(
                                userData.name.substring(0, 20) + ": " + chatMessage,
                                0,
                                true,
                                null,
                                8,
                                screenHeight - 8,
                                .18,
                                .18
                            );
                        }

                        for (let i in chatMessages) {
                            const msg = chatMessages[i];
                            const time = new Date(msg.time);
                            const hours = time.getHours().toString().padStart(2, "0");
                            const minutes = time.getMinutes().toString().padStart(2, "0");
                            const namePrefix = msg.name ? (String(msg.name).substring(0, 8) + ": ") : "";

                            game.drawTextLabel(
                                "[" + hours + ":" + minutes + "] " + (msg.chatAction ? "" : namePrefix) + String(msg.text),
                                0,
                                true,
                                null,
                                8,
                                screenHeight - (42 - 5 * i),
                                .18,
                                .18
                            );
                        }
                    }
                }
            },

            RenderLara: {
                after: (module, entity) => {
                    if (isRendering || exiting) return;
                    if (!laraPointer || laraPointer.isNull()) return;

                    const lara = laraPointer;

                    if (!userData.multiplayer) {
                        game.runFunction(module, "RenderLara", lara);
                        return;
                    }

                    if (changedPlayerRoom != null) {
                        const laraId = game.readMemoryVariable("LaraId", module);
                        game.runFunction(module, "RoomChange", laraId, changedPlayerRoom);

                        changedPlayerRoom = null;
                        return;
                    }

                    const execVariables = game.getModuleAddresses(manifest.executable).variables;

                    const gameSettings = executableBase.add(execVariables.GameSettings.Address);
                    const isRenderingModern = gameSettings.readU8() & 1;

                    const originalInterpolationFactor = game.readMemoryVariable("InterpolationFactor", module);

                    try {
                        isRendering = laraPointer;
                        game.runFunction(module, "Clone", laraBackup, lara, ENTITY_SIZE);
                        isRendering = "backing up";
                        game.runFunction(module, "Clone",
                            appearanceBackup,
                            executableBase.add(execVariables.LaraAppearanceModern.Address),
                            LARA_APPEARANCE_SIZE
                        );
                        game.runFunction(module, "Clone",
                            shadowCircleBackup,
                            game.getMemoryVariable("LaraCircleShadow", module),
                            LARA_SHADOW_SIZE
                        );
                        game.runFunction(module, "Clone",
                            hairLeftBackup,
                            game.getMemoryVariable("LaraHairLeftX", module),
                            LARA_HAIR_SIZE
                        );
                        game.runFunction(module, "Clone",
                            hairRightBackup,
                            game.getMemoryVariable("LaraHairRightX", module),
                            LARA_HAIR_SIZE
                        );
                        gunFlagsBackupLeft.writeS16(game.readMemoryVariable("LaraGunFlagsLeft", module));
                        gunFlagsBackupRight.writeS16(game.readMemoryVariable("LaraGunFlagsRight", module));
                        gunTypesBackup.writeS16(game.readMemoryVariable("LaraGunType", module));
                    } catch (err) {
                        console.warn("Cannot prepare lara render: ", err.message, err.stack);
                        return; // cannot continue
                    }

                    // Other Laras
                    for (let playerConnection of otherPlayers) {
                        if (exiting) return;

                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (!playerConnection.appearance || playerConnection.appearance.isNull()) continue;
                        if (!playerConnection.shadowCircle || playerConnection.shadowCircle.isNull()) continue;
                        if (playerConnection.distance > 50000 ** 2) continue;
                        if (!playerConnection.isLoaded) continue;

                        const shouldUpdateHair = playerConnection.hasFreshRenderState && !isSimulatingHair;

                        try {
                            //
                            isRendering = playerConnection.laraPointer;

                            game.runFunction(module, "Clone",
                                executableBase.add(execVariables.LaraAppearanceModern.Address),
                                playerConnection.appearance,
                                LARA_APPEARANCE_SIZE
                            );
                            game.runFunction(module, "Clone",
                                game.getMemoryVariable("LaraCircleShadow", module),
                                playerConnection.shadowCircle,
                                LARA_SHADOW_SIZE
                            );
                            game.runFunction(module, "Clone",
                                game.getMemoryVariable("LaraHairLeftX", module),
                                playerConnection.hairLeftPointer,
                                LARA_HAIR_SIZE
                            );
                            game.runFunction(module, "Clone",
                                game.getMemoryVariable("LaraHairRightX", module),
                                playerConnection.hairRightPointer,
                                LARA_HAIR_SIZE
                            );
                            game.runFunction(module, "Clone", lara, playerConnection.laraPointer, ENTITY_SIZE);

                            // Update OG models
                            if (currentLevel > 0) {
                                game.updateFaceModelOG(playerConnection.firingGun1 || playerConnection.firingGun2);
                                game.updateGunModelsOG();
                            }

                            // Vehicles?
                            if (module === "tomb4.dll" && playerConnection.vehicleId != null && playerConnection.vehicle && !playerConnection.vehicle.isNull()) {
                                game.runFunction(module, "Clone", playerConnection.vehicle.add(ENTITY_ROOM), playerConnection.laraPointer.add(ENTITY_ROOM), 0x4);

                                const modelId = playerConnection.vehicle.add(0x10).readS16();

                                if ([31, 32].includes(modelId) && playerConnection.vehicleLoaded) {
                                    game.runFunction(module, "RenderEntity", playerConnection.vehicle);
                                }
                            }

                            const outfitsPointer = game.getMemoryVariable("OutfitsPointer", module);
                            const appearancePointer = executableBase.add(execVariables.LaraAppearanceModern.Address).readPointer();
                            let otherLaraOutfitId = parseInt(appearancePointer.sub(outfitsPointer).toString()) / LARA_OUTFIT_SIZE;
                            let isYoungLara = otherLaraOutfitId === 2 || otherLaraOutfitId === 3;

                            game.runFunction(
                                module,
                                "ApplySettings",
                                game.getMemoryVariable("OutfitsLaraSomeBasePointer", module),
                                game.getMemoryVariable(isYoungLara ? "OutfitsLaraHairYoung" : "OutfitsLaraHairOld", module)
                            );

                            // Update hair positioning
                            if (playerConnection.resetHair) {
                                playerConnection.resetHair = false;
                                game.runFunction(module, "ResetLaraHair");
                            }
                            
                            if (shouldUpdateHair) {
                                playerConnection.hasFreshRenderState = false;
                                
                                game.runFunction(module, "SimulateLaraHair", 0, 0);
                                if (!isRenderingModern || isYoungLara) {
                                    game.runFunction(module, "SimulateLaraHair", 0, 1);
                                }
                            }

                            if (shouldUpdateHair) {
                                // Persist other lara hair
                                game.runFunction(
                                    module,
                                    "Clone",
                                    playerConnection.hairLeftPointer,
                                    game.getMemoryVariable("LaraHairLeftX", module),
                                    LARA_HAIR_SIZE
                                );
                                game.runFunction(
                                    module,
                                    "Clone",
                                    playerConnection.hairRightPointer,
                                    game.getMemoryVariable("LaraHairRightX", module),
                                    LARA_HAIR_SIZE
                                );
                            }

                            // Set gun flags
                            game.writeMemoryVariable("LaraGunFlagsLeft", playerConnection.firingGun1 ? playerConnection.firingGun1 : 0, module);
                            game.writeMemoryVariable("LaraGunFlagsRight", playerConnection.firingGun2 ? playerConnection.firingGun2 : 0, module);
                            if (playerConnection.weaponEquipped) {
                                game.writeMemoryVariable("LaraGunType", playerConnection.weaponEquipped, module);
                            }

                            // force visibility
                            lara.add(0xc).writeS32(-1);

                            if (isRenderingModern) {
                                // Set smoothness based on other player's network speed
                                const interpolate = Math.min(256, ((Date.now() - playerConnection.timeLastData) / 33) * 256);
                                game.writeMemoryVariable("InterpolationFactor", interpolate, module);
                            }
                            
                            // Render her
                            game.runFunction(module, "RenderLara", playerConnection.laraPointer);
                        } catch (err) {
                            console.warn("Cannot render other lara: ", err.message, err.stack);
                        }
                    }

                    try {
                        // Main Lara; restore
                        isRendering = "restoring";
                        game.writeMemoryVariable("InterpolationFactor", originalInterpolationFactor, module);
                        game.restoreLara();
                        isRendering = laraPointer;

                        if (currentLevel > 0) {
                            const facePtr = executableBase.add(execVariables.LaraAppearanceModern.Address).add(0x8).readPointer();
                            game.updateFaceModelOG(facePtr.add(0x14).readS16() === 2);
                            game.updateGunModelsOG();
                        }

                        const outfitsPointer = game.getMemoryVariable("OutfitsPointer", module);
                        const appearancePointer = executableBase.add(execVariables.LaraAppearanceModern.Address).readPointer();
                        const outfitId = parseInt(appearancePointer.sub(outfitsPointer).toString()) / LARA_OUTFIT_SIZE;
                        const isYoungLara = outfitId === 2 || outfitId === 3;
                        game.runFunction(
                            module,
                            "ApplySettings",
                            game.getMemoryVariable("OutfitsLaraSomeBasePointer", module),
                            game.getMemoryVariable(isYoungLara ? "OutfitsLaraHairYoung" : "OutfitsLaraHairOld", module)
                        );

                        // Render
                        game.runFunction(module, "RenderLara", lara);
                    } catch (err) {
                        console.warn("Cannot render lara: ", err.message, "module:", module, "lara:", lara, "stack:", err.stack);
                    }

                    isRendering = false;
                }
            },

            SoundEffect: {
                before: (module, type, p, f) => {
                    if (exiting || !userData.multiplayer) return;

                    const lara = game.getLara();

                    // ignore sound from other player synced
                    if (otherPlayers.find(_p => String(_p.laraPointer?.add(ENTITY_X)) === String(p))) {
                        return;
                    }

                    const moduleSoundMappings = game.getModuleAddresses(module).sounds;

                    const allowStatics = moduleSoundMappings.static_sounds;
                    if (!allowStatics.includes(String(type)) && String(p) !== String(lara?.add(ENTITY_X))) return;

                    const laraSounds = moduleSoundMappings.lara_sounds;

                    if ([...laraSounds, ...allowStatics].includes(String(type))) {
                        const cacheKey = String(type);
                        if (!lastCapturedSFX[cacheKey] || (Date.now() - lastCapturedSFX[cacheKey] >= 30)) {
                            send({
                                event: "multiplayer:sendSound", args: {
                                    sound: String(type),
                                    soundFactor: String(f)
                                }
                            });
                            lastCapturedSFX[cacheKey] = Date.now();
                        }
                    }
                }
            },

            CheckAim: {
                after: (module, screenBoundaries) => {
                    if (!userData.multiplayer) return;

                    const lara = game.getLara();
                    const execVariables = game.getModuleAddresses(manifest.executable).variables;

                    const laraX = lara.add(ENTITY_X).readS32();
                    const laraY = lara.add(ENTITY_Y).readS32();
                    const laraZ = lara.add(ENTITY_Z).readS32();
                    const laraPitch = lara.add(ENTITY_X).add(0xc).readU16();
                    const laraPitchSigned = lara.add(ENTITY_X).add(0xc).readS16();
                    const laraYaw = lara.add(ENTITY_X).add(0xe).readU16();
                    const laraYawSigned = lara.add(ENTITY_X).add(0xe).readS16();
                    const laraRoom = lara.add(ENTITY_ROOM).readS16();

                    const laraGunLeft = executableBase.add(execVariables.LaraAppearanceModern.Address).add(0x10).readS8();

                    const aimingEnemy = game.readMemoryVariable("LaraAimingEnemy", module);
                    // noinspection EqualityComparisonWithCoercionJS
                    if (aimingEnemy != 0x0) return;

                    // Not aiming, check for scope aim (2-handed scope)
                    const scopeAimActive = game.readMemoryVariable("LaraScopeActive", module) === 1;
                    const guntype = game.readMemoryVariable("LaraGunType", module);
                    if (scopeAimActive && (module !== "tomb5.dll" || guntype !== 6)) {
                        // Can aim at the scope focus
                        game.writeMemoryVariable("LaraAimingYaw", game.readMemoryVariable("LaraScopeYaw", module), module);
                        game.writeMemoryVariable("LaraAimingPitch", game.readMemoryVariable("LaraScopePitch", module), module);
                        game.writeMemoryVariable("LaraAimingLeft", 1, module);
                        game.writeMemoryVariable("LaraAimingRight", 1, module);
                        return;
                    }

                    // Not aiming, check for PvP
                    if (!pvpMode) return;
                    for (let playerConnection of otherPlayers.slice().sort((a, b) => a.distance - b.distance)) {
                        if (!playerConnection.isLoaded) continue;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (playerConnection.distance > 8000 ** 2) continue;
                        if (!playerConnection.pvpMode) continue;
                        if (playerConnection.health <= 0) continue;

                        const targetX = playerConnection.laraPointer.add(ENTITY_X).readS32();
                        const targetY = playerConnection.laraPointer.add(ENTITY_Y).readS32();
                        const targetZ = playerConnection.laraPointer.add(ENTITY_Z).readS32();
                        const targetRoom = playerConnection.laraPointer.add(ENTITY_ROOM).readS16();

                        let directionX = targetX - laraX;
                        let directionY = (targetY + -650) - (laraY + -650);
                        let directionZ = targetZ - laraZ;

                        // Check Line of sight
                        const fromPos = game.allocMemory(0xe);
                        fromPos.writeS32(laraX);
                        fromPos.add(0x4).writeS32(laraY + -650);
                        fromPos.add(0x8).writeS32(laraZ);
                        fromPos.add(0xc).writeS16(laraRoom);
                        const targetPos = game.allocMemory(0xe);
                        targetPos.writeS32(targetX);
                        targetPos.add(0x4).writeS32(targetY + -650);
                        targetPos.add(0x8).writeS32(targetZ);
                        targetPos.add(0xc).writeS16(targetRoom);
                        let inRangeH = false;
                        let inRangeV = false;
                        if (((targetX - laraX ^ directionX) - directionX) < ((targetY - laraY ^ directionY) - directionY)) {
                            inRangeH = game.runFunction(module, "TraceRangeX", fromPos, targetPos);
                            inRangeV = game.runFunction(module, "TraceRangeZ", fromPos, targetPos);
                        } else {
                            inRangeH = game.runFunction(module, "TraceRangeZ", fromPos, targetPos);
                            inRangeV = game.runFunction(module, "TraceRangeX", fromPos, targetPos);
                        }
                        if (inRangeH !== 1 || inRangeV !== 1) continue;
                        if (game.runFunction(module, "GetLOS", fromPos, targetPos) === 0) continue;

                        // Check field of view
                        let relativeYawPitch = game.allocMemory(4);
                        game.runFunction(module, "CalculateYawPitch", directionX, directionY, directionZ, relativeYawPitch);
                        const yawDiff = relativeYawPitch.readS16() - laraYawSigned;
                        const pitchDiff = relativeYawPitch.add(0x2).readS16() - laraPitchSigned;
                        let yawDiffUnsigned = (Math.abs(relativeYawPitch.readU16() - laraYaw) + 32768) % 65536 - 32768;
                        if (yawDiffUnsigned < 0) yawDiffUnsigned += 65536;
                        let pitchDiffUnsigned = (Math.abs(relativeYawPitch.add(0x2).readU16() - laraPitch) + 32768) % 65536 - 32768;
                        if (pitchDiffUnsigned < 0) pitchDiffUnsigned += 65536;
                        const isWithinYawFOV = (yawDiffUnsigned < 18071 || yawDiffUnsigned > 50000);
                        const isWithinPitchFOV = (pitchDiffUnsigned < 10921 || pitchDiffUnsigned > 34595);
                        if (!(isWithinYawFOV && isWithinPitchFOV)) continue;
                        let localYawDiff = yawDiff > (65535 / 2) ? yawDiff - 65535 : yawDiff;
                        if (localYawDiff < -(65535 / 2)) localYawDiff += 65535;

                        let isAimingLeft = localYawDiff < 5000;
                        let isAimingRight = localYawDiff > -5000;

                        // 2Handed central FOV
                        const twoHandedIndices = (module === "tomb4.dll") ? [12, 6, 10, 8] : [12, 24, 6, 8, 10];
                        if (twoHandedIndices.includes(laraGunLeft)) {
                            isAimingLeft = localYawDiff < 4000 && localYawDiff > -4000;
                            isAimingRight = isAimingLeft;
                        }

                        if (!isAimingLeft && !isAimingRight) continue;

                        // Can aim at this player!
                        game.writeMemoryVariablePointer("LaraAimingEnemy", playerConnection.laraPointer, module);
                        game.writeMemoryVariable("LaraAimingYaw", yawDiff, module);
                        game.writeMemoryVariable("LaraAimingPitch", pitchDiff, module);
                        game.writeMemoryVariable("LaraAimingLeft", isAimingLeft ? 1 : 0, module);
                        game.writeMemoryVariable("LaraAimingRight", isAimingRight ? 1 : 0, module);
                        return;
                    }

                    game.writeMemoryVariablePointer("LaraAimingEnemy", ptr(0x0), module);
                    game.writeMemoryVariable("LaraAimingYaw", 0x0, module);
                    game.writeMemoryVariable("LaraAimingPitch", 0x0, module);
                    game.writeMemoryVariable("LaraAimingLeft", 0x0, module);
                    game.writeMemoryVariable("LaraAimingRight", 0x0, module);
                }
            },

            OnDamage: {
                before: (module, enemy, weapon, dmg, extraParam) => {
                    if (exiting || !pvpMode) return;
                    if (!userData.multiplayer) return;

                    const lara = game.getLara();
                    if (!enemy || ptr(enemy).isNull() || String(ptr(enemy)) === String(lara)) return;

                    const player = otherPlayers.find(p => String(p.laraPointer) === String(ptr(enemy)));
                    if (!player?.health || player.health <= 0) return;

                    if (!weapon || module === "tomb5.dll") {
                        weapon = game.readMemoryVariable("LaraGunType", module);
                    }

                    send({
                        event: "multiplayer:sendDmg", args: {
                            dealDmg: parseInt(dmg, 16),
                            dealWpn: parseInt(weapon, 16),
                            dealPlayer: String(player.id)
                        }
                    });
                }
            },

            EntityGrenade: {
                before: (module, grenadeId) => {
                    if (processingProjectiles.includes(grenadeId)) return;

                    game.runFunction(module, "EntityGrenade", grenadeId);

                    if (!userData.multiplayer) return;
                    if (!pvpMode) return;

                    const projectile = game.getEntityPointer(grenadeId);
                    if (!projectile || projectile.isNull()) return;

                    processingProjectiles.push(grenadeId);

                    const projectileX = projectile.add(ENTITY_X).readS32();
                    const projectileY = projectile.add(ENTITY_Y).readS32();
                    const projectileZ = projectile.add(ENTITY_Z).readS32();
                    const projectileRoomId = projectile.add(ENTITY_ROOM).readU16();
                    const projectileRadius = 200;
                    for (let playerConnection of otherPlayers) {
                        if (!playerConnection.isLoaded) continue;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (!playerConnection.pvpMode) continue;
                        if (playerConnection.health <= 0) continue;

                        const bound = game.runFunction(module, "GetEntityBox", playerConnection.laraPointer);
                        const boundingBox = Array.from(new Int16Array(game.readByteArray(bound, 6 * 2)));
                        const entityX = playerConnection.laraPointer.add(ENTITY_X).readS32();
                        const entityY = playerConnection.laraPointer.add(ENTITY_Y).readS32();
                        const entityZ = playerConnection.laraPointer.add(ENTITY_Z).readS32();
                        if ((projectileX + projectileRadius) >= (boundingBox[0] + entityX) && (projectileX - projectileRadius) <= (boundingBox[1] + entityX) &&
                            (projectileZ + projectileRadius) >= (boundingBox[4] + entityZ) && (projectileZ - projectileRadius) <= (boundingBox[5] + entityZ) &&
                            (projectileY + projectileRadius) >= (boundingBox[2] + entityY) && (projectileY - projectileRadius) <= (boundingBox[3] + entityY)
                        ) {
                            // SFX and remove the grenade
                            game.runFunction(module, "RemoveEntity", grenadeId);

                            game.runFunction(module, "SoundEffect", 0x69, ptr(0x0), 0x0);
                            game.runFunction(module, "SoundEffect", 0x6a, ptr(0x0), 0x0);

                            // GFX
                            game.playExplosionGraphic(projectileX, projectileY, projectileZ, projectileRoomId);

                            // DMG
                            if (module === "tomb5.dll") {
                                game.runFunction(module, "OnDamage", playerConnection.laraPointer, 0x12, 0x14, 0x0);
                            } else {
                                game.runFunction(module, "OnDamage", playerConnection.laraPointer, 0x12, 0x14);
                            }
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(grenadeId);
                    if (idx > -1) delete processingProjectiles[idx];
                },
                after: () => ptr(0x0)
            },

            EntityHarpoon: {
                before: (module, dartId) => {
                    if (processingProjectiles.includes(dartId)) return;

                    game.runFunction(module, "EntityHarpoon", dartId);

                    if (!userData.multiplayer) return;
                    if (!pvpMode) return;

                    const projectile = game.getEntityPointer(dartId);
                    if (!projectile || projectile.isNull()) return;

                    processingProjectiles.push(dartId);
                    
                    const projectileX = projectile.add(ENTITY_X).readS32();
                    const projectileY = projectile.add(ENTITY_Y).readS32();
                    const projectileZ = projectile.add(ENTITY_Z).readS32();
                    for (let playerConnection of otherPlayers) {
                        if (!playerConnection.isLoaded) continue;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (!playerConnection.pvpMode) continue;
                        if (playerConnection.health <= 0) continue;

                        const bound = game.runFunction(module, "GetEntityBox", playerConnection.laraPointer);
                        const boundingBox = Array.from(new Int16Array(game.readByteArray(bound, 6 * 2)));
                        const entityX = playerConnection.laraPointer.add(ENTITY_X).readS32();
                        const entityY = playerConnection.laraPointer.add(ENTITY_Y).readS32();
                        const entityZ = playerConnection.laraPointer.add(ENTITY_Z).readS32();
                        if (projectileX >= (boundingBox[0] + entityX) && projectileX <= (boundingBox[1] + entityX) &&
                            projectileZ >= (boundingBox[4] + entityZ) && projectileZ <= (boundingBox[5] + entityZ) &&
                            projectileY >= (boundingBox[2] + entityY) && projectileY <= (boundingBox[3] + entityY)
                        ) {
                            // Remove the dart
                            game.runFunction(module, "RemoveEntity", dartId);

                            // DMG
                            if (module === "tomb5.dll") {
                                game.runFunction(module, "OnDamage", playerConnection.laraPointer, 0x13, 0x6, 0x0);
                            } else {
                                game.runFunction(module, "OnDamage", playerConnection.laraPointer, 0x13, 0x6);
                            }
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(dartId);
                    if (idx > -1) delete processingProjectiles[idx];
                },
                after: () => ptr(0x0)
            },

            ProcessFreeaim: {
                before: (module, fromPosX, toPosX, scopedAim, firedGun) => {
                    if (!pvpMode) return;

                    if (String(firedGun) === "0x1" && String(scopedAim) === "0x1") {
                        const gunType = game.readMemoryVariable("LaraGunType", module);
                        const moduleVariables = game.getModuleAddresses(module).variables;
                        const dmg = moduleBaseAddresses[module].add(moduleVariables.Guns.Address).add(0x26 * gunType).readS8();

                        const hitPos = game.allocMemory(12);

                        for (let playerConnection of otherPlayers) {
                            if (!playerConnection.isLoaded) continue;
                            if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                            if (!playerConnection.pvpMode) continue;
                            if (playerConnection.health <= 0) continue;

                            const bound = game.runFunction(module, "GetEntityBox", playerConnection.laraPointer);
                            
                            const hit = game.runFunction(
                                module, 
                                "DetectHit", 
                                fromPosX, 
                                toPosX, 
                                bound, 
                                playerConnection.laraPointer.add(ENTITY_X), 
                                hitPos, 
                                -1
                            );

                            if (hit) {
                                send({
                                    event: "multiplayer:sendDmg", args: {
                                        dealDmg: dmg,
                                        dealWpn: gunType,
                                        dealPlayer: String(playerConnection.id)
                                    }
                                });
                                break;
                            }
                        }
                    }
                }
            },
            
            SimulateLaraHair: {
                before: (module, mode, flags) => {
                    isSimulatingHair = true;
                },
                after: (module, mode, flags) => {
                    isSimulatingHair = false;
                }
            }
        };

        game.registerFeatureHooks(supportedFeatures, hooksExecution);
        game.registerHooks(hooksExecution);

        rpc.exports = game;
    `);
};
