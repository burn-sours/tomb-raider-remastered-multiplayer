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
            Address: "0x1ba16c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x1ba15c",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x1b476c",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x58f4e0",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x491bb4",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x35e864",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x58fdb4",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3d1880",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x3d1a30",
            Type: "UInt64"
        },
        LaraBehaviourFlags: {
            Address: "0x3d18bc",
            Type: "Int8"
        },
        LaraClimbState: {
            Address: "0x3d188e",
            Type: "Int16"
        },
        LaraOxygen: {
            Address: "0x3d1896",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x3d1a30",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30"
        },
        LaraBasicData: {
            Address: "0x3d1a30",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraGunFlags: {
            Address: "0x3d18c0",
            Type: "UInt16"
        },
        LaraGunType: {
            Address: "0x3d1884",
            Type: "Int32"
        },
        LaraAimingEnemy: {
            Address: "0x3d1970",
            Type: "UInt64"
        },
        LaraAimingYaw: {
            Address: "0x3d1978",
            Type: "Int16"
        },
        LaraAimingPitch: {
            Address: "0x3d197a",
            Type: "Int16"
        },
        LaraAimingLeft: {
            Address: "0x3d199c",
            Type: "Int16"
        },
        LaraAimingRight: {
            Address: "0x3d19b4",
            Type: "Int16"
        },
        RoomType: {
            Address: "0x3d188c",
            Type: "Int16"
        },
        LaraHairLeftX: {
            Address: "0x40a4a0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1baaac",
            Type: "Int16"
        },
        UiDrawX: {
            Address: "0x35e858",
            Type: "Int32"
        },
        UiDrawWidth: {
            Address: "0x35e85c",
            Type: "Int32"
        },
        UiDrawHeight: {
            Address: "0x35e8a0",
            Type: "Int32"
        },
        UiResWidth: {
            Address: "0x35e890",
            Type: "Int32"
        },
        UiResHeight: {
            Address: "0x35e894",
            Type: "Int32"
        },
        CameraFixedX: {
            Address: "0x35e8cc",
            Type: "Int32"
        },
        CameraFixedY: {
            Address: "0x35e8dc",
            Type: "Int32"
        },
        CameraFixedZ: {
            Address: "0x35e8ec",
            Type: "Int32"
        },
        CameraX: {
            Address: "0x35e06c",
            Type: "Int32"
        },
        CameraY: {
            Address: "0x35e07c",
            Type: "Int32"
        },
        CameraZ: {
            Address: "0x35e08c",
            Type: "Int32"
        },
        CameraYaw: {
            Address: "0x35e84e",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x35e84c",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x35e8c0",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x35e8c4",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x35e8c8",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x35e8d0",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x35e8d4",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x35e8d8",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x35e8e0",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x35e8e4",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x35e8e8",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x35e898",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x18e2dc",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x3d18a8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4bbc88",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x490e14",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x491c60",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x490d90",
            Type: "Int16"
        },
        OgModelsOffset: "0x48b340",
        OgModelsWeaponOffset: "0x4bbca2",
        OgModelsAngwyOffset: "0x4be9a2",
        OgModelsFace: "0x3d1958",
        OgModelsLeftHand: "0x3d1950",
        OgModelsRightHand: "0x3d1938",
        OgModelsLeftPocket: "0x3d18f0",
        OgModelsRightPocket: "0x3d1908",
        OgModelsBackPocket: "0x3d18ac"
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
            Address: "0x2ab40",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        UpdateLighting: {
            Address: "0xe26a0",
            Params: ['int', 'int', 'int', 'int', 'pointer'],
            Return: 'void'
        },
        LoadedLevel: {
            Address: "0x3ca30",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0xaea40",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xf15f0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x498f0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x4c600",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x13dc50",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x10ce30",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xd4ae0",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xd59b0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xed950",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x532e0",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2a5c0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xf5850",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0xd41a0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0xd3de0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0xd3a20",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x69d80",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0xc44f0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0xd0a00",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x64ba0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityRocket: {
            Address: "0x63b20",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityHarpoon: {
            Address: "0x62ea0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        CreateGraphic: {
            Address: "0x31620",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x52bb0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0xcf470",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0xa3ba0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0xa47d0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0xcd710",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xf5580",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x10b6a0",
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