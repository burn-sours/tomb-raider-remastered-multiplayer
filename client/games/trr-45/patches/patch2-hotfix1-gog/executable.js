module.exports = {
    "variables": {
        "ExitingGame": {
            "Address": "0x69866c",
            "Type": "Int8"
        },
        "KeyToControl": {
            "Address": "0x583f80",
            "Type": "Int64"
        },
        "KeyIsPressed": {
            "Address": "0x583c70",
            "Type": "Int8"
        },
        "Level": {
            "Address": "0x5838d0",
            "Type": "Int32"
        },
        "GameVersion": {
            "Address": "0x17938c",
            "Type": "Int32"
        },
        "LaraAppearanceModern": {
            "Address": "0x5838d8",
            "Type": "Block",
            "Size": "0x17"
        },
        "IsPhotoMode": {
            "Address": "0x5838fc",
            "Type": "Int32"
        },
        "IsGameMenu": {
            "Address": "0x583c38",
            "Type": "Int32"
        },
        "GameSettings": {
            "Address": "0x583dc4",
            "Type": "UInt8"
        },
        "ResolutionH": {
            "Address": "0x698660",
            "Type": "Int32"
        },
        "DevMode": {
            "Address": "0x583d88",
            "Type": "Int8"
        },
        "DevModeSpeed": {
            "Address": "0x583d98",
            "Type": "Int32"
        }
    },
    "hooks": {
        "KeyboardInput": {
            "Address": "0x1930",
            "Params": [
                "int"
            ],
            "Return": "int",
            "Disable": false
        },
        "TickFunction": {
            "Address": "0x9f70",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "UpdateTickRef": {
            "Address": "0xa0b0",
            "Params": [],
            "Return": "void",
            "Disable": false
        }
    }
};
