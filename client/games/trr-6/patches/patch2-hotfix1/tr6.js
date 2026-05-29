module.exports = {
    variables: {
        MainPlayerEntity: { Address: "0xCB3240", Type: "UInt64" },
        PlayerSceneObject: { Address: "0xCB3238", Type: "UInt64" },
        CameraTargetPtr: { Address: "0xCB3220", Type: "UInt64" },
        ActiveCharacterTexHash: { Address: "0x299118", Type: "UInt32" },
        PlayerHealth: { Address: "0x2A5584", Type: "Float" },
        PlayerOxygen: { Address: "0x2A5588", Type: "Float" },
        VisibleEntityList: { Address: "0xCB3120", Type: "Pointer" },
        VisibleEntityCount: { Address: "0x387B80", Type: "UInt32" },
        Level: { Address: "0x561c5bc", Type: "Int8" },
        PreviousLevel: { Address: "0x561c758", Type: "UInt32" },
        PendingStateTransition: { Address: "0x2E2C39", Type: "Int8" },
        TextColorARGB: { Address: "0x4258E4", Type: "UInt32" },
        TextScaleY: { Address: "0x4258E8", Type: "Float" },
        UIFontStyleIndex: { Address: "0xC81950", Type: "Int32" },
        UIPanelLayerHandle: { Address: "0x3A6638", Type: "Pointer" },
        DrawBeginX: { Address: "0x420E28", Type: "Int32" },
        DrawEndX: { Address: "0x420E30", Type: "Int32" },
        ActiveOutfitId: { Address: "0x2FC890", Type: "Int32" },
        OutfitDefinitionTable: { Address: "0x28F0F8", Type: "Pointer" },
        PhotoModeAppliedOutfitId: { Address: "0x28EF78", Type: "Int32" },
        GameState: { Address: "0x2FCF64", Type: "Int32" },
        CharacterControllerArray: { Address: "0x3AAA60", Type: "Pointer" },
        CharacterControllerCount: { Address: "0x39841C", Type: "UInt32" },
        SceneManager: { Address: "0x4CC6198", Type: "Pointer" },
        MainViewMatrix: { Address: "0x3ad640", Type: "UInt64" },
        MainProjMatrix: { Address: "0x3ad600", Type: "UInt64" },
        ActiveWeaponId: { Address: "0x561c928", Type: "Int32" },
        PlayerIsKurtis: { Address: "0x5598400", Type: "Int32" },
        PlayerIsLara: { Address: "0x561c909", Type: "UInt8" },
        CharacterInitCount: { Address: "0x561c907", Type: "UInt8" },
        ActiveInteractiveScene: { Address: "0x5598408", Type: "Pointer" },
        CutsceneEntityA: { Address: "0x3ADB30", Type: "UInt64" },
        CutsceneEntityB: { Address: "0x3ADB38", Type: "UInt64" },
        CutsceneAnimDB_A: { Address: "0x3ADB18", Type: "UInt64" },
        CutsceneAnimDB_B: { Address: "0x3ADB00", Type: "UInt64" },
        CutsceneAnimHash_A: { Address: "0x3ADB14", Type: "UInt32" },
        CutsceneAnimHash_B: { Address: "0x3ADB10", Type: "UInt32" },
    },
    hooks: {
        PrepareEntityForRender: { Address: "0xE2950", Params: ['pointer'], Return: 'void', Disable: false },
        CullAndQueueSceneObject: { Address: "0x13FC10", Params: ['pointer'], Return: 'void', Disable: false },
        DrawVisibleEntity: { Address: "0x1B5780", Params: ['pointer'], Return: 'void', Disable: true },
        SetupEntityRenderData: { Address: "0xDBB00", Params: ['pointer', 'pointer'], Return: 'void', Disable: false },
        FinalizeEntitySetup: { Address: "0xE15B0", Params: ['pointer'], Return: 'void', Disable: false },
        Clone: { Address: "0x1ed140", Params: ['pointer', 'pointer', 'int32'], Return: 'void', Disable: false },
        LoadedLevel: { Address: "0xb9850", Params: ['pointer', 'pointer', 'int32'], Return: 'void', Disable: false },
        LoadCharacterEntity: { Address: "0x13e6d0", Params: ['pointer'], Return: 'uint64', Disable: false },
        InitEntitySpawn: { Address: "0x142f10", Params: ['pointer', 'pointer', 'pointer', 'uint64'], Return: 'uint64', Disable: false },
        ProcessGameState: { Address: "0xbbdc0", Params: ['pointer', 'pointer', 'pointer', 'pointer'], Return: 'void', Disable: false },
        Alloc: { Address: "0x1D9B40", Params: ['uint64'], Return: 'pointer', Disable: false },
        PlayEntitySound: { Address: "0x1C0F20", Params: ['pointer', 'pointer'], Return: 'void', Disable: false },
        PlaySoundByHash: { Address: "0x17AD10", Params: ['pointer', 'uint32'], Return: 'uint64', Disable: false },
        RenderHUD: { Address: "0x1BEF40", Params: ['pointer', 'pointer', 'pointer'], Return: 'void', Disable: false },
        BeginUILayer: { Address: "0x18AFE0", Params: ['int', 'pointer', 'pointer'], Return: 'void', Disable: false },
        FlushUILayer: { Address: "0x18BAB0", Params: [], Return: 'void', Disable: false },
        DrawFilledRect: { Address: "0x18B620", Params: ['int', 'int', 'int', 'int', 'uint32'], Return: 'void', Disable: false },
        DrawTextAt: { Address: "0x190F00", Params: ['int', 'int', 'pointer', 'int'], Return: 'int', Disable: false },
        MeasureTextWidth: { Address: "0x190d50", Params: ['pointer', 'uchar', 'pointer'], Return: 'int', Disable: false },
        SpawnVfxByType: { Address: "0xf5220", Params: ['pointer', 'pointer', 'uint64'], Return: 'void', Disable: false },
    },

    sounds: {
        entity_sounds: [
            "0x6e91",  // footstep A
            "0x6eb6",  // footstep B
            "0x582b",  // footstep C
            "0x6ea0",  // jump/land/grunt
            "0x6e7c",  // jump/land/grunt
            "0x6e7b",  // jump/land/grunt
            "0x13764", // jump/land/grunt
            "0x587a",  // roll
            "0x139d4", // jump/land/grunt
            "0x6ed6",  // climbing
            "0x776c",  // climbing
            "0x6ebb",  // climbing
            "0x6e7e",  // climbing
            "0x5878",  // draw gun
            "0x5879",  // draw gun
            "0x776f",  // climbing ladder
            "0x7768",  // climbing ladder
            "0x778e",  // climbing ladder
            "0x7739",  // push/pull object
            "0x773a",  // push/pull object
            "0x6ecb",  // push/pull object
            "0x166b6", // gunfire stop / weapon release
            "0x79ba",  // Kurtis turning
            "0x794b",  // Kurtis walking
            "0x796b",  // Kurtis walking
            "0x79d9",  // Kurtis sneaking
            "0x7a6c",  // Kurtis jumping
            "0x79d6",  // Kurtis jumping
            "0x7a02",  // Kurtis equip Chirugai blade
            "0x79fc",  // Kurtis holster/unholster gun
            "0x79f9",  // Kurtis holster/unholster gun
            "0x7a12",  // Kurtis climbing/grunt
            "0x166e4", // Kurtis climbing/grunt
            "0x7a6a",  // Kurtis climbing/grunt
            "0x7a0d",  // Kurtis climbing/grunt
            "0x7a4d",  // Kurtis rolling
            "0x7a03",  // Kurtis rolling
            "0x7a4a",  // Kurtis landing/falling/dying (impact-style hit)
            "0x798b"   // Kurtis falling/grunting
        ],
        byhash_sounds: [
            "0x13b3c", // gunfire (rig 09)
            "0x1662c", // gunfire (rig 09)
            "0x1668d", // gunfire (Viper SMG)
            "0x16618", // gunfire (Vector R35)
            "0x1663e",  // gunfire (Scorpion X)
            "0x8000099", // gunfire (silenced — shared across silenced weapons)
            "0x16637",   // gunfire (Mag Vega, unsilenced)
            "0x1ee89",   // gunfire (Boran X)
            "0x79cf",    // gunfire (Boran X)
            "0x3000099"  // Chirugai blade
        ]
    }
};
