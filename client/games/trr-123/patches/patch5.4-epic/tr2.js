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
            Address: "0x163cfc",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x163ce4",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x15e2c8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x5317e0",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x433f60",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x308b18",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x531e06",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x37bac0",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x37bc70",
            Type: "UInt64"
        },
        LaraClimbState: {
            Address: "0x37bace",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x37bad6",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x37bc70",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x37bc70",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        Rooms: {
            Address: "0x45dfa0",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x433df0",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x37bb00",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x37bac4",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x37bbb0",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x37bbb8",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x37bbba",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x37bbdc",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x37bbf4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x37bacc",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3b46e0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1641ec",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x308ab4",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x308acc",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x308b44",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x308ad4",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x308ad8",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x308aec",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x308afc",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x308b0c",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x308aec",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x308afc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x308b0c",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x308a6e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x308a6c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x3082c0",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x3082c4",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x3082c8",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x3082d0",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x3082d4",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x3082d8",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x3082e0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x3082e4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x3082e8",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x308b10",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x13f2ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x37bae8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x5317c0",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x433df4",
            Type: "Int16"
        },
        OgGraphicsTable: "0x433f68",
        OgModelsOffset: "0x430290",
        OgModelsWeaponOffset: "0x45dfc2",
        OgModelsAngwyOffset: "0x460cc2",
        OgModelsFace: "0x37bb98",
        OgModelsLeftHand: "0x37bb90",
        OgModelsRightHand: "0x37bb78",
        OgModelsLeftPocket: "0x37bb30",
        OgModelsRightPocket: "0x37bb48",
        OgModelsBackPocket: "0x37baec"
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
            Address: "0x175f0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x25530",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0x6e0e0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa6fe0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x365c0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x388d0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xf0820",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xbe300",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x8f400",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x902c0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xa2040",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x749a0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x173e0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3e050",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xa8500",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x8bb20",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x8b760",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x8b3a0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x4be10",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x7e4a0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x88580",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x473f0",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        EntityHarpoon: {
            Address: "0x46f30",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        CreateGraphic: {
            Address: "0x216d0",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        OG_CreateGraphic: {
            Address: "0x3e1e0",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3d940",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0x86ff0",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x685c0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x69090",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x85330",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xa8230",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0xbcb00",
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