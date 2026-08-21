/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41e1d8",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xef438",
            Type: "Int32"
        },
        Level: {
            Address: "0x38e740",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38e748",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38e774",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38e778",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38ec54",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38ee94",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41e1cc",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41e1ec",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38ec14",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38ec28",
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