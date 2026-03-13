module.exports = {
    // language=JavaScript
    template: `
        const functions = {};
        const moduleBaseAddresses = {};
        let executableBase = null;
        let replacedGameFunctions = [];
        let attachedGameFunctions = [];
        
        let exiting = false;
        let pvpMode = false;
        let currentLevel = null;
        let featureLoopTimeouts = {};

        let chatOpened = false;
        let chatMessage = "";
        let chatMessages = [
            {time: Date.now(), name: null, text: "Welcome to Tomb Raider Multiplayer.  [ko-fi.com/burn_sours]"},
            {time: Date.now(), name: null, text: "Type /quiz for trivia - credits to @joef93"},
            {time: Date.now(), name: null, text: "[F2] Menu, [F4] Confirm, [F8] Chat"}
        ];

        const QUIZZES = [
            { question: "How many crumble tiles are in Tomb of Qualopec?", answer: "6" },
            { question: "Which TR1/TR2 level has no water?", answer: "Caves" },
            { question: "How many bears appear in TR1?", answer: "Three" },
            { question: "How many Pierre encounters are there if you always shoot him?", answer: "9" },
            { question: "Who created Boing% and Multiplayer?", answer: "Burn_Sours" },
            { question: "What's the first obtainable weapon in TR2? (Excluding starting guns)", answer: "Grenade Launcher" },
            { question: "How many levels in TR2 have drivable vehicles?", answer: "Three" },
            { question: "What is on the back of Pierre's jacket?", answer: "A woman in a bikini" },
            { question: "How many sets of clang-clang doors appear in TR1?", answer: "10" },
            { question: "Which TR1/TR2 level has the most kills? (Monks excluded)", answer: "Opera House" },
            { question: "Which TR1/TR2 level has the fewest kills?", answer: "Natla's Mines" },
            { question: "Which are more numerous in Barkhang Monastery: monks or human enemies?", answer: "Human Enemies" },
            { question: "How many raptors are there in TR1?", answer: "9" },
            { question: "Which level is the last level you see a croc in TR1?", answer: "Obelisk of Khamoon" },
            { question: "How many TR1 levels end with item pickups?", answer: "2" },
            { question: "How many levels in TR1 have spikes?", answer: "8" },
            { question: "How many enemy species are in the Venice levels?", answer: "3" },
            { question: "What's the minimum kill count for a TR1 glitchless run?", answer: "4" },
            { question: "How many levels in TR2 end with a cut scene/FMV starting?", answer: "8" },
            { question: "How many different items contain the word 'key' in their name in TR1?", answer: "9" },
            { question: "How many sharks are in TR2?", answer: "8" },
            { question: "How many levels in TR3 have drivable vehicles?", answer: "6" },
            { question: "How many TR2 enemies have health bars?", answer: "6" },
            { question: "How many total levels in TR1-3? (Including bonuses/DLCs)", answer: "113" },
            { question: "Which level in TR1 has only one lever in the entire level?", answer: "Lost Valley" },
            { question: "Which 3 levels in TR2 don't have any human enemies to kill?", answer: "Great Wall, Ice Palace, Temple of Xian" },
            { question: "Which level has the most secrets in TR1?", answer: "Lost Valley" },
            { question: "What's the dying monk's name in Diving Area?", answer: "Brother Chen" },
            { question: "Which level in TR1 has the first boulder?", answer: "Tomb of Qualopec" },
            { question: "What two items does Lara start with in Home Sweet Home?", answer: "Shotgun and Flares" },
            { question: "What food did Pierre eat before St Francis Folly?", answer: "Beans" },
            { question: "In TR3, which level has the least amount of kills?", answer: "City" },
            { question: "What's the TR3 all secrets bonus level called?", answer: "All Hallows" },
            { question: "Which has the most pickups: TR1, 2 or 3?", answer: "TR2" },
            { question: "How many crumble tiles are in Tomb of Qualopec?", answer: "10" },
            { question: "Where's the first Uzi ammo pickup in TR1?", answer: "3rd secret in City of Vilcabamba" },
            { question: "How many TR1 levels need no pickups?", answer: "Two" },
            { question: "How many wolves are dead on the Peru loading screen?", answer: "3" },
            { question: "Name the 4 artifacts that you pick up in Obelisk of Khamoon?", answer: "Eye of Horus, Scarab, Seal of Anubis, Ankh" },
            { question: "How many single-tile pillars in Palace Midas lever room?", answer: "6" },
            { question: "Which level in TR1 has the most save crystals?", answer: "Palace Midas" },
            { question: "Which has more: gorillas in Palace Midas or wolves in Vilcabamba?", answer: "Gorillas (17-11)" },
            { question: "How many TR2 levels have spiked tiles? (not glass/spikey balls)", answer: "5" },
            { question: "How many Clang Clang Doors are there in Barkhang Monastery?", answer: "5" },
            { question: "What's the color order of keycards in Offshore Rig?", answer: "Yellow, Red, Green" },
            { question: "In TR2, how many ziplines are there?", answer: "5" },
            { question: "Which level is alphabetically last in TR2?", answer: "Wreck of the Maria Doria" },
            { question: "Which level is alphabetically first in TR3?", answer: "Aldwych" },
            { question: "How many flares per pickup in TR3?", answer: "8" },
            { question: "How many different outfits does Lara wear in TR2?", answer: "4" },
            { question: "How many enemies are there in total in the TR2 level Home Sweet Home?", answer: "16" },
            { question: "In TR3, what is Sophia Leigh's estimated age?", answer: "Late 20s/Early 30s" },
            { question: "In the TR3 Assault Course, how many individual targets does lara have to shoot?", answer: "21" },
            { question: "In which year was TR1 released?", answer: "1996" },
            { question: "How many explorable rooms are there in TR1's Mansion?", answer: "5" },
            { question: "What colour are Marco Bartoli's eyes?", answer: "Red" },
            { question: "Excluding expansions, how many levels are there in TR2?", answer: "18" },
            { question: "Which level in TR2 has some leftover developer textures?", answer: "Great Wall (Top left of the far tower)" },
            { question: "At launch, how many platforms was TR1 released on?", answer: "3 (PC, Playstation, Sega Saturn)" },
            { question: "In which TR1 level were the Atlanteans first spotted?", answer: "Tomb of Qualopec" },
            { question: "In TR3, what was the name of the event celebrated by the tribesman Lara encounters at the end of Crash Site?", answer: "The feast of Smythe" },
            { question: "How many eyes does the Willard-Spider have in TR3?", answer: "8" }
        ];
        const QUIZ_ANSWER_DELAY = 20000;
        let quizPending = null;

        let gameCoreFunctions = {
            runQuiz: () => {
                if (quizPending) {
                    clearTimeout(quizPending);
                    quizPending = null;
                }
                const q = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
                send({event: "multiplayer:sendChat", args: {asQuiz: true, text: q.question}});
                quizPending = setTimeout(() => {
                    send({event: "multiplayer:sendChat", args: {asQuiz: true, text: "Answer: " + q.answer}});
                    quizPending = null;
                }, QUIZ_ANSWER_DELAY);
            },

            findBaseAddress: (module) => {
                return Module.findBaseAddress(module);
            },

            readMemoryBlock: (moduleOffset, offset, pointer, size) => {
                const address = game.resolveMemoryAddress(moduleOffset, offset, pointer);
                if (!address) return null;
                return Memory.readByteArray(ptr(address), parseInt(size, 16));
            },

            encodeMemoryBlock: (byteArray) => {
                const uint8Array = new Uint8Array(byteArray);
                return Array.from(uint8Array).map(byte => byte.toString(16).padStart(2, '0')).join('');
            },

            decodeMemoryBlock: (hexString) => {
                const byteArray = [];
                for (let i = 0; i < hexString.length; i += 2) {
                    byteArray.push(parseInt(hexString.substring(i, i + 2), 16));
                }
                return byteArray;
            },

            readMemoryValue: (moduleOffset, offset, pointer, type) => {
                const address = game.resolveMemoryAddress(moduleOffset, offset, pointer);
                if (!address) return null;
                switch (type) {
                    case 'Int8':
                        return Memory.readS8(ptr(address));
                    case 'UInt8':
                        return Memory.readU8(ptr(address));
                    case 'Int16':
                        return Memory.readS16(ptr(address));
                    case 'UInt16':
                        return Memory.readU16(ptr(address));
                    case 'Int32':
                        return Memory.readS32(ptr(address));
                    case 'UInt32':
                        return Memory.readU32(ptr(address));
                    case 'Int64':
                        return Memory.readS64(ptr(address));
                    case 'UInt64':
                        return Memory.readU64(ptr(address));
                    case 'Float':
                        return Memory.readFloat(ptr(address));
                    case 'Double':
                        return Memory.readDouble(ptr(address));
                    case 'Pointer':
                        return Memory.readPointer(ptr(address));
                    default:
                        throw new Error("Unsupported read type " + type);
                }
            },

            writeMemoryValue: (moduleOffset, offset, pointer, type, value) => {
                const address = game.resolveMemoryAddress(moduleOffset, offset, pointer);
                if (!address) return;
                switch (type) {
                    case 'Int8':
                        Memory.writeS8(ptr(address), value);
                        break;
                    case 'UInt8':
                        Memory.writeU8(ptr(address), value);
                        break;
                    case 'Int16':
                        Memory.writeS16(ptr(address), value);
                        break;
                    case 'UInt16':
                        Memory.writeU16(ptr(address), value);
                        break;
                    case 'Int32':
                        Memory.writeS32(ptr(address), value);
                        break;
                    case 'UInt32':
                        Memory.writeU32(ptr(address), value);
                        break;
                    case 'Int64':
                        Memory.writeS64(ptr(address), value);
                        break;
                    case 'UInt64':
                        Memory.writeU64(ptr(address), value);
                        break;
                    case 'Float':
                        Memory.writeFloat(ptr(address), value);
                        break;
                    case 'Double':
                        Memory.writeDouble(ptr(address), value);
                        break;
                    case 'Pointer':
                        Memory.writePointer(ptr(address), value);
                        break;
                    default:
                        throw new Error("Unsupported write type " + type);
                }
            },

            resolveMemoryAddress: (moduleOffset, offset, pointer = null) => {
                const baseInt = parseInt(moduleOffset, 16);
                const offsetInt = parseInt(offset, 16);
                let resultInt = baseInt + offsetInt;

                if (pointer != null && typeof pointer != "undefined") {
                    const pointerValue = game.readMemoryPointer('0x' + resultInt.toString(16));
                    if (!pointerValue) return null;
                    resultInt = parseInt(pointerValue, 16) + parseInt(pointer, 16);
                }

                return '0x' + resultInt.toString(16);
            },

            readMemoryPointer: (address) => {
                const pointerValue = Memory.readPointer(ptr(address));
                if (pointerValue.isNull()) {
                    return null;
                }
                return pointerValue.toString();
            },

            allocMemory: (size) => {
                return Memory.alloc(size);
            },

            allocString: (string) => {
                return Memory.allocUtf8String(string);
            },
            
            updateString: (pointer, string) => {
                pointer.writeUtf8String(string);
            },

            readByteArray: (address, size) => {
                return Memory.readByteArray(address, size);
            },

            writeByteArray: (address, data) => {
                return Memory.writeByteArray(address, data);
            },

            delay: async (t) => await new Promise(resolve => setTimeout(resolve, t)),

            getModuleAddresses: (module) => {
                if (module === manifest.executable) {
                    return memoryAddresses.executable;
                } else if (typeof manifest.modules[module] !== 'undefined') {
                    return memoryAddresses[module];
                }
                return null;
            },

            readMemoryVariable: (name, module) => {
                const baseAddress = moduleBaseAddresses[module];
                const moduleValues = game.getModuleAddresses(module);
                let addressInfo = name in moduleValues.variables ? moduleValues.variables[name] : null;
                if (!baseAddress || !addressInfo) return null;

                return game.readMemoryValue(baseAddress, addressInfo.Address, addressInfo.Pointer, addressInfo.Type);
            },
            
            readMemoryBlockVariable: (name, module) => {
                const baseAddress = moduleBaseAddresses[module];
                const moduleValues = game.getModuleAddresses(module);
                let addressInfo = name in moduleValues.variables ? moduleValues.variables[name] : null;
                if (!baseAddress || !addressInfo) return null;

                return game.readMemoryBlock(baseAddress, addressInfo.Address, addressInfo.Pointer, addressInfo.Size);
            },

            getMemoryVariable: (name, module) => {
                const baseAddress = moduleBaseAddresses[module];
                const moduleValues = game.getModuleAddresses(module);
                
                let addressInfo = name in moduleValues.variables ? moduleValues.variables[name] : null;
                if (!baseAddress || !addressInfo) return null;

                const address = game.resolveMemoryAddress(baseAddress, addressInfo.Address, addressInfo.Pointer);
                if (!address) return null;

                return ptr(address);
            },

            writeMemoryVariable: (name, value, module) => {
                const baseAddress = moduleBaseAddresses[module];
                const moduleValues = game.getModuleAddresses(module);
                let addressInfo = name in moduleValues.variables ? moduleValues.variables[name] : null;
                if (!baseAddress || !addressInfo) return;

                game.writeMemoryValue(baseAddress, addressInfo.Address, addressInfo.Pointer, addressInfo.Type, value);
            },

            writeMemoryVariablePointer: (name, value, module) => {
                const baseAddress = moduleBaseAddresses[module];
                const moduleValues = game.getModuleAddresses(module);
                let addressInfo = name in moduleValues.variables ? moduleValues.variables[name] : null;
                if (!baseAddress || !addressInfo) return;

                game.writeMemoryValue(baseAddress, addressInfo.Address, addressInfo.Pointer, 'Pointer', value);
            },

            registerFunction: (module, name, _offset, _return, _params) => {
                functions[module] = functions[module] || {};
                const baseAddress = moduleBaseAddresses[module];
                functions[module][name] = new NativeFunction(baseAddress.add(_offset), _return, _params);
            },

            hasFunction: (module, name) => {
                return !!functions[module]?.[name];
            },

            runFunction: (module, name, ...params) => {
                if (!functions[module]?.[name]) {
                    console.warn("Game function not found", module, name);
                    return;
                }
                return functions[module][name](...params);
            },

            hookFunction: (module, name, _offset, _return, _params, _disable) => {
                const actualAddress = moduleBaseAddresses[module].add(_offset);
                const hookActions = hooks[module];
                if (!hookActions) return;

                if (_disable) {
                    Interceptor.replace(actualAddress, new NativeCallback((...args) => {
                        const logArgs = _params.map((p, i) => args[i]);

                        if (name in hookActions) {
                            if (logArgs.length) {
                                hookActions[name].before(logArgs);
                                return hookActions[name].after(logArgs);
                            }

                            hookActions[name].before();
                            return hookActions[name].after();
                        }

                        return ptr('0x0');
                    }, _return, _params));

                    replacedGameFunctions.push(actualAddress);
                } else {
                    const attached = Interceptor.attach(actualAddress, {
                        onEnter(args) {
                            this.logArgs = _params.map((p, i) => args[i]);

                            if (name in hookActions) {
                                try {
                                    if (this.logArgs.length) {
                                        hookActions[name].before(this.logArgs);
                                    } else {
                                        hookActions[name].before();
                                    }
                                } catch (err) {
                                    console.error("Error in hook '" + name + "' before:", err.message, err.stack);
                                }
                            }
                        },
                        onLeave(retval) {
                            if (name in hookActions && hookActions[name].after) {
                                try {
                                    const result = this.logArgs.length
                                        ? hookActions[name].after(this.logArgs)
                                        : hookActions[name].after();

                                    if (result !== undefined && retval) {
                                        if (typeof result === 'object' && result !== null && 'handle' in result) {
                                            retval.replace(result);
                                        } else if (typeof result === 'bigint' || typeof result === 'number') {
                                            retval.replace(ptr(result));
                                        }
                                    }
                                } catch (err) {
                                    console.error("Error in hook '" + name + "' after:", err.message, err.stack);
                                }
                            }
                        }
                    });

                    attached && attachedGameFunctions.push(attached);
                }
            },

            setupGame: async () => {
                for (let module of [manifest.executable, ...Object.keys(manifest.modules)]) {
                    let moduleBaseAddress = game.findBaseAddress(module);
                    while (!moduleBaseAddress) {
                        await game.delay(100);
                        moduleBaseAddress = game.findBaseAddress(module);
                    }
                    moduleBaseAddresses[module] = moduleBaseAddress;
                }

                executableBase = moduleBaseAddresses[manifest.executable];

                await game.waitForGame();

                for (let module of [manifest.executable, ...Object.keys(manifest.modules)]) {
                    const moduleAddresses = game.getModuleAddresses(module);
                    for (let fnName of Object.keys(moduleAddresses.hooks)) {
                        const fn = moduleAddresses.hooks[fnName];
                        game.registerFunction(
                            module, fnName, fn.Address, fn.Return, fn.Params
                        );
                    }
                }

                game.allocLaraBackups();

                game.setupLaraSlots();

                for (let module of [manifest.executable, ...Object.keys(manifest.modules)]) {
                    const moduleAddresses = game.getModuleAddresses(module);
                    for (let fnName of Object.keys(moduleAddresses.hooks)) {
                        if (fnName in hooksExecution) {
                            const fn = moduleAddresses.hooks[fnName];
                            game.hookFunction(
                                module, fnName, fn.Address, fn.Return, fn.Params, fn.Disable
                            );
                        }
                    }
                }

                game.writeMemoryVariable("DevMode", 0, manifest.executable);

                game.startFeatureLoops(supportedFeatures);
            },
            
            cleanupHooks: async () => {
                for (let t of replacedGameFunctions) {
                    try {
                        Interceptor.revert(t);
                    } catch (err) {}
                }
                replacedGameFunctions = [];

                for (let t of attachedGameFunctions) {
                    try {
                        t?.detach();
                    } catch (err) {}
                }
                attachedGameFunctions = [];

                Interceptor.flush();
            },

            registerHooks: (hooksExecution) => {
                for (let module of [manifest.executable, ...Object.keys(manifest.modules)]) {
                    try {
                        const moduleAddresses = game.getModuleAddresses(module);
                        if (!moduleAddresses) {
                            console.error('No addresses found for: ', module);
                            continue;
                        }

                        hooks[module] = {};
                        for (let fnName of Object.keys(moduleAddresses.hooks)) {
                            hooks[module][fnName] = ((fnName) => ({
                                before(argsArray) {
                                    if (typeof hooksExecution[fnName]?.before !== 'function') return;
                                    try {
                                        return hooksExecution[fnName].before(module, argsArray);
                                    } catch (err) {
                                        console.error("Error in hook '" + fnName + "' (" + module + ") before:", err.message, err.stack);
                                    }
                                },
                                after(argsArray) {
                                    if (typeof hooksExecution[fnName]?.after !== 'function') return ptr(0x0);
                                    try {
                                        return hooksExecution[fnName].after(module, argsArray);
                                    } catch (err) {
                                        console.error("Error in hook '" + fnName + "' (" + module + ") after:", err.message, err.stack);
                                        return ptr(0x0);
                                    }
                                }
                            }))(fnName);
                        }
                    } catch (err) {
                        console.error("Registering Hook ["+ module +"] failed: ", err);
                    }
                }
            },

            registerFeatureHooks: (supportedFeatures, hooksExecution) => {
                const wrappedHooks = {};

                for (let hookName in hooksExecution) {
                    const patchHook = hooksExecution[hookName];
                    wrappedHooks[hookName] = {
                        before: patchHook.before ? (module, argsArray) => {
                            return patchHook.before(module, ...(argsArray || []));
                        } : undefined,
                        after: patchHook.after ? (module, argsArray) => {
                            return patchHook.after(module, ...(argsArray || []));
                        } : undefined
                    };
                }

                for (let feature of supportedFeatures) {
                    const featureHooks = feature.game.hooks || {};
                    for (let hookName in featureHooks) {
                        const featureHook = featureHooks[hookName];
                        const existingHook = wrappedHooks[hookName] || {};

                        let featureHookBefore = null;
                        if (featureHook.before) {
                            try {
                                featureHookBefore = eval('(module, game, userData, args) => { ' + featureHook.before + ' }');
                            } catch (err) {
                                console.error('Feature hook compile error [' + feature.id + '.' + hookName + '.before]:', err);
                            }
                        }

                        let featureHookAfter = null;
                        if (featureHook.after) {
                            try {
                                featureHookAfter = eval('(module, game, userData, args) => { ' + featureHook.after + ' }');
                            } catch (err) {
                                console.error('Feature hook compile error [' + feature.id + '.' + hookName + '.after]:', err);
                            }
                        }

                        const newHook = {};

                        if (featureHookBefore || typeof existingHook.before === 'function') {
                            newHook.before = (module, argsArray) => {
                                if (featureHookBefore) {
                                    featureHookBefore(module, game, userData, argsArray);
                                }
                                if (typeof existingHook.before === 'function') {
                                    return existingHook.before(module, argsArray);
                                }
                            };
                        }

                        if (featureHookAfter || typeof existingHook.after === 'function') {
                            newHook.after = (module, argsArray) => {
                                let result = ptr(0x0);
                                if (typeof existingHook.after === 'function') {
                                    result = existingHook.after(module, argsArray);
                                }
                                if (featureHookAfter) {
                                    const featureResult = featureHookAfter(module, game, userData, argsArray);
                                    if (featureResult !== undefined) {
                                        result = featureResult;
                                    }
                                }
                                return result;
                            };
                        }

                        wrappedHooks[hookName] = newHook;
                    }
                }

                for (let hookName in wrappedHooks) {
                    hooksExecution[hookName] = wrappedHooks[hookName];
                }
            },

            callFeatureAction: (featureId, action, data) => {
                try {
                    const feature = supportedFeatures.find(f => f.id === featureId);
                    if (!feature) {
                        console.error('Feature not found:', featureId);
                        return;
                    }

                    const actionHandler = feature.game.actions?.[action];
                    if (!actionHandler) {
                        if (action !== 'cleanup') {
                            console.warn('Action not found:', action, 'for feature:', featureId);
                        }
                        return;
                    }

                    const handlerFn = eval(actionHandler);
                    if (typeof handlerFn === 'function') {
                        handlerFn(data);
                    } else {
                        console.error('Action handler is not a function:', actionHandler);
                    }
                } catch (err) {
                    console.error('Feature action error:', err);
                }
            },

            startFeatureLoops: (supportedFeatures) => {
                const loopsByInterval = {};

                for (let feature of supportedFeatures) {
                    const loops = feature.game.loops || [];
                    for (let loop of loops) {
                        if (!loopsByInterval[loop.interval]) {
                            loopsByInterval[loop.interval] = [];
                        }
                        loopsByInterval[loop.interval].push(loop.name);
                    }
                }
               
                for (let intervalStr in loopsByInterval) {
                    const intervalNum = parseInt(intervalStr);
                    try {
                        const loopNames = loopsByInterval[intervalStr];
                        const loopFn = function () {
                            if (!exiting) {
                                for (let loopName of loopNames) {
                                    try {
                                        eval(loopName + '();');
                                    } catch (err) {
                                        console.error('Feature loop error:', loopName, err.stack);
                                    }
                                }
                                featureLoopTimeouts[intervalStr] = setTimeout(loopFn, intervalNum);
                            }
                        };
                        featureLoopTimeouts[intervalStr] = setTimeout(loopFn, intervalNum);
                    } catch (err) {
                        console.error('Feature loop error:', err.stack, loopsByInterval[interval]);
                    }
                }
            },

            cleanupFeatures: (supportedFeatures) => {
                for (let timeoutId of Object.values(featureLoopTimeouts)) {
                    clearTimeout(timeoutId);
                }
                featureLoopTimeouts = {};

                for (let feature of supportedFeatures) {
                    game.callFeatureAction(feature.id, 'cleanup', {});
                }
            }
        };
    `,
};
