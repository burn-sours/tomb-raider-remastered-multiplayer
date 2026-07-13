const fs = require("fs");
const path = require("path");
const { app } = require("electron");

module.exports = {
    /**
     * Filepath to the users data options file
     */
    filepath: path.join(app.getPath('userData'), 'options.json'),

    /**
     * Read options from the user data
     * @param defaultOptions
     * @returns {{}|any}
     */
    readOptions(defaultOptions = {}) {
        try {
            const data = fs.readFileSync(module.exports.filepath, 'utf8');
            return { ...defaultOptions, ...JSON.parse(data) };
        } catch (err) {
            return defaultOptions;
        }
    },

    /**
     * Write options to the user data
     * @param data
     */
    writeOptions(data) {
        try {
            const tmp = module.exports.filepath + '.' + process.pid + '.tmp';
            fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
            fs.renameSync(tmp, module.exports.filepath);
        } catch (err) {
            console.error('Error saving settings:', err);
        }
    }
};