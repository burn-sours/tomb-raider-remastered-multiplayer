const gameCore = require("../game-core").template;

module.exports = async (session, manifest, userData, memoryAddresses, supportedFeatures, gameFeaturesCore) => {
    // language=JavaScript
    return await session.createScript(`
        let userData = ${JSON.stringify(userData)};
        const memoryAddresses = ${JSON.stringify(memoryAddresses)};
        const manifest = ${JSON.stringify(manifest)};
        const supportedFeatures = ${JSON.stringify(supportedFeatures)};

        const MAX_PLAYERS = 32;
        const ROOM_SIZE = 0xa8;
        const ROOM_ENTITY_HEAD = 0x60;
        const ENTITY_SIZE = 0xE50;
        const ENTITY_BONES_SIZE = 0x2e0;
        const ENTITY_MATRICES_SIZE = 0x630;
        const ENTITY_POS_SIZE = 0x12;
        const LARA_HAIR_SIZE = 0x6ac;
        const LARA_BASIC_SIZE = 0x28;
        const LARA_SHADOW_SIZE = 0x30;
        const LARA_APPEARANCE_SIZE = 0xd;
        const LARA_GUNFLAG_SIZE = 0x4;
        const PROJECTILE_SIZE = 0x44;

        const ENTITY_X = 0x58;
        const ENTITY_Y = 0x5c;
        const ENTITY_Z = 0x60;
        const ENTITY_TILT = 0x64;
        const ENTITY_YAW = 0x66;
        const ENTITY_ROLL = 0x68;
        const ENTITY_LAST_X = 0x6c;
        const ENTITY_FLOOR_Y = 0x0;
        const ENTITY_ROOM = 0x1c;
        const ENTITY_NEXT_IN_ROOM = 0x1e;
        const ENTITY_NEXT_ID = 0x20;
        const ENTITY_HEALTH = 0x26;
        const ENTITY_BOX_INDEX = 0x28;
        const ENTITY_BONES = 0x820;
        const ENTITY_LAST_BONES = 0x1f0;
        const ENTITY_XZ_SPEED = 0x22;
        const ENTITY_Y_SPEED = 0x24;
        const ENTITY_CURRENT_STATE = 0x12;
        const ENTITY_TARGET_STATE = 0x14;
        const ENTITY_QUEUED_STATE = 0x16;
        const ENTITY_ANIM_ID = 0x18;
        const ENTITY_ANIM_FRAME = 0x1a;
        const ENTITY_TIMER = 0x2a;
        const ENTITY_FLAGS = 0x2c;
        const ENTITY_BEHAVIOUR = 0x50;
        const ENTITY_STATUS = 0x1e4;
        const ENTITY_MODEL = 0x10;
        const ENTITY_DROP_1 = 0x3a;
        const ENTITY_CROC_ATK = 0x3a;
        const ENTITY_DROP_2 = 0x3c;
        const ENTITY_PUSHBLOCK_BUSY = 0x3c;
        const ENTITY_DROP_3 = 0x3e;
        const ENTITY_DROP_4 = 0x40;
        const INVENTORY_ITEM_ID_OFFSET = 0x8;

        let appearanceBackup = null;
        let gunFlagsBackup = null;
        let gunTypesBackup = null;
        let hairLeftBackup = null;
        let isSimulatingHair = false;

        let isRendering = false;
        let laraPointer = null;
        let laraBackup = null;
        let laraSlots = [];
        let otherPlayers = [];
        let lastCapturedSFX = {};
        let topLeftLabel = null;
        let multiplayerText = "Burn's Multiplayer v2.2";
        let modsText = "Burn's Mods v2.2";
        let permaDamageText = "Burn's Perma-damage v2.2";
        let topCenterLabel = null;

        // Mod menu system state
        let modMenuState = {
            isOpen: false,
            selectedIndex: 0,
            activeSubmenu: null,        // null | menu item id
            submenuSelectedIndex: 0,
            submenuLastIndex: {},       // Remembers last index per submenu id
            lastInteraction: 0
        };
        const MOD_MENU_TIMEOUT = 3000;
        const MOD_MENU_CONFIRM_TIMEOUT = 2000;
        let modMenuLabels = [];
        let modMenuHintLabels = [null, null]; // F2 hint, F4 hint
        let modMenuScrollLabels = [null, null]; // Up arrow, Down arrow
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
                    game.writeMemoryVariable("LevelCompleted", 1, module);
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
                    if (playerNamesMode === 0) {
                        for (let pc of otherPlayers) {
                            game.deleteUiText(pc.uiText);
                            pc.uiText = null;
                        }
                    }
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
                getSubmenuItems: () => {
                    const outfits = [
                        {id: 1, label: "Classic 1"},
                        {id: 2, label: "Training 1"},
                        {id: 3, label: "Classic 2"},
                        {id: 4, label: "Training 2"},
                        {id: 5, label: "Wetsuit"},
                        {id: 6, label: "Bomber"},
                        {id: 7, label: "Bathrobe"},
                        {id: 8, label: "Training 3"},
                        {id: 9, label: "Nevada"},
                        {id: 10, label: "Pacific"},
                        {id: 11, label: "Catsuit"},
                        {id: 12, label: "Antarctica"},
                        {id: 13, label: "Bloody Classic"},
                        {id: 14, label: "Vegas"}
                    ];
                    if (game.getModuleAddresses(game.getGameModule()).challengeOutfits) {
                        outfits.push(
                            {id: 15, label: "Paragon of Peace (B)"},
                            {id: 16, label: "Paragon of Peace (S)"},
                            {id: 17, label: "Paragon of Peace (G)"},
                            {id: 18, label: "Established Explorer (B)"},
                            {id: 19, label: "Established Explorer (S)"},
                            {id: 20, label: "Established Explorer (G)"},
                            {id: 21, label: "Atlantean Bio-Armour (B)"},
                            {id: 22, label: "Atlantean Bio-Armour (S)"},
                            {id: 23, label: "Atlantean Bio-Armour (G)"},
                            {id: 24, label: "Master Mobster (B)"},
                            {id: 25, label: "Master Mobster (S)"},
                            {id: 26, label: "Master Mobster (G)"},
                            {id: 27, label: "Ahab Approved (B)"},
                            {id: 28, label: "Ahab Approved (S)"},
                            {id: 29, label: "Ahab Approved (G)"},
                            {id: 30, label: "Dragon Warrior (B)"},
                            {id: 31, label: "Dragon Warrior (S)"},
                            {id: 32, label: "Dragon Warrior (G)"},
                            {id: 33, label: "Speed Demon (B)"},
                            {id: 34, label: "Speed Demon (S)"},
                            {id: 35, label: "Speed Demon (G)"},
                            {id: 36, label: "Flying High (B)"},
                            {id: 37, label: "Flying High (S)"},
                            {id: 38, label: "Flying High (G)"},
                            {id: 39, label: "Honorary Damned (B)"},
                            {id: 40, label: "Honorary Damned (S)"},
                            {id: 41, label: "Honorary Damned (G)"},
                            {id: 42, label: "Cooler than Cool (B)"},
                            {id: 43, label: "Cooler than Cool (S)"},
                            {id: 44, label: "Cooler than Cool (G)"}
                        );
                    }
                    return outfits;
                },
                onSubmenuConfirm: (submenuItem, module) => {
                    if (submenuItem) {
                        const execAddresses = game.getModuleAddresses(manifest.executable);
                        const appearancePointer = executableBase.add(execAddresses.variables.LaraAppearanceModern.Address);
                        appearancePointer.writeS8(submenuItem.id);
                        if (game.hasFunction(module, "LoadOutfits")) {
                            game.runFunction(module, "LoadOutfits");
                        }
                        return "Outfit: " + submenuItem.label;
                    }
                },
                isDisabled: () => false
            },
            {
                id: "cheats",
                label: () => "Cheats",
                hasSubmenu: true,
                playsSound: false,
                getSubmenuItems: () => [
                    {id: "health", label: "Fill Health"},
                    {id: "oxygen", label: "Fill Oxygen"}
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
                            game.runFunction(module, "SoundEffect", 0x24, game.getMemoryVariable("CameraFixedX", module), 2);
                            return "Oxygen filled";
                    }
                },
                isDisabled: () => false
            }
        ];

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
                    "19": "Hive",
                    "24": "Main Menu"
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
                    "23": "Vegas",
                    "63": "Main Menu"
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
                    "26": "Reunion",
                    "63": "Main Menu"
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
                return game.readMemoryVariable("LaraGunFlags", game.getGameModule());
            },

            getGunTypesBackup: () => {
                if (gunTypesBackup && !gunTypesBackup.isNull()) {
                    return gunTypesBackup.readU32();
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

                return lara.add(ENTITY_ROOM).readS16();
            },

            getVehicleBonesBackup: () => {
                const vehicleId = game.readMemoryVariable("VehicleId", game.getGameModule());
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

            isOnlyPermaDamageEnabled: () => {
                if (userData.multiplayer) return false;

                const enabledFeatures = supportedFeatures.filter(f => userData[f.id]).map(f => f.id);

                return enabledFeatures.length === 1 && enabledFeatures[0] === 'perma-damage';
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

                    console.log('Lara = ', laraPointer);
                    console.log('Level = ', currentLevel);

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
                    ENTITY_SIZE
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

                return entitiesPointer.add(ENTITY_SIZE * entityId);
            },

            getProjectilePointer: (projectileId) => {
                if (projectileId === -1) return null;

                const projectiles = game.readMemoryVariable("Projectiles", game.getGameModule());

                return projectiles.add(PROJECTILE_SIZE * projectileId);
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
                        const moduleVariables = game.getModuleAddresses(module).variables;
                        const ogGraphicsTable = moduleBase.add(moduleVariables.OgGraphicsTable).readPointer();
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

                switch (key) {
                    case "F2":
                        // Play mod menu sound effect
                        game.runFunction(module, "SoundEffect", 0x71, ptr(0x0), 2);

                        modMenuState.lastInteraction = Date.now();
                        if (!modMenuState.isOpen) {
                            modMenuState.isOpen = true;
                            // Keep selectedIndex for QOL - remembers last position
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

                        modMenuState.lastInteraction = Date.now();
                        const selectedItem = MOD_MENU_ITEMS[modMenuState.selectedIndex];

                        if (selectedItem.isDisabled()) return;

                        if (modMenuState.activeSubmenu) {
                            if (selectedItem.playsSound !== false) {
                                game.runFunction(module, "SoundEffect", 0x70, ptr(0x0), 2);
                            }
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
                            game.runFunction(module, "SoundEffect", 0x70, ptr(0x0), 2);
                            modMenuState.activeSubmenu = selectedItem.id;
                            // Restore last index for this submenu, or start at 0
                            modMenuState.submenuSelectedIndex = modMenuState.submenuLastIndex[selectedItem.id] || 0;
                        } else {
                            if (selectedItem.playsSound !== false) {
                                game.runFunction(module, "SoundEffect", 0x70, ptr(0x0), 2);
                            }
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

            enterPhotoMode: () => {
                if (exiting) return;
                game.closeChat();
                game.deleteAllUiTexts();
            },

            exitPhotoMode: () => {
                if (exiting) return;
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
                if (topLeftLabel) return;

                const module = game.getGameModule();
                const enabledMulti = userData.multiplayer;

                const lobbyStr = (!userData.hideLobbyCode && userData.lobbyCode?.length && userData.lobbyCode !== "_" ? userData.lobbyCode + "; " : "");
                const lobbyName = enabledMulti ? lobbyStr : "";

                const labelText = (game.isOnlyPermaDamageEnabled() ? permaDamageText : (enabledMulti ? multiplayerText : modsText))
                    + " (" + lobbyName + "Main Menu)";

                topLeftLabel = ptr(game.runFunction(
                    module,
                    "AddText",
                    0,
                    0,
                    0x38,
                    game.allocString(labelText)
                ));
                topLeftLabel.writeS32(4097); // full settings
                topLeftLabel.add(0x50).writeS32(15000); // font size
                topLeftLabel.add(0xc).writeFloat(6); // x
                topLeftLabel.add(0x10).writeFloat(6); // y 
                topLeftLabel.add(0x40).writeS32(0x00000000); // color
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
                game.deleteUiText(topLeftLabel);
                topLeftLabel = null;

                game.deleteUiText(topCenterLabel);
                topCenterLabel = null;

                // Clean up mod menu
                for (let label of modMenuLabels) game.deleteUiText(label);
                modMenuLabels = [];
                for (let i = 0; i < modMenuHintLabels.length; i++) {
                    game.deleteUiText(modMenuHintLabels[i]);
                    modMenuHintLabels[i] = null;
                }
                for (let i = 0; i < modMenuScrollLabels.length; i++) {
                    game.deleteUiText(modMenuScrollLabels[i]);
                    modMenuScrollLabels[i] = null;
                }
                modMenuState.isOpen = false;

                game.deleteChatTexts();

                for (let playerConnection of otherPlayers) {
                    game.deleteUiText(playerConnection.uiText);
                    playerConnection.uiText = null;
                }

                game.deletePlayerInfoTexts();
            },

            closeModMenu: () => {
                // Save submenu index before closing
                if (modMenuState.activeSubmenu) {
                    modMenuState.submenuLastIndex[modMenuState.activeSubmenu] = modMenuState.submenuSelectedIndex;
                }
                modMenuState.isOpen = false;
                modMenuState.activeSubmenu = null;
                modMenuState.lastInteraction = 0;
                // Keep selectedIndex and submenuSelectedIndex for QOL
                for (let label of modMenuLabels) game.deleteUiText(label);
                modMenuLabels = [];
                for (let i = 0; i < modMenuHintLabels.length; i++) {
                    game.deleteUiText(modMenuHintLabels[i]);
                    modMenuHintLabels[i] = null;
                }
                for (let i = 0; i < modMenuScrollLabels.length; i++) {
                    game.deleteUiText(modMenuScrollLabels[i]);
                    modMenuScrollLabels[i] = null;
                }
            },

            teleportToPlayer: (playerConnection) => {
                const module = game.getGameModule();
                const lara = game.getLara();
                if (!lara || lara.isNull()) return;

                const vehicleId = game.readMemoryVariable("VehicleId", module);
                if (vehicleId != null && !isNaN(parseInt(vehicleId)) && parseInt(vehicleId) >= 0) return;

                const otherLara = playerConnection?.laraPointer;
                if (!otherLara) return;

                game.writeByteArray(lara.add(ENTITY_X),
                    game.readByteArray(otherLara.add(ENTITY_X), ENTITY_POS_SIZE));

                const roomId = otherLara.add(ENTITY_ROOM).readS16();
                if (!isRendering || isRendering === lara) {
                    game.runFunction(module, "RoomChange", game.readMemoryVariable("LaraId", module), roomId);
                } else {
                    changedPlayerRoom = roomId;
                }

                send({
                    event: "multiplayer:sendChat",
                    args: {text: userData.name + " teleported to " + playerConnection.name, chatAction: true}
                });
            },

            isModMenuTimedOut: () => modMenuState.isOpen && (Date.now() - modMenuState.lastInteraction > MOD_MENU_TIMEOUT),

            renderModMenu: (module) => {
                if (game.isModMenuTimedOut()) {
                    game.closeModMenu();
                    return;
                }
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
                        ? submenuItems.map(si => ({text: si.label, disabled: false}))
                        : [{text: "(No items)", disabled: true}];
                } else {
                    items = MOD_MENU_ITEMS.map(mi => ({
                        text: typeof mi.label === 'function' ? mi.label() : mi.label,
                        disabled: mi.isDisabled(),
                        hasSubmenu: mi.hasSubmenu
                    }));
                }

                const selectedIdx = modMenuState.activeSubmenu ? modMenuState.submenuSelectedIndex : modMenuState.selectedIndex;

                // Scrolling: calculate visible window
                const visibleCount = Math.min(items.length, MOD_MENU_MAX_VISIBLE);
                const needsScroll = items.length > MOD_MENU_MAX_VISIBLE;
                const arrowHeight = needsScroll ? 8 : 0; // Space for scroll arrows
                let scrollOffset = 0;
                if (needsScroll) {
                    // Keep selected item visible, roughly centered
                    scrollOffset = Math.max(0, Math.min(selectedIdx - 2, items.length - MOD_MENU_MAX_VISIBLE));
                }

                const totalHeight = titleHeight + arrowHeight + (visibleCount * itemHeight) + arrowHeight + padding;
                const menuX = centerX - (menuWidth / 2), menuY = 14;
                const labelYOffset = 6; // Labels render higher than DrawRect, offset to align

                // Background - header (pure black), items (translucent grey)
                const titleY = menuY + titleHeight;
                game.runFunction(module, "DrawRect", menuX, menuY, menuX + menuWidth, titleY, 0xFF000000, 0xFF000000);
                game.runFunction(module, "DrawRect", menuX, titleY, menuX + menuWidth, menuY + totalHeight, 0xCC1a1a1a, 0xCC1a1a1a);

                // Border (4 lines)
                const border = 0xFF3a3a3a;
                game.runFunction(module, "DrawRect", menuX, menuY, menuX + menuWidth, menuY, border, border);
                game.runFunction(module, "DrawRect", menuX, menuY + totalHeight, menuX + menuWidth, menuY + totalHeight, border, border);
                game.runFunction(module, "DrawRect", menuX, menuY, menuX, menuY + totalHeight, border, border);
                game.runFunction(module, "DrawRect", menuX + menuWidth, menuY, menuX + menuWidth, menuY + totalHeight, border, border);

                // Title separator
                game.runFunction(module, "DrawRect", menuX, titleY, menuX + menuWidth, titleY, border, border);

                // Selection highlight (relative to scroll offset, after arrow space)
                const itemsStartY = titleY + arrowHeight + padding;
                if (items.length > 0 && selectedIdx < items.length) {
                    const relativeIdx = selectedIdx - scrollOffset;
                    const highlightY = itemsStartY + (relativeIdx * itemHeight);
                    game.runFunction(module, "DrawRect", menuX + 2, highlightY - 1, menuX + menuWidth - 2, highlightY + itemHeight - 2, 0x80555555, 0x80555555);
                }

                // Title label - bigger font, white
                if (!modMenuLabels[0] || modMenuLabels[0].isNull()) {
                    modMenuLabels[0] = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(title)));
                    modMenuLabels[0].writeS32(4113);
                    modMenuLabels[0].add(0x50).writeS32(20000);
                    modMenuLabels[0].add(0x40).writeS32(0x0); // White
                }
                modMenuLabels[0].add(0xc).writeFloat(0);
                modMenuLabels[0].add(0x10).writeFloat(menuY + 3 + labelYOffset);
                game.updateString(modMenuLabels[0].add(0x48).readPointer(), title);

                // F2/F4 hint labels
                const hintY = menuY + 9 + labelYOffset;
                // F2 hint (left side)
                if (!modMenuHintLabels[0] || modMenuHintLabels[0].isNull()) {
                    modMenuHintLabels[0] = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("F2")));
                }
                modMenuHintLabels[0].writeS32(4113);
                modMenuHintLabels[0].add(0x50).writeS32(12000);
                modMenuHintLabels[0].add(0x40).writeS32(0x0);
                modMenuHintLabels[0].add(0xc).writeFloat(-20);
                modMenuHintLabels[0].add(0x10).writeFloat(hintY);
                game.updateString(modMenuHintLabels[0].add(0x48).readPointer(), "F2 \x14");
                // F4 hint (right side)
                if (!modMenuHintLabels[1] || modMenuHintLabels[1].isNull()) {
                    modMenuHintLabels[1] = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("F4")));
                }
                modMenuHintLabels[1].writeS32(4113);
                modMenuHintLabels[1].add(0x50).writeS32(12000);
                modMenuHintLabels[1].add(0x40).writeS32(0x0);
                modMenuHintLabels[1].add(0xc).writeFloat(20);
                modMenuHintLabels[1].add(0x10).writeFloat(hintY);
                game.updateString(modMenuHintLabels[1].add(0x48).readPointer(), "F4 <on-icon>");

                // Item labels (only visible items)
                for (let v = 0; v < visibleCount; v++) {
                    const itemIdx = scrollOffset + v;
                    const labelIdx = v + 1;
                    const item = items[itemIdx];
                    const itemY = itemsStartY + (v * itemHeight);
                    if (!modMenuLabels[labelIdx] || modMenuLabels[labelIdx].isNull()) {
                        modMenuLabels[labelIdx] = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(item.text)));
                    }
                    modMenuLabels[labelIdx].writeS32(item.disabled ? (4113 | 0x4000) : 4113);
                    modMenuLabels[labelIdx].add(0x50).writeS32(16000);
                    modMenuLabels[labelIdx].add(0x40).writeS32(0x0); // White
                    modMenuLabels[labelIdx].add(0xc).writeFloat(0);
                    modMenuLabels[labelIdx].add(0x10).writeFloat(itemY + labelYOffset);
                    game.updateString(modMenuLabels[labelIdx].add(0x48).readPointer(), item.text + (item.hasSubmenu ? " \x12" : ""));
                }

                // Cleanup excess item labels
                for (let i = visibleCount + 1; i < modMenuLabels.length; i++) game.deleteUiText(modMenuLabels[i]);
                modMenuLabels.length = visibleCount + 1;

                // Scroll arrows (only if needed)
                if (needsScroll) {
                    const canScrollUp = scrollOffset > 0;
                    const canScrollDown = scrollOffset + MOD_MENU_MAX_VISIBLE < items.length;
                    const upArrowY = titleY + labelYOffset;
                    const downArrowY = itemsStartY + (visibleCount * itemHeight) + labelYOffset;
                    // Up arrow
                    if (!modMenuScrollLabels[0] || modMenuScrollLabels[0].isNull()) {
                        modMenuScrollLabels[0] = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("\x10")));
                    }
                    modMenuScrollLabels[0].writeS32(canScrollUp ? 4113 : (4113 | 0x4000)); // Dim if at top
                    modMenuScrollLabels[0].add(0x50).writeS32(10000);
                    modMenuScrollLabels[0].add(0x40).writeS32(0x0);
                    modMenuScrollLabels[0].add(0xc).writeFloat(0);
                    modMenuScrollLabels[0].add(0x10).writeFloat(upArrowY);
                    // Down arrow
                    if (!modMenuScrollLabels[1] || modMenuScrollLabels[1].isNull()) {
                        modMenuScrollLabels[1] = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("\x14")));
                    }
                    modMenuScrollLabels[1].writeS32(canScrollDown ? 4113 : (4113 | 0x4000)); // Dim if at bottom
                    modMenuScrollLabels[1].add(0x50).writeS32(10000);
                    modMenuScrollLabels[1].add(0x40).writeS32(0x0);
                    modMenuScrollLabels[1].add(0xc).writeFloat(0);
                    modMenuScrollLabels[1].add(0x10).writeFloat(downArrowY);
                } else {
                    // Clean up scroll arrows if not needed
                    for (let i = 0; i < modMenuScrollLabels.length; i++) {
                        if (modMenuScrollLabels[i] && !modMenuScrollLabels[i].isNull()) {
                            game.deleteUiText(modMenuScrollLabels[i]);
                            modMenuScrollLabels[i] = null;
                        }
                    }
                }
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
                let relativeYawPitch = game.allocMemory(0x4);
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
                        vehicle: null,
                        uiText: false,
                        distance: 999999999,
                        timeLastData: Date.now(),
                        timeConnected: Date.now(),
                        isLoaded: false,
                        vehicleLoaded: false,
                        pvpMode: false,
                        _seq: playerData._seq || 0
                    };
                    otherPlayers.push(playerConnection);

                    const cloned = game.cloneLara();
                    if (!cloned?.pointer) return;

                    playerConnection.appearance = cloned.appearance;
                    playerConnection.laraPointer = cloned.pointer;
                    playerConnection.vehicle = cloned.vehicle;
                    playerConnection.hairLeftPointer = cloned.hairLeftPointer;

                    console.log('spawned other player', playerId, playerConnection.laraPointer)
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
                        otherLara.add(ENTITY_ROOM)
                            .writeS16(parseInt(playerData.room));
                    }

                    if ("basicData" in playerData && playerData.basicData) {
                        const decodedBasicData = game.decodeMemoryBlock(playerData.basicData);
                        if (decodedBasicData.length === LARA_BASIC_SIZE) {
                            game.writeByteArray(
                                otherLara.add(moduleVariables.LaraBasicData.Pointer),
                                decodedBasicData
                            );
                            playerConnection.health = Math.min(1000, Math.max(0, playerConnection.laraPointer.add(ENTITY_HEALTH).readS16()));
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
                                    ENTITY_POS_SIZE
                                );

                                if (playerConnection.vehicle && !playerConnection.vehicle.isNull()) {
                                    game.runFunction(
                                        module,
                                        "Clone",
                                        playerConnection.vehicle.add(ENTITY_LAST_X),
                                        playerConnection.vehicle.add(ENTITY_X),
                                        ENTITY_POS_SIZE
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
                            // Vehicle is changed, clone
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
                                        ENTITY_POS_SIZE
                                    );
                                    game.runFunction(
                                        module,
                                        "Clone",
                                        playerConnection.vehicle.add(ENTITY_LAST_X),
                                        otherLara.add(ENTITY_LAST_X),
                                        ENTITY_POS_SIZE
                                    );
                                    playerConnection.vehicle.add(0x1e8).writeS32(1);
                                } catch (err) {
                                    console.warn("Vehicle not found", playerConnection.vehicleId, playerConnection.name);
                                }
                            }
                        } else if (playerConnection.vehicleId === null) {
                            playerConnection.vehicleLoaded = false;
                        }
                    }

                    if (module !== "tomb1.dll" && "vehicleBones" in playerData && playerData.vehicleBones) {
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

                    playerConnection.vehicleLoaded = playerConnection.vehicleLoaded || "vehicleBones" in playerData && playerData.vehicleBones;
                    playerConnection.isLoaded = playerConnection.isLoaded || "positions" in playerData && playerData.positions;
                }
            },

            receiveChat: (name, time, text, chatAction = false) => {
                if (!userData.enableChat) return;
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

                const playerConnection = otherPlayers.find(o => o.id === pvpPlayer);
                if (playerConnection?.laraPointer && playerConnection.isLoaded && playerConnection.distance < 8000 ** 2) {
                    const health = lara.add(ENTITY_HEALTH).readS16();
                    if (health > 0) {
                        let newHealth = health - (pvpDamage * 15);
                        if (newHealth < 0) newHealth = 0;
                        lara.add(ENTITY_HEALTH).writeS16(newHealth);

                        const flameWeapons = module === "tomb2.dll" ? [0x6] : [0x6, 0x7];
                        if (module !== "tomb1.dll" && flameWeapons.includes(pvpWeapon)) {
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
                const module = game.getGameModule();
                const playerConnection = otherPlayers.find(o => o.id === p);
                const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);

                if (playerConnection?.laraPointer && playerConnection.isLoaded && (isPhotoMode === 1 || playerConnection.distance < 15000 ** 2)) {
                    game.runFunction(
                        module,
                        "SoundEffect",
                        s,
                        playerConnection.laraPointer.add(ENTITY_X),
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

                    // calc distance to the player
                    const them = playerConnection.laraPointer;
                    const xDiff = them.add(ENTITY_X).readS32() - lara.add(ENTITY_X).readS32();
                    const yDiff = them.add(ENTITY_Y).readS32() - lara.add(ENTITY_Y).readS32();
                    const zDiff = them.add(ENTITY_Z).readS32() - lara.add(ENTITY_Z).readS32();
                    playerConnection.distance = xDiff ** 2 + yDiff ** 2 + zDiff ** 2;
                }

                chatMessages = chatMessages.filter(msg => msg && (Date.now() - msg.time < (1000 * (msg.name ? 900 : 60))));
            },

            updateLaunchOptions(options) {
                playerNamesMode = isNaN(parseInt(options.playerNamesMode)) ? 1 : parseInt(options.playerNamesMode);
                userData = {...userData, ...options};

                if (!userData.enableChat) {
                    game.closeChat(true);
                    chatMessage = "";
                }

                game.deleteUiText(topLeftLabel);
                topLeftLabel = null;

                if (game.isInMenu()) {
                    game.setupMenuText();
                }
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

                    for (let playerConnection of otherPlayers) {
                        game.cleanupOtherPlayer(playerConnection);
                    }

                    game.cleanupLaraSlots();
                }

                game.deleteAllUiTexts();

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
                        } else if (chatOpened && userData.enableChat) {
                            const key = charMap[keycode]?.[isShifting ? 1 : 0];
                            if (key && pressedDown) {
                                if (key === "esc") {
                                    game.closeChat(false);
                                    return;
                                } else if (key === "enter") {
                                    if (chatMessage.length > 0) {
                                        if (chatMessage.toLowerCase().trim() === "/quiz") {
                                            game.runQuiz();
                                        } else {
                                            send({event: "multiplayer:sendChat", args: {text: chatMessage}});
                                        }
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

                    const laraX = lara.add(ENTITY_X).readS32();
                    const laraY = lara.add(ENTITY_Y).readS32();
                    const laraZ = lara.add(ENTITY_Z).readS32();
                    const laraPitch = lara.add(ENTITY_X).add(0xc).readU16();
                    const laraPitchSigned = lara.add(ENTITY_X).add(0xc).readS16();
                    const laraYaw = lara.add(ENTITY_X).add(0xe).readU16();
                    const laraYawSigned = lara.add(ENTITY_X).add(0xe).readS16();
                    const laraRoom = lara.add(ENTITY_ROOM).readS16();

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

                        const targetX = playerConnection.laraPointer.add(ENTITY_X).readS32();
                        const targetY = playerConnection.laraPointer.add(ENTITY_Y).readS32();
                        const targetZ = playerConnection.laraPointer.add(ENTITY_Z).readS32();
                        const targetRoom = playerConnection.laraPointer.add(ENTITY_ROOM).readS16();

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
                            inRangeH = game.runFunction(module, "TraceRangeX", fromPos, targetPos);
                            inRangeV = game.runFunction(module, "TraceRangeZ", fromPos, targetPos);
                        } else {
                            inRangeH = game.runFunction(module, "TraceRangeZ", fromPos, targetPos);
                            inRangeV = game.runFunction(module, "TraceRangeX", fromPos, targetPos);
                        }
                        if (inRangeH !== 1 || inRangeV !== 1) continue;
                        if (game.runFunction(module, "GetLOS", fromPos, targetPos) === 0) continue;

                        // Check field of view
                        let relativeYawPitch = game.allocMemory(0x4);
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

                    // ignore sound from other player synced
                    if (otherPlayers.find(_p => String(_p.laraPointer?.add(ENTITY_X)) === String(p))) {
                        return;
                    }

                    const moduleSoundMappings = moduleAddr.sounds;

                    const allowStatics = moduleSoundMappings.static_sounds;
                    if (!allowStatics.includes(String(type)) && String(p) !== String(lara?.add(ENTITY_X))) return;

                    const laraSounds = moduleSoundMappings.lara_sounds;

                    if ([...laraSounds, ...allowStatics].includes(String(type))) {
                        const cacheKey = String(type);
                        if (!lastCapturedSFX[cacheKey] || (Date.now() - lastCapturedSFX[cacheKey] >= 30)) {
                            send({
                                event: "multiplayer:sendSound",
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

            OnDamage: {
                before: (module, enemy, weapon, dmg) => {
                    if (exiting) return;
                    if (!userData.multiplayer || !pvpMode) return;

                    const lara = game.getLara();
                    if (!enemy || ptr(enemy).isNull() || String(ptr(enemy)) === String(lara)) return;

                    const player = otherPlayers.find(p => String(p.laraPointer) === String(ptr(enemy)));
                    if (player?.health && player.health > 0) {
                        send({
                            event: "multiplayer:sendDmg",
                            args: {
                                dealDmg: parseInt(dmg, 16),
                                dealWpn: parseInt(weapon, 16),
                                dealPlayer: String(player.id)
                            }
                        });
                    }
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
                        game.deleteUiText(topCenterLabel);
                        topCenterLabel = null;
                    }

                    game.deleteAllUiTexts();

                    // Main Menu?
                    currentLevel = game.readMemoryVariable("Level", manifest.executable);
                    if (game.isLevelMenu(currentLevel)) {
                        game.setupMenuText();
                    }
                }
            },

            EndLevelSeq: {
                before: (module, p1, p2, p3, p4) => {
                    console.log("EndLevelSeq", module, p1, currentLevel);
                }
            },

            LoadedLevel: {
                before: (module, p1, p2, p3, p4) => {
                    game.deleteUiText(topLeftLabel);
                    topLeftLabel = null;

                    levelIsRestarting = levelLastLoadedId === p1;
                    levelLastLoadedId = p1;

                    laraPointer = null;
                    isRendering = false;
                    isSimulatingHair = false;

                    currentLevel = game.readMemoryVariable("Level", manifest.executable);

                    console.log("LoadedLevel", module, p1, currentLevel);
                }
            },

            LoadLevelAssets: {
                after: (module) => {
                    console.log("LoadLevelAssets");
                    game.setLara();

                    if (userData.multiplayer) {
                        game.deleteAllUiTexts();
                        game.cleanupLaraSlots();
                        game.closeModMenu();

                        // Main Menu?
                        if (game.isLevelMenu(currentLevel)) {
                            game.setupMenuText();
                        }

                        if (!initiatedChat) {
                            initiatedChat = true;
                            chatMessages = [
                                {
                                    time: Date.now(),
                                    name: null,
                                    text: "Welcome to Tomb Raider Multiplayer.  [ko-fi.com/burn_sours]"
                                },
                                {time: Date.now(), name: null, text: "Type /quiz for trivia - credits to @joef93 & @gizzy_91"},
                                {
                                    time: Date.now(),
                                    name: null,
                                    text: "[F2] Menu, [F4] Confirm, [F8] Chat"
                                }
                            ];
                        }
                    }
                }
            },

            CanInterpolateCamera: {
                after: (module) => {
                    return game.runFunction(module, "CanInterpolateCamera");
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
                    const projectileRadius = 256;
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

                            // GFX
                            game.playExplosionGraphic(projectileX, projectileY, projectileZ, projectileRoomId);

                            // DMG
                            const isTR2 = module === "tomb2.dll";
                            game.runFunction(module, "OnDamage", playerConnection.laraPointer, isTR2 ? 0x6 : 0x7, isTR2 ? 0x1e : 0x14);
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(grenadeId);
                    if (idx > -1) delete processingProjectiles[idx];
                }
            },

            EntityRocket: {
                before: (module, rocketId) => {
                    if (processingProjectiles.includes(rocketId)) return;

                    game.runFunction(module, "EntityRocket", rocketId);

                    if (!userData.multiplayer) return;
                    if (!pvpMode) return;

                    const projectile = game.getEntityPointer(rocketId);
                    if (!projectile || projectile.isNull()) return;

                    processingProjectiles.push(rocketId);

                    const projectileX = projectile.add(ENTITY_X).readS32();
                    const projectileY = projectile.add(ENTITY_Y).readS32();
                    const projectileZ = projectile.add(ENTITY_Z).readS32();
                    const projectileRoomId = projectile.add(ENTITY_ROOM).readU16();
                    const projectileRadius = 512; // 1024 << (projectile.add(0x3a).readS8() & 0x1f);
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
                            game.runFunction(module, "RemoveEntity", rocketId);
                            game.runFunction(module, "SoundEffect", 0x69, ptr(0x0), 0x0);

                            // GFX
                            game.playExplosionGraphic(projectileX, projectileY, projectileZ, projectileRoomId);

                            // DMG
                            game.runFunction(module, "OnDamage", playerConnection.laraPointer, 0x6, 0x1e);
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(rocketId);
                    if (idx > -1) delete processingProjectiles[idx];
                }
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
                            const weaponId = module === "tomb2.dll" ? 0x7 : 0x8;
                            const weaponDmg = module === "tomb2.dll" ? 0x4 : 0x6;
                            game.runFunction(module, "OnDamage", playerConnection.laraPointer, weaponId, weaponDmg);
                            break;
                        }
                    }

                    const idx = processingProjectiles.indexOf(dartId);
                    if (idx > -1) delete processingProjectiles[idx];
                }
            },

            UpdateLighting: {
                before: (module, x, y, z, roomId, ref) => {
                    if (!userData.multiplayer) return;

                    if (String(ref) === String(laraPointer.add(0x80))) {
                        for (let playerConnection of otherPlayers) {
                            if (playerConnection.laraPointer && !playerConnection.laraPointer.isNull()) {
                                game.runFunction(
                                    module,
                                    "UpdateLighting",
                                    playerConnection.laraPointer.add(ENTITY_X).readS32(),
                                    playerConnection.laraPointer.add(ENTITY_Y).readS32(),
                                    playerConnection.laraPointer.add(ENTITY_Z).readS32(),
                                    playerConnection.laraPointer.add(ENTITY_ROOM).readS16(),
                                    playerConnection.laraPointer.add(0x80)
                                );
                                if (playerConnection.vehicleId != null && playerConnection.vehicle && !playerConnection.vehicle.isNull()) {
                                    game.runFunction(
                                        module,
                                        "UpdateLighting",
                                        playerConnection.vehicle.add(ENTITY_X).readS32(),
                                        playerConnection.vehicle.add(ENTITY_Y).readS32(),
                                        playerConnection.vehicle.add(ENTITY_Z).readS32(),
                                        playerConnection.vehicle.add(ENTITY_ROOM).readS16(),
                                        playerConnection.vehicle.add(0x80)
                                    );
                                }
                            }
                        }
                    }
                }
            },

            RenderLara: {
                after: (module, entity, z, y, sector) => {
                    if (isRendering || exiting) return;
                    if (!laraPointer || laraPointer.isNull()) return;

                    const execVariables = game.getModuleAddresses(manifest.executable).variables;
                    const moduleAddresses = game.getModuleAddresses(module);
                    const moduleVariables = moduleAddresses.variables;
                    const moduleBase = moduleBaseAddresses[module];
                    
                    let renderArgs = [entity, z, y, sector];
                    if (moduleAddresses.hooks.RenderLara.Params.length === 1) {
                        renderArgs = [entity];
                    }

                    if (!userData.multiplayer) {
                        game.runFunction(module, "RenderLara", ...renderArgs);
                        return;
                    }

                    if (changedPlayerRoom != null) {
                        game.runFunction(module, "RoomChange", game.readMemoryVariable("LaraId", module), changedPlayerRoom);
                        changedPlayerRoom = null;
                        return;
                    }

                    let appearancePointer;
                    let gunFlagsPointer;
                    let gunTypesPointer;
                    const originalInterpolationFactor = game.readMemoryVariable("InterpolationFactor", module);

                    const gameSettings = executableBase.add(execVariables.GameSettings.Address);
                    const isRenderingModern = gameSettings.readU8() & 1;

                    try {
                        appearancePointer = executableBase.add(execVariables.LaraAppearanceModern.Address);
                        gunFlagsPointer = moduleBase.add(moduleVariables.LaraGunFlags.Address);
                        gunTypesPointer = moduleBase.add(moduleVariables.LaraGunType.Address);

                        isRendering = laraPointer;

                        game.runFunction(module, "Clone", laraBackup, laraPointer, ENTITY_SIZE);
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

                        const shouldUpdateHair = playerConnection.hasFreshRenderState && !isSimulatingHair;

                        try {
                            // Check FOV
                            const lara3dHeadOffset = (playerConnection.roomType === 1 || playerConnection.roomType === 2 ? -400 : -650);
                            let directionX = playerConnection.laraPointer.add(ENTITY_X).readS32() - cameraX;
                            let directionY = (playerConnection.laraPointer.add(ENTITY_Y).readS32() + lara3dHeadOffset) - cameraY;
                            let directionZ = playerConnection.laraPointer.add(ENTITY_Z).readS32() - cameraZ;
                            let relativeYawPitch = game.allocMemory(0x4);
                            game.runFunction(module, "CalculateYawPitch", directionX, directionY, directionZ, relativeYawPitch);
                            let yawDiff = (Math.abs(relativeYawPitch.readU16() - cameraYaw) + 32768) % 65536 - 32768;
                            if (yawDiff < 0) yawDiff += 65536;
                            let pitchDiff = (Math.abs(relativeYawPitch.add(0x2).readU16() - cameraPitch) + 32768) % 65536 - 32768;
                            if (pitchDiff < 0) pitchDiff += 65536;
                            const isWithinFOV = (yawDiff < 22071 || yawDiff > 50000) && (pitchDiff < 10921 || pitchDiff > 34595);
                            if (!isWithinFOV) continue;

                            //
                            isRendering = playerConnection.laraPointer;

                            game.runFunction(module, "Clone", laraPointer, playerConnection.laraPointer, ENTITY_SIZE);
                            game.runFunction(module, "Clone", appearancePointer, playerConnection.appearance, LARA_APPEARANCE_SIZE);
                            if (game.hasFunction(module, "LoadOutfits")) {
                                game.runFunction(module, "LoadOutfits");
                            }

                            const hairLeftX = game.getMemoryVariable("LaraHairLeftX", module);

                            game.runFunction(
                                module,
                                "Clone",
                                hairLeftX,
                                playerConnection.hairLeftPointer,
                                LARA_HAIR_SIZE
                            );

                            // Ensure vanilla outfit index 
                            const outfit = appearancePointer.readS32();
                            const maxOutfits = moduleAddresses.challengeOutfits ? 44 : 14;
                            if (outfit < 1 || outfit > maxOutfits) {
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
                            if (shouldUpdateHair) {
                                playerConnection.hasFreshRenderState = false;

                                const hairFlag = module === "tomb1.dll" ? 0xbd : 2;
                                game.runFunction(module, "SimulateLaraHair", 0, hairFlag);
                            }

                            // Vehicles?
                            if (playerConnection.vehicleId != null && playerConnection.vehicle && !playerConnection.vehicle.isNull() && playerConnection.vehicleLoaded) {
                                game.runFunction(module, "Clone", playerConnection.vehicle.add(ENTITY_ROOM), playerConnection.laraPointer.add(ENTITY_ROOM), 0x4);

                                const modelId = playerConnection.vehicle.add(ENTITY_MODEL).readS16();

                                if (playerConnection.vehicleLoaded) {
                                    if ([14].includes(modelId) && game.hasFunction(module, "RenderBoat")) {
                                        game.runFunction(module, "RenderBoat", playerConnection.vehicle);
                                    } else if ([51, 13].includes(modelId) && game.hasFunction(module, "RenderSkidoo")) {
                                        game.runFunction(module, "RenderSkidoo", playerConnection.vehicle);
                                    } else if ([14, 15, 16, 17, 19].includes(modelId) && game.hasFunction(module, "RenderEntity")) {
                                        let vehicleParams = [playerConnection.vehicle, z, y, sector];
                                        if (moduleAddresses.hooks.RenderEntity.Params.length === 1) {
                                            vehicleParams = [playerConnection.vehicle];
                                        }
                                        game.runFunction(module, "RenderEntity", ...vehicleParams);
                                    }
                                }
                            }

                            if (shouldUpdateHair) {
                                // Persist other lara hair
                                game.runFunction(module, "Clone",
                                    playerConnection.hairLeftPointer,
                                    hairLeftX,
                                    LARA_HAIR_SIZE
                                );
                            }

                            if (isRenderingModern) {
                                // Set smoothness based on other player's network speed
                                const interpolate = Math.min(256, ((Date.now() - playerConnection.timeLastData) / 33) * 256);
                                game.writeMemoryVariable("InterpolationFactor", interpolate, module);
                            }

                            // Render her
                            let otherRenderArgs = [playerConnection.laraPointer, z, y, sector];
                            if (moduleAddresses.hooks.RenderLara.Params.length === 1) {
                                otherRenderArgs = [playerConnection.laraPointer];
                            }
                            game.runFunction(module, "RenderLara", ...otherRenderArgs);
                        } catch (err) {
                            console.warn("Cannot render other lara: ", err.message);
                        }
                    }

                    try {
                        // Main Lara; restore
                        isRendering = "restoring";
                        game.writeMemoryVariable("InterpolationFactor", originalInterpolationFactor, module);
                        game.restoreLara();
                        isRendering = laraPointer;

                        if (currentLevel > 0) {
                            const face = executableBase.add(execVariables.LaraAppearanceModern.Address).add(0x9).readS8();
                            game.updateFaceModelOG(face === 1);
                            game.updateGunModelsOG();
                        }

                        // Render
                        game.runFunction(module, "RenderLara", ...renderArgs);
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

                    const moduleAddresses = game.getModuleAddresses(module);
                    const moduleUiLayer = moduleAddresses.uiLayer;

                    if (!userData.multiplayer) {
                        game.runFunction(module, "DrawSetup", moduleUiLayer, ptr(0x0));

                        const isPermaDamageOnly = game.isOnlyPermaDamageEnabled();
                        const labelText = isPermaDamageOnly ? permaDamageText : modsText;

                        if (!topLeftLabel || topLeftLabel.isNull()) {
                            topLeftLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(labelText)));
                            topLeftLabel.writeS32(4097); // flag settings
                            topLeftLabel.add(0x50).writeS32(15000); // font size
                            topLeftLabel.add(0xc).writeFloat(6); // x
                            topLeftLabel.add(0x10).writeFloat(6); // y
                            topLeftLabel.add(0x40).writeS32(0x0); // color
                        }

                        let displayText = labelText + " (" + game.levelName(currentLevel) + ")";
                        if (isPermaDamageOnly) {
                            const health = Math.max(0, lara.add(ENTITY_HEALTH).readS16());
                            displayText += " - " + userData.gameHash.substring(0, 8) + " - HP: " + health;
                        }
                        game.updateString(
                            topLeftLabel.add(0x48).readPointer(),
                            displayText
                        );
                        return;
                    }

                    if (pvpMode) {
                        let hp = lara.add(ENTITY_HEALTH).readS16();
                        if (hp < 0xfb) {
                            const binaryTick = game.readMemoryVariable("BinaryTick", module);
                            binaryTick === 0 && (hp = 0);
                        }
                        if (hp > 1000) {
                            hp = 1000;
                        }
                        let drawArgs = [hp / 10, 1];
                        if (moduleAddresses.hooks.DrawHealth.Params.length === 1) {
                            drawArgs = [hp / 10];
                        }
                        game.runFunction(module, "DrawHealth", ...drawArgs);
                    }

                    if (!userData.multiplayer) return;

                    game.runFunction(module, "DrawSetup", moduleUiLayer, ptr(0x0));

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
                    if (!topLeftLabel || topLeftLabel.isNull()) {
                        topLeftLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString(multiplayerText)));
                        if (!topLeftLabel || topLeftLabel.isNull()) {
                            return;
                        }
                        topLeftLabel.writeS32(4097); // flag settings
                        topLeftLabel.add(0x50).writeS32(15000); // font size
                        topLeftLabel.add(0xc).writeFloat(6); // x
                        topLeftLabel.add(0x10).writeFloat(6); // y
                        topLeftLabel.add(0x40).writeS32(0x0); // color
                    }

                    const players = othersCount + 1;
                    const lobbyName = (!userData.hideLobbyCode && userData.lobbyCode?.length && userData.lobbyCode !== "_" ? userData.lobbyCode + "; " : "");
                    game.updateString(
                        topLeftLabel.add(0x48).readPointer(),
                        multiplayerText + " (" + lobbyName + game.levelName(currentLevel) + ": " + players + " players)"
                    );

                    // Render mod menu system
                    game.renderModMenu(module);

                    // Handle topCenterLabel: confirmation messages
                    const showConfirm = modMenuConfirmMessage && (Date.now() - modMenuConfirmTime < MOD_MENU_CONFIRM_TIMEOUT);
                    if (showConfirm) {
                        if (!topCenterLabel || topCenterLabel.isNull()) {
                            topCenterLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("...")));
                            topCenterLabel.writeS32(4113);
                            topCenterLabel.add(0x50).writeS32(25000);
                            topCenterLabel.add(0x10).writeFloat(10);
                            topCenterLabel.add(0x40).writeS32(0x00011111);
                        }
                        game.updateString(topCenterLabel.add(0x48).readPointer(), modMenuConfirmMessage);
                    } else {
                        if (modMenuConfirmMessage) modMenuConfirmMessage = null;
                        if (topCenterLabel && !topCenterLabel.isNull()) {
                            game.deleteUiText(topCenterLabel);
                            topCenterLabel = null;
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

                    if (userData.enableChat) {
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

        // Export
        rpc.exports = game;
    `);
};
