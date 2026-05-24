module.exports = {
    // language=JavaScript
    template: `
        let infiniteOxygenTrackingDisabled = true;
        let infiniteOxygenInitialized = false;

        const infiniteOxygenLoop = () => {
            if (!infiniteOxygenInitialized) {
                infiniteOxygenInitialized = true;
                if (game.getLara()) {
                    infiniteOxygenTrackingDisabled = false;
                }
            }

            if (!userData['infinite-oxygen']) return;

            const lara = game.getLara();
            if (!lara || lara.isNull()) return;

            try {
                const module = game.getGameModule();
                if (module === "tomb6.dll" && infiniteOxygenTrackingDisabled) {
                    infiniteOxygenTrackingDisabled = false;
                }
                if (infiniteOxygenTrackingDisabled) return;

                if (module === "tomb6.dll") {
                    let animId = -1;
                    try {
                        const laraPtr = game.getMemoryVariable("MainPlayerEntity", module).readPointer();
                        if (laraPtr && !laraPtr.isNull()) {
                            const statePtr = laraPtr.add(0x178).readPointer();
                            if (statePtr && !statePtr.isNull()) {
                                animId = statePtr.readU32();
                            }
                        }
                    } catch (e) {}
                    if (animId !== 109 && animId !== 117 && animId !== 118) return;
                    game.writeMemoryVariable("PlayerOxygen", 1.9, module);
                    return;
                }
                    
                game.writeMemoryVariable("PlayerOxygen", 1900, module);
            } catch (err) {
                console.error("Infinite Oxygen error:", err);
            }
        };
    `,

    hooks: {
        LoadedLevel: {
            // language=JavaScript
            before: `
                if (!userData['infinite-oxygen']) return;
                infiniteOxygenTrackingDisabled = true;
            `
        },

        LoadLevelAssets: {
            // language=JavaScript
            after: `
                if (!userData['infinite-oxygen']) return;
                infiniteOxygenTrackingDisabled = false;
            `
        }
    },

    loops: [
        { interval: 10, name: 'infiniteOxygenLoop' }
    ]
};