import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';

export default interface ILine extends ITemplateEngine {
  value: string;
  stopEdit(): void;
  focus(): void;
  updateViewport(): void;
  destroy(): void;
}
