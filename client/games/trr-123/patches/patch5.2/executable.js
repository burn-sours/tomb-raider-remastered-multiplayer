/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41c278",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xed428",
            Type: "Int32"
        },
        Level: {
            Address: "0x38c7e0",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38C7E8",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38C814",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38C818",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38ccf4",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38cf34",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41C26C",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41c28c",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38ccb4",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38ccc8",
            Type: "Int32"
        }
    },

    /** tomb123.exe hooks */
    hooks: {
        KeyboardInput: {
            Address: "0x1ea0",
            Params: ["uint", "int"],
            Return: "void",
            Disable: true
        },
        TickFunction: {
            Address: "0x8180",
            Params: ["pointer"],
            Return: "void",
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x8270",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};