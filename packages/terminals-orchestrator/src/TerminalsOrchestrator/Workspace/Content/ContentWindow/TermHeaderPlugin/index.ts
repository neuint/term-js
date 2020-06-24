import css from './index.scss';

import { IKeyboardShortcutsManager, ITermInfo, Plugin } from '@term-js/term';

import ITermHeaderPlugin from './ITermHeaderPlugin';
import { OptionsType } from './types';
import ITermHeader from './TermHeader/ITermHeader';
import TermHeader from './TermHeader';

class TermHeaderPlugin extends Plugin implements ITermHeaderPlugin {
  private termHeader?: ITermHeader;
  private options: OptionsType;

  constructor(options: OptionsType) {
    super();
    this.options = options;
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    const { title } = termInfo.elements;
    if (title) {
      this.addTermHeader();
      this.addListeners();
    }
  }

  public destroy() {
    this.removeListeners();
    this.termHeader?.destroy();
    super.destroy();
  }

  private addListeners() {
    const { termHeader, options: { onStartMove } } = this;
    const draggableElement = termHeader?.draggableElement;
    if (!draggableElement || !onStartMove) return;
    draggableElement.addEventListener('mousedown', onStartMove);
  }

  private removeListeners() {
    const { termHeader, options: { onStartMove } } = this;
    const draggableElement = termHeader?.draggableElement;
    if (!draggableElement || !onStartMove) return;
    draggableElement.removeEventListener('mousedown', onStartMove);
  }

  private addTermHeader() {
    const { termInfo, options: { onClose } } = this;
    if (!termInfo) return;
    const title = (termInfo as ITermInfo).elements.title as HTMLElement;
    const titleText = termInfo.title;
    title.classList.add(css.header);
    this.termHeader = new TermHeader(title, {
      onClose, title: titleText, onRenaming: this.onStartRenaming, onRename: this.onRename,
    });
    this.termHeader.draggableElement.setAttribute('data-type', 'header');
  }

  private onStartRenaming = () => {
    const { termInfo } = this;
    if (!termInfo) return;
    const title = (termInfo as ITermInfo).elements.title as HTMLElement;
    title.classList.add(css.editable);
  }

  private onRename = (name: string) => {
    const { termInfo, options: { onRename } } = this;
    if (!termInfo) return;
    const title = (termInfo as ITermInfo).elements.title as HTMLElement;
    title.classList.remove(css.editable);
    if (onRename) onRename(name);
  }
}

export default TermHeaderPlugin;
