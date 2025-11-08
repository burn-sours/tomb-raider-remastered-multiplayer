/** tomb4.dll */
module.exports = {
    /** tomb4.dll variables */
    variables: {
        OutfitsLaraHairYoung: {
            Address: "0x1bad70",
            Type: "UInt64"
        },
        OutfitsLaraHairOld: {
            Address: "0x1badd0",
            Type: "UInt64"
        },
        OutfitsLaraSomeBasePointer: {
            Address: "0x6b6860",
            Type: "UInt64"
        },
        BinaryTick: {
            Address: "0x1bc144",
            Type: "Int8"
        },
        LevelChange: {
            Address: "0x661004",
            Type: "Int32"
        },
        LaraId: {
            Address: "0x4f3d80",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x4f3f40",
            Type: "UInt64"
        },
        LaraHealth: {
            Address: "0x4f3f40",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x4f3d96",
            Type: "Int16"
        },
        LaraPoisoned: {
            Address: "0x4f3db2",
            Type: "Int16"
        },
        PoisonFactor: {
            Address: "0x1bc0c8",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x4f3f40",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x4f3f40",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x4f3f40",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x4f3f40",
            Type: "Int16",
            Pointer: "0x1a"
        },
        Rooms: {
            Address: "0x664f08",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x661750",
            Type: "Int16"
        },
        LaraBones: {
            Address: "0x4f3f40",
            Type: "Block",
            Pointer: "0x1e98",
            Size: "0x2f0",
        },
        LaraPositions: {
            Address: "0x4f3f40",
            Type: "Block",
            Pointer: "0x60",
            Size: "0x10",
        },
        LaraCircleShadow: {
            Address: "0x1b8cd0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0xc",
        },
        LaraBasicData: {
            Address: "0x4f3f40",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x4f3f40",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraClimbState: {
            Address: "0x4f3d8e",
            Type: "Int16"
        },
        LaraBehaviousFlags: {
            Address: "0x4f3dc4",
            Type: "Int8"
        },
        LaraHairLeftX: {
            Address: "0x63eda0",
            Type: "Int32",
        },
        LaraHairRightX: {
            Address: "0x63F44C",
            Type: "Int32",
        },
        LaraGunFlagsLeft: {
            Address: "0x4f3e84",
            Type: "Int16",
        },
        LaraGunFlagsRight: {
            Address: "0x4f3e9c",
            Type: "Int16",
        },
        LaraGunType: {
            Address: "0x4f3d84",
            Type: "Int16",
        },
        LaraAimingEnemy: {
            Address: "0x4f3e50",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x4f3e58",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x4f3e5a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x4f3e7c",
            Type: "Int16",
        },
        LaraScopeActive: {
            Address: "0x1bc188",
            Type: "Int32",
        },
        LaraScopeYaw: {
            Address: "0x4f3e60",
            Type: "Int16",
        },
        LaraScopePitch: {
            Address: "0x4f3e62",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x4f3e94",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x4f3d8c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x49569c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x4956fc",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x495700",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x49571c",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x495720",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x49578c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x49579c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x4957ac",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x1b7d10",
            Type: "Int32",
            Pointer: "0xc"
        },
        CameraY: {
            Address: "0x1b7d10",
            Type: "Int32",
            Pointer: "0x10"
        },
        CameraZ: {
            Address: "0x1b7d10",
            Type: "Int32",
            Pointer: "0x14"
        },
        CameraYaw: {
            Address: "0x4956ee",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x4956ec",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x495780",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x495784",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x495788",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x495790",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x495794",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x495798",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x4957A0",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x4957A4",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x4957A8",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x495724",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x4f3da6",
            Type: "Int16"
        },
        Entities: {
            Address: "0x69abe0",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x661754",
            Type: "Int16"
        },
        Guns: {
            Address: "0x1b6d00",
            Type: "Int8"
        },
        OgModelsOffset: "0x664e38",
        OgModelsWeaponOffset: "0x69ac02",
        OgModelsAngwyOffset: "0x6a4022",
        OgModelsFace: "0x4f3e48",
        OgModelsLeftHand: "0x4f3e40",
        OgModelsRightHand: "0x4f3e28",
        OgModelsLeftPocket: "0x4f3ea0",
        OgModelsRightPocket: "0x4f3ea1",
        OgModelsBackPocket: "0x4f3dac",
    },
    
    /** tomb4.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x2f420",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        ApplySettings: {
            Address: "0xf35b0",
            Params: ['pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0x1005c0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        LaraInLevel: {
            Address: "0x87e70",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xd43d0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        ProcessGrenade: {
            Address: "0x56b20",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ProcessHarpoon: {
            Address: "0x582a0",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ProcessFreeaim: {
            Address: "0x15440",
            Params: ['pointer', 'pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        DetectHit: {
            Address: "0xa76d0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0xedd70",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Clone: {
            Address: "0x120ee0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        RenderText: {
            Address: "0xedbb0",
            Params: ['int', 'int', 'int', 'pointer', 'int'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xb2410",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xb2f30",
            Params: ['float','float','float','float','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x407b0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2fda0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0xd6540",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0x14e20",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0x14a60",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0x146a0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x5db60",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0x9b190",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        ModernGfx: {
            Address: "0x32240",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        GetBox: {
            Address: "0xa3d00",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x40130",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0xefdb0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ResetLaraHair: {
            Address: "0xef5b0",
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