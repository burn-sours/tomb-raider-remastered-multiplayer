/** tomb3.dll */
module.exports = {
    /** tomb3.dll draw/graphics */
    uiLayer: 0x39,

    /** tomb3.dll variables */
    variables: {
        BinaryTick: {
            Address: "0x18a504",
            Type: "Int8"
        },
        LevelCompleted: {
            Address: "0x18A4E8",
            Type: "Int32"
        },
        LaraId: {
            Address: "0x39dce0",
            Type: "Int16"
        },
        LaraBase: {
            Address: "0x39de90",
            Type: "UInt64"
        },
        LaraHealth: {
            Address: "0x39de90",
            Type: "Int16",
            Pointer: "0x26"
        },
        LaraOxygen: {
            Address: "0x39DCF6",
            Type: "Int16"
        },
        LaraXZSpeed: {
            Address: "0x39de90",
            Type: "Int16",
            Pointer: "0x22"
        },
        LaraYSpeed: {
            Address: "0x39de90",
            Type: "Int16",
            Pointer: "0x24"
        },
        LaraAnim: {
            Address: "0x39de90",
            Type: "Int16",
            Pointer: "0x18"
        },
        LaraFrame: {
            Address: "0x39de90",
            Type: "Int16",
            Pointer: "0x1a"
        },
        LaraBones: {
            Address: "0x39de90",
            Type: "Block",
            Pointer: "0x820",
            Size: "0x2e0",
        },
        LaraPositions: {
            Address: "0x39de90",
            Type: "Block",
            Pointer: "0x58",
            Size: "0x10",
        },
        LaraCircleShadow: {
            Address: "0x39de90",
            Type: "Block",
            Pointer: "0xe20",
            Size: "0x30",
        },
        LaraBasicData: {
            Address: "0x39de90",
            Type: "Block",
            Pointer: "0x0",
            Size: "0x28",
        },
        LaraRoomId: {
            Address: "0x39de90",
            Type: "Int16",
            Pointer: "0x1c"
        },
        LaraFlags: {
            Address: "0x39de90",
            Type: "Int16",
            Pointer: "0x1e4"
        },
        LaraClimbState: {
            Address: "0x39DCEE",
            Type: "Int16",
        },
        LaraBehaviousFlags: {
            Address: "0x39DD1C",
            Type: "Int8",
        },
        LaraHairX: {
            Address: "0x3D8480",
            Type: "Int32",
        },
        LaraGunFlags: {
            Address: "0x39dd20",
            Type: "UInt16",
        },
        LaraGunType: {
            Address: "0x39DCE4",
            Type: "Int32",
        },
        LaraAimingEnemy: {
            Address: "0x39ddd0",
            Type: "UInt64",
        },
        LaraAimingYaw: {
            Address: "0x39ddd8",
            Type: "Int16",
        },
        LaraAimingPitch: {
            Address: "0x39ddda",
            Type: "Int16",
        },
        LaraAimingLeft: {
            Address: "0x39ddfc",
            Type: "Int16",
        },
        LaraAimingRight: {
            Address: "0x39de14",
            Type: "Int16",
        },
        RoomType: {
            Address: "0x39DCEC",
            Type: "Int16",
        },
        LaraHairLeftX: {
            Address: "0x3d8480",
            Type: "Int32",
        },
        UiTextsCount: {
            Address: "0x18FE08",
            Type: "Int16",
        },
        UiDrawX: {
            Address: "0x32b078",
            Type: "Int32",
        },
        UiDrawWidth: {
            Address: "0x32b07c",
            Type: "Int32",
        },
        UiDrawHeight: {
            Address: "0x32B0F0",
            Type: "Int32",
        },
        UiResWidth: {
            Address: "0x32B0E0",
            Type: "Int32",
        },
        UiResHeight: {
            Address: "0x32B0E4",
            Type: "Int32",
        },
        CameraFixedX: {
            Address: "0x32b12c",
            Type: "Int32",
        },
        CameraFixedY: {
            Address: "0x32b13c",
            Type: "Int32",
        },
        CameraFixedZ: {
            Address: "0x32b14c",
            Type: "Int32",
        },
        CameraX: {
            Address: "0x32a8cc",
            Type: "Int32",
        },
        CameraY: {
            Address: "0x32a8dc",
            Type: "Int32",
        },
        CameraZ: {
            Address: "0x32a8ec",
            Type: "Int32",
        },
        CameraYaw: {
            Address: "0x32b10e",
            Type: "UInt16",
        },
        CameraPitch: {
            Address: "0x32b10c",
            Type: "UInt16",
        },
        CameraRightX: {
            Address: "0x32b120",
            Type: "Int32",
        },
        CameraUpX: {
            Address: "0x32b130",
            Type: "Int32",
        },
        CameraForwardX: {
            Address: "0x32b140",
            Type: "Int32",
        },
        CameraFov: {
            Address: "0x32B0E8",
            Type: "Int32",
        },
        IsInGameScene: {
            Address: "0x16404C",
            Type: "Int32",
        },
        VehicleId: {
            Address: "0x39DD08",
            Type: "Int16",
        },
        Entities: {
            Address: "0x486f68",
            Type: "Pointer",
        },
        EntitiesCount: {
            Address: "0x45BD10",
           Type: "Int16"
        },
        Rooms: {
            Address: "0x45cb40",
            Type: "Pointer"
        },
        RoomsCount: {
            Address: "0x456C70",
            Type: "Int16"
        },
        OgModelsOffset: "0x451260",
        OgModelsWeaponOffset: "0x486f82",
        OgModelsAngwyOffset: "0x489C5A",
        OgModelsFace: "0x39DDB8",
        OgModelsLeftHand: "0x39DDB0",
        OgModelsRightHand: "0x39DD98",
        OgModelsLeftPocket: "0x39DD50",
        OgModelsRightPocket: "0x39DD68",
        OgModelsBackPocket: "0x39DD0C"
    },

    /** tomb3.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x298b0",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        UpdatePhotoMode: {
            Address: "0xf82e0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        UpdateLighting: {
            Address: "0xd59c0",
            Params: ['int','int','int','int','pointer'],
            Return: 'void',
            Disable: true
        },
        LoadedLevel: {
            Address: "0x1036b0",
            Params: ['pointer', 'int', 'pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        LaraInLevel: {
            Address: "0x74cb0",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xe3f50",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0x483a0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Menu: {
            Address: "0x4aef0",
            Params: ['int'],
            Return: 'pointer',
            Disable: false
        },
        Clone: {
            Address: "0x10d630",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        AddText: {
            Address: "0xfad80",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xc8480",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xc9350",
            Params: ['int','int','int','int','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        DrawHealth: {
            Address: "0xe0400",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x516a0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x29350",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0xe5460",
            Params: ['int','int','int', 'pointer'],
            Return: 'void',
            Disable: false
        },
        GetLOS: {
            Address: "0xc7c00",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeH: {
            Address: "0xc7840",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        GetRangeV: {
            Address: "0xc7480",
            Params: ['pointer', 'pointer'],
            Return: 'int',
            Disable: false
        },
        CheckAim: {
            Address: "0x67ad0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0xbbdd0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0xc46b0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ProcessGrenade: {
            Address: "0x62890",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ProcessRocket: {
            Address: "0x61750",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ProcessHarpoon: {
            Address: "0x60b40",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ModernGfx: {
            Address: "0x30540",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x51040",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        GetBox: {
            Address: "0xc3bb0",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        GetTileData: {
            Address: "0x21d30",
            Params: ['int', 'int', 'int', 'pointer'],
            Return: 'pointer',
            Disable: false
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
