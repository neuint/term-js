import { EditLineParamsType, ValueType } from '@Term/types';
import ITermEventMap from '@Term/ITermEventMap';

export default interface ITermInfo {
  elements: {
    root?: Element;
    edit?: Element;
    title?: Element;
  };
  labelParams: { label?: string; delimiter?: string };
  title: string;
  caretPosition: number;
  lines: string[];
  editLine: string;
  parameterizedLines: ValueType[];
  parameterizedEditLine: EditLineParamsType;
  updateLines: (lines: ValueType[]) => void;
  updateEditLine: (params: EditLineParamsType) => void;
  setCaretPosition: (position: number) => void;
  addEventListener<K extends keyof ITermEventMap>(
    type: K,
    handler: (e: ITermEventMap[K]) => void,
    options?: EventListenerOptions,
  ): void;
  removeEventListener<K extends keyof ITermEventMap>(
    type: K,
    handler: (e: ITermEventMap[K]) => void,
    options?: EventListenerOptions,
  ): void;
  setLabel(params?: { label?: string; delimiter?: string }): void;
}
