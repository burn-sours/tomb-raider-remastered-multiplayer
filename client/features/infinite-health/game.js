module.exports = {
    // language=JavaScript
    template: `
        let infiniteHealthTrackingDisabled = true;

        const infiniteHealthLoop = () => {
            if (!userData['infinite-health']) return;

            const lara = game.getLara();
            if (infiniteHealthTrackingDisabled || !lara || lara.isNull()) return;

            try {
                const module = game.getGameModule();
                const moduleAddresses = game.getModuleAddresses(module);
                
                const currentHealth = lara.add(moduleAddresses.variables.LaraHealth.Pointer).readS16();
                if (currentHealth > 0) {
                    lara.add(moduleAddresses.variables.LaraHealth.Pointer).writeS16(2000);
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

        LaraInLevel: {
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