module.exports = {
    // language=JavaScript
    template: `
        let permaDamageHealth = 1000;

        const trackPermaDamageHealthLoop = () => {
            if (!userData['perma-damage'] || levelTrackingDisabled) return;
            const lara = game.getLara();
            if (!lara || lara.isNull()) return;
            if (!game.isLevelSupported(currentLevel)) return;

            try {
                const moduleAddresses = game.getModuleAddresses(game.getGameModule());
                permaDamageHealth = lara.add(moduleAddresses.variables.LaraHealth.Pointer).readS16();
            } catch (err) {
                console.error("Track health error:", err);
            }
        };
    `,

    hooks: {
        LaraInLevel: {
            // language=JavaScript
            after: `
                if (!userData['perma-damage']) return;

                // Define 1st levels to engage permadamage (skip tutorial/home levels) and first expansion levels
                const firstLevel = {'tomb1.dll': 2, 'tomb2.dll': 2, 'tomb3.dll': 2, 'tomb4.dll': 2, 'tomb5.dll': 2};
                const firstExpansionLevel = {'tomb1.dll': 18, 'tomb2.dll': 19, 'tomb3.dll': 21, 'tomb4.dll': 40, 'tomb5.dll': 0};
                const moduleAddresses = game.getModuleAddresses(module);
                const lara = game.getLara();
                
                if (lara && !lara.isNull() && game.isLevelSupported(currentLevel)) {
                    // Only restore health after first level
                    if ((currentLevel >= firstLevel[module] && currentLevel !== firstExpansionLevel[module]) && permaDamageHealth > 0) {
                        lara.add(moduleAddresses.variables.LaraHealth.Pointer).writeS16(permaDamageHealth);
                    }
                }
            `
        },

        RenderUI: {
            // language=JavaScript
            after: `
                if (!userData['perma-damage']) return;

                const lara = game.getLara();
                if (exiting || !lara || lara.isNull()) return;

                const moduleVariables = game.getModuleAddresses(module).variables;
                const moduleHooks = game.getModuleAddresses(module).hooks;
                
                if (!moduleHooks.DrawHealth) return;

                if (!pvpMode) {
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
            `
        }
    },

    loops: [
        { interval: 500, name: 'trackPermaDamageHealthLoop' }
    ]
};