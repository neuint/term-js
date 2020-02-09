import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';
import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';

export default interface IVirtualizedList<T extends IVirtualizedItem> extends ITemplateEngine {
  append(item: T, virtual?: boolean): void;
  remove(item: T): void;
  getVirtualItemsContainer(): Element | undefined;
  getGeneralItemsContainer(): Element | undefined;
  getItems(): T[];
  getVirtualItems(): T[];
  getGeneralItems(): T[];
  scrollBottom(): void;
}
