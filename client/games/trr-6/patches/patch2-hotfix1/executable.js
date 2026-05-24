module.exports = {
    variables: {
        GameVersion: { Address: "0x17b3ac", Type: "Int32" },
        ExitingGame: { Address: "0x69a80c", Type: "Int32" },
        IsPhotoMode: { Address: "0x585A9C", Type: "Int32" },
        IsPhotoModeUi: { Address: "0x585AA0", Type: "Int32" },
        GameSettings: { Address: "0x585F64", Type: "UInt8" },
        ResolutionH: { Address: "0x69a800", Type: "Int32" },
        DevMode: { Address: "0x585F28", Type: "Int32" },
        DevModeSpeed: { Address: "0x585F38", Type: "Int32" },
        KeyToControl: { Address: "0x586120", Type: "Int64" },
        KeyIsPressed: { Address: "0x585e10", Type: "Int8" },
    },
    hooks: {
        KeyboardInput: {
            Address: "0x1930",
            Params: ['int'],
            Return: 'int',
            Disable: false
        },
        TickFunction: {
            Address: "0xa1d0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        UpdateTickRef: {
            Address: "0xa310",
            Params: [],
            Return: 'void',
            Disable: false
        },
        GetScreenWidth: {
            Address: "0xa660",
            Params: [],
            Return: 'int',
            Disable: false
        },
        GetScreenHeight: {
            Address: "0xa680",
            Params: [],
            Return: 'int',
            Disable: false
        },
    }
};
