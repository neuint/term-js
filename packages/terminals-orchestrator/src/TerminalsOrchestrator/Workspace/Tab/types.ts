export type TabOptionsType = {
  active?: boolean;
  title?: string;
  index?: number;
  invisible?: boolean;
  localizations?: { [key: string]: string };
};

export type ClickEventHandlerType = (index: number, e: Event) => void;
export type RenameEventHandlerType = (index: number, name: string) => void;
export type DragEventHandlerType = (index: number, e: DragEvent) => void;

export type EventHandlerType = ClickEventHandlerType | DragEventHandlerType | RenameEventHandlerType;

export type EventType = 'click' | 'close' | 'drag' | 'dragend' | 'rename';
