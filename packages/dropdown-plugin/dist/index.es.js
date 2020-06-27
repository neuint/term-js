import { TemplateEngine, Plugin } from '@term-js/term';
import { ContextMenu, CLOSE_ACTION, END_OF_LINE_TYPE } from '@term-js/context-menu-plugin';

var template = "<ul ref=\"root\" class=\"root\"></ul>\n";

var css = {"root":"root-dropdown-plugin-️da9551de836787a257b4d03547cdec29"};

var template$1 = "<li ref=\"root\" class=\"root {active}\">\n  <span class=\"matchText\">{match}</span><span class=\"text\">{suggestion}</span>\n</li>\n";

var css$1 = {"root":"root-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853","active":"active-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853","text":"text-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853","matchText":"matchText-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853"};

class Item extends TemplateEngine {
    constructor(container, params) {
        super(template$1, container);
        this.isActive = false;
        this.isRendered = false;
        this.clickHandler = () => {
            const { text, onClick } = this;
            if (onClick)
                onClick(text, this);
        };
        this.hoverHandler = () => {
            const { text, onHover } = this;
            if (onHover)
                onHover(text, this);
        };
        const { value, text, index, onHover, onClick } = params;
        this.text = text;
        this.index = index;
        this.match = value;
        this.onHover = onHover;
        this.onClick = onClick;
        this.suggestion = text.replace(value, '');
    }
    get active() {
        return this.isActive;
    }
    set active(val) {
        const root = this.getRef('root');
        if (val !== this.isActive && root) {
            if (val) {
                root.classList.add(css$1.active);
            }
            else {
                root.classList.remove(css$1.active);
            }
        }
        this.isActive = val;
    }
    render() {
        const { match, suggestion, isActive, isRendered } = this;
        this.removeListeners();
        super.render({ css: css$1, match, suggestion, active: isActive ? css$1.active : '' }, isRendered ? { replace: this } : {});
        this.addListeners();
        this.isRendered = true;
    }
    destroy() {
        this.removeListeners();
        super.destroy();
    }
    addListeners() {
        const root = this.getRef('root');
        if (root) {
            root.addEventListener('click', this.clickHandler);
            root.addEventListener('mousemove', this.hoverHandler);
        }
    }
    removeListeners() {
        const root = this.getRef('root');
        if (root) {
            root.removeEventListener('click', this.clickHandler);
            root.removeEventListener('mousemove', this.hoverHandler);
        }
    }
}

class List extends TemplateEngine {
    constructor(container, onSelect) {
        super(template, container);
        this.reRender = false;
        this.listItems = [];
        this.itemsField = [];
        this.valueField = '';
        this.indexField = 0;
        this.onItemHover = (_, line) => {
            const { listItems } = this;
            listItems.forEach((item, index) => {
                if (item === line) {
                    this.indexField = index;
                    item.active = true;
                }
                else {
                    item.active = false;
                }
            });
        };
        this.onItemClick = (text, item) => {
            const { onSelect } = this;
            if (onSelect)
                onSelect(text, item.index);
        };
        this.onSelect = onSelect;
        this.render();
    }
    get items() {
        return this.itemsField;
    }
    set items(val) {
        this.itemsField = val;
        this.render();
    }
    get value() {
        return this.valueField;
    }
    set value(val) {
        if (this.valueField !== val) {
            this.valueField = val;
            this.render();
        }
    }
    get index() {
        return this.indexField;
    }
    set index(val) {
        const newIndex = Math.max(0, val);
        if (this.indexField !== newIndex) {
            this.indexField = newIndex;
            this.render();
        }
    }
    render() {
        super.render({ css }, this.reRender ? { replace: this } : {});
        this.renderItems();
        this.reRender = true;
    }
    renderItems() {
        const root = this.getRef('root');
        const { itemsField, valueField, indexField } = this;
        const listItems = [];
        let isSetActive = false;
        if (root) {
            this.destroyItems();
            itemsField.forEach((item, index) => {
                if (!valueField || item.includes(valueField)) {
                    const isActive = indexField === index;
                    isSetActive = isSetActive || isActive;
                    const listItem = new Item(root, {
                        index,
                        value: valueField,
                        text: item,
                        onHover: this.onItemHover,
                        onClick: this.onItemClick,
                    });
                    listItem.render();
                    listItem.active = isActive;
                    listItems.push(listItem);
                }
            });
            this.listItems = listItems;
            if (!isSetActive) {
                this.indexField = 0;
                if (listItems[0])
                    listItems[0].active = true;
            }
        }
    }
    destroyItems() {
        this.listItems.forEach(listItem => listItem.destroy());
        this.listItems = [];
    }
}

const NEXT_ACTION = 'dropdown-plugin-next';
const DOWN_ACTION = 'dropdown-plugin-down';
const UP_ACTION = 'dropdown-plugin-up';
const SUBMIT_ACTION = 'dropdown-plugin-submit';

const TAB_KEY_CODE = 9;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;
const ENTER_KEY_CODE = 13;

const PLUGIN_NAME = 'dropdown';

class Dropdown extends Plugin {
    constructor() {
        super();
        this.name = PLUGIN_NAME;
        this.isActionsLock = false;
        this.itemsList = [];
        this.highlightField = '';
        this.isActive = false;
        this.onNext = (action, e) => {
            const { isActive, list, isActionsLock } = this;
            if (isActive && list && !isActionsLock) {
                e.stopPropagation();
                e.preventDefault();
                const nextIndex = list.index + 1;
                list.index = nextIndex >= list.items.length ? 0 : nextIndex;
            }
        };
        this.onDown = (action, e) => {
            const { isActive, list, isActionsLock } = this;
            if (isActive && list && !isActionsLock) {
                e.stopPropagation();
                e.preventDefault();
                list.index = Math.min(list.index + 1, list.items.length - 1);
            }
        };
        this.onUp = (action, e) => {
            const { isActive, list, isActionsLock } = this;
            if (isActive && list && !isActionsLock) {
                e.stopPropagation();
                e.preventDefault();
                list.index = Math.max(list.index - 1, 0);
            }
        };
        this.onSubmit = (action, e) => {
            const { onSelect, isActive, list } = this;
            if (isActive && list) {
                e.stopPropagation();
                e.preventDefault();
                if (onSelect)
                    onSelect(list.items[list.index], list.index);
            }
            this.clear();
        };
        this.selectHandler = (text, index) => {
            const { onSelect } = this;
            this.hide();
            if (onSelect)
                onSelect(text, index);
        };
        this.hideContextMenuHandler = () => {
            const { isActive } = this;
            if (isActive)
                this.clear();
        };
        this.container = document.createElement('div');
    }
    get items() {
        return this.itemsList;
    }
    set items(val) {
        const { itemsList, append, container } = this;
        if (itemsList.length !== val.length || itemsList.some((item, i) => item !== val[i])) {
            this.itemsList = val;
            this.renderList({ append, className: container.className });
        }
    }
    get highlight() {
        return this.highlightField;
    }
    set highlight(val) {
        const { append, container } = this;
        if (val !== this.highlightField) {
            this.highlightField = val;
            this.renderList({ append, className: container.className });
        }
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        this.registerShortcut();
        this.setContextMenuPlugin();
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
    }
    clear() {
        this.hideList();
        delete this.onSelect;
        delete this.onClose;
        super.clear();
    }
    destroy() {
        this.clear();
        this.unregisterShortcut();
        super.destroy();
    }
    show(items = [], params = {}) {
        if (items)
            this.itemsList = items;
        const { itemsList } = this;
        const { onSelect, onClose } = params;
        if (itemsList.length) {
            this.onSelect = onSelect;
            this.onClose = onClose;
            this.isActive = true;
            this.renderList(params);
        }
        else {
            this.clear();
            if (onClose)
                onClose();
        }
    }
    hide() {
        this.clear();
    }
    unregisterShortcut() {
        const { keyboardShortcutsManager } = this;
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.removeShortcut(NEXT_ACTION);
            keyboardShortcutsManager.removeShortcut(DOWN_ACTION);
            keyboardShortcutsManager.removeShortcut(UP_ACTION);
            keyboardShortcutsManager.removeShortcut(SUBMIT_ACTION);
        }
    }
    registerShortcut() {
        const { keyboardShortcutsManager } = this;
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.addShortcut(NEXT_ACTION, { code: TAB_KEY_CODE });
            keyboardShortcutsManager.addShortcut(DOWN_ACTION, { code: DOWN_KEY_CODE });
            keyboardShortcutsManager.addShortcut(UP_ACTION, { code: UP_KEY_CODE });
            keyboardShortcutsManager.addShortcut(SUBMIT_ACTION, { code: ENTER_KEY_CODE });
            keyboardShortcutsManager.addListener(NEXT_ACTION, this.onNext);
            keyboardShortcutsManager.addListener(DOWN_ACTION, this.onDown);
            keyboardShortcutsManager.addListener(UP_ACTION, this.onUp);
            keyboardShortcutsManager.addListener(SUBMIT_ACTION, this.onSubmit);
        }
    }
    setContextMenuPlugin() {
        const { termInfo } = this;
        if (!termInfo)
            return;
        const contextMenuPlugin = termInfo.pluginManager.getPlugin(ContextMenu);
        if (contextMenuPlugin) {
            this.contextMenuPlugin = contextMenuPlugin;
        }
        else {
            this.contextMenuPlugin = new ContextMenu();
            termInfo.pluginManager.register(this.contextMenuPlugin);
        }
    }
    renderList(params) {
        const { contextMenuPlugin, container, itemsList, keyboardShortcutsManager, unlockCallback, highlightField, } = this;
        const { className = '', append } = params;
        if (!contextMenuPlugin || !keyboardShortcutsManager)
            return;
        container.className = className;
        if (!this.list)
            this.list = new List(container, this.selectHandler);
        this.renderAppend(append);
        if (!unlockCallback) {
            this.unlockCallback = keyboardShortcutsManager.lock([
                NEXT_ACTION, DOWN_ACTION, UP_ACTION, SUBMIT_ACTION, CLOSE_ACTION,
            ]);
        }
        const list = this.list;
        list.items = itemsList;
        list.value = highlightField.trim();
        this.isActive = false;
        contextMenuPlugin.show(container, END_OF_LINE_TYPE, {
            escHide: true, aroundClickHide: true, onHide: this.hideContextMenuHandler,
        });
        this.isActive = true;
    }
    renderAppend(append) {
        const { container } = this;
        this.clearAppend();
        if (!append)
            return;
        if (typeof append === 'string') {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = append.replace(/^[\n\t\s]+/, '');
            const appendNode = tempContainer.firstChild;
            if (!appendNode)
                return;
            container.appendChild(appendNode);
            this.append = appendNode;
        }
        else {
            container.appendChild(append);
            this.append = append;
        }
    }
    clearAppend() {
        const { container, append } = this;
        if (append)
            container.removeChild(append);
        delete this.append;
    }
    hideList() {
        const { list, unlockCallback, contextMenuPlugin, onClose } = this;
        this.clearAppend();
        this.isActive = false;
        if (unlockCallback) {
            unlockCallback();
            delete this.unlockCallback;
        }
        if (list) {
            list.destroy();
            delete this.list;
        }
        contextMenuPlugin === null || contextMenuPlugin === void 0 ? void 0 : contextMenuPlugin.hide();
        if (onClose)
            onClose();
    }
}

export { Dropdown };
//# sourceMappingURL=index.es.js.map
