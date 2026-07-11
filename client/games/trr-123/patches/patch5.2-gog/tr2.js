/** tomb2.dll */
module.exports = {
    /** tomb2.dll draw/graphics */
    uiLayer: 0x46,

    /* tomb2.dll max outfits */
    challengeOutfits: true,
    challengeOutfitsScrewed: true,

    /** tomb2.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x161acc",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x161ab4",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x15c0a8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x52e5c0",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x430d40",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x3058f8",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x52ebe6",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3788a0",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x378a50",
            Type: "UInt64"
        },
        LaraClimbState: {
            Address: "0x3788ae",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x3788b6",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x378a50",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x378a50",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        Rooms: {
            Address: "0x45ad80",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x430bd0",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x3788e0",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x3788a4",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x378990",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x378998",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x37899a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x3789bc",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x3789d4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x3788ac",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3b14c0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x16222c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x305894",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x3058ac",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x305924",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x3058b4",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x3058b8",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x3058cc",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x3058dc",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x3058ec",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x3058cc",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x3058dc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x3058ec",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x30584e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x30584c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x3050a0",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x3050a4",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x3050a8",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x3050b0",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x3050b4",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x3050b8",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x3050c0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x3050c4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x3050c8",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x3058f0",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x13d2ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x3788c8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x52e5a0",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x430bd4",
            Type: "Int16"
        },
        OgGraphicsTable: "0x430d48",
        OgModelsOffset: "0x42d070",
        OgModelsWeaponOffset: "0x45ada2",
        OgModelsAngwyOffset: "0x45daa2",
        OgModelsFace: "0x378978",
        OgModelsLeftHand: "0x378970",
        OgModelsRightHand: "0x378958",
        OgModelsLeftPocket: "0x378910",
        OgModelsRightPocket: "0x378928",
        OgModelsBackPocket: "0x3788cc"
    },

    ogGunMap: {
        guns: { "11": 2, "12": 10, "13": 6, "15": 8, "17": 12, "20": 14, "19": 16, "22": 18 },
        pockets: { "1": 2, "4": 6, "2": 8 },
        backPocket: { "0": 0, "3": 3, "7": 6, "9": 8 },
        flare: 18,
        twoHanded: [12, 14, 16],
        stride: "0x480"
    },

    /** tomb2.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x17950",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x25890",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0x6d490",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa5e40",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x366d0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x389d0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xed9b0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xbcbe0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x8dc40",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x8eac0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xa0e80",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x73cc0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x17740",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3e1d0",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xa7340",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x8a5c0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x8a200",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x89e40",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x4be60",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x7d4d0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x872c0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x47490",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        EntityHarpoon: {
            Address: "0x46fd0",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        CreateGraphic: {
            Address: "0x21a30",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        OG_CreateGraphic: {
            Address: "0x3e360",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3dac0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0x85d50",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x679b0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x684c0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x84020",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xa7070",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0xbb6e0",
            Params: [],
            Return: 'void'
        }
    },

    /** tomb2.dll sounds */
    sounds: {
        "static_sounds": [
            "0x2", //-- No
            "0x69", //-- grenade
            "0x74", //-- heal
            "0x7", //-- holster
            "0xf", //-- harpoon
            "0x10", //-- harpoon
            "0x16", //-- harpoon
            "0xc4", //-- boat rev
            "0xc8", //-- crash boat
            "0xc9", //-- crash skiidoo
            "0xca", //-- crash skiidoo
            "0xcb", //-- crash skiidoo
        ],
        "lara_sounds": [
            "0x0", //-- footstep
            "0x1", //-- grunt
            "0x3", //-- slide
            "0x4", //-- land
            "0x5", //-- climb
            "0x6", //-- draw guns
            "0x8", //-- pistols
            "0x9", //-- reload
            "0xa", //-- gun
            "0xb", //-- light flare
            "0x12", //-- walk in water
            "0x14", //-- walk in water
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
            "0x4e", //-- m16
            "0x68", //-- m16
            "0x75", //-- climb
            "0x7d", //-- grenade launch
            "0x91", //-- spike death
            "0x92", //-- boulder death
            "0xc2", //-- start boat
            "0x9a", //-- skidoo rev
            "0x117", //-- zipline grab
            "0x11", //-- splash
            "0x36", //-- fall grab
        ]
    }
};