import { WriteType } from '@general/types/write';

export type StepResultType = {
  to?: string,
  write?: WriteType,
};

export type StepType = {
  autostart?: boolean,
  onEnter?: (data: { [key: string]: string }) => void;
  write?: WriteType | ((data: { [key: string]: string }) => WriteType);
  onWrite?: (data: { [key: string]: string }) => void;
  variableName?: string;
  secret?: boolean;
  handler?: (data: { [key: string]: string }) => Promise<StepResultType | undefined>;
};

export type FlowType = StepType[];

export type FlowsType = { [key: string]: FlowType };
