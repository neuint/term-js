import { ITemplateEngine } from '@term-js/term';

export default interface IStatusView extends ITemplateEngine {
  text: string;
  icon: string;
}
