import IContentWindow from './ContentWindow/IContentWindow';
import { MoveType } from './ContentWindow/types';

export type OptionsType = {
  className?: string;
  hidden?: boolean;
  localization?: { [key: string]: string };
  id: number;
};

export type AnchorPointType = { position: number; startOffset: number; endOffset: number };

export type MoveInfoType = {
  contentWindow: IContentWindow;
  type: MoveType;
  startPosition: { left: number; top: number };
  startOffsets: { left: number; right: number; top: number; bottom: number };
};
