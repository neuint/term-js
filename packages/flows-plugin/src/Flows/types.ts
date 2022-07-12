import { FormattedValueFragmentType } from '@neuint/term-js';

export type StepResultType = {
  to?: string,
  data?: string | FormattedValueFragmentType,
  duration?: number,
  withSubmit?: boolean,
};

export type FlowType = Array<{
  autostart?: boolean,
  onEnter?: (data: { [key: string]: string }) => void;
  write?: { data: string | FormattedValueFragmentType, duration?: number, withSubmit?: boolean };
  variableName?: string;
  secret?: boolean;
  handler?: (data: { [key: string]: string }) => Promise<StepResultType | undefined>;
}>;

export type FlowsType = { [key: string]: FlowType };
