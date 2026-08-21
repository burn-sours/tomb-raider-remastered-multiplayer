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
            Address: "0x163c4c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x163c34",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x15e228",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x5309a0",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x433120",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x307cd8",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x530fc6",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x37ac80",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x37ae30",
            Type: "UInt64"
        },
        LaraClimbState: {
            Address: "0x37ac8e",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x37ac96",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x37ae30",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x37ae30",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        Rooms: {
            Address: "0x45d160",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x432fb0",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x37acc0",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x37ac84",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x37ad70",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x37ad78",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x37ad7a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x37ad9c",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x37adb4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x37ac8c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3b38a0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1643cc",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x307c74",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x307c8c",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x307d04",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x307c94",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x307c98",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x307cac",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x307cbc",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x307ccc",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x307cac",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x307cbc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x307ccc",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x307c2e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x307c2c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x307480",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x307484",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x307488",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x307490",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x307494",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x307498",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x3074a0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x3074a4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x3074a8",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x307cd0",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x13f2ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x37aca8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x530980",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x432fb4",
            Type: "Int16"
        },
        OgGraphicsTable: "0x433128",
        OgModelsOffset: "0x42f450",
        OgModelsWeaponOffset: "0x45d182",
        OgModelsAngwyOffset: "0x45fe82",
        OgModelsFace: "0x37ad58",
        OgModelsLeftHand: "0x37ad50",
        OgModelsRightHand: "0x37ad38",
        OgModelsLeftPocket: "0x37acf0",
        OgModelsRightPocket: "0x37ad08",
        OgModelsBackPocket: "0x37acac"
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
            Address: "0x17b00",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x25a50",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0x6dc00",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa6f70",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x369a0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x38cf0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xeffc0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xbdda0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x8ef70",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x8fdf0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xa1fa0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x74530",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x178f0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3e4f0",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xa8470",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x8b5b0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x8b1f0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x8ae30",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x4c1e0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x7e040",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x882b0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x47780",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        EntityHarpoon: {
            Address: "0x472c0",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        CreateGraphic: {
            Address: "0x21bf0",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        OG_CreateGraphic: {
            Address: "0x3e680",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3dde0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0x86d40",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x68130",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x68c40",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x85080",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xa81a0",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0xbc8a0",
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