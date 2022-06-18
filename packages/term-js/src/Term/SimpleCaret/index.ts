import BaseCaret from '../BaseCaret';
import ICaret from '../BaseCaret/ICaret';

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
    if (lock) {
      root.classList.add(css.lock);
    } else {
      root.classList.remove(css.lock);
    }
  }

  protected updateBusyStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { busy, prevBusy } = this;
    if (!root || busy === prevBusy) return;
    if (busy) {
      root.classList.add(css.busy);
    } else {
      root.classList.remove(css.busy);
    }
  }

  protected updateHiddenStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { hidden, prevHidden } = this;
    if (!root || hidden === prevHidden) return;
    if (hidden) {
      root.classList.add(css.hidden);
    } else {
      root.classList.remove(css.hidden);
    }
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
