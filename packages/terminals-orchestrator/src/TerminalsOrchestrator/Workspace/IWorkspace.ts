import { ITemplateEngine } from '@term-js/term';

export interface IWorkspace extends ITemplateEngine {
  tabs: string[];
  activeTab: number;
}
