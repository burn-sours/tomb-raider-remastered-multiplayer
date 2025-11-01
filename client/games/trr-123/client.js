const BaseGameClient = require('../../baseClient');

module.exports = (socket) => new class TRR123Client extends BaseGameClient {
    constructor(socket) {
        super(socket, "trr-123");
    }

    get gameScriptModule() {
        return require('./game');
    }

    async isLevelChanging() {
        return await this.gameFunctions.readMemoryVariable(
            'LevelCompleted',
            await this.gameFunctions.getGameModule()
        );
    }

    async launchGame(launchOptions) {
        await super.launchGame(launchOptions);

        if (!launchOptions.multiplayer && await this.gameFunctions.isLevelMenu(null)) {
            await this.gameFunctions.setupMenuText();
        }
    }
}(socket)
