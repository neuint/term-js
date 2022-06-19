import ICaret from '../BaseCaret/ICaret';
declare class CaretEvent {
    readonly position: number;
    readonly caret?: ICaret;
    constructor(position: number, caret?: ICaret);
}
export default CaretEvent;
