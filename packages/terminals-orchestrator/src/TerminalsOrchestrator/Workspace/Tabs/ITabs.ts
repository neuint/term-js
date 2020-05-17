import { ITemplateEngine } from '@term-js/term';
import { EventHandlerType, EventType } from '@TerminalsOrchestrator/Workspace/Tabs/types';

export default interface ITabs extends ITemplateEngine {
  tabs: string[];
  activeTab: number;
  addEventListener(event: EventType, handler: EventHandlerType): void;
  removeEventListener(event: EventType, handler: EventHandlerType): void;
}
