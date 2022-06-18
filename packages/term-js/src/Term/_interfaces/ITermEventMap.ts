import ValueEvent from '../_events/ValueEvent';
import ActionEvent from '../_events/ActionEvent';
import CaretEvent from '../_events/CaretEvent';

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
