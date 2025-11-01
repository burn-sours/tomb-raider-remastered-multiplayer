module.exports = {
    "id": "trr-45",
    "type": "game",
    "name": "Tomb Raider Remastered IV-V",
    "executable": "tomb456.exe",
    "modules": {
        "tomb4.dll": {
            "id": "tr4",
            "name": "Tomb Raider: TLR"
        },
        "tomb5.dll": {
            "id": "tr5",
            "name": "Tomb Raider: Chronicles"
        }
    },
    "patches": {
        "patch1": {
            "name": "Patch 1",
            "patch": "5164bc98143a92299107b2fc0d030464bac7d2ec8fa5954f16a71e0e283632dc",
            "memory": {
                "executable": require("./patches/patch1/executable"),
                "tomb4.dll": require("./patches/patch1/tr4"),
                "tomb5.dll": require("./patches/patch1/tr5")
            }
        },
        "patch2": {
            "name": "Patch 2",
            "patch": "0e45e221e3d2413e981b0eb1172fe73ef82ce1ac3d36f23a6aea9c1bfe5d11e6",
            "memory": {
                "executable": require("./patches/patch2/executable"),
                "tomb4.dll": require("./patches/patch2/tr4"),
                "tomb5.dll": require("./patches/patch2/tr5")
            }
        },
        "patch2-hotfix1": {
            "name": "Patch 2 Hotfix 1",
            "patch": "cf0f46623fd0d735ca19d691c7b84877529ab838a3065dfaa7d708c76ec359c0",
            "memory": {
                "executable": require("./patches/patch2-hotfix1/executable"),
                "tomb4.dll": require("./patches/patch2-hotfix1/tr4"),
                "tomb5.dll": require("./patches/patch2-hotfix1/tr5")
            }
        }
    },
    "defaultPatch": "patch2-hotfix1"
};