import TemplateEngine from '@Term/TemplateEngine';
import ICaret from '@Term/BaseCaret/ICaret';

abstract class BaseCaret extends TemplateEngine implements ICaret {
  protected value: string = '';
  protected prevLock: boolean = false;
  private lockField: boolean = false;
  public get lock(): boolean {
    return this.lockField;
  }
  public set lock(value: boolean) {
    this.lockField = value;
    this.updateStyles();
  }

  protected prevBusy: boolean = false;
  private busyField: boolean = false;
  public get busy(): boolean {
    return this.busyField;
  }
  public set busy(value: boolean) {
    this.busyField = value;
    this.updateStyles();
  }

  protected prevHidden: boolean = false;
  private hiddenField: boolean = false;
  public get hidden(): boolean {
    return this.hiddenField;
  }
  public set hidden(value: boolean) {
    this.hiddenField = value;
    this.updateStyles();
  }

  private left: number = 0;
  private prevLeft: number = 0;
  private top: number = 0;
  private prevTop: number = 0;

  public setPosition(left: number, top: number) {
    this.left = left;
    this.top = top;
    this.updateStyles();
  }

  protected abstract updateLockStyles(): void;

  protected abstract updateBusyStyles(): void;

  protected abstract updateHiddenStyles(): void;

  public abstract setValue(value: string): void;

  private updateStyles() {
    const { lock, busy, hidden, left, prevLeft, top, prevTop } = this;
    const root = this.getRef('root') as HTMLElement;
    if (!root) return;
    if (left !== prevLeft) root.style.left = `${left}px`;
    if (top !== prevTop) root.style.top = `${top}px`;
    this.updateLockStyles();
    this.updateBusyStyles();
    this.updateHiddenStyles();
    this.prevLeft = left;
    this.prevTop = top;
    this.prevLock = lock;
    this.prevBusy = busy;
    this.prevHidden = hidden;
  }
}

export default BaseCaret;
