module.exports = {
    // language=JavaScript
    template: `
        const permaPoisonLoop = () => {
            if (!userData['perma-poison']) return;

            const lara = game.getLara();
            if (levelTrackingDisabled || !lara || lara.isNull()) return;

            try {
                const module = game.getGameModule();
                if (!module) return;

                const moduleAddresses = game.getModuleAddresses(module);
                if (!moduleAddresses) return;

                const currentHealth = lara.add(moduleAddresses.variables.LaraHealth.Pointer).readS16();
                if (currentHealth > 0) {
                    game.writeMemoryVariable("LaraPoisoned", 4000, module);
                    game.writeMemoryVariable("PoisonFactor", 1, module);
                }
            } catch (err) {
                console.error("Perma Poison error:", err);
            }
        };
    `,

    loops: [
        { interval: 100, name: 'permaPoisonLoop' }
    ]
};
