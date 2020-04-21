import { ListenerOptions } from './types';
export declare const EMITTER_FORCE_LAYER_TYPE: string;
export declare const EMITTER_TOP_LAYER_TYPE: string;
export declare class Emitter {
    /**
     * @public
     *
     * Sets names for layers indexes.
     * @param {string|number|array[]|object[]|object} firstParam - Name or id of the layer.
     * For array or object it's a
     * layers config.
     *
     * @param {string} firstParam.name - Name of the layer.
     * @param {number} firstParam.id - Id of the layer.
     * @example
     * Emitter.setLayersMap({ name: 'fileBrowsing', id: 1 })
     *
     * @param {string} firstParam[0] - Name of the layer.
     * @param {number} firstParam[1] - Id of the layer.
     * @example
     * Emitter.setLayersMap(['fileBrowsing', 1])
     *
     * @param {number} firstParam[0] - Id of the layer.
     * @param {string} firstParam[1] - Name of the layer.
     * @example
     * Emitter.setLayersMap([1, 'fileBrowsing'])
     *
     * @param {string} firstParam[].name - Name of the layer.
     * @param {number} firstParam[].id - Id of the layer.
     * @example
     * Emitter.setLayersMap([
     *    { name: 'fileBrowsing', id: 1 },
     *    { name: 'preview', id: 5},
     * ])
     *
     * @param {string} firstParam[][0] - Name of the layer.
     * @param {number} firstParam[][1] - Id of the layer.
     * @example
     * Emitter.setLayersMap([
     *    ['fileBrowsing', 1],
     *    ['preview', 5],
     * ])
     *
     * @param {number} firstParam[][0] - Id of the layer.
     * @param {string} firstParam[][1] - Name of the layer.
     * @example
     * Emitter.setLayersMap([
     *    [1, 'fileBrowsing'],
     *    [5, 'preview'],
     * ])
     *
     * @param {Object.<string, number>} firstParam - Map of the Layers with name/id pairs.
     * @example
     * Emitter.setLayersMap({
     *    fileBrowsing: 1,
     *    preview: 5
     * })
     *
     * @param {string|number} secondParam - Name or id of the Layer.
     * @example
     * Emitter.setLayersMap('fileBrowsing', 1);
     * @example
     * Emitter.setLayersMap(1, 'fileBrowsing');
     *
     * @returns {number} Count of the set names;
     */
    static setLayersMap(firstParam: string | number | {
        name: string;
        id: number;
    } | (string | number)[] | {
        name: string;
        id: number;
    }[] | (string | number)[][] | {
        [key: string]: number;
    }, secondParam?: number | string): number;
    private static setLayerMap;
    private static setLayerMapFromObject;
    private static setLayerMapFromArray;
    private static setGeneralListeners;
    private static getEventKeyCode;
    private static checkInputTarget;
    private static checkMainOptions;
    private static getListenersTarget;
    private static clearDownLists;
    private static clearLayerDownLists;
    private static clearPredefinedLayersDownLists;
    private readonly subscribeType;
    private readonly releaseDelay;
    private readonly id;
    private downList;
    private releaseDictionary;
    private pressReleaseDictionary;
    private keyDownListeners;
    private keyPressListeners;
    private keyUpListeners;
    private keyReleaseListeners;
    private pressReleaseListeners;
    /**
     * Constructor of the class.
     * @param {boolean|number|string} subscribeType - Layer type,
     * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
     * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
     * 5 - add to the layer with index 5.
     * @param {number} releaseDelay - Delay between keyDown and keyUp events for
     * fires keyRelease event.
     */
    constructor(subscribeType: boolean | number | string, releaseDelay?: number);
    clearDownList(): void;
    addListener(type: string, callback: (e: KeyboardEvent) => void, options?: ListenerOptions): () => void;
    removeListener(type: string, callback: (e: KeyboardEvent) => void): void;
    destroy(): void;
    private addListeners;
    private removeListeners;
    private pressHandler;
    private downHandler;
    private upHandler;
    private executeCallback;
    private executeReleaseCallback;
    private checkCodeOptions;
    private checkReleaseCodeOptions;
}
