import { TemplateEngine, Plugin } from '@term-js/term';
import { v1 } from 'uuid';
import { isArray, last, noop } from 'lodash-es';

const PLUGIN_NAME = 'modals-plugin';
const EDIT_CENTER_POSITION = 'edit-center';
const PRIMARY_BUTTON_TYPE = 'submit';
const DATA_LINE_ATTRIBUTE_NAME = 'modals-plugin-data-line';
const DATA_INDEX_ATTRIBUTE_NAME = 'modals-plugin-data-index';
const ESC_KEY_CODE = 27;
const HIDE_ACTION = 'modals-plugin-hide-action';

var template = "<div ref=\"root\" class=\"root\">\n  <div ref=\"modal\" class=\"modal {className}\">\n    <if condition=\"{title || closeButton}\">\n      <div class=\"header\">\n        <if condition=\"{title}\">\n          <div class=\"title\">\n            <span class=\"titleText\">{title}</span>\n          </div>\n        </if>\n        <if condition=\"{closeButton}\">\n          <button type=\"button\" ref=\"closeButton\" class=\"closeButton\">\n            <svg class=\"closeIcon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n              <path stroke=\"none\" d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n            </svg>\n          </button>\n        </if>\n      </div>\n    </if>\n    <div ref=\"content\" class=\"content\">\n      <if condition=\"{content}\">\n        <span class=\"contentText\">{content}</span>\n      </if>\n    </div>\n    <if condition=\"{actions}\">\n      <div ref=\"actions\" class=\"actions\"></div>\n    </if>\n  </div>\n</div>\n";

var css = {"root":"root-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","modal":"modal-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","absoluteModal":"absoluteModal-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","header":"header-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","title":"title-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","titleText":"titleText-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","closeButton":"closeButton-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","closeIcon":"closeIcon-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","actionLine":"actionLine-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","content":"content-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","actionButton":"actionButton-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","submitActionButton":"submitActionButton-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872","generalActionButton":"generalActionButton-modals-plugin-️f1dd09460b30ad10e032fa2fb6b24872"};

class ModalView extends TemplateEngine {
    constructor(container, options) {
        super(template, container);
        this.isRendered = false;
        this.onActionClick = (e) => {
            var _a;
            const { normalizedActions } = this;
            const target = e.target;
            const dataLineValue = target.getAttribute(DATA_LINE_ATTRIBUTE_NAME);
            const dataIndexValue = target.getAttribute(DATA_INDEX_ATTRIBUTE_NAME);
            if (dataLineValue && dataIndexValue) {
                const handler = (_a = normalizedActions[Number(dataLineValue)][Number(dataIndexValue)]) === null || _a === void 0 ? void 0 : _a.onClick;
                if (handler)
                    handler(e);
            }
        };
        this.onOverlayClick = (e) => {
            const { onClose } = this.options;
            ModalView.stopPropagation(e);
            if (onClose)
                onClose();
        };
        this.options = options;
        this.render();
    }
    get normalizedActions() {
        const { actions = [] } = this.options;
        if (!actions.length)
            return [];
        return (isArray(actions[0]) ? actions : [actions]);
    }
    render() {
        if (this.isRendered)
            return;
        const { title, closeButton, content: optionsContent, actions = [], className = '', isAbsolute = false, } = this.options;
        super.render({
            css, className, title, closeButton, actions: Boolean(actions.length),
            content: typeof optionsContent === 'string' ? optionsContent : '',
        });
        if (isAbsolute) {
            const modal = this.getModalView();
            modal.classList.add(css.absoluteModal);
        }
        this.renderActions();
        this.addEventListeners();
        this.isRendered = true;
    }
    destroy() {
        this.removeEventListeners();
        super.destroy();
    }
    getModalView() {
        return this.getRef('modal');
    }
    renderActions() {
        const { normalizedActions } = this;
        const actionsContainer = this.getRef('actions');
        normalizedActions.forEach((actionsLine, lineIndex) => {
            const line = document.createElement('div');
            line.className = css.actionLine;
            actionsLine.forEach((action, itemIndex) => {
                const actionButton = document.createElement('button');
                actionButton.className = [
                    css.actionButton,
                    action.type === PRIMARY_BUTTON_TYPE ? css.submitActionButton : css.generalActionButton,
                ].join(' ');
                actionButton.innerHTML = action.text;
                actionButton.setAttribute(DATA_LINE_ATTRIBUTE_NAME, String(lineIndex));
                actionButton.setAttribute(DATA_INDEX_ATTRIBUTE_NAME, String(itemIndex));
                line.appendChild(actionButton);
            });
            actionsContainer.appendChild(line);
        });
    }
    addEventListeners() {
        const { normalizedActions } = this;
        const { overlayHide, closeButton } = this.options;
        if (overlayHide)
            this.addOverlayEventListeners();
        if (closeButton)
            this.addCloseButtonListener();
        if (normalizedActions.length)
            this.addActionsListeners();
    }
    addOverlayEventListeners() {
        const modal = this.getRef('modal');
        const root = this.getRef('root');
        modal.addEventListener('click', ModalView.stopPropagation);
        root.addEventListener('click', this.onOverlayClick);
    }
    addCloseButtonListener() {
        const { onClose } = this.options;
        if (onClose) {
            const closeButton = this.getRef('closeButton');
            closeButton.addEventListener('click', onClose);
        }
    }
    addActionsListeners() {
        const actions = this.getRef('actions');
        actions.addEventListener('click', this.onActionClick);
    }
    removeEventListeners() {
        const { normalizedActions } = this;
        const { overlayHide, closeButton } = this.options;
        if (overlayHide)
            this.removeOverlayEventListeners();
        if (closeButton)
            this.removeCloseButtonListener();
        if (normalizedActions.length)
            this.removeActionsListeners();
    }
    removeOverlayEventListeners() {
        const { onClose } = this.options;
        if (onClose) {
            const modal = this.getRef('modal');
            const root = this.getRef('root');
            modal.removeEventListener('click', ModalView.stopPropagation);
            root.removeEventListener('click', onClose);
        }
    }
    removeCloseButtonListener() {
        const { onClose } = this.options;
        if (onClose) {
            const closeButton = this.getRef('closeButton');
            closeButton.removeEventListener('click', onClose);
        }
    }
    removeActionsListeners() {
        const actions = this.getRef('actions');
        actions.removeEventListener('click', this.onActionClick);
    }
}
ModalView.stopPropagation = (e) => {
    e.stopPropagation();
};

const getScrollbarSize = (container) => {
    let { size } = getScrollbarSize;
    if (size)
        return size;
    const target = container || document.body;
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.style.width = '100px';
    div1.style.height = '100px';
    div1.style.overflow = 'scroll';
    div2.style.height = '100px';
    target.appendChild(div1);
    div1.appendChild(div2);
    size = div1.offsetWidth - div2.offsetWidth;
    target.removeChild(div1);
    getScrollbarSize.size = size;
    return size;
};
const getRelativePosition = (el, container) => {
    const scrollBarSize = getScrollbarSize(container);
    const elInfo = el.getBoundingClientRect();
    const containerInfo = container.getBoundingClientRect();
    const left = elInfo.left - containerInfo.left;
    const top = elInfo.top - containerInfo.top;
    const containerWidth = containerInfo.width - scrollBarSize;
    const containerHeight = containerInfo.height - scrollBarSize;
    return {
        left,
        top,
        bottom: containerHeight - top - elInfo.height,
        right: containerWidth - left - elInfo.width,
        width: elInfo.width,
        height: elInfo.height,
    };
};

class Modals extends Plugin {
    constructor() {
        super(...arguments);
        this.name = PLUGIN_NAME;
        this.modalStack = [];
        this.hideLast = () => {
            const { modalStack } = this;
            const lastModal = last(modalStack);
            if (lastModal && lastModal.options.escHide) {
                this.hide(lastModal.uuid);
                if (lastModal.options.onClose)
                    lastModal.options.onClose();
            }
        };
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        keyboardShortcutsManager.addShortcut(HIDE_ACTION, { code: ESC_KEY_CODE });
        keyboardShortcutsManager.addListener(HIDE_ACTION, this.hideLast);
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
    }
    clear() {
        const { modalStack } = this;
        modalStack.forEach(({ uuid }) => this.hide(uuid));
        super.clear();
    }
    destroy() {
        this.clear();
        super.destroy();
    }
    show(options) {
        const { termInfo, unlockCallback, keyboardShortcutsManager } = this;
        if (!termInfo || !termInfo.elements.root)
            return noop;
        const { root } = termInfo.elements;
        const { content, onClose: closeHandler, title, overlayHide, closeButton, actions, className, position, } = options;
        termInfo.edit.blur();
        const uuid = v1();
        const onClose = () => {
            this.hide(uuid);
            if (closeHandler)
                closeHandler();
        };
        const isAbsolute = position === EDIT_CENTER_POSITION;
        const view = new ModalView(root, { onClose, content, title, overlayHide,
            closeButton, actions, className, isAbsolute });
        if (isAbsolute)
            this.updatePosition(view, position);
        this.modalStack.push({ uuid, options, view });
        if (!unlockCallback && keyboardShortcutsManager) {
            this.unlockCallback = keyboardShortcutsManager.lock([HIDE_ACTION]);
        }
        return onClose;
    }
    hide(uuid) {
        const { termInfo, unlockCallback } = this;
        const { modalStack } = this;
        const index = modalStack.findIndex(item => item.uuid === uuid);
        if (index >= 0) {
            modalStack[index].view.destroy();
            modalStack.splice(index, 1);
        }
        if (!modalStack.length) {
            if (unlockCallback)
                unlockCallback();
            delete this.unlockCallback;
            termInfo === null || termInfo === void 0 ? void 0 : termInfo.edit.focus();
        }
    }
    updatePosition(view, position) {
        const { termInfo } = this;
        const modal = view.getModalView();
        if (!modal || !termInfo || position !== EDIT_CENTER_POSITION)
            return;
        const { edit, root } = termInfo.elements;
        if (!edit || !root)
            return;
        const { top, bottom } = getRelativePosition(edit, root);
        if (top <= bottom) {
            modal.style.top = `${Math.max(0, top)}px`;
        }
        else if (bottom >= -1 * edit.offsetHeight) {
            modal.style.bottom = `${Math.max(0, bottom)}px`;
        }
        else {
            modal.style.top = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
        }
    }
}

export { Modals };
//# sourceMappingURL=index.es.js.map
