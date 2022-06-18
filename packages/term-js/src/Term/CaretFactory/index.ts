import ICaretFactory from './ICaretFactory';
import SimpleCaret from '../SimpleCaret';
import ICaret from '../BaseCaret/ICaret';

class CaretFactory implements ICaretFactory {
  private static instance: CaretFactory;

  private static caretMap: { [name: string]: new (container: Element) => ICaret } = {
    simple: SimpleCaret,
  };

  public static registerCaret(name: string, caret: new (container: Element) => ICaret) {
    CaretFactory.caretMap[name] = caret;
  }

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): CaretFactory {
    if (!CaretFactory.instance) CaretFactory.instance = new CaretFactory();

    return CaretFactory.instance;
  }

  // TODO: to functional implementation
  // eslint-disable-next-line class-methods-use-this
  public create(name: string, container: Element): ICaret | null {
    return CaretFactory.caretMap[name]
      ? new CaretFactory.caretMap[name](container) : null;
  }
}

export default CaretFactory;
