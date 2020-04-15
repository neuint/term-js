export type TargetType = 'position' | 'end of line';
export type PositionType = { left: number; top: number };
export type ShowOptionsType = {
  position?: PositionType;
  escHide?: boolean;
  aroundClickHide?: boolean;
};
