import ICaretFactory from '@Term/CaretFactory/ICaretFactory';
import SimpleCaret from '@Term/SimpleCaret';
import ICaret from '@Term/BaseCaret/ICaret';

class CaretFactory implements ICaretFactory {
  private static instance: CaretFactory;
  private static caretMap: { [name: string]: new (container: Element) => ICaret } = {
    simple: SimpleCaret,
  };

  public static registerCaret(name: string, caret: new (container: Element) => ICaret) {
    CaretFactory.caretMap[name] = caret;
  }

  private constructor() {}

  public static getInstance(): CaretFactory {
    if (!CaretFactory.instance) CaretFactory.instance = new CaretFactory();

    return CaretFactory.instance;
  }

  public create(name: string, container: Element): ICaret | null {
    return CaretFactory.caretMap[name]
      ? new CaretFactory.caretMap[name](container) : null;
  }
}

export default CaretFactory;
