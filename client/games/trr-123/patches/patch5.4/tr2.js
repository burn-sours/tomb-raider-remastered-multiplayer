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
            Address: "0x164c3c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x164c24",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x15f208",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x532720",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x434ea0",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x309a58",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x532d46",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x37ca00",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x37cbb0",
            Type: "UInt64"
        },
        LaraClimbState: {
            Address: "0x37ca0e",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x37ca16",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x37cbb0",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x37cbb0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        Rooms: {
            Address: "0x45eee0",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x434d30",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x37ca40",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x37ca04",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x37caf0",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x37caf8",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x37cafa",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x37cb1c",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x37cb34",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x37ca0c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3b5620",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x16512c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x3099f4",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x309a0c",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x309a84",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x309a14",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x309a18",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x309a2c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x309a3c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x309a4c",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x309a2c",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x309a3c",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x309a4c",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x3099ae",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x3099ac",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x309200",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x309204",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x309208",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x309210",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x309214",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x309218",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x309220",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x309224",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x309228",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x309a50",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x1402ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x37ca28",
            Type: "Int16",
        },
        Entities: {
            Address: "0x532700",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x434d34",
            Type: "Int16"
        },
        OgGraphicsTable: "0x434ea8",
        OgModelsOffset: "0x4311d0",
        OgModelsWeaponOffset: "0x45ef02",
        OgModelsAngwyOffset: "0x461c02",
        OgModelsFace: "0x37cad8",
        OgModelsLeftHand: "0x37cad0",
        OgModelsRightHand: "0x37cab8",
        OgModelsLeftPocket: "0x37ca70",
        OgModelsRightPocket: "0x37ca88",
        OgModelsBackPocket: "0x37ca2c"
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
            Address: "0x17620",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x25580",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0x6d9e0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa6dd0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x364c0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x38810",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xf0380",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xbdca0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x8ede0",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x8fc60",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xa1e00",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x742f0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x17410",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3e010",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xa82d0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x8b400",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x8b040",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x8ac80",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x4be50",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x7dea0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x87fa0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x47400",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        EntityHarpoon: {
            Address: "0x46f40",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        CreateGraphic: {
            Address: "0x21720",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        OG_CreateGraphic: {
            Address: "0x3e1a0",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3d900",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0x86a30",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x67f00",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x68a10",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x84d70",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xa8000",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0xbc6c0",
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