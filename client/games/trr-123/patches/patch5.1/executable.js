/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x41c1b8",
            Type: "Int8"
        },
        Level: {
            Address: "0x38C728",
            Type: "Int32"
        },
        GameVersion: {
            Address: "0xed438",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x38C730",
            Type: "Block",
            Size: "0xd",
        },
        IsPhotoMode: {
            Address: "0x38C75C",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x38C760",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x38cc3c",
            Type: "UInt8"
        },
        ChallengeModeSettings: {
            Address: "0x38CE7C",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x41c1ac",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x41c1c0",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x38cbfc",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x38cc10",
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
            Address: "0x8150",
            Params: ["pointer"],
            Return: "void",
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x8240",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};