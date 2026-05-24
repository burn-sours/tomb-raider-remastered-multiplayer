module.exports = {
    // language=JavaScript
    template: `
        let infiniteStrengthTrackingDisabled = true;
        let infiniteStrengthInitialized = false;

        const infiniteStrengthLoop = () => {
            if (!infiniteStrengthInitialized) {
                infiniteStrengthInitialized = true;
                if (game.getLara()) {
                    infiniteStrengthTrackingDisabled = false;
                }
            }

            if (!userData['infinite-strength']) return;

            const lara = game.getLara();
            if (!lara || lara.isNull()) return;

            try {
                const module = game.getGameModule();
                if (module !== "tomb6.dll") return;
                if (game.isPaused && game.isPaused()) return;

                if (infiniteStrengthTrackingDisabled) {
                    infiniteStrengthTrackingDisabled = false;
                }

                const lara = game.getMemoryVariable("MainPlayerEntity", module).readPointer();
                if (!lara || lara.isNull()) return;
                const attr = lara.add(0x178).readPointer();
                if (!attr || attr.isNull()) return;
                attr.add(0x80).writeFloat(0.0);
            } catch (e) {
                // Silently swallow transient deref failures during transitions.
            }
        };
    `,

    hooks: {
        LoadedLevel: {
            // language=JavaScript
            before: `
                if (!userData['infinite-strength']) return;
                infiniteStrengthTrackingDisabled = true;
            `
        }
    },

    loops: [
        { interval: 10, name: 'infiniteStrengthLoop' }
    ]
};
