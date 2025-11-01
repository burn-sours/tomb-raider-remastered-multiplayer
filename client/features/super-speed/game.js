module.exports = {
    // language=JavaScript
    template: `
        let needsUpdateTime = false;
        let superSpeedActive = false;

        const resetTimeSpeed = () => {
            try {
                game.writeMemoryVariable("DevMode", 1, manifest.executable);
                game.writeMemoryVariable("DevModeSpeed", 0x1e, manifest.executable);
                game.runFunction(manifest.executable, "UpdateTickRef");
                game.writeMemoryVariable("DevMode", 0, manifest.executable);
            } catch (err) {
                console.error("Reset time speed error:", err);
            }
        };

        const superSpeedLoop = () => {
            const enabled = userData['super-speed'] || userData['super-speed-climb'] || userData['super-speed-pushblocks'] || userData['super-speed-swimming'];
            if (!enabled) {
                if (superSpeedActive) {
                    resetTimeSpeed();
                    superSpeedActive = false;
                }
                return;
            }

            try {
                const module = game.getGameModule();

                if (userData['super-speed']) {
                    if (!superSpeedActive || needsUpdateTime !== 0x35) {
                        superSpeedActive = true;
                        needsUpdateTime = 0x35;
                    }
                    return;
                }

                const animId = game.readMemoryVariable("LaraAnim", module);

                // Animation IDs - different for TR1-3 vs TR4-5
                const isTR45 = (module === 'tomb4.dll' || module === 'tomb5.dll');

                const isAnimShimmy = isTR45 ? [136, 137, 355, 357].includes(animId) : [136, 137].includes(animId);
                const isAnimClimb = isTR45 ? [161, 162, 163, 165, 166, 167, 168, 169, 173, 170, 171, 329, 335, 336].includes(animId) : module === "tomb1.dll" ? false : [161, 165, 167, 168, 169, 170, 171, 173, 174, 187, 188].includes(animId);
                const isAnimCrawl = isTR45 ? [260, 261, 269, 270, 275, 276].includes(animId) : module === "tomb3.dll" && [260, 261, 262, 269, 270, 275, 279, 280].includes(animId);
                const isAnimMonkeybars = isTR45 ? [271, 272, 236, 237, 238, 239, 14].includes(animId) : module === "tomb3.dll" && [150, 271, 272, 283, 285, 236, 237, 239].includes(animId);
                const isAnimBlocking = isTR45 ? [120, 121, 122, 123].includes(animId) : [120, 122, 123].includes(animId);
                const isAnimSwimming = isTR45 ? [86, 87, 116, 117, 118, 119, 140, 141, 142].includes(animId) : [86, 107, 108, 116, 117, 118, 119, 198, 200, 140, 141, 142, 186, 184, 177, 38].includes(animId);

                let needsEnabling = false;
                let needsDisabling = true;

                if (superSpeedActive) {
                    if (userData['super-speed-climb']) {
                        if (isAnimShimmy) {
                            needsDisabling = false;
                        } else if (isAnimClimb) {
                            needsDisabling = false;
                        } else if (isAnimCrawl || isAnimMonkeybars) {
                            needsDisabling = false;
                        }
                    }

                    if (userData['super-speed-pushblocks']) {
                        if (isAnimBlocking) {
                            needsDisabling = false;
                        }
                    }

                    if (userData['super-speed-swimming']) {
                        if (isAnimSwimming) {
                            needsDisabling = false;
                        }
                    }
                } else {
                    if (userData['super-speed-climb']) {
                        if (isAnimShimmy) {
                            needsEnabling = 0x50;
                        } else if (isAnimClimb) {
                            needsEnabling = 0x50;
                        } else if (isAnimCrawl || isAnimMonkeybars) {
                            needsEnabling = 0x50;
                        }
                    }

                    if (userData['super-speed-pushblocks']) {
                        if (isAnimBlocking) {
                            needsEnabling = 0x50;
                        }
                    }

                    if (userData['super-speed-swimming']) {
                        if (isAnimSwimming) {
                            needsEnabling = 0x40;
                        }
                    }
                }

                if (needsEnabling && !superSpeedActive) {
                    superSpeedActive = true;
                    needsUpdateTime = needsEnabling;
                } else if (needsDisabling && superSpeedActive) {
                    superSpeedActive = false;
                    needsUpdateTime = 0x1e;
                }
            } catch (err) {
                console.error("Super Speed loop error:", err);
            }
        };
    `,

    hooks: {
        TickFunction: {
            // language=JavaScript
            before: `
                const enabled = userData['super-speed'] || userData['super-speed-climb'] || userData['super-speed-pushblocks'] || userData['super-speed-swimming'];
                if (!enabled) return;
                game.writeMemoryVariable("DevMode", 1, manifest.executable);
            `,
            // language=JavaScript
            after: `
                const enabled = userData['super-speed'] || userData['super-speed-climb'] || userData['super-speed-pushblocks'] || userData['super-speed-swimming'];

                if (enabled) {
                    if (needsUpdateTime !== false) {
                        const newSpeed = needsUpdateTime;
                        needsUpdateTime = false;
                        game.writeMemoryVariable("DevModeSpeed", newSpeed, manifest.executable);
                        game.runFunction(manifest.executable, "UpdateTickRef");
                    }
                }

                game.writeMemoryVariable("DevMode", 0, manifest.executable);
            `
        }
    },

    loops: [
        { interval: 100, name: 'superSpeedLoop' }
    ],

    cleanup: `resetTimeSpeed();`
};