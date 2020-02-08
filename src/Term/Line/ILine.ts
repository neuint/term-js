import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';

export default interface ILine extends ITemplateEngine {
  height: number;
  value: string;
  stopEdit(): void;
  focus(): void;
  updateViewport(): void;
  setCaret(name: string): void;
  destroy(): void;
  moveCaretToEnd(): void;
  hide(): void;
  show(): void;
}
