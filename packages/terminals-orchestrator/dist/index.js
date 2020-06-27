'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var keyLayersJs = require('key-layers-js');
var term = require('@term-js/term');
var ResizeObserver = _interopDefault(require('resize-observer-polyfill'));
var lodashEs = require('lodash-es');

var template = "<div class=\"wrapper\">\n  <div ref=\"root\" class=\"root\">\n    <div ref=\"tabs\" class=\"tabs\"></div>\n    <div ref=\"content\" class=\"content\"></div>\n  </div>\n</div>\n";

var css = {"wrapper":"wrapper-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696","root":"root-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696","content":"content-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696","contentItem":"contentItem-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696"};

var template$1 = "<div ref=\"root\" class=\"root\">\n  <div ref=\"checkContainer\" class=\"checkContainer hidden\">check text</div>\n  <button ref=\"left-more\" class=\"down hidden\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M7 10l5 5 5-5z\"/>\n    </svg>\n  </button>\n  <div ref=\"leftAdditional\" class=\"leftAdditional hidden\"></div>\n  <div ref=\"list\" class=\"list\"></div>\n  <div class=\"addContainer\">\n    <div ref=\"rightAdditional\" class=\"rightAdditional hidden\"></div>\n    <button ref=\"right-more\" class=\"down hidden\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M7 10l5 5 5-5z\"/>\n      </svg>\n    </button>\n    <button ref=\"add\" type=\"button\" class=\"add\">\n      <svg class=\"addIcon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/>\n      </svg>\n    </button>\n  </div>\n</div>\n";

var css$1 = {"root":"root-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","checkContainer":"checkContainer-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","down":"down-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","hidden":"hidden-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","draggable":"draggable-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","leftAdditional":"leftAdditional-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","rightAdditional":"rightAdditional-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","leftTwo":"leftTwo-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","rightTwo":"rightTwo-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","list":"list-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","navigationContainer":"navigationContainer-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","addContainer":"addContainer-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","add":"add-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","leftList":"leftList-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","rightList":"rightList-terminals-orchestrator-️32767fb230043e09a6e46992228726e7"};

var template$2 = "<button draggable=\"true\" ref=\"root\" class=\"root {hidden} {invisible} {active} {reverse} {first}\">\n  <div ref=\"close\" class=\"close\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n    </svg>\n  </div>\n  <div ref=\"title\" class=\"title\">\n    <span ref=\"titleText\" class=\"titleText\">{title}</span>\n    <div ref=\"inputContainer\" class=\"inputContainer\"></div>\n  </div>\n  <div class=\"rightAction\">\n    <div ref=\"shortcut\" class=\"shortcut\">\n      <span ref=\"shortcutText\" class=\"shortcutText\">{shortcut}</span>\n    </div>\n    <div ref=\"rename\" class=\"rename\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\n      </svg>\n    </div>\n  </div>\n</button>\n";

var css$2 = {"root":"root-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","reverse":"reverse-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","skipHover":"skipHover-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","active":"active-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","draggable":"draggable-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","invisible":"invisible-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","hidden":"hidden-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","close":"close-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","title":"title-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","editable":"editable-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","titleText":"titleText-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","input":"input-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","inputContainer":"inputContainer-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","rightAction":"rightAction-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","shortcut":"shortcut-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","shortcutText":"shortcutText-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","rename":"rename-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5"};

const IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const escapeString = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
const safeTemplate = (template, data) => Object.keys(data)
    .reduce((acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), escapeString(data[key])), template);

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;
const ONE_KEY_CODE = 49;
const E_KEY_CODE = 69;

var template$3 = "<input ref=\"root\" class=\"root {className}\" type=\"text\">\n";

var css$3 = {"root":"root-terminals-orchestrator-️1fb1e5ff957640d096217b4738ff5678","disabled":"disabled-terminals-orchestrator-️1fb1e5ff957640d096217b4738ff5678"};

class SelectInput extends term.TemplateEngine {
    constructor(container, options = { value: '' }) {
        super(template$3, container);
        this.isDisabled = false;
        this.keyDownHandler = (e) => {
            const { onSubmit } = this.options;
            const { keyCode } = e;
            if (keyCode === ENTER_KEY_CODE && onSubmit)
                onSubmit(e);
        };
        this.options = options;
        this.render();
        this.addListeners();
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled } = this;
        this.isDisabled = val;
        if (isDisabled === val)
            return;
        const root = this.getRef('root');
        if (val) {
            root.classList.add(css$3.disabled);
            root.setAttribute('disabled', 'true');
        }
        else {
            root.removeAttribute('disabled');
            root.classList.remove(css$3.disabled);
        }
    }
    get value() {
        const root = this.getRef('root');
        return root.value;
    }
    set value(val) {
        const root = this.getRef('root');
        root.value = val;
    }
    render() {
        const { value, disabled = false, className = '' } = this.options;
        super.render({ css: css$3, className });
        this.disabled = disabled;
        this.getRef('root').value = value;
    }
    select() {
        const root = this.getRef('root');
        root.select();
    }
    focus() {
        const root = this.getRef('root');
        root.focus();
    }
    blur() {
        const root = this.getRef('root');
        root.blur();
    }
    destroy() {
        this.removeListeners();
        super.destroy();
    }
    addListeners() {
        const root = this.getRef('root');
        const { onBlur, onSubmit } = this.options;
        if (onBlur)
            root.addEventListener('blur', onBlur);
        if (onSubmit)
            root.addEventListener('keydown', this.keyDownHandler);
    }
    removeListeners() {
        const root = this.getRef('root');
        const { onBlur, onSubmit } = this.options;
        if (onBlur)
            root.removeEventListener('blur', onBlur);
        if (onSubmit)
            root.removeEventListener('keydown', this.keyDownHandler);
    }
}

class Tab extends term.TemplateEngine {
    constructor(container, options) {
        super(template$2, container);
        this.shortcutIndexField = 0;
        this.indexField = -1;
        this.titleField = '';
        this.isActive = false;
        this.isHiddenField = false;
        this.leftField = 0;
        this.disabledHoverField = false;
        this.handlers = { click: [], close: [], drag: [], dragend: [], rename: [] };
        this.emitter = new keyLayersJs.Emitter(keyLayersJs.EMITTER_FORCE_LAYER_TYPE);
        this.rename = () => {
            this.editableTitle = true;
        };
        this.clickHandler = (e) => {
            const { index, handlers } = this;
            handlers.click.forEach(handler => handler(index, e));
        };
        this.keyboardSelectHandler = (e) => {
            e.preventDefault();
            const { index, handlers } = this;
            handlers.click.forEach(handler => handler(index, e));
        };
        this.closeHandler = (e) => {
            const { index, handlers } = this;
            e.stopPropagation();
            handlers.close.forEach(handler => handler(index, e));
        };
        this.dragStartHandler = () => {
            const root = this.getRef('root');
            root.classList.add(css$2.draggable);
        };
        this.dragHandler = (e) => {
            const { handlers, index } = this;
            handlers.drag.forEach(handler => handler(index, e));
        };
        this.dragEndHandler = (e) => {
            const { handlers, index } = this;
            const root = this.getRef('root');
            root.classList.remove(css$2.draggable);
            handlers.dragend.forEach(handler => handler(index, e));
        };
        this.dragoverHandler = (e) => {
            e.preventDefault();
        };
        this.submitTitleHandler = () => {
            const { titleInput, index, handlers } = this;
            this.title = titleInput.value;
            this.editableTitle = false;
            handlers.rename.forEach((handler) => {
                handler(index, this.title);
            });
        };
        this.isActive = options.active || false;
        this.isInvisible = options.invisible || false;
        this.titleField = options.title || '';
        this.indexField = options.index === undefined ? -1 : options.index;
        this.options = options;
        this.render();
        this.titleInput = new SelectInput(this.getRef('inputContainer'), {
            className: css$2.input, value: this.titleField, disabled: true,
            onSubmit: this.submitTitleHandler, onBlur: this.submitTitleHandler,
        });
        this.addListeners();
    }
    get editableTitle() {
        return !this.titleInput.disabled;
    }
    set editableTitle(val) {
        const { titleInput } = this;
        if (titleInput.disabled !== val)
            return;
        const title = this.getRef('title');
        if (val) {
            titleInput.disabled = false;
            titleInput.focus();
            titleInput.select();
            title.classList.add(css$2.editable);
        }
        else {
            titleInput.blur();
            titleInput.disabled = true;
            title.classList.remove(css$2.editable);
        }
    }
    set shortcutIndex(val) {
        const { shortcutIndexField, emitter } = this;
        const shortcutText = this.getRef('shortcutText');
        this.shortcutIndexField = val;
        if (shortcutText && val !== shortcutIndexField) {
            shortcutText.innerHTML = this.shortcut;
            if (val && val < 10) {
                emitter.removeListener('keyDown', this.keyboardSelectHandler);
                emitter.addListener('keyDown', this.keyboardSelectHandler, Object.assign({ code: ONE_KEY_CODE + val - 1 }, (IS_MAC ? { metaKey: true } : { altKey: true })));
            }
            else {
                emitter.removeListener('keyDown', this.keyboardSelectHandler);
            }
        }
    }
    get shortcutIndex() {
        return this.shortcutIndexField;
    }
    set index(val) {
        this.indexField = val;
    }
    get index() {
        return this.indexField;
    }
    get width() {
        const root = this.getRef('root');
        return root ? root.offsetWidth : 0;
    }
    set title(val) {
        const titleText = this.getRef('titleText');
        if (titleText && val !== this.titleField)
            titleText.innerHTML = escapeString(val);
        this.titleField = val;
    }
    get title() {
        return this.titleField;
    }
    set active(val) {
        const root = this.getRef('root');
        if (root && val !== this.isActive) {
            if (val)
                root.classList.add(css$2.active);
            else
                root.classList.remove(css$2.active);
        }
        this.isActive = val;
    }
    get active() {
        return this.isActive;
    }
    set invisible(val) {
        if (this.isInvisible === val)
            return;
        this.isInvisible = val;
        const root = this.getRef('root');
        if (!root)
            return;
        if (val)
            root.classList.add(css$2.invisible);
        else
            root.classList.remove(css$2.invisible);
    }
    get invisible() {
        return this.isInvisible;
    }
    set hidden(val) {
        if (this.isHiddenField === val)
            return;
        this.isHiddenField = val;
        const root = this.getRef('root');
        if (!root)
            return;
        if (val)
            root.classList.add(css$2.hidden);
        else
            root.classList.remove(css$2.hidden);
    }
    get hidden() {
        return this.isHiddenField;
    }
    get left() {
        return this.leftField;
    }
    set left(val) {
        if (this.leftField === val)
            return;
        const root = this.getRef('root');
        this.leftField = val;
        root.style.left = `${val}px`;
    }
    get disabledHover() {
        return this.disabledHoverField;
    }
    set disabledHover(val) {
        if (this.disabledHoverField === val)
            return;
        this.disabledHoverField = val;
        const root = this.getRef('root');
        if (val)
            root.classList.add(css$2.skipHover);
        else
            root.classList.remove(css$2.skipHover);
    }
    get shortcut() {
        const { shortcutIndexField } = this;
        if (!shortcutIndexField)
            return '';
        return IS_MAC ? `⌘${shortcutIndexField}` : `alt${shortcutIndexField}`;
    }
    render() {
        const { title, active, shortcut, index } = this;
        super.render({
            shortcut,
            css: css$2,
            title: escapeString(title),
            active: active ? css$2.active : '',
            reverse: IS_MAC ? '' : css$2.reverse,
            first: index === 0 ? css$2.first : '',
            invisible: this.isInvisible ? css$2.invisible : '',
            hidden: this.isHiddenField ? css$2.hidden : '',
        });
    }
    addEventListener(event, handler) {
        const list = this.handlers[event];
        if (list)
            list.push(handler);
    }
    removeEventListener(event, handler) {
        const list = this.handlers[event];
        if (!list)
            return;
        const index = list.indexOf(handler);
        if (index >= 0)
            list.splice(index, 1);
    }
    destroy() {
        this.emitter.destroy();
        this.removeListeners();
        super.destroy();
    }
    addListeners() {
        const root = this.getRef('root');
        const close = this.getRef('close');
        const rename = this.getRef('rename');
        root.addEventListener('click', this.clickHandler);
        root.addEventListener('dragstart', this.dragStartHandler);
        root.addEventListener('drag', this.dragHandler);
        document.addEventListener('dragover', this.dragoverHandler);
        root.addEventListener('dragend', this.dragEndHandler);
        close.addEventListener('click', this.closeHandler);
        rename.addEventListener('click', this.rename);
    }
    removeListeners() {
        const root = this.getRef('root');
        const close = this.getRef('close');
        const rename = this.getRef('rename');
        root.removeEventListener('click', this.clickHandler);
        root.removeEventListener('dragstart', this.dragStartHandler);
        root.removeEventListener('drag', this.dragHandler);
        document.removeEventListener('dragover', this.dragoverHandler);
        root.addEventListener('dragend', this.dragEndHandler);
        close.removeEventListener('click', this.closeHandler);
        rename.removeEventListener('click', this.rename);
        this.emitter.removeListener('keyDown', this.keyboardSelectHandler);
    }
}

const FOCUS_EVENT_TYPE = 'focus';
const CLOSE_EVENT_TYPE = 'close';
const CLICK_EVENT_TYPE = 'click';
const DRAG_EVENT_TYPE = 'drag';
const DRAG_END_EVENT_TYPE = 'dragend';
const RENAME_EVENT_TYPE = 'rename';
const ADD_EVENT_TYPE = 'add';
const TAB_EVENTS = [FOCUS_EVENT_TYPE, CLOSE_EVENT_TYPE];

var template$4 = "<div ref=\"root\" class=\"container\">\n  <ul ref=\"list\" class=\"list {className}\"></ul>\n</div>\n";

var css$4 = {"container":"container-terminals-orchestrator-️3219d13463fc603703e7200ef6fa62c8","list":"list-terminals-orchestrator-️3219d13463fc603703e7200ef6fa62c8"};

var template$5 = "<li class=\"root\">\n  <button data-index=\"{index}\" class=\"button\">\n    <span class=\"text\">{text}</span>\n  </button>\n</li>\n";

var css$5 = {"root":"root-terminals-orchestrator-️2539e7faf0ca977b17ae54fba23acaa6","button":"button-terminals-orchestrator-️2539e7faf0ca977b17ae54fba23acaa6","text":"text-terminals-orchestrator-️2539e7faf0ca977b17ae54fba23acaa6"};

class HiddenListItem extends term.TemplateEngine {
    constructor(container, options) {
        super(template$5, container);
        this.text = options.text;
        this.index = options.index;
        this.render();
    }
    render() {
        const { text, index } = this;
        super.render({ css: css$5, text, index });
    }
}

class HiddenList extends term.TemplateEngine {
    constructor(container, options = { items: [] }) {
        super(template$4, container);
        this.options = { items: [] };
        this.items = [];
        this.emitter = new keyLayersJs.Emitter(keyLayersJs.EMITTER_TOP_LAYER_TYPE);
        this.onListClick = (e) => {
            const { onSelect } = this.options;
            e.stopPropagation();
            const dataIndex = e.target.getAttribute('data-index');
            if (dataIndex && onSelect)
                onSelect(Number(dataIndex), e);
        };
        this.options = options;
        this.render();
    }
    render() {
        super.render({ css: css$4, className: this.options.className || '' });
        this.renderItems();
        this.updatePosition();
        this.addListeners();
    }
    destroy() {
        this.removeListeners();
        this.items.forEach(item => item.destroy());
        this.emitter.destroy();
        super.destroy();
    }
    renderItems() {
        const { items } = this.options;
        const list = this.getRef('list');
        this.items = items.map(({ text, id }) => {
            return new HiddenListItem(list, { text, index: id });
        });
    }
    updatePosition() {
        const { position = {} } = this.options;
        const root = this.getRef('root');
        root.style.left = position.left ? `${position.left || 0}px` : '';
        root.style.right = position.right ? `${position.right || 0}px` : '';
        root.style.top = position.top ? `${position.top || 0}px` : '';
        root.style.bottom = position.bottom ? `${position.bottom || 0}px` : '';
    }
    addListeners() {
        const { onClose } = this.options;
        if (onClose) {
            this.emitter.addListener('keyDown', onClose, { code: ESC_KEY_CODE });
            this.getRef('root').addEventListener('click', onClose);
        }
        this.getRef('list').addEventListener('click', this.onListClick);
    }
    removeListeners() {
        const { onClose } = this.options;
        if (onClose) {
            this.emitter.removeListener('keyDown', onClose);
            this.getRef('root').removeEventListener('click', onClose);
        }
        this.getRef('list').removeEventListener('click', this.onListClick);
    }
}

class Tabs extends term.TemplateEngine {
    constructor(container, options = {}) {
        super(template$1, container);
        this.tabsField = [];
        this.activeTabField = 0;
        this.visibleListWidth = 0;
        this.checkWidth = 0;
        this.tabsInfo = [];
        this.handlers = { focus: [], close: [], add: [], dragend: [] };
        this.observeHandler = (entries) => {
            const checkContainer = this.getRef('checkContainer');
            const checkContainerEntry = entries.find(item => item.target === checkContainer);
            if (checkContainerEntry && (checkContainerEntry === null || checkContainerEntry === void 0 ? void 0 : checkContainerEntry.contentRect.width) !== this.checkWidth) {
                this.updateTabsInfoSizes();
            }
            this.closeHiddenTabsHandler();
            this.updateListView();
        };
        this.updateListView = () => {
            this.updateVisibleListWidth();
            const { visibleListWidth, tabsInfo } = this;
            const width = tabsInfo.reduce((acc, item) => acc + item.width, 0);
            if (width > visibleListWidth) {
                this.hideTabs();
            }
            else {
                this.showTabs();
            }
        };
        this.addClickHandler = () => {
            this.handlers[ADD_EVENT_TYPE].forEach(handler => handler());
        };
        this.tabDragHandler = (index, e) => {
            const { dragInfo, tabsInfo } = this;
            if (dragInfo) {
                this.updateDragInfo(e);
                this.updateTabsPosition();
            }
            else {
                tabsInfo.forEach(item => item.tab.disabledHover = true);
                const root = this.getRef('root');
                root.classList.add(css$1.draggable);
                const { left } = this.getRef('list').getBoundingClientRect();
                const { clientX } = e;
                this.dragInfo = { index, left: clientX - left, replaceIndex: index };
            }
        };
        this.tabDragEndHandler = () => {
            const { tabsInfo, handlers, tabs } = this;
            const root = this.getRef('root');
            tabsInfo.forEach(item => item.tab.disabledHover = false);
            root.classList.remove(css$1.draggable);
            this.updateOrder();
            delete this.dragInfo;
            handlers.dragend.forEach(callback => callback(tabs));
        };
        this.showLeftHiddenTabs = () => {
            const { tabsInfo } = this;
            let stop = false;
            const leftList = tabsInfo.reduce((acc, item, index) => {
                if (!item.isVisible && !stop)
                    acc.push({ text: item.tab.title, id: index });
                else
                    stop = true;
                return acc;
            }, []);
            if (leftList.length) {
                this.hiddenList = new HiddenList(this.container, {
                    items: leftList, className: css$1.leftList, onClose: this.closeHiddenTabsHandler,
                    onSelect: this.selectHiddenTabHandler,
                });
            }
        };
        this.showRightHiddenTabs = () => {
            const { tabsInfo } = this;
            let start = false;
            const rightList = tabsInfo.reduce((acc, item, index) => {
                if (item.isVisible && !start)
                    start = true;
                else if (start && !item.isVisible)
                    acc.push({ text: item.tab.title, id: index });
                return acc;
            }, []);
            if (rightList.length) {
                this.hiddenList = new HiddenList(this.container, {
                    items: rightList, className: css$1.rightList, onClose: this.closeHiddenTabsHandler,
                    onSelect: this.selectHiddenTabHandler,
                });
            }
        };
        this.closeHiddenTabsHandler = () => {
            var _a;
            (_a = this.hiddenList) === null || _a === void 0 ? void 0 : _a.destroy();
            delete this.hiddenList;
        };
        this.selectHiddenTabHandler = (index) => {
            this.closeHiddenTabsHandler();
            this.activeTab = index;
        };
        this.renameTabHandler = (index, title) => {
            const tabField = this.tabsField[index];
            if (tabField)
                tabField.title = title;
        };
        this.options = options;
        this.ro = new ResizeObserver(this.observeHandler);
        this.render();
    }
    get tabs() {
        return this.tabsField;
    }
    set tabs(val) {
        const { tabsInfo } = this;
        this.tabsField = val;
        tabsInfo.forEach(item => item.tab.destroy());
        this.tabsInfo = [];
        this.activeTabField = 0;
        this.renderTabs();
        this.updateListView();
    }
    get activeTab() {
        return this.activeTabField;
    }
    set activeTab(val) {
        const { tabsField, tabsInfo, activeTabField } = this;
        if (val >= 0 && val <= tabsField.length - 1) {
            if (tabsInfo[activeTabField])
                tabsInfo[activeTabField].tab.active = false;
            const tabInfo = tabsInfo[val];
            this.activeTabField = val;
            if (tabInfo)
                tabInfo.tab.active = true;
            if (!tabInfo.isVisible)
                this.updateListView();
        }
    }
    render() {
        super.render({ css: css$1 });
        this.checkWidth = this.getRef('checkContainer').offsetWidth;
        this.addListeners();
        const addButton = this.getRef('add');
        addButton.setAttribute('title', 'alt + E');
    }
    destroy() {
        this.removeListeners();
        super.destroy();
    }
    addEventListener(event, handler) {
        const { handlers, tabsInfo } = this;
        const list = handlers[event];
        if (!list)
            return;
        list.push(handler);
        if (TAB_EVENTS.includes(event)) {
            tabsInfo.forEach((tabInfo) => {
                const tabEvent = event === FOCUS_EVENT_TYPE ? CLICK_EVENT_TYPE : event;
                tabInfo.tab.addEventListener(tabEvent, handler);
            });
        }
    }
    removeEventListener(event, handler) {
        const { handlers, tabsInfo } = this;
        const list = handlers[event];
        if (!list)
            return;
        const index = list.indexOf(handler);
        if (index < 0)
            return;
        list.splice(index, 1);
        if (TAB_EVENTS.includes(event)) {
            tabsInfo.forEach((tabInfo) => {
                const tabEvent = event === FOCUS_EVENT_TYPE ? CLICK_EVENT_TYPE : event;
                tabInfo.tab.removeEventListener(tabEvent, handler);
            });
        }
    }
    addListeners() {
        this.getRef('add').addEventListener('click', this.addClickHandler);
        this.getRef('left-more').addEventListener('click', this.showLeftHiddenTabs);
        this.getRef('right-more').addEventListener('click', this.showRightHiddenTabs);
        this.ro.observe(this.getRef('root'));
        this.ro.observe(this.getRef('checkContainer'));
    }
    removeListeners() {
        this.ro.unobserve(this.getRef('root'));
        this.ro.unobserve(this.getRef('checkContainer'));
        this.getRef('add').removeEventListener('click', this.addClickHandler);
        this.getRef('left-more').removeEventListener('click', this.showLeftHiddenTabs);
        this.getRef('right-more')
            .removeEventListener('click', this.showRightHiddenTabs);
    }
    renderTabs() {
        const { activeTab, tabs, options: { localizations }, handlers: { close, focus } } = this;
        const list = this.getRef('list');
        if (list) {
            this.tabsInfo = tabs.map(({ title }, index) => {
                const tab = new Tab(list, {
                    title, index, localizations, active: index === activeTab, invisible: true,
                });
                if (close.length) {
                    close.forEach(handler => tab.addEventListener(CLOSE_EVENT_TYPE, handler));
                }
                if (focus.length) {
                    focus.forEach(handler => tab.addEventListener(CLICK_EVENT_TYPE, handler));
                }
                tab.addEventListener(DRAG_EVENT_TYPE, this.tabDragHandler);
                tab.addEventListener(DRAG_END_EVENT_TYPE, this.tabDragEndHandler);
                tab.addEventListener(RENAME_EVENT_TYPE, this.renameTabHandler);
                return { tab, isVisible: true, width: tab.width };
            });
        }
    }
    updateVisibleListWidth() {
        const root = this.getRef('root');
        const leftMore = this.getRef('left-more');
        const rightMore = this.getRef('right-more');
        const add = this.getRef('add');
        this.visibleListWidth = root.offsetWidth - leftMore.offsetWidth - rightMore.offsetWidth
            - add.offsetWidth;
    }
    hideTabs() {
        this.updateTabsInfo();
        const { tabsInfo } = this;
        let shortcutIndex = 1;
        tabsInfo.forEach((item) => {
            if (item.isVisible) {
                item.tab.hidden = false;
                item.tab.invisible = false;
                item.tab.shortcutIndex = shortcutIndex < 10 ? shortcutIndex : 0;
                shortcutIndex += 1;
            }
            else {
                item.tab.shortcutIndex = 0;
                item.tab.hidden = true;
            }
        });
        this.updateLeftMoreView();
        this.updateRightMoreView();
    }
    updateTabsInfoSizes() {
        this.tabsInfo.forEach((item) => {
            item.width = item.tab.width;
        });
    }
    updateTabsInfo() {
        const { visibleListWidth, activeTabField, tabsInfo } = this;
        tabsInfo.forEach(item => item.isVisible = false);
        let usedWidth = 0;
        for (let i = activeTabField; i >= 0; i -= 1) {
            const tabInfo = tabsInfo[i];
            const updatedUsedWidth = usedWidth + tabInfo.width;
            if (activeTabField !== i && updatedUsedWidth > visibleListWidth)
                break;
            usedWidth = updatedUsedWidth;
            tabInfo.isVisible = true;
        }
        const afterActiveTabIndex = activeTabField + 1;
        const tabsInfoLength = tabsInfo.length;
        if (usedWidth < visibleListWidth && afterActiveTabIndex < tabsInfoLength) {
            for (let i = afterActiveTabIndex; i < tabsInfoLength; i += 1) {
                const tabInfo = tabsInfo[i];
                const updatedUsedWidth = usedWidth + tabInfo.width;
                if (updatedUsedWidth > visibleListWidth)
                    break;
                usedWidth = updatedUsedWidth;
                tabInfo.isVisible = true;
            }
        }
    }
    updateLeftMoreView() {
        const { tabsInfo } = this;
        let leftMoreCount = 0;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            const { isVisible } = tabsInfo[i];
            if (isVisible)
                break;
            else
                leftMoreCount += 1;
        }
        if (leftMoreCount)
            this.showLeftMore(leftMoreCount);
        else
            this.hideLeftMore();
    }
    updateRightMoreView() {
        const { tabsInfo } = this;
        let rightMoreCount = 0;
        for (let i = tabsInfo.length - 1; i >= 0; i -= 1) {
            const { isVisible } = tabsInfo[i];
            if (isVisible)
                break;
            else
                rightMoreCount += 1;
        }
        if (rightMoreCount)
            this.showRightMore(rightMoreCount);
        else
            this.hideRightMore();
    }
    showTabs() {
        const { tabsInfo } = this;
        this.hideLeftMore();
        this.hideRightMore();
        let shortcutIndex = 1;
        tabsInfo.forEach((item) => {
            item.isVisible = true;
            item.tab.hidden = false;
            item.tab.invisible = false;
            item.tab.shortcutIndex = shortcutIndex < 10 ? shortcutIndex : 0;
            shortcutIndex += 1;
        });
    }
    hideLeftMore() {
        const leftMore = this.getRef('left-more');
        const leftAdditional = this.getRef('leftAdditional');
        leftMore.classList.add(css$1.hidden);
        leftAdditional.classList.add(css$1.hidden);
    }
    showLeftMore(count = 1) {
        const leftMore = this.getRef('left-more');
        const leftAdditional = this.getRef('leftAdditional');
        leftMore.classList.remove(css$1.hidden);
        leftAdditional.classList.remove(css$1.hidden);
        if (count > 1)
            leftAdditional.classList.add(css$1.leftTwo);
        else
            leftAdditional.classList.remove(css$1.leftTwo);
    }
    hideRightMore() {
        const rightMore = this.getRef('right-more');
        const rightAdditional = this.getRef('rightAdditional');
        rightMore.classList.add(css$1.hidden);
        rightAdditional.classList.add(css$1.hidden);
    }
    showRightMore(count = 1) {
        const rightMore = this.getRef('right-more');
        const rightAdditional = this.getRef('rightAdditional');
        rightMore.classList.remove(css$1.hidden);
        rightAdditional.classList.remove(css$1.hidden);
        if (count > 1)
            rightAdditional.classList.add(css$1.rightTwo);
        else
            rightAdditional.classList.remove(css$1.rightTwo);
    }
    updateDragInfo(e) {
        const { dragInfo } = this;
        if (!dragInfo)
            return;
        const { clientX } = e;
        const { width: maxLeft, left } = this.getRef('list').getBoundingClientRect();
        const newLeft = clientX - left;
        if (newLeft < -2)
            return;
        dragInfo.left = Math.min(maxLeft, Math.max(0, newLeft));
    }
    updateTabsPosition() {
        const { dragInfo } = this;
        if (!dragInfo)
            return;
        const { replaceIndex } = dragInfo;
        const dragOverIndex = this.getDragOverIndex();
        if (dragOverIndex < 0)
            return;
        if (dragOverIndex !== replaceIndex) {
            dragInfo.replaceIndex = dragOverIndex;
            this.updateTabsViewOrder();
        }
    }
    getDragOverIndex() {
        const { tabsInfo, dragInfo } = this;
        if (!dragInfo)
            return -1;
        const { left } = dragInfo;
        let index = -1;
        let startOffset = 0;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            const { width, isVisible } = tabsInfo[i];
            if (!isVisible)
                continue;
            const endOffset = startOffset + width;
            if (left >= 0 && left < endOffset) {
                index = i;
                break;
            }
            startOffset = endOffset;
        }
        return index;
    }
    updateOrder() {
        this.updateTabsInfoOrder();
        this.updateTabsOrder();
    }
    updateTabsInfoOrder() {
        const { tabsInfo, dragInfo, activeTab, tabsField } = this;
        if (!dragInfo)
            return;
        const { index, replaceIndex } = dragInfo;
        const activeTabInfo = tabsInfo[activeTab];
        const spliced = tabsInfo.splice(index, 1);
        const splicedTab = tabsField.splice(index, 1);
        if (!spliced.length)
            return;
        tabsInfo.splice(replaceIndex, 0, spliced[0]);
        tabsField.splice(replaceIndex, 0, splicedTab[0]);
        this.activeTab = tabsInfo.indexOf(activeTabInfo) || 0;
        dragInfo.index = replaceIndex;
    }
    updateTabsOrder() {
        const { tabsInfo } = this;
        const list = this.getRef('list');
        if (!list)
            return;
        let shortcutIndex = 1;
        tabsInfo.forEach(({ tab, isVisible }, index) => {
            const tabRoot = tab.getRef('root');
            list.removeChild(tabRoot);
            tab.left = 0;
            list.appendChild(tabRoot);
            tab.index = index;
            if (isVisible) {
                tab.shortcutIndex = shortcutIndex;
                shortcutIndex += 1;
            }
            else {
                tab.shortcutIndex = 0;
            }
        });
    }
    getTabOffset(index) {
        const { tabsInfo } = this;
        return tabsInfo.reduce((acc, tabInfo, i) => {
            if (i >= index || !tabInfo.isVisible)
                return acc;
            return acc + tabInfo.width;
        }, 0);
    }
    updateTabsViewOrder() {
        const { dragInfo } = this;
        if (!dragInfo)
            return;
        const { index, replaceIndex } = dragInfo;
        if (replaceIndex <= index) {
            this.updateLeftDraggableTabPosition();
            this.updateLeftTabsViewOrder();
        }
        else {
            this.updateRightDraggableTabPosition();
            this.updateRightTabsViewOrder();
        }
    }
    updateLeftDraggableTabPosition() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        const targetLeft = this.getTabOffset(index) - tabsInfo.reduce((acc, tabInfo, i) => {
            return !tabInfo.isVisible || i >= replaceIndex ? acc : acc + tabInfo.width;
        }, 0);
        tabsInfo[index].tab.left = -1 * targetLeft;
    }
    updateRightDraggableTabPosition() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        tabsInfo[index].tab.left = tabsInfo.reduce((acc, tabInfo, i) => {
            return !tabInfo.isVisible || i < index || i > replaceIndex ? acc : acc + tabInfo.width;
        }, 0) - tabsInfo[index].width;
    }
    updateLeftTabsViewOrder() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        const offsetWidth = tabsInfo[index].width;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            if (i === index)
                continue;
            tabsInfo[i].tab.left = i < replaceIndex || i > index ? 0 : offsetWidth;
        }
    }
    updateRightTabsViewOrder() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        const offsetWidth = tabsInfo[index].width;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            if (i === index)
                continue;
            if (i > index && i <= replaceIndex)
                tabsInfo[i].tab.left = -1 * offsetWidth;
            else
                tabsInfo[i].tab.left = 0;
        }
    }
}

var template$6 = "<div ref=\"root\" class=\"root {className} {hidden}\">\n  <div class=\"addWindowContainer\">\n    <button ref=\"addWindowButton\" class=\"addWindowButton\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/>\n      </svg>\n    </button>\n    <div class=\"addWindowShortcutContainer\">\n      <span ref=\"addWindowShortcutText\" class=\"addWindowShortcutText\"></span>\n    </div>\n  </div>\n  <div ref=\"contentContainer\" class=\"contentContainer\"></div>\n</div>\n";

var css$6 = {"root":"root-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","horizontalResize":"horizontalResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","verticalResize":"verticalResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","leftBottomResize":"leftBottomResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","rightBottomResize":"rightBottomResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","hidden":"hidden-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","addWindowContainer":"addWindowContainer-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","addWindowButton":"addWindowButton-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","addWindowShortcutText":"addWindowShortcutText-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","contentContainer":"contentContainer-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8"};

var template$7 = "<div ref=\"root\" class=\"root\" tabindex=\"0\" style=\"--z-index: {zIndex}; left:{left}%; right:{right}%; top:{top}%; bottom:{bottom}%\">\n  <div ref=\"content\" class=\"content\">\n\n  </div>\n  <div data-type=\"leftTop\" ref=\"leftTop\" class=\"resize corner leftTop\"></div>\n  <div data-type=\"rightTop\" ref=\"rightTop\" class=\"resize corner rightTop\"></div>\n  <div data-type=\"leftBottom\" ref=\"leftBottom\" class=\"resize corner leftBottom\"></div>\n  <div data-type=\"rightBottom\" ref=\"rightBottom\" class=\"resize corner rightBottom\"></div>\n\n  <div data-type=\"left\" ref=\"left\" class=\"resize left\"></div>\n  <div data-type=\"right\" ref=\"right\" class=\"resize right\"></div>\n  <div data-type=\"top\" ref=\"top\" class=\"resize top\"></div>\n  <div data-type=\"bottom\" ref=\"bottom\" class=\"resize bottom\"></div>\n</div>\n";

var css$7 = {"root":"root-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","lockSelection":"lockSelection-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","content":"content-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","resize":"resize-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","corner":"corner-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","leftTop":"leftTop-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","rightBottom":"rightBottom-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","rightTop":"rightTop-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","leftBottom":"leftBottom-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","left":"left-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","right":"right-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","top":"top-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","bottom":"bottom-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b"};

const MIN_CONTENT_WINDOW_WIDTH = 50;
const MIN_CONTENT_WINDOW_HEIGHT = 50;
const ANCHOR_SIZE = 12;
const LEFT_MOVE_TYPE = 'left';
const RIGHT_MOVE_TYPE = 'right';
const TOP_MOVE_TYPE = 'top';
const BOTTOM_MOVE_TYPE = 'bottom';
const LEFT_TOP_MOVE_TYPE = 'leftTop';
const RIGHT_TOP_MOVE_TYPE = 'rightTop';
const LEFT_BOTTOM_MOVE_TYPE = 'leftBottom';
const RIGHT_BOTTOM_MOVE_TYPE = 'rightBottom';
const HEADER_MOVE_TYPE = 'header';
const MOVE_TYPES = [
    LEFT_MOVE_TYPE, RIGHT_MOVE_TYPE, TOP_MOVE_TYPE, BOTTOM_MOVE_TYPE,
    LEFT_TOP_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE,
    HEADER_MOVE_TYPE,
];

var css$8 = {"header":"header-terminals-orchestrator-️16cb72c51d3ce56e49912e0c4469a9e4","editable":"editable-terminals-orchestrator-️16cb72c51d3ce56e49912e0c4469a9e4"};

var template$8 = "<div ref=\"root\" class=\"root {reverse}\">\n  <div ref=\"close\" class=\"close\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n    </svg>\n  </div>\n  <div ref=\"inputContainer\" class=\"inputContainer\"></div>\n  <div ref=\"rename\" class=\"rename\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\n    </svg>\n  </div>\n</div>\n";

var css$9 = {"root":"root-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","reverse":"reverse-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","close":"close-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","rename":"rename-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","inputContainer":"inputContainer-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","input":"input-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6"};

class TermHeader extends term.TemplateEngine {
    constructor(container, options) {
        super(template$8, container);
        this.submitTitleHandler = () => {
            const { options: { onRename }, selectInput } = this;
            selectInput.disabled = true;
            if (onRename)
                onRename(selectInput.value);
        };
        this.onRename = () => {
            const { selectInput } = this;
            const { onRenaming } = this.options;
            selectInput.disabled = false;
            selectInput.focus();
            selectInput.select();
            if (onRenaming)
                onRenaming();
        };
        this.options = options;
        this.render();
        this.selectInput = new SelectInput(this.getRef('inputContainer'), {
            className: css$9.input, value: options.title, disabled: true,
            onSubmit: this.submitTitleHandler, onBlur: this.submitTitleHandler,
        });
    }
    get draggableElement() {
        return this.getRef('inputContainer');
    }
    render() {
        super.render({ css: css$9, reverse: IS_MAC ? '' : css$9.reverse });
        this.addListeners();
    }
    destroy() {
        this.removeListeners();
        this.selectInput.destroy();
        super.destroy();
    }
    addListeners() {
        const { onClose } = this.options;
        const rename = this.getRef('rename');
        const close = this.getRef('close');
        if (onClose)
            close.addEventListener('click', onClose);
        rename.addEventListener('click', this.onRename);
    }
    removeListeners() {
        const { onClose } = this.options;
        const rename = this.getRef('rename');
        const close = this.getRef('close');
        if (onClose)
            close.removeEventListener('click', onClose);
        rename.removeEventListener('click', this.onRename);
    }
}

class TermHeaderPlugin extends term.Plugin {
    constructor(options) {
        super();
        this.onStartRenaming = () => {
            const { termInfo } = this;
            if (!termInfo)
                return;
            const title = termInfo.elements.title;
            title.classList.add(css$8.editable);
        };
        this.onRename = (name) => {
            const { termInfo, options: { onRename } } = this;
            if (!termInfo)
                return;
            const title = termInfo.elements.title;
            title.classList.remove(css$8.editable);
            if (onRename)
                onRename(name);
        };
        this.options = options;
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        const { title } = termInfo.elements;
        if (title) {
            this.addTermHeader();
            this.addListeners();
        }
    }
    destroy() {
        var _a;
        this.removeListeners();
        (_a = this.termHeader) === null || _a === void 0 ? void 0 : _a.destroy();
        super.destroy();
    }
    addListeners() {
        const { termHeader, options: { onStartMove } } = this;
        const draggableElement = termHeader === null || termHeader === void 0 ? void 0 : termHeader.draggableElement;
        if (!draggableElement || !onStartMove)
            return;
        draggableElement.addEventListener('mousedown', onStartMove);
    }
    removeListeners() {
        const { termHeader, options: { onStartMove } } = this;
        const draggableElement = termHeader === null || termHeader === void 0 ? void 0 : termHeader.draggableElement;
        if (!draggableElement || !onStartMove)
            return;
        draggableElement.removeEventListener('mousedown', onStartMove);
    }
    addTermHeader() {
        const { termInfo, options: { onClose } } = this;
        if (!termInfo)
            return;
        const title = termInfo.elements.title;
        const titleText = termInfo.title;
        title.classList.add(css$8.header);
        this.termHeader = new TermHeader(title, {
            onClose, title: titleText, onRenaming: this.onStartRenaming, onRename: this.onRename,
        });
        this.termHeader.draggableElement.setAttribute('data-type', 'header');
    }
}

var strings = {
    untitledTab: 'Untitled',
    untitledTerm: 'Untitled',
    tabConfirmationModalSubmit: 'Close',
    tabConfirmationModalCancel: 'Cancel',
    tabConfirmationModalTitle: 'Close tab',
    tabConfirmationModalText: 'Are you sure you want to close tab <span>"{name}"</span>?',
    termConfirmationModalSubmit: 'Close',
    termConfirmationModalCancel: 'Cancel',
    termConfirmationModalTitle: 'Close terminal',
    termConfirmationModalText: 'Are you sure you want to close terminal <span>"{name}"</span>?',
};

class ContentWindow extends term.TemplateEngine {
    constructor(container, options) {
        super(template$7, container);
        this.isDisabled = false;
        this.zIndexField = 0;
        this.lockSelectionField = false;
        this.onMouseDown = (e) => {
            const { onStartMove } = this.options;
            const { target } = e;
            if (!target || !onStartMove)
                return;
            const dataType = target.getAttribute('data-type');
            if (dataType && MOVE_TYPES.includes(dataType)) {
                this.moveType = dataType;
                onStartMove(dataType, this, e);
            }
        };
        this.onEndMove = (e) => {
            const { moveType, options: { onEndMove } } = this;
            if (!moveType)
                return;
            delete this.moveType;
            if (onEndMove)
                onEndMove(moveType, this, e);
        };
        this.onMove = (e) => {
            const { moveType, options: { onMove } } = this;
            if (moveType && onMove)
                onMove(moveType, this, e);
        };
        this.onFocus = (e) => {
            const { onFocus } = this.options;
            if (onFocus)
                onFocus(this, e);
        };
        this.onRename = (name) => {
            this.term.header = name;
        };
        this.onClose = () => {
            const { options: { onClose } } = this;
            if (onClose)
                onClose(this);
        };
        this.options = options;
        this.zIndexField = options.zIndex || 0;
        this.render();
        this.term = new term.Term(this.getRef('content'), {
            lines: [],
            header: options.title || strings.untitledTerm,
        });
        this.term.keyboardShortcutsManager.layer = this.zIndexField;
        this.termHeaderPlugin = new TermHeaderPlugin({
            onStartMove: this.onMouseDown, onRename: this.onRename, onClose: this.onClose,
        });
        this.term.pluginManager.register(this.termHeaderPlugin);
        this.addListeners();
    }
    get title() {
        return this.term.header;
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled, term } = this;
        if (isDisabled === val)
            return;
        this.isDisabled = val;
        if (val)
            term.blur();
        term.disabled = val;
    }
    get zIndex() {
        return this.zIndexField;
    }
    set zIndex(val) {
        const { zIndexField } = this;
        this.zIndexField = val;
        if (zIndexField !== val) {
            const root = this.getRef('root');
            root.style.setProperty('--z-index', String(val));
            this.term.keyboardShortcutsManager.layer = val;
        }
    }
    get lockSelection() {
        return this.lockSelectionField;
    }
    set lockSelection(val) {
        const { lockSelectionField } = this;
        this.lockSelectionField = val;
        const root = this.getRef('root');
        if (!root || lockSelectionField === val)
            return;
        if (val)
            root.classList.add(css$7.lockSelection);
        else
            root.classList.remove(css$7.lockSelection);
    }
    get position() {
        const { left, right, top, bottom } = this.options.position;
        return { left, right, top, bottom };
    }
    set position(val) {
        const { left, right, top, bottom } = val;
        const { position } = this.options;
        this.options.position = { left, right, top, bottom };
        const root = this.getRef('root');
        if (position.left !== left)
            root.style.left = `${left}%`;
        if (position.right !== right)
            root.style.right = `${right}%`;
        if (position.top !== top)
            root.style.top = `${top}%`;
        if (position.bottom !== bottom)
            root.style.bottom = `${bottom}%`;
    }
    get dragElements() {
        return {
            leftTop: this.getRef('leftTop'),
            rightTop: this.getRef('rightTop'),
            leftBottom: this.getRef('leftBottom'),
            rightBottom: this.getRef('rightBottom'),
            left: this.getRef('left'),
            right: this.getRef('right'),
            top: this.getRef('top'),
            bottom: this.getRef('bottom'),
        };
    }
    render() {
        super.render(Object.assign(Object.assign({ css: css$7 }, this.options.position), { zIndex: this.zIndex }));
    }
    destroy() {
        this.removeListeners();
        this.term.destroy();
        super.destroy();
    }
    addListeners() {
        const { leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom, } = this.dragElements;
        const root = this.getRef('root');
        leftTop.addEventListener('mousedown', this.onMouseDown);
        rightTop.addEventListener('mousedown', this.onMouseDown);
        leftBottom.addEventListener('mousedown', this.onMouseDown);
        rightBottom.addEventListener('mousedown', this.onMouseDown);
        left.addEventListener('mousedown', this.onMouseDown);
        right.addEventListener('mousedown', this.onMouseDown);
        top.addEventListener('mousedown', this.onMouseDown);
        bottom.addEventListener('mousedown', this.onMouseDown);
        root.addEventListener('focus', this.onFocus);
        this.term.addEventListener('focus', this.onFocus);
        window.addEventListener('mouseup', this.onEndMove);
        window.addEventListener('mouseleave', this.onEndMove);
        window.addEventListener('mousemove', this.onMove);
    }
    removeListeners() {
        const { leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom, } = this.dragElements;
        const root = this.getRef('root');
        leftTop.removeEventListener('mousedown', this.onMouseDown);
        rightTop.removeEventListener('mousedown', this.onMouseDown);
        leftBottom.removeEventListener('mousedown', this.onMouseDown);
        rightBottom.removeEventListener('mousedown', this.onMouseDown);
        left.removeEventListener('mousedown', this.onMouseDown);
        right.removeEventListener('mousedown', this.onMouseDown);
        top.removeEventListener('mousedown', this.onMouseDown);
        bottom.removeEventListener('mousedown', this.onMouseDown);
        root.removeEventListener('focus', this.onFocus);
        this.term.removeEventListener('focus', this.onFocus);
        window.removeEventListener('mouseup', this.onEndMove);
        window.removeEventListener('mouseleave', this.onEndMove);
        window.removeEventListener('mousemove', this.onMove);
    }
}

var template$9 = "<div class=\"overlay\" ref=\"overlay\">\n  <div ref=\"root\" class=\"modal\">\n    <if condition=\"{title}\">\n      <div class=\"title\">\n        <div class=\"titleTextContainer\">\n          <span>{title}</span>\n        </div>\n      </div>\n    </if>\n    <div class=\"content\">\n      <div class=\"contentTextContainer\">\n        <span class=\"contentText\">{text}</span>\n      </div>\n    </div>\n    <if condition=\"{cancel || submit}\">\n      <div class=\"controls\">\n        <if condition=\"{submit}\">\n          <button class=\"submit\" ref=\"submit\">\n            {submit}\n          </button>\n        </if>\n        <if condition=\"{cancel}\">\n          <button class=\"cancel\" ref=\"cancel\">\n            {cancel}\n          </button>\n        </if>\n      </div>\n    </if>\n  </div>\n</div>\n";

var css$a = {"overlay":"overlay-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","modal":"modal-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","title":"title-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","titleTextContainer":"titleTextContainer-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","content":"content-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","contentTextContainer":"contentTextContainer-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","contentText":"contentText-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","controls":"controls-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","submit":"submit-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","cancel":"cancel-terminals-orchestrator-️34e4e38956f7adea50854106743b646e"};

const stopPropagation = (e) => e.stopPropagation();

class ConfirmationModal extends term.TemplateEngine {
    constructor(container, options) {
        super(template$9, container);
        this.options = options;
        this.render();
        this.emitter = new keyLayersJs.Emitter(keyLayersJs.EMITTER_TOP_LAYER_TYPE);
        this.addListeners();
    }
    render() {
        const { title, text, submit, cancel, onSubmit, onCancel } = this.options;
        super.render({
            css: css$a, title, text, submit: onSubmit ? submit : '', cancel: onCancel ? cancel : '',
        });
    }
    destroy() {
        this.removeListeners();
        this.emitter.destroy();
        super.destroy();
    }
    addListeners() {
        const { emitter, options: { onSubmit, onCancel } } = this;
        const root = this.getRef('root');
        root.addEventListener('click', stopPropagation);
        if (onSubmit) {
            const submit = this.getRef('submit');
            if (submit)
                submit.addEventListener('click', onSubmit);
            emitter.addListener('keyDown', onSubmit, { code: ENTER_KEY_CODE });
        }
        if (onCancel) {
            const cancel = this.getRef('cancel');
            const overlay = this.getRef('overlay');
            overlay.addEventListener('click', onCancel);
            if (cancel)
                cancel.addEventListener('click', onCancel);
            emitter.addListener('keyDown', onCancel, { code: ESC_KEY_CODE });
        }
    }
    removeListeners() {
        const { emitter, options: { onSubmit, onCancel } } = this;
        if (onSubmit) {
            const submit = this.getRef('submit');
            if (submit)
                submit.removeEventListener('click', onSubmit);
            emitter.removeListener('keyDown', onSubmit);
        }
        if (onCancel) {
            const cancel = this.getRef('cancel');
            const overlay = this.getRef('overlay');
            overlay.removeEventListener('click', onCancel);
            if (cancel)
                cancel.removeEventListener('click', onCancel);
            emitter.removeListener('keyDown', onCancel);
        }
    }
}

class Content extends term.TemplateEngine {
    constructor(container, options = { id: -1 }) {
        super(template$6, container);
        this.isDisabled = false;
        this.hiddenField = false;
        this.contentWindows = [];
        this.addContentWindow = () => {
            var _a, _b;
            const cn = new ContentWindow(this.getRef('contentContainer'), {
                position: { left: 20, right: 20, top: 20, bottom: 20 },
                onStartMove: this.onStartMove,
                onEndMove: this.onEndMove,
                onMove: this.onMove,
                onFocus: this.onFocus,
                onClose: this.onClose,
                title: (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.localization) === null || _b === void 0 ? void 0 : _b.untitledTerm,
                zIndex: this.nextZIndex,
            });
            this.contentWindows.push(cn);
            this.onFocus(cn);
            return cn;
        };
        this.onStartMove = (type, contentWindow, e) => {
            this.moveInfo = {
                type, contentWindow, startPosition: { left: e.clientX, top: e.clientY },
                startOffsets: contentWindow.position,
            };
            contentWindow.lockSelection = true;
            this.updateGlobalCursor();
        };
        this.onEndMove = () => {
            const { moveInfo } = this;
            if (moveInfo)
                moveInfo.contentWindow.lockSelection = false;
            this.removeGlobalCursor();
            delete this.moveInfo;
        };
        this.onMove = (type, contentWindow, e) => {
            const { moveInfo } = this;
            if (!moveInfo)
                return;
            if ([LEFT_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, LEFT_TOP_MOVE_TYPE].includes(type)) {
                this.onLeftSideMove(e);
            }
            if ([RIGHT_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
                this.onRightSideMove(e);
            }
            if ([TOP_MOVE_TYPE, LEFT_TOP_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
                this.onTopSideMove(e);
            }
            if ([BOTTOM_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE].includes(type)) {
                this.onBottomSideMove(e);
            }
            if (HEADER_MOVE_TYPE === type)
                this.onWindowMove(e);
        };
        this.onFocus = (contentWindow) => {
            const sortedWindows = this.contentWindows.sort((f, s) => f.zIndex - s.zIndex);
            const zIndexMax = sortedWindows.length - 1;
            contentWindow.zIndex = zIndexMax;
            let isUpdating = false;
            sortedWindows.forEach((item) => {
                if (isUpdating)
                    item.zIndex -= 1;
                if (item === contentWindow)
                    isUpdating = true;
            });
        };
        this.onClose = (contentWindow) => {
            var _a;
            const { contentWindows, options: { localization } } = this;
            const index = contentWindows.indexOf(contentWindow);
            if (index < 0 || this.disabled)
                return;
            this.disabled = true;
            this.cm = new ConfirmationModal(this.getRef('root'), {
                submit: (localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalSubmit) || strings.termConfirmationModalSubmit,
                cancel: (localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalCancel) || strings.termConfirmationModalCancel,
                title: (localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalTitle) || strings.termConfirmationModalTitle,
                text: safeTemplate((localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalText) || strings.termConfirmationModalText, { name: ((_a = contentWindows[index]) === null || _a === void 0 ? void 0 : _a.title) || '' }),
                onCancel: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    this.disabled = false;
                },
                onSubmit: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    this.disabled = false;
                    contentWindows.splice(index, 1);
                    contentWindow.destroy();
                },
            });
        };
        this.options = options;
        this.id = options.id;
        this.hiddenField = options.hidden || false;
        this.render();
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled, contentWindows } = this;
        if (isDisabled === val)
            return;
        this.isDisabled = val;
        contentWindows.forEach(cn => cn.disabled = val);
    }
    get hidden() {
        return this.hiddenField;
    }
    set hidden(val) {
        const { hiddenField } = this;
        this.hiddenField = val;
        if (hiddenField === val)
            return;
        if (val)
            this.getRef('root').classList.add(css$6.hidden);
        else
            this.getRef('root').classList.remove(css$6.hidden);
    }
    get relativeAnchorSize() {
        const root = this.getRef('root');
        const { offsetWidth } = root;
        return ANCHOR_SIZE / offsetWidth * 100;
    }
    get nextZIndex() {
        const { contentWindows } = this;
        return contentWindows.length
            ? contentWindows.sort((f, s) => s.zIndex - f.zIndex)[0].zIndex + 1
            : 0;
    }
    render() {
        const { className = '', hidden } = this.options;
        super.render({ css: css$6, className, hidden: hidden ? css$6.hidden : '' });
        const addWindowShortcutText = this.getRef('addWindowShortcutText');
        addWindowShortcutText.innerHTML = IS_MAC ? '⌘E' : 'ctrl E';
        this.addListeners();
    }
    destroy() {
        var _a;
        this.removeListeners();
        (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
        super.destroy();
    }
    addListeners() {
        const addWindowButton = this.getRef('addWindowButton');
        addWindowButton.addEventListener('click', this.addContentWindow);
    }
    removeListeners() {
        const addWindowButton = this.getRef('addWindowButton');
        addWindowButton.removeEventListener('click', this.addContentWindow);
    }
    updateGlobalCursor() {
        const { type } = this.moveInfo;
        const root = this.getRef('root');
        if ([LEFT_MOVE_TYPE, RIGHT_MOVE_TYPE].includes(type))
            root.classList.add(css$6.horizontalResize);
        if ([TOP_MOVE_TYPE, BOTTOM_MOVE_TYPE].includes(type))
            root.classList.add(css$6.verticalResize);
        if ([LEFT_BOTTOM_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
            root.classList.add(css$6.leftBottomResize);
        }
        if ([RIGHT_BOTTOM_MOVE_TYPE, LEFT_TOP_MOVE_TYPE].includes(type)) {
            root.classList.add(css$6.rightBottomResize);
        }
    }
    removeGlobalCursor() {
        const root = this.getRef('root');
        root.classList.remove(css$6.horizontalResize);
        root.classList.remove(css$6.verticalResize);
        root.classList.remove(css$6.leftBottomResize);
        root.classList.remove(css$6.rightBottomResize);
    }
    getFilteredContentWindows(skip) {
        const { contentWindows } = this;
        return contentWindows.filter(item => item !== skip);
    }
    getHorizontalAnchorPoints(contentWindow) {
        const { relativeAnchorSize } = this;
        return lodashEs.uniq(this.getFilteredContentWindows(contentWindow).reduce((acc, item) => {
            const { left, right } = item.position;
            acc.push(left);
            acc.push(100 - right);
            return acc;
        }, [])).filter((item) => 0 !== item && 100 !== item).sort((first, second) => {
            return first - second;
        }).reduce((acc, position, index, arr) => {
            const prevPosition = arr[index - 1] || -1;
            const nextPosition = arr[index + 1] || -1;
            if (position <= 0)
                return acc;
            acc.push({
                position,
                startOffset: prevPosition >= 0 ? Math.min(relativeAnchorSize, (position - prevPosition) / 2)
                    : relativeAnchorSize,
                endOffset: nextPosition >= 0 ? Math.min(relativeAnchorSize, (position + nextPosition) / 2)
                    : relativeAnchorSize,
            });
            return acc;
        }, []);
    }
    getVerticalAnchorPoints(contentWindow) {
        const { relativeAnchorSize } = this;
        return lodashEs.uniq(this.getFilteredContentWindows(contentWindow).reduce((acc, item) => {
            const { top, bottom } = item.position;
            acc.push(top);
            acc.push(100 - bottom);
            return acc;
        }, [])).filter((item) => 0 !== item && 100 !== item).sort((first, second) => {
            return first - second;
        }).reduce((acc, position, index, arr) => {
            const prevPosition = arr[index - 1] || -1;
            const nextPosition = arr[index + 1] || -1;
            if (position <= 0)
                return acc;
            acc.push({
                position,
                startOffset: prevPosition >= 0 ? Math.min(relativeAnchorSize, (position - prevPosition) / 2)
                    : relativeAnchorSize,
                endOffset: nextPosition >= 0 ? Math.min(relativeAnchorSize, (position + nextPosition) / 2)
                    : relativeAnchorSize,
            });
            return acc;
        }, []);
    }
    onLeftSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { left, right }, } = this.moveInfo;
        const horizontalAnchorPoints = this.getHorizontalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootWidth = root.offsetWidth;
        const offset = e.clientX - startPosition.left;
        const relativeOffset = offset / rootWidth * 100;
        let newLeft = left + relativeOffset;
        horizontalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const anchorMin = position - startOffset;
            const anchorMax = position + endOffset;
            if (newLeft < anchorMin || newLeft > anchorMax)
                return false;
            newLeft = position;
            return true;
        });
        const maxLeft = Math.max(100 - right - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { left: Math.max(0, Math.min(newLeft, maxLeft)) });
    }
    onRightSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { left, right }, } = this.moveInfo;
        const horizontalAnchorPoints = this.getHorizontalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootWidth = root.offsetWidth;
        const offset = e.clientX - startPosition.left;
        const relativeOffset = offset / rootWidth * 100;
        let newRight = right - relativeOffset;
        horizontalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const rightPosition = 100 - position;
            const anchorMin = rightPosition - endOffset;
            const anchorMax = 100 - position + startOffset;
            if (newRight < anchorMin || newRight > anchorMax)
                return false;
            newRight = rightPosition;
            return true;
        });
        const maxRight = Math.max(100 - left - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { right: Math.max(0, Math.min(newRight, maxRight)) });
    }
    onTopSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { top, bottom }, } = this.moveInfo;
        const verticalAnchorPoints = this.getVerticalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootHeight = root.offsetHeight;
        const offset = e.clientY - startPosition.top;
        const relativeOffset = offset / rootHeight * 100;
        let newTop = top + relativeOffset;
        verticalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const anchorMin = position - startOffset;
            const anchorMax = position + endOffset;
            if (newTop < anchorMin || newTop > anchorMax)
                return false;
            newTop = position;
            return true;
        });
        const maxTop = Math.max(100 - bottom - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { top: Math.max(0, Math.min(newTop, maxTop)) });
    }
    onBottomSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { top, bottom }, } = this.moveInfo;
        const verticalAnchorPoints = this.getVerticalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootHeight = root.offsetHeight;
        const offset = e.clientY - startPosition.top;
        const relativeOffset = offset / rootHeight * 100;
        let newBottom = bottom - relativeOffset;
        verticalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const bottomPosition = 100 - position;
            const anchorMin = bottomPosition - endOffset;
            const anchorMax = 100 - position + startOffset;
            if (newBottom < anchorMin || newBottom > anchorMax)
                return false;
            newBottom = bottomPosition;
            return true;
        });
        const maxBottom = Math.max(100 - top - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { bottom: Math.max(0, Math.min(newBottom, maxBottom)) });
    }
    onWindowMove(e) {
        const { contentWindow, startPosition, startOffsets: { left, right, top, bottom }, } = this.moveInfo;
        const root = this.getRef('root');
        const verticalOffset = e.clientY - startPosition.top;
        const horizontalOffset = e.clientX - startPosition.left;
        const { offsetHeight: rootHeight, offsetWidth: rootWidth } = root;
        const relativeVerticalOffset = verticalOffset / rootHeight * 100;
        const relativeHorizontalOffset = horizontalOffset / rootWidth * 100;
        const relativeWidth = 100 - left - right;
        const relativeHeight = 100 - top - bottom;
        let newLeft = Math.max(left + relativeHorizontalOffset, 0);
        let newRight = 100 - relativeWidth - newLeft;
        let newTop = Math.max(top + relativeVerticalOffset, 0);
        let newBottom = 100 - relativeHeight - newTop;
        if (newRight < 0) {
            newRight = 0;
            newLeft = 100 - relativeWidth;
        }
        if (newBottom < 0) {
            newBottom = 0;
            newTop = 100 - relativeHeight;
        }
        contentWindow.position = { left: newLeft, right: newRight, top: newTop, bottom: newBottom };
    }
}

class Workspace extends term.TemplateEngine {
    constructor(container, options = {}) {
        super(template, container);
        this.nextTabId = 1;
        this.contentList = [];
        this.emitter = new keyLayersJs.Emitter(keyLayersJs.EMITTER_FORCE_LAYER_TYPE);
        this.newContentWindowHandler = (e) => {
            const { activeContent } = this;
            e.preventDefault();
            if (activeContent) {
                activeContent.addContentWindow();
            }
        };
        this.focusTabHandler = (index) => {
            const content = this.getTabContent(index);
            if (content) {
                this.tabsView.activeTab = index;
                this.contentList.forEach((item) => {
                    item.hidden = item !== content;
                });
            }
        };
        this.closeTabHandler = (index) => {
            const { tabsView, contentList, options: { localization } } = this;
            contentList.forEach(c => c.disabled = true);
            this.cm = new ConfirmationModal(this.getRef('root'), {
                submit: (localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalSubmit) || strings.tabConfirmationModalSubmit,
                cancel: (localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalCancel) || strings.tabConfirmationModalCancel,
                title: (localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalTitle) || strings.tabConfirmationModalTitle,
                text: safeTemplate((localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalText) || strings.tabConfirmationModalText, { name: tabsView.tabs[index].title }),
                onCancel: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    contentList.forEach(c => c.disabled = false);
                },
                onSubmit: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    contentList.forEach(c => c.disabled = false);
                    const content = this.getTabContent(index);
                    const activeTab = tabsView.activeTab;
                    let newActiveTab = index === activeTab ? Math.max(0, activeTab - 1) : activeTab;
                    if (activeTab > index)
                        newActiveTab = activeTab - 1;
                    tabsView.tabs = this.tabsView.tabs.filter((_, i) => i !== index);
                    if (content) {
                        const contentIndex = contentList.indexOf(content);
                        content.destroy();
                        if (contentIndex >= 0)
                            contentList.splice(contentIndex, 1);
                    }
                    this.focusTabHandler(newActiveTab);
                },
            });
        };
        this.addTabHandler = () => {
            var _a;
            const { tabsView, options } = this;
            const tabInfo = {
                title: ((_a = options === null || options === void 0 ? void 0 : options.localization) === null || _a === void 0 ? void 0 : _a.untitledTab) || strings.untitledTab,
                id: this.nextTabId,
            };
            tabsView.tabs = [...tabsView.tabs, tabInfo];
            this.nextTabId += 1;
            this.addContentWindow(tabInfo.id);
            this.focusTabHandler(tabsView.tabs.length - 1);
        };
        this.options = options;
        this.render();
        const tabsView = new Tabs(this.getRef('tabs'));
        tabsView.addEventListener('focus', this.focusTabHandler);
        tabsView.addEventListener('close', this.closeTabHandler);
        tabsView.addEventListener('add', this.addTabHandler);
        this.emitter.addListener('keyDown', this.addTabHandler, { code: E_KEY_CODE, altKey: true });
        this.emitter.addListener('keyDown', this.newContentWindowHandler, Object.assign({ code: E_KEY_CODE }, (IS_MAC ? { metaKey: true } : { ctrlKey: true })));
        this.tabsView = tabsView;
    }
    set tabs(val) {
        const { tabsView } = this;
        tabsView.tabs = val.map((item) => {
            if (typeof item === 'string') {
                const tabInfo = { title: item, id: this.nextTabId };
                this.nextTabId += 1;
                this.addContentWindow(tabInfo.id);
                return tabInfo;
            }
            return item;
        });
        this.focusTabHandler(tabsView.activeTab);
    }
    get tabs() {
        return this.tabsView.tabs;
    }
    set activeTab(val) {
        this.tabsView.activeTab = val;
    }
    get activeTab() {
        return this.tabsView.activeTab;
    }
    get activeContent() {
        const { activeTab } = this.tabsView;
        return this.getTabContent(activeTab);
    }
    getTabContent(index) {
        const tabInfo = this.tabsView.tabs[index];
        if (!tabInfo)
            return null;
        const { id } = tabInfo;
        return this.contentList.find(item => item.id === id) || null;
    }
    render() {
        super.render({ css });
    }
    destroy() {
        const { tabsView, contentList, emitter, cm } = this;
        emitter.removeListener('keyDown', this.newContentWindowHandler);
        emitter.removeListener('keyDown', this.addTabHandler);
        emitter.destroy();
        contentList.forEach(item => item.destroy());
        tabsView.destroy();
        cm === null || cm === void 0 ? void 0 : cm.destroy();
        super.destroy();
    }
    addContentWindow(id, hidden = true) {
        const { contentList, options } = this;
        contentList.push(new Content(this.getRef('content'), {
            id, hidden, className: css.contentItem, localization: options.localization,
        }));
    }
}

class TerminalsOrchestrator {
    constructor(container, options) {
        this.workspace = new Workspace(container, { localization: options.localization });
        let activeIndex = 0;
        this.workspace.tabs = options.tabs.map(({ name, focused }, index) => {
            if (focused)
                activeIndex = index;
            return name || '';
        });
        this.workspace.activeTab = activeIndex;
    }
    destroy() {
        this.workspace.destroy();
    }
}

exports.TerminalsOrchestrator = TerminalsOrchestrator;
//# sourceMappingURL=index.js.map
