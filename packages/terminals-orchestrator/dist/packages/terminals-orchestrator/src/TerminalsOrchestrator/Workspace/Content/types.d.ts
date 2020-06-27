import IContentWindow from './ContentWindow/IContentWindow';
import { MoveType } from './ContentWindow/types';
export declare type OptionsType = {
    className?: string;
    hidden?: boolean;
    localization?: {
        [key: string]: string;
    };
    id: number;
};
export declare type AnchorPointType = {
    position: number;
    startOffset: number;
    endOffset: number;
};
export declare type MoveInfoType = {
    contentWindow: IContentWindow;
    type: MoveType;
    startPosition: {
        left: number;
        top: number;
    };
    startOffsets: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
};
