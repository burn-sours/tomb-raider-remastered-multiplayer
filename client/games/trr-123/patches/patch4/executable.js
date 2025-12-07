/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x2ef374",
            Type: "Int8"
        },
        Level: {
            Address: "0x25FA74",
            Type: "Int32"
        },
        GameVersion: {
            Address: "0xe0b68",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x25FA7C",
            Type: "Block",
            Size: "0xd",
        },
        LaraAppearanceModernOutfit: {
            Address: "0x25FA7C",
            Type: "Int32",
        },
        LaraAppearanceModernSunglasses: {
            Address: "0x25FA88",
            Type: "Int8",
        },
        IsPhotoMode: {
            Address: "0x25FAA8",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x25FAAC",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x25FF68",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x2ef368",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x2ef380",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x25ff34",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x25ff44",
            Type: "Int32"
        },
        MoreSettings: {
            Address: "0x25FF68",
            Type: "Int8"
        },
    },

    /** tomb123.exe hooks */
    hooks: {
        KeyboardInput: {
            Address: "0x1910",
            Params: ["uint", "int"],
            Return: "void",
            Disable: true
        },
        TickFunction: {
            Address: "0x7d30",
            Params: ["pointer"],
            Return: "void",
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x7e10",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};
