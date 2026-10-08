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
            Address: "0x1bb2fc",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x1bb2ec",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x1b58ec",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x591640",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x493d14",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x3609c4",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x591f14",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3d39e0",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x3d3b90",
            Type: "UInt64"
        },
        LaraBehaviourFlags: {
            Address: "0x3d3a1c",
            Type: "Int8"
        },
        LaraClimbState: {
            Address: "0x3d39ee",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x3d39f6",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x3d3b90",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30"
        },
        LaraBasicData: {
            Address: "0x3d3b90",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraGunFlags: {
            Address: "0x3d3a20",
            Type: "UInt16"
        },
        LaraGunType: {
            Address: "0x3d39e4",
            Type: "Int32"
        },
        LaraAimingEnemy: {
            Address: "0x3d3ad0",
            Type: "UInt64"
        },
        LaraAimingYaw: {
            Address: "0x3d3ad8",
            Type: "Int16"
        },
        LaraAimingPitch: {
            Address: "0x3d3ada",
            Type: "Int16"
        },
        LaraAimingLeft: {
            Address: "0x3d3afc",
            Type: "Int16"
        },
        LaraAimingRight: {
            Address: "0x3d3b14",
            Type: "Int16"
        },
        RoomType: {
            Address: "0x3d39ec",
            Type: "Int16"
        },
        LaraHairLeftX: {
            Address: "0x40c600",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1bb9cc",
            Type: "Int16"
        },
        UiDrawX: {
            Address: "0x3609b8",
            Type: "Int32"
        },
        UiDrawWidth: {
            Address: "0x3609bc",
            Type: "Int32"
        },
        UiDrawHeight: {
            Address: "0x360a00",
            Type: "Int32"
        },
        UiResWidth: {
            Address: "0x3609f0",
            Type: "Int32"
        },
        UiResHeight: {
            Address: "0x3609f4",
            Type: "Int32"
        },
        CameraFixedX: {
            Address: "0x360a2c",
            Type: "Int32"
        },
        CameraFixedY: {
            Address: "0x360a3c",
            Type: "Int32"
        },
        CameraFixedZ: {
            Address: "0x360a4c",
            Type: "Int32"
        },
        CameraX: {
            Address: "0x3601cc",
            Type: "Int32"
        },
        CameraY: {
            Address: "0x3601dc",
            Type: "Int32"
        },
        CameraZ: {
            Address: "0x3601ec",
            Type: "Int32"
        },
        CameraYaw: {
            Address: "0x3609ae",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x3609ac",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x360a20",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x360a24",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x360a28",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x360a30",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x360a34",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x360a38",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x360a40",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x360a44",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x360a48",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x3609f8",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x18f2dc",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x3d3a08",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4bdde8",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x492f74",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x493dc0",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x492ef0",
            Type: "Int16"
        },
        OgModelsOffset: "0x48d4a0",
        OgModelsWeaponOffset: "0x4bde02",
        OgModelsAngwyOffset: "0x4c0b02",
        OgModelsFace: "0x3d3ab8",
        OgModelsLeftHand: "0x3d3ab0",
        OgModelsRightHand: "0x3d3a98",
        OgModelsLeftPocket: "0x3d3a50",
        OgModelsRightPocket: "0x3d3a68",
        OgModelsBackPocket: "0x3d3a0c"
    },

    ogGunMap: {
        guns: { "11": 2, "22": 20, "12": 10, "13": 6, "16": 8, "18": 12, "21": 14, "20": 16, "19": 18 },
        pockets: { "1": 2, "2": 10, "6": 8 },
        backPocket: { "0": 0, "3": 3, "8": 6, "9": 9, "10": 8, "11": 7 },
        flare: 20,
        twoHanded: [6, 8, 12, 14, 16, 18],
        stride: "0x480"
    },

    /** tomb3.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x2ae00",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        UpdateLighting: {
            Address: "0xe1f30",
            Params: ['int', 'int', 'int', 'int', 'pointer'],
            Return: 'void'
        },
        LoadedLevel: {
            Address: "0x3cd10",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0xad7e0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xf0e80",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x49cc0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x4ca20",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x13f0b0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x10cb90",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xd4590",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xd5460",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xed1e0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x53750",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2a820",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xf5420",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0xd3c50",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0xd3890",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0xd34d0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x6a490",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0xc3660",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0xd04b0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x651d0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityRocket: {
            Address: "0x64150",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityHarpoon: {
            Address: "0x634d0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        CreateGraphic: {
            Address: "0x318e0",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x53020",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0xcef20",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0xa2830",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0xa3460",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0xcd230",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xf5150",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x10b320",
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