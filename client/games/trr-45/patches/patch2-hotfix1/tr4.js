/** tomb4.dll */

// Import variables and sounds from patch2 as they are unchanged
const patch2 = require("../patch2/tr4");

module.exports = {
    /** tomb4.dll draw/graphics */
    uiLayer: 0x42,

    /** tomb4.dll variables - imported from patch2 */
    variables: patch2.variables,

    /** tomb4.dll hooks */
    hooks: {
        RenderLara: {
            Address: "0x2f430",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        ApplySettings: {
            Address: "0xf35f0",
            Params: ['pointer', 'pointer'],
            Return: 'void',
            Disable: false
        },
        LoadedLevel: {
            Address: "0x100600",
            Params: ['pointer'],
            Return: 'void',
            Disable: true
        },
        LaraInLevel: {
            Address: "0x87e90",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        SoundEffect: {
            Address: "0xd43f0",
            Params: ['int', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        ProcessGrenade: {
            Address: "0x56b40",
            Params: ['int16'],
            Return: 'void',
            Disable: true
        },
        ProcessHarpoon: {
            Address: "0x582c0",
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
            Address: "0xa76f0",
            Params: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'int'],
            Return: 'int',
            Disable: false
        },
        RenderUI: {
            Address: "0xeddb0",
            Params: [],
            Return: 'void',
            Disable: false
        },
        Clone: {
            Address: "0x120f20",
            Params: ['pointer', 'pointer', 'uint64'],
            Return: 'void',
            Disable: false
        },
        RenderText: {
            Address: "0xedbf0",
            Params: ['int', 'int', 'int', 'pointer', 'int'],
            Return: 'pointer',
            Disable: false
        },
        DrawSetup: {
            Address: "0xb2430",
            Params: ['int','pointer'],
            Return: 'void',
            Disable: false
        },
        DrawRect: {
            Address: "0xb2f50",
            Params: ['float','float','float','float','uint64','uint64'],
            Return: 'void',
            Disable: false
        },
        RoomChange: {
            Address: "0x407c0",
            Params: ['int','int'],
            Return: 'void',
            Disable: false
        },
        RenderEntity: {
            Address: "0x2fdb0",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        GetRelYawPitch: {
            Address: "0xd6560",
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
            Address: "0x5db80",
            Params: ['pointer'],
            Return: 'void',
            Disable: false
        },
        DealDmg: {
            Address: "0x9b1b0",
            Params: ['pointer', 'int', 'int'],
            Return: 'void',
            Disable: false
        },
        ModernGfx: {
            Address: "0x32250",
            Params: ['int','int','int','int','int','int','int'],
            Return: 'void',
            Disable: false
        },
        GetBox: {
            Address: "0xa3d20",
            Params: ['pointer'],
            Return: 'pointer',
            Disable: false
        },
        RemoveEntity: {
            Address: "0x40140",
            Params: ['int'],
            Return: 'void',
            Disable: false
        },
        AttachLaraHair: {
            Address: "0xefdf0",
            Params: ['int', 'int'],
            Return: 'void',
            Disable: false
        },
        ResetLaraHair: {
            Address: "0xef5f0",
            Params: [],
            Return: 'void',
            Disable: false
        }
    },

    /** tomb4.dll sounds - imported from patch2 */
    sounds: patch2.sounds
};
