/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41d288",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xee428",
            Type: "Int32"
        },
        Level: {
            Address: "0x38d7f0",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38d7f8",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38d824",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38d828",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38dd04",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38df44",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41d27c",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41d29c",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38dcc4",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38dcd8",
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