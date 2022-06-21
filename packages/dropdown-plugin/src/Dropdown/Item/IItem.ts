import { ITemplateEngine } from '@neuint/term-js';

export default interface IItem extends ITemplateEngine {
  index: number;
  active: boolean;
}
