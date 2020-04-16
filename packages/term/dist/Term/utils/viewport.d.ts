import { SizeType } from '@Term/types';
export declare const getScrollbarSize: (container?: HTMLElement | undefined) => number;
export declare const getItemSize: (container?: HTMLElement | undefined, save?: boolean) => SizeType;
export declare const compareItemSize: (first: SizeType, second: SizeType) => boolean;
