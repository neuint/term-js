export declare type TabEventHandlerType = (index: number, e: Event) => void;
export declare type DragEndEventHandlerType = (tabs: TabInfoType[]) => void;
export declare type EventHandlerType = TabEventHandlerType | DragEndEventHandlerType | (() => void);
export declare type EventType = 'focus' | 'close' | 'add' | 'dragend';
export declare type TabEventType = 'click' | 'close' | 'drag' | 'dragend';
export declare type TabInfoType = {
    title: string;
    id: number;
};
export declare type OptionsType = {
    localizations?: {
        [key: string]: string;
    };
};
