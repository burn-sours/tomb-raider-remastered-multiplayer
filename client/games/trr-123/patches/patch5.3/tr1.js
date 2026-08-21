/** tomb1.dll */
module.exports = {
    /** tomb1.dll draw/graphics */
    uiLayer: 0x46,

    /* tomb1.dll max outfits */
    challengeOutfits: true,
    challengeOutfitsScrewed: true,

    /** tomb1.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x125298",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x125284",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x104ab8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x4f2820",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x41ecd4",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x2c9b38",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x4f2e4a",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x33cb40",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x33ccf0",
            Type: "Int64"
        },
        PlayerOxygen: {
            Address: "0x33cb56",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x33ccf0",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x33ccf0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraGunFlags: {
            Address: "0x33cb80",
            Type: "UInt32",
        },
        LaraGunType: {
            Address: "0x33cb42",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x33cc30",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x33cc38",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x33cc3a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x33cc5c",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x33cc74",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x33cb4c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x375760",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1258dc",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x2c9b2c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x2c9b30",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x2c9bb8",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x2c9b64",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x2c9b68",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x2c9ae0",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x2c9ae4",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x2c9ae8",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x2c9b8c",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x2c9b9c",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x2c9bac",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x2c9b0e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x2c9b0c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x2c9b80",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x2c9b84",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x2c9b88",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x2c9b90",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x2c9b94",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x2c9b98",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x2c9ba0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x2c9ba4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x2c9ba8",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x2c9bb0",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x104e50",
            Type: "Int32"
        },
        Entities: {
            Address: "0x41efd8",
            Type: "Pointer"
        },
        EntitiesCount: {
            Address: "0x3ee928",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x41efc8",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x41ee90",
            Type: "Int16"
        },
        OgModelsOffset: "0x41ecc8",
        OgModelsWeaponOffset2: "0x420202",
        OgModelsWeaponOffset: "0x41f002",
        OgModelsAngwyOffset: "0x421402",
        OgModelsFace: "0x33cc18",
        OgModelsLeftHand: "0x33cc10",
        OgModelsRightHand: "0x33cbf8",
        OgModelsLeftPocket: "0x33cbb0",
        OgModelsRightPocket: "0x33cbc8",
        OgModelsBackPocket: "0x33cbe0"
    },

    ogGunMap: {
        guns: { "11": 2, "13": 4, "14": 6, "12": 8 },
        pockets: { "1": 2, "4": 6, "2": 8 },
        backPocket: null,
        flare: null,
        twoHanded: [],
        stride: "0x480"
    },

    /** tomb1.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0xfd00",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x16f10",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        EndLevelSeq: {
            Address: "0x174f0",
            Params: ['int'],
            Return: 'void'
        },
        LoadLevelAssets: {
            Address: "0x40c90",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x879d0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x1b010",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x1d420",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xbd110",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x8a9a0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x5cec0",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x5dd40",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x70190",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x20940",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0x740f0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x595b0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x591f0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x58e30",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x28750",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x487d0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x56020",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x3c0f0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x3ca60",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x52c80",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0x73e20",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x75630",
            Params: [],
            Return: 'void'
        }
    },

    /** tomb1.dll sounds */
    sounds: {
        "static_sounds": [
            "0x2", //-- No
            "0x7", //-- holster
            "0x74", //-- heal
        ],
        "lara_sounds": [
            "0x0", //-- footstep
            "0x1", //-- grunt
            "0x3", //-- slide
            "0x4", //-- land
            "0x5", //-- climb
            "0x6", //-- draw guns
            "0x4008", //-- pistols new
            "0x402c", //-- magnums new
            "0x402d", //-- shotgun new
            "0x402b", //-- uzis new
            "0x9", //-- reload
            "0xa", //-- gun
            "0x1a", //-- climb
            "0x1b", //-- bonk
            "0x1c", //-- shimmy
            "0x1d", //-- jump
            "0x1e", //-- scream
            "0x1f", //-- arghhh
            "0x20", //-- roll
            "0x21", //-- dive
            "0x22", //-- swim
            "0x23", //-- swim
            "0x24", //-- swim
            "0x25", //-- glug glug
            "0x26", //-- lever down
            "0x27", //-- key hole
            "0x2a", //-- land death
            "0x2e", //-- eugheuhgueghe
            "0x2f", //-- eugheuhgueghe
            "0x33", //-- eugheuhgueghe
            "0x34", //-- swim float
            "0x35", //-- crunch dead
            "0x37", //-- grab ledge
            "0x38", //-- grab ledge
            "0x39", //-- lever up
            "0x3d", //-- lever water
            "0x3f", //-- eguheghghh
            "0x42", //-- crumble
            "0x91", //-- spike death
            "0x92", //-- boulder death
            "0x11", //-- splash
            "0x18", //--  crawling
            "0x36", //-- fall grab
        ]
    }
};