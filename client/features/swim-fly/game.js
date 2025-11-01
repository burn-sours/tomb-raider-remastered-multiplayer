module.exports = {
    // language=JavaScript
    template: `
        let cachedRoomHydration = {};
        let hydratingLevelRooms = false;
        let floodedLevelRooms = false;

        const floodLevel = () => {
            if (hydratingLevelRooms || !userData['swim-fly'] || floodedLevelRooms) return;

            hydratingLevelRooms = true;

            try {
                const module = game.getGameModule();
                const roomsCount = game.readMemoryVariable("RoomsCount", module);
                const roomsPointer = game.readMemoryVariable("Rooms", module);

                if (!roomsPointer || roomsPointer.isNull()) {
                    hydratingLevelRooms = false;
                    return;
                }
                
                const hydrationOffset = module === "tomb4.dll" || module === "tomb5.dll" ? 0x6c : 0x66;

                for (let roomId = 0; roomId < roomsCount; roomId++) {
                    const roomFlags = roomsPointer.add(ROOM_SIZE * roomId).add(hydrationOffset);
                    cachedRoomHydration[roomId] = roomFlags.readS8();
                    roomFlags.writeS8(cachedRoomHydration[roomId] | 1);
                }

                floodedLevelRooms = true;
            } catch (err) {
                console.error("Flood level error:", err);
            }

            hydratingLevelRooms = false;
        };

        const unfloodLevel = () => {
            if (hydratingLevelRooms || !floodedLevelRooms) return;

            hydratingLevelRooms = true;

            try {
                const module = game.getGameModule();
                const roomsCount = game.readMemoryVariable("RoomsCount", module);
                const roomsPointer = game.readMemoryVariable("Rooms", module);

                if (!roomsPointer || roomsPointer.isNull()) {
                    hydratingLevelRooms = false;
                    return;
                }

                const flagOffset = module === "tomb4.dll" || module === "tomb5.dll" ? 0x6c : 0x66;

                for (let roomId = 0; roomId < roomsCount; roomId++) {
                    if (roomId in cachedRoomHydration) {
                        const roomFlags = roomsPointer.add(ROOM_SIZE * roomId).add(flagOffset);
                        if ((cachedRoomHydration[roomId] & 1) > 0) {
                            roomFlags.writeS8(roomFlags.readS8() | 1);
                        } else {
                            roomFlags.writeS8(roomFlags.readS8() & ~1);
                        }
                    }
                }

                floodedLevelRooms = false;
                cachedRoomHydration = {};
            } catch (err) {
                console.error("Unflood level error:", err);
            }

            hydratingLevelRooms = false;
        };
    `,

    hooks: {
        KeyboardInput: {
            // language=JavaScript
            before: `
                if (!userData['swim-fly']) return;

                const [keycode, pressedDown] = args;

                // keycode 72 = F11
                if (pressedDown > 0 && keycode === 72) {
                    const lara = game.getLara();
                    if (!lara || lara.isNull()) return;

                    if (!floodedLevelRooms) {
                        floodLevel();
                    } else {
                        unfloodLevel();
                    }
                }
            `
        },
        LaraInLevel: {
            // language=JavaScript
            after: `
                floodedLevelRooms = false;
                hydratingLevelRooms = false;
                cachedRoomHydration = {};
            `
        }
    },

    cleanup: `unfloodLevel();`
};