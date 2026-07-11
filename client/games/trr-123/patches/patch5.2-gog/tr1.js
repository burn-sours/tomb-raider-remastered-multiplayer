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
            Address: "0x122118",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x122104",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x101ab8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x4ef460",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x41b914",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x2c6778",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x4efa8a",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x339780",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x339930",
            Type: "Int64"
        },
        PlayerOxygen: {
            Address: "0x339796",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x339930",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x339930",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraGunFlags: {
            Address: "0x3397c0",
            Type: "UInt32",
        },
        LaraGunType: {
            Address: "0x339782",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x339870",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x339878",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x33987a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x33989c",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x3398b4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x33978c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3723a0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x12273c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x2c676c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x2c6770",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x2c67f8",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x2c67a4",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x2c67a8",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x2c6720",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x2c6724",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x2c6728",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x2c67cc",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x2c67dc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x2c67ec",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x2c674e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x2c674c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x2c67c0",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x2c67c4",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x2c67c8",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x2c67d0",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x2c67d4",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x2c67d8",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x2c67e0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x2c67e4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x2c67e8",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x2c67f0",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x101e50",
            Type: "Int32"
        },
        Entities: {
            Address: "0x41bc18",
            Type: "Pointer"
        },
        EntitiesCount: {
            Address: "0x3eb568",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x41bc08",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x41bad0",
            Type: "Int16"
        },
        OgModelsOffset: "0x41b908",
        OgModelsWeaponOffset2: "0x41ce42",
        OgModelsWeaponOffset: "0x41bc42",
        OgModelsAngwyOffset: "0x41e042",
        OgModelsFace: "0x339858",
        OgModelsLeftHand: "0x339850",
        OgModelsRightHand: "0x339838",
        OgModelsLeftPocket: "0x3397f0",
        OgModelsRightPocket: "0x339808",
        OgModelsBackPocket: "0x339820"
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
            Address: "0xfc50",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x16e50",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        EndLevelSeq: {
            Address: "0x173d0",
            Params: ['int'],
            Return: 'void'
        },
        LoadLevelAssets: {
            Address: "0x40660",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x86ba0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x1ae90",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x1d250",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xbae50",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x89b70",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x5bf60",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x5cde0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x6f440",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x20770",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0x73360",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x58990",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x585d0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x58210",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x28470",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x47fe0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x55400",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x3bab0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x3c420",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x51ff0",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0x73090",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x748a0",
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