module.exports = {
    "variables": {
        "ExitingGame": {
            "Address": "0x69a80c",
            "Type": "Int8"
        },
        "KeyToControl": {
            "Address": "0x586120",
            "Type": "Int64"
        },
        "KeyIsPressed": {
            "Address": "0x585e10",
            "Type": "Int8"
        },
        "Level": {
            "Address": "0x585a70",
            "Type": "Int32"
        },
        "GameVersion": {
            "Address": "0x17b3ac",
            "Type": "Int32"
        },
        "LaraAppearanceModern": {
            "Address": "0x585a78",
            "Type": "Block",
            "Size": "0x17"
        },
        "IsPhotoMode": {
            "Address": "0x585a9c",
            "Type": "Int32"
        },
        "IsGameMenu": {
            "Address": "0x585dd8",
            "Type": "Int32"
        },
        "GameSettings": {
            "Address": "0x585f64",
            "Type": "UInt8"
        },
        "ResolutionH": {
            "Address": "0x69a800",
            "Type": "Int32"
        },
        "DevMode": {
            "Address": "0x585f28",
            "Type": "Int8"
        },
        "DevModeSpeed": {
            "Address": "0x585f38",
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
            "Address": "0xa1d0",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "UpdateTickRef": {
            "Address": "0xa310",
            "Params": [],
            "Return": "void",
            "Disable": false
        }
    }
};
