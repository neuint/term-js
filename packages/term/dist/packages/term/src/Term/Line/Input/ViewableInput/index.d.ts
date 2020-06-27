import IInput from '@Term/Line/Input/IInput';
import BaseInput from '@Term/Line/Input/BaseInput';
import { ValueType } from '@Term/types';
declare class ViewableInput extends BaseInput implements IInput {
    set value(val: ValueType);
    constructor(container?: Element);
    render(): void;
    protected getRootElement(): Element | undefined;
}
export default ViewableInput;
