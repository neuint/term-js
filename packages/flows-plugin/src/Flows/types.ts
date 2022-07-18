import { WriteType } from '@general/types/write';

export type StepResultType = {
  to?: string,
  write?: WriteType,
};

export type FlowType = Array<{
  autostart?: boolean,
  onEnter?: (data: { [key: string]: string }) => void;
  write?: WriteType | ((data: { [key: string]: string }) => WriteType);
  variableName?: string;
  secret?: boolean;
  handler?: (data: { [key: string]: string }) => Promise<StepResultType | undefined>;
}>;

export type FlowsType = { [key: string]: FlowType };
