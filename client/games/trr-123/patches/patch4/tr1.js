/** tomb1.dll */
module.exports = {
    /** tomb1.dll variables */
    variables: {
        BinaryTick: {
            Address: "0xf95b0",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0xF95A0",
            Type: "Int32"
        },
        LaraId: {
            Address: "0x30cca0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x30ce50",
            Type: "Int64"
        },
        LaraFlags: {
            Address: "0x30ce50",
            Type: "Int16",
            Pointer: "0x1e4"
        },
        LaraHealth: {
            Address: "0x30ce50",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x30CCB6",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x30ce50",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x30ce50",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x30ce50",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x30ce50",
            Type: "Int16",
            Pointer: "0x1a"
        },
        LaraBones: {
            Address: "0x30ce50",
            Type: "Block",
            Pointer: "0x820",
            Size: "0x2e0",
        },
        LaraPositions: {
            Address: "0x30ce50",
            Type: "Block",
            Pointer: "0x58",
            Size: "0x10",
        },
        LaraCircleShadow: {
            Address: "0x30ce50",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x30ce50",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x30ce50",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraGunFlags: {
            Address: "0x30cce0",
            Type: "UInt32",
        },
        LaraGunType: {
            Address: "0x30CCA2",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x30cd90",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x30cd98",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x30CD9A",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x30CDBC",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x30CDD4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x30CCAC",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3458a0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1003E0",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x29a05c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x29a078",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x29a138",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x29a0e4",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x29a0e8",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x29a080",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x29a084",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x29a088",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x29A10C",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x29A11C",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x29A12C",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x29a08e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x29a08c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x29A100",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x29A110",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x29A120",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x29A130",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0xDEA78",
            Type: "Int32",
        },
        Entities: {
            Address: "0x3edf98",
            Type: "Pointer",
        },
        EntitiesCount: {
             Address: "0x3ede50",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x3edf88",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x3EDE50",
            Type: "Int16"
        },
        OgModelsOffset: "0x3edc88",
        OgModelsWeaponOffset2: "0x3ef1b2",
        OgModelsWeaponOffset: "0x3edfc2",
        OgModelsAngwyOffset: "0x3F03A2",
        OgModelsFace: "0x30cd78",
        OgModelsLeftHand: "0x30cd70",
        OgModelsRightHand: "0x30cd58",
        OgModelsLeftPocket: "0x30cd10",
        OgModelsRightPocket: "0x30cd28",
        OgModelsBackPocket: "0x30cd40"
    },

    /** tomb1.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0xee40",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        UpdatePhotoMode: {
            Address: "0x6ca50",
            Params: [],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0x15ea0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        LaraInLevel: {
            Address: "0x2cac0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x78ff0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x19780",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Menu: {
            Address: "0x1b850",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x8e780",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x7be50",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x50460",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x51320",
            Params: ['int','int','int','int','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x62740",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x1eab0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0x664c0",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0x4fcc0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0x4f900",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0x4f540",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x26520",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0x436e0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        GetTileData: {
            Address: "0x9470",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        ActivateEntity: {
            Address: "0x2d0c0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0x4c8c0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        }
    },

    /** tomb1.dll sounds */
    sounds: {
        "static_sounds": [
            "0x2", //-- No
            "0x7", //-- holster
            "0x74", //-- heal
        ],
        "lara_sounds": [
            "0x0", //-- footstep
            "0x1", //-- grunt
            "0x3", //-- slide
            "0x4", //-- land
            "0x5", //-- climb
            "0x6", //-- draw guns
            "0x4008", //-- pistols new
            "0x402c", //-- magnums new
            "0x402d", //-- shotgun new
            "0x402b", //-- uzis new
            "0x9", //-- reload
            "0xa", //-- gun
            "0x1a", //-- climb
            "0x1b", //-- bonk
            "0x1c", //-- shimmy
            "0x1d", //-- jump
            "0x1e", //-- scream
            "0x1f", //-- arghhh
            "0x20", //-- roll
            "0x21", //-- dive
            "0x22", //-- swim
            "0x23", //-- swim
            "0x24", //-- swim
            "0x25", //-- glug glug
            "0x26", //-- lever down
            "0x27", //-- key hole
            "0x2a", //-- land death
            "0x2e", //-- eugheuhgueghe
            "0x2f", //-- eugheuhgueghe
            "0x33", //-- eugheuhgueghe
            "0x34", //-- swim float
            "0x35", //-- crunch dead
            "0x37", //-- grab ledge
            "0x38", //-- grab ledge
            "0x39", //-- lever up
            "0x3d", //-- lever water
            "0x3f", //-- eguheghghh
            "0x42", //-- crumble
            "0x91", //-- spike death
            "0x92", //-- boulder death
            "0x11", //-- splash
            "0x18", //--  crawling
            "0x36", //-- fall grab
        ]
    }
};
