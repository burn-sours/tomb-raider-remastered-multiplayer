const BaseGameClient = require('../../baseClient');

module.exports = (socket) => new class TRR45Client extends BaseGameClient {
    constructor(socket) {
        super(socket, "trr-45");
    }

    get gameScriptModule() {
        return require('./game');
    }

    async isLevelChanging() {
        return (await this.gameFunctions.readMemoryVariable(
            "LevelChange",
            await this.gameFunctions.getGameModule()
        )) > 0;
    }
}(socket)
