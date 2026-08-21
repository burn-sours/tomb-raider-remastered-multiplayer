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
            Address: "0x1bd22c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x1bd21c",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x1b782c",
            Type: "Int32"
        },
        WorldStateBackupPointer: {
            Address: "0x5927e0",
            Type: "Block",
            Size: "0x6800"
        },
        ActionKeys: {
            Address: "0x494eb4",
            Type: "UInt32"
        },
        InterpolationFactor: {
            Address: "0x361b64",
            Type: "UInt32"
        },
        NewGamePlus: {
            Address: "0x5930b4",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x3d4b80",
            Type: "Int16"
        },
        MainPlayerEntity: {
            Address: "0x3d4d30",
            Type: "UInt64"
        },
        LaraBehaviourFlags: {
            Address: "0x3d4bbc",
            Type: "Int8"
        },
        LaraClimbState: {
            Address: "0x3d4b8e",
            Type: "Int16"
        },
        PlayerOxygen: {
            Address: "0x3d4b96",
            Type: "Int16"
        },
        LaraCircleShadow: {
            Address: "0x3d4d30",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30"
        },
        LaraBasicData: {
            Address: "0x3d4d30",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraGunFlags: {
            Address: "0x3d4bc0",
            Type: "UInt16"
        },
        LaraGunType: {
            Address: "0x3d4b84",
            Type: "Int32"
        },
        LaraAimingEnemy: {
            Address: "0x3d4c70",
            Type: "UInt64"
        },
        LaraAimingYaw: {
            Address: "0x3d4c78",
            Type: "Int16"
        },
        LaraAimingPitch: {
            Address: "0x3d4c7a",
            Type: "Int16"
        },
        LaraAimingLeft: {
            Address: "0x3d4c9c",
            Type: "Int16"
        },
        LaraAimingRight: {
            Address: "0x3d4cb4",
            Type: "Int16"
        },
        RoomType: {
            Address: "0x3d4b8c",
            Type: "Int16"
        },
        LaraHairLeftX: {
            Address: "0x40d7a0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1bdb8c",
            Type: "Int16"
        },
        UiDrawX: {
            Address: "0x361b58",
            Type: "Int32"
        },
        UiDrawWidth: {
            Address: "0x361b5c",
            Type: "Int32"
        },
        UiDrawHeight: {
            Address: "0x361ba0",
            Type: "Int32"
        },
        UiResWidth: {
            Address: "0x361b90",
            Type: "Int32"
        },
        UiResHeight: {
            Address: "0x361b94",
            Type: "Int32"
        },
        CameraFixedX: {
            Address: "0x361bcc",
            Type: "Int32"
        },
        CameraFixedY: {
            Address: "0x361bdc",
            Type: "Int32"
        },
        CameraFixedZ: {
            Address: "0x361bec",
            Type: "Int32"
        },
        CameraX: {
            Address: "0x36136c",
            Type: "Int32"
        },
        CameraY: {
            Address: "0x36137c",
            Type: "Int32"
        },
        CameraZ: {
            Address: "0x36138c",
            Type: "Int32"
        },
        CameraYaw: {
            Address: "0x361b4e",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x361b4c",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x361bc0",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x361bc4",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x361bc8",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x361bd0",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x361bd4",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x361bd8",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x361be0",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x361be4",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x361be8",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x361b98",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x1912dc",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x3d4ba8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4bef88",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x494114",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x494f60",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x494090",
            Type: "Int16"
        },
        OgModelsOffset: "0x48e640",
        OgModelsWeaponOffset: "0x4befa2",
        OgModelsAngwyOffset: "0x4c1ca2",
        OgModelsFace: "0x3d4c58",
        OgModelsLeftHand: "0x3d4c50",
        OgModelsRightHand: "0x3d4c38",
        OgModelsLeftPocket: "0x3d4bf0",
        OgModelsRightPocket: "0x3d4c08",
        OgModelsBackPocket: "0x3d4bac"
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
            Address: "0x2ae00",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: true
        },
        UpdateLighting: {
            Address: "0xe2e10",
            Params: ['int', 'int', 'int', 'int', 'pointer'],
            Return: 'void'
        },
        LoadedLevel: {
            Address: "0x3ccf0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer'
        },
        LoadLevelAssets: {
            Address: "0xae7b0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xf1df0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x49d40",
            Params: [],
            Return: 'int',
            Disable: false
        },
        Menu: {
            Address: "0x4cab0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x13f860",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x10d680",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xd50a0",
            Params: ['int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xd5f20",
            Params: ['int', 'int', 'int', 'int', 'uint64', 'uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xee110",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x537d0",
            Params: ['int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2a820",
            Params: ['pointer', 'pointer', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        CalculateYawPitch: {
            Address: "0xf6410",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        TraceLineOfSight: {
            Address: "0xd4760",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeX: {
            Address: "0xd43a0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        TraceRangeZ: {
            Address: "0xd3fe0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x6a410",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        OnDamage: {
            Address: "0xc4700",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        SimulateLaraHair: {
            Address: "0xd1130",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        EntityGrenade: {
            Address: "0x650f0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityRocket: {
            Address: "0x64040",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        EntityHarpoon: {
            Address: "0x633a0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        CreateGraphic: {
            Address: "0x318f0",
            Params: ['int', 'int', 'int', 'int', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x530a0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetEntityBox: {
            Address: "0xcfbc0",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RecordWorldState: {
            Address: "0xa37f0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RestoreWorldState: {
            Address: "0xa4430",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        ProcessDemo: {
            Address: "0xcded0",
            Params: [],
            Return: 'void',
        },
        CanInterpolateCamera: {
            Address: "0xf6140",
            Params: [],
            Return: 'int',
            Disable: true,
        },
        LoadOutfits: {
            Address: "0x10c110",
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