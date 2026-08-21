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
            Address: "0x163d0c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x163cf4",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x15e2e8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x530a60",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x4331e0",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x307d98",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x531086",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x37ad40",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x37aef0",
            Type: "UInt64"
        },
        LaraClimbState: {
            Address: "0x37ad4e",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x37ad56",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x37aef0",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x37aef0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        Rooms: {
            Address: "0x45d220",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x433070",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x37ad80",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x37ad44",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x37ae30",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x37ae38",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x37ae3a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x37ae5c",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x37ae74",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x37ad4c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3b3960",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x16448c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x307d34",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x307d4c",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x307dc4",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x307d54",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x307d58",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x307d6c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x307d7c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x307d8c",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x307d6c",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x307d7c",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x307d8c",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x307cee",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x307cec",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x307540",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x307544",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x307548",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x307550",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x307554",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x307558",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x307560",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x307564",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x307568",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x307d90",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x13f2ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x37ad68",
            Type: "Int16",
        },
        Entities: {
            Address: "0x530a40",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x433074",
            Type: "Int16"
        },
        OgGraphicsTable: "0x4331e8",
        OgModelsOffset: "0x42f510",
        OgModelsWeaponOffset: "0x45d242",
        OgModelsAngwyOffset: "0x45ff42",
        OgModelsFace: "0x37ae18",
        OgModelsLeftHand: "0x37ae10",
        OgModelsRightHand: "0x37adf8",
        OgModelsLeftPocket: "0x37adb0",
        OgModelsRightPocket: "0x37adc8",
        OgModelsBackPocket: "0x37ad6c"
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
            Address: "0x17ae0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x25a10",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0x6e270",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa7050",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x36aa0",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x38db0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xf0500",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xbe280",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x8f4c0",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x90330",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xa20b0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x74b80",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x178d0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3e560",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xa8570",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x8bbe0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x8b820",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x8b460",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x4c1b0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x7e5d0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x88860",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x47790",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        EntityHarpoon: {
            Address: "0x472d0",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        CreateGraphic: {
            Address: "0x21bc0",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        OG_CreateGraphic: {
            Address: "0x3e6f0",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3de50",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0x872c0",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x68790",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x69270",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x85600",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xa82a0",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0xbcb70",
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