/** tomb4.dll */
module.exports = {
    /** tomb4.dll draw/graphics */
    uiLayer: 0x41,

    /** tomb4.dll variables */
    variables: {
        OutfitsLaraHairYoung: {
            Address: "0x1b2a30",
            Type: "UInt64"
        },
        OutfitsLaraHairOld: {
            Address: "0x1b2a90",
            Type: "UInt64"
        },
        OutfitsLaraSomeBasePointer: {
            Address: "0x6ab1a0",
            Type: "UInt64"
        },
        OutfitsPointer: {
            Address: "0x124730",
            Type: "UInt64"
        },
        FacesPointer: {
            Address: "0x124c70",
            Type: "UInt64"
        },
        BinaryTick: {
            Address: "0x1B3DFC",
            Type: "Int8"
        },
        LevelChange: {
            Address: "0x655944",
            Type: "Int32"
        },
        ReturnToMainMenu: {
            Address: "0x1b3db0",
            Type: "Int8",
        },
        NewGamePlus: {
            Address: "0x683ab8",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x4eb940",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x4ebb00",
            Type: "UInt64"
        },
        LaraHealth: {
            Address: "0x4ebb00",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x4EB956",
            Type: "Int16"
        },
        LaraPoisoned: {
            Address: "0x4EB972",
            Type: "Int16"
        },
        PoisonFactor: {
            Address: "0x1b3d88",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x4ebb00",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x4ebb00",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x4ebb00",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x4ebb00",
            Type: "Int16",
            Pointer: "0x1a"
        },
        Rooms: {
            Address: "0x659848",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x656090",
            Type: "Int16"
        },
        LaraBones: {
            Address: "0x4ebb00",
            Type: "Block",
            Pointer: "0x1e98",
            Size: "0x2f0",
        },
        LaraPositions: {
            Address: "0x4ebb00",
            Type: "Block",
            Pointer: "0x60",
            Size: "0x10",
        },
        LaraCircleShadow: {
            Address: "0x1b0bb0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0xc",
        },
        LaraBasicData: {
            Address: "0x4ebb00",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x4ebb00",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraClimbState: {
            Address: "0x4EB94E",
            Type: "Int16"
        },
        LaraBehaviousFlags: {
            Address: "0x4EB984",
            Type: "Int8"
        },
        LaraHairLeftX: {
            Address: "0x6336e0",
            Type: "Int32",
        },
        LaraHairRightX: {
            Address: "0x633d8c",
            Type: "Int32",
        },
        LaraGunFlagsLeft: {
            Address: "0x4eba44",
            Type: "Int16",
        },
        LaraGunFlagsRight: {
            Address: "0x4eba5c",
            Type: "Int16",
        },
        LaraGunType: {
            Address: "0x4EB944",
            Type: "Int16",
        },
        LaraAimingEnemy: {
            Address: "0x4eba10",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x4eba18",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x4eba1a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x4eba3c",
            Type: "Int16",
        },
        LaraScopeActive: {
            Address: "0x1b3e40",
            Type: "Int32",
        },
        LaraScopeYaw: {
            Address: "0x4eba20",
            Type: "Int16",
        },
        LaraScopePitch: {
            Address: "0x4eba22",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x4eba54",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x4eb94c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x48d23c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x48d29c",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x48d2a0",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x48d2bc",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x48d2c0",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x48d32c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x48D33C",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x48D34C",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x1afd10",
            Type: "Int32",
            Pointer: "0xc"
        },
        CameraY: {
            Address: "0x1afd10",
            Type: "Int32",
            Pointer: "0x10"
        },
        CameraZ: {
            Address: "0x1afd10",
            Type: "Int32",
            Pointer: "0x14"
        },
        CameraYaw: {
            Address: "0x48D28E",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x48D28C",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x48D320",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x48D324",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x48D328",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x48D330",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x48D334",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x48D338",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x48D340",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x48D344",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x48D348",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x48d2c4",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x4eb966",
            Type: "Int16"
        },
        Entities: {
            Address: "0x68f520",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x656094",
            Type: "Int16"
        },
        Guns: {
            Address: "0x1aed00",
            Type: "Int8"
        },
        OgModelsOffset: "0x659778",
        OgModelsWeaponOffset: "0x68f542",
        OgModelsAngwyOffset: "0x698962",
        OgModelsFace: "0x4eba08",
        OgModelsLeftHand: "0x4EBA00",
        OgModelsRightHand: "0x4EB9E8",
        OgModelsLeftPocket: "0x4EBA60",
        OgModelsRightPocket: "0x4eba61",
        OgModelsBackPocket: "0x4EB96C",
    },

    /** tomb4.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x2d990",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        ApplySettings: {
            Address: "0xeb900",
            Params: ['pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0xf7fe0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LaraInLevel: {
            Address: "0xf8d90",
            Params: ['int'],
            Return: 'void',
            Disable: false,
        },
        SoundEffect: {
            Address: "0xced60",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        ProcessGrenade: {
            Address: "0x54c90",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        ProcessHarpoon: {
            Address: "0x56410",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        ProcessFreeaim: {
            Address: "0x15060",
            Params: ['pointer', 'pointer', 'int', 'int'],
            Return: 'void',
            Disable: false,
        },
        DetectHit: {
            Address: "0xa4360",
            Params: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'int'],
            Return: 'int',
            Disable: false,
        },
        RenderUI: {
            Address: "0xe6060",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Clone: {
            Address: "0x1182b0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false,
        },
        RenderText: {
            Address: "0xe5ea0",
            Params: ['int', 'int', 'int', 'pointer', 'int'],
            Return: 'pointer',
            Disable: false,
        },
        DrawSetup: {
            Address: "0xadff0",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false,
        },
        DrawRect: {
            Address: "0xaeb10",
            Params: ['float','float','float','float','uint64','uint64'],
            Return: 'void',
            Disable: false,
        },
        RoomChange: {
            Address: "0x3edf0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false,
        },
        RenderEntity: {
            Address: "0x2e4c0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false,
        },
        GetRelYawPitch: {
            Address: "0xd0b70",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false,
        },
        GetLOS: {
            Address: "0x14a40",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false,
        },
        GetRangeH: {
            Address: "0x14680",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false,
        },
        GetRangeV: {
            Address: "0x142c0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false,
        },
        CheckAim: {
            Address: "0x5bc20",
            Params: ['pointer'],
            Return: 'void',
            Disable: false,
        },
        DealDmg: {
            Address: "0x98220",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false,
        },
        ModernGfx: {
            Address: "0x30c10",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false,
        },
        GetBox: {
            Address: "0xa0980",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false,
        },
        RemoveEntity: {
            Address: "0x3e770",
            Params: ['int'],
            Return: 'void',
            Disable: false,
        },
        AttachLaraHair: {
            Address: "0xe80b0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ResetLaraHair: {
            Address: "0xe78b0",
            Params: [],
            Return: 'void',
            Disable: false
        }
    },

    /** tomb4.dll sounds */
    sounds: {
        "static_sounds": [
            "0x2", //-- No
            "0x74", //-- heal
            "0x7d", //-- fire grenade
            "0xeb", //-- fire dart
            "0x79", //-- shoot revolver
            "0x173", //-- zoom lasrsight
            "0x69", //-- fire
            "0x44", //-- fire
        ],
        "lara_sounds": [
            "0x0", //-- footstep
            "0x1", //--
            "0x2", //-- No
            "0x3", //-- slide
            "0x4", //-- land
            "0x5", //-- lara noise
            "0x6", //-- draw gun
            "0x7", //-- holster gun
            "0x8", //-- fire gun
            "0x9", //-- fire gun
            "0xd", //-- climb/grunt
            "0xc3", //-- car door
            "0xc4", //-- car door
            "0xca", //-- car bump
            "0xcb", //-- car bump
            "0xc9", //-- car bump
            "0xf0", //-- pull lever
            "0x1a", //-- climb
            "0x1b", //-- bonk
            "0x1c", //-- shimmy
            "0x1d", //-- jump
            "0x11", //-- footstep water
            "0x12", //-- footstep water
            "0x18", //-- lara noise
            "0x2a", //-- deadge
            "0x2b", //-- uzi fire
            "0x2c", //-- uzi fire
            "0x2d", //-- shotgun fire
            "0x2e", //-- button
            "0x20", //-- roll
            "0x21", //-- splash/swim
            "0x22", //-- splash/swim
            "0x23", //-- splash/swim
            "0x24", //-- splash/swim
            "0x25", //-- splash/swim
            "0x27", //-- key lock
            "0x2f", //-- lara grunt
            "0x3e", //-- pickup
            "0x34", //-- splash/swim
            "0x36", //-- climb down (ledge)
            "0x39", //-- turn mechanism
            "0x1e", //-- scream
            "0x1f", //-- owch
            "0x35", //-- death
            "0x37", //-- grab ledge
            "0x38", //-- grab ledge
            "0x3d", //-- underwater lever
            "0x40", //-- open door
            "0x46", //-- death
            "0x47", //-- throw flare
            "0x48", //-- death
            "0x69", //-- fire pistol
            "0x75", //-- climb vine
            "0x79", //-- fire revolver
            "0x8f", //-- death/land
            "0x82", //-- bike bump
            "0x86", //-- bike bump
            "0x87", //-- bike bump
            "0x89", //-- bike bump
            "0x91", //-- death/land
            "0x11d", //-- flare
            "0x120", //-- out of water
            "0x122", //-- footstep terrain
            "0x123", //-- footstep terrain
            "0x124", //-- footstep terrain
            "0x125", //-- footstep terrain
            "0x126", //-- footstep terrain
            "0x151", //-- lever
            "0x148", //-- lever
            "0x152", //-- lever
            "0x154", //-- pole climb
            "0x153", //-- pole climb
            "0x15f", //-- rope swing
            "0x172", //-- crawl jump
        ]
    }
};
