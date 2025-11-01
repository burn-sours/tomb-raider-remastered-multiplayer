module.exports = {
    // language=JavaScript
    template: `
        const infiniteOxygenLoop = () => {
            if (!userData['infinite-oxygen']) return;

            const lara = game.getLara();
            if (levelTrackingDisabled || !lara || lara.isNull()) return;

            try {
                game.writeMemoryVariable("LaraOxygen", 1900, game.getGameModule());
            } catch (err) {
                console.error("Infinite Oxygen error:", err);
            }
        };
    `,

    loops: [
        { interval: 10, name: 'infiniteOxygenLoop' }
    ]
};