const BaseGameClient = require('../../baseClient');

module.exports = (socket) => new class TRR6Client extends BaseGameClient {
    constructor(socket) {
        super(socket, "trr-6", 2);
    }

    get gameScriptModule() {
        return require('./game');
    }

    async isLevelChanging() {
        return (await this.gameFunctions.readMemoryVariable(
            "PendingStateTransition",
            await this.gameFunctions.getGameModule()
        )) === 6;
    }
}(socket)
