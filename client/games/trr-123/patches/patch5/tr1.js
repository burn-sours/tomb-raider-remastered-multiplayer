/** tomb1.dll */
module.exports = {
    /** tomb1.dll draw/graphics */
    uiLayer: 0x39,

    /* tomb1.dll max outfits */
    challengeOutfits: true,

    /** tomb1.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x11f1b8",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x11f1a4",
            Type: "Int32"
        },
        LevelId: {
            Address: "0xfeab8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x4eb420",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x418494",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x2c3838",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x4eba4a",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x336840",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x3369f0",
            Type: "Int64"
        },
        PlayerOxygen: {
            Address: "0x336856",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x3369f0",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x3369f0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraGunFlags: {
            Address: "0x336880",
            Type: "UInt32",
        },
        LaraGunType: {
            Address: "0x336842",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x336930",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x336938",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x33693a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x33695c",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x336974",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x33684c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x36f460",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x11f7dc",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x2c382c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x2c3830",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x2c38b8",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x2c3864",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x2c3868",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x2c37e0",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x2c37e4",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x2c37e8",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x2c388c",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x2c389c",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x2c38ac",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x2c380e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x2c380c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x2c3880",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x2c3884",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x2c3888",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x2c3890",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x2c3894",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x2c3898",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x2c38a0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x2c38a4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x2c38a8",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x2c38b0",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0xfee50",
            Type: "Int32"
        },
        Entities: {
            Address: "0x418798",
            Type: "Pointer"
        },
        EntitiesCount: {
            Address: "0x3e8148",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x418788",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x418650",
            Type: "Int16"
        },
        OgModelsOffset: "0x418488",
        OgModelsWeaponOffset2: "0x4199b2",
        OgModelsWeaponOffset: "0x4187c2",
        OgModelsAngwyOffset: "0x41aba2",
        OgModelsFace: "0x336918",
        OgModelsLeftHand: "0x336910",
        OgModelsRightHand: "0x3368f8",
        OgModelsLeftPocket: "0x3368b0",
        OgModelsRightPocket: "0x3368c8",
        OgModelsBackPocket: "0x3368e0"
    },

    ogGunMap: {
        guns: { "11": 2, "13": 4, "14": 6, "12": 8 },
        pockets: { "1": 2, "4": 6, "2": 8 },
        backPocket: null,
        flare: null,
        twoHanded: [],
        stride: "0x47c"
    },

    /** tomb1.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0xfb10",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x16c60",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        EndLevelSeq: {
            Address: "0x171a0",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'void'
        },
        LoadLevelAssets: {
            Address: "0x40150",
            Params: [],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x861a0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x1ac60",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x1d000",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xb8a60",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x89180",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x5b830",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x5c6f0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x6e750",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x20430",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0x72570",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x58440",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x58080",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x57cc0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x28210",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x47a70",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x54d40",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x3b250",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x3bb50",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x51960",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0x722a0",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x73ae0",
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