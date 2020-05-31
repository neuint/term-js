import { ITemplateEngine } from '@term-js/term';

export default interface IContentWindow extends ITemplateEngine {
  position: { left: number; right: number; top: number; bottom: number };
  lockSelection: boolean;
  zIndex: number;
}
