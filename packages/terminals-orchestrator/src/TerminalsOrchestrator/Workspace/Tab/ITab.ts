import { ITemplateEngine } from '@term-js/term';
import { EventHandlerType, EventType } from '@TerminalsOrchestrator/Workspace/Tab/types';

export default interface ITab extends ITemplateEngine {
  shortcutIndex: number;
  index: number;
  width: number;
  title: string;
  active: boolean;
  invisible: boolean;
  hidden: boolean;
  left: number;
  disabledHover: boolean;
  addEventListener(event: EventType, handler: EventHandlerType): void;
  removeEventListener(event: EventType, handler: EventHandlerType): void;
}
