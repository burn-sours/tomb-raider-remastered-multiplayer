module.exports = {
    // language=JavaScript
    template: `
        let needsUpdateTime = false;
        let superSpeedActive = false;

        const getSpeedConfig = () => {
            const m = (typeof game.getGameModule === 'function') ? game.getGameModule() : null;
            if (m === 'tomb6.dll') {
                return { base: 0x3c, master: 0x6a, climb: 0xa0, push: 0xa0, swim: 0x80 };
            }
            return { base: 0x1e, master: 0x35, climb: 0x50, push: 0x50, swim: 0x40 };
        };

        const resetTimeSpeed = () => {
            try {
                const cfg = getSpeedConfig();
                game.writeMemoryVariable("DevMode", 1, manifest.executable);
                game.writeMemoryVariable("DevModeSpeed", cfg.base, manifest.executable);
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
                const cfg = getSpeedConfig();

                if (userData['super-speed']) {
                    if (!superSpeedActive || needsUpdateTime !== cfg.master) {
                        superSpeedActive = true;
                        needsUpdateTime = cfg.master;
                    }
                    return;
                }

                const isTR6 = (module === 'tomb6.dll');
                const isTR45 = (module === 'tomb4.dll' || module === 'tomb5.dll');

                let lara = game.getLara();

                let animId;
                if (isTR6) {
                    try {
                        if (lara && !lara.isNull()) {
                            const statePtr = lara.add(0x178).readPointer();
                            animId = (statePtr && !statePtr.isNull()) ? statePtr.readU32() : -1;
                        } else {
                            animId = -1;
                        }
                    } catch (e) { animId = -1; }
                } else {
                    animId = lara?.add(ENTITY_ANIM_ID).readS16();
                }

                const isAnimShimmy = isTR6 ? [88].includes(animId) : isTR45 ? [136, 137, 355, 357].includes(animId) : [136, 137].includes(animId);
                const isAnimClimb = isTR6 ? [9, 11, 87, 93].includes(animId) : isTR45 ? [161, 162, 163, 165, 166, 167, 168, 169, 173, 170, 171, 329, 335, 336].includes(animId) : module === "tomb1.dll" ? false : [161, 165, 167, 168, 169, 170, 171, 173, 174, 187, 188].includes(animId);
                const isAnimCrawl = isTR6 ? false : isTR45 ? [260, 261, 269, 270, 275, 276].includes(animId) : module === "tomb3.dll" && [260, 261, 262, 269, 270, 275, 279, 280].includes(animId);
                const isAnimMonkeybars = isTR6 ? false : isTR45 ? [271, 272, 236, 237, 238, 239, 14].includes(animId) : module === "tomb3.dll" && [150, 271, 272, 283, 285, 236, 237, 239].includes(animId);
                const isAnimBlocking = isTR6 ? [125].includes(animId) : isTR45 ? [120, 121, 122, 123].includes(animId) : [120, 122, 123].includes(animId);
                const isAnimSwimming = isTR6 ? [109, 117, 118].includes(animId) : isTR45 ? [86, 87, 116, 117, 118, 119, 140, 141, 142].includes(animId) : [86, 107, 108, 116, 117, 118, 119, 198, 200, 140, 141, 142, 186, 184, 177, 38].includes(animId);

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
                            needsEnabling = cfg.climb;
                        } else if (isAnimClimb) {
                            needsEnabling = cfg.climb;
                        } else if (isAnimCrawl || isAnimMonkeybars) {
                            needsEnabling = cfg.climb;
                        }
                    }

                    if (userData['super-speed-pushblocks']) {
                        if (isAnimBlocking) {
                            needsEnabling = cfg.push;
                        }
                    }

                    if (userData['super-speed-swimming']) {
                        if (isAnimSwimming) {
                            needsEnabling = cfg.swim;
                        }
                    }
                }

                if (needsEnabling && !superSpeedActive) {
                    superSpeedActive = true;
                    needsUpdateTime = needsEnabling;
                } else if (needsDisabling && superSpeedActive) {
                    superSpeedActive = false;
                    needsUpdateTime = cfg.base;
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

    actions: {
        'cleanup': 'resetTimeSpeed'
    }
};