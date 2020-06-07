import { ITemplateEngine } from '@term-js/term';
import IContentWindow from './ContentWindow/IContentWindow';

export default interface IContent extends ITemplateEngine {
  id: number;
  hidden: boolean;
  addContentWindow(): IContentWindow;
}
