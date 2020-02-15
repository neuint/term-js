import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';
import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';

export default interface ILine extends ITemplateEngine, IVirtualizedItem<ITemplateEngine> {
  value: string;
  stopEdit(): void;
  focus(): void;
  updateViewport(): void;
  setCaret(name: string): void;
  destroy(): void;
  moveCaretToEnd(): void;
  clear(): void;
}
