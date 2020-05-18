import { ITemplateEngine } from '@term-js/term';

export interface IWorkspace extends ITemplateEngine {
  untitledName: string;
  tabs: string[];
  activeTab: number;
}
