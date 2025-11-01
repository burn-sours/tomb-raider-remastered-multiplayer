module.exports = {
    // language=JavaScript
    template: `
        const infiniteHealthLoop = () => {
            if (!userData['infinite-health']) return;

            const lara = game.getLara();
            if (levelTrackingDisabled || !lara || lara.isNull()) return;

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

    loops: [
        { interval: 10, name: 'infiniteHealthLoop' }
    ]
};