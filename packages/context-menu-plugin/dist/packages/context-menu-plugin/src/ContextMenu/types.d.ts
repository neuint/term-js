export declare type TargetType = 'position' | 'end of line';
export declare type PositionType = {
    left: number;
    top: number;
};
export declare type ShowOptionsType = {
    position?: PositionType;
    escHide?: boolean;
    aroundClickHide?: boolean;
    onHide?: () => void;
};
