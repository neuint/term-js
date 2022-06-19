import TemplateEngine from '../TemplateEngine';
import ICaret from './ICaret';
declare abstract class BaseCaret extends TemplateEngine implements ICaret {
    protected value: string;
    protected prevLock: boolean;
    private lockField;
    get lock(): boolean;
    set lock(value: boolean);
    protected prevBusy: boolean;
    private busyField;
    get busy(): boolean;
    set busy(value: boolean);
    protected prevHidden: boolean;
    private hiddenField;
    get hidden(): boolean;
    set hidden(value: boolean);
    private left;
    private prevLeft;
    private top;
    private prevTop;
    setPosition(left: number, top: number): void;
    protected abstract updateLockStyles(): void;
    protected abstract updateBusyStyles(): void;
    protected abstract updateHiddenStyles(): void;
    abstract setValue(value: string): void;
    private updateStyles;
}
export default BaseCaret;
