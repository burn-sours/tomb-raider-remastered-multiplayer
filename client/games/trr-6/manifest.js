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
        "patch2-hotfix1": {
            "name": "19 September 2025 - Patch 2 Hotfix 1",
            "patch": "cf0f46623fd0d735ca19d691c7b84877529ab838a3065dfaa7d708c76ec359c0",
            "memory": {
                "executable": require("./patches/patch2-hotfix1/executable"),
                "tomb6.dll": require("./patches/patch2-hotfix1/tr6"),
                "kernel32.dll": require("./patches/patch2-hotfix1/kernel32")
            }
        }
    }
};
