export type TabOptionsType = {
  active?: boolean;
  title?: string;
  index?: number;
  invisible?: boolean;
};

export type ClickEventHandlerType = (index: number, e: Event) => void;
export type DragEventHandlerType = (index: number, e: DragEvent) => void;

export type EventHandlerType = ClickEventHandlerType | DragEventHandlerType;

export type EventType = 'click' | 'close' | 'drag' | 'dragend';
