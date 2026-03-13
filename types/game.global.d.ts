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
    /** Is chat box opened? */
    let chatOpened: boolean;
    /** Chat messages */
    let chatMessages: {time: number, name: string|null, text: string, chatAction?: boolean}[];
    /** Player's current chat message being typed */
    let chatMessage: string;
    /** Constants */
    const MAX_PLAYERS: number;
    const ENTITY_SIZE: number;
    const ROOM_SIZE: number;
    const ENTITY_BONES_SIZE: number;
    const ENTITY_MATRICES_SIZE: number;
    const ENTITY_POS_SIZE: number;
    const ENTITY_POS_NO_ROT_SIZE: number;
    const LARA_HAIR_SIZE: number;
    const LARA_BASIC_SIZE: number;
    const LARA_SHADOW_SIZE: number;
    const LARA_APPEARANCE_SIZE: number;
    const LARA_GUNFLAG_SIZE: number;
    const ENTITY_X: number;
    const ENTITY_Y: number;
    const ENTITY_Z: number;
    const ENTITY_LAST_X: number;
    const ENTITY_ROOM: number;
    const ENTITY_NEXT_ID: number;
    const ENTITY_HEALTH: number;
    const ENTITY_BOX_INDEX: number;
    const ENTITY_BONES: number;
    const ENTITY_LAST_BONES: number;
    const ENTITY_XZ_SPEED: number;
    const ENTITY_Y_SPEED: number;
    const ENTITY_ANIM_ID: number;
    const ENTITY_ANIM_FRAME: number;
    const ENTITY_FLAGS: number;
    const ENTITY_YAW: number;
    const ENTITY_TILT: number;
    const ENTITY_ROLL: number;
    const ENTITY_TIMER: number;
    const ENTITY_BEHAVIOUR: number;
    const ENTITY_STATUS: number;
    const ENTITY_MODEL: number;
}

export {};
