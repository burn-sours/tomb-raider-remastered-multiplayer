/** tomb3.dll */
module.exports = {
    /** tomb3.dll draw/graphics */
    uiLayer: 0x39,

    /* tomb3.dll max outfits */
    challengeOutfits: true,

    /** tomb3.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x1b916c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x1b915c",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x1b376c",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x58d440",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x4906d4",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x35d884",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x58dd14",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3d08a0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x3d0a50",
            Type: "UInt64"
        },
        LaraBehaviourFlags: {
            Address: "0x3d08dc",
            Type: "Int8"
        },
        LaraClimbState: {
            Address: "0x3d08ae",
            Type: "Int16"
        },
        LaraOxygen: {
            Address: "0x3d08b6",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x3d0a50",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30"
        },
        LaraBasicData: {
            Address: "0x3d0a50",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraGunFlags: {
            Address: "0x3d08e0",
            Type: "UInt16"
        },
        LaraGunType: {
            Address: "0x3d08a4",
            Type: "Int32"
        },
        LaraAimingEnemy: {
            Address: "0x3d0990",
            Type: "UInt64"
        },
        LaraAimingYaw: {
            Address: "0x3d0998",
            Type: "Int16"
        },
        LaraAimingPitch: {
            Address: "0x3d099a",
            Type: "Int16"
        },
        LaraAimingLeft: {
            Address: "0x3d09bc",
            Type: "Int16"
        },
        LaraAimingRight: {
            Address: "0x3d09d4",
            Type: "Int16"
        },
        RoomType: {
            Address: "0x3d08ac",
            Type: "Int16"
        },
        LaraHairLeftX: {
            Address: "0x4094c0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1b9aac",
            Type: "Int16"
        },
        UiDrawX: {
            Address: "0x35d878",
            Type: "Int32"
        },
        UiDrawWidth: {
            Address: "0x35d87c",
            Type: "Int32"
        },
        UiDrawHeight: {
            Address: "0x35d8c0",
            Type: "Int32"
        },
        UiResWidth: {
            Address: "0x35d8b0",
            Type: "Int32"
        },
        UiResHeight: {
            Address: "0x35d8b4",
            Type: "Int32"
        },
        CameraFixedX: {
            Address: "0x35d8ec",
            Type: "Int32"
        },
        CameraFixedY: {
            Address: "0x35d8fc",
            Type: "Int32"
        },
        CameraFixedZ: {
            Address: "0x35d90c",
            Type: "Int32"
        },
        CameraX: {
            Address: "0x35d08c",
            Type: "Int32"
        },
        CameraY: {
            Address: "0x35d09c",
            Type: "Int32"
        },
        CameraZ: {
            Address: "0x35d0ac",
            Type: "Int32"
        },
        CameraYaw: {
            Address: "0x35d86e",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x35d86c",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x35d8e0",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x35d8e4",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x35d8e8",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x35d8f0",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x35d8f4",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x35d8f8",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x35d900",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x35d904",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x35d908",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x35d8b8",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x18d2dc",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x3d08c8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4ba7a8",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x48f950",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x490780",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x48f8d0",
            Type: "Int16"
        },
        OgModelsOffset: "0x489ee0",
        OgModelsWeaponOffset: "0x4ba7c2",
        OgModelsAngwyOffset: "0x4bb0ba",
        OgModelsFace: "0x3d0978",
        OgModelsLeftHand: "0x3d0970",
        OgModelsRightHand: "0x3d0958",
        OgModelsLeftPocket: "0x3d0910",
        OgModelsRightPocket: "0x3d0928",
        OgModelsBackPocket: "0x3d08cc"
    },

    ogGunMap: {
        guns: { "11": 2, "22": 20, "12": 10, "13": 6, "16": 8, "18": 12, "21": 14, "20": 16, "19": 18 },
        pockets: { "1": 2, "2": 10, "6": 8 },
        backPocket: { "0": 0, "3": 3, "8": 6, "9": 9, "10": 8, "11": 7 },
        flare: 20,
        twoHanded: [6, 8, 12, 14, 16, 18],
        stride: "0x47c"
    },

    /** tomb3.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x2aa20",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        UpdateLighting: {
            Address: "0xe38e0",
            Params: ['int', 'int', 'int', 'int', 'pointer'],
            Return: 'void'
        },
        LoadedLevel: {
            Address: "0x3c8e0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0xafd80",
            Params: [],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xf25d0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x4a000",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x4cd10",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x13d510",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x10dd60",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xd5d30",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xd6c00",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xee9d0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x539a0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2a4a0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xf67b0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0xd54b0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0xd50f0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0xd4d30",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x6a090",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0xc5880",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0xd1d10",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x64ed0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityRocket: {
            Address: "0x63e60",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityHarpoon: {
            Address: "0x63200",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        CreateGraphic: {
            Address: "0x31500",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x53280",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0xd0790",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0xa4e80",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0xa5ac0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0xcea50",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xf64e0",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x10c6a0",
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