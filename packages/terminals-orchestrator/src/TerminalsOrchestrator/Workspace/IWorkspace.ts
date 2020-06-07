import { ITemplateEngine } from '@term-js/term';
import { TabInfoType } from '@TerminalsOrchestrator/Workspace/Tabs/types';

export interface IWorkspace extends ITemplateEngine {
  untitledName: string;
  tabs: (string | TabInfoType)[];
  activeTab: number;
}
