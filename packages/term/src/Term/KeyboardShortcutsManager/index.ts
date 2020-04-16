import { Emitter, EMITTER_TOP_LAYER_TYPE } from 'key-layers-js';
import { v1 as guid } from 'uuid';

import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
import {
  ActionShortcutType,
  NormalizedActionShortcutType,
} from '@Term/KeyboardShortcutsManager/types';
import { isArray, isNumber } from 'lodash-es';
import { checkArraysEqual } from '@Term/utils/array';

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

  private emitter?: Emitter;

  private shortcutsMapField: { [action: string]: ActionShortcutType | ActionShortcutType[] } = {};
  public get shortcutsMap(): { [action: string]: ActionShortcutType | ActionShortcutType[] } {
    return this.shortcutsMapField;
  }

  private listeners: {
    [actions: string]: ((action: string, e: Event) => void | boolean)[];
  } = {};
  private actionHandler?: (action: string, e: Event) => void;
  private readonly unlockKey: string;
  private isLock: boolean = false;
  private lockWhiteList: string[] = [];

  constructor(params: { onAction?: (action: string, e: Event) => void } = {}, unlockKey?: string) {
    this.actionHandler = params.onAction;
    this.unlockKey = unlockKey || guid();
  }

  public addListener(
    action: string, callback: (action: string, e: Event) => void | boolean,
  ): void {
    const { listeners } = this;
    if (!listeners[action]) listeners[action] = [];
    listeners[action].push(callback);
  }

  public removeListener(callback: (action: string, e: Event) => void | boolean): void {
    const { listeners } = this;
    Object.keys(listeners).some((action: string) => {
      const index = listeners[action].indexOf(callback);
      if (index >= 0) {
        listeners[action].splice(index, 1);
        return true;
      }
      return false;
    });
  }

  public addShortcut(action: string, shortcut: ActionShortcutType) {
    const { shortcutsMapField } = this;
    const shortcutIndex = this.getShortcutIndex(action, shortcut);
    if (shortcutIndex >= 0) return;
    if (!shortcutsMapField[action]) shortcutsMapField[action] = [];
    if (!isArray(shortcutsMapField[action])) {
      shortcutsMapField[action] = [shortcutsMapField[action] as ActionShortcutType];
    }
    (shortcutsMapField[action] as ActionShortcutType[]).push(shortcut);
    this.deactivate();
    this.activate();
  }

  public removeShortcut(action: string, shortcut?: ActionShortcutType) {
    const { shortcutsMapField } = this;
    if (!shortcut) return delete shortcutsMapField[action];
    const shortcutIndex = this.getShortcutIndex(action, shortcut);
    if (shortcutIndex === true) return delete shortcutsMapField[action];
    if (shortcutIndex >= 0) {
      (shortcutsMapField[action] as ActionShortcutType[]).splice(shortcutIndex as number, 1);
      this.deactivate();
      this.activate();
    }
  }

  public activate() {
    if (!this.emitter) {
      this.emitter = new Emitter(EMITTER_TOP_LAYER_TYPE);
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
    if (this.isLock) return;
    this.isLock = true;
    this.lockWhiteList = whiteList;
    return () => this.unlock(this.unlockKey);
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
    const isFirstIndex = (isNumber(info) && info === shortcut || isArray(info) && isNumber(info[0]))
        && KeyboardShortcutsManager.checkShortcutsEqual(info as ActionShortcutType, shortcut);
    if (isFirstIndex) return true;
    return (info as ActionShortcutType[])
      .findIndex(item => KeyboardShortcutsManager.checkShortcutsEqual(item, shortcut));
  }

  private addListeners() {
    const { emitter, shortcutsMapField, listeners, actionHandler, isLock, lockWhiteList } = this;
    if (!emitter) return;
    Object.keys(shortcutsMapField).forEach((action) => {
      const info = shortcutsMapField[action];
      const list: ActionShortcutType[] = (isNumber(info) || (isArray(info) && isNumber(info[0]))
        ? [info] : info) as ActionShortcutType[];
      list.map(KeyboardShortcutsManager.getNormalizedShortcut).forEach((item) => {
        emitter.addListener('keyDown', (e: Event) => {
          if (isLock && !lockWhiteList.includes(action)) return;
          const callbackList = listeners[action];
          if (callbackList) callbackList.some(callback => callback(action, e));
          if (actionHandler) actionHandler(action, e);
        }, item);
      });
    });
  }
}

export default KeyboardShortcutsManager;
