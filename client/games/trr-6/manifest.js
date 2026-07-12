module.exports = {
    "id": "trr-6",
    "type": "game",
    "name": "Tomb Raider Remastered VI",
    "executable": "tomb456.exe",
    "modules": {
        "tomb6.dll": {
            "id": "tr6",
            "name": "Tomb Raider: The Angel of Darkness"
        },
        "kernel32.dll": {
            "id": "kernel32",
            "name": "Win32 (kernel32)"
        }
    },
    "patches": {
        "patch2-hotfix1-epic": {
            "name": "Epic v.250910_21914 - Patch 2 Hotfix 1",
            "patch": "c992deb55e9c83a203a8129042ec1a32be05a438d33bfe43d80ea1e9fdac0694",
            "memory": {
                "executable": require("./patches/patch2-hotfix1-epic/executable"),
                "tomb6.dll": require("./patches/patch2-hotfix1-epic/tr6"),
                "kernel32.dll": require("./patches/patch2-hotfix1-epic/kernel32")
            }
        },
        "patch2-hotfix1": {
            "name": "Steam 19 September 2025 - Patch 2 Hotfix 1",
            "patch": "cf0f46623fd0d735ca19d691c7b84877529ab838a3065dfaa7d708c76ec359c0",
            "memory": {
                "executable": require("./patches/patch2-hotfix1/executable"),
                "tomb6.dll": require("./patches/patch2-hotfix1/tr6"),
                "kernel32.dll": require("./patches/patch2-hotfix1/kernel32")
            }
        }
    }
};
