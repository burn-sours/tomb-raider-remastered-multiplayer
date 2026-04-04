/** tomb3.dll */
module.exports = {
    /** tomb3.dll draw/graphics */
    uiLayer: 0x46,

    /* tomb3.dll max outfits */
    challengeOutfits: true,
    challengeOutfitsScrewed: true,

    /** tomb3.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x1bb0ac",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x1bb09c",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x1b56ac",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x590420",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x492af4",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x35f7c4",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x590cf4",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3d27e0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x3d2990",
            Type: "UInt64"
        },
        LaraBehaviourFlags: {
            Address: "0x3d281c",
            Type: "Int8"
        },
        LaraClimbState: {
            Address: "0x3d27ee",
            Type: "Int16"
        },
        LaraOxygen: {
            Address: "0x3d27f6",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x3d2990",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30"
        },
        LaraBasicData: {
            Address: "0x3d2990",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraGunFlags: {
            Address: "0x3d2820",
            Type: "UInt16"
        },
        LaraGunType: {
            Address: "0x3d27e4",
            Type: "Int32"
        },
        LaraAimingEnemy: {
            Address: "0x3d28d0",
            Type: "UInt64"
        },
        LaraAimingYaw: {
            Address: "0x3d28d8",
            Type: "Int16"
        },
        LaraAimingPitch: {
            Address: "0x3d28da",
            Type: "Int16"
        },
        LaraAimingLeft: {
            Address: "0x3d28fc",
            Type: "Int16"
        },
        LaraAimingRight: {
            Address: "0x3d2914",
            Type: "Int16"
        },
        RoomType: {
            Address: "0x3d27ec",
            Type: "Int16"
        },
        LaraHairLeftX: {
            Address: "0x40b400",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1bb9ec",
            Type: "Int16"
        },
        UiDrawX: {
            Address: "0x35f7b8",
            Type: "Int32"
        },
        UiDrawWidth: {
            Address: "0x35f7bc",
            Type: "Int32"
        },
        UiDrawHeight: {
            Address: "0x35f800",
            Type: "Int32"
        },
        UiResWidth: {
            Address: "0x35f7f0",
            Type: "Int32"
        },
        UiResHeight: {
            Address: "0x35f7f4",
            Type: "Int32"
        },
        CameraFixedX: {
            Address: "0x35f82c",
            Type: "Int32"
        },
        CameraFixedY: {
            Address: "0x35f83c",
            Type: "Int32"
        },
        CameraFixedZ: {
            Address: "0x35f84c",
            Type: "Int32"
        },
        CameraX: {
            Address: "0x35efcc",
            Type: "Int32"
        },
        CameraY: {
            Address: "0x35efdc",
            Type: "Int32"
        },
        CameraZ: {
            Address: "0x35efec",
            Type: "Int32"
        },
        CameraYaw: {
            Address: "0x35f7ae",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x35f7ac",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x35f820",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x35f824",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x35f828",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x35F830",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x35F834",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x35F838",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x35F840",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x35F844",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x35F848",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x35f7f8",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x18f2dc",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x3d2808",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4bcbc8",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x491d70",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x492ba0",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x491cf0",
            Type: "Int16"
        },
        OgModelsOffset: "0x48c2a0",
        OgModelsWeaponOffset: "0x4bcbe2",
        OgModelsAngwyOffset: "0x4BF8E2",
        OgModelsFace: "0x3d28b8",
        OgModelsLeftHand: "0x3d28b0",
        OgModelsRightHand: "0x3d2898",
        OgModelsLeftPocket: "0x3d2850",
        OgModelsRightPocket: "0x3d2868",
        OgModelsBackPocket: "0x3d280c"
    },

    ogGunMap: {
        guns: {"11": 2, "22": 20, "12": 10, "13": 6, "16": 8, "18": 12, "21": 14, "20": 16, "19": 18},
        pockets: {"1": 2, "2": 10, "6": 8},
        backPocket: {"0": 0, "3": 3, "8": 6, "9": 9, "10": 8, "11": 7},
        flare: 20,
        twoHanded: [6, 8, 12, 14, 16, 18],
        stride: "0x480"
    },

    /** tomb3.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x2aba0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        UpdateLighting: {
            Address: "0xe3cc0",
            Params: ['int','int','int','int','pointer'],
            Return: 'void'
        },
        LoadedLevel: {
            Address: "0x3ca60",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0xafb80",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xf2c10",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x499c0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x4c6e0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x13e3e0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x10e160",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xd5d40",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xd6bc0",
            Params: ['int','int','int','int','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xeefc0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x533a0",
            Params: ['int','int','pointer'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2a620",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xf6f20",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0xd5400",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0xd5040",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0xd4c80",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x69ee0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0xc5770",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0xd1da0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x64cc0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityRocket: {
            Address: "0x63c30",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityHarpoon: {
            Address: "0x62fb0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        ModernGfx: {
            Address: "0x31690",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x52c80",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0xd0830",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0xa4c10",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0xa5850",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0xceae0",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xf6c50",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x10cbf0",
            Params: [],
            Return: 'void'
        }
    },

    /** tomb3.dll sounds */
    sounds: {
        "static_sounds": [
            "0x2", //-- No
            "0x69", //-- mp5
            "0x74", //-- heal
            "0x7", //-- holster
            "0xf", //-- harpoon
            "0x10", //-- harpoon
            "0x16", //-- harpoon
        ],
        "lara_sounds": [
            "0x0", //-- footstep
            "0x1", //-- grunt
            "0x3", //-- slide
            "0x4", //-- land
            "0x5", //-- climb
            "0x6", //-- draw guns
            "0x8", //-- shoot
            "0x4008", //-- pistols new
            "0x9", //-- reload
            "0xa", //-- gun
            "0xb", //-- light flare
            "0x12", //-- water
            "0x14", //-- water
            "0x15", //-- auto pistols
            "0x1a", //-- climb
            "0x1b", //-- bonk
            "0x1c", //-- shimmy
            "0x1d", //-- jump
            "0x1e", //-- scream
            "0x1f", //-- arghhh
            "0x19", //-- button
            "0x20", //-- roll
            "0x21", //-- dive
            "0x22", //-- swim
            "0x23", //-- swim
            "0x24", //-- swim
            "0x25", //-- glug glug
            "0x26", //-- lever down
            "0x27", //-- key hole?
            "0x2a", //-- land death
            "0x2b", //-- uzis
            "0x2c", //-- magnums
            "0x2d", //-- shotgun
            "0x2e", //-- eugheuhgueghe
            "0x2f", //-- eugheuhgueghe
            "0x33", //-- eugheuhgueghe
            "0x34", //-- swim float
            "0x35", //-- crunch dead
            "0x37", //-- grab ledge
            "0x38", //-- grab ledge
            "0x39", //-- lever up
            "0x3d", //-- lever water
            "0x3e", //-- aha
            "0x3f", //-- eguheghghh
            "0x42", //-- crumble
            "0x47", //-- throw flare
            "0x4d", //-- rocket launch
            "0x4e", //-- mp5
            "0x68", //--
            "0x69", //-- explode
            "0x6a", //-- explode
            "0x75", //-- climb
            "0x79", //-- deagle
            "0x7d", //-- grenade launch
            "0x91", //-- spike death
            "0x92", //-- boulder death
            "0x98", //-- quad start
            "0x9c", //-- quad eject
            "0xf", //-- harpoon
            "0x10", //-- harpoon
            "0x16", //-- harpoon
            "0x117", //-- zipline grab
            "0x120", //-- tr3 footstep
            "0x122", //-- tr3 footstep
            "0x123", //-- tr3 footstep
            "0x124", //-- tr3 footstep
            "0x125", //-- tr3 footstep
            "0x126", //-- tr3 footstep
            "0x11", //-- splash
            "0x18", //--  crawling
            "0x36", //-- fall grab
            "0x46", //-- tr3 fall/death
            "0x29", //-- tr3 eughgheghegh
            "0x8f", //-- tr3 fall/death
            "0xdb", //-- minecart brake
        ]
    }
};