import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';
import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';

export default interface IVirtualizedList<T extends IVirtualizedItem<any>> extends ITemplateEngine {
  length: number;
  getVirtualItemsContainer(): Element | undefined;
  getGeneralItemsContainer(): Element | undefined;
  scrollBottom(): void;
}
