import { IPlugin } from '@neuint/term-js';
import { ModalOptionsType } from './types';

export default interface IModals extends IPlugin {
  show(options: ModalOptionsType): () => void;
  hide(uuid: string): void;
}
