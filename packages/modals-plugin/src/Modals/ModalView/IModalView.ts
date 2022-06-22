import { ITemplateEngine } from '@neuint/term-js';

export default interface IModalView extends ITemplateEngine {
  getModalView(): HTMLElement | undefined;
}
