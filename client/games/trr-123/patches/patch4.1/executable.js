/** tomb123.exe */
module.exports = {
    /** tomb123.exe variables */
    variables: {
        ExitingGame: {
            Address: "0x2f35ec",
            Type: "Int8"
        },
        Level: {
            Address: "0x263CD0",
            Type: "Int32"
        },
        GameVersion: {
            Address: "0xe4bd8",
            Type: "Int32"
        },
        LaraAppearanceModern: {
            Address: "0x263CD8",
            Type: "Block",
            Size: "0xd",
        },
        LaraAppearanceModernOutfit: {
            Address: "0x263CD8",
            Type: "Int32",
        },
        LaraAppearanceModernSunglasses: {
            Address: "0x263CE4",
            Type: "Int8",
        },
        IsPhotoMode: {
            Address: "0x263D04",
            Type: "Int32"
        },
        IsPhotoModeUI: {
            Address: "0x263D08",
            Type: "Int32"
        },
        GameSettings: {
            Address: "0x2641C4",
            Type: "UInt8"
        },
        ResolutionH: {
            Address: "0x2f35e0",
            Type: "Int32"
        },
        ResolutionH2: {
            Address: "0x2f35f8",
            Type: "Int32"
        },
        DevMode: {
            Address: "0x264190",
            Type: "Int8"
        },
        DevModeSpeed: {
            Address: "0x2641a0",
            Type: "Int32"
        },
        MoreSettings: {
            Address: "0x2641C6",
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
            Address: "0x7dc0",
            Params: ["pointer"],
            Return: "void",
            Disable: false
        },
        UpdateTickRef: {
            Address: "0x7ea0",
            Params: [],
            Return: "void",
            Disable: false
        },
    }
};