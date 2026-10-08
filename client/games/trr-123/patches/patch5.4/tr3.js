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
            Address: "0x1be23c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x1be22c",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x1b882c",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x594580",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x496c54",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x363904",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x594e54",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3d6920",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x3d6ad0",
            Type: "UInt64"
        },
        LaraBehaviourFlags: {
            Address: "0x3d695c",
            Type: "Int8"
        },
        LaraClimbState: {
            Address: "0x3d692e",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x3d6936",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x3d6ad0",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30"
        },
        LaraBasicData: {
            Address: "0x3d6ad0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraGunFlags: {
            Address: "0x3d6960",
            Type: "UInt16"
        },
        LaraGunType: {
            Address: "0x3d6924",
            Type: "Int32"
        },
        LaraAimingEnemy: {
            Address: "0x3d6a10",
            Type: "UInt64"
        },
        LaraAimingYaw: {
            Address: "0x3d6a18",
            Type: "Int16"
        },
        LaraAimingPitch: {
            Address: "0x3d6a1a",
            Type: "Int16"
        },
        LaraAimingLeft: {
            Address: "0x3d6a3c",
            Type: "Int16"
        },
        LaraAimingRight: {
            Address: "0x3d6a54",
            Type: "Int16"
        },
        RoomType: {
            Address: "0x3d692c",
            Type: "Int16"
        },
        LaraHairLeftX: {
            Address: "0x40f540",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1be90c",
            Type: "Int16"
        },
        UiDrawX: {
            Address: "0x3638f8",
            Type: "Int32"
        },
        UiDrawWidth: {
            Address: "0x3638fc",
            Type: "Int32"
        },
        UiDrawHeight: {
            Address: "0x363940",
            Type: "Int32"
        },
        UiResWidth: {
            Address: "0x363930",
            Type: "Int32"
        },
        UiResHeight: {
            Address: "0x363934",
            Type: "Int32"
        },
        CameraFixedX: {
            Address: "0x36396c",
            Type: "Int32"
        },
        CameraFixedY: {
            Address: "0x36397c",
            Type: "Int32"
        },
        CameraFixedZ: {
            Address: "0x36398c",
            Type: "Int32"
        },
        CameraX: {
            Address: "0x36310c",
            Type: "Int32"
        },
        CameraY: {
            Address: "0x36311c",
            Type: "Int32"
        },
        CameraZ: {
            Address: "0x36312c",
            Type: "Int32"
        },
        CameraYaw: {
            Address: "0x3638ee",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x3638ec",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x363960",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x363964",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x363968",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x363970",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x363974",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x363978",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x363980",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x363984",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x363988",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x363938",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x1922dc",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x3d6948",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4c0d28",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x495eb4",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x496d00",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x495e30",
            Type: "Int16"
        },
        OgModelsOffset: "0x4903e0",
        OgModelsWeaponOffset: "0x4c0d42",
        OgModelsAngwyOffset: "0x4c3a42",
        OgModelsFace: "0x3d69f8",
        OgModelsLeftHand: "0x3d69f0",
        OgModelsRightHand: "0x3d69d8",
        OgModelsLeftPocket: "0x3d6990",
        OgModelsRightPocket: "0x3d69a8",
        OgModelsBackPocket: "0x3d694c"
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
            Address: "0x2af10",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        UpdateLighting: {
            Address: "0xe3af0",
            Params: ['int', 'int', 'int', 'int', 'pointer'],
            Return: 'void'
        },
        LoadedLevel: {
            Address: "0x3ce00",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0xaeee0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xf2ad0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x49e80",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x4cbf0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x140ad0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x10e420",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xd5d70",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xd6bf0",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xeedf0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x53900",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2a930",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xf7100",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0xd5430",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0xd5070",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0xd4cb0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x6a890",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0xc4e50",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0xd1dd0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x65580",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityRocket: {
            Address: "0x644d0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityHarpoon: {
            Address: "0x63830",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        CreateGraphic: {
            Address: "0x31a00",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x531e0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0xd0860",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0xa3ec0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0xa4b00",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0xceb70",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xf6e30",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x10cdd0",
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