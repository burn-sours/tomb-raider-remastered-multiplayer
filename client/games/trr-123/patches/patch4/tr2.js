/** tomb2.dll */
module.exports = {
    /** tomb2.dll draw/graphics */
    uiLayer: 0x39,

    /** tomb2.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x12ff54",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x12FF40",
            Type: "Int32"
        },
        LevelId: {
            Address: "0x12f9e8",
            Type: "Int32"
        },
        MenuSelection: {
            Address: "0x110fd4",
            Type: "UInt16"
        },
        MenuState: {
            Address: "0x4fad62",
            Type: "UInt16"
        },
        UseSaveSlot: {
            Address: "0x4f6e40",
            Type: "UInt64"
        },
        NewGamePlus: {
            Address: "0x4f7466",
            Type: "UInt8"
        },
        LaraId: {
            Address: "0x30eaa0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x342fc0",
            Type: "UInt64"
        },
        LaraHealth: {
            Address: "0x342fc0",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x30EAB6",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x342fc0",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x342fc0",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x342fc0",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x342fc0",
            Type: "Int16",
            Pointer: "0x1a"
        },
        LaraBones: {
            Address: "0x342fc0",
            Type: "Block",
            Pointer: "0x820",
            Size: "0x2e0",
        },
        LaraPositions: {
            Address: "0x342fc0",
            Type: "Block",
            Pointer: "0x58",
            Size: "0x10",
        },
        LaraCircleShadow: {
            Address: "0x342fc0",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x342fc0",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x342fc0",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraFlags: {
            Address: "0x342fc0",
            Type: "Int16",
            Pointer: "0x1e4"
        },
        LaraClimbState: {
            Address: "0x30EAAe",
            Type: "Int16",
        },
        LaraGunFlags: {
            Address: "0x30eae0",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x30EAA4",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x30eb90",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x30eb98",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x30eb9a",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x30ebbc",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x30ebd4",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x30EAAC",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x37ba20",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x130B34",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x2cf9ec",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x2CFA18",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x2CFAc4",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x2CFA50",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x2CFA54",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x2cfa6c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x2cfa7c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x2cfa8c",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x2cfa6c",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x2cfa7c",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x2cfa8c",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x2CFA0E",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x2CFA0C",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x2cfae0",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x2CFAF0",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x2CFB00",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x2CFA90",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x110E9C",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x30EAC8",
            Type: "Int16",
        },
        Entities: {
            Address: "0x4f6e20",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x3fa010",
           Type: "Int16"
        },
        Rooms: {
            Address: "0x4241c0",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x3FA010",
            Type: "Int16"
        },
        OgModelsOffset: "0x3f64b0",
        OgModelsWeaponOffset: "0x4241e2",
        OgModelsAngwyOffset: "0x426eba",
        OgModelsFace: "0x30eb78",
        OgModelsLeftHand: "0x30EB70",
        OgModelsRightHand: "0x30EB58",
        OgModelsLeftPocket: "0x30eb10",
        OgModelsRightPocket: "0x30EB28",
        OgModelsBackPocket: "0x30EACC"
    },

    /** tomb2.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x16b30",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        UpdatePhotoMode: {
            Address: "0xa6300",
            Params: [],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0x24210",
            Params: ['int', 'int', 'pointer', 'pointer'],
            Return: 'pointer',
            Disable: true
        },
        LaraInLevel: {
            Address: "0x559b0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0x96e30",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x35360",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Menu: {
            Address: "0x37580",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0xbe9e0",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xac5c0",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0x7ffd0",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0x80e90",
            Params: ['int','int','int','int','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0x92020",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RenderSkiidoo: {
            Address: "0x6d010",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RenderBoat: {
            Address: "0x16930",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x3c9b0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0x98340",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0x7f750",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0x7f390",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0x7efd0",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x49da0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0x763e0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0x7c430",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ProcessGrenade: {
            Address: "0x454c0",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ProcessHarpoon: {
            Address: "0x45000",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ModernGfx: {
            Address: "0x20870",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        OgGfxPrep: {
            Address: "0x3cb20",
            Params: ['int'],
            Return: 'uint64',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x3c370",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetBox: {
            Address: "0x7b930",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        GetTileData: {
            Address: "0xdb10",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        }
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
