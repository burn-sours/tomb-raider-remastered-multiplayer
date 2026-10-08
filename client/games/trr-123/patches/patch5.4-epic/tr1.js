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
            Address: "0x125358",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x125344",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x104ab8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x4f3680",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x41fb34",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x2ca998",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x4f3caa",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x33d9a0",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x33db50",
            Type: "Int64"
        },
        PlayerOxygen: {
            Address: "0x33d9b6",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x33db50",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x33db50",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraGunFlags: {
            Address: "0x33d9e0",
            Type: "UInt32",
        },
        LaraGunType: {
            Address: "0x33d9a2",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x33da90",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x33da98",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x33da9a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x33dabc",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x33dad4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x33d9ac",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3765c0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x12570c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x2ca98c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x2ca990",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x2caa18",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x2ca9c4",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x2ca9c8",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x2ca940",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x2ca944",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x2ca948",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x2ca9ec",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x2ca9fc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x2caa0c",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x2ca96e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x2ca96c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x2ca9e0",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x2ca9e4",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x2ca9e8",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x2ca9f0",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x2ca9f4",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x2ca9f8",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x2caa00",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x2caa04",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x2caa08",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x2caa10",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x104e50",
            Type: "Int32"
        },
        Entities: {
            Address: "0x41fe38",
            Type: "Pointer"
        },
        EntitiesCount: {
            Address: "0x3ef788",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x41fe28",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x41fcf0",
            Type: "Int16"
        },
        OgModelsOffset: "0x41fb28",
        OgModelsWeaponOffset2: "0x421062",
        OgModelsWeaponOffset: "0x41fe62",
        OgModelsAngwyOffset: "0x422262",
        OgModelsFace: "0x33da78",
        OgModelsLeftHand: "0x33da70",
        OgModelsRightHand: "0x33da58",
        OgModelsLeftPocket: "0x33da10",
        OgModelsRightPocket: "0x33da28",
        OgModelsBackPocket: "0x33da40"
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
            Address: "0xff60",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x17110",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        EndLevelSeq: {
            Address: "0x176f0",
            Params: ['int'],
            Return: 'void'
        },
        LoadLevelAssets: {
            Address: "0x41070",
            Params: ['int', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x884d0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x1b220",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x1d610",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xbdf10",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x8b4b0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x5d900",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x5e7c0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x707d0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x20a80",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0x746e0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x5a0e0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x59d20",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x59960",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x28830",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x48c20",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x568b0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x3c160",
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
            Address: "0x53510",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0x74410",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x75c50",
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