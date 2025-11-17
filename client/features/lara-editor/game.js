module.exports = {
    // language=JavaScript
    template: `
        let laraEditor_initialized = false;
        let laraEditor_lastGameModule = null;

        const laraEditor_readData = () => {
            const lara = game.getLara();
            if (!lara || lara.isNull()) return null;

            const module = game.getGameModule();
            const moduleAddresses = game.getModuleAddresses(module);
            const execAddresses = game.getModuleAddresses(manifest.executable);
            const posPointer = lara.add(moduleAddresses.variables.LaraPositions.Pointer);

            let outfitId = 0;
            try {
                const appearancePointer = executableBase.add(execAddresses.variables.LaraAppearanceModern.Address);
                if (manifest.executable === "tomb456.exe") {
                    const outfitsPointer = game.getMemoryVariable("OutfitsPointer", module);
                    const outfitPointerAddress = appearancePointer.readPointer();
                    outfitId = parseInt(outfitPointerAddress.sub(outfitsPointer).toString()) / LARA_OUTFIT_SIZE;
                } else {
                    outfitId = appearancePointer.readS8();
                }
            } catch (err) {
                console.error("Error reading outfit ID:", err);
            }

            return {
                x: posPointer.readS32(),
                y: posPointer.add(0x4).readS32(),
                z: posPointer.add(0x8).readS32(),
                yaw: posPointer.add(0xE).readS16(),
                pitch: posPointer.add(0xC).readS16(),
                roll: posPointer.add(0x10).readS16(),
                roomId: lara.add(moduleAddresses.variables.LaraRoomId.Pointer).readS16(),
                health: lara.add(moduleAddresses.variables.LaraHealth.Pointer).readS16(),
                oxygen: game.readMemoryVariable("LaraOxygen", module),
                outfitId: outfitId
            };
        };

        const laraEditor_sendData = () => {
            const laraData = laraEditor_readData();
            if (laraData) {
                const module = game.getGameModule();
                send({
                    event: "standalone:laraEditorData",
                    args: {
                        ...laraData,
                        gameModule: module
                    }
                });
            }
        };

        const laraEditor_initialize = () => {
            if (laraEditor_initialized) return;

            try {
                laraEditor_sendData();
                laraEditor_initialized = true;
            } catch (err) {
                console.error("Lara editor initialization error:", err);
            }
        };

        const laraEditor_loop = () => {
            if (userData.standaloneFeatureId !== 'lara-editor') return;

            try {
                if (!laraEditor_initialized) {
                    laraEditor_initialize();
                }
                if (!laraEditor_initialized) return;

                const module = game.getGameModule();

                if (module !== laraEditor_lastGameModule) {
                    laraEditor_lastGameModule = module;
                    // Send module change notification with empty data to reset UI
                    send({
                        event: "standalone:laraEditorData",
                        args: {
                            gameModule: module,
                            reset: true
                        }
                    });
                    return;
                }

                laraEditor_sendData();
            } catch (err) {
                console.error("Lara editor loop error:", err);
            }
        };

        const laraEditor_updateAction = (laraUpdateData) => {
            if (userData.standaloneFeatureId !== 'lara-editor') return;

            try {
                const lara = game.getLara();
                if (!lara || lara.isNull()) return;

                const module = game.getGameModule();
                const moduleAddresses = game.getModuleAddresses(module);
                const posPointer = lara.add(moduleAddresses.variables.LaraPositions.Pointer);

                if (laraUpdateData.x !== undefined) posPointer.writeS32(parseInt(laraUpdateData.x));
                if (laraUpdateData.y !== undefined) posPointer.add(0x4).writeS32(parseInt(laraUpdateData.y));
                if (laraUpdateData.z !== undefined) posPointer.add(0x8).writeS32(parseInt(laraUpdateData.z));

                const orientationChanged = laraUpdateData.yaw !== undefined || laraUpdateData.pitch !== undefined || laraUpdateData.roll !== undefined;
                if (laraUpdateData.yaw !== undefined) posPointer.add(0xE).writeS16(parseInt(laraUpdateData.yaw));
                if (laraUpdateData.pitch !== undefined) posPointer.add(0xC).writeS16(parseInt(laraUpdateData.pitch));
                if (laraUpdateData.roll !== undefined) posPointer.add(0x10).writeS16(parseInt(laraUpdateData.roll));

                // Update photo mode if orientation changed while in photo mode (TRR-123 only)
                if (orientationChanged && manifest.executable !== "tomb456.exe") {
                    const isPhotoMode = game.readMemoryVariable("IsPhotoMode", manifest.executable);
                    if (isPhotoMode === 1) {
                        game.runFunction(module, "UpdatePhotoMode");
                    }
                }

                if (laraUpdateData.roomId !== undefined) lara.add(moduleAddresses.variables.LaraRoomId.Pointer).writeS16(parseInt(laraUpdateData.roomId));
                if (laraUpdateData.health !== undefined) lara.add(moduleAddresses.variables.LaraHealth.Pointer).writeS16(parseInt(laraUpdateData.health));
                if (laraUpdateData.oxygen !== undefined) game.writeMemoryVariable("LaraOxygen", parseInt(laraUpdateData.oxygen), module);

                if (laraUpdateData.outfitId !== undefined) {
                    try {
                        const execAddresses = game.getModuleAddresses(manifest.executable);
                        const appearancePointer = executableBase.add(execAddresses.variables.LaraAppearanceModern.Address);
                        const outfitValue = parseInt(laraUpdateData.outfitId);

                        if (manifest.executable === "tomb456.exe") {
                            const outfitsPointer = game.getMemoryVariable("OutfitsPointer", module);
                            const outfitPointerAddress = outfitsPointer.add(outfitValue * LARA_OUTFIT_SIZE);
                            appearancePointer.writePointer(outfitPointerAddress);
                            
                            const isYoungLara = outfitValue === 2 || outfitValue === 3;
                            game.runFunction(
                                module,
                                "ApplySettings",
                                game.getMemoryVariable("OutfitsLaraSomeBasePointer", module),
                                game.getMemoryVariable(isYoungLara ? "OutfitsLaraHairYoung" : "OutfitsLaraHairOld", module)
                            );
                        } else {
                            appearancePointer.writeS8(outfitValue);
                        }
                    } catch (err) {
                        console.error("Error writing outfit ID:", err);
                    }
                }

                laraEditor_sendData();
            } catch (err) {
                console.error("Lara editor updateLara error:", err);
            }
        };

        const laraEditor_cleanup = () => {
            laraEditor_initialized = false;
            laraEditor_lastGameModule = null;
        };
    `,

    loops: [
        { interval: 100, name: 'laraEditor_loop' }
    ],

    actions: {
        'updateLara': 'laraEditor_updateAction',
        'cleanup': 'laraEditor_cleanup'
    }
};
