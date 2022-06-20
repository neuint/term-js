import './index.scss';
import IInput from '../IInput';
import BaseInput from '../BaseInput';
import { ValueType } from '../../../types';
declare class ViewableInput extends BaseInput implements IInput {
    set value(val: ValueType);
    constructor(container?: Element);
    render(): void;
    protected getRootElement(): Element | undefined;
}
export default ViewableInput;
