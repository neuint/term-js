import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';

export default interface ICaret extends ITemplateEngine {
  lock: boolean;
  busy: boolean;
  hidden: boolean;
  setPosition(left: number, top: number): void;
  setValue(value: string): void;
}
