import BaseCaret from '@Term/BaseCaret';
import ICaret from '@Term/BaseCaret/ICaret';

import SimpleCaretTemplate from './template.html';

import css from './index.scss';

class SimpleCaret extends BaseCaret implements ICaret {
  constructor(container: Element) {
    super(SimpleCaretTemplate, container);
    this.render({ css });
  }

  protected updateLockStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { lock, prevLock } = this;
    if (!root || lock === prevLock) return;
    return lock ? root.classList.add(css.lock) : root.classList.remove(css.lock);
  }

  protected updateBusyStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { busy, prevBusy } = this;
    if (!root || busy === prevBusy) return;
    return busy ? root.classList.add(css.busy) : root.classList.remove(css.busy);
  }

  protected updateHiddenStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { hidden, prevHidden } = this;
    if (!root || hidden === prevHidden) return;
    return hidden ? root.classList.add(css.hidden) : root.classList.remove(css.hidden);
  }

  public setValue(value: string) {
    const character = this.getRef('character');
    if (character && this.value !== value) {
      this.value = value;
      character.innerHTML = value;
    }
  }
}

export default SimpleCaret;
