import ICaret from '../BaseCaret/ICaret';
export default interface ICaretFactory {
    create(name: string, container: Element): ICaret | null;
}
