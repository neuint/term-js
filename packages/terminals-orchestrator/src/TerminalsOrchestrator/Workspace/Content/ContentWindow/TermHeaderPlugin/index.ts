import { IKeyboardShortcutsManager, ITermInfo, Plugin } from '@term-js/term';
import ITermHeaderPlugin from './ITermHeaderPlugin';
import { OptionsType } from './types';

class TermHeaderPlugin extends Plugin implements ITermHeaderPlugin {
  private options: OptionsType;

  constructor(options: OptionsType) {
    super();
    this.options = options;
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    const { title } = termInfo.elements;
    if (title) {
      (title as HTMLElement).setAttribute('data-type', 'header');
      this.addListeners();
    }
  }

  public destroy() {
    this.removeListeners();
    super.destroy();
  }

  private addListeners() {
    const { termInfo, options: { onStartMove } } = this;
    const title = (termInfo as ITermInfo).elements.title as HTMLElement;
    if (!title || !onStartMove) return;
    title.addEventListener('mousedown', onStartMove);
  }

  private removeListeners() {
    const { termInfo, options: { onStartMove } } = this;
    const title = (termInfo as ITermInfo).elements.title as HTMLElement;
    if (!title || !onStartMove) return;
    title.removeEventListener('mousedown', onStartMove);
  }
}

export default TermHeaderPlugin;
