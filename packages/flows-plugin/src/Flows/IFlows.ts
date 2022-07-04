import { IPlugin } from '@neuint/term-js';

import { FlowsType } from './types';

export default interface IFlows extends IPlugin {
  flows: FlowsType;
}
