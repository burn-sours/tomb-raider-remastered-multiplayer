const { djb2Hash } = require('./utils');

const MAJOR_VERSION = "2.3.x";

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
