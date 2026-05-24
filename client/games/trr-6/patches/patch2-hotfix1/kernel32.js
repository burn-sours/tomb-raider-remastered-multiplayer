module.exports = {
    variables: {},
    hooks: {
        CreateFileA: {
            Name: "CreateFileA",
            Params: ['pointer', 'uint32', 'uint32', 'pointer', 'uint32', 'uint32', 'pointer'],
            Return: 'pointer',
            Disable: true
        },
        CreateFileW: {
            Name: "CreateFileW",
            Params: ['pointer', 'uint32', 'uint32', 'pointer', 'uint32', 'uint32', 'pointer'],
            Return: 'pointer',
            Disable: true
        }
    }
};
