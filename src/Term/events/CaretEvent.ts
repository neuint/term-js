import ICaret from '@Term/BaseCaret/ICaret';

class CaretEvent {
  public readonly position: number;
  public readonly caret?: ICaret;

  constructor(position: number, caret?: ICaret) {
    this.position = position;
    this.caret = caret;
  }
}

export default CaretEvent;
