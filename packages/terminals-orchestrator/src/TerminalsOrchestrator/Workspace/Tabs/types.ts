export type TabEventHandlerType = (index: number, e: Event) => void;
export type DragEndEventHandlerType = (tabs: TabInfoType[]) => void;
export type EventHandlerType = TabEventHandlerType | DragEndEventHandlerType | (() => void);
export type EventType = 'focus' | 'close' | 'add' | 'dragend';
export type TabEventType = 'click' | 'close' | 'drag' | 'dragend';
export type TabInfoType = { title: string; id: number };
export type OptionsType = {
  localizations?: { [key: string]: string };
};
