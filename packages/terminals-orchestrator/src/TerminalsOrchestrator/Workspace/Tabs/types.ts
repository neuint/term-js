export type EventHandlerType = ((index: number, e: Event) => void) | (() => void);
export type EventType = 'focus' | 'close' | 'add';
export type TabEventType = 'click' | 'close' | 'drag' | 'dragend';
