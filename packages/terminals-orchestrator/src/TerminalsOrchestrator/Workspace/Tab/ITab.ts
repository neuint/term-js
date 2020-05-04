import { ITemplateEngine } from '@term-js/term';

export default interface ITab extends ITemplateEngine {
  index: number;
  title: string;
  active: boolean;
}
