module.exports = {
    "variables": {
        "MainPlayerEntity": {
            "Address": "0xcb3240",
            "Type": "UInt64"
        },
        "PlayerSceneObject": {
            "Address": "0xcb3238",
            "Type": "UInt64"
        },
        "CameraTargetPtr": {
            "Address": "0xcb3220",
            "Type": "UInt64"
        },
        "ActiveCharacterTexHash": {
            "Address": "0x299118",
            "Type": "UInt32"
        },
        "PlayerHealth": {
            "Address": "0x2a5584",
            "Type": "Float"
        },
        "PlayerOxygen": {
            "Address": "0x2a5588",
            "Type": "Float"
        },
        "VisibleEntityList": {
            "Address": "0xcb3120",
            "Type": "Pointer"
        },
        "VisibleEntityCount": {
            "Address": "0x387b80",
            "Type": "UInt32"
        },
        "Level": {
            "Address": "0x561c5bc",
            "Type": "Int8"
        },
        "PreviousLevel": {
            "Address": "0x561c758",
            "Type": "UInt32"
        },
        "PendingStateTransition": {
            "Address": "0x2e2c39",
            "Type": "Int8"
        },
        "TextColorARGB": {
            "Address": "0x4258e4",
            "Type": "UInt32"
        },
        "TextScaleY": {
            "Address": "0x4258e8",
            "Type": "Float"
        },
        "UIFontStyleIndex": {
            "Address": "0xc81950",
            "Type": "Int32"
        },
        "UIPanelLayerHandle": {
            "Address": "0x3a6638",
            "Type": "Pointer"
        },
        "DrawBeginX": {
            "Address": "0x420e28",
            "Type": "Int32"
        },
        "DrawEndX": {
            "Address": "0x420e30",
            "Type": "Int32"
        },
        "ActiveOutfitId": {
            "Address": "0x2fc890",
            "Type": "Int32"
        },
        "OutfitDefinitionTable": {
            "Address": "0x28f0f8",
            "Type": "Pointer"
        },
        "PhotoModeAppliedOutfitId": {
            "Address": "0x28ef78",
            "Type": "Int32"
        },
        "GameState": {
            "Address": "0x2fcf64",
            "Type": "Int32"
        },
        "CharacterControllerArray": {
            "Address": "0x3aaa60",
            "Type": "Pointer"
        },
        "CharacterControllerCount": {
            "Address": "0x39841c",
            "Type": "UInt32"
        },
        "SceneManager": {
            "Address": "0x4cc6198",
            "Type": "Pointer"
        },
        "MainViewMatrix": {
            "Address": "0x3ad640",
            "Type": "UInt64"
        },
        "MainProjMatrix": {
            "Address": "0x3ad600",
            "Type": "UInt64"
        },
        "ActiveWeaponId": {
            "Address": "0x561c928",
            "Type": "Int32"
        },
        "PlayerIsKurtis": {
            "Address": "0x5598400",
            "Type": "Int32"
        },
        "PlayerIsLara": {
            "Address": "0x561c909",
            "Type": "UInt8"
        },
        "CharacterInitCount": {
            "Address": "0x561c907",
            "Type": "UInt8"
        },
        "ActiveInteractiveScene": {
            "Address": "0x5598408",
            "Type": "Pointer"
        },
        "CutsceneEntityA": {
            "Address": "0x3adb30",
            "Type": "UInt64"
        },
        "CutsceneEntityB": {
            "Address": "0x3adb38",
            "Type": "UInt64"
        },
        "CutsceneAnimDB_A": {
            "Address": "0x3adb18",
            "Type": "UInt64"
        },
        "CutsceneAnimDB_B": {
            "Address": "0x3adb00",
            "Type": "UInt64"
        },
        "CutsceneAnimHash_A": {
            "Address": "0x3adb14",
            "Type": "UInt32"
        },
        "CutsceneAnimHash_B": {
            "Address": "0x3adb10",
            "Type": "UInt32"
        }
    },
    "hooks": {
        "PrepareEntityForRender": {
            "Address": "0xe2950",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "CullAndQueueSceneObject": {
            "Address": "0x13fc10",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "DrawVisibleEntity": {
            "Address": "0x1b5780",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": true
        },
        "SetupEntityRenderData": {
            "Address": "0xdbb00",
            "Params": [
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "FinalizeEntitySetup": {
            "Address": "0xe15b0",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "Clone": {
            "Address": "0x1ed140",
            "Params": [
                "pointer",
                "pointer",
                "int32"
            ],
            "Return": "void",
            "Disable": false
        },
        "LoadedLevel": {
            "Address": "0xb9850",
            "Params": [
                "pointer",
                "pointer",
                "int32"
            ],
            "Return": "void",
            "Disable": false
        },
        "LoadCharacterEntity": {
            "Address": "0x13e6d0",
            "Params": [
                "pointer"
            ],
            "Return": "uint64",
            "Disable": false
        },
        "InitEntitySpawn": {
            "Address": "0x142f10",
            "Params": [
                "pointer",
                "pointer",
                "pointer",
                "uint64"
            ],
            "Return": "uint64",
            "Disable": false
        },
        "ProcessGameState": {
            "Address": "0xbbdc0",
            "Params": [
                "pointer",
                "pointer",
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "Alloc": {
            "Address": "0x1d9b40",
            "Params": [
                "uint64"
            ],
            "Return": "pointer",
            "Disable": false
        },
        "PlayEntitySound": {
            "Address": "0x1c0f20",
            "Params": [
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "PlaySoundByHash": {
            "Address": "0x17ad10",
            "Params": [
                "pointer",
                "uint32"
            ],
            "Return": "uint64",
            "Disable": false
        },
        "RenderHUD": {
            "Address": "0x1bef40",
            "Params": [
                "pointer",
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "BeginUILayer": {
            "Address": "0x18afe0",
            "Params": [
                "int",
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "FlushUILayer": {
            "Address": "0x18bab0",
            "Params": [],
            "Return": "void",
            "Disable": false
        },
        "DrawFilledRect": {
            "Address": "0x18b620",
            "Params": [
                "int",
                "int",
                "int",
                "int",
                "uint32"
            ],
            "Return": "void",
            "Disable": false
        },
        "DrawTextAt": {
            "Address": "0x190f00",
            "Params": [
                "int",
                "int",
                "pointer",
                "int"
            ],
            "Return": "int",
            "Disable": false
        },
        "MeasureTextWidth": {
            "Address": "0x190d50",
            "Params": [
                "pointer",
                "uchar",
                "pointer"
            ],
            "Return": "int",
            "Disable": false
        },
        "SpawnVfxByType": {
            "Address": "0xf5220",
            "Params": [
                "pointer",
                "pointer",
                "uint64"
            ],
            "Return": "void",
            "Disable": false
        }
    },
    "sounds": {
        "entity_sounds": [
            "0x6e91",
            "0x6eb6",
            "0x582b",
            "0x6ea0",
            "0x6e7c",
            "0x6e7b",
            "0x13764",
            "0x587a",
            "0x139d4",
            "0x6ed6",
            "0x776c",
            "0x6ebb",
            "0x6e7e",
            "0x5878",
            "0x5879",
            "0x776f",
            "0x7768",
            "0x778e",
            "0x7739",
            "0x773a",
            "0x6ecb",
            "0x166b6",
            "0x79ba",
            "0x794b",
            "0x796b",
            "0x79d9",
            "0x7a6c",
            "0x79d6",
            "0x7a02",
            "0x79fc",
            "0x79f9",
            "0x7a12",
            "0x166e4",
            "0x7a6a",
            "0x7a0d",
            "0x7a4d",
            "0x7a03",
            "0x7a4a",
            "0x798b"
        ],
        "byhash_sounds": [
            "0x13b3c",
            "0x1662c",
            "0x1668d",
            "0x16618",
            "0x1663e",
            "0x8000099",
            "0x16637",
            "0x1ee89",
            "0x79cf",
            "0x3000099"
        ]
    }
};
