/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41af78",
            Type: "Int8"
        },
        GameVersion: {
            Address: "0xec438",
            Type: "Int32"
        },
        Level: {
            Address: "0x38b4e0",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38b4e8",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38b514",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38b518",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38b9f4",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38bc34",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41af6c",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41af8c",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38b9b4",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38b9c8",
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