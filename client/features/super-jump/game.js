module.exports = {
    // language=JavaScript
    template: `
        let superJumpActive = false;

        const superJumpLoop = () => {
            if (!userData['super-jump']) {
                superJumpActive = false;
                return;
            }

            const lara = game.getLara();
            const module = game.getGameModule();
            const roomType = game.readMemoryVariable("RoomType", module);

            if (!lara || lara.isNull() || roomType !== 0) return;

            const moduleAddresses = game.getModuleAddresses(module);
            const maxJumpSpeed = userData['super-speed'] ? 170 : 175;
            const current = lara.add(moduleAddresses.variables.LaraYSpeed.Pointer).readS16();
            let newSpeed = current;

            if (superJumpActive) {
                if (current < 0) {
                    newSpeed = Math.max(-maxJumpSpeed, current - 25);
                    lara.add(moduleAddresses.variables.LaraYSpeed.Pointer).writeS16(newSpeed);
                }
                if (newSpeed <= -maxJumpSpeed || (current < 0 && newSpeed >= 0)) {
                    superJumpActive = false;
                }
            } else if (current === 0) {
                superJumpActive = true;
            }
        };
    `,

    loops: [
        { interval: 5, name: 'superJumpLoop' }
    ]
};