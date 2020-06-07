import { ITemplateEngine } from '@term-js/term';
import { TabInfoType } from '@TerminalsOrchestrator/Workspace/Tabs/types';

export interface IWorkspace extends ITemplateEngine {
  tabs: (string | TabInfoType)[];
  activeTab: number;
}
