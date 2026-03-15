module.exports = {
    // language=JavaScript
    template: `
        let permaDamageHealth = 1000;
        let permaDamageTrackingDisabled = true;
        let permaDamageInitialized = false;

        const trackPermaDamageHealthLoop = () => {
            if (!permaDamageInitialized) {
                permaDamageInitialized = true;
                if (game.getLara()) {
                    permaDamageTrackingDisabled = false;
                }
            }

            if (!userData['perma-damage'] || permaDamageTrackingDisabled) return;
            if (!game.isLevelSupported(game.readMemoryVariable("Level", manifest.executable))) return;

            const lara = game.getLara();
            if (!lara || lara.isNull()) return;
            
            try {
                permaDamageHealth = lara.add(ENTITY_HEALTH).readS16();
            } catch (err) {
                console.error("Track health error:", err);
            }
        };
    `,

    hooks: {
        LoadedLevel: {
            // language=JavaScript
            before: `
                if (!userData['perma-damage']) return;
                permaDamageTrackingDisabled = true;
            `
        },

        LoadLevelAssets: {
            // language=JavaScript
            after: `
                if (!userData['perma-damage']) return;

                // Define 1st levels to engage permadamage
                const firstLevel = {'tomb1.dll': 2, 'tomb2.dll': 2, 'tomb3.dll': 2, 'tomb4.dll': 2, 'tomb5.dll': 2};
                const firstExpansionLevel = {'tomb1.dll': 18, 'tomb2.dll': 19, 'tomb3.dll': 21, 'tomb4.dll': 40, 'tomb5.dll': 0};
                const lara = game.getLara();

                if (lara && !lara.isNull() && game.isLevelSupported(currentLevel)) {
                    if (lara.add(ENTITY_HEALTH).readS16() > 1000) {
                        lara.add(ENTITY_HEALTH).writeS16(1000);
                    }

                    if ((currentLevel >= firstLevel[module] && currentLevel !== firstExpansionLevel[module]) && permaDamageHealth > 0) {
                        lara.add(ENTITY_HEALTH).writeS16(Math.min(1000, permaDamageHealth));
                    }
                }

                permaDamageTrackingDisabled = false;
            `
        },

        RenderUI: {
            // language=JavaScript
            after: `
                if (!userData['perma-damage']) return;

                const lara = game.getLara();
                if (exiting || !lara || lara.isNull()) return;

                const moduleAddresses = game.getModuleAddresses(module);
                const moduleHooks = moduleAddresses.hooks;
                
                if (!moduleHooks.DrawHealth) return;

                if (!pvpMode) {
                    let hp = lara.add(ENTITY_HEALTH).readS16();
                    if (hp < 0xfb) {
                        const binaryTick = game.readMemoryVariable("BinaryTick", module);
                        binaryTick === 0 && (hp = 0);
                    }
                    if (hp > 1000) {
                        hp = 1000;
                    }
                    let drawArgs = [hp / 10, 0];
                    if (moduleAddresses.hooks.DrawHealth.Params.length === 1) {
                        drawArgs = [hp / 10];
                    }
                    game.runFunction(module, "DrawHealth", ...drawArgs);
                }
            `
        }
    },

    loops: [
        { interval: 500, name: 'trackPermaDamageHealthLoop' }
    ]
};