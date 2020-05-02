/* tslint:disable:no-empty-interface */
import { IPlugin } from '@term-js/term';
import { ModalOptionsType } from '@Modals/types';

export default interface IModals extends IPlugin {
  show(options: ModalOptionsType): () => void;
  hide(uuid: string): void;
}
