module.exports = {
    // language=JavaScript
    template: `
        let infiniteOxygenTrackingDisabled = true;
        let infiniteOxygenInitialized = false;

        const infiniteOxygenLoop = () => {
            if (!infiniteOxygenInitialized) {
                infiniteOxygenInitialized = true;
                if (game.getLara()) {
                    infiniteOxygenTrackingDisabled = false;
                }
            }

            if (!userData['infinite-oxygen']) return;

            const lara = game.getLara();
            if (infiniteOxygenTrackingDisabled || !lara || lara.isNull()) return;

            try {
                game.writeMemoryVariable("LaraOxygen", 1900, game.getGameModule());
            } catch (err) {
                console.error("Infinite Oxygen error:", err);
            }
        };
    `,

    hooks: {
        LoadedLevel: {
            // language=JavaScript
            before: `
                if (!userData['infinite-oxygen']) return;
                infiniteOxygenTrackingDisabled = true;
            `
        },

        LaraInLevel: {
            // language=JavaScript
            after: `
                if (!userData['infinite-oxygen']) return;
                infiniteOxygenTrackingDisabled = false;
            `
        }
    },

    loops: [
        { interval: 10, name: 'infiniteOxygenLoop' }
    ]
};