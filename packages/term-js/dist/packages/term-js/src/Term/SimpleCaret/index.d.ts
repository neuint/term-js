import BaseCaret from '../BaseCaret';
import ICaret from '../BaseCaret/ICaret';
declare class SimpleCaret extends BaseCaret implements ICaret {
    constructor(container: Element);
    protected updateLockStyles(): void;
    protected updateBusyStyles(): void;
    protected updateHiddenStyles(): void;
    setValue(value: string): void;
}
export default SimpleCaret;
