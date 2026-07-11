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
        "patch5.2-gog": {
            "name": "GOG v.1.1.2a - Challenge Mode Update 2",
            "patch": "be16281cd02d47fc03f6c46f47d638e0c84a7fe447d331572b2a7c3dc312037c",
            "memory": {
                "executable": require("./patches/patch5.2-gog/executable"),
                "tomb1.dll": require("./patches/patch5.2-gog/tr1"),
                "tomb2.dll": require("./patches/patch5.2-gog/tr2"),
                "tomb3.dll": require("./patches/patch5.2-gog/tr3"),
            }
        },
        "patch5.2-epic": {
            "name": "Epic v.480433.4 - Challenge Mode Update 2",
            "patch": "0848504dcbc0b16d4153df6b2665413f63d82370af65a57fb371d0e0bdf500b3",
            "memory": {
                "executable": require("./patches/patch5.2-epic/executable"),
                "tomb1.dll": require("./patches/patch5.2-epic/tr1"),
                "tomb2.dll": require("./patches/patch5.2-epic/tr2"),
                "tomb3.dll": require("./patches/patch5.2-epic/tr3"),
            }
        },
        "patch5.2": {
            "name": "Steam 30 April 2026 - Challenge Mode Update 2",
            "patch": "8592e79cfbde4f5ef0991cb810595a7fa7828ad9f76a1f4a260e5921e5d6c19d",
            "memory": {
                "executable": require("./patches/patch5.2/executable"),
                "tomb1.dll": require("./patches/patch5.2/tr1"),
                "tomb2.dll": require("./patches/patch5.2/tr2"),
                "tomb3.dll": require("./patches/patch5.2/tr3"),
            }
        },
        "patch5.1": {
            "name": "Steam 31 March 2026 - Challenge Mode Update 1",
            "patch": "c5b02aefd4b684a0282d721c380440017f2d6843fabbaa0121136690044c2610",
            "memory": {
                "executable": require("./patches/patch5.1/executable"),
                "tomb1.dll": require("./patches/patch5.1/tr1"),
                "tomb2.dll": require("./patches/patch5.1/tr2"),
                "tomb3.dll": require("./patches/patch5.1/tr3"),
            }
        },
        "patch5": {
            "name": "Steam 12 March 2026 - Challenge Mode Update",
            "patch": "5c309576b480ac7457c9cec83f35267532747dfaafbc7dc65ba22680d8bfafd9",
            "memory": {
                "executable": require("./patches/patch5/executable"),
                "tomb1.dll": require("./patches/patch5/tr1"),
                "tomb2.dll": require("./patches/patch5/tr2"),
                "tomb3.dll": require("./patches/patch5/tr3"),
            }
        },
        "patch4.1": {
            "name": "Steam 15 August 2025 - Update 2",
            "patch": "d732834ad9f092968167e1a4c71f8c6bdb59809cee617b213f4f31e788504858",
            "memory": {
                "executable": require("./patches/patch4.1/executable"),
                "tomb1.dll": require("./patches/patch4.1/tr1"),
                "tomb2.dll": require("./patches/patch4.1/tr2"),
                "tomb3.dll": require("./patches/patch4.1/tr3"),
            }
        },
        "patch4": {
            "name": "Steam 4 November 2024 - No title",
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