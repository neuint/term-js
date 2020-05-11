import { ITemplateEngine } from '@term-js/term';

export default interface ITab extends ITemplateEngine {
  index: number;
  width: number;
  title: string;
  active: boolean;
  invisible: boolean;
  hidden: boolean;
}
