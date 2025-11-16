/** tomb5.dll */
module.exports = {
    /** tomb5.dll draw/graphics */
    uiLayer: 0x41,

    /** tomb5.dll variables */
    variables: {
        OutfitsLaraHairYoung: {
            Address: "0x1ac390",
            Type: "UInt64"
        },
        OutfitsLaraHairOld: {
            Address: "0x1ac3f0",
            Type: "UInt64"
        },
        OutfitsLaraSomeBasePointer: {
            Address: "0x6a6460",
            Type: "UInt64"
        },
        OutfitsPointer: {
            Address: "0x11f380",
            Type: "UInt64"
        },
        FacesPointer: {
            Address: "0x11f8f0",
            Type: "UInt64"
        },
        BinaryTick: {
            Address: "0x1ad7ec",
            Type: "Int8"
        },
        LevelChange: {
            Address: "0x64e1f0",
            Type: "Int32"
        },
        ReturnToMainMenu: {
            Address: "0x1ad794",
            Type: "Int8",
        },
        NewGamePlus: {
            Address: "0x6522b8",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x4e5140",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x4e5300",
            Type: "UInt64"
        },
        LaraHealth: {
            Address: "0x4e5300",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x4e5156",
            Type: "Int16"
        },
        LaraPoisoned: {
            Address: "0x4e5172",
            Type: "Int16"
        },
        PoisonFactor: {
            Address: "0x1ad7bc",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x4e5300",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x4e5300",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x4e5300",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x4e5300",
            Type: "Int16",
            Pointer: "0x1a"
        },
        Rooms: {
            Address: "0x652268",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x64e930",
            Type: "Int16"
        },
        LaraBones: {
            Address: "0x4e5300",
            Type: "Block",
            Pointer: "0x1e98",
            Size: "0x2f0",
        },
        LaraPositions: {
            Address: "0x4e5300",
            Type: "Block",
            Pointer: "0x60",
            Size: "0x10",
        },
        LaraCircleShadow: {
            Address: "0x1a9bc0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0xc",
        },
        LaraBasicData: {
            Address: "0x4e5300",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x4e5300",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraClimbState: {
            Address: "0x4E514E",
            Type: "Int16"
        },
        LaraBehaviousFlags: {
            Address: "0x4E5184",
            Type: "Int8"
        },
        LaraHairLeftX: {
            Address: "0x4e9600",
            Type: "Int32",
        },
        LaraHairRightX: {
            Address: "0x4E9CAC",
            Type: "Int32",
        },
        LaraGunFlagsLeft: {
            Address: "0x4e5244",
            Type: "Int16",
        },
        LaraGunFlagsRight: {
            Address: "0x4e525c",
            Type: "Int16",
        },
        LaraGunType: {
            Address: "0x4e5144",
            Type: "Int16",
        },
        LaraAimingEnemy: {
            Address: "0x4e5210",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x4e5218",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x4e521a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x4e523c",
            Type: "Int16",
        },
        LaraScopeActive: {
            Address: "0x1ad834",
            Type: "Int32",
        },
        LaraScopeYaw: {
            Address: "0x4e5220",
            Type: "Int16",
        },
        LaraScopePitch: {
            Address: "0x4e5222",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x4e5254",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x4e514c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x4e6290",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x4e6294",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x4e62b4",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x4e62d8",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x4e62dc",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x4e634c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x4e635c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x4e636c",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x1a9a70",
            Type: "Int32",
            Pointer: "0xc"
        },
        CameraY: {
            Address: "0x1a9a70",
            Type: "Int32",
            Pointer: "0x10"
        },
        CameraZ: {
            Address: "0x1a9a70",
            Type: "Int32",
            Pointer: "0x14"
        },
        CameraYaw: {
            Address: "0x4e62ae",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x4e62ac",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x4e6340",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x4e6344",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x4e6348",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x4e6350",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x4e6354",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x4e6358",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x4e6360",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x4e6364",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x4e6368",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x4e62e0",
            Type: "Int32",
        },
        Entities: {
            Address: "0x6607e8",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x64e934",
            Type: "Int16"
        },
        Guns: {
            Address: "0x1a8f10",
            Type: "Int8"
        },
        OgModelsOffset: "0x652270",
        OgModelsWeaponOffset: "0x68a802",
        OgModelsAngwyOffset: "0x693c22",
        OgModelsFace: "0x4e5208",
        OgModelsLeftHand: "0x4e5200",
        OgModelsRightHand: "0x4e51e8",
        OgModelsLeftPocket: "0x4e5260",
        OgModelsRightPocket: "0x4e5261",
        OgModelsBackPocket: "0x4e516c",
    },

    /** tomb5.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x2edf0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true,
        },
        ApplySettings: {
            Address: "0xe85d0",
            Params: ['pointer', 'pointer'],
            Return: 'void',
            Disable: false,
        },
        LoadedLevel: {
            Address: "0xf3740",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LaraInLevel: {
            Address: "0x81c20",
            Params: ['int'],
            Return: 'void',
            Disable: false,
        },
        SoundEffect: {
            Address: "0xa0fe0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        ProcessFreeaim: {
            Address: "0x13350",
            Params: ['pointer', 'pointer', 'int', 'int'],
            Return: 'void',
            Disable: false,
        },
        DetectHit: {
            Address: "0x9ca80",
            Params: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'int'],
            Return: 'int',
            Disable: false,
        },
        RenderUI: {
            Address: "0xdcf70",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Clone: {
            Address: "0x113ac0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false,
        },
        RenderText: {
            Address: "0xdcdb0",
            Params: ['int', 'int', 'int', 'pointer', 'int'],
            Return: 'pointer',
            Disable: false,
        },
        DrawSetup: {
            Address: "0xa2030",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false,
        },
        DrawRect: {
            Address: "0xa2b50",
            Params: ['float','float','float','float','uint64','uint64'],
            Return: 'void',
            Disable: false,
        },
        RoomChange: {
            Address: "0x448d0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false,
        },
        RenderEntity: {
            Address: "0x2fcb0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false,
        },
        GetRelYawPitch: {
            Address: "0x9e500",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false,
        },
        GetLOS: {
            Address: "0x12d00",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false,
        },
        GetRangeH: {
            Address: "0x12940",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false,
        },
        GetRangeV: {
            Address: "0x12580",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false,
        },
        CheckAim: {
            Address: "0x59be0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false,
        },
        DealDmg: {
            Address: "0x5a540",
            Params: ['pointer', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false,
        },
        ModernGfx: {
            Address: "0x31eb0",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false,
        },
        GetBox: {
            Address: "0x990b0",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false,
        },
        RemoveEntity: {
            Address: "0x44310",
            Params: ['int'],
            Return: 'void',
            Disable: false,
        },
        AttachLaraHair: {
            Address: "0xe55f0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ResetLaraHair: {
            Address: "0xe4df0",
            Params: [],
            Return: 'void',
            Disable: false
        }
    },

    /** tomb5.dll sounds */
    sounds: {
        "static_sounds": [
            "0x2", //-- No
            "0xe", //-- silent shot
            "0x74", //-- heal
            "0x79", //-- shoot revolver
            "0x139", //-- zoom lasrsight
            "0x7d", //-- fire grenade
            "0xeb", //-- fire dart
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
            "0xd1", //-- swim suit
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
            "0x28", //-- lara grunt
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
            "0x44", //-- hk shoot
            "0x45", //-- hk shoot
            "0x46", //-- death
            "0x47", //-- throw flare
            "0x48", //-- death
            "0x5d", //--
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
            "0x156", //-- pull chain
            "0x15f", //-- rope swing
            "0x148", //-- lever
            "0x152", //-- lever
            "0x154", //-- pole climb
            "0x153", //-- pole climb
            "0x171", //-- button
            "0x172", //-- crawl jump
            "0x192", //-- flare
        ],
    }
};
