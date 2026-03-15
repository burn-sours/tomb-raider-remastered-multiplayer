/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x418038",
            Type: "Int8"
        },
        Level: {
            Address: "0x3885B8",
            Type: "Int32"
        },
        GameVersion: {
            Address: "0xe9428",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x3885c0",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x3885EC",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x3885f0",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x388ac4",
            Type: "UInt8"
        },
        MoreSettings: {
            Address: "0x388ac6",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41802c",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x418040",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x388a84",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x388a98",
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
            Address: "0x8260",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};