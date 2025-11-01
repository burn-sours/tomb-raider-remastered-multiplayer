module.exports = {
    // language=JavaScript
    template: `
        const unlockGoldenPistolsLoop = () => {
            if (!userData['unlock-golden-pistols']) return;

            try {
                const module = game.getGameModule();

                // not available in old patches
                const currentSetting = game.readMemoryVariable("MoreSettings", module);
                if (currentSetting === null) return;

                const bitOffset = module === "tomb4.dll" || module === "tomb5.dll" ? 0x20 : 0x80;

                // Set bit {bitOffset} to unlock golden pistols
                game.writeMemoryVariable("MoreSettings", currentSetting | bitOffset, module);
            } catch (err) {
                console.error("Unlock Golden Pistols error:", err);
            }
        };
    `,

    loops: [
        { interval: 5000, name: 'unlockGoldenPistolsLoop' }
    ]
};