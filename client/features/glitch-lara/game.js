module.exports = {
    // language=JavaScript
    template: ``,

    hooks: {
        KeyboardInput: {
            // language=JavaScript
            before: `
                if (!userData['glitch-lara']) return;

                const [keycode, pressedDown] = args;

                // keycode 68 = F7
                if (pressedDown > 0 && Number(keycode) === 68) {
                    const lara = game.getLara();
                    if (!lara || lara.isNull()) return;
                    try {
                        lara.add(ENTITY_STATUS).writeU16(lara.add(ENTITY_STATUS).readU16() | 0x8);
                    } catch (err) {
                        console.error("Glitch Lara error:", err);
                    }
                }
            `
        }
    }
};
