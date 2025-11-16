module.exports = {
    // language=JavaScript
    template: `
        let levelSelectInitialized = false;
        let lastSentLevel = null;
        let lastGameModule = null;
        let targetLevel = null;
        let targetNewGamePlus = false;
        let targetLoop = false;

        const buildLevelList = (module) => {
            /** @type {{ id: number, name: string, isMenu: boolean }[]} */
            const levels = [];
            const levelNames = game.levelNames[module] || {};

            for (const [id, name] of Object.entries(levelNames)) {
                const levelId = parseInt(id);
                const isSupported = game.isLevelSupported(levelId);
                const isMenu = game.isLevelMenu(levelId);

                if (isSupported && !isMenu) {
                    levels.push({
                        id: levelId,
                        name: name
                    });
                }
            }

            levels.sort((a, b) => a.id - b.id);

            return levels;
        };

        const sendLevelData = (module) => {
            const levels = buildLevelList(module);
            const currentLevel = game.readMemoryVariable("Level", manifest.executable);
            const levelNames = game.levelNames[module] || {};

            send({
                event: "standalone:levelSelectData",
                args: {
                    levels: levels,
                    currentLevel: currentLevel,
                    gameModule: module,
                    levelNames: levelNames
                }
            });

            lastSentLevel = currentLevel;
            lastGameModule = module;
        };

        const initializeLevelSelect = () => {
            if (levelSelectInitialized) return;

            try {
                const module = game.getGameModule();
                sendLevelData(module);
                levelSelectInitialized = true;
            } catch (err) {
                console.error("Level select initialization error:", err);
            }
        };

        const levelSelectLoop = () => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            
            try {

                if (!levelSelectInitialized) {
                    initializeLevelSelect();
                }

                if (!levelSelectInitialized) return;

                const module = game.getGameModule();

                if (module !== lastGameModule) {
                    sendLevelData(module);
                }

                if (currentLevel !== lastSentLevel && currentLevel !== null) {
                    send({
                        event: "standalone:levelChanged",
                        args: {level: currentLevel}
                    });
                    lastSentLevel = currentLevel;
                }

                if (manifest.executable === "tomb123.exe") {
                    if (targetLoop && targetLevel === null && game.isInGame() && currentLevel !== null) {
                        targetLevel = currentLevel;
                    }
                    
                    if (game.isInMenu() && targetLevel !== null) {
                        const menuSelectionValue = {
                            "tomb1.dll": 0x49,
                            "tomb2.dll": 0x7a,
                            "tomb3.dll": 0x93
                        }[module];
                        game.writeMemoryVariable("NewGamePlus", targetNewGamePlus ? 1 : 0, module);
                        game.writeMemoryVariable("UseSaveSlot", 0, module);
                        game.writeMemoryVariable("MenuSelection", menuSelectionValue, module);
                        game.writeMemoryVariable("MenuState", 0xd, module);
                    }
                }
            } catch (err) {
                console.error("Level select loop error:", err);
            }
        };

        const changeLevelAction = (data) => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            
            try {
                const module = game.getGameModule();
                const levelId = parseInt(data.levelId);
                const returnToMainMenu = game.isLevelMenu(levelId);

                targetLevel = returnToMainMenu ? null : levelId;
                
                if (manifest.executable === "tomb123.exe") {
                    const isPauseMenu = game.readMemoryVariable("IsInGameScene", module) < 1;
                    if (isPauseMenu) {
                        game.writeMemoryVariable("MenuState", 0xd, module);
                    }

                    game.writeMemoryVariable("LevelId", 0, module);
                    game.writeMemoryVariable("LevelCompleted", 1, module);
                } else if (manifest.executable === "tomb456.exe") {
                    const isPauseMenu = game.readMemoryVariable("IsGameMenu", manifest.executable);

                    game.writeMemoryVariable("NewGamePlus", targetNewGamePlus ? 1 : 0, module);
                    game.writeMemoryVariable("LevelChange", levelId, module);

                    if (isPauseMenu) {
                        game.writeMemoryVariable("ReturnToMainMenu", 1, module);
                    }
                }
            } catch (err) {
                console.error("Level select changeLevel error:", err);
            }
        };

        const restartLevelAction = (data) => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            if (manifest.executable === "tomb456.exe") return;
            
            try {
                if (game.isInGame()) {
                    const module = game.getGameModule();
                    const isPauseMenu = game.readMemoryVariable("IsInGameScene", module) < 1;

                    if (isPauseMenu) {
                        game.writeMemoryVariable("MenuState", 0xd, module);
                    }

                    targetLevel = currentLevel;

                    game.writeMemoryVariable("LevelId", 0, module);
                    game.writeMemoryVariable("LevelCompleted", 1, module);
                } else {
                    send({ event: "standalone:actionFailed", args: {} });
                }
            } catch (err) {
                console.error("Level select restartLevel error:", err);
            }
        };

        const setLoopLevelAction = (data) => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            if (manifest.executable === "tomb456.exe") return;
            try {
                targetLoop = data.enabled || false;
                if (!targetLoop) {
                    targetLevel = null;
                }
            } catch (err) {
                console.error("Level select setLoopLevel error:", err);
            }
        };

        const setNewGamePlusAction = (data) => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            try {
                targetNewGamePlus = data.enabled || false;
            } catch (err) {
                console.error("Level select setNewGamePlus error:", err);
            }
        };

        const refreshDataAction = () => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            try {
                if (levelSelectInitialized) {
                    const module = game.getGameModule();
                    sendLevelData(module);
                }
            } catch (err) {
                console.error("Level select refresh error:", err);
            }
        };

        const cleanupLevelSelect = () => {
            targetLoop = false;
            targetLevel = null;
            targetNewGamePlus = false;
            levelSelectInitialized = false;
            lastSentLevel = null;
            lastGameModule = null;
        };
    `,

    hooks: {
        LoadedLevel: {
            // language=JavaScript
            before: `
                if (userData.standaloneFeatureId === 'level-select') {
                    if (manifest.executable === "tomb123.exe" && targetLevel !== null) {
                        args[0] = targetLevel;
                    }
                    targetLevel = null;
                }
            `
        }
    },

    loops: [
        { interval: 100, name: 'levelSelectLoop' }
    ],

    actions: {
        'changeLevel': 'changeLevelAction',
        'restartLevel': 'restartLevelAction',
        'setLoopLevel': 'setLoopLevelAction',
        'setNewGamePlus': 'setNewGamePlusAction',
        'refreshData': 'refreshDataAction',
        'cleanup': 'cleanupLevelSelect'
    }
};
