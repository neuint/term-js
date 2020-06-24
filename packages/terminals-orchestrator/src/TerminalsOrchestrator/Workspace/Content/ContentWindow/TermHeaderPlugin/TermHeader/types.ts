export type OptionsType = {
  title: string;
  onRename?: (name: string) => void;
  onClose?: () => void;
  onRenaming?: () => void;
};
