/** tomb456.exe */

// Import variables from patch2 as they are unchanged
const patch2 = require("../patch2/executable");

module.exports = {
    /** tomb456.exe variables - imported from patch2 */
    variables: patch2.variables,

    /** tomb456.exe hooks */
    hooks: {
        KeyboardInput: {
            Address: "0x1930",
            Params: ['int'],
            Return: 'int',
            Disable: false
        },
        TickFunction: {
            Address: "0xa1d0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        UpdateTickRef: {
            Address: "0xa310",
            Params: [],
            Return: 'void',
            Disable: false
        },
    }
};
