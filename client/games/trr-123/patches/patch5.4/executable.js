/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41f1d8",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xf0438",
            Type: "Int32"
        },
        Level: {
            Address: "0x38f740",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38f748",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38f774",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38f778",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38fc54",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38fe94",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41f1cc",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41f1ec",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38fc14",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38fc28",
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