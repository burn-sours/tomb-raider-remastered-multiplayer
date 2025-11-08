/** tomb5.dll */
module.exports = {
    /** tomb5.dll variables */
    variables: {
        OutfitsLaraHairYoung: {
            Address: "0x1b5720",
            Type: "UInt64"
        },
        OutfitsLaraHairOld: {
            Address: "0x1b5780",
            Type: "UInt64"
        },
        OutfitsLaraSomeBasePointer: {
            Address: "0x6b2d60",
            Type: "UInt64"
        },
        BinaryTick: {
            Address: "0x1b6b88",
            Type: "Int8"
        },
        LevelChange: {
            Address: "0x65aad0",
            Type: "Int32"
        },
        LaraId: {
            Address: "0x4ee680",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x4ee840",
            Type: "UInt64"
        },
        LaraHealth: {
            Address: "0x4ee840",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x4ee696",
            Type: "Int16"
        },
        LaraPoisoned: {
            Address: "0x4ee6b2",
            Type: "Int16"
        },
        PoisonFactor: {
            Address: "0x1b6b58",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x4ee840",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x4ee840",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x4ee840",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x4ee840",
            Type: "Int16",
            Pointer: "0x1a"
        },
        Rooms: {
            Address: "0x65eb68",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x65b230",
            Type: "Int16"
        },
        LaraBones: {
            Address: "0x4ee840",
            Type: "Block",
            Pointer: "0x1e98",
            Size: "0x2f0",
        },
        LaraPositions: {
            Address: "0x4ee840",
            Type: "Block",
            Pointer: "0x60",
            Size: "0x10",
        },
        LaraCircleShadow: {
            Address: "0x1b2c20",
            Type: "Block",
            Pointer: "0x0",
            Size: "0xc",
        },
        LaraBasicData: {
            Address: "0x4ee840",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraRoomId: {
            Address: "0x4ee840",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraClimbState: {
            Address: "0x4ee68e",
            Type: "Int16"
        },
        LaraBehaviousFlags: {
            Address: "0x4ee6c4",
            Type: "Int8"
        },
        LaraHairLeftX: {
            Address: "0x4f3960",
            Type: "Int32",
        },
        LaraHairRightX: {
            Address: "0x4F400C",
            Type: "Int32",
        },
        LaraGunFlagsLeft: {
            Address: "0x4ee784",
            Type: "Int16",
        },
        LaraGunFlagsRight: {
            Address: "0x4ee79c",
            Type: "Int16",
        },
        LaraGunType: {
            Address: "0x4ee684",
            Type: "Int16",
        },
        LaraAimingEnemy: {
            Address: "0x4ee750",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x4ee758",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x4ee75a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x4ee77c",
            Type: "Int16",
        },
        LaraScopeActive: {
            Address: "0x1b6bd4",
            Type: "Int32",
        },
        LaraScopeYaw: {
            Address: "0x4ee760",
            Type: "Int16",
        },
        LaraScopePitch: {
            Address: "0x4ee762",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x4ee794",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x4ee68c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x4ef7d0",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x4ef7d4",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x4ef7f4",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x4ef818",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x4ef81c",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x4ef88c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x4ef89c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x4ef8ac",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x1b2ad0",
            Type: "Int32",
            Pointer: "0xc"
        },
        CameraY: {
            Address: "0x1b2ad0",
            Type: "Int32",
            Pointer: "0x10"
        },
        CameraZ: {
            Address: "0x1b2ad0",
            Type: "Int32",
            Pointer: "0x14"
        },
        CameraYaw: {
            Address: "0x4ef7ee",
            Type: "UInt16"
        },
        CameraPitch: {
            Address: "0x4ef7ec",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x4ef880",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x4ef884",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x4ef888",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x4ef890",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x4ef894",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x4ef898",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x4EF8A0",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x4EF8A4",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x4EF8A8",
            Type: "Int32"
        },
        CameraFov: {
            Address: "0x4ef820",
            Type: "Int32"
        },
        Entities: {
            Address: "0x66d0e8",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x65b234",
            Type: "Int16"
        },
        Guns: {
            Address: "0x1b1f70",
            Type: "Int8"
        },
        OgModelsOffset: "0x65eb70",
        OgModelsWeaponOffset: "0x697102",
        OgModelsAngwyOffset: "0x6a0522",
        OgModelsFace: "0x4ee748",
        OgModelsLeftHand: "0x4ee740",
        OgModelsRightHand: "0x4ee728",
        OgModelsLeftPocket: "0x4ee7a0",
        OgModelsRightPocket: "0x4ee7a1",
        OgModelsBackPocket: "0x4ee6ac",
    },
    
    /** tomb5.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x30830",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        ApplySettings: {
            Address: "0xf0c30",
            Params: ['pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0xfc350",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        LaraInLevel: {
            Address: "0x84d70",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xa43c0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        ProcessFreeaim: {
            Address: "0x133a0",
            Params: ['pointer', 'pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        DetectHit: {
            Address: "0xa0150",
            Params: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0xe48c0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Clone: {
            Address: "0x11cd20",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        RenderText: {
            Address: "0xe4700",
            Params: ['int', 'int', 'int', 'pointer', 'int'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xa54c0",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xa5fe0",
            Params: ['float','float','float','float','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x46560",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x31680",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0xa1e60",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0x12d50",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0x12990",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0x125d0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x5beb0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0x5c810",
            Params: ['pointer', 'int', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        ModernGfx: {
            Address: "0x339b0",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        GetBox: {
            Address: "0x9c710",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x45fa0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0xedca0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ResetLaraHair: {
            Address: "0xed4a0",
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
        ]
    }
};