export declare type HiddenListOptionsType = {
    onSelect?: (index: number, e: Event) => void;
    onClose?: () => void;
    items: {
        text: string;
        id: number;
    }[];
    position?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    className?: string;
};
