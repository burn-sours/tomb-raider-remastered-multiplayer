/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41b048",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xec428",
            Type: "Int32"
        },
        Level: {
            Address: "0x38b5b0",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38b5b8",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38b5e4",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38b5e8",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38bac4",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38bd04",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41b03c",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41b05c",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38ba84",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38ba98",
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
            Address: "0x7f20",
            Params: ["pointer"],
            Return: "void",
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x8010",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};