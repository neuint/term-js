import { Emitter } from 'key-layers-js';
import { isArray, isNumber } from 'lodash-es';
import { v1 as guid } from 'uuid';

import IKeyboardShortcutsManager from './IKeyboardShortcutsManager';
import {
  ActionShortcutType, CallbackInfoType,
  NormalizedActionShortcutType,
  ShortcutMapItemType,
} from './types';
import { checkArraysEqual } from '../_utils/array';
import { InfoType } from '../types';

class KeyboardShortcutsManager implements IKeyboardShortcutsManager {
  private static checkShortcutsEqual(
    first: ActionShortcutType, second: ActionShortcutType,
  ): boolean {
    const firstNormalized = KeyboardShortcutsManager.getNormalizedShortcut(first);
    const secondNormalized = KeyboardShortcutsManager.getNormalizedShortcut(second);
    return firstNormalized.ctrlKey === secondNormalized.ctrlKey
      && firstNormalized.metaKey === secondNormalized.metaKey
      && firstNormalized.altKey === secondNormalized.altKey
      && firstNormalized.shiftKey === secondNormalized.shiftKey
      && checkArraysEqual<number>(firstNormalized.codes, secondNormalized.codes);
  }

  private static getNormalizedShortcut(shortcut: ActionShortcutType): NormalizedActionShortcutType {
    const normalizedShortcut: NormalizedActionShortcutType = {
      codes: [], ctrlKey: false, metaKey: false, altKey: false, shiftKey: false,
    };
    if (isNumber(shortcut)) {
      normalizedShortcut.codes = [shortcut];
    } else if (isArray(shortcut) && isNumber(shortcut[0])) {
      normalizedShortcut.codes = shortcut;
    } else {
      normalizedShortcut.codes = isArray((shortcut as { code: number | number[] }).code)
        ? (shortcut as { code: number[] }).code : [(shortcut as { code: number }).code];
      normalizedShortcut.ctrlKey = (shortcut as { ctrl?: boolean }).ctrl
        || normalizedShortcut.ctrlKey;
      normalizedShortcut.metaKey = (shortcut as { meta?: boolean }).meta
        || normalizedShortcut.metaKey;
      normalizedShortcut.altKey = (shortcut as { alt?: boolean }).alt || normalizedShortcut.altKey;
      normalizedShortcut.shiftKey = (shortcut as { shift?: boolean }).shift
        || normalizedShortcut.shiftKey;
    }
    return normalizedShortcut;
  }

  private layerField = 1;

  public get layer(): number {
    return this.layerField;
  }

  public set layer(val: number) {
    const { layerField, emitter } = this;
    if (layerField === val) return;
    this.layerField = val;
    if (emitter) emitter.updateLayerType(val);
  }

  private emitter?: Emitter;

  private shortcutsMapField: { [action: string]: ShortcutMapItemType[] } = {};

  private listeners: {
    [actions: string]: {
      callback: (action: string, e: Event, info?: CallbackInfoType) => void | boolean;
      info?: InfoType;
    }[];
  } = {};

  private actionHandler?: (action: string, e: Event) => void;

  private readonly unlockKey: string;

  private isLock = false;

  private lockWhiteList: string[] = [];

  constructor(params?: { onAction?: (action: string, e: Event) => void }, unlockKey?: string) {
    this.actionHandler = (params || {}).onAction;
    this.unlockKey = unlockKey || guid();
  }

  public addListener(
    action: string,
    callback: (action: string, e: Event, info?: CallbackInfoType) => void | boolean,
    info?: InfoType,
  ): void {
    const { listeners } = this;
    if (!listeners[action]) listeners[action] = [];
    listeners[action].push({ callback, info });
  }

  public removeListener(
    callback: (action: string, e: Event, info?: CallbackInfoType) => void | boolean,
  ): void {
    const { listeners } = this;
    Object.keys(listeners).some((action: string) => {
      const index = listeners[action].findIndex((item) => item.callback === callback);
      if (index >= 0) {
        listeners[action].splice(index, 1);
        return true;
      }
      return false;
    });
  }

  public addShortcut(action: string, shortcut: ActionShortcutType, info?: InfoType) {
    const { shortcutsMapField } = this;
    const shortcutIndex = this.getShortcutIndex(action, shortcut);
    if (shortcutIndex >= 0) return;
    if (!shortcutsMapField[action]) shortcutsMapField[action] = [];
    (shortcutsMapField[action] as ShortcutMapItemType[]).push({
      info, actionShortcut: shortcut,
    });
    this.deactivate();
    this.activate();
  }

  public removeShortcut(action: string, shortcut?: ActionShortcutType) {
    const { shortcutsMapField } = this;
    if (!shortcut) return delete shortcutsMapField[action];
    const shortcutIndex = this.getShortcutIndex(action, shortcut);
    if (shortcutIndex === true) return delete shortcutsMapField[action];
    if (shortcutIndex >= 0) {
      (shortcutsMapField[action] as ShortcutMapItemType[]).splice(shortcutIndex as number, 1);
      this.deactivate();
      this.activate();
    }
    return null;
  }

  public activate() {
    if (!this.emitter) {
      this.emitter = new Emitter(this.layerField);
      this.addListeners();
    }
  }

  public deactivate() {
    const { emitter } = this;
    if (emitter) emitter.destroy();
    delete this.emitter;
  }

  public destroy() {
    this.deactivate();
  }

  public lock(whiteList: string[] = []): (() => void) | undefined {
    if (this.isLock) return undefined;
    this.isLock = true;
    this.lockWhiteList = whiteList;
    return () => {
      this.unlock(this.unlockKey);
    };
  }

  public unlock(key: string) {
    if (this.unlockKey === key) {
      this.isLock = false;
      this.lockWhiteList = [];
    }
  }

  private getShortcutIndex(action: string, shortcut: ActionShortcutType): number | boolean {
    const info = this.shortcutsMapField[action];
    if (!info) return -1;
    return (info as ShortcutMapItemType[]).findIndex(
      (item) => KeyboardShortcutsManager.checkShortcutsEqual(item.actionShortcut, shortcut),
    );
  }

  private addListeners() {
    const { emitter, shortcutsMapField, listeners, actionHandler, isLock, lockWhiteList } = this;
    if (!emitter) return;
    Object.keys(shortcutsMapField).forEach((action) => {
      shortcutsMapField[action].forEach((item) => {
        const { info: shortcut } = item;
        const actionShortcut = KeyboardShortcutsManager.getNormalizedShortcut(item.actionShortcut);
        emitter.addListener('keyDown', (e: Event) => {
          if (isLock && !lockWhiteList.includes(action)) return;
          const callbackList = listeners[action];
          if (callbackList) {
            callbackList.some(
              ({ callback, info: listener }) => callback(action, e, { listener, shortcut }),
            );
          }
          if (actionHandler) actionHandler(action, e);
        }, actionShortcut);
      });
    });
  }
}

export default KeyboardShortcutsManager;
