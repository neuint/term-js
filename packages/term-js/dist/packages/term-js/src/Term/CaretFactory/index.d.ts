import ICaretFactory from './ICaretFactory';
import ICaret from '../BaseCaret/ICaret';
declare class CaretFactory implements ICaretFactory {
    private static instance;
    private static caretMap;
    static registerCaret(name: string, caret: new (container: Element) => ICaret): void;
    private constructor();
    static getInstance(): CaretFactory;
    create(name: string, container: Element): ICaret | null;
}
export default CaretFactory;
