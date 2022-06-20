import BaseCaret from '../BaseCaret';
import ICaret from '../BaseCaret/ICaret';

import SimpleCaretTemplate from './template.html';

import './index.scss';

class SimpleCaret extends BaseCaret implements ICaret {
  constructor(container: Element) {
    super(SimpleCaretTemplate, container);
    this.render();
  }

  protected updateLockStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { lock, prevLock } = this;
    if (!root || lock === prevLock) return;
    if (lock) {
      root.classList.add('SimpleCaret--lock');
    } else {
      root.classList.remove('SimpleCaret--lock');
    }
  }

  protected updateBusyStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { busy, prevBusy } = this;
    if (!root || busy === prevBusy) return;
    if (busy) {
      root.classList.add('SimpleCaret--busy');
    } else {
      root.classList.remove('SimpleCaret--busy');
    }
  }

  protected updateHiddenStyles() {
    const root = this.getRef('root') as HTMLElement;
    const { hidden, prevHidden } = this;
    if (!root || hidden === prevHidden) return;
    if (hidden) {
      root.classList.add('SimpleCaret--hidden');
    } else {
      root.classList.remove('SimpleCaret--hidden');
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
