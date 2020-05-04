import { ITemplateEngine } from '@term-js/term';

export default interface ITabs extends ITemplateEngine {
  tabs: string[];
  activeTab: number;
}
