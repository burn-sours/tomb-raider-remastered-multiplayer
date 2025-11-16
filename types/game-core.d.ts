export interface GameCoreFunctions {
    /**
     * Finds the base address of a loaded module
     */
    findBaseAddress(module: string): NativePointer | null;

    /**
     * Reads a block of memory as a byte array
     */
    readMemoryBlock(moduleOffset: string, offset: string, pointer: any, size: string): ArrayBuffer | null;

    /**
     * Encodes a byte array to hex string
     */
    encodeMemoryBlock(byteArray: ArrayBuffer): string;

    /**
     * Decodes a hex string to byte array
     */
    decodeMemoryBlock(hexString: string): number[];

    /**
     * Reads a typed memory value
     */
    readMemoryValue(moduleOffset: string, offset: string, pointer: any, type: string): any;

    /**
     * Writes a typed memory value
     */
    writeMemoryValue(moduleOffset: string, offset: string, pointer: any, type: string, value: any): void;

    /**
     * Resolves a memory address from base + offset + optional pointer
     */
    resolveMemoryAddress(moduleOffset: string, offset: string, pointer?: any): string | null;

    /**
     * Reads a pointer value from memory
     */
    readMemoryPointer(address: string): string | null;

    /**
     * Allocates memory of specified size
     */
    allocMemory(size: number): any;

    /**
     * Allocates a UTF-8 string in memory
     */
    allocString(string: string): any;

    /**
     * Updates a string pointer with new content
     */
    updateString(pointer: any, string: string): void;

    /**
     * Reads a byte array from address
     */
    readByteArray(address: NativePointer, size: number): any;

    /**
     * Writes a byte array to address
     */
    writeByteArray(address: NativePointer, data: any): void;

    /**
     * Delays execution for specified milliseconds
     */
    delay(ms: number): Promise<void>;

    /**
     * Gets memory addresses for a module
     */
    getModuleAddresses(module: string): any;

    /**
     * Reads a memory variable by name and module
     */
    readMemoryVariable(name: string, module: string): any;

    /**
     * Reads a memory block variable by name and module
     */
    readMemoryBlockVariable(name: string, module: string): ArrayBuffer | null;

    /**
     * Reads a memory variable by direct address info
     */
    readMemoryVariableByAddress(address: string, addressPointer: any, addressType: string): any;

    /**
     * Gets a pointer to a memory variable
     */
    getMemoryVariable(name: string, module: string): any;

    /**
     * Writes a memory variable by name and module
     */
    writeMemoryVariable(name: string, value: any, module: string): void;

    /**
     * Writes a pointer value to a memory variable
     */
    writeMemoryVariablePointer(name: string, value: any, module: string): void;

    /**
     * Writes a memory variable by direct address info
     */
    writeMemoryVariableByAddress(address: string, addressPointer: any, addressType: string, value: any): void;

    /**
     * Registers a native function for later use
     */
    registerFunction(module: string, name: string, offset: string, returnType: string, params: any[]): void;

    /**
     * Checks if a function is registered
     */
    hasFunction(module: string, name: string): boolean;

    /**
     * Runs a registered native function
     */
    runFunction(module: string, name: string, ...params: any[]): any;

    /**
     * Hooks a native function with before/after callbacks
     */
    hookFunction(module: string, name: string, offset: string, returnType: string, params: any[], disable: boolean): void;

    /**
     * Sets up the game by loading modules and initializing hooks
     */
    setupGame(): Promise<void>;

    /**
     * Cleans up all registered hooks
     */
    cleanupHooks(): Promise<void>;

    /**
     * Registers hook execution callbacks
     */
    registerHooks(hooksExecution: any): void;

    /**
     * Registers hooks from supported features
     */
    registerFeatureHooks(supportedFeatures: any[], hooksExecution: any): void;

    /**
     * Starts feature loops grouped by interval
     */
    startFeatureLoops(supportedFeatures: any[]): void;

    /**
     * Cleans up feature-specific resources
     */
    cleanupFeatures(supportedFeatures: any[]): void;
}

export interface GameFunctions {
    getLara: () => NativePointer;
    getGameModule: () => "tomb1.dll" | "tomb2.dll" | "tomb3.dll" | "tomb4.dll" | "tomb5.dll";
    getEntityPointer: (entityId: number) => NativePointer;
    levelName: (levelId: number) => string;
    levelNames: Record<"tomb1.dll" | "tomb2.dll" | "tomb3.dll" | "tomb4.dll" | "tomb5.dll", Record<string, string>>;
    isLevelSupported: (levelId: number) => boolean;
    isLevelMenu: (levelId: number) => boolean;
    isInGame: () => boolean; // player is in playable game level?
    isInMenu: () => boolean; // player is in main menu?
    getScreenCenter: () => {x: number, y: number}; // returns 2d coords to the center of the screen
    worldToScreenPos: (x: number, y: number, z: number, roomId: number) => {x: number, y: number}; // converts 3d coords to 2d screen coords
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;

    allocLaraBackups: () => void;
    setupLaraSlots: () => void;
}