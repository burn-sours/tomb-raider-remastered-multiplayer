/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41c1c8",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xed438",
            Type: "Int32"
        },
        Level: {
            Address: "0x38c730",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38c738",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38c764",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38c768",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38cc44",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38ce84",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41c1bc",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41c1dc",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38cc04",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38cc18",
            Type: "Int32"
        }
    },

    /** tomb123.exe hooks */
    hooks: {
        KeyboardInput: {
            Address: "0x1e70",
            Params: ["uint", "int"],
            Return: "void",
            Disable: true
        },
        TickFunction: {
            Address: "0x8170",
            Params: ["pointer"],
            Return: "void",
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x8260",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};