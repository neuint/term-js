import ICaret from '@Term/BaseCaret/ICaret';
declare class CaretEvent {
    readonly position: number;
    readonly caret?: ICaret;
    constructor(position: number, caret?: ICaret);
}
export default CaretEvent;
