/** tomb456.exe */
module.exports = {
    /** tomb456.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x68c548",
            Type: "Int8"
        },
        KeyToControl: {
            Address: "0x577e58",
            Type: "Int64"
        },
        KeyIsPressed: {
            Address: "0x577b40",
            Type: "Int8"
        },
        Level: {
            Address: "0x5777A4",
            Type: "Int32"
        },
        GameVersion: {
            Address: "0x16D3A8",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x5777A8",
            Type: "Block",
            Size: "0x17",
        },
        LaraAppearanceModernOutfit: {
            Address: "0x5777A8",
            Type: "UInt64",
        },
        LaraAppearanceModernSunglasses: {
            Address: "0x5777B4",
            Type: "Int8",
        },
        IsPhotoMode: {
            Address: "0x5777CC",
            Type: "Int32"
        },
        IsGameMenu: {
            Address: "0x577B08",
            Type: "Int32",
        },
        GameSettings: {
            Address: "0x577C94",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x68c53c",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x577C58",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x577C68",
            Type: "Int32"
        },
        MoreSettings: {
            Address: "0x577C97",
            Type: "Int8"
        },
    },

    /** tomb456.exe hooks */
    hooks: {
        KeyboardInput: {
            Address: "0x1900",
            Params: ['int'],
            Return: 'int',
            Disable: false
        },
        TickFunction: {
            Address: "0x9e80",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x9fc0",
            Params: [],
            Return: 'void',
            Disable: false
        },
    }
};
