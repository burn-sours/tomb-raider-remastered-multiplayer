/** tomb1.dll */
module.exports = {
    /** tomb1.dll draw/graphics */
    uiLayer: 0x39,
    
    /** tomb1.dll variables */
    variables: {
        BinaryTick: {
            Address: "0xfd760",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0xfd750",
            Type: "Int32"
        },
        LaraId: {
            Address: "0x310e80",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x311030",
            Type: "Int64"
        },
        LaraFlags: {
            Address: "0x311030",
            Type: "Int16",
            Pointer: "0x1e4"
        },
        LaraHealth: {
            Address: "0x311030",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x310E96",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x311030",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x311030",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x311030",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x311030",
            Type: "Int16",
            Pointer: "0x1a"
        },
        LaraBones: {
            Address: "0x311030",
            Type: "Block",
            Pointer: "0x820",
            Size: "0x2e0", 
        },
        LaraPositions: { 
            Address: "0x311030",
            Type: "Block",
            Pointer: "0x58",
            Size: "0x10",
        },
        LaraCircleShadow: { 
            Address: "0x311030",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x311030",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x311030",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraGunFlags: {
            Address: "0x310ec0",
            Type: "UInt32",
        },
        LaraGunType: {
            Address: "0x310e82",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x310f70",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x310F78",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x310F7a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x310F9C",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x310FB4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x310e8c",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x349a80",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0xfda2c",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x29e23c",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x29e258",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x29e318",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x29e2c4",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x29e2c8",
            Type: "Int32",
        },
        CameraFixedX: { 
            Address: "0x29e240",
            Type: "Int32",
        },
        CameraFixedY: { 
            Address: "0x29E244",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x29E248",
            Type: "Int32",
        },
        CameraX: { 
            Address: "0x29e2ec",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x29e2fc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x29E30C",
            Type: "Int32",
        },
        CameraYaw: { 
            Address: "0x29E26E",
            Type: "UInt16",
        },
        CameraPitch: { 
            Address: "0x29e26c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x29e2e0",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x29e2e4",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x29e2e8",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x29E2F0",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x29E2F4",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x29E2F8",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x29E300",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x29E304",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x29E308",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x29e310",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0xe2e50",
            Type: "Int32"
        },
        Entities: {
            Address: "0x3f2178",
            Type: "Pointer"
        },
        EntitiesCount: {
            Address: "0x3c1b20",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x3f2168",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x3f2030",
            Type: "Int16"
        },
        OgModelsOffset: "0x3f1e68",
        OgModelsWeaponOffset2: "0x3f3392",
        OgModelsWeaponOffset: "0x3f21a2",
        OgModelsAngwyOffset: "0x3f4582",
        OgModelsFace: "0x310f58",
        OgModelsLeftHand: "0x310f50",
        OgModelsRightHand: "0x310f38",
        OgModelsLeftPocket: "0x310ef0",
        OgModelsRightPocket: "0x310f08",
        OgModelsBackPocket: "0x310f20"
    },

    /** tomb1.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0xeeb0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        UpdatePhotoMode: {
            Address: "0x6f300",
            Params: [],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0x16070",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        LaraInLevel: {
            Address: "0x2d1c0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x7b6c0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x19c00",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Menu: {
            Address: "0x1bcf0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xa9a30",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0x7e570",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x51cc0",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x52b50",
            Params: ['int','int','int','int','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x64f90",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x1f010",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0x68e70",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0x514e0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0x51120",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0x50d60",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x26b60",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0x44460",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0x4df40",
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