/** tomb3.dll */
module.exports = {
    /** tomb3.dll draw/graphics */
    uiLayer: 0x39,
    
    /** tomb3.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x18e69c",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x18e690",
            Type: "Int32"
        },
        LaraId: {
            Address: "0x3a1ec0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x3a2070",
            Type: "UInt64"
        },
        LaraFlags: {
            Address: "0x3a2070",
            Type: "Int16",
            Pointer: "0x1e4"
        },
        LaraBehaviourFlags: {
            Address: "0x3A1Efc",
            Type: "Int8"
        },
        LaraClimbState: {
            Address: "0x3a1ece",
            Type: "Int16"
        },
        LaraHealth: {
            Address: "0x3a2070",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x3a1ed6",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x3a2070",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x3a2070",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x3a2070",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x3a2070",
            Type: "Int16",
            Pointer: "0x1a"
        },
        LaraBones: {
            Address: "0x3a2070",
            Type: "Block",
            Pointer: "0x820",
            Size: "0x2e0"
        },
        LaraPositions: { 
            Address: "0x3a2070",
            Type: "Block",
            Pointer: "0x58",
            Size: "0x10"
        },
        LaraCircleShadow: { 
            Address: "0x3a2070",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30"
        },
        LaraBasicData: {
            Address: "0x3a2070",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28"
        },
        LaraRoomId: {
            Address: "0x3a2070",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraGunFlags: {
            Address: "0x3a1f00",
            Type: "UInt16"
        },
        LaraGunType: {
            Address: "0x3a1ec4",
            Type: "Int32"
        },
        LaraAimingEnemy: {
            Address: "0x3a1fb0",
            Type: "UInt64"
        },
        LaraAimingYaw: {
            Address: "0x3a1fb8",
            Type: "Int16"
        },
        LaraAimingPitch: {
            Address: "0x3a1fba",
            Type: "Int16"
        },
        LaraAimingLeft: {
            Address: "0x3a1fdc",
            Type: "Int16"
        },
        LaraAimingRight: {
            Address: "0x3a1ff4",
            Type: "Int16"
        },
        RoomType: {
            Address: "0x3a1ecc",
            Type: "Int16"
        },
        LaraHairLeftX: {
            Address: "0x3daac0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x18ec5c",
            Type: "Int16"
        },
        UiDrawX: {
            Address: "0x32f298",
            Type: "Int32"
        },
        UiDrawWidth: {
            Address: "0x32f29c",
            Type: "Int32"
        },
        UiDrawHeight: {
            Address: "0x32f2e0",
            Type: "Int32"
        },
        UiResWidth: {
            Address: "0x32f2d0",
            Type: "Int32"
        },
        UiResHeight: {
            Address: "0x32f2d4",
            Type: "Int32"
        },
        CameraFixedX: { 
            Address: "0x32f30c",
            Type: "Int32"
        },
        CameraFixedY: {
            Address: "0x32f31c",
            Type: "Int32"
        },
        CameraFixedZ: { 
            Address: "0x32f32c",
            Type: "Int32"
        },
        CameraX: { 
            Address: "0x32eaac",
            Type: "Int32"
        },
        CameraY: {
            Address: "0x32eabc",
            Type: "Int32"
        },
        CameraZ: {
            Address: "0x32eacc",
            Type: "Int32"
        },
        CameraYaw: { 
            Address: "0x32f28e",
            Type: "UInt16"
        },
        CameraPitch: { 
            Address: "0x32f28c",
            Type: "UInt16"
        },
        CameraRightX: {
            Address: "0x32f300",
            Type: "Int32"
        },
        CameraRightY: {
            Address: "0x32f304",
            Type: "Int32"
        },
        CameraRightZ: {
            Address: "0x32f308",
            Type: "Int32"
        },
        CameraUpX: {
            Address: "0x32f310",
            Type: "Int32"
        },
        CameraUpY: {
            Address: "0x32f314",
            Type: "Int32"
        },
        CameraUpZ: {
            Address: "0x32f318",
            Type: "Int32"
        },
        CameraForwardX: {
            Address: "0x32f320",
            Type: "Int32"
        },
        CameraForwardY: {
            Address: "0x32f324",
            Type: "Int32"
        },
        CameraForwardZ: {
            Address: "0x32f328",
            Type: "Int32"
        },
        CameraFov: { 
            Address: "0x32f2d8",
            Type: "Int32"
        },
        IsInGameScene: {
            Address: "0x1682dc",
            Type: "Int32"
        },
        VehicleId: {
            Address: "0x3a1ee8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x48b168",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x460310",
            Type: "Int16"
        },
        Rooms: {
            Address: "0x461140",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x460290",
            Type: "Int16"
        },
        OgModelsOffset: "0x45a8a0",
        OgModelsWeaponOffset: "0x48b182",
        OgModelsAngwyOffset: "0x48de5a",
        OgModelsFace: "0x3a1f98",
        OgModelsLeftHand: "0x3a1f90",
        OgModelsRightHand: "0x3a1f78",
        OgModelsLeftPocket: "0x3a1f30",
        OgModelsRightPocket: "0x3a1f48",
        OgModelsBackPocket: "0x3a1eec"
    },
    
    /** tomb3.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x29c50",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        UpdatePhotoMode: {
            Address: "0xfaac0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        UpdateLighting: {
            Address: "0xd76c0",
            Params: ['int','int','int','int','pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x106180",
            Params: ['pointer', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        LaraInLevel: {
            Address: "0x752a0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xe6410",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x48a20",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Menu: {
            Address: "0x4b510",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x129ba0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xfd5b0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xc9710",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xca5a0",
            Params: ['int','int','int','int','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xe2790",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x51e80",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x296f0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0xe7920",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0xc8e80",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0xc8ac0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0xc8700",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x682d0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0xbc460",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0xc5830",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ProcessGrenade: {
            Address: "0x631b0",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        ProcessRocket: {
            Address: "0x62120",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        ProcessHarpoon: {
            Address: "0x61500",
            Params: ['int16'],
            Return: 'void',
            Disable: true,
        },
        ModernGfx: {
            Address: "0x30740",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x51830",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetBox: {
            Address: "0xc42d0",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
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