import SubmitEvent from './events/SubmitEvent';
import ActionEvent from './events/ActionEvent';

export default interface ITermEventMap {
  submit: SubmitEvent;
  action: ActionEvent;
  focus: FocusEvent;
  blur: FocusEvent;
  keydown: KeyboardEvent;
  keypress: KeyboardEvent;
  keyup: KeyboardEvent;
}
