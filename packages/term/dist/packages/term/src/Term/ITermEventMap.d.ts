import ValueEvent from './events/ValueEvent';
import ActionEvent from './events/ActionEvent';
import CaretEvent from './events/CaretEvent';
export default interface ITermEventMap {
    caretPosition: CaretEvent;
    change: ValueEvent;
    submit: ValueEvent;
    action: ActionEvent;
    focus: FocusEvent;
    blur: FocusEvent;
    keydown: KeyboardEvent;
    keypress: KeyboardEvent;
    keyup: KeyboardEvent;
}
