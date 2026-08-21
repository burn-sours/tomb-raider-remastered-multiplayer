/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41a048",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xeb438",
            Type: "Int32"
        },
        Level: {
            Address: "0x38a5b0",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38a5b8",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38a5e4",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38a5e8",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38aac4",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38ad04",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41a03c",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41a05c",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38aa84",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38aa98",
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
            Address: "0x7f00",
            Params: ["pointer"],
            Return: "void",
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x7ff0",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};