module.exports = {
    // language=JavaScript
    template: `
        const spiderLaraLoop = () => {
            if (!userData['spider-lara']) return;

            try {
                const module = game.getGameModule();
                const moduleAddresses = game.getModuleAddresses(module);

                if (!moduleAddresses?.variables?.LaraClimbState) return;

                game.writeMemoryVariable("LaraClimbState", 1, module);

                if (moduleAddresses?.variables?.LaraBehaviourFlags) {
                    game.writeMemoryVariable(
                        "LaraBehaviourFlags",
                        game.readMemoryVariable("LaraBehaviourFlags", module) | 0x40,
                        module
                    );
                }
            } catch (err) {
                console.error("Spider Lara error:", err);
            }
        };
    `,

    loops: [
        { interval: 10, name: 'spiderLaraLoop' }
    ]
};