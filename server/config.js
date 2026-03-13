const { djb2Hash } = require('./utils');

const MAJOR_VERSION = "2.2.2";

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
    }
};
