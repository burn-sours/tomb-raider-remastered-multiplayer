
module.exports = {
    // language=JavaScript
    template: `
        const noFallDamageLoop = () => {
            if (!userData['no-fall-damage']) return;

            const lara = game.getLara();
            const module = game.getGameModule();
            const roomType = game.readMemoryVariable("RoomType", module);

            if (!lara || lara.isNull() || roomType !== 0) return;

            try {
                const moduleAddresses = game.getModuleAddresses(module);
                const fallSpeed = 130;
                let speed = lara.add(moduleAddresses.variables.LaraYSpeed.Pointer).readS16();
                if (speed > fallSpeed) {
                    speed = fallSpeed;
                    lara.add(moduleAddresses.variables.LaraYSpeed.Pointer).writeS16(speed);
                }
            } catch (err) {
                console.error("No Fall Damage error:", err);
            }
        };
    `,

    loops: [
        { interval: 50, name: 'noFallDamageLoop' }
    ]
};