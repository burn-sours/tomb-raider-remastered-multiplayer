module.exports = {
    // language=JavaScript
    template: `
        let infiniteHealthTrackingDisabled = true;
        let infiniteHealthInitialized = false;

        const infiniteHealthLoop = () => {
            if (!infiniteHealthInitialized) {
                infiniteHealthInitialized = true;
                if (game.getLara()) {
                    infiniteHealthTrackingDisabled = false;
                }
            }

            if (!userData['infinite-health']) return;

            const lara = game.getLara();
            if (infiniteHealthTrackingDisabled || !lara || lara.isNull()) return;

            try {
                const module = game.getGameModule();
                const moduleAddresses = game.getModuleAddresses(module);
                
                const currentHealth = lara.add(ENTITY_HEALTH).readS16();
                if (currentHealth > 0) {
                    lara.add(ENTITY_HEALTH).writeS16(2000);
                }
            } catch (err) {
                console.error("Infinite Health error:", err);
            }
        };
    `,

    hooks: {
        LoadedLevel: {
            // language=JavaScript
            before: `
                if (!userData['infinite-health']) return;
                infiniteHealthTrackingDisabled = true;
            `
        },

        LoadLevelAssets: {
            // language=JavaScript
            after: `
                if (!userData['infinite-health']) return;
                infiniteHealthTrackingDisabled = false;
            `
        }
    },

    loops: [
        { interval: 10, name: 'infiniteHealthLoop' }
    ]
};