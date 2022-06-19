import IVirtualizedItem from './IVirtualizedItem';
import ITemplateEngine from '../TemplateEngine/ITemplateEngine';
export default interface IVirtualizedList<T extends IVirtualizedItem<any>> extends ITemplateEngine {
    length: number;
    getVirtualItemsContainer(): Element | undefined;
    getGeneralItemsContainer(): Element | undefined;
    scrollBottom(): void;
    updateViewport(): void;
    clearCache(): void;
}
