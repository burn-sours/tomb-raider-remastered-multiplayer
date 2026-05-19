const fs = require('fs');
const path = require('path');
const util = require('util');

const KEEP_LOGS = 5;
const MAX_LOG_BYTES = 10 * 1024 * 1024;
const pad = n => String(n).padStart(2, '0');
const pad3 = n => String(n).padStart(3, '0');

module.exports = function initLogger(logsDir) {
    fs.mkdirSync(logsDir, { recursive: true });

    function pruneOld() {
        try {
            const old = fs.readdirSync(logsDir)
                .filter(f => f.endsWith('.log'))
                .sort()
                .reverse();
            for (const f of old.slice(KEEP_LOGS - 1)) {
                fs.unlinkSync(path.join(logsDir, f));
            }
        } catch (err) { /* leave old logs alone if cleanup fails */ }
    }

    function makeFilename() {
        const d = new Date();
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}-${pad3(d.getMilliseconds())}.log`;
    }

    function openNewLog() {
        const filepath = path.join(logsDir, makeFilename());
        return { fd: fs.openSync(filepath, 'a'), filepath };
    }

    pruneOld();
    let current = openNewLog();
    let bytesWritten = 0;

    const original = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        debug: console.debug.bind(console),
    };

    function timestamp() {
        const d = new Date();
        return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad3(d.getMilliseconds())}`;
    }

    function rotate() {
        try { fs.closeSync(current.fd); } catch (err) { /**/ }
        current = openNewLog();
        bytesWritten = 0;
    }

    function write(level, args) {
        try {
            const line = `[${timestamp()}] [${level}] ${util.format(...args)}\n`;
            const bytes = Buffer.byteLength(line);
            if (bytesWritten + bytes >= MAX_LOG_BYTES) rotate();
            fs.writeSync(current.fd, line);
            bytesWritten += bytes;
        } catch (err) {
            original.error('Logger write failed:', err);
        }
    }

    for (const level of Object.keys(original)) {
        console[level] = (...args) => {
            original[level](...args);
            write(level.toUpperCase(), args);
        };
    }

    return { logsDir };
};
