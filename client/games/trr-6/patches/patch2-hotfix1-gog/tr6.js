module.exports = {
    "variables": {
        "MainPlayerEntity": {
            "Address": "0xcb42e0",
            "Type": "UInt64"
        },
        "PlayerSceneObject": {
            "Address": "0xcb42d8",
            "Type": "UInt64"
        },
        "CameraTargetPtr": {
            "Address": "0xcb42c0",
            "Type": "UInt64"
        },
        "ActiveCharacterTexHash": {
            "Address": "0x29a108",
            "Type": "UInt32"
        },
        "PlayerHealth": {
            "Address": "0x2a6624",
            "Type": "Float"
        },
        "PlayerOxygen": {
            "Address": "0x2a6628",
            "Type": "Float"
        },
        "VisibleEntityList": {
            "Address": "0xcb41c0",
            "Type": "Pointer"
        },
        "VisibleEntityCount": {
            "Address": "0x388c20",
            "Type": "UInt32"
        },
        "Level": {
            "Address": "0x561d65c",
            "Type": "Int8"
        },
        "PreviousLevel": {
            "Address": "0x561d7f8",
            "Type": "UInt32"
        },
        "PendingStateTransition": {
            "Address": "0x2e3cd9",
            "Type": "Int8"
        },
        "TextColorARGB": {
            "Address": "0x426984",
            "Type": "UInt32"
        },
        "TextScaleY": {
            "Address": "0x426988",
            "Type": "Float"
        },
        "UIFontStyleIndex": {
            "Address": "0xc829f0",
            "Type": "Int32"
        },
        "UIPanelLayerHandle": {
            "Address": "0x3a76d8",
            "Type": "Pointer"
        },
        "DrawBeginX": {
            "Address": "0x421ec8",
            "Type": "Int32"
        },
        "DrawEndX": {
            "Address": "0x421ed0",
            "Type": "Int32"
        },
        "ActiveOutfitId": {
            "Address": "0x2fd930",
            "Type": "Int32"
        },
        "OutfitDefinitionTable": {
            "Address": "0x2900e8",
            "Type": "Pointer"
        },
        "PhotoModeAppliedOutfitId": {
            "Address": "0x28ff68",
            "Type": "Int32"
        },
        "GameState": {
            "Address": "0x2fe004",
            "Type": "Int32"
        },
        "CharacterControllerArray": {
            "Address": "0x3abb00",
            "Type": "Pointer"
        },
        "CharacterControllerCount": {
            "Address": "0x3994bc",
            "Type": "UInt32"
        },
        "SceneManager": {
            "Address": "0x4cc7238",
            "Type": "Pointer"
        },
        "MainViewMatrix": {
            "Address": "0x3ae6e0",
            "Type": "UInt64"
        },
        "MainProjMatrix": {
            "Address": "0x3ae6a0",
            "Type": "UInt64"
        },
        "ActiveWeaponId": {
            "Address": "0x561d9c8",
            "Type": "Int32"
        },
        "PlayerIsKurtis": {
            "Address": "0x55994a0",
            "Type": "Int32"
        },
        "PlayerIsLara": {
            "Address": "0x561d9a9",
            "Type": "UInt8"
        },
        "CharacterInitCount": {
            "Address": "0x561d9a7",
            "Type": "UInt8"
        },
        "ActiveInteractiveScene": {
            "Address": "0x55994a8",
            "Type": "Pointer"
        },
        "CutsceneEntityA": {
            "Address": "0x3aebd0",
            "Type": "UInt64"
        },
        "CutsceneEntityB": {
            "Address": "0x3aebd8",
            "Type": "UInt64"
        },
        "CutsceneAnimDB_A": {
            "Address": "0x3aebb8",
            "Type": "UInt64"
        },
        "CutsceneAnimDB_B": {
            "Address": "0x3aeba0",
            "Type": "UInt64"
        },
        "CutsceneAnimHash_A": {
            "Address": "0x3aebb4",
            "Type": "UInt32"
        },
        "CutsceneAnimHash_B": {
            "Address": "0x3aebb0",
            "Type": "UInt32"
        }
    },
    "hooks": {
        "PrepareEntityForRender": {
            "Address": "0xe3040",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "CullAndQueueSceneObject": {
            "Address": "0x13f6f0",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "DrawVisibleEntity": {
            "Address": "0x1b50c0",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": true
        },
        "SetupEntityRenderData": {
            "Address": "0xdc190",
            "Params": [
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "FinalizeEntitySetup": {
            "Address": "0xe1ce0",
            "Params": [
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "Clone": {
            "Address": "0x1ee020",
            "Params": [
                "pointer",
                "pointer",
                "int32"
            ],
            "Return": "void",
            "Disable": false
        },
        "LoadedLevel": {
            "Address": "0xb94b0",
            "Params": [
                "pointer",
                "pointer",
                "int32"
            ],
            "Return": "void",
            "Disable": false
        },
        "LoadCharacterEntity": {
            "Address": "0x13e140",
            "Params": [
                "pointer"
            ],
            "Return": "uint64",
            "Disable": false
        },
        "InitEntitySpawn": {
            "Address": "0x1429e0",
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
            "Address": "0xbb9f0",
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
            "Address": "0x1daa80",
            "Params": [
                "uint64"
            ],
            "Return": "pointer",
            "Disable": false
        },
        "PlayEntitySound": {
            "Address": "0x1c0c30",
            "Params": [
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "PlaySoundByHash": {
            "Address": "0x17acf0",
            "Params": [
                "pointer",
                "uint32"
            ],
            "Return": "uint64",
            "Disable": false
        },
        "RenderHUD": {
            "Address": "0x1be9e0",
            "Params": [
                "pointer",
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "BeginUILayer": {
            "Address": "0x18ac80",
            "Params": [
                "int",
                "pointer",
                "pointer"
            ],
            "Return": "void",
            "Disable": false
        },
        "FlushUILayer": {
            "Address": "0x18b750",
            "Params": [],
            "Return": "void",
            "Disable": false
        },
        "DrawFilledRect": {
            "Address": "0x18b2c0",
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
            "Address": "0x190bb0",
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
            "Address": "0x190a00",
            "Params": [
                "pointer",
                "uchar",
                "pointer"
            ],
            "Return": "int",
            "Disable": false
        },
        "SpawnVfxByType": {
            "Address": "0xf5570",
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
