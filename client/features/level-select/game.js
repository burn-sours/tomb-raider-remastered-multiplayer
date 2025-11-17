module.exports = {
    // language=JavaScript
    template: `
        let levelSelect_initialized = false;
        let levelSelect_lastSentLevel = null;
        let levelSelect_lastGameModule = null;
        let levelSelect_targetLevel = null;
        let levelSelect_targetNewGamePlus = false;
        let levelSelect_targetLoop = false;

        const levelSelect_buildLevelList = (module) => {
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

        const levelSelect_sendLevelData = (module) => {
            const levels = levelSelect_buildLevelList(module);
            const levelNames = game.levelNames[module] || {};

            send({
                event: "standalone:levelSelectData",
                args: {
                    levels: levels,
                    currentLevel,
                    gameModule: module,
                    levelNames: levelNames
                }
            });

            levelSelect_lastSentLevel = currentLevel;
            levelSelect_lastGameModule = module;
        };

        const levelSelect_initialize = () => {
            if (levelSelect_initialized) return;

            try {
                const module = game.getGameModule();
                levelSelect_sendLevelData(module);
                levelSelect_initialized = true;
            } catch (err) {
                console.error("Level select initialization error:", err);
            }
        };

        const levelSelect_loop = () => {
            if (userData.standaloneFeatureId !== 'level-select') return;

            try {
                if (!levelSelect_initialized) {
                    levelSelect_initialize();
                }
                if (!levelSelect_initialized) return;

                const module = game.getGameModule();

                if (module !== levelSelect_lastGameModule) {
                    levelSelect_sendLevelData(module);
                }

                if (currentLevel !== levelSelect_lastSentLevel && currentLevel !== null) {
                    send({
                        event: "standalone:levelChanged",
                        args: {level: currentLevel}
                    });
                    levelSelect_lastSentLevel = currentLevel;
                }

                if (manifest.executable === "tomb123.exe") {
                    if (levelSelect_targetLoop && levelSelect_targetLevel === null && game.isInGame() && currentLevel !== null) {
                        levelSelect_targetLevel = currentLevel;
                    }

                    if (game.isInMenu() && levelSelect_targetLevel !== null) {
                        const menuSelectionValue = {
                            "tomb1.dll": 0x49,
                            "tomb2.dll": 0x7a,
                            "tomb3.dll": 0x93
                        }[module];
                        game.writeMemoryVariable("NewGamePlus", levelSelect_targetNewGamePlus ? 1 : 0, module);
                        game.writeMemoryVariable("UseSaveSlot", 0, module);
                        game.writeMemoryVariable("MenuSelection", menuSelectionValue, module);
                        game.writeMemoryVariable("MenuState", 0xd, module);
                    }
                }
            } catch (err) {
                console.error("Level select loop error:", err);
            }
        };

        const levelSelect_changeLevelAction = (levelChangeData) => {
            if (userData.standaloneFeatureId !== 'level-select') return;

            try {
                const module = game.getGameModule();
                const levelId = parseInt(levelChangeData.levelId);
                const returnToMainMenu = game.isLevelMenu(levelId);

                levelSelect_targetLevel = returnToMainMenu ? null : levelId;

                if (manifest.executable === "tomb123.exe") {
                    const isPauseMenu = game.readMemoryVariable("IsInGameScene", module) < 1;
                    if (isPauseMenu) {
                        game.writeMemoryVariable("MenuState", 0xd, module);
                    }

                    game.writeMemoryVariable("LevelId", 0, module);
                    game.writeMemoryVariable("LevelCompleted", 1, module);
                } else if (manifest.executable === "tomb456.exe") {
                    const isPauseMenu = game.readMemoryVariable("IsGameMenu", manifest.executable);

                    game.writeMemoryVariable("NewGamePlus", levelSelect_targetNewGamePlus ? 1 : 0, module);
                    game.writeMemoryVariable("LevelChange", levelId, module);

                    if (isPauseMenu) {
                        game.writeMemoryVariable("ReturnToMainMenu", 1, module);
                    }
                }
            } catch (err) {
                console.error("Level select changeLevel error:", err);
            }
        };

        const levelSelect_restartLevelAction = (restartData) => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            if (manifest.executable === "tomb456.exe") return;

            try {
                if (game.isInGame()) {
                    const module = game.getGameModule();
                    const isPauseMenu = game.readMemoryVariable("IsInGameScene", module) < 1;

                    if (isPauseMenu) {
                        game.writeMemoryVariable("MenuState", 0xd, module);
                    }

                    levelSelect_targetLevel = currentLevel;

                    game.writeMemoryVariable("LevelId", 0, module);
                    game.writeMemoryVariable("LevelCompleted", 1, module);
                } else {
                    send({ event: "standalone:actionFailed", args: {} });
                }
            } catch (err) {
                console.error("Level select restartLevel error:", err);
            }
        };

        const levelSelect_setLoopLevelAction = (loopData) => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            if (manifest.executable === "tomb456.exe") return;
            try {
                levelSelect_targetLoop = loopData.enabled || false;
                if (!levelSelect_targetLoop) {
                    levelSelect_targetLevel = null;
                }
            } catch (err) {
                console.error("Level select setLoopLevel error:", err);
            }
        };

        const levelSelect_setNewGamePlusAction = (ngPlusData) => {
            if (userData.standaloneFeatureId !== 'level-select') return;
            try {
                levelSelect_targetNewGamePlus = ngPlusData.enabled || false;
            } catch (err) {
                console.error("Level select setNewGamePlus error:", err);
            }
        };

        const levelSelect_cleanup = () => {
            levelSelect_targetLoop = false;
            levelSelect_targetLevel = null;
            levelSelect_targetNewGamePlus = false;
            levelSelect_initialized = false;
            levelSelect_lastSentLevel = null;
            levelSelect_lastGameModule = null;
        };
    `,

    hooks: {
        LoadedLevel: {
            // language=JavaScript
            before: `
                if (userData.standaloneFeatureId === 'level-select') {
                    if (manifest.executable === "tomb123.exe" && levelSelect_targetLevel !== null) {
                        args[0] = levelSelect_targetLevel;
                    }
                    levelSelect_targetLevel = null;
                }
            `
        }
    },

    loops: [
        { interval: 100, name: 'levelSelect_loop' }
    ],

    actions: {
        'changeLevel': 'levelSelect_changeLevelAction',
        'restartLevel': 'levelSelect_restartLevelAction',
        'setLoopLevel': 'levelSelect_setLoopLevelAction',
        'setNewGamePlus': 'levelSelect_setNewGamePlusAction',
        'cleanup': 'levelSelect_cleanup'
    }
};
