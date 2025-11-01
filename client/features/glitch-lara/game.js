module.exports = {
    // language=JavaScript
    template: `
        const glitchLaraLoop = () => {
            if (!userData['glitch-lara']) return;

            const lara = game.getLara();
            if (!lara || lara.isNull()) return;

            try {
                const module = game.getGameModule();
                const moduleAddresses = game.getModuleAddresses(module);
                const flags = lara.add(moduleAddresses.variables.LaraFlags.Pointer).readU16();
                lara.add(moduleAddresses.variables.LaraFlags.Pointer).writeU16(flags | 0x8);
            } catch (err) {
                console.error("Glitch Lara error:", err);
            }
        };
    `,

    loops: [
        { interval: 10, name: 'glitchLaraLoop' }
    ]
};