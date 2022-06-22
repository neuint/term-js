import { isArray } from 'lodash-es';
import { TemplateEngine } from '@neuint/term-js';

import template from './template.html';
import './index.scss';

import IModalView from './IModalView';
import { ActionType, OptionsType } from './types';
import {
  DATA_INDEX_ATTRIBUTE_NAME,
  DATA_LINE_ATTRIBUTE_NAME,
  PRIMARY_BUTTON_TYPE,
} from '../constants';

class ModalView extends TemplateEngine implements IModalView {
  private static stopPropagation = (e: Event) => {
    e?.stopPropagation();
  };

  private readonly options: OptionsType;

  private isRendered = false;

  private get normalizedActions(): ActionType[][] {
    const { actions = [] } = this.options;
    if (!actions.length) return [];
    return (isArray(actions[0]) ? actions : [actions]) as ActionType[][];
  }

  constructor(container: HTMLElement, options: OptionsType) {
    super(template, container);
    this.options = options;
    this.render();
  }

  public render() {
    if (this.isRendered) return;
    const {
      title, closeButton, content: optionsContent, actions = [], className = '', isAbsolute = false,
    } = this.options;
    super.render({
      className,
      title,
      closeButton,
      actions: Boolean(actions.length),
      content: typeof optionsContent === 'string' ? optionsContent : '',
    });
    if (isAbsolute) {
      const modal = this.getModalView() as HTMLElement;
      modal.classList.add('ModalView__absoluteModal');
    }
    this.renderActions();
    this.addEventListeners();
    this.isRendered = true;
  }

  public destroy() {
    this.removeEventListeners();
    super.destroy();
  }

  public getModalView(): HTMLElement | undefined {
    return this.getRef('modal') as HTMLElement;
  }

  private renderActions() {
    const { normalizedActions } = this;
    const actionsContainer = this.getRef('actions') as HTMLElement;
    normalizedActions.forEach((actionsLine: ActionType[], lineIndex: number) => {
      const line = document.createElement('div');
      line.className = 'ModalView__actionLine';
      actionsLine.forEach((action: ActionType, itemIndex) => {
        const actionButton = document.createElement('button');
        actionButton.className = [
          'ModalView__actionButton',
          action.type === PRIMARY_BUTTON_TYPE ? 'ModalView__submitActionButton' : 'ModalView__generalActionButton',
        ].join(' ');
        actionButton.innerHTML = action.text;
        actionButton.setAttribute(DATA_LINE_ATTRIBUTE_NAME, String(lineIndex));
        actionButton.setAttribute(DATA_INDEX_ATTRIBUTE_NAME, String(itemIndex));
        line.appendChild(actionButton);
      });
      actionsContainer.appendChild(line);
    });
  }

  private addEventListeners() {
    const { normalizedActions } = this;
    const { overlayHide, closeButton } = this.options;
    if (overlayHide) this.addOverlayEventListeners();
    if (closeButton) this.addCloseButtonListener();
    if (normalizedActions.length) this.addActionsListeners();
  }

  private addOverlayEventListeners() {
    const modal = this.getRef('modal') as HTMLElement;
    const root = this.getRef('root') as HTMLElement;
    modal.addEventListener('click', ModalView.stopPropagation);
    root.addEventListener('click', this.onOverlayClick);
  }

  private addCloseButtonListener() {
    const { onClose } = this.options;
    if (onClose) {
      const closeButton = this.getRef('closeButton') as HTMLElement;
      closeButton.addEventListener('click', onClose);
    }
  }

  private addActionsListeners() {
    const actions = this.getRef('actions') as HTMLElement;
    actions.addEventListener('click', this.onActionClick);
  }

  private onActionClick = (e: Event) => {
    const { normalizedActions } = this;
    const target = e.target as HTMLElement;
    const dataLineValue = target.getAttribute(DATA_LINE_ATTRIBUTE_NAME);
    const dataIndexValue = target.getAttribute(DATA_INDEX_ATTRIBUTE_NAME);
    if (dataLineValue && dataIndexValue) {
      const handler = normalizedActions[Number(dataLineValue)][Number(dataIndexValue)]?.onClick;
      if (handler) handler(e);
    }
  };

  private onOverlayClick = (e: Event) => {
    const { onClose } = this.options;
    ModalView.stopPropagation(e);
    if (onClose) onClose();
  };

  private removeEventListeners() {
    const { normalizedActions } = this;
    const { overlayHide, closeButton } = this.options;
    if (overlayHide) this.removeOverlayEventListeners();
    if (closeButton) this.removeCloseButtonListener();
    if (normalizedActions.length) this.removeActionsListeners();
  }

  private removeOverlayEventListeners() {
    const { onClose } = this.options;
    if (onClose) {
      const modal = this.getRef('modal') as HTMLElement;
      const root = this.getRef('root') as HTMLElement;
      modal.removeEventListener('click', ModalView.stopPropagation);
      root.removeEventListener('click', onClose);
    }
  }

  private removeCloseButtonListener() {
    const { onClose } = this.options;
    if (onClose) {
      const closeButton = this.getRef('closeButton') as HTMLElement;
      closeButton.removeEventListener('click', onClose);
    }
  }

  private removeActionsListeners() {
    const actions = this.getRef('actions') as HTMLElement;
    actions.removeEventListener('click', this.onActionClick);
  }
}

export default ModalView;
