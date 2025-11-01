/** tomb5.dll */

// Import variables and sounds from patch2 as they are unchanged
const patch2 = require("../patch2/tr5");

module.exports = {
    /** tomb5.dll variables - imported from patch2 */
    variables: patch2.variables,

    /** tomb5.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x30830",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        ApplySettings: {
            Address: "0xf0c50",
            Params: ['pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0xfc370",
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
            Address: "0xe48e0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Clone: {
            Address: "0x11cd40",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        RenderText: {
            Address: "0xe4720",
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
            Address: "0xedcc0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ResetLaraHair: {
            Address: "0xed4c0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        ProcessLaraState: {
            Address: "0x5e880",
            Params: ['int'],
            Return: 'void',
            Disable: false
        }
    },

    /** tomb5.dll sounds - imported from patch2 */
    sounds: patch2.sounds
};
