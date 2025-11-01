module.exports = {
    "id": "trr-123",
    "type": "game",
    "name": "Tomb Raider Remastered I-III",
    "executable": "tomb123.exe",
    "modules": {
        "tomb1.dll": {
            "id": "tr1",
            "name": "Tomb Raider I"
        },
        "tomb2.dll": {
            "id": "tr2",
            "name": "Tomb Raider II"
        },
        "tomb3.dll": {
            "id": "tr3",
            "name": "Tomb Raider III"
        }
    },
    "patches": {
        "patch4":  {
            "name": "Patch 4 (Supports 'Gold Edition' 1.3)",
            "patch": "c3d2a0188ad359a243c270c759dff142a131f302fa634fca404482875970673d",
            "memory": {
                "executable": require("./patches/patch4/executable"),
                "tomb1.dll": require("./patches/patch4/tr1"),
                "tomb2.dll": require("./patches/patch4/tr2"),
                "tomb3.dll": require("./patches/patch4/tr3"),
            }
        },
        "patch4.1": {
            "name": "Patch 4.1 (Latest, Golden Pistols)",
            "patch": "d732834ad9f092968167e1a4c71f8c6bdb59809cee617b213f4f31e788504858",
            "memory": {
                "executable": require("./patches/patch4.1/executable"),
                "tomb1.dll": require("./patches/patch4.1/tr1"),
                "tomb2.dll": require("./patches/patch4.1/tr2"),
                "tomb3.dll": require("./patches/patch4.1/tr3"),
            }
        }
    },
    "defaultPatch": "patch4.1"
};