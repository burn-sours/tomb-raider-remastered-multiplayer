const crypto = require('node:crypto');

const generatePlayerId = () => {
    return crypto.randomBytes(6).toString('base64url');
};

const djb2Hash = (str) => {
    str = String(str);
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash >>> 0;
};

const sanitizeMessage = (text) => {
    text = text.replace(new RegExp("(.)\\1{4,}", "gi"), (m, char) => char.repeat(4));
    text = text.replace(new RegExp("((.)(.))\\1{8,}", "gi"), (m, group, char1, char2) => char1 + char2 + char1 + char2 + char1 + char2 + char1 + char2);
    return text;
};

module.exports = {
    generatePlayerId,
    djb2Hash,
    sanitizeMessage
};
