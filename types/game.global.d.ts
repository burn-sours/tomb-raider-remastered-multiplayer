import { GameCoreFunctions, GameFunctions } from './game-core';

declare global {
    let gameCoreFunctions: GameCoreFunctions;
    /** Game/mod functionality */
    const game: GameCoreFunctions & GameFunctions;
    /** The player's launcher preferences */
    let userData: {
        [key: string]: any;
    };
    /** Base references grouped by module */
    const moduleBaseAddresses: {[module: string]: NativePointer};
    /** Base reference to the executable module */
    let executableBase: NativePointer;
    /** Is exiting the mod? */
    let exiting: boolean;
    /** The replaced game functions */
    let replacedGameFunctions: NativePointerValue[];
    /** The observed game functions */
    let attachedGameFunctions: InvocationListener[];
    /** Is the player in PVP mode? */
    let pvpMode: boolean;
    /** Current level id */
    let currentLevel: number;
    /** Is level tracking disabled? DO NOT rely on Lara's values when this is disabled. */
    let levelTrackingDisabled: boolean;
    /** Is chat box opened? */
    let chatOpened: boolean;
    /** Chat messages */
    let chatMessages: {time: number, name: string|null, text: string, chatAction?: boolean}[];
    /** Player's current chat message being typed */
    let chatMessage: string;
    /** Constants */
    const MAX_PLAYERS: number;
    const LARA_SIZE: number;
    const ROOM_SIZE: number;
    const LARA_DATA_SIZE: number;
    const LARA_BONES_SIZE: number;
    const LARA_POS_SIZE: number;
    const LARA_POS_NO_ROT_SIZE: number;
    const LARA_HAIR_SIZE: number;
    const LARA_BASIC_SIZE: number;
    const LARA_SHADOW_SIZE: number;
    const LARA_APPEARANCE_SIZE: number;
    const LARA_GUNFLAG_SIZE: number;
}

export {};
