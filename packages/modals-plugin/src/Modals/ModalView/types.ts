export type ActionType = {
  text: string;
  onClick?: (e: Event) => void;
  type?: 'submit' | 'general';
};

export type OptionsType = {
  isAbsolute?: boolean;
  className?: string;
  overlayHide?: boolean;
  closeButton?: boolean;
  content: string | HTMLElement;
  title?: string;
  actions?: ActionType[] | ActionType[][];
  onClose?: () => void;
};
