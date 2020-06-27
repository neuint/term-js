export declare type TabOptionsType = {
    active?: boolean;
    title?: string;
    index?: number;
    invisible?: boolean;
    localizations?: {
        [key: string]: string;
    };
};
export declare type ClickEventHandlerType = (index: number, e: Event) => void;
export declare type RenameEventHandlerType = (index: number, name: string) => void;
export declare type DragEventHandlerType = (index: number, e: DragEvent) => void;
export declare type EventHandlerType = ClickEventHandlerType | DragEventHandlerType | RenameEventHandlerType;
export declare type EventType = 'click' | 'close' | 'drag' | 'dragend' | 'rename';
