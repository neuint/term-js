import { FC } from 'react';
import { FlowsType } from '@neuint/flows-plugin';
import { ITerm } from '@neuint/term-js';
export type { FlowsType, IFlows } from '@neuint/flows-plugin';
declare type PropsType = {
    term?: ITerm;
    flows?: FlowsType;
};
declare const FlowsComponent: FC<PropsType>;
export default FlowsComponent;
