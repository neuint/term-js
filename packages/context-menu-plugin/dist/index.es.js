import { TemplateEngine, Plugin } from '@term-js/term';
import { isString, noop } from 'lodash-es';

var template = "<div ref=\"root\" class=\"root\"></div>\n";

var css = {"root":"root-context-menu-plugin-️74022d6f2c3e8e38c498d8c8405a8378"};

class ContextMenuView extends TemplateEngine {
    constructor(container) {
        super(template, container);
        this.reRender = false;
    }
    render() {
        super.render({ css }, this.reRender ? { replace: this } : {});
        this.reRender = true;
    }
}

const PLUGIN_NAME = 'context-menu';
const END_OF_LINE_TYPE = 'end of line';
const POSITION_TARGET_TYPE = 'position';
const CLOSE_ACTION = 'context-menu-plugin-close';
const ESC_KEY_CODE = 27;

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

const stopPropagation = (e) => e.stopPropagation();

class ContextMenu extends Plugin {
    constructor() {
        super(...arguments);
        this.name = PLUGIN_NAME;
        this.isVisible = false;
        this.escHide = false;
        this.aroundClickHide = false;
        this.escHandler = () => {
            if (this.escHide)
                this.hide();
        };
        this.rootClickHandler = () => {
            if (this.aroundClickHide)
                this.hide();
        };
    }
    show(content, target, options = {}) {
        this.hide();
        const { position, escHide = false, aroundClickHide = false, onHide } = options;
        if (target === POSITION_TARGET_TYPE && !position)
            return;
        this.target = target;
        this.escHide = escHide;
        this.onHide = onHide;
        this.aroundClickHide = aroundClickHide;
        this.render(content);
        this.updatePosition();
    }
    hide() {
        const { contextMenuView, onHide } = this;
        if (contextMenuView) {
            const root = contextMenuView.getRef('root');
            if (root)
                root.removeEventListener('click', stopPropagation);
            contextMenuView.destroy();
            delete this.contextMenuView;
            if (onHide)
                onHide();
        }
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        const { root } = termInfo.elements;
        root === null || root === void 0 ? void 0 : root.addEventListener('click', this.rootClickHandler);
        keyboardShortcutsManager.addShortcut(CLOSE_ACTION, { code: ESC_KEY_CODE });
        keyboardShortcutsManager.addListener(CLOSE_ACTION, this.escHandler);
        this.updatePosition();
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
        this.updatePosition();
    }
    destroy() {
        const { keyboardShortcutsManager, termInfo } = this;
        const root = termInfo === null || termInfo === void 0 ? void 0 : termInfo.elements.root;
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.removeListener(this.escHandler);
            keyboardShortcutsManager.removeShortcut(CLOSE_ACTION);
        }
        if (root)
            root.removeEventListener('click', this.rootClickHandler);
        super.destroy();
    }
    clear() {
        this.hide();
        super.clear();
    }
    render(content) {
        var _a, _b;
        const { termInfo, target } = this;
        const edit = target === END_OF_LINE_TYPE ? (_a = termInfo === null || termInfo === void 0 ? void 0 : termInfo.elements) === null || _a === void 0 ? void 0 : _a.edit : (_b = termInfo === null || termInfo === void 0 ? void 0 : termInfo.elements) === null || _b === void 0 ? void 0 : _b.root;
        if (!edit)
            return;
        const contextMenuView = new ContextMenuView(edit);
        contextMenuView.render();
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        root.addEventListener('click', stopPropagation);
        this.contextMenuView = contextMenuView;
        this.isVisible = false;
        return isString(content) ? root.innerHTML = content : root.appendChild(content);
    }
    updatePosition() {
        const { target, isVisible } = this;
        ({
            [END_OF_LINE_TYPE]: () => this.updateEndOfLinePosition(),
            [POSITION_TARGET_TYPE]: () => this.updateFixedPosition(),
        }[target || ''] || noop)();
        if (!isVisible)
            this.setVisible();
    }
    updateEndOfLinePosition() {
        const { termInfo, contextMenuView } = this;
        if (!termInfo || !contextMenuView)
            return;
        const { size: { height } } = termInfo.caret;
        const { endOffset: { left, top: offsetTop } } = termInfo.edit;
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        const top = offsetTop + height;
        root.style.left = `${left}px`;
        root.style.top = `${top}px`;
        this.normalizedPosition(left, top);
    }
    updateFixedPosition() {
        const { position, contextMenuView } = this;
        if (!position || !contextMenuView)
            return;
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        root.style.left = `${position.left}px`;
        root.style.top = `${position.top}px`;
        this.normalizedPosition(position.left, position.top);
    }
    setVisible() {
        const { contextMenuView } = this;
        if (!contextMenuView)
            return;
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        root.style.visibility = 'visible';
        this.isVisible = true;
    }
    normalizedPosition(left, top) {
        var _a, _b;
        const { contextMenuView, target, termInfo } = this;
        const root = (_b = (_a = this.termInfo) === null || _a === void 0 ? void 0 : _a.elements) === null || _b === void 0 ? void 0 : _b.root;
        if (!contextMenuView || !root)
            return;
        const contextMenuRoot = contextMenuView.getRef('root');
        if (!contextMenuRoot)
            return;
        const { right, bottom, } = getRelativePosition(contextMenuRoot, root);
        if (right < 0)
            contextMenuRoot.style.left = `${left + right}px`;
        if (bottom < 0) {
            const updatedTop = top - contextMenuRoot.offsetHeight
                - (target === END_OF_LINE_TYPE ? (termInfo === null || termInfo === void 0 ? void 0 : termInfo.caret.size.height) || 0 : 0);
            contextMenuRoot.style.top = `${updatedTop}px`;
        }
    }
}

export { CLOSE_ACTION, ContextMenu, END_OF_LINE_TYPE, POSITION_TARGET_TYPE };
//# sourceMappingURL=index.es.js.map
