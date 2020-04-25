export type ActionType = {
  text: string;
  onClick?: (e: Event) => {},
  type?: 'submit' | 'general';
};

export type OptionsType = {
  overlayHide?: boolean;
  closeButton?: boolean;
  content: string | HTMLElement;
  title?: string;
  actions?: ActionType[] | ActionType[][];
  onClose?: () => void;
};
