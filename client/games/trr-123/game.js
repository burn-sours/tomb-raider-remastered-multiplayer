const gameCore = require("../game-core").template;

module.exports = async (session, manifest, userData, memoryAddresses, supportedFeatures, gameFeaturesCore) => {
    // language=JavaScript
    return await session.createScript(`
        let userData = ${JSON.stringify(userData)};
        const memoryAddresses = ${JSON.stringify(memoryAddresses)};
        const manifest = ${JSON.stringify(manifest)};
        const supportedFeatures = ${JSON.stringify(supportedFeatures)};

        const MAX_PLAYERS = 32;
        const LARA_SIZE = 0xE50;
        const ROOM_SIZE = 0xa8;
        const LARA_DATA_SIZE = 0x630;
        const LARA_BONES_SIZE = 0x2e0;
        const LARA_POS_SIZE = 0x10;
        const LARA_POS_NO_ROT_SIZE = 0xc;
        const LARA_HAIR_SIZE = 0x6ac;
        const LARA_BASIC_SIZE = 0x28;
        const LARA_SHADOW_SIZE = 0x30;
        const LARA_APPEARANCE_SIZE = 0xd;
        const LARA_GUNFLAG_SIZE = 0x4;
        
        let appearanceBackup = null;
        let gunFlagsBackup = null;
        let gunTypesBackup = null;
        let hairLeftBackup = null;
        
        let isRendering = false;
        let laraPointer = null;
        let laraBackup = null;
        let laraSlots = [];
        let otherPlayers = [];
        let lastCapturedSFX = {};
        let topLabel = null;
        let multiplayerText = "Burn's Multiplayer v2.0";
        let modsText = "Burn's Mods v2.0";
        let selectedPlayerLabel = null;
        let lastSelected = {time: null, name: null, reason: "teleport"};
        const selectTime = 3000;
        let menuLevelLabels = [];
        let chatTopLabel = null;
        let chatLabels = [];
        let chatMessageLabel = "";
        let initiatedChat = false;
        let isShifting = false;
        let processingProjectiles = [];
        let changedPlayerRoom = null;
        let playerNamesMode = isNaN(parseInt(userData.playerNamesMode)) ? 1 : parseInt(userData.playerNamesMode);
        let levelLastLoadedId = null;
        let levelIsRestarting = false;

        let hooksExecution;
        let hooks = {};
        ${gameCore}
        ${gameFeaturesCore}

        const game = {
            ...gameCoreFunctions,

            supportedLevels: {
                "tomb1.dll": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                "tomb2.dll": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                "tomb3.dll": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
            },

            levelNames: {
                "tomb1.dll": {
                    "0": "Lara's Home - TR1",
                    "1": "Caves",
                    "2": "Vilca",
                    "3": "Lost Valley",
                    "4": "Qualopec",
                    "5": "Francis' Folly",
                    "6": "Colosseum",
                    "7": "Palace Midas",
                    "8": "Cistern",
                    "9": "Tihocan",
                    "10": "Khamoon",
                    "11": "Obelisk Khamoon",
                    "12": "Sanctuary",
                    "13": "Natla's Mines",
                    "14": "Atlantis",
                    "15": "Great Pyramid",
                    "16": "Egypt",
                    "17": "Temple of Cat",
                    "18": "Stronghold",
                    "19": "Hive"
                },
                "tomb2.dll": {
                    "0": "Lara's Home - TR2",
                    "1": "Great Wall",
                    "2": "Venice",
                    "3": "Bartoli's",
                    "4": "Opera House",
                    "5": "Offshore Rig",
                    "6": "Diving Area",
                    "7": "40 Fathoms",
                    "8": "Maria Doria",
                    "9": "Living Quarters",
                    "10": "The Deck",
                    "11": "Tibet",
                    "12": "Barkhang",
                    "13": "Talion",
                    "14": "Ice Palace",
                    "15": "Temple of Xian",
                    "16": "Floating Islands",
                    "17": "Dragon's Lair",
                    "18": "Home Sweet Home",
                    "19": "The Cold War",
                    "20": "Fool's Gold",
                    "21": "Furnace of Gods",
                    "22": "Kingdom",
                    "23": "Vegas"
                },
                "tomb3.dll": {
                    "0": "Lara's Home - TR3",
                    "1": "Jungle",
                    "2": "Temple Ruins",
                    "3": "River Ganges",
                    "4": "Caves of Kaliya",
                    "5": "Coastal Village",
                    "6": "Crash Site",
                    "7": "Madubu Gorge",
                    "8": "Temple Of Puna",
                    "9": "Thames Wharf",
                    "10": "Aldwych",
                    "11": "Lud's Gate",
                    "12": "City",
                    "13": "Nevada Desert",
                    "14": "HSC",
                    "15": "Area 51",
                    "16": "Antarctica",
                    "17": "RX-Tech Mines",
                    "18": "Tinnos",
                    "19": "Meteorite",
                    "20": "All Hallows",
                    "21": "Highland",
                    "22": "Willard",
                    "23": "Shakespeare Cliff",
                    "24": "Fishes",
                    "25": "Madhouse",
                    "26": "Reunion"
                }
            },

            levelName: (level) => {
                return game.levelNames[game.getGameModule()][String(level)] || "Unknown Level";
            },

            isLevelSupported: (level) => {
                return game.supportedLevels[game.getGameModule()]?.includes(parseInt(level)) || false;
            },

            isLevelMenu: (level) => {
                if (level === null || typeof level === "undefined") level = currentLevel;
                switch (game.getGameModule()) {
                    case "tomb1.dll":
                        return 24 === parseInt(level);
                    case "tomb2.dll":
                    case "tomb3.dll":
                        return 63 === parseInt(level);
                }
                return false;
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
                const gameKey = (gamever === 1) ? "tr2" : gamever === 2 ? "tr3" : "tr1";
                const gameModule = Object.entries(manifest.modules)
                    .find(([moduleName, moduleMeta]) => moduleMeta.id === gameKey);

                return gameModule[0] || null;
            },
            
            waitForGame: async () => {
                while (game.readMemoryVariable("Level", manifest.executable) === -1) {
                    await game.delay(500);
                }
            },

            allocLaraBackups: () => {
                appearanceBackup = game.allocMemory(LARA_APPEARANCE_SIZE);
                gunFlagsBackup = game.allocMemory(LARA_GUNFLAG_SIZE);
                gunTypesBackup = game.allocMemory(LARA_GUNFLAG_SIZE);
                hairLeftBackup = game.allocMemory(LARA_HAIR_SIZE);
            },

            getAppearanceBackup: () => {
                if (appearanceBackup && !appearanceBackup.isNull()) {
                    return game.readByteArray(appearanceBackup, LARA_APPEARANCE_SIZE);
                }
                return null;
            },

            getGunFlagsBackup: () => {
                if (gunFlagsBackup && !gunFlagsBackup.isNull()) {
                    return gunFlagsBackup.readU32();
                }
                return game.readMemoryBlockVariable("LaraGunFlags", game.getGameModule());
            },

            getGunTypesBackup: () => {
                if (gunTypesBackup && !gunTypesBackup.isNull()) {
                    return gunTypesBackup.readU32();
                }
                return game.readMemoryBlockVariable("LaraGunType", game.getGameModule());
            },

            getLaraBonesBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                const moduleVariables = game.getModuleAddresses(game.getGameModule()).variables;
                return game.readByteArray(
                    lara.add(moduleVariables.LaraBones.Pointer),
                    LARA_BONES_SIZE
                );
            },

            getLaraPositionsBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                const moduleVariables = game.getModuleAddresses(game.getGameModule()).variables;
                return game.readByteArray(
                    lara.add(moduleVariables.LaraPositions.Pointer),
                    LARA_POS_SIZE
                );
            },

            getLaraCircleShadowBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                const moduleVariables = game.getModuleAddresses(game.getGameModule()).variables;
                return game.readByteArray(
                    lara.add(moduleVariables.LaraCircleShadow.Pointer),
                    LARA_SHADOW_SIZE
                );
            },

            getLaraBasicDataBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                const moduleVariables = game.getModuleAddresses(game.getGameModule()).variables;
                return game.readByteArray(
                    lara.add(moduleVariables.LaraBasicData.Pointer),
                    LARA_BASIC_SIZE
                );
            },

            getLaraRoomIdBackup: () => {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return null;

                const moduleVariables = game.getModuleAddresses(game.getGameModule()).variables;
                return lara.add(moduleVariables.LaraRoomId.Pointer).readS16();
            },

            getVehicleBonesBackup: () => {
                const vehicleId = game.readMemoryVariable("VehicleId", game.getGameModule());
                if (vehicleId == null || isNaN(parseInt(vehicleId)) || parseInt(vehicleId) < 0) return null;

                const vehiclePointer = game.getEntityPointer(vehicleId);
                if (vehiclePointer && !vehiclePointer.isNull()) {
                    const moduleVariables = game.getModuleAddresses(game.getGameModule()).variables;
                    return [
                        vehicleId,
                        game.readByteArray(
                            vehiclePointer.add(moduleVariables.LaraBones.Pointer),
                            LARA_BONES_SIZE
                        )
                    ];
                }
                
                return null;
            },

            setupLaraSlots: () => {
                for (let n = 0; n < MAX_PLAYERS; n++) {
                    laraSlots.push({
                        used: false,
                        pointer: game.allocMemory(LARA_SIZE),
                        appearance: game.allocMemory(LARA_APPEARANCE_SIZE),
                        vehicle: game.allocMemory(LARA_SIZE),
                        hairLeftPointer: game.allocMemory(LARA_HAIR_SIZE)
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

            setLara: (cloneBackup = true) => {
                const module = game.getGameModule();

                try {
                    laraPointer = game.getMemoryVariable("LaraBase", module).readPointer();

                    if (!laraBackup) {
                        laraBackup = Memory.alloc(LARA_SIZE);
                    }

                    if (!laraPointer || laraPointer.isNull()) {
                        laraPointer = null;
                    } else if (cloneBackup) {
                        game.runFunction(module, "Clone", laraBackup, laraPointer, LARA_SIZE);
                    }

                    currentLevel = game.readMemoryVariable("Level", manifest.executable);

                    console.log('Lara = ', laraPointer)

                    if (laraPointer) {
                        levelTrackingDisabled = false;
                    }

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
                const moduleBase = moduleBaseAddresses[module];

                game.runFunction(
                    module, 
                    "Clone", 
                    laraPointer, 
                    laraBackup, 
                    LARA_SIZE
                );
                
                game.runFunction(
                    module, 
                    "Clone",
                    executableBase.add(game.getModuleAddresses(manifest.executable).variables.LaraAppearanceModern.Address),
                    appearanceBackup,
                    LARA_APPEARANCE_SIZE
                );
                
                game.runFunction(
                    module, 
                    "Clone",
                    game.getMemoryVariable("LaraHairLeftX", module),
                    hairLeftBackup,
                    LARA_HAIR_SIZE
                );
                
                game.runFunction(
                    module, 
                    "Clone",
                    moduleBase.add(moduleVariables.LaraGunFlags.Address),
                    gunFlagsBackup,
                    LARA_GUNFLAG_SIZE
                );
                
                if (module !== "tomb1.dll") {
                    game.runFunction(
                        module, 
                        "Clone",
                        moduleBase.add(moduleVariables.LaraGunType.Address),
                        gunTypesBackup,
                        LARA_GUNFLAG_SIZE
                    );
                }
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
                    const cloneLaraHairLeftPointer = cloneLaraSlot?.hairLeftPointer;

                    if (!cloneLaraSlot) {
                        console.warn("Max " + MAX_PLAYERS + " players reached, cannot clone more!");
                        return null;
                    }
                    if (!cloneLaraPointer) return null;
                    if (!cloneLaraAppearance) return null;
                    if (!cloneLaraVehicle) return null;
                    if (!cloneLaraHairLeftPointer) return null;

                    cloneLaraSlot.used = true;

                    game.runFunction(
                        module, 
                        "Clone", 
                        cloneLaraPointer, 
                        lara, 
                        LARA_SIZE
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
                        cloneLaraHairLeftPointer,
                        game.getMemoryVariable("LaraHairLeftX", module),
                        LARA_HAIR_SIZE
                    );

                    return {
                        pointer: cloneLaraPointer,
                        appearance: cloneLaraAppearance,
                        vehicle: cloneLaraVehicle,
                        hairLeftPointer: cloneLaraHairLeftPointer
                    };
                } catch (err) {
                    console.error("Failed to clone Lara", err);
                }

                return null;
            },

            getEntityPointer: (entityId) => {
                if (entityId === -1) return null;
                
                const entitiesPointer = game.readMemoryVariable("Entities", game.getGameModule());
                
                return entitiesPointer.add(LARA_SIZE * entityId);
            },

            updateGunFlags: (flags, playerConnection) => {
                if (playerConnection.firingGun1 && playerConnection.firingGun2) {
                    flags |= 0x4;
                    flags |= 0x8;
                } else if (playerConnection.firingGun1) {
                    flags |= 0x4;
                    flags &= ~0x8;
                } else if (playerConnection.firingGun2) {
                    flags &= ~0x4;
                    flags |= 0x8;
                } else {
                    flags &= ~0x4;
                    flags &= ~0x8;
                }

                if (playerConnection.firingFlare) {
                    flags |= 0x10;
                } else {
                    flags &= ~0x10;
                }

                return flags;
            },
            
            updateGunModelsOG: () => {
                const execVariables = game.getModuleAddresses(manifest.executable).variables;
                const modern = executableBase.add(execVariables.LaraAppearanceModern.Address);

                const backPocket = modern.add(0x8).readS8();
                game.setPocketBackOG(backPocket);

                const leftHand = modern.add(0x4).readS8();
                const rightHand = modern.add(0x5).readS8();
                game.setGunsOG(leftHand, rightHand);

                const leftPocket = modern.add(0x6).readS8();
                const rightPocket = modern.add(0x7).readS8();
                game.setPocketsOG(leftPocket, rightPocket);
            },
            
            updateFaceModelOG: (angry = false) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];
                
                const modelsOffset = moduleBase.add(moduleVariables.OgModelsOffset).readPointer();
                const weaponModelIndex = moduleBase.add(moduleVariables.OgModelsWeaponOffset).readS16();
                const angwyModelIndex = moduleBase.add(moduleVariables.OgModelsAngwyOffset).readS16();
                const ogFaceModel = moduleBase.add(moduleVariables.OgModelsFace);

                if (angry) {
                    ogFaceModel.writePointer(
                        modelsOffset.add(0x70).add(angwyModelIndex * 8).readPointer()
                    );
                } else {
                    ogFaceModel.writePointer(
                        modelsOffset.add(0x70).add(weaponModelIndex * 8).readPointer()
                    );
                }
            },
            
            setGunsOG: (leftGun, rightGun) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];
                const gun = leftGun || rightGun;
                const modelsOffset = moduleBase.add(moduleVariables.OgModelsOffset).readPointer();
                const weaponModelIndexAddress = moduleBase.add(moduleVariables.OgModelsWeaponOffset);
                const ogLeftHandModel = moduleBase.add(moduleVariables.OgModelsLeftHand);
                const ogRightHandModel = moduleBase.add(moduleVariables.OgModelsRightHand);
                const weaponModelIndexEmpty = weaponModelIndexAddress.readS16();

                if (gun) {
                    let gunIndex;
                    let flareIndex = null;
                    let twoHandedIndices = [];
                    if (module === "tomb1.dll") {
                        gunIndex = {"11": 2, "13": 4, "14": 6, "12": 8}[gun];
                    } else if (module === "tomb2.dll") {
                        gunIndex = {"11": 2, "12": 10, "13": 6, "15": 8, "17": 12, "20": 14, "19": 16, "22": 18}[gun];
                        flareIndex = 18;
                        twoHandedIndices = [12, 14, 16];
                    } else if (module === "tomb3.dll") {
                        flareIndex = 20;
                        gunIndex = {
                            "11": 2,
                            "22": flareIndex,
                            "12": 10,
                            "13": 6,
                            "16": 8,
                            "18": 12,
                            "21": 14,
                            "20": 16,
                            "19": 18
                        }[gun];
                        twoHandedIndices = [6, 8, 12, 14, 16, 18];
                    }

                    const weaponModelIndex = weaponModelIndexAddress.add(gunIndex * parseInt("0x47c", 16)).readS16();

                    if (gunIndex === flareIndex) {
                        // flare requires empty right hand
                        ogRightHandModel.writePointer(
                            modelsOffset.add(0x50).add(weaponModelIndexEmpty * 8).readPointer()
                        );
                    } else {
                        ogRightHandModel.writePointer(
                            modelsOffset.add(0x50).add(weaponModelIndex * 8).readPointer()
                        );
                    }

                    if (twoHandedIndices.includes(gunIndex)) {
                        // some 2handed require empty hand
                        ogLeftHandModel.writePointer(
                            modelsOffset.add(0x68).add(weaponModelIndexEmpty * 8).readPointer()
                        );
                    } else {
                        ogLeftHandModel.writePointer(
                            modelsOffset.add(0x68).add(weaponModelIndex * 8).readPointer()
                        );
                    }
                } else {
                    ogLeftHandModel.writePointer(
                        modelsOffset.add(0x68).add(weaponModelIndexEmpty * 8).readPointer()
                    );
                    ogRightHandModel.writePointer(
                        modelsOffset.add(0x50).add(weaponModelIndexEmpty * 8).readPointer()
                    );
                }
            },

            setPocketsOG: (leftGun, rightGun) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];
                const modelsOffset = moduleBase.add(moduleVariables.OgModelsOffset).readPointer();
                const weaponModelIndexAddress = moduleBase.add(moduleVariables.OgModelsWeaponOffset);
                const ogLeftPocketModel = moduleBase.add(moduleVariables.OgModelsLeftPocket);
                const ogRightPocketModel = moduleBase.add(moduleVariables.OgModelsRightPocket);

                let gunMap = {};
                if (module === "tomb1.dll") {
                    gunMap = {"1": 2, "4": 6, "2": 8};
                } else if (module === "tomb2.dll") {
                    gunMap = {"1": 2, "4": 6, "2": 8};
                } else if (module === "tomb3.dll") {
                    gunMap = {"1": 2, "2": 10, "6": 8};
                }

                if (leftGun && String(leftGun) in gunMap) {
                    const weaponModelIndex = weaponModelIndexAddress.add(gunMap[String(leftGun)] * parseInt("0x47c", 16)).readS16();
                    ogLeftPocketModel.writePointer(
                        modelsOffset.add(0x8).add(weaponModelIndex * 8).readPointer()
                    );
                } else {
                    ogLeftPocketModel.writePointer(
                        modelsOffset.add(0x8).add(weaponModelIndexAddress.readS16() * 8).readPointer()
                    );
                }

                if (rightGun && String(rightGun) in gunMap) {
                    const weaponModelIndex = weaponModelIndexAddress.add(gunMap[String(rightGun)] * parseInt("0x47c", 16)).readS16();
                    ogRightPocketModel.writePointer(
                        modelsOffset.add(0x20).add(weaponModelIndex * 8).readPointer()
                    );
                } else {
                    ogRightPocketModel.writePointer(
                        modelsOffset.add(0x20).add(weaponModelIndexAddress.readS16() * 8).readPointer()
                    );
                }
            },

            setPocketBackOG: (weaponId = 3) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleBase = moduleBaseAddresses[module];
                
                if (module === "tomb1.dll") {
                    const modelsOffset = moduleBase.add(moduleVariables.OgModelsOffset).readPointer();
                    const ogBackPocketModel = moduleBase.add(moduleVariables.OgModelsBackPocket);
                    if (weaponId === 3) {
                        const shottyWeaponModelIndex = moduleBase.add(moduleVariables.OgModelsWeaponOffset2).readS16();
                        ogBackPocketModel.writePointer(
                            modelsOffset.add(0x38).add(shottyWeaponModelIndex * 8).readPointer()
                        );
                    } else {
                        const weaponModelIndex = moduleBase.add(moduleVariables.OgModelsWeaponOffset).readS16();
                        ogBackPocketModel.writePointer(
                            modelsOffset.add(0x38).add(weaponModelIndex * 8).readPointer()
                        );
                    }
                } else if (module === "tomb2.dll") {
                    // TR2 back model uses index
                    const ogBackPocketModel = moduleBase.add(moduleVariables.OgModelsBackPocket);
                    const backGun = {"0": 0, "3": 3, "7": 6, "9": 8}[weaponId];
                    backGun !== undefined && ogBackPocketModel.writeS16(backGun);
                } else if (module === "tomb3.dll") {
                    // TR3 back model uses index
                    const ogBackPocketModel = moduleBase.add(moduleVariables.OgModelsBackPocket);
                    const backGun = {"0": 0, "3": 3, "8": 6, "9": 9, "10": 8, "11": 7}[weaponId];
                    backGun !== undefined && ogBackPocketModel.writeS16(backGun);
                }
            },

            playExplosionGraphic: (x, y, z, roomId) => {
                const module = game.getGameModule();
                const execVariables = game.getModuleAddresses(manifest.executable).variables;
                const gameSettings = executableBase.add(execVariables.GameSettings.Address);
                const isRenderingModern = (gameSettings.readS8() & 1) === 1;

                if (isRenderingModern || module === "tomb3.dll") {
                    const gfx1 = module === "tomb3.dll" ? 2 : 3;
                    const gfx2 = module === "tomb3.dll" ? 1 : 0;
                    game.runFunction(module, "ModernGfx", x, y, z, gfx1, -2, gfx2, roomId);
                    game.runFunction(module, "ModernGfx", x, y, z, gfx1, -1, gfx2, roomId);
                    game.runFunction(module, "ModernGfx", x, y, z, gfx1, -1, gfx2, roomId);
                    return;
                }

                if (module === "tomb2.dll") {
                    const gfxId = game.runFunction(module, "OgGfxPrep", roomId);
                    if (gfxId !== -1) {
                        const moduleBase = moduleBaseAddresses[module];
                        const ogGraphicsTable = moduleBase.add(0x3fa188).readPointer();
                        const graphic = ogGraphicsTable.add(gfxId * 0x44);
                        graphic.writeS32(x);
                        graphic.add(0x4).writeS32(y);
                        graphic.add(0x8).writeS32(z);
                        graphic.add(0x2a).writeS16(0xe5);
                        graphic.add(0xc).writeS16(0);
                        graphic.add(0x34).writeS16(0);
                    }
                }
            },

            keyBindingPressed: (key) => {
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                
                switch (key) {
                    case "F2":
                        // Tele - select next name available
                        const currentIndex = otherPlayers.findIndex(p => p === lastSelected.player);
                        const nextIndex = (currentIndex + 1) % otherPlayers.length;
                        lastSelected.player = otherPlayers[nextIndex];
                        lastSelected.name = lastSelected.player?.name;
                        lastSelected.time = Date.now();
                        lastSelected.reason = "teleport";
                        break;

                    case "F4":
                        // action on player
                        const lara = game.getLara();
                        if (!lara || lara.isNull()) return;
                        if (Date.now() - lastSelected.time > selectTime) return;

                        if (lastSelected.reason === "teleport" && lastSelected.name) {
                            // Teleport to player
                            if (pvpMode) {
                                lastSelected.reason = "teleport_pvp";
                                lastSelected.time = Date.now();
                                return;
                            }
                            
                            const vehicleId = game.readMemoryVariable("VehicleId", module);
                            if (vehicleId != null && !isNaN(parseInt(vehicleId)) && parseInt(vehicleId) >= 0) {
                                lastSelected.reason = "teleport_vehicle";
                                lastSelected.time = Date.now();
                                return;
                            }

                            const playerConnection = lastSelected.player;
                            const otherLara = playerConnection?.laraPointer;
                            if (!otherLara) {
                                lastSelected.player = null;
                                lastSelected.name = null;
                                return;
                            }

                            game.writeByteArray(
                                lara.add(moduleVariables.LaraPositions.Pointer),
                                game.readByteArray(
                                    otherLara.add(moduleVariables.LaraPositions.Pointer),
                                    LARA_POS_SIZE
                                )
                            );

                            game.runFunction(module, "Clone", lara.add(0x6c), lara.add(moduleVariables.LaraPositions.Pointer), LARA_POS_NO_ROT_SIZE);
                            game.runFunction(module, "Clone", lara.add(0x1f0), lara.add(moduleVariables.LaraBones.Pointer), LARA_DATA_SIZE);

                            const roomId = otherLara.add(moduleVariables.LaraRoomId.Pointer).readS16();
                            if (!isRendering || isRendering === lara) {
                                game.runFunction(module, "RoomChange", game.readMemoryVariable("LaraId", module), roomId);
                            } else {
                                changedPlayerRoom = roomId;
                            }

                            send({
                                event: "sendChat",
                                args: {text: userData.name + " teleported to " + playerConnection.name, chatAction: true}
                            });
                        } else if (lastSelected.reason === "levelskip") {
                            // Skip Level
                            levelTrackingDisabled = true;
                            game.writeMemoryVariable("LevelCompleted", 1, module);
                        } else if (lastSelected.reason === "toggle_ui") {
                            // Toggle player names display
                            playerNamesMode = playerNamesMode === 3 ? 0 : playerNamesMode + 1;
                            if (playerNamesMode === 0) {
                                for (let playerConnection of otherPlayers) {
                                    game.deleteUiText(playerConnection.uiText);
                                    playerConnection.uiText = null;
                                }
                            }
                            send({event: "playerNamesMode", args: {mode: playerNamesMode}});
                        } else if (lastSelected.reason === "toggle_pvp") {
                            // Toggle PVP
                            pvpMode = !pvpMode;
                            send({event: "sendPVPMode", args: {pvpMode}});
                        }
                        break;

                    case "F6":
                        // Level skip - prompt
                        lastSelected.name = null;
                        lastSelected.time = Date.now();
                        lastSelected.reason = "levelskip";
                        break;

                    case "F7":
                        // Toggle UI
                        lastSelected.name = null;
                        lastSelected.time = Date.now();
                        lastSelected.reason = "toggle_ui";
                        break;

                    case "F8":
                        // Toggle chat
                        lastSelected.name = null;
                        lastSelected.time = Date.now();
                        lastSelected.reason = "toggle_chat";
                        game.toggleChat();
                        break;

                    case "F10":
                        // Toggle pvp
                        lastSelected.name = null;
                        lastSelected.time = Date.now();
                        lastSelected.reason = "toggle_pvp";
                        break;
                }
            },
            
            enterPhotoMode: () => {
                game.closeChat();
                game.deleteAllUiTexts();
            },

            exitPhotoMode: () => {
                //
            },

            openChat: () => chatOpened = true,

            closeChat: (deleteChat = true) => {
                chatOpened = false;
                if (deleteChat) {
                    game.deleteChatTexts();
                }
            },

            toggleChat: () => {
                if (chatOpened) {
                    game.closeChat(false);
                } else {
                    game.openChat();
                }
            },

            setupMenuText: () => {
                if (topLabel) return;
                
                const module = game.getGameModule();
                
                const enabledMulti = userData.multiplayer;

                const lobbyName = enabledMulti ? (!userData.hideLobbyCode && userData.lobbyCode?.length && userData.lobbyCode !== "_" ? userData.lobbyCode + "; " : "") : "";

                topLabel = ptr(game.runFunction(
                    module, 
                    "AddText", 
                    0, 
                    0, 
                    0x38, 
                    game.allocString((enabledMulti ? multiplayerText : modsText) + " (" + lobbyName + "Main Menu)")
                ));
                topLabel.writeS32(4097); // full settings
                topLabel.add(0x50).writeS32(15000); // font size
                topLabel.add(0xc).writeFloat(6); // x
                topLabel.add(0x10).writeFloat(6); // y 
                topLabel.add(0x40).writeS32(0x00000000); // color
            },

            setupMenuPlayersText: (levelsInfo) => {
                const module = game.getGameModule();
                
                game.deletePlayerInfoTexts();

                let labelsYOffset = 19;
                for (let lvl of levelsInfo) {
                    const isMenu = game.isLevelMenu(lvl.lvl);
                    if (game.isLevelSupported(lvl.lvl) || isMenu) {
                        let levelName = game.levelName(lvl.lvl);
                        if (isMenu) {
                            levelName = "Main Menu";
                        }
                        const uiText = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(levelName)));
                        menuLevelLabels.push(uiText);
                        uiText.writeS32(4097); // flag settings
                        uiText.add(0x50).writeS32(11000); // font size
                        uiText.add(0x40).writeS32(0x00011111); // color
                        game.updateString(
                            uiText.add(0x48).readPointer(),
                            "[" + levelName + "]: " + Number(lvl.players) + " players"
                        );
                        uiText.add(0xc).writeFloat(6); //-- x
                        uiText.add(0x10).writeFloat(labelsYOffset); //-- y

                        labelsYOffset += 8;
                    }
                }
            },

            deleteUiText: (uiText) => {
                if (uiText && !uiText.isNull()) {
                    const module = game.getGameModule();
                    uiText.writeS8(uiText.readS8() & ~(1 << 0));
                    uiText = null;
                    game.writeMemoryVariable("UiTextsCount", game.readMemoryVariable("UiTextsCount", module) - 1, module);
                }
            },

            deleteAllUiTexts: () => {
                game.deleteUiText(topLabel);
                topLabel = null;

                game.deleteUiText(selectedPlayerLabel);
                selectedPlayerLabel = null;

                game.deleteChatTexts();

                for (let playerConnection of otherPlayers) {
                    game.deleteUiText(playerConnection.uiText);
                    playerConnection.uiText = null;
                }

                game.deletePlayerInfoTexts();
            },

            deletePlayerInfoTexts: () => {
                for (let label of menuLevelLabels) {
                    game.deleteUiText(label);
                    label = null;
                }
                menuLevelLabels.length = 0;
            },

            deleteChatTexts: () => {
                game.deleteUiText(chatTopLabel);
                chatTopLabel = null;

                game.deleteUiText(chatMessageLabel);
                chatMessageLabel = null;

                for (let i in chatLabels) {
                    game.deleteUiText(chatLabels[i]);
                    chatLabels[i] = null;
                }
                chatLabels = chatLabels.filter(v => v);
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
                const screenHeight = game.readMemoryVariable("UiDrawHeight", module);
                const resolutionWidth = game.readMemoryVariable("UiResWidth", module);
                const resolutionHeight = game.readMemoryVariable("UiResHeight", module);
                const cameraX = game.readMemoryVariable("CameraX", module);
                const cameraZ = game.readMemoryVariable("CameraZ", module);
                const cameraY = game.readMemoryVariable("CameraY", module);
                const cameraYaw = game.readMemoryVariable("CameraYaw", module);
                const cameraPitch = game.readMemoryVariable("CamerPitch", module);
                const laraRoom = lara.add(0x1c).readS16();

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
                    inRangeH = game.runFunction(module, "GetRangeH", fromPos, targetPos);
                    inRangeV = game.runFunction(module, "GetRangeV", fromPos, targetPos);
                } else {
                    inRangeH = game.runFunction(module, "GetRangeV", fromPos, targetPos);
                    inRangeV = game.runFunction(module, "GetRangeH", fromPos, targetPos);
                }
                if (inRangeH !== 1 || inRangeV !== 1) return null;
                const inLOS = game.runFunction(module, "GetLOS", fromPos, targetPos);
                if (inLOS === 0) return null;

                // Check field of view
                let relativeYawPitch = game.allocMemory(0x4);
                game.runFunction(module, "GetRelYawPitch", directionX, directionY, directionZ, relativeYawPitch);
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
                let fovResolution = game.readMemoryVariable("ResolutionH2", manifest.executable);
                if (!fovResolution || fovResolution <= 0) {
                    fovResolution = game.readMemoryVariable("ResolutionH", manifest.executable);
                }

                const screenX = (screenHeight * (cameraSpaceX / (cameraSpaceZ / fovScaled) + resolutionWidth)) / fovResolution;
                const screenY = (screenHeight * (cameraSpaceY / (cameraSpaceZ / fovScaled) + resolutionHeight)) / fovResolution;

                return {x: screenX, y: screenY};
            },
            
            receivePlayerData: (playerId, playerData) => {
                const lara = game.getLara();
                if (!lara || lara.isNull() || !playerId) return;

                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;
                
                let playerConnection = otherPlayers.find(p => p.id === playerId);
                if (!playerConnection) {
                    playerConnection = {
                        id: playerId,
                        name: playerId,
                        laraPointer: null,
                        appearance: null,
                        hairLeftPointer: null,
                        hasFreshRenderState: true,
                        weaponEquipped: null,
                        firingGun1: false,
                        firingGun2: false,
                        firingFlare: false,
                        health: 0,
                        roomType: 0,
                        vehicleId: null,
                        vehicleBones: null,
                        uiText: false,
                        distance: 999999999,
                        timeLastData: Date.now(),
                        timeConnected: Date.now(),
                        isLoaded: false,
                        pvpMode: false
                    };
                    otherPlayers.push(playerConnection);

                    const cloned = game.cloneLara();
                    if (!cloned?.pointer) return;

                    playerConnection.appearance = cloned.appearance;
                    playerConnection.laraPointer = cloned.pointer;
                    playerConnection.vehicleBones = cloned.vehicle;
                    playerConnection.hairLeftPointer = cloned.hairLeftPointer;
                } else {
                    playerConnection.hasFreshRenderState = true;
                    playerConnection.timeLastData = Date.now();

                    const otherLara = playerConnection.laraPointer;
                    if (otherLara) {
                        if ("room" in playerData && !isNaN(parseInt(playerData.room))) {
                            otherLara.add(moduleVariables.LaraRoomId.Pointer)
                                .writeS16(parseInt(playerData.room));
                        }

                        if ("basicData" in playerData && playerData.basicData) {
                            const decodedBasicData = game.decodeMemoryBlock(playerData.basicData);
                            if (decodedBasicData.length === LARA_BASIC_SIZE) {
                                game.writeByteArray(
                                    otherLara.add(moduleVariables.LaraBasicData.Pointer),
                                    decodedBasicData
                                );
                                playerConnection.health = Math.min(1000, Math.max(0, playerConnection.laraPointer.add(0x26).readS16()));
                            }
                        }

                        if ("positions" in playerData && playerData.positions) {
                            const decodedPosData = game.decodeMemoryBlock(playerData.positions);
                            if (decodedPosData.length === LARA_POS_SIZE) {
                                if (playerConnection.isLoaded) {
                                    // Store last pos in 0x6c
                                    game.runFunction(
                                        module,
                                        "Clone",
                                        otherLara.add(0x6c),
                                        otherLara.add(moduleVariables.LaraPositions.Pointer),
                                        LARA_POS_NO_ROT_SIZE
                                    );
                                }

                                // Update pos
                                game.writeByteArray(
                                    otherLara.add(moduleVariables.LaraPositions.Pointer),
                                    decodedPosData
                                );
                            }
                        }

                        if ("bones" in playerData && playerData.bones) {
                            const decodedBonesData = game.decodeMemoryBlock(playerData.bones);
                            if (decodedBonesData.length === LARA_BONES_SIZE) {
                                game.writeByteArray(
                                    otherLara.add(moduleVariables.LaraBones.Pointer),
                                    decodedBonesData
                                );
                            }
                        }

                        if ("shadows" in playerData && playerData.shadows) {
                            const decodedShadowData = game.decodeMemoryBlock(playerData.shadows);
                            if (decodedShadowData.length === LARA_SHADOW_SIZE) {
                                game.writeByteArray(
                                    otherLara.add(moduleVariables.LaraCircleShadow.Pointer),
                                    decodedShadowData
                                );
                            }
                        }

                        if ("appearance" in playerData && playerData.appearance) {
                            const decodedAppearanceData = game.decodeMemoryBlock(playerData.appearance);
                            if (decodedAppearanceData.length === LARA_APPEARANCE_SIZE) {
                                game.writeByteArray(playerConnection.appearance, decodedAppearanceData);
                            }
                        }

                        if (module !== "tomb1.dll" && "vehicleId" in playerData && !isNaN(parseInt(playerData.vehicleId))) {
                            const oldVehicleId = playerConnection.vehicleId;
                            playerConnection.vehicleId = parseInt(playerData.vehicleId);
                            if (playerConnection.vehicleId < 0) {
                                playerConnection.vehicleId = null;
                            }

                            if (playerConnection.vehicleId != null && oldVehicleId !== playerConnection.vehicleId) {
                                // Vehicle is changed, clone to vehicleBones
                                const vehiclePointer = game.getEntityPointer(playerConnection.vehicleId);
                                if (vehiclePointer && !vehiclePointer.isNull()) {
                                    try {
                                        game.runFunction(
                                            module, 
                                            "Clone",
                                            playerConnection.vehicleBones,
                                            vehiclePointer,
                                            LARA_SIZE
                                        );
                                        playerConnection.vehicleBones.add(0x1e8).writeS32(1);
                                    } catch (err) {
                                        console.warn("Vehicle not found", playerConnection.vehicleId, playerConnection.name);
                                    }
                                }
                            }
                        }

                        if (module !== "tomb1.dll" && "vehicleBones" in playerData && playerData.vehicleBones) {
                            const decodedVehicleBonesData = game.decodeMemoryBlock(playerData.vehicleBones);
                            if (decodedVehicleBonesData.length === LARA_BONES_SIZE) {
                                game.writeByteArray(
                                    playerConnection.vehicleBones.add(moduleVariables.LaraBones.Pointer),
                                    decodedVehicleBonesData
                                );
                            }
                        }

                        if ("gunTypes" in playerData && !isNaN(parseInt(playerData.gunTypes))) {
                            playerConnection.weaponEquipped = parseInt(playerData.gunTypes);
                        }

                        if ("gunFire1" in playerData && !isNaN(parseInt(playerData.gunFire1))) {
                            playerConnection.firingGun1 = parseInt(playerData.gunFire1) === 1;
                        }

                        if ("gunFire2" in playerData && !isNaN(parseInt(playerData.gunFire2))) {
                            playerConnection.firingGun2 = parseInt(playerData.gunFire2) === 1;
                        }

                        if ("flareFire" in playerData && !isNaN(parseInt(playerData.flareFire))) {
                            playerConnection.firingFlare = parseInt(playerData.flareFire) === 1;
                        }

                        if ("roomType" in playerData && !isNaN(parseInt(playerData.roomType))) {
                            playerConnection.roomType = parseInt(playerData.roomType);
                            if (isNaN(playerConnection.roomType)) {
                                playerConnection.roomType = 0;
                            }
                        }

                        if ("name" in playerData) {
                            playerConnection.name = playerData.name || "Unknown Name";
                        } else {
                            playerConnection.name = "Unknown Name";
                        }

                        if ("pvpMode" in playerData) {
                            playerConnection.pvpMode = !!playerData.pvpMode;
                        } else {
                            playerConnection.pvpMode = false;
                        }

                        playerConnection.isLoaded = playerConnection.isLoaded || "positions" in playerData && playerData.positions;
                    }
                }
            },
            
            receiveChat: (name, time, text, chatAction = false) => {
                if (!name || !time || !text?.length) return;
                chatMessages = chatMessages || [];
                chatMessages.push({name, time, text, chatAction});
                chatMessages.sort((a, b) => new Date(a.time) - new Date(b.time));
                chatMessages = chatMessages.slice(-6);
            },

            receivePVP: (pvpPlayer, pvpDamage, pvpWeapon) => {
                if (!pvpMode) return;
                if (pvpDamage > 30) return;

                const lara = game.getLara();
                const module = game.getGameModule();
                const moduleVariables = game.getModuleAddresses(module).variables;

                const playerConnection = otherPlayers.find(o => o.id === pvpPlayer);
                if (playerConnection?.laraPointer && playerConnection.isLoaded && playerConnection.distance < 8000 ** 2) {
                    const health = lara.add(moduleVariables.LaraHealth.Pointer).readS16();
                    if (health > 0) {
                        let newHealth = health - (pvpDamage * 15);
                        if (newHealth < 0) newHealth = 0;
                        lara.add(0x26).writeS16(newHealth);

                        const flameWeapons = module === "tomb2.dll" ? [0x6] : [0x6, 0x7];
                        if (module !== "tomb1.dll" && flameWeapons.includes(pvpWeapon)) {
                            const laraPos = lara.add(moduleVariables.LaraPositions.Pointer);
                            game.playExplosionGraphic(
                                laraPos.readS32(),
                                laraPos.add(0x4).readS32() + -500,
                                laraPos.add(0x8).readS32(),
                                lara.add(moduleVariables.LaraRoomId.Pointer).readU16()
                            );
                        }

                        if (newHealth <= 0) {
                            send({
                                event: "sendChat",
                                args: {text: playerConnection.name + " killed " + userData.name, chatAction: true}
                            });
                        }
                    }
                }
            },
            
            receiveAudio: (s, sf, p) => {
                const module = game.getGameModule();
                const playerConnection = otherPlayers.find(o => o.id === p);
                const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);
                
                if (playerConnection?.laraPointer && playerConnection.isLoaded && (isPhotoMode === 1 || playerConnection.distance < 15000 ** 2)) {
                    const moduleVariables = game.getModuleAddresses(module).variables;
                    game.runFunction(
                        module,
                        "SoundEffect",
                        s,
                        playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer),
                        sf
                    );
                }
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

                    const module = game.getGameModule();
                    const moduleVariables = game.getModuleAddresses(module).variables;

                    // calc distance to the player
                    const them = playerConnection.laraPointer;
                    const pos = moduleVariables.LaraPositions.Pointer;
                    let xDiff = them.add(pos).readS32() - lara.add(pos).readS32();
                    let yDiff = them.add(pos).add(0x4).readS32() - lara.add(pos).add(0x4).readS32();
                    let zDiff = them.add(pos).add(0x8).readS32() - lara.add(pos).add(0x8).readS32();
                    playerConnection.distance = xDiff ** 2 + yDiff ** 2 + zDiff ** 2;
                }

                chatMessages = chatMessages.filter(msg => msg && (Date.now() - msg.time < (1000 * (msg.name ? 900 : 60))));
            },
            
            updateLaunchOptions(options) {
                playerNamesMode = isNaN(parseInt(options.playerNamesMode)) ? 1 : parseInt(options.playerNamesMode);
                userData = {...userData, ...options};
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
                    const gameDll = game.getGameModule();
                    const aimingEnemy = game.readMemoryVariable("LaraAimingEnemy", gameDll);

                    if (String(aimingEnemy) === String(connection.laraPointer)) {
                        game.writeMemoryVariable("LaraAimingEnemy", 0x0, gameDll);
                        game.writeMemoryVariable("LaraAimingYaw", 0x0, gameDll);
                        game.writeMemoryVariable("LaraAimingPitch", 0x0, gameDll);
                        game.writeMemoryVariable("LaraAimingLeft", 0x0, gameDll);
                        game.writeMemoryVariable("LaraAimingRight", 0x0, gameDll);
                    }
                }

                game.deleteUiText(connection.uiText);
                connection.uiText = null;

                const slot = laraSlots.find(s => s.pointer === connection.laraPointer);
                slot && (slot.used = false);

                otherPlayers = otherPlayers.filter(o => o.id !== connection.id);
            },

            cleanup: async () => {
                exiting = true;

                if (userData.multiplayer) {
                    if (isRendering && isRendering !== laraPointer) {
                        game.restoreLara();
                    }

                    game.deleteAllUiTexts();

                    for (let playerConnection of otherPlayers) {
                        game.cleanupOtherPlayer(playerConnection);
                    }

                    game.cleanupLaraSlots();
                }

                game.cleanupFeatures(supportedFeatures);
                await game.cleanupHooks();
                console.log('TRR-123 game cleanup complete');
            }
        };

        hooksExecution = {
            KeyboardInput: {
                before: (module, keycode, pressedDown) => {
                    const lara = game.getLara();
                    if (exiting || !lara || lara.isNull()) {
                        game.runFunction(module, "KeyboardInput", keycode, pressedDown);
                        return;
                    }
                    
                    const gameModule = game.getGameModule();

                    if (userData.multiplayer) {
                        const gameScene = game.readMemoryVariable("IsInGameScene", gameModule);
                        const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);

                        if (isPhotoMode === 1 || gameScene === 0) {
                            if (isPhotoMode === 1 && pressedDown) {
                                // Photo mode allow change pitch with keypad +/-
                                if (keycode === 57 || keycode === 58) {
                                    const moduleVariables = game.getModuleAddresses(gameModule).variables;
                                    const increase = keycode === 57;
                                    let newPitch = lara.add(moduleVariables.LaraPositions.Pointer).add(0xc).readS16() + (200 * (increase ? 1 : -1));
                                    if (newPitch < -32000) newPitch = -32000;
                                    if (newPitch > 32000) newPitch = 32000;
                                    lara.add(moduleVariables.LaraPositions.Pointer).add(0xc).writeS16(newPitch);
                                    game.runFunction(gameModule, "UpdatePhotoMode");
                                }
                            }

                            game.runFunction(module, "KeyboardInput", keycode, pressedDown);
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
                            "8": ["shift", "shift"],
                            //"9": ["ctrl", "ctrl"],
                            //"10": ["alt", "alt"],
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

                        if (keycode === 8) {
                            //-- SHIFT
                            isShifting = pressedDown;
                        } else if (keycode >= 62 && keycode <= 73) {
                            //-- F Keys
                            const fKey = charMap[keycode][0];
                            if (pressedDown && ["F2", "F4", "F6", "F7", "F8", "F10", "F11"].includes(fKey)) {
                                game.keyBindingPressed(fKey);
                                return;
                            }
                        } else if (chatOpened) {
                            const key = charMap[keycode][isShifting ? 1 : 0];
                            if (key && pressedDown) {
                                if (key === "esc") {
                                    game.closeChat(false);
                                    return;
                                } else if (key === "enter") {
                                    if (chatMessage.length > 0) {
                                        send({event: "sendChat", args: {text: chatMessage}});
                                        chatMessage = "";
                                    }
                                    game.closeChat(false);
                                    return;
                                } else if (key === "backspace") {
                                    if (chatMessage.length > 0) {
                                        chatMessage = chatMessage.substring(0, chatMessage.length - 1);
                                    }
                                    return;
                                } else {
                                    chatMessage += key;
                                    if (chatMessage.length > 50) {
                                        chatMessage = chatMessage.substring(0, 50);
                                    }
                                    return;
                                }
                            }
                        }
                    }

                    game.runFunction(module, "KeyboardInput", keycode, pressedDown);
                }
            },

            CheckAim: {
                after: (module, screenBoundaries) => {
                    if (!userData.multiplayer) return;

                    const lara = game.getLara();
                    const execVariables = game.getModuleAddresses(manifest.executable).variables;
                    const moduleVariables = game.getModuleAddresses(module).variables;

                    const laraX = lara.add(moduleVariables.LaraPositions.Pointer).readS32();
                    const laraY = lara.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                    const laraZ = lara.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                    const laraPitch = lara.add(moduleVariables.LaraPositions.Pointer).add(0xc).readU16();
                    const laraPitchSigned = lara.add(moduleVariables.LaraPositions.Pointer).add(0xc).readS16();
                    const laraYaw = lara.add(moduleVariables.LaraPositions.Pointer).add(0xe).readU16();
                    const laraYawSigned = lara.add(moduleVariables.LaraPositions.Pointer).add(0xe).readS16();
                    const laraRoom = lara.add(moduleVariables.LaraRoomId.Pointer).readS16();

                    const laraGunLeft = executableBase.add(execVariables.LaraAppearanceModern.Address).add(0x4).readS8();
                    // const laraGunRight = executableBase.add(execVariables.LaraAppearanceModern.Address).add(0x5).readS8();

                    const aimingEnemy = game.readMemoryVariable("LaraAimingEnemy", game.getGameModule());
                    // noinspection EqualityComparisonWithCoercionJS
                    if (aimingEnemy != 0x0) return;

                    // Not aiming, check for PvP
                    if (!pvpMode) return;
                    for (let playerConnection of otherPlayers.slice().sort((a, b) => a.distance - b.distance)) {
                        if (!playerConnection.isLoaded) continue;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (playerConnection.distance > 8000 ** 2) continue;
                        if (!playerConnection.pvpMode) continue;
                        if (playerConnection.health <= 0) continue;

                        const targetX = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).readS32();
                        const targetY = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                        const targetZ = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                        const targetRoom = playerConnection.laraPointer.add(moduleVariables.LaraRoomId.Pointer).readS16();

                        let directionX = targetX - laraX;
                        let directionY = (targetY + -650) - (laraY + -650);
                        let directionZ = targetZ - laraZ;

                        //const boundaries = Array.from(new Int16Array(game.readByteArray(screenBoundaries, 12 * 2)));

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
                            inRangeH = game.runFunction(module, "GetRangeH", fromPos, targetPos);
                            inRangeV = game.runFunction(module, "GetRangeV", fromPos, targetPos);
                        } else {
                            inRangeH = game.runFunction(module, "GetRangeV", fromPos, targetPos);
                            inRangeV = game.runFunction(module, "GetRangeH", fromPos, targetPos);
                        }
                        if (inRangeH !== 1 || inRangeV !== 1) continue;
                        if (game.runFunction(module, "GetLOS", fromPos, targetPos) === 0) continue;

                        // Check field of view
                        let relativeYawPitch = game.allocMemory(0x4);
                        game.runFunction(module, "GetRelYawPitch", directionX, directionY, directionZ, relativeYawPitch);
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
                        const is2Handed = [13, 16, 18, 19, 20, 21].includes(laraGunLeft);
                        if (is2Handed) {
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

            SoundEffect: {
                before: (module, type, p, f) => {
                    if (exiting || !userData.multiplayer) return;

                    const lara = game.getLara();
                    const moduleAddr = game.getModuleAddresses(module);
                    const pos = moduleAddr.variables.LaraPositions.Pointer;

                    // ignore sound from other player synced
                    if (otherPlayers.find(_p => String(_p.laraPointer?.add(pos)) === String(p))) {
                        return;
                    }

                    const moduleSoundMappings = moduleAddr.sounds;

                    const allowStatics = moduleSoundMappings.static_sounds;
                    if (!allowStatics.includes(String(type)) && String(p) !== String(lara?.add(pos))) return;

                    const laraSounds = moduleSoundMappings.lara_sounds;

                    if ([...laraSounds, ...allowStatics].includes(String(type))) {
                        const cacheKey = String(type);
                        if (!lastCapturedSFX[cacheKey] || (Date.now() - lastCapturedSFX[cacheKey] >= 30)) {
                            send({
                                event: "sendSound", 
                                args: {
                                    sound: String(type),
                                    soundFactor: String(f)
                                }
                            });
                            lastCapturedSFX[cacheKey] = Date.now();
                        }
                    }
                }
            },

            DealDmg: {
                before: (module, enemy, weapon, dmg) => {
                    if (exiting || !pvpMode) return;
                    if (!userData.multiplayer) return;

                    const lara = game.getLara();
                    if (!enemy || ptr(enemy).isNull() || String(ptr(enemy)) === String(lara)) return;

                    const player = otherPlayers.find(p => String(p.laraPointer) === String(ptr(enemy)));
                    if (!player?.health || player.health <= 0) return;

                    send({
                        event: "sendDmg", 
                        args: {
                            dealDmg: parseInt(dmg, 16),
                            dealWpn: parseInt(weapon, 16),
                            dealPlayer: String(player.id)
                        }
                    });
                }
            },

            Menu: {
                before: (module) => {
                    if (userData.multiplayer) {
                        // delete labels
                        for (let playerConnection of otherPlayers) {
                            game.deleteUiText(playerConnection.uiText);
                            playerConnection.uiText = null;
                        }
                        game.deleteChatTexts();
                        game.deleteUiText(selectedPlayerLabel);
                        selectedPlayerLabel = null;
                    }

                    // Main Menu?
                    if (game.isLevelMenu(currentLevel)) {
                        game.deleteAllUiTexts();
                        game.setupMenuText();
                    }
                }
            },

            LoadedLevel: {
                before: (module, p1, p2, p3, p4) => {
                    topLabel = null;

                    if (module === 'tomb1.dll') {
                        levelTrackingDisabled = true;
                        levelIsRestarting = levelLastLoadedId === p1.toInt32();
                        levelLastLoadedId = p1.toInt32();
                    } else {
                        levelTrackingDisabled = true;
                        levelIsRestarting = (levelLastLoadedId === p2.toInt32());
                        levelLastLoadedId = p2.toInt32();
                    }
                }
            },

            LaraInLevel: {
                after: (module) => {
                    game.setLara();
                    
                    if (userData.multiplayer) {
                        game.deleteAllUiTexts();
                        game.cleanupLaraSlots();

                        lastSelected.time = Date.now();
                        lastSelected.name = null;
                        lastSelected.reason = "teleport";

                        // Main Menu?
                        if (game.isLevelMenu(currentLevel)) {
                            game.setupMenuText();
                        }

                        // Always show introduction chat messages at least once
                        if (!initiatedChat) {
                            initiatedChat = true;
                            chatMessages = [
                                {time: Date.now(), name: null, text: "Welcome to TRR Multiplayer"},
                                {time: Date.now(), name: null, text: "Support Multiplayer: ko-fi.com/burn_sours"},
                                {
                                    time: Date.now(),
                                    name: null,
                                    text: "[F2] Teleport, [F6] Skip level, [F7] Name display, [F8] Text chat, [F10] PVP"
                                }
                            ];
                        }
                    }
                }
            },

            ProcessGrenade: {
                before: (module, grenadeId) => {
                    if (processingProjectiles.includes(grenadeId)) return;

                    game.runFunction(module, "ProcessGrenade", grenadeId);

                    if (!userData.multiplayer) return;
                    if (!pvpMode) return;

                    const projectile = game.getEntityPointer(grenadeId);
                    if (!projectile || projectile.isNull()) return;

                    processingProjectiles.push(grenadeId);

                    const moduleVariables = game.getModuleAddresses(module).variables;
                    
                    const projectileX = projectile.add(moduleVariables.LaraPositions.Pointer).readS32();
                    const projectileY = projectile.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                    const projectileZ = projectile.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                    const projectileRoomId = projectile.add(moduleVariables.LaraRoomId.Pointer).readU16();
                    const projectileRadius = 256;
                    for (let playerConnection of otherPlayers) {
                        if (!playerConnection.isLoaded) continue;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (!playerConnection.pvpMode) continue;
                        if (playerConnection.health <= 0) continue;

                        const bound = game.runFunction(module, "GetBox", playerConnection.laraPointer);
                        const boundingBox = Array.from(new Int16Array(game.readByteArray(bound, 6 * 2)));
                        const entityX = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).readS32();
                        const entityY = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                        const entityZ = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                        if ((projectileX + projectileRadius) >= (boundingBox[0] + entityX) && (projectileX - projectileRadius) <= (boundingBox[1] + entityX) &&
                            (projectileZ + projectileRadius) >= (boundingBox[4] + entityZ) && (projectileZ - projectileRadius) <= (boundingBox[5] + entityZ) &&
                            (projectileY + projectileRadius) >= (boundingBox[2] + entityY) && (projectileY - projectileRadius) <= (boundingBox[3] + entityY)
                        ) {
                            // SFX and remove the grenade
                            game.runFunction(module, "RemoveEntity", grenadeId);
                            game.runFunction(module, "SoundEffect", 0x69, ptr(0x0), 0x0);

                            // GFX
                            game.playExplosionGraphic(projectileX, projectileY, projectileZ, projectileRoomId);

                            // DMG
                            const isTR2 = module === "tomb2.dll";
                            game.runFunction(module, "DealDmg", playerConnection.laraPointer, isTR2 ? 0x6 : 0x7, isTR2 ? 0x1e : 0x14);
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(grenadeId);
                    if (idx > -1) delete processingProjectiles[idx];
                }
            },

            ProcessRocket: {
                before: (module, rocketId) => {
                    if (processingProjectiles.includes(rocketId)) return;

                    game.runFunction(module, "ProcessRocket", rocketId);

                    if (!userData.multiplayer) return;
                    if (!pvpMode) return;

                    const projectile = game.getEntityPointer(rocketId);
                    if (!projectile || projectile.isNull()) return;

                    processingProjectiles.push(rocketId);

                    const moduleVariables = game.getModuleAddresses(module).variables;

                    const projectileX = projectile.add(moduleVariables.LaraPositions.Pointer).readS32();
                    const projectileY = projectile.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                    const projectileZ = projectile.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                    const projectileRoomId = projectile.add(moduleVariables.LaraRoomId.Pointer).readU16();
                    const projectileRadius = 512; // 1024 << (projectile.add(0x3a).readS8() & 0x1f);
                    for (let playerConnection of otherPlayers) {
                        if (!playerConnection.isLoaded) continue;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (!playerConnection.pvpMode) continue;
                        if (playerConnection.health <= 0) continue;

                        const bound = game.runFunction(module, "GetBox", playerConnection.laraPointer);
                        const boundingBox = Array.from(new Int16Array(game.readByteArray(bound, 6 * 2)));
                        const entityX = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).readS32();
                        const entityY = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                        const entityZ = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                        if ((projectileX + projectileRadius) >= (boundingBox[0] + entityX) && (projectileX - projectileRadius) <= (boundingBox[1] + entityX) &&
                            (projectileZ + projectileRadius) >= (boundingBox[4] + entityZ) && (projectileZ - projectileRadius) <= (boundingBox[5] + entityZ) &&
                            (projectileY + projectileRadius) >= (boundingBox[2] + entityY) && (projectileY - projectileRadius) <= (boundingBox[3] + entityY)
                        ) {
                            // SFX and remove the grenade
                            game.runFunction(module, "RemoveEntity", rocketId);
                            game.runFunction(module, "SoundEffect", 0x69, ptr(0x0), 0x0);

                            // GFX
                            game.playExplosionGraphic(projectileX, projectileY, projectileZ, projectileRoomId);

                            // DMG
                            game.runFunction(module, "DealDmg", playerConnection.laraPointer, 0x6, 0x1e);
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(rocketId);
                    if (idx > -1) delete processingProjectiles[idx];
                }
            },

            ProcessHarpoon: {
                before: (module, dartId) => {
                    if (processingProjectiles.includes(dartId)) return;

                    game.runFunction(module, "ProcessHarpoon", dartId);

                    if (!userData.multiplayer) return;
                    if (!pvpMode) return;

                    const projectile = game.getEntityPointer(dartId);
                    if (!projectile || projectile.isNull()) return;

                    processingProjectiles.push(dartId);

                    const moduleVariables = game.getModuleAddresses(module).variables;

                    const projectileX = projectile.add(moduleVariables.LaraPositions.Pointer).readS32();
                    const projectileY = projectile.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                    const projectileZ = projectile.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                    for (let playerConnection of otherPlayers) {
                        if (!playerConnection.isLoaded) continue;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (!playerConnection.pvpMode) continue;
                        if (playerConnection.health <= 0) continue;

                        const bound = game.runFunction(module, "GetBox", playerConnection.laraPointer);
                        const boundingBox = Array.from(new Int16Array(game.readByteArray(bound, 6 * 2)));
                        const entityX = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).readS32();
                        const entityY = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32();
                        const entityZ = playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32();
                        if (projectileX >= (boundingBox[0] + entityX) && projectileX <= (boundingBox[1] + entityX) &&
                            projectileZ >= (boundingBox[4] + entityZ) && projectileZ <= (boundingBox[5] + entityZ) &&
                            projectileY >= (boundingBox[2] + entityY) && projectileY <= (boundingBox[3] + entityY)
                        ) {
                            // Remove the dart
                            game.runFunction(module, "RemoveEntity", dartId);

                            // DMG
                            const weaponId = module === "tomb2.dll" ? 0x7 : 0x8;
                            const weaponDmg = module === "tomb2.dll" ? 0x4 : 0x6;
                            game.runFunction(module, "DealDmg", playerConnection.laraPointer, weaponId, weaponDmg);
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(dartId);
                    if (idx > -1) delete processingProjectiles[idx];
                }
            },

            UpdateLighting: {
                before: (module, x, y, z, roomId, ref) => {
                    game.runFunction(module, "UpdateLighting", x, y, z, roomId, ref);

                    if (!userData.multiplayer) return;

                    const lara = game.getLara();
                    if (String(ref) === String(lara.add(0x80))) {
                        const moduleVariables = game.getModuleAddresses(module).variables;
                        for (let playerConnection of otherPlayers) {
                            if (playerConnection.laraPointer && !playerConnection.laraPointer.isNull()) {
                                game.runFunction(
                                    module, 
                                    "UpdateLighting",
                                    playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).readS32(),
                                    playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32(),
                                    playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32(),
                                    playerConnection.laraPointer.add(moduleVariables.LaraRoomId.Pointer).readS16(),
                                    playerConnection.laraPointer.add(0x80)
                                );
                                if (playerConnection.vehicleId != null && playerConnection.vehicleBones && !playerConnection.vehicleBones.isNull()) {
                                    game.runFunction(
                                        module,
                                        "UpdateLighting",
                                        playerConnection.vehicleBones.add(moduleVariables.LaraPositions.Pointer).readS32(),
                                        playerConnection.vehicleBones.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32(),
                                        playerConnection.vehicleBones.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32(),
                                        playerConnection.vehicleBones.add(moduleVariables.LaraRoomId.Pointer).readS16(),
                                        playerConnection.vehicleBones.add(0x80)
                                    );
                                }
                            }
                        }
                    }
                }
            },

            RenderLara: {
                after: (module, entity) => {
                    if (isRendering || exiting) return;
                    if (!laraPointer || laraPointer.isNull()) return;

                    if (!userData.multiplayer) {
                        game.runFunction(module, "RenderLara", laraPointer);
                        return;
                    }

                    if (changedPlayerRoom != null) {
                        game.runFunction(module, "RoomChange", game.readMemoryVariable("LaraId", module), changedPlayerRoom);
                        changedPlayerRoom = null;
                        return;
                    }

                    const execVariables = game.getModuleAddresses(manifest.executable).variables;
                    const moduleVariables = game.getModuleAddresses(module).variables;
                    const moduleBase = moduleBaseAddresses[module];
                    const pos = moduleVariables.LaraPositions.Pointer;
                    const room = moduleVariables.LaraRoomId.Pointer;
                    const bones = moduleVariables.LaraBones.Pointer;
                    
                    let appearancePointer;
                    let gunFlagsPointer;
                    let gunTypesPointer;

                    try {
                        appearancePointer = executableBase.add(execVariables.LaraAppearanceModern.Address);
                        gunFlagsPointer = moduleBase.add(moduleVariables.LaraGunFlags.Address);
                        gunTypesPointer = moduleBase.add(moduleVariables.LaraGunType.Address);

                        isRendering = laraPointer;

                        game.runFunction(module, "Clone", laraBackup, laraPointer, LARA_SIZE);
                        game.runFunction(module, "Clone", appearanceBackup, appearancePointer, LARA_APPEARANCE_SIZE);
                        game.runFunction(module, "Clone", hairLeftBackup, game.getMemoryVariable("LaraHairLeftX", module), LARA_HAIR_SIZE);
                        game.runFunction(module, "Clone", gunFlagsBackup, gunFlagsPointer, LARA_GUNFLAG_SIZE);
                        game.runFunction(module, "Clone", gunTypesBackup, gunTypesPointer, LARA_GUNFLAG_SIZE);
                    } catch (err) {
                        console.warn("Cannot prepare lara render: ", err.message);
                        return;
                    }

                    const cameraX = game.readMemoryVariable("CameraFixedX", module);
                    const cameraY = game.readMemoryVariable("CameraFixedY", module);
                    const cameraZ = game.readMemoryVariable("CameraFixedZ", module);
                    const cameraYaw = game.readMemoryVariable("CameraYaw", module);
                    const cameraPitch = game.readMemoryVariable("CameraPitch", module);

                    // Other Laras
                    for (let playerConnection of otherPlayers) {
                        if (exiting) return;
                        if (!playerConnection.laraPointer || playerConnection.laraPointer.isNull()) continue;
                        if (!playerConnection.appearance || playerConnection.appearance.isNull()) continue;
                        if (playerConnection.distance > 50000 ** 2) continue;
                        if (!playerConnection.isLoaded) continue;

                        const hasFreshRenderState = playerConnection.hasFreshRenderState;
                        playerConnection.hasFreshRenderState = false;

                        try {
                            // Check FOV
                            const lara3dHeadOffset = (playerConnection.roomType === 1 || playerConnection.roomType === 2 ? -400 : -650);
                            let directionX = playerConnection.laraPointer.add(pos).readS32() - cameraX;
                            let directionY = (playerConnection.laraPointer.add(pos).add(0x4).readS32() + lara3dHeadOffset) - cameraY;
                            let directionZ = playerConnection.laraPointer.add(pos).add(0x8).readS32() - cameraZ;
                            let relativeYawPitch = game.allocMemory(0x4);
                            game.runFunction(module, "GetRelYawPitch", directionX, directionY, directionZ, relativeYawPitch);
                            let yawDiff = (Math.abs(relativeYawPitch.readU16() - cameraYaw) + 32768) % 65536 - 32768;
                            if (yawDiff < 0) yawDiff += 65536;
                            let pitchDiff = (Math.abs(relativeYawPitch.add(0x2).readU16() - cameraPitch) + 32768) % 65536 - 32768;
                            if (pitchDiff < 0) pitchDiff += 65536;
                            const isWithinFOV = (yawDiff < 22071 || yawDiff > 50000) && (pitchDiff < 10921 || pitchDiff > 34595);
                            if (!isWithinFOV) continue;

                            //
                            isRendering = playerConnection.laraPointer;

                            game.runFunction(module, "Clone", laraPointer, playerConnection.laraPointer, LARA_SIZE);
                            game.runFunction(module, "Clone", appearancePointer, playerConnection.appearance, LARA_APPEARANCE_SIZE);

                            const hairLeftX = game.getMemoryVariable("LaraHairLeftX", module);

                            game.runFunction(
                                module, 
                                "Clone",
                                hairLeftX,
                                playerConnection.hairLeftPointer,
                                LARA_HAIR_SIZE
                            );
                            game.runFunction(module, "Clone", playerConnection.laraPointer.add(0x1f0), playerConnection.laraPointer.add(bones), LARA_DATA_SIZE);
                            game.runFunction(module, "Clone", playerConnection.laraPointer.add(0x6c), playerConnection.laraPointer.add(pos), LARA_POS_NO_ROT_SIZE);

                            // Ensure vanilla outfit index 
                            const outfit = appearancePointer.readS32();
                            if (outfit < 1 || outfit > 14) {
                                appearancePointer.writeS32(1);
                            }

                            // Set gun flags
                            let flags = gunFlagsBackup.readU32();
                            flags = game.updateGunFlags(flags, playerConnection);
                            game.writeMemoryVariable("LaraGunFlags", flags, module);
                            if (module !== "tomb1.dll" && playerConnection.weaponEquipped) {
                                game.writeMemoryVariable("LaraGunType", playerConnection.weaponEquipped, module);
                            }

                            // Update OG models
                            if (currentLevel > 0) {
                                game.updateFaceModelOG(playerConnection.firingGun1 || playerConnection.firingGun2);
                                game.updateGunModelsOG();
                            }

                            // Update hair positioning
                            if (hasFreshRenderState) {
                                const hairFlag = module === "tomb1.dll" ? 0xbd : 2;
                                game.runFunction(module, "AttachLaraHair", 0, hairFlag);
                            }

                            // Vehicles?
                            if (playerConnection.vehicleId != null && playerConnection.vehicleBones && !playerConnection.vehicleBones.isNull()) {
                                game.runFunction(module, "Clone", playerConnection.vehicleBones.add(pos), playerConnection.laraPointer.add(pos), LARA_POS_NO_ROT_SIZE);
                                game.runFunction(module, "Clone", playerConnection.vehicleBones.add(0x6c), playerConnection.vehicleBones.add(pos), LARA_POS_NO_ROT_SIZE);
                                game.runFunction(module, "Clone", playerConnection.vehicleBones.add(room), playerConnection.laraPointer.add(room), 0x4);
                                game.runFunction(module, "Clone", playerConnection.vehicleBones.add(0x1f0), playerConnection.vehicleBones.add(bones), LARA_DATA_SIZE);

                                const modelId = playerConnection.vehicleBones.add(0x10).readS16();
                                
                                if ([14].includes(modelId) && game.hasFunction(module, "RenderBoat")) {
                                    game.runFunction(module, "RenderBoat", playerConnection.vehicleBones);
                                } else if ([51, 13].includes(modelId) && game.hasFunction(module, "RenderSkidoo")) {
                                    game.runFunction(module, "RenderSkidoo", playerConnection.vehicleBones);
                                } else if ([14, 15, 16, 17, 19].includes(modelId) && game.hasFunction(module, "RenderEntity")) {
                                    game.runFunction(module, "RenderEntity", playerConnection.vehicleBones);
                                }
                            }

                            // Persist other lara hair
                            game.runFunction(module, "Clone",
                                playerConnection.hairLeftPointer,
                                hairLeftX,
                                LARA_HAIR_SIZE
                            );

                            // Render her
                            game.runFunction(module, "RenderLara", playerConnection.laraPointer);
                        } catch (err) {
                            console.warn("Cannot render other lara: ", err.message);
                        }
                    }

                    try {
                        // Main Lara; restore
                        isRendering = "restoring";
                        game.restoreLara();
                        isRendering = laraPointer;

                        if (currentLevel > 0) {
                            const face = executableBase.add(execVariables.LaraAppearanceModern.Address).add(0x9).readS8();
                            game.updateFaceModelOG(face === 1);
                            game.updateGunModelsOG();
                        }

                        // Render
                        game.runFunction(module, "RenderLara", laraPointer);
                    } catch (err) {
                        console.warn("Cannot render lara: ", err.message);
                    }

                    isRendering = false;
                }
            },

            RenderUI: {
                after: (module) => {
                    const lara = game.getLara();
                    if (exiting || !lara || lara.isNull()) return;

                    const execVariables = game.getModuleAddresses(manifest.executable).variables;
                    const moduleVariables = game.getModuleAddresses(module).variables;
                    const moduleBase = moduleBaseAddresses[module];

                    if (!userData.multiplayer) {
                        game.runFunction(module, "DrawSetup", 0x39, ptr(0x0));

                        if (!topLabel || topLabel.isNull()) {
                            topLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(modsText)));
                            topLabel.writeS32(4097); // flag settings
                            topLabel.add(0x50).writeS32(15000); // font size
                            topLabel.add(0xc).writeFloat(6); // x
                            topLabel.add(0x10).writeFloat(6); // y
                            topLabel.add(0x40).writeS32(0x0); // color
                        }

                        game.updateString(
                            topLabel.add(0x48).readPointer(),
                            modsText + " (" + game.levelName(currentLevel) + ")"
                        );
                        return;
                    }

                    if (pvpMode) {
                        let hp = lara.add(moduleVariables.LaraHealth.Pointer).readS16();
                        if (hp < 0xfb) {
                            const binaryTick = game.readMemoryVariable("BinaryTick", module);
                            binaryTick === 0 && (hp = 0);
                        }
                        if (hp > 1000) {
                            hp = 1000;
                        }
                        game.runFunction(module, "DrawHealth", hp / 10);
                    }

                    if (!userData.multiplayer) return;

                    game.runFunction(module, "DrawSetup", 0x39, ptr(0x0));

                    const othersCount = otherPlayers.length;
                    if (playerNamesMode > 0) {
                        let drawYOffset = 20;
                        let labelsYOffset = 20 + 3.5;
                        for (let playerConnection of otherPlayers) {
                            if (!playerConnection.isLoaded || (playerConnection.distance > 12000 ** 2)) {
                                if (playerConnection.uiText) {
                                    game.deleteUiText(playerConnection.uiText);
                                    playerConnection.uiText = null;
                                }
                                continue;
                            }

                            let isFacing;
                            let x = game.readMemoryVariable("UiDrawX", module);
                            let y;

                            if (playerNamesMode > 1) {
                                // Above head
                                const yOffset = (playerConnection.roomType === 1 || playerConnection.roomType === 2 ? -400 : -850);
                                isFacing = game.worldToScreenPos(
                                    playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).readS32(),
                                    playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x4).readS32() + yOffset,
                                    playerConnection.laraPointer.add(moduleVariables.LaraPositions.Pointer).add(0x8).readS32(),
                                    playerConnection.laraPointer.add(moduleVariables.LaraRoomId.Pointer).readS16()
                                );
                                if (!isFacing || !("x" in isFacing && "y" in isFacing)) {
                                    if (playerConnection.uiText && !playerConnection.uiText.isNull()) {
                                        game.deleteUiText(playerConnection.uiText);
                                        playerConnection.uiText = null;
                                    }
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
                                    game.runFunction(
                                        module, 
                                        "DrawRect",
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

                            // Ui Text
                            if (!playerConnection.uiText || playerConnection.uiText.isNull()) {
                                playerConnection.uiText = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(playerConnection.name)));
                                playerConnection.uiText.writeS32(4097); // flag settings
                                playerConnection.uiText.add(0x40).writeS32(0x00000000); // color
                                playerConnection.uiText.add(0x50).writeS32(12000); // font size
                            }
                            game.updateString(
                                playerConnection.uiText.add(0x48).readPointer(), 
                                playerConnection.name
                            );
                            if (playerNamesMode > 1) {
                                playerConnection.uiText.writeS8(17);
                                playerConnection.uiText.add(0xc).writeFloat(isFacing.x - game.getScreenCenter().x);
                                playerConnection.uiText.add(0x10).writeFloat(isFacing.y);
                            } else {
                                playerConnection.uiText.writeS8(1);
                                playerConnection.uiText.add(0xc).writeFloat(6);
                                playerConnection.uiText.add(0x10).writeFloat(labelsYOffset);
                            }

                            labelsYOffset += 8;
                        }
                    }

                    // Top label
                    if (!topLabel || topLabel.isNull()) {
                        topLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(multiplayerText)));
                        if (!topLabel || topLabel.isNull()) {
                            return;
                        }
                        topLabel.writeS32(4097); // flag settings
                        topLabel.add(0x50).writeS32(15000); // font size
                        topLabel.add(0xc).writeFloat(6); // x
                        topLabel.add(0x10).writeFloat(6); // y
                        topLabel.add(0x40).writeS32(0x0); // color
                    }

                    const players = othersCount + 1;
                    const lobbyName = (!userData.hideLobbyCode && userData.lobbyCode?.length && userData.lobbyCode !== "_" ? userData.lobbyCode + "; " : "");
                    game.updateString(
                        topLabel.add(0x48).readPointer(),
                        multiplayerText + " (" + lobbyName + game.levelName(currentLevel) + ": " + players + " players)"
                    );

                    // Selected Player label
                    if (lastSelected.reason === "teleport_pvp" && Date.now() - lastSelected.time < selectTime) {
                        if (!selectedPlayerLabel || selectedPlayerLabel.isNull()) {
                            selectedPlayerLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                            selectedPlayerLabel.writeS32(4113); // flag settings
                            selectedPlayerLabel.add(0x50).writeS32(25000); // font size
                            selectedPlayerLabel.add(0x10).writeFloat(10); // y
                            selectedPlayerLabel.add(0x40).writeS32(0x00011111); // color
                        }
                        game.updateString(
                            selectedPlayerLabel.add(0x48).readPointer(),
                            "Cannot teleport in PVP"
                        );
                    } else if (lastSelected.reason === "teleport_vehicle" && Date.now() - lastSelected.time < selectTime) {
                        if (!selectedPlayerLabel || selectedPlayerLabel.isNull()) {
                            selectedPlayerLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                            selectedPlayerLabel.writeS32(4113); // flag settings
                            selectedPlayerLabel.add(0x50).writeS32(25000); // font size
                            selectedPlayerLabel.add(0x10).writeFloat(10); // y
                            selectedPlayerLabel.add(0x40).writeS32(0x00011111); // color
                        }
                        game.updateString(
                            selectedPlayerLabel.add(0x48).readPointer(),
                            "Cannot teleport in vehicle"
                        );
                    } else if (lastSelected.reason === "teleport" && lastSelected.name && Date.now() - lastSelected.time < selectTime) {
                        if (!selectedPlayerLabel || selectedPlayerLabel.isNull()) {
                            selectedPlayerLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                            selectedPlayerLabel.writeS32(4113); // flag settings
                            selectedPlayerLabel.add(0x50).writeS32(25000); // font size
                            selectedPlayerLabel.add(0x10).writeFloat(10); // y
                            selectedPlayerLabel.add(0x40).writeS32(0x00011111); // color
                        }
                        game.updateString(
                            selectedPlayerLabel.add(0x48).readPointer(),
                            "[F4] Teleport to " + lastSelected.name + "?"
                        );
                    } else if (lastSelected.reason === "levelskip" && Date.now() - lastSelected.time < selectTime) {
                        if (!selectedPlayerLabel || selectedPlayerLabel.isNull()) {
                            selectedPlayerLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                            selectedPlayerLabel.writeS32(4113);
                            selectedPlayerLabel.add(0x50).writeS32(25000);
                            selectedPlayerLabel.add(0x10).writeFloat(10);
                            selectedPlayerLabel.add(0x40).writeS32(0x00011111);
                        }
                        game.updateString(
                            selectedPlayerLabel.add(0x48).readPointer(),
                            "[F4] Skip level " + game.levelName(currentLevel) + "?"
                        );
                    } else if (lastSelected.reason === "toggle_ui" && Date.now() - lastSelected.time < selectTime) {
                        if (!selectedPlayerLabel || selectedPlayerLabel.isNull()) {
                            selectedPlayerLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                            selectedPlayerLabel.writeS32(4113);
                            selectedPlayerLabel.add(0x50).writeS32(25000);
                            selectedPlayerLabel.add(0x10).writeFloat(10);
                            selectedPlayerLabel.add(0x40).writeS32(0x00011111);
                        }
                        game.updateString(
                            selectedPlayerLabel.add(0x48).readPointer(),
                            "[F4] Toggle display: " + (playerNamesMode === 3 ? "Name" : (playerNamesMode === 2 ? "Name & Health" : (playerNamesMode === 1 ? "Top Left" : "Hidden")))
                        );
                    } else if (lastSelected.reason === "toggle_pvp" && Date.now() - lastSelected.time < selectTime) {
                        if (!selectedPlayerLabel || selectedPlayerLabel.isNull()) {
                            selectedPlayerLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                            selectedPlayerLabel.writeS32(4113);
                            selectedPlayerLabel.add(0x50).writeS32(25000);
                            selectedPlayerLabel.add(0x10).writeFloat(10);
                            selectedPlayerLabel.add(0x40).writeS32(0x00011111);
                        }
                        game.updateString(
                            selectedPlayerLabel.add(0x48).readPointer(),
                            "[F4] Toggle PvP: " + (pvpMode ? "On" : "Off")
                        );
                    } else {
                        if (selectedPlayerLabel && !selectedPlayerLabel.isNull()) {
                            game.deleteUiText(selectedPlayerLabel);
                            selectedPlayerLabel = null;
                        }
                    }

                    // Chat
                    const screenX = 5 + game.readMemoryVariable("UiDrawX", module);
                    const screenHeight = game.readMemoryVariable("UiDrawHeight", module);
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

                    if ((chatOpened || chatMessages.length > 0) && (!chatTopLabel || chatTopLabel.isNull())) {
                        chatTopLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(game.levelName(currentLevel) + " Chat")));
                        chatTopLabel.writeS32(4097);
                        chatTopLabel.add(0x50).writeS32(12000);
                        chatTopLabel.add(0xc).writeFloat(7);
                        chatTopLabel.add(0x10).writeFloat(screenHeight - 50);
                        chatTopLabel.add(0x40).writeS32(0x00011111);
                    } else if (!chatOpened && chatMessages.length === 0 && chatTopLabel && !chatTopLabel.isNull()) {
                        game.deleteUiText(chatTopLabel);
                        chatTopLabel = null;
                    }

                    if (chatOpened && (!chatMessageLabel || chatMessageLabel.isNull())) {
                        chatMessageLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(chatMessage)));
                        chatMessageLabel.writeS32(4097);
                        chatMessageLabel.add(0x50).writeS32(12000);
                        chatMessageLabel.add(0x40).writeS32(0x0);
                    } else if (!chatOpened && chatMessageLabel && !chatMessageLabel.isNull()) {
                        game.deleteUiText(chatMessageLabel);
                        chatMessageLabel = null;
                    }
                    if (chatMessageLabel && !chatMessageLabel.isNull()) {
                        chatMessageLabel.add(0xc).writeFloat(8);
                        chatMessageLabel.add(0x10).writeFloat(screenHeight - 8);
                        game.updateString(
                            chatMessageLabel.add(0x48).readPointer(),
                            userData.name.substring(0, 20) + ": " + chatMessage
                        );
                    }

                    for (let i in chatMessages) {
                        const msg = chatMessages[i];
                        if (!chatLabels[i] || chatLabels[i].isNull()) {
                            chatLabels[i] = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                        }
                        chatLabels[i].writeS32(4097);
                        chatLabels[i].add(0x50).writeS32(12000);
                        chatLabels[i].add(0xc).writeFloat(7);
                        chatLabels[i].add(0x10).writeFloat(screenHeight - (42 - 5 * i));
                        chatLabels[i].add(0x40).writeS32(0x00000000);
                        let time = new Date(msg.time);
                        const hours = time.getHours().toString().padStart(2, "0");
                        const minutes = time.getMinutes().toString().padStart(2, "0");
                        const namePrefix = msg.name ? (String(msg.name).substring(0, 8) + ": ") : "";
                        game.updateString(
                            chatLabels[i].add(0x48).readPointer(),
                            "[" + hours + ":" + minutes + "] " + (msg.chatAction ? "" : namePrefix) + String(msg.text)
                        );
                    }
                    for (let i in chatLabels) {
                        if (chatMessages.length === 0 || (chatLabels[i] && !chatMessages[i])) {
                            game.deleteUiText(chatLabels[i]);
                            chatLabels[i] = null;
                        }
                    }
                    chatLabels = chatLabels.filter(v => v);
                }
            }
        };
        
        game.registerFeatureHooks(supportedFeatures, hooksExecution);
        game.registerHooks(hooksExecution);
        game.startFeatureLoops(supportedFeatures);

        // Export
        rpc.exports = game;
    `);
};
