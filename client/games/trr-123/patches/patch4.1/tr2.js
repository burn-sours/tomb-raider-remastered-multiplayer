/** tomb2.dll */
module.exports = {
    /** tomb2.dll draw/graphics */
    uiLayer: 0x39,
    
    /** tomb2.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x1330c8",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x1330b8",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x132b58",
            Type: "Int32"
        },
        MenuSelection: {
            Address: "0x113f14",
            Type: "UInt16"
        },
        MenuState: {
            Address: "0x4fdf02",
            Type: "UInt16"
        },
        UseSaveSlot: {
            Address: "0x4f9fe0",
            Type: "UInt64"
        },
        NewGamePlus: {
            Address: "0x4fa606",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x345fc0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x346170",
            Type: "UInt64"
        },
        LaraFlags: {
            Address: "0x346170",
            Type: "Int16",
            Pointer: "0x1e4"
        },
        LaraClimbState: {
            Address: "0x345fce",
            Type: "Int16"
        },
        LaraHealth: {
            Address: "0x346170",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x345fd6",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x346170",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x346170",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x346170",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x346170",
            Type: "Int16",
            Pointer: "0x1a"
        },
        LaraBones: {
            Address: "0x346170",
            Type: "Block",
            Pointer: "0x820",
            Size: "0x2e0", 
        },
        LaraPositions: { 
            Address: "0x346170",
            Type: "Block",
            Pointer: "0x58",
            Size: "0x10",
        },
        LaraCircleShadow: { 
            Address: "0x346170",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x346170",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x346170",
            Type: "Int16",
            Pointer: "0x1c"
        },
        Rooms: {
            Address: "0x427360",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x3fd1b0",
            Type: "Int16"
        },
        LaraGunFlags: {
            Address: "0x346000",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x345fc4",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x3460b0",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x3460b8",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x3460ba",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x3460dc",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x3460f4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x345fcc",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x37ebc0",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x1334c4",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x2D337C",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x2d3398",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x2d3444",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x2d33d0",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x2d33d4",
            Type: "Int32",
        },
        CameraFixedX: { 
            Address: "0x2d33ec",
            Type: "Int32",
        },
        CameraFixedY: { 
            Address: "0x2D33FC",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x2D340C",
            Type: "Int32",
        },
        CameraX: { 
            Address: "0x2d33ec",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x2D33FC",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x2D340C",
            Type: "Int32",
        },
        CameraYaw: { 
            Address: "0x2d336e",
            Type: "UInt16",
        },
        CameraPitch: { 
            Address: "0x2d336c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x2d2bc0",
            Type: "Int32",
        },
        CameraRightY: {
            Address: "0x2d2bc4",
            Type: "Int32",
        },
        CameraRightZ: {
            Address: "0x2d2bc8",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x2D2BD0",
            Type: "Int32",
        },
        CameraUpY: {
            Address: "0x2D2BD4",
            Type: "Int32",
        },
        CameraUpZ: {
            Address: "0x2D2BD8",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x2D2BE0",
            Type: "Int32",
        },
        CameraForwardY: {
            Address: "0x2D2BE4",
            Type: "Int32",
        },
        CameraForwardZ: {
            Address: "0x2D2BE8",
            Type: "Int32",
        },
        CameraFov: { 
            Address: "0x2d3410",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x1142ec",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x345fe8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4f9fc0",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x3FD1B4",
            Type: "Int16"
        },
        OgModelsOffset: "0x3f9650",
        OgModelsWeaponOffset: "0x427382",
        OgModelsAngwyOffset: "0x42a05a",
        OgModelsFace: "0x346098",
        OgModelsLeftHand: "0x346090",
        OgModelsRightHand: "0x346078",
        OgModelsLeftPocket: "0x346030",
        OgModelsRightPocket: "0x346048",
        OgModelsBackPocket: "0x345fec",
    },
    
    /** tomb2.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x169e0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        UpdatePhotoMode: {
            Address: "0xa7d40",
            Params: [],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0x244d0",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer',
            Disable: true
        },
        LaraInLevel: {
            Address: "0x556b0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x987d0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x34df0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Menu: {
            Address: "0x37010",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xd8fa0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xae090",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x80830",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x816c0",
            Params: ['int','int','int','int','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x93860",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkidoo: {
            Address: "0x6cde0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x167e0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3c4a0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0x99ce0",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0x7ffa0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0x7fbe0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0x7f820",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x49b90",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0x76150",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0x7cc80",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ProcessGrenade: {
            Address: "0x45310",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ProcessHarpoon: {
            Address: "0x44e70",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ModernGfx: {
            Address: "0x209c0",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        OgGfxPrep: {
            Address: "0x3c610",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3be70",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetBox: {
            Address: "0x7b720",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
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