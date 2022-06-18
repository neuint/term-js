import {
  TermInfoCaretType,
  TermInfoEditType,
  TermInfoElementsType,
  TermInfoLabelType,
  TermInfoLinesTypes,
} from '../types';
import ITermEventMap from './ITermEventMap';

export default interface ITermInfo {
  title: string;
  elements: TermInfoElementsType;
  label: TermInfoLabelType;
  caret: TermInfoCaretType;
  edit: TermInfoEditType;
  lines: TermInfoLinesTypes;
  history: string[];
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
}
