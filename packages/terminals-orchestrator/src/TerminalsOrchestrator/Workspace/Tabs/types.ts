export type TabEventHandlerType = (index: number, e: Event) => void;
export type DragEndEventHandlerType = (tabs: string[]) => void;
export type EventHandlerType = TabEventHandlerType | DragEndEventHandlerType | (() => void);
export type EventType = 'focus' | 'close' | 'add' | 'dragend';
export type TabEventType = 'click' | 'close' | 'drag' | 'dragend';
