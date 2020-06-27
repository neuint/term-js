export declare type ActionType = {
    text: string;
    onClick?: (e: Event) => {};
    type?: 'submit' | 'general';
};
export declare type OptionsType = {
    isAbsolute?: boolean;
    className?: string;
    overlayHide?: boolean;
    closeButton?: boolean;
    content: string | HTMLElement;
    title?: string;
    actions?: ActionType[] | ActionType[][];
    onClose?: () => void;
};
