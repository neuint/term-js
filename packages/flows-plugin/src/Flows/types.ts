import { WriteType } from '@general/types/write';

export type StepResultType = {
  to?: string,
  write?: WriteType,
};

export type StepType = {
  autostart?: boolean,
  before?: (data: { [key: string]: string }) => undefined | WriteType;
  onEnter?: (data: { [key: string]: string }) => undefined | WriteType;
  write?: WriteType | ((data: { [key: string]: string }) => WriteType);
  onWrite?: (data: { [key: string]: string }) => void | Promise<StepResultType | undefined>;
  variableName?: string;
  secret?: boolean;
  handler?: (data: { [key: string]: string }) => Promise<StepResultType | undefined>;
  onExit?: (data: { [key: string]: string }) => void;
};

export type FlowType = StepType[];

export type FlowsType = { [key: string]: FlowType };
