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
        "patch5.1": {
            "name": "31 March 2026 - Challenge Mode Update 2",
            "patch": "c5b02aefd4b684a0282d721c380440017f2d6843fabbaa0121136690044c2610",
            "memory": {
                "executable": require("./patches/patch5.1/executable"),
                "tomb1.dll": require("./patches/patch5.1/tr1"),
                "tomb2.dll": require("./patches/patch5.1/tr2"),
                "tomb3.dll": require("./patches/patch5.1/tr3"),
            }
        },
        "patch5": {
            "name": "12 March 2026 - Challenge Mode Update",
            "patch": "5c309576b480ac7457c9cec83f35267532747dfaafbc7dc65ba22680d8bfafd9",
            "memory": {
                "executable": require("./patches/patch5/executable"),
                "tomb1.dll": require("./patches/patch5/tr1"),
                "tomb2.dll": require("./patches/patch5/tr2"),
                "tomb3.dll": require("./patches/patch5/tr3"),
            }
        },
        "patch4.1": {
            "name": "15 August 2025 - Update 2",
            "patch": "d732834ad9f092968167e1a4c71f8c6bdb59809cee617b213f4f31e788504858",
            "memory": {
                "executable": require("./patches/patch4.1/executable"),
                "tomb1.dll": require("./patches/patch4.1/tr1"),
                "tomb2.dll": require("./patches/patch4.1/tr2"),
                "tomb3.dll": require("./patches/patch4.1/tr3"),
            }
        },
        "patch4":  {
            "name": "4 November 2024 - No title",
            "patch": "c3d2a0188ad359a243c270c759dff142a131f302fa634fca404482875970673d",
            "memory": {
                "executable": require("./patches/patch4/executable"),
                "tomb1.dll": require("./patches/patch4/tr1"),
                "tomb2.dll": require("./patches/patch4/tr2"),
                "tomb3.dll": require("./patches/patch4/tr3"),
            }
        }
    }
};