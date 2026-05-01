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
            Address: "0x15facc",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x15fab4",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x15a0a8",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x52c5e0",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x42ed60",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x303918",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x52cc06",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3768c0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x376a70",
            Type: "UInt64"
        },
        LaraClimbState: {
            Address: "0x3768ce",
            Type: "Int16"
        },
        LaraOxygen: {
            Address: "0x3768d6",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x376a70",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x376a70",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        Rooms: {
            Address: "0x458da0",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x42ebf0",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x376900",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x3768c4",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x3769b0",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x3769b8",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x3769ba",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x3769dc",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x3769f4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x3768cc",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3af4e0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x16022c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x3038b4",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x3038cc",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x303944",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x3038d4",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x3038d8",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x3038ec",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x3038fc",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x30390c",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x3038ec",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x3038fc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x30390c",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x30386e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x30386c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x3030c0",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x3030c4",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x3030c8",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x3030d0",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x3030d4",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x3030d8",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x3030e0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x3030e4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x3030e8",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x303910",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x13b2ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x3768e8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x52c5c0",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x42ebf4",
            Type: "Int16"
        },
        OgGraphicsTable: "0x42ed68",
        OgModelsOffset: "0x42b090",
        OgModelsWeaponOffset: "0x458dc2",
        OgModelsAngwyOffset: "0x45bac2",
        OgModelsFace: "0x376998",
        OgModelsLeftHand: "0x376990",
        OgModelsRightHand: "0x376978",
        OgModelsLeftPocket: "0x376930",
        OgModelsRightPocket: "0x376948",
        OgModelsBackPocket: "0x3768ec"
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
            Address: "0x178d0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x25800",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0x6cc90",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa55b0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x36630",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x38930",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xec050",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xbc3b0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x8d450",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x8e2d0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xa0670",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x734c0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x176c0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3e130",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xa6ab0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0x89db0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0x899f0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0x89630",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x4bd90",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0x7cc80",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0x86a80",
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
        ModernGfx: {
            Address: "0x219b0",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        OgGfxPrep: {
            Address: "0x3e2c0",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3da20",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0x85510",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0x671b0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0x67cc0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0x837e0",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xa67e0",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0xbaeb0",
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