module.exports = {
    // language=JavaScript
    template: `
        let rewind_isRewinding = false;
        const REWIND_MAX_FRAMES = 10000;
        const REWIND_BUFFER_SIZE = 0x3800;
        const REWIND_INPUT_SIZE = 0x4;
        const REWIND_FRAME_SIZE = REWIND_BUFFER_SIZE + REWIND_INPUT_SIZE;
        let rewind_rewindBuffer = null;
        let rewind_rewindIndex = 0;
        let rewind_textLabel = null;

        const rewind_toggleLabel = (show) => {
             if (show) {
                 if (!rewind_textLabel) {
                     const module = game.getGameModule();
                     rewind_textLabel = ptr(game.runFunction(module, "AddText", 0, 0, 0x38, game.allocString("<< REWIND")));
                 }
                 rewind_textLabel.writeS32(4113);
                 rewind_textLabel.add(0x50).writeS32(25000);
                 rewind_textLabel.add(0x10).writeFloat(10);
                 rewind_textLabel.add(0x40).writeS32(0x0000FFFF);
                 game.updateString(
                     rewind_textLabel.add(0x48).readPointer(),
                     "<< REWIND " + rewind_rewindIndex + "/" + (REWIND_MAX_FRAMES / 1000) + "k"
                 );
             } else {
                 if (rewind_textLabel) {
                     game.deleteUiText(rewind_textLabel);
                     rewind_textLabel = null;
                 }
             }
        };

        const rewind_init = (reset = false) => {
            if (reset) {
                rewind_rewindBuffer = null; 
                rewind_textLabel = null;
                rewind_rewindIndex = 0;
            }
            if (rewind_rewindBuffer) return;
            
            const lara = game.getLara();
            if (!lara || lara.isNull()) return;

            rewind_rewindBuffer = game.allocMemory(REWIND_MAX_FRAMES * REWIND_FRAME_SIZE);
        };
    `,

    hooks: {
        KeyboardInput: {
            // language=JavaScript
            before: `
                if (!userData['rewind-lara']) return;

                let [keycode, pressedDown] = args;
                
                // keycode 72 = F11
                if (keycode === 72) {
                    rewind_isRewinding = rewind_rewindIndex > 0 && pressedDown > 0;
                    rewind_toggleLabel(rewind_isRewinding);
                }
            `
        },
        InitializeLevelAI: {
            // language=JavaScript
            after: `
                if (!userData['rewind-lara']) return;
                const lara = game.getLara();
                if (!lara || lara.isNull()) return;
                
                rewind_init(true);
            `
        },
        ProcessDemo: {
            // language=JavaScript
            before: `
                if (!userData['rewind-lara']) return;
                const lara = game.getLara();
                if (!lara || lara.isNull()) return;

                if (!rewind_rewindBuffer) {
                    rewind_init();
                    if (!rewind_rewindBuffer) return;
                }

                const worldStatePointer = game.getMemoryVariable("WorldStateBackupPointer", module);
                const actionKeysPointer = game.getMemoryVariable("ActionKeys", module);

                if (rewind_isRewinding) {
                    if (rewind_rewindIndex > 0) {
                        rewind_rewindIndex--;
                        const currentFramePtr = rewind_rewindBuffer.add(rewind_rewindIndex * REWIND_FRAME_SIZE);
                        game.runFunction(module, "Clone", worldStatePointer, currentFramePtr, REWIND_BUFFER_SIZE);
                        game.runFunction(module, "RestoreWorldState", 0);
                        const currentActionKey = currentFramePtr.add(REWIND_BUFFER_SIZE).readU32();
                        actionKeysPointer.writeU32(currentActionKey === 256 ? 0 : currentActionKey);
                    } else {
                        rewind_rewindIndex = 0;
                        rewind_isRewinding = false;
                        rewind_toggleLabel(false);
                    }
                }
                else {
                    const currentFramePtr = rewind_rewindBuffer.add(rewind_rewindIndex * REWIND_FRAME_SIZE);
                    game.runFunction(module, "RecordWorldState", 0);
                    game.runFunction(module, "Clone", currentFramePtr, worldStatePointer, REWIND_BUFFER_SIZE);
                    currentFramePtr.add(REWIND_BUFFER_SIZE).writeU32(actionKeysPointer.readU32());
                    rewind_rewindIndex = (rewind_rewindIndex + 1) % REWIND_MAX_FRAMES;
                }
            `
        },
        CanInterpolateCamera: {
            // language=JavaScript
            after: `
                if (!userData['rewind-lara']) return;
                if (rewind_isRewinding) {
                   return 0;
                }
            `
        }
    }
};