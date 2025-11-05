const { djb2Hash } = require('./utils');

const MAJOR_VERSION = "2.0";

module.exports = {
    server: {
        /**
         * Server major version
         */
        major: MAJOR_VERSION,

        /**
         * Hashed major version
         */
        majorHash: djb2Hash(MAJOR_VERSION),

        /**
         * Enable quiz system
         */
        quizEnabled: true,
    }
};
