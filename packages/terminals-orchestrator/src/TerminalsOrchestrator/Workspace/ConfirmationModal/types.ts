export type OptionsType = {
  title?: string;
  text: string;
  submit: string;
  cancel: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};
