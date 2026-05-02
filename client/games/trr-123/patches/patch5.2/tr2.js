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
            Address: "0x160b8c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x160b74",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x15b168",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x52d680",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x42fe00",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x3049b8",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x52dca6",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x377960",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x377b10",
            Type: "UInt64"
        },
        LaraClimbState: {
            Address: "0x37796e",
            Type: "Int16"
        },
        LaraOxygen: {
            Address: "0x377976",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x377b10",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x377b10",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        Rooms: {
            Address: "0x459e40",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x42fc90",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x3779a0",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x377964",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x377a50",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x377a58",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x377a5a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x377a7c",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x377a94",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x37796c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3b0580",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1612ec",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x304954",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x30496c",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x3049e4",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x304974",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x304978",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x30498c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x30499c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x3049ac",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x30498c",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x30499c",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x3049ac",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x30490e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x30490c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x304160",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x304164",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x304168",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x304170",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x304174",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x304178",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x304180",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x304184",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x304188",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x3049b0",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x13c2ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x377988",
            Type: "Int16",
        },
        Entities: {
            Address: "0x52d660",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x42fc94",
            Type: "Int16"
        },
        OgGraphicsTable: "0x42fe08",
        OgModelsOffset: "0x42c130",
        OgModelsWeaponOffset: "0x459e62",
        OgModelsAngwyOffset: "0x45cb62",
        OgModelsFace: "0x377a38",
        OgModelsLeftHand: "0x377a30",
        OgModelsRightHand: "0x377a18",
        OgModelsLeftPocket: "0x3779d0",
        OgModelsRightPocket: "0x3779e8",
        OgModelsBackPocket: "0x37798c"
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
            Address: "0x179c0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x258e0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0x6dc50",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa61e0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x36880",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x38b30",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xee180",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xbd380",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x8e3f0",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x8f2b0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xa1250",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x74480",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x177b0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3e2b0",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xa7700",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x8ae20",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x8aa60",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x8a6a0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x4beb0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x7dba0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x879b0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x47520",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        EntityHarpoon: {
            Address: "0x47060",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        CreateGraphic: {
            Address: "0x21a90",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        OG_CreateGraphic: {
            Address: "0x3e440",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3dba0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0x86420",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x68120",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x68bf0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x846f0",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xa7430",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0xbbc60",
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