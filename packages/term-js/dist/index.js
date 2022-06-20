import { template as template$5, omit, isUndefined, last, isString, unescape, identity, noop, isArray, get, isNumber, isObject } from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';
import { Emitter } from 'key-layers-js';
import { v1 } from 'uuid';

var template$4 = "<div ref=\"root\" class=\"Term\">\n  <div ref=\"header\" class=\"Term__header {hidden}\">\n    <div ref=\"headerTextContainer\" class=\"Term__headerTextContainer\">\n      <span ref=\"headerText\" class=\"Term__headerText\">{header}</span>\n    </div>\n  </div>\n  <div ref=\"content\" class=\"Term__content\">\n    <div ref=\"linesContainer\" class=\"Term__linesContainer\"></div>\n  </div>\n</div>\n";

var template$3 = "<div ref=\"root\" class=\"VirtualizedList__root className\">\n  <div ref=\"virtualizedList\" class=\"VirtualizedList\">\n    <div ref=\"itemsContainer\" class=\"VirtualizedList__itemsContainer\"></div>\n  </div>\n  <div ref=\"generalList\" class=\"VirtualizedList__generalList\"></div>\n</div>\n";

var css$1 = undefined;

class Animation {
    constructor() {
        Animation.activateRequestAnimationFrame();
        this.registerFrameHandler();
    }
    static activateRequestAnimationFrame() {
        if (!Animation.animationFrame) {
            Animation.animationFrame = window
                .requestAnimationFrame(Animation.requestAnimationFrameHandler);
        }
    }
    static deactivateRequestAnimationFrame() {
        if (!Animation.handlerList.length) {
            window.cancelAnimationFrame(Animation.animationFrame);
        }
    }
    static requestAnimationFrameHandler() {
        Animation.handlerList.forEach((handler) => handler());
        Animation.animationFrame = window
            .requestAnimationFrame(Animation.requestAnimationFrameHandler);
    }
    destroy() {
        this.removeHandler();
    }
    registerFrameHandler() {
        if (this.frameHandler)
            this.addHandler();
    }
    unregisterFrameHandler() {
        if (this.frameHandler)
            this.removeHandler();
    }
    addHandler() {
        const { frameHandler } = this;
        if (frameHandler) {
            Animation.activateRequestAnimationFrame();
            Animation.handlerList.push(frameHandler);
        }
    }
    removeHandler() {
        const { handlerList } = Animation;
        const { frameHandler } = this;
        if (frameHandler && handlerList.includes(frameHandler)) {
            const index = handlerList.indexOf(frameHandler);
            handlerList.splice(index, 1);
        }
        Animation.deactivateRequestAnimationFrame();
    }
}
Animation.handlerList = [];

const CLASS_NAME_PATTERN = /class="[^"]+"/ig;
const REF_PATTERN = /ref="[^"]+"/ig;
const IF_OPEN_PATTERN = /<If\scondition="\{[^"]+}">/gi;
const IF_CLOSE_PATTERN = /<\/If>/gi;
const CHOOSE_OPEN_PATTERN = /<Choose>/gi;
const CHOOSE_CLOSE_PATTERN = /<\/Choose>/gi;
const CHOOSE_PATTERN = /<Choose>(.(?!\/Choose>)|\n(?!\/Choose>)|\s(?!\/Choose>))+/gi;
const WHEN_PATTERN = /<When\scondition="\{[^"]+}">(.(?!\/When>)|\n(?!\/When>)|\s(?!\/When>))+/gi;
const WHEN_OPEN_PATTERN = /<When\scondition="\{[^"]+}">/gi;
const WHEN_CLOSE_PATTERN = /<\/When>/gi;
const OTHERWISE_PATTERN = /<Otherwise>(.(?!\/Otherwise>)|\n(?!\/Otherwise>)|\s(?!\/Otherwise>))+/gi;
const OTHERWISE_OPEN_PATTERN = /<Otherwise>/gi;
const OTHERWISE_CLOSE_PATTERN = /<\/Otherwise>/gi;

class TemplateEngine extends Animation {
    constructor(template, container) {
        super();
        this.childNodesField = [];
        this.templateField = '';
        this.isHidden = false;
        this.refMap = {};
        if (template)
            this.template = template;
        this.containerField = container || this.containerField;
    }
    static getProxyChildNodes(renderString) {
        const proxyContainer = document.createElement('div');
        const proxyChildNodes = [];
        proxyContainer.innerHTML = renderString;
        const { childNodes } = proxyContainer;
        for (let i = 0, ln = childNodes.length; i < ln; i += 1) {
            proxyChildNodes.push(childNodes[i]);
        }
        return proxyChildNodes;
    }
    static insertAfter(container, element, ref) {
        const { childNodes } = container;
        const index = Array.prototype.indexOf.call(childNodes, ref);
        if (index < 0)
            return;
        if (index === childNodes.length - 1) {
            container.appendChild(element);
        }
        else {
            container.insertBefore(element, childNodes[index + 1]);
        }
    }
    static getRenderStringWithClassNames(renderString, params = {}) {
        const { css } = params;
        if (!css)
            return renderString;
        const classNameStringList = renderString.match(CLASS_NAME_PATTERN);
        if (!classNameStringList)
            return renderString;
        return classNameStringList.reduce((acc, classNameString) => {
            const classNameList = classNameString.replace('class="', '').replace('"', '').split(' ');
            const replacedClassNameList = classNameList
                .map((item) => css[item] || item).join(' ');
            const pattern = new RegExp(`class="${classNameList.join('\\s')}"`);
            return acc.replace(pattern, `class="${replacedClassNameList}"`);
        }, renderString);
    }
    static getRenderStringWithVariables(renderString, params = {}) {
        // eslint-disable-next-line no-param-reassign
        delete params.css;
        return Object.keys(params).reduce((acc, key) => {
            const pattern = new RegExp(`\\{${key}}`, 'g');
            return acc.replace(pattern, params[key]);
        }, renderString);
    }
    static getTemplateExecutor(template) {
        let processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashConditions(template);
        processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashSwitches(processedTemplate)
            .replace(/\s*%>[\s\n]*<%\s*/g, ' ');
        return template$5(processedTemplate);
    }
    static getTemplateExecutorStringWithLodashConditions(template) {
        const conditionList = template.match(IF_OPEN_PATTERN);
        if (!conditionList)
            return template;
        return conditionList.reduce((acc, item) => {
            const condition = item.replace(/^<If\scondition="\{/i, '').replace(/}">$/, '');
            return acc.replace(item, `<% if (${condition}) { %>`);
        }, template).replace(IF_CLOSE_PATTERN, '<% } %>');
    }
    static getTemplateExecutorStringWithLodashSwitches(template) {
        if (!CHOOSE_OPEN_PATTERN.test(template))
            return template;
        const chooseList = template.match(CHOOSE_PATTERN) || [];
        return chooseList.reduce((acc, item) => {
            return this.getTemplateExecutorStringWithLodashWhen(acc, item.replace(/<Choose>[^<]*/i, ''));
        }, template).replace(CHOOSE_OPEN_PATTERN, '').replace(CHOOSE_CLOSE_PATTERN, '');
    }
    static getTemplateExecutorStringWithLodashWhen(template, data) {
        const whenList = data.match(WHEN_PATTERN) || [];
        const otherwiseList = data.match(OTHERWISE_PATTERN) || [];
        const processedString = whenList.reduce((acc, item, index) => {
            const openBlockList = item.match(WHEN_OPEN_PATTERN);
            if (!openBlockList)
                return acc;
            const openBlock = openBlockList[0];
            const condition = openBlock.replace(/^<When\scondition="\{/i, '').replace(/}">$/, '');
            const processedBlock = item.replace(openBlock, `<%${index ? ' else' : ''} if (${condition}) { %>`);
            return acc.replace(item, processedBlock);
        }, template).replace(WHEN_CLOSE_PATTERN, '<% } %>');
        return otherwiseList.length === 1
            ? otherwiseList.reduce((acc, item) => {
                const processedBlock = item
                    .replace(OTHERWISE_OPEN_PATTERN, whenList.length ? '<% else {  %>' : '');
                return acc.replace(item, processedBlock);
            }, processedString).replace(OTHERWISE_CLOSE_PATTERN, whenList.length ? '<% } %>' : '')
            : processedString;
    }
    get childNodes() {
        return this.childNodesField;
    }
    set childNodes(value) {
        this.childNodesField = value;
    }
    get nodeList() {
        return this.childNodes || [];
    }
    get template() {
        return this.templateField;
    }
    set template(value) {
        this.templateExecutor = TemplateEngine.getTemplateExecutor(value);
        this.templateField = value;
    }
    get container() {
        return this.containerField;
    }
    set container(value) {
        this.containerField = value;
    }
    destroy() {
        super.destroy();
        const { container, childNodes } = this;
        childNodes === null || childNodes === void 0 ? void 0 : childNodes.forEach((childNode) => {
            container === null || container === void 0 ? void 0 : container.removeChild(childNode);
        });
    }
    show(append = true, ref) {
        if (!this.isHidden)
            return;
        this.isHidden = false;
        const { container, childNodes } = this;
        if (!container || !childNodes)
            return;
        if (ref) {
            this.addChildNodesWithRef(append, ref);
        }
        else {
            this.addChildNodesWithoutRef(append);
        }
    }
    hide() {
        if (this.isHidden)
            return;
        this.isHidden = true;
        const { container, childNodes } = this;
        if (container && childNodes) {
            childNodes.forEach((childNode) => {
                if (this.checkChildExists(childNode))
                    container.removeChild(childNode);
            });
        }
    }
    getRefMap() {
        return Object.assign({}, this.refMap);
    }
    getRef(name) {
        return this.refMap[name];
    }
    render(params, options) {
        const { container, template } = this;
        if (!container || !template)
            return;
        this.insertRenderString(this.getRenderString(params), options || {});
        this.saveRefs();
    }
    getRenderString(params) {
        const { templateExecutor } = this;
        if (!templateExecutor)
            return '';
        let renderString = templateExecutor(omit(params, ['css']));
        renderString = TemplateEngine.getRenderStringWithClassNames(renderString, params);
        return TemplateEngine.getRenderStringWithVariables(renderString, params);
    }
    saveRefs() {
        const { container } = this;
        const refs = this.template.match(REF_PATTERN);
        this.refMap = refs ? refs.reduce((acc, item) => {
            const name = item.replace(/^ref="/, '').replace(/"$/, '');
            if (!name)
                return acc;
            const element = container === null || container === void 0 ? void 0 : container.querySelector(`[ref="${name}"]`);
            if (!element)
                return acc;
            element.removeAttribute('ref');
            acc[name] = element;
            return acc;
        }, {}) : {};
    }
    insertRenderString(renderString, options) {
        const { replace, append = true, ref } = options;
        if (replace)
            return this.replaceRenderString(renderString, replace);
        if (ref)
            return this.addRenderStringWithRef(append, renderString, ref);
        return this.addRenderStringWithoutRef(append, renderString);
    }
    replaceRenderString(renderString, replace) {
        const container = this.container;
        const { childNodes } = container;
        const proxyChildNodes = TemplateEngine.getProxyChildNodes(renderString);
        const replaceNodeList = replace.nodeList;
        if (!replaceNodeList || replaceNodeList.length !== proxyChildNodes.length)
            return;
        proxyChildNodes.forEach((childNode, index) => {
            const replaceItem = replaceNodeList[index];
            if (replaceItem && Array.prototype.includes.call(childNodes, replaceItem)) {
                container.replaceChild(childNode, replaceItem);
            }
        });
        this.childNodes = proxyChildNodes;
    }
    addRenderStringWithoutRef(append, renderString) {
        this.childNodes = TemplateEngine.getProxyChildNodes(renderString);
        this.addChildNodesWithoutRef(append);
    }
    addChildNodesWithoutRef(append) {
        const container = this.container;
        const childNodes = this.childNodes;
        const firstChild = container.firstChild;
        childNodes.forEach((childNode) => {
            if (append) {
                this.appendChild(childNode);
            }
            else {
                this.insertBefore(childNode, firstChild);
            }
        });
        this.childNodes = childNodes;
    }
    addRenderStringWithRef(append, renderString, ref) {
        this.childNodes = TemplateEngine.getProxyChildNodes(renderString);
        this.addChildNodesWithRef(append, ref);
    }
    addChildNodesWithRef(append, ref) {
        const childNodes = this.childNodes;
        const refNodeList = ref.nodeList;
        if (!(refNodeList === null || refNodeList === void 0 ? void 0 : refNodeList.length))
            return;
        const refNode = (append ? refNodeList[refNodeList.length - 1] : refNodeList[0]);
        (append ? Array.prototype.reverse.call(childNodes) : childNodes)
            .forEach((childNode, index) => {
            if (append) {
                return index
                    ? this.insertBefore(childNode, childNodes[0])
                    : this.insertAfter(childNode, refNode);
            }
            return this.insertBefore(childNode, refNode);
        });
    }
    checkChildExists(childNode) {
        const { container } = this;
        if (container) {
            const containerChildNodes = container.childNodes;
            return Array.prototype.includes.call(containerChildNodes, childNode);
        }
        return false;
    }
    insertBefore(childNode, ref) {
        const { container } = this;
        if (container && this.checkChildExists(ref)) {
            container.insertBefore(childNode, ref);
        }
    }
    insertAfter(childNode, ref) {
        const { container } = this;
        if (container && this.checkChildExists(ref)) {
            TemplateEngine
                .insertAfter(container, childNode, ref);
        }
    }
    appendChild(childNode) {
        const { container } = this;
        if (container)
            container.appendChild(childNode);
    }
}

class VirtualizedList extends TemplateEngine {
    constructor(container, params) {
        super(template$3, container);
        this.lengthValue = 0;
        this.height = 0;
        this.itemsCache = {};
        this.viewportItems = [];
        this.renderedItems = [];
        this.offset = 0;
        this.restoreParams = { index: -1, bottomOffset: -1, width: -1, height: -1 };
        this.renderViewportItems = () => {
            const { length, heightGetter, topOffset, bottomOffset } = this;
            const root = this.getRef('root');
            if (!root)
                return;
            this.restoreScrollTop();
            const viewportStart = Math.max(root.scrollTop - topOffset, 0);
            const visibleViewportEnd = viewportStart + root.offsetHeight + topOffset;
            const viewportEnd = visibleViewportEnd + bottomOffset;
            let itemOffsetStart = 0;
            let itemOffsetEnd = 0;
            let isFound = false;
            let isVisibleFound = false;
            let offset;
            let lastItemOffset = 0;
            let lastItemHeight = 0;
            let lastItemIndex = -1;
            let isVisibleLastNotFound = true;
            const items = [];
            for (let i = 0; i < length; i += 1) {
                const itemHeight = heightGetter(i);
                itemOffsetStart = itemOffsetEnd;
                itemOffsetEnd = itemOffsetStart + itemHeight;
                const isViewportItem = VirtualizedList.checkViewportItem({
                    viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd,
                });
                const isVisibleViewportItem = isVisibleLastNotFound ? VirtualizedList.checkFullViewportItem({
                    viewportStart, itemOffsetStart, itemOffsetEnd, viewportEnd: visibleViewportEnd,
                }) : isVisibleLastNotFound;
                isFound = isViewportItem || isFound;
                isVisibleFound = isVisibleViewportItem || isVisibleFound;
                if (isVisibleFound && !isVisibleViewportItem)
                    isVisibleLastNotFound = false;
                if (isVisibleLastNotFound) {
                    lastItemOffset += lastItemHeight;
                    lastItemHeight = itemHeight;
                    lastItemIndex = i;
                }
                if (isFound && !isViewportItem)
                    break;
                if (isViewportItem) {
                    items.push(i);
                    offset = isUndefined(offset) ? itemOffsetStart : offset;
                }
            }
            this.viewportItems = items;
            this.offset = offset || 0;
            this.updateRestoreParams(lastItemIndex, lastItemOffset, lastItemHeight);
            this.renderItems();
        };
        window.vl = this;
        this.lengthValue = params.length;
        this.itemGetter = params.itemGetter;
        this.heightGetter = params.heightGetter;
        this.topOffset = params.topOffset || this.topOffset;
        this.bottomOffset = params.bottomOffset || this.bottomOffset;
        this.render({
            css: Object.assign(Object.assign({}, css$1), { className: params.className || '' }),
        });
        this.renderViewportItems();
        this.frameHandler = this.renderViewportItems;
        this.registerFrameHandler();
    }
    set length(value) {
        this.lengthValue = value;
        this.updateHeight();
        this.renderViewportItems();
    }
    get length() {
        return this.lengthValue;
    }
    static checkFullViewportItem(params) {
        const { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd } = params;
        return viewportStart <= itemOffsetStart && viewportEnd >= itemOffsetEnd;
    }
    static checkViewportItem(params) {
        const { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd } = params;
        return (viewportStart <= itemOffsetStart && viewportEnd >= itemOffsetEnd)
            || (viewportStart > itemOffsetStart && viewportStart < itemOffsetEnd)
            || (viewportEnd > itemOffsetStart && viewportEnd < itemOffsetEnd);
    }
    scrollBottom() {
        if (!isUndefined(this.scrollTimeout))
            clearTimeout(this.scrollTimeout);
        const root = this.getRef('root');
        if (!root)
            return;
        this.scrollTimeout = setTimeout(() => {
            root.scrollTop = root.scrollHeight - root.offsetHeight;
        }, 0);
    }
    destroy() {
        if (!isUndefined(this.scrollTimeout))
            clearTimeout(this.scrollTimeout);
        super.destroy();
    }
    getGeneralItemsContainer() {
        return this.getRef('generalList');
    }
    getVirtualItemsContainer() {
        return this.getRef('itemsContainer');
    }
    render(params) {
        super.render(params);
        this.updateHeight();
    }
    updateViewport() {
        this.removeAllItems();
        this.updateHeight();
        this.renderItems();
    }
    clearCache() {
        this.itemsCache = {};
    }
    updateHeight() {
        const { length, heightGetter } = this;
        const virtualizedList = this.getRef('virtualizedList');
        let height = 0;
        for (let i = 0; i < length; i += 1) {
            height += heightGetter(i);
        }
        if (this.height !== height)
            virtualizedList.style.height = `${height}px`;
        this.height = height;
    }
    renderItems() {
        const { viewportItems, offset, renderedItems } = this;
        const itemsContainer = this.getRef('itemsContainer');
        const rerenderRequired = itemsContainer
            && (viewportItems.length !== renderedItems.length
                || renderedItems.some((index, i) => index !== viewportItems[i]));
        if (rerenderRequired) {
            if (!viewportItems.length)
                this.removeAllItems();
            this.removeStartItems();
            this.removeEndItems();
            viewportItems.forEach((index) => {
                this.renderItem(index);
            });
            itemsContainer.style.top = `${Math.round(offset)}px`;
        }
    }
    // TODO: simplify method
    renderItem(index) {
        const { itemsCache, renderedItems, itemGetter } = this;
        let beforeRenderArrayIndex = -1;
        const beforeIndex = renderedItems.find((checkIndex, i) => {
            if (checkIndex > index) {
                beforeRenderArrayIndex = i;
                return true;
            }
            return false;
        });
        const container = this.getRef('itemsContainer');
        if (!container)
            return;
        if (isUndefined(beforeIndex)) {
            if (itemsCache[index]) {
                itemsCache[index].show();
                if (!renderedItems.includes(index))
                    renderedItems.push(index);
                return;
            }
            const item = itemGetter(index, { container });
            if (item)
                itemsCache[index] = item;
            if (!renderedItems.includes(index))
                renderedItems.push(index);
        }
        else {
            const beforeCacheItem = itemsCache[beforeIndex];
            const renderCacheItem = itemsCache[index];
            if (!beforeCacheItem)
                return;
            if (renderCacheItem) {
                renderCacheItem.show(false, beforeCacheItem);
                if (!renderedItems.includes(index))
                    renderedItems.splice(beforeRenderArrayIndex, 0, index);
                return;
            }
            const item = itemGetter(index, { container, append: false, ref: beforeCacheItem });
            if (item)
                itemsCache[index] = item;
            if (!renderedItems.includes(index))
                renderedItems.splice(beforeRenderArrayIndex, 0, index);
        }
    }
    removeStartItems() {
        const { viewportItems, renderedItems } = this;
        if (viewportItems.length) {
            const firstItem = viewportItems[0];
            let removeCount = 0;
            renderedItems.some((itemIndex) => {
                if (itemIndex >= firstItem)
                    return true;
                removeCount += 1;
                this.removeItem(itemIndex);
                return false;
            });
            renderedItems.splice(0, removeCount);
        }
    }
    removeEndItems() {
        const { viewportItems, renderedItems } = this;
        if (viewportItems.length) {
            let removeCount = 0;
            const lastItem = last(viewportItems);
            renderedItems.reverse().some((itemIndex) => {
                if (itemIndex <= lastItem)
                    return true;
                removeCount += 1;
                this.removeItem(itemIndex);
                return false;
            });
            renderedItems.splice(0, removeCount);
            renderedItems.reverse();
        }
    }
    removeAllItems() {
        const { renderedItems } = this;
        renderedItems.forEach((itemIndex) => this.removeItem(itemIndex));
        this.renderedItems = [];
    }
    removeItem(index) {
        const { itemsCache } = this;
        if (itemsCache[index])
            itemsCache[index].hide();
    }
    restoreScrollTop() {
        const { index, height, width } = this.restoreParams;
        if (index >= 0 && height >= 0 && width >= 0)
            this.updateScrollTop();
    }
    updateScrollTop() {
        const { length, heightGetter } = this;
        const { width, index, bottomOffset } = this.restoreParams;
        const root = this.getRef('root');
        if (!root || width === root.offsetWidth)
            return;
        const { offsetHeight } = root;
        let itemOffset = 0;
        let height = 0;
        for (let i = 0; i < length; i += 1) {
            if (i === index) {
                height = heightGetter(i);
                break;
            }
            else {
                itemOffset += heightGetter(i);
            }
        }
        root.scrollTop = Math.max(0, itemOffset + height + bottomOffset - offsetHeight);
    }
    updateRestoreParams(lastItemIndex, lastItemOffset, lastItemHeight) {
        const root = this.getRef('root');
        if (!root)
            return;
        const { offsetHeight, offsetWidth, scrollTop } = root;
        this.restoreParams = {
            index: lastItemIndex,
            width: offsetWidth,
            height: offsetHeight,
            bottomOffset: scrollTop + offsetHeight - lastItemOffset - lastItemHeight,
        };
    }
}

const getKeyCode = (e) => e ? e.which || e.keyCode : null;

const escapeString = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const ENTER_CODE = 13;
const LEFT_CODE = 37;
const RIGHT_CODE = 39;
const UP_CODE = 38;
const DOWN_CODE = 40;
const K_CODE = 75;

const DEFAULT_DELIMITER = '~';
const NON_BREAKING_SPACE = '&nbsp;';

const getItemSize = (() => {
    const cache = new Map();
    const addElement = (target) => {
        const cacheTextContainer = cache.get(target);
        if (cacheTextContainer)
            return cacheTextContainer;
        const textContainer = document.createElement('span');
        textContainer.innerHTML = NON_BREAKING_SPACE;
        textContainer.style.position = 'absolute';
        textContainer.style.left = '0';
        textContainer.style.top = '0';
        textContainer.style.visibility = 'hidden';
        textContainer.style.pointerEvents = 'none';
        textContainer.style.userSelect = 'none';
        target.appendChild(textContainer);
        return textContainer;
    };
    return (container, save = false) => {
        const target = container || document.body;
        const textContainer = addElement(target);
        const size = { width: textContainer.offsetWidth, height: textContainer.offsetHeight };
        if (container && save) {
            if (!cache.has(target))
                cache.set(target, textContainer);
            return size;
        }
        cache.delete(target);
        target.removeChild(textContainer);
        return size;
    };
})();
const compareItemSize = (first, second) => {
    return first.width === second.width && first.height === second.height;
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

var lineTemplate = "<div ref=\"root\" class=\"Line__root Line__visible {className}\">\n  <div ref=\"content\" class=\"Line__content\">\n    <div ref=\"helpContainer\" class=\"Label__labelText Line__helpContainer\">{nbs}</div>\n    <div ref=\"labelContainer\"></div>\n    <div ref=\"inputContainer\" class=\"Line__inputContainer\"></div>\n  </div>\n</div>\n";

class BaseCaret extends TemplateEngine {
    constructor() {
        super(...arguments);
        this.value = '';
        this.prevLock = false;
        this.lockField = false;
        this.prevBusy = false;
        this.busyField = false;
        this.prevHidden = false;
        this.hiddenField = false;
        this.left = 0;
        this.prevLeft = 0;
        this.top = 0;
        this.prevTop = 0;
    }
    get lock() {
        return this.lockField;
    }
    set lock(value) {
        this.lockField = value;
        this.updateStyles();
    }
    get busy() {
        return this.busyField;
    }
    set busy(value) {
        this.busyField = value;
        this.updateStyles();
    }
    get hidden() {
        return this.hiddenField;
    }
    set hidden(value) {
        this.hiddenField = value;
        this.updateStyles();
    }
    setPosition(left, top) {
        this.left = left;
        this.top = top;
        this.updateStyles();
    }
    updateStyles() {
        const { lock, busy, hidden, left, prevLeft, top, prevTop } = this;
        const root = this.getRef('root');
        if (!root)
            return;
        if (left !== prevLeft)
            root.style.left = `${left}px`;
        if (top !== prevTop)
            root.style.top = `${top}px`;
        this.updateLockStyles();
        this.updateBusyStyles();
        this.updateHiddenStyles();
        this.prevLeft = left;
        this.prevTop = top;
        this.prevLock = lock;
        this.prevBusy = busy;
        this.prevHidden = hidden;
    }
}

var SimpleCaretTemplate = "<span ref=\"root\" class=\"SimpleCaret\">\n  <span ref=\"character\" class=\"SimpleCaret__character\"></span>\n</span>\n";

class SimpleCaret extends BaseCaret {
    constructor(container) {
        super(SimpleCaretTemplate, container);
        this.render();
    }
    updateLockStyles() {
        const root = this.getRef('root');
        const { lock, prevLock } = this;
        if (!root || lock === prevLock)
            return;
        if (lock) {
            root.classList.add('SimpleCaret--lock');
        }
        else {
            root.classList.remove('SimpleCaret--lock');
        }
    }
    updateBusyStyles() {
        const root = this.getRef('root');
        const { busy, prevBusy } = this;
        if (!root || busy === prevBusy)
            return;
        if (busy) {
            root.classList.add('SimpleCaret--busy');
        }
        else {
            root.classList.remove('SimpleCaret--busy');
        }
    }
    updateHiddenStyles() {
        const root = this.getRef('root');
        const { hidden, prevHidden } = this;
        if (!root || hidden === prevHidden)
            return;
        if (hidden) {
            root.classList.add('SimpleCaret--hidden');
        }
        else {
            root.classList.remove('SimpleCaret--hidden');
        }
    }
    setValue(value) {
        const character = this.getRef('character');
        if (character && this.value !== value) {
            this.value = value;
            character.innerHTML = value;
        }
    }
}

class CaretFactory {
    // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
    constructor() { }
    static registerCaret(name, caret) {
        CaretFactory.caretMap[name] = caret;
    }
    static getInstance() {
        if (!CaretFactory.instance)
            CaretFactory.instance = new CaretFactory();
        return CaretFactory.instance;
    }
    // TODO: to functional implementation
    // eslint-disable-next-line class-methods-use-this
    create(name, container) {
        return CaretFactory.caretMap[name]
            ? new CaretFactory.caretMap[name](container) : null;
    }
}
CaretFactory.caretMap = {
    simple: SimpleCaret,
};

const LOCK_TIMEOUT = 600;

var template$2 = "<div ref=\"root\" class=\"ContentEditableInput\">\n  <div ref=\"input\" class=\"ContentEditableInput__input\" contenteditable=\"true\"></div>\n  <div ref=\"hidden\" class=\"ContentEditableInput__hidden\"></div>\n</div>\n";

const getStartIntersectionString = (main, target) => {
    if (target.indexOf(main) === 0)
        return { str: main, isFull: true };
    if (main[0] !== target[0])
        return { str: '', isFull: false };
    let startIntersectionString = main[0];
    for (let i = 1, ln = main.length; i < ln; i += 1) {
        const character = main[i];
        if (character === target[i]) {
            startIntersectionString += character;
        }
        else {
            break;
        }
    }
    return { str: startIntersectionString, isFull: false };
};
const clearStringStyles = (str) => str
    .replace(/<span[^>]*>/g, '')
    .replace(/<\/span>/g, '');

const DATA_INDEX_ATTRIBUTE_NAME = 'data-index';
const SECRET_CHARACTER = '•';

class BaseInput extends TemplateEngine {
    constructor(template, container, cssData) {
        super(template, container);
        this.characterWidth = 8;
        this.characterHeight = 16;
        this.valueField = '';
        this.isCaretHidden = false;
        this.secretField = false;
        this.mouseDownHandler = (e) => {
            const valueFieldItem = this.getEventFormattedValueFragment(e);
            if (valueFieldItem && valueFieldItem.clickHandler && valueFieldItem.lock) {
                e.preventDefault();
            }
        };
        this.clickHandler = (e) => {
            const valueFieldItem = this.getEventFormattedValueFragment(e);
            if (valueFieldItem && valueFieldItem.clickHandler) {
                valueFieldItem.clickHandler(e, valueFieldItem.id);
            }
        };
        this.render({ css: cssData });
        this.setCharacterContainer();
        this.addHandlers();
    }
    static getValueString(value, params = {}) {
        const { secret = false } = params;
        if (isString(value))
            return secret ? BaseInput.convertSecret(value) : value;
        return value.reduce((acc, item) => {
            const str = (isString(item) ? item : item.str);
            const val = secret && (isString(item) || !item.lock) ? BaseInput.convertSecret(str) : str;
            return `${acc}${val}`;
        }, '');
    }
    static getFragmentTemplate(str, params) {
        const { className = '', secret = false, index } = params;
        const composedClassName = [secret ? 'BaseInput__secret' : '', className].join(' ');
        const processedString = BaseInput.getNormalizedTemplateString(secret
            ? BaseInput.convertSecret(str) : str);
        return `<span
      ${DATA_INDEX_ATTRIBUTE_NAME}="${index}"
      ref="fragment-${index}"
      class="${composedClassName}">${processedString}</span>`;
    }
    static getNormalizedTemplateString(str) {
        return escapeString(str).replace(/\s/g, NON_BREAKING_SPACE);
    }
    static getValueFragmentTemplate(valueFragment, index, params = {}) {
        const { secret } = params;
        if (isString(valueFragment)) {
            return BaseInput.getFragmentTemplate(valueFragment, { index, secret });
        }
        const { str, className = '', lock } = valueFragment;
        const isSecret = !lock && secret;
        return BaseInput.getFragmentTemplate(str, { className, index, secret: isSecret });
    }
    static getValueTemplate(value, params = {}) {
        if (isString(value))
            return BaseInput.getNormalizedTemplateString(value);
        return value.reduce((acc, item, index) => {
            return `${acc}${BaseInput.getValueFragmentTemplate(item, index, params)}`;
        }, '');
    }
    static getUpdatedValueField(value, prevValue) {
        if (isString(prevValue))
            return value;
        let checkValue = clearStringStyles(value);
        let stop = false;
        const updatedValueField = prevValue.reduce((acc, item) => {
            const isStringItem = isString(item);
            const itemStr = (isStringItem ? item : item.str);
            const { str, isFull } = getStartIntersectionString(itemStr, checkValue);
            if (str && !stop) {
                acc.push(isStringItem ? str : Object.assign(Object.assign({}, item), { str }));
                checkValue = checkValue.substring(str.length);
                stop = !isFull;
            }
            return acc;
        }, []);
        checkValue.replace(/<span[^>]*>/g, '')
            .split('')
            .forEach((char) => updatedValueField.push(char));
        return updatedValueField.filter((item) => (isString(item) ? item : item.str));
    }
    static getLockString(value) {
        if (isString(value))
            return '';
        let str = '';
        let lockStr = '';
        value.forEach((item) => {
            if (isString(item)) {
                str += item;
            }
            else {
                str += item.str;
                if (item.lock)
                    lockStr = str;
            }
        });
        return lockStr;
    }
    static convertSecret(str) {
        return (new Array(str.length)).fill(SECRET_CHARACTER).join('');
    }
    get characterSize() {
        const { characterContainer } = this;
        return characterContainer
            ? { width: characterContainer.offsetWidth, height: characterContainer.offsetHeight }
            : { width: this.characterWidth, height: this.characterHeight };
    }
    // TODO: convert to abstract
    // eslint-disable-next-line class-methods-use-this
    get caretPosition() {
        return -1;
    }
    // TODO: convert to abstract
    // eslint-disable-next-line class-methods-use-this
    get selectedRange() {
        return { from: 0, to: 0 };
    }
    // TODO: convert to abstract
    // eslint-disable-next-line class-methods-use-this
    get disabled() {
        return true;
    }
    get value() {
        return this.valueField;
    }
    set value(val) {
        this.valueField = val;
    }
    get lockString() {
        const { valueField } = this;
        return BaseInput.getLockString(valueField);
    }
    get hiddenCaret() {
        return this.isCaretHidden;
    }
    set hiddenCaret(isCaretHidden) {
        this.isCaretHidden = isCaretHidden;
    }
    get secret() {
        return this.secretField;
    }
    set secret(secret) {
        this.secretField = secret;
    }
    get isFocused() {
        const { activeElement } = document;
        const root = this.getRef('input');
        return activeElement === root
            || (activeElement === null || activeElement === void 0 ? void 0 : activeElement.parentNode) === root
            || (activeElement === null || activeElement === void 0 ? void 0 : activeElement.parentNode) === root;
    }
    addHandlers() {
        const root = this.getRootElement();
        if (root) {
            root.addEventListener('click', this.clickHandler);
            root.addEventListener('mousedown', this.mouseDownHandler);
        }
    }
    removeHandlers() {
        const root = this.getRootElement();
        if (root) {
            root.removeEventListener('click', this.clickHandler);
            root.removeEventListener('mousedown', this.mouseDownHandler);
        }
    }
    getValueItemString(index) {
        const { valueField } = this;
        if (isString(valueField))
            return index ? '' : valueField;
        const item = valueField[index];
        if (!item)
            return '';
        return isString(item) ? item : item.str;
    }
    getSimpleValue(showSecret = true) {
        const { secretField } = this;
        return BaseInput.getValueString(this.valueField, { secret: secretField && !showSecret });
    }
    // TODO: convert to abstract
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    moveCaretToEnd(isForce = false) { }
    addEventListener(type, listener, options) {
        const root = this.getRef('input');
        if (root)
            root.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        const root = this.getRef('input');
        if (root)
            root.removeEventListener(type, listener, options);
    }
    focus() {
        const root = this.getRef('input');
        if (root)
            root.focus();
    }
    blur() {
        const root = this.getRef('input');
        if (root)
            root.blur();
    }
    destroy() {
        this.removeHandlers();
        super.destroy();
    }
    getCaretOffset() {
        const { caretPosition, characterSize } = this;
        const rowCharactersCount = this.getRowCharactersCount();
        if (!rowCharactersCount)
            return { left: 0, top: 0 };
        const row = Math.floor(caretPosition / rowCharactersCount);
        const relativePosition = caretPosition - row * rowCharactersCount;
        return {
            left: relativePosition * characterSize.width,
            top: row * characterSize.height,
        };
    }
    getEndOffset() {
        const { characterSize, valueField } = this;
        const rowCharactersCount = this.getRowCharactersCount();
        if (!rowCharactersCount)
            return { left: 0, top: 0 };
        const charactersCount = BaseInput.getValueString(valueField).length;
        const row = Math.floor(charactersCount / rowCharactersCount);
        const relativePosition = charactersCount - row * rowCharactersCount;
        return {
            left: relativePosition * characterSize.width,
            top: row * characterSize.height,
        };
    }
    getRowCharactersCount() {
        const { characterSize } = this;
        const root = this.getRef('input');
        return root ? Math.floor(root.offsetWidth / characterSize.width) : 0;
    }
    getEventFormattedValueFragment(e) {
        const target = e.target;
        if (!target)
            return null;
        return this.getElementFormattedValueFragment(target);
    }
    getElementFormattedValueFragment(element) {
        const { valueField } = this;
        if (isString(valueField))
            return null;
        const dataIndex = element.getAttribute(DATA_INDEX_ATTRIBUTE_NAME);
        const valueFieldItem = dataIndex ? valueField[Number(dataIndex)] : null;
        return !valueFieldItem || isString(valueFieldItem)
            ? null : valueFieldItem;
    }
    setCharacterContainer() {
        const root = this.getRef('root');
        if (root) {
            const characterContainer = document.createElement('span');
            characterContainer.style.position = 'absolute';
            characterContainer.style.visibility = 'hidden';
            characterContainer.style.pointerEvents = 'none';
            characterContainer.style.left = '0';
            characterContainer.style.top = '0';
            characterContainer.innerHTML = NON_BREAKING_SPACE;
            root.appendChild(characterContainer);
            this.characterContainer = characterContainer;
        }
    }
}

const NON_BREAKING_SPACE_PATTERN = /&nbsp;/g;

const TEXT_NODE_TYPE = 3;
const CHANGE_EVENT_TYPE = 'change';

class ContentEditableInput extends BaseInput {
    constructor(container) {
        super(template$2, container);
        this.externalChangeListeners = [];
        this.isDisabled = false;
        this.pasteHandler = () => {
            this.prevContent = BaseInput.getValueString(this.value);
        };
        this.changeHandler = (e) => {
            this.updateValueField();
            this.externalChangeListeners.forEach((handler) => handler.call(e.target, e));
        };
        this.addEventListener('input', this.changeHandler);
        this.addEventListener('cut', this.changeHandler);
        this.addEventListener('paste', this.pasteHandler);
    }
    static getStyledValueTemplate(val, params = {}) {
        return BaseInput.getValueTemplate(val, params);
    }
    static getLastTextNode(root) {
        const { lastChild } = root;
        if (!lastChild)
            return null;
        if (lastChild.nodeType === TEXT_NODE_TYPE)
            return lastChild;
        return ContentEditableInput.getLastTextNode(lastChild);
    }
    static checkChildNode(root, checkNode) {
        if (root === checkNode)
            return true;
        const { parentNode } = checkNode;
        return parentNode ? ContentEditableInput.checkChildNode(root, parentNode) : false;
    }
    static getHtmlStringifyValue(html) {
        return html.replace(NON_BREAKING_SPACE_PATTERN, ' ');
    }
    static getNodeOffset(root, target, baseOffset = 0) {
        const { parentNode } = target;
        if (!parentNode || root === target)
            return 0;
        let isFound = false;
        const prevNodes = Array.prototype.filter.call(parentNode.childNodes, (childNode) => {
            const isTarget = childNode === target;
            if (isTarget && !isFound)
                isFound = true;
            return !isTarget && !isFound;
        });
        const offset = prevNodes.reduce((acc, node) => {
            const value = node.nodeType === TEXT_NODE_TYPE
                ? node.nodeValue
                : ContentEditableInput.getHtmlStringifyValue(node.innerHTML);
            return acc + (value ? value.length : 0);
        }, 0);
        return root === parentNode
            ? baseOffset + offset
            : ContentEditableInput.getNodeOffset(root, parentNode, baseOffset + offset);
    }
    set hiddenCaret(isCaretHidden) {
        if (this.isCaretHidden === isCaretHidden)
            return;
        const root = this.getRef('input');
        if (isCaretHidden) {
            root.classList.add('ContentEditableInput__input--hiddenCaret');
        }
        else {
            root.classList.remove('ContentEditableInput__input--hiddenCaret');
        }
        this.isCaretHidden = isCaretHidden;
    }
    set value(val) {
        this.valueField = val;
        this.updateContent();
    }
    get value() {
        return this.valueField;
    }
    set secret(secret) {
        this.secretField = secret;
        this.updateContent();
    }
    get caretPosition() {
        const root = this.getRef('input');
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || !selection.anchorNode)
            return -1;
        const { anchorNode } = selection;
        if (!ContentEditableInput.checkChildNode(root, selection.anchorNode))
            return -1;
        return ContentEditableInput.getNodeOffset(root, anchorNode, anchorNode.nodeType === TEXT_NODE_TYPE ? selection.anchorOffset : 0);
    }
    set caretPosition(position) {
        if (position < 0)
            return;
        const root = this.getRef('input');
        let offset = 0;
        let relativeOffset = 0;
        const targetNode = Array.prototype.find.call(root.childNodes, (childNode) => {
            const { length } = ((childNode.nodeType === TEXT_NODE_TYPE
                ? childNode.nodeValue
                : ContentEditableInput.getHtmlStringifyValue(childNode.innerHTML)) || '');
            relativeOffset = offset;
            offset += length;
            return position <= offset;
        });
        const selection = window.getSelection();
        if (!selection || !targetNode)
            return;
        const range = new Range();
        const targetChildNode = targetNode.nodeType === TEXT_NODE_TYPE
            ? targetNode : targetNode.firstChild;
        range.setStart(targetChildNode, position - relativeOffset);
        range.setEnd(targetChildNode, position - relativeOffset);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(value) {
        this.isDisabled = value;
    }
    moveCaretToEnd(isForce = false) {
        const root = this.getRef('input');
        if (isForce)
            this.focus();
        if (!root || !this.isFocused)
            return;
        const range = document.createRange();
        const selection = window.getSelection();
        const node = ContentEditableInput.getLastTextNode(root);
        if (!node)
            return;
        range.selectNodeContents(node);
        range.collapse(false);
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    addEventListener(type, listener, options) {
        if (type === CHANGE_EVENT_TYPE) {
            this.externalChangeListeners.push(listener);
        }
        else {
            super.addEventListener(type, listener, options);
        }
    }
    removeEventListener(type, listener, options) {
        if (type === CHANGE_EVENT_TYPE) {
            this.externalChangeListeners = this.externalChangeListeners.filter((item) => item !== listener);
        }
        else {
            super.removeEventListener(type, listener, options);
        }
    }
    destroy() {
        super.destroy();
        this.removeEventListener('input', this.changeHandler);
        this.removeEventListener('cut', this.changeHandler);
        this.removeEventListener('paste', this.pasteHandler);
    }
    getRootElement() {
        return this.getRef('input');
    }
    getPasteNormalizedData() {
        const { prevContent } = this;
        const root = this.getRef('input');
        const data = unescape(root.innerHTML.replace(/<br>/g, ''))
            .replace(NON_BREAKING_SPACE_PATTERN, ' ')
            .replace(/<b>/g, '')
            .replace(/<\/b>/g, '');
        if (isUndefined(prevContent))
            return data;
        this.prevContent = undefined;
        const startIndex = prevContent.split('').reduce((acc, char, i) => {
            if (acc >= 0)
                return acc;
            return data[i] !== char ? i : acc;
        }, -1);
        const prefix = startIndex >= 0 ? prevContent.substring(0, startIndex) : prevContent;
        const suffix = startIndex >= 0 && prefix.length !== prevContent.length
            ? prevContent.substring(startIndex) : '';
        const pasteContent = data.replace(prefix, '').replace(suffix, '');
        const processedPasteContent = pasteContent.replace(/<[a-z]+[^>]*>/g, '')
            .replace(/<[a-z]+[^>]*\/>/g, '').replace(/<\/[a-z]+>/g, '');
        return data.replace(pasteContent, processedPasteContent);
    }
    getInputValue() {
        const data = this.getPasteNormalizedData();
        const items = data.replace(/<\/span>[^<]*</g, '</span><').split('</span>').filter(identity);
        return items.reduce((acc, item) => {
            var _a;
            const index = (((_a = item.match(/data-index="[0-9]+"/)) === null || _a === void 0 ? void 0 : _a[0]) || '').replace(/[^0-9]/g, '');
            if (index) {
                const prevValue = this.getValueItemString(Number(index));
                const updatedValue = ContentEditableInput.getHtmlStringifyValue(item)
                    .replace(new RegExp(`${SECRET_CHARACTER}+`), prevValue);
                return `${acc}${updatedValue}`;
            }
            return `${acc}${ContentEditableInput.getHtmlStringifyValue(item)}`;
        }, '');
    }
    updateValueField() {
        if (this.preventLockUpdate())
            return;
        const { caretPosition, isDisabled } = this;
        let updatedCaretPosition = caretPosition;
        if (isDisabled) {
            updatedCaretPosition = Math.min(caretPosition, BaseInput.getValueString(this.valueField).length);
        }
        else {
            const inputValue = this.getInputValue();
            this.valueField = BaseInput.getUpdatedValueField(inputValue, this.valueField);
        }
        this.updateContent();
        this.caretPosition = updatedCaretPosition;
    }
    preventLockUpdate() {
        const { valueField } = this;
        if (isString(valueField))
            return false;
        const value = clearStringStyles(this.getInputValue());
        const lockStr = BaseInput.getLockString(valueField);
        const deleteUnlockPart = lockStr
            && lockStr.indexOf(value) === 0
            && lockStr.length > value.length;
        if (deleteUnlockPart) {
            const lastLockIndex = this.valueField
                .reduce((acc, item, index) => {
                return !isString(item) && item.lock ? index : acc;
            }, -1);
            this.valueField = this.valueField
                .filter((_, index) => index <= lastLockIndex);
        }
        if ((lockStr && value.indexOf(lockStr) !== 0) || deleteUnlockPart) {
            this.updateContent();
            this.moveCaretToEnd();
            return true;
        }
        return false;
    }
    updateContent() {
        this.setString();
        this.updateStyles();
    }
    setString() {
        const { secretField } = this;
        const input = this.getRef('input');
        const hidden = this.getRef('hidden');
        if (input && hidden) {
            const str = ContentEditableInput.getStyledValueTemplate(this.valueField, {
                secret: secretField,
            });
            input.innerHTML = str;
            hidden.innerHTML = str;
        }
    }
    updateStyles() {
        const input = this.getRef('input');
        const hidden = this.getRef('hidden');
        if (input && hidden) {
            Array.prototype.forEach.call(hidden.childNodes, (childNode, index) => {
                if (childNode.nodeType !== TEXT_NODE_TYPE) {
                    const { color } = window.getComputedStyle(childNode);
                    if (color)
                        input.childNodes[index].style.textShadow = `0 0 0 ${color}`;
                }
            });
        }
    }
}

var template$1 = "<div ref=\"root\">\n  <div ref=\"input\" class=\"ViewableInput\">{value}</div>\n</div>\n";

class ViewableInput extends BaseInput {
    set value(val) {
        this.valueField = val;
        const root = this.getRef('input');
        if (root)
            root.innerHTML = BaseInput.getValueTemplate(this.valueField);
    }
    constructor(container) {
        super(template$1, container);
    }
    render() {
        super.render({ value: BaseInput.getValueTemplate(this.valueField) });
    }
    getRootElement() {
        return this.getRef('input');
    }
}

var css = undefined;

var template = "<If condition=\"{label || delimiter}\">\n  <div class=\"Label__label\">\n    <If condition=\"{label}\">\n      <div class=\"Label__labelTextContainer\">\n        <span class=\"Label__labelText\" ref=\"label\">{label}</span>\n      </div>\n      <div>\n        <span class=\"Label__labelText\">{nbs}</span>\n      </div>\n    </If>\n    <If condition=\"{delimiter}\">\n      <div class=\"Label__labelTextContainer\">\n        <span class=\"Label__labelText\" ref=\"delimiter\">{delimiter}</span>\n      </div>\n      <div>\n        <span class=\"Label__labelText\">{nbs}</span>\n      </div>\n    </If>\n  </div>\n</If>\n\n";

class Label extends TemplateEngine {
    constructor(container, params = {}) {
        super(template, container);
        this.label = '';
        this.delimiter = '';
        this.reRender = false;
        this.label = params.label || '';
        this.delimiter = params.delimiter || '';
        this.render();
    }
    set params(params) {
        this.label = params.label || this.label;
        this.delimiter = params.delimiter || this.delimiter;
        this.render();
    }
    get params() {
        const { label, delimiter } = this;
        return { label, delimiter };
    }
    render() {
        const { label, delimiter } = this;
        super.render({
            css, label, delimiter, nbs: NON_BREAKING_SPACE,
        }, this.reRender ? { replace: this } : {});
        this.reRender = true;
    }
}

class Line extends TemplateEngine {
    constructor(container, params = {}) {
        super(lineTemplate, container);
        this.isVisible = true;
        this.heightField = 0;
        this.secretField = false;
        this.initialValue = '';
        this.className = '';
        this.editable = false;
        this.onSubmit = noop;
        this.onChange = noop;
        this.onUpdateCaretPosition = noop;
        this.caretPosition = -1;
        this.updateHeight = () => {
            const root = this.getRef('root');
            if (!root)
                return;
            this.heightField = root.offsetHeight;
        };
        this.keyDownHandler = (e) => {
            ({
                [ENTER_CODE]: this.submitHandler,
                [LEFT_CODE]: this.lockCaret,
                [RIGHT_CODE]: this.lockCaret,
                [UP_CODE]: this.lockCaret,
                [DOWN_CODE]: this.lockCaret,
            }[Number(getKeyCode(e))] || noop)(e);
        };
        this.submitHandler = (e) => {
            const { onSubmit, inputField, secret } = this;
            const value = (inputField === null || inputField === void 0 ? void 0 : inputField.value) || '';
            let formattedValue = '';
            if (isString(value)) {
                formattedValue = secret ? '' : value;
            }
            else if (isArray(value)) {
                formattedValue = secret ? value.filter((item) => get(item, 'lock')) : value;
            }
            e === null || e === void 0 ? void 0 : e.preventDefault();
            if (inputField && onSubmit) {
                onSubmit({
                    formattedValue,
                    value: inputField.getSimpleValue(),
                    lockString: inputField.lockString,
                });
            }
        };
        this.changeHandler = () => {
            const { inputField } = this;
            if (inputField) {
                this.updateInputSize();
                this.lockCaret();
                this.onChange(inputField.getSimpleValue());
            }
        };
        this.updateInputSize = () => {
            const { width } = this.characterSize;
            const inputContainer = this.getRef('inputContainer');
            const input = this.getRef('input');
            const { offsetWidth } = inputContainer;
            if (!input)
                return this.updateRowsCount(2);
            const value = this.editable ? input.value : input.innerHTML;
            if (!width || !value || !offsetWidth)
                return this.updateRowsCount(2);
            const rowLength = Math.floor(offsetWidth / width);
            return this.updateRowsCount(Math.ceil(value.length / rowLength) + 1);
        };
        this.updateCaretData = () => {
            const { editable, caret, inputField, onUpdateCaretPosition, caretPosition: caretPositionPrev, } = this;
            if (!editable || !inputField || !caret) {
                if (caretPositionPrev !== -1) {
                    this.caretPosition = -1;
                    onUpdateCaretPosition(this.caretPosition, this.caret);
                }
                return;
            }
            const { caretPosition } = inputField;
            if (inputField.isFocused && caretPosition >= 0) {
                this.showCaret(caretPosition);
            }
            else {
                this.hideCaret();
            }
            if (caretPositionPrev !== caretPosition) {
                this.caretPosition = caretPosition;
                onUpdateCaretPosition(this.caretPosition, this.caret);
            }
        };
        this.lockCaret = () => {
            const { caret, lockTimeout } = this;
            if (lockTimeout)
                clearTimeout(lockTimeout);
            if (!caret)
                return;
            caret.lock = true;
            this.lockTimeout = setTimeout(() => caret.lock = false, LOCK_TIMEOUT);
        };
        this.setParams(params);
        this.container = container;
        this.render({ label: params.label, delimiter: params.delimiter });
        this.setCaret(params.caret || 'simple');
        this.addEventListeners();
        this.updateHeight();
        this.frameHandler = this.updateCaretData;
        this.setupEditing();
    }
    static getHeight(params) {
        const { delimiter, label, value, width, itemSize } = params;
        const { width: itemWidth, height: itemHeight } = itemSize;
        const valueString = BaseInput.getValueString(value);
        const labelLength = (delimiter ? delimiter.length + 1 : 0)
            + (label ? label.length + 1 : 0);
        const rowItemsCount = Math
            .floor((width - Line.itemHorizontalPadding - labelLength * itemWidth) / itemWidth);
        return Math.ceil((valueString.length || 1) / rowItemsCount) * itemHeight
            + 2 * Line.itemVerticalPadding;
    }
    get value() {
        const { inputField } = this;
        return inputField ? inputField.value : '';
    }
    set value(val) {
        const { inputField } = this;
        if (inputField) {
            inputField.value = val;
            inputField.moveCaretToEnd();
        }
    }
    get disabled() {
        const { input, editable } = this;
        return editable && input ? input.disabled : true;
    }
    set disabled(value) {
        const { input, editable } = this;
        if (input && editable)
            input.disabled = value;
    }
    get visible() {
        return this.isVisible;
    }
    set visible(value) {
        const root = this.getRef('root');
        if (this.isVisible === value || !root)
            return;
        this.isVisible = value;
        if (value) {
            root.classList.add('Line__visible');
        }
        else {
            root.classList.remove('Line__visible');
        }
    }
    get hidden() {
        return this.isHidden;
    }
    get height() {
        return this.heightField;
    }
    get characterSize() {
        const { offsetWidth, offsetHeight } = this.getRef('helpContainer');
        return { width: offsetWidth, height: offsetHeight };
    }
    get input() {
        return this.inputField;
    }
    get secret() {
        return this.secretField;
    }
    set secret(secret) {
        const { inputField } = this;
        this.secretField = secret;
        if (inputField)
            inputField.secret = secret;
    }
    get caretOffset() {
        const { input } = this;
        return this.getInputRootOffset(input ? input.getCaretOffset() : { left: 0, top: 0 });
    }
    get endOffset() {
        const { input } = this;
        return this.getInputRootOffset(input ? input.getEndOffset() : { left: 0, top: 0 });
    }
    get labelWidth() {
        var _a, _b;
        const { label, characterSize: { width } } = this;
        return label
            ? ((((_a = label.params.label) === null || _a === void 0 ? void 0 : _a.length) || -1) + (((_b = label.params.delimiter) === null || _b === void 0 ? void 0 : _b.length) || -1) + 2) * width
            : 0;
    }
    get contentPadding() {
        const content = this.getRef('content');
        if (!content)
            return { left: 0, top: 0 };
        const styles = window.getComputedStyle(content);
        return {
            left: Number(styles.paddingLeft.replace('px', '')),
            top: Number(styles.paddingTop.replace('px', '')),
        };
    }
    stopEdit() {
        const { label } = this;
        const labelParams = label ? label.params : { label: '', delimiter: '' };
        this.removeCaret();
        this.removeEventListeners();
        this.editable = false;
        this.unregisterFrameHandler();
        this.render(labelParams);
    }
    focus() {
        const { inputField } = this;
        if (!inputField)
            return;
        const { isFocused } = inputField;
        if (!isFocused) {
            inputField.focus();
            inputField.moveCaretToEnd();
        }
    }
    blur() {
        const { inputField } = this;
        if (!inputField)
            return;
        const { isFocused } = inputField;
        if (isFocused)
            inputField.blur();
    }
    submit() {
        this.submitHandler();
    }
    render(params) {
        const { editable, className, secret } = this;
        const reRender = Boolean(this.getRef('root'));
        if (this.inputField) {
            this.initialValue = this.inputField.value;
            this.inputField.destroy();
        }
        if (this.label)
            this.label.destroy();
        super.render({
            editable, className, nbs: NON_BREAKING_SPACE,
        }, reRender ? { replace: this } : {});
        this.inputField = editable
            ? new ContentEditableInput(this.getRef('inputContainer'))
            : new ViewableInput(this.getRef('inputContainer'));
        this.label = new Label(this.getRef('labelContainer'), params);
        this.inputField.value = this.initialValue;
        this.inputField.secret = secret;
    }
    setCaret(name = 'simple') {
        const { inputField, editable } = this;
        this.removeCaret();
        const caret = Line.cf.create(name, this.getRef('inputContainer'));
        if (!inputField)
            return;
        if (caret && editable) {
            inputField.hiddenCaret = true;
        }
        else {
            inputField.hiddenCaret = false;
            return;
        }
        this.caret = caret;
        this.updateCaretData();
    }
    updateViewport() {
        const { isHidden } = this;
        if (isHidden)
            this.show();
        this.updateInputSize();
        if (isHidden)
            this.hide();
    }
    destroy() {
        super.destroy();
        const { lockTimeout } = this;
        if (lockTimeout)
            clearTimeout(lockTimeout);
        this.removeCaret();
        this.removeEventListeners();
    }
    moveCaretToEnd(isForce = false) {
        const { inputField, editable } = this;
        if (inputField && editable)
            inputField.moveCaretToEnd(isForce);
    }
    clear() {
        this.value = '';
    }
    setParams(params) {
        const { onUpdateCaretPosition = noop, onChange = noop, onSubmit = noop, editable = true, className = '', value, secret = false, } = params;
        this.className = className;
        this.onSubmit = onSubmit;
        this.onChange = onChange;
        this.onUpdateCaretPosition = onUpdateCaretPosition;
        this.editable = editable;
        this.secret = secret;
        this.initialValue = value || '';
    }
    addEventListeners() {
        const { editable, inputField } = this;
        if (editable && inputField) {
            inputField.addEventListener('keydown', this.keyDownHandler);
            inputField.addEventListener('change', this.changeHandler);
        }
    }
    removeEventListeners() {
        const { editable, inputField } = this;
        if (editable && inputField) {
            inputField.removeEventListener('keydown', this.keyDownHandler);
            inputField.removeEventListener('change', this.changeHandler);
        }
    }
    setupEditing() {
        if (this.editable && this.inputField) {
            this.registerFrameHandler();
            this.inputField.moveCaretToEnd(true);
        }
    }
    updateRowsCount(count) {
        const input = this.getRef('input');
        if (this.editable && input && Number(input.getAttribute('rows')) !== count) {
            input.setAttribute('rows', String(count));
        }
        this.updateHeight();
    }
    showCaret(caretPosition) {
        const { caret, inputField } = this;
        const { width, height } = this.characterSize;
        const inputContainer = this.getRef('inputContainer');
        if (!caret || !inputContainer || !inputField)
            return;
        const { offsetWidth } = inputContainer;
        const value = inputField.getSimpleValue(false);
        const rowLength = Math.floor(offsetWidth / width);
        const row = Math.floor(caretPosition / rowLength);
        caret.hidden = false;
        const character = value[caretPosition] === ' '
            ? NON_BREAKING_SPACE : value[caretPosition] || NON_BREAKING_SPACE;
        const top = Math.round(height * row);
        const left = Math.round((caretPosition - row * rowLength) * width);
        caret.setPosition(left, top);
        caret.setValue(character);
    }
    hideCaret() {
        const { caret } = this;
        if (!caret)
            return;
        caret.hidden = true;
    }
    removeCaret() {
        const { caret } = this;
        if (!caret)
            return;
        this.caret = undefined;
        caret.destroy();
    }
    getInputRootOffset(offset) {
        const { label, input, labelWidth, contentPadding: { top: pt, left: pl } } = this;
        if (!input && !label)
            return { left: pl, top: pt };
        return input
            ? { left: offset.left + labelWidth + pl, top: offset.top + pt }
            : { left: labelWidth + pl, top: pt };
    }
}
Line.cf = CaretFactory.getInstance();
Line.itemVerticalPadding = 4;
Line.itemHorizontalPadding = 16;

const checkArraysEqual = (first, second) => first.length === second.length && first.every((item) => second.includes(item));

class KeyboardShortcutsManager {
    constructor(params, unlockKey) {
        this.layerField = 1;
        this.shortcutsMapField = {};
        this.listeners = {};
        this.isLock = false;
        this.lockWhiteList = [];
        this.actionHandler = (params || {}).onAction;
        this.unlockKey = unlockKey || v1();
    }
    static checkShortcutsEqual(first, second) {
        const firstNormalized = KeyboardShortcutsManager.getNormalizedShortcut(first);
        const secondNormalized = KeyboardShortcutsManager.getNormalizedShortcut(second);
        return firstNormalized.ctrlKey === secondNormalized.ctrlKey
            && firstNormalized.metaKey === secondNormalized.metaKey
            && firstNormalized.altKey === secondNormalized.altKey
            && firstNormalized.shiftKey === secondNormalized.shiftKey
            && checkArraysEqual(firstNormalized.codes, secondNormalized.codes);
    }
    static getNormalizedShortcut(shortcut) {
        const normalizedShortcut = {
            codes: [], ctrlKey: false, metaKey: false, altKey: false, shiftKey: false,
        };
        if (isNumber(shortcut)) {
            normalizedShortcut.codes = [shortcut];
        }
        else if (isArray(shortcut) && isNumber(shortcut[0])) {
            normalizedShortcut.codes = shortcut;
        }
        else {
            normalizedShortcut.codes = isArray(shortcut.code)
                ? shortcut.code : [shortcut.code];
            normalizedShortcut.ctrlKey = shortcut.ctrl
                || normalizedShortcut.ctrlKey;
            normalizedShortcut.metaKey = shortcut.meta
                || normalizedShortcut.metaKey;
            normalizedShortcut.altKey = shortcut.alt || normalizedShortcut.altKey;
            normalizedShortcut.shiftKey = shortcut.shift
                || normalizedShortcut.shiftKey;
        }
        return normalizedShortcut;
    }
    get layer() {
        return this.layerField;
    }
    set layer(val) {
        const { layerField, emitter } = this;
        if (layerField === val)
            return;
        this.layerField = val;
        if (emitter)
            emitter.updateLayerType(val);
    }
    addListener(action, callback, info) {
        const { listeners } = this;
        if (!listeners[action])
            listeners[action] = [];
        listeners[action].push({ callback, info });
    }
    removeListener(callback) {
        const { listeners } = this;
        Object.keys(listeners).some((action) => {
            const index = listeners[action].findIndex((item) => item.callback === callback);
            if (index >= 0) {
                listeners[action].splice(index, 1);
                return true;
            }
            return false;
        });
    }
    addShortcut(action, shortcut, info) {
        const { shortcutsMapField } = this;
        const shortcutIndex = this.getShortcutIndex(action, shortcut);
        if (shortcutIndex >= 0)
            return;
        if (!shortcutsMapField[action])
            shortcutsMapField[action] = [];
        shortcutsMapField[action].push({
            info, actionShortcut: shortcut,
        });
        this.deactivate();
        this.activate();
    }
    removeShortcut(action, shortcut) {
        const { shortcutsMapField } = this;
        if (!shortcut)
            return delete shortcutsMapField[action];
        const shortcutIndex = this.getShortcutIndex(action, shortcut);
        if (shortcutIndex === true)
            return delete shortcutsMapField[action];
        if (shortcutIndex >= 0) {
            shortcutsMapField[action].splice(shortcutIndex, 1);
            this.deactivate();
            this.activate();
        }
        return null;
    }
    activate() {
        if (!this.emitter) {
            this.emitter = new Emitter(this.layerField);
            this.addListeners();
        }
    }
    deactivate() {
        const { emitter } = this;
        if (emitter)
            emitter.destroy();
        delete this.emitter;
    }
    destroy() {
        this.deactivate();
    }
    lock(whiteList = []) {
        if (this.isLock)
            return undefined;
        this.isLock = true;
        this.lockWhiteList = whiteList;
        return () => {
            this.unlock(this.unlockKey);
        };
    }
    unlock(key) {
        if (this.unlockKey === key) {
            this.isLock = false;
            this.lockWhiteList = [];
        }
    }
    getShortcutIndex(action, shortcut) {
        const info = this.shortcutsMapField[action];
        if (!info)
            return -1;
        return info.findIndex((item) => KeyboardShortcutsManager.checkShortcutsEqual(item.actionShortcut, shortcut));
    }
    addListeners() {
        const { emitter, shortcutsMapField, listeners, actionHandler, isLock, lockWhiteList } = this;
        if (!emitter)
            return;
        Object.keys(shortcutsMapField).forEach((action) => {
            shortcutsMapField[action].forEach((item) => {
                const { info: shortcut } = item;
                const actionShortcut = KeyboardShortcutsManager.getNormalizedShortcut(item.actionShortcut);
                emitter.addListener('keyDown', (e) => {
                    if (isLock && !lockWhiteList.includes(action))
                        return;
                    const callbackList = listeners[action];
                    if (callbackList) {
                        callbackList.some(({ callback, info: listener }) => callback(action, e, { listener, shortcut }));
                    }
                    if (actionHandler)
                        actionHandler(action, e);
                }, actionShortcut);
            });
        });
    }
}

class ValueEvent {
    constructor(value, typedValue) {
        this.value = value;
        this.typedValue = typedValue;
    }
}

const SUBMIT_EVENT_NAME = 'submit';
const ACTION_EVENT_NAME = 'action';
const UPDATE_CARET_POSITION_EVENT_NAME = 'caretPosition';
const INPUT_EVENT_LIST = [
    'change',
    'focus',
    'blur',
    'keydown',
    'keypress',
    'keyup',
];
const CLEAR_ACTION_NAME = 'clear';

class ActionEvent {
    constructor(params) {
        this.action = params.action;
        this.data = params.data;
        this.target = params.target;
    }
}

class PluginManager {
    constructor(termInfo, keyboardShortcutsManager) {
        this.pluginList = [];
        this.termInfo = termInfo;
        this.keyboardShortcutsManager = keyboardShortcutsManager;
    }
    updateTermInfo(termInfo) {
        this.termInfo = termInfo;
        this.pluginList.forEach(({ inst }) => {
            inst.updateTermInfo(termInfo);
        });
    }
    register(plugin, name) {
        const { pluginList, termInfo } = this;
        const pluginName = name || plugin.name;
        if (this.getPluginIndex(pluginName, plugin) >= 0)
            return;
        pluginList.push({ name: pluginName, inst: plugin });
        this.clearPlugins();
        plugin.setTermInfo(termInfo, this.keyboardShortcutsManager);
    }
    unregister(descriptor) {
        const { pluginList } = this;
        const index = typeof descriptor === 'string'
            ? this.getPluginIndex(descriptor)
            : this.getPluginIndex(descriptor.name, descriptor);
        if (index < 0)
            return;
        pluginList.splice(index, 1);
        const item = pluginList[index];
        if (!item)
            return;
        this.clearPlugins();
        item.inst.destroy();
    }
    destroy() {
        this.pluginList.forEach(({ inst }) => inst.destroy());
        this.pluginList = [];
    }
    getPlugin(descriptor) {
        var _a, _b;
        const { pluginList } = this;
        return isString(descriptor)
            ? ((_a = pluginList.find(({ name }) => name === descriptor)) === null || _a === void 0 ? void 0 : _a.inst) || null
            : ((_b = pluginList.find(({ inst }) => inst instanceof descriptor)) === null || _b === void 0 ? void 0 : _b.inst) || null;
    }
    getPluginIndex(name, plugin) {
        const { pluginList } = this;
        const nameIndex = pluginList.findIndex((item) => item.name === name);
        if (nameIndex >= 0 || !plugin)
            return nameIndex;
        return pluginList.findIndex((item) => item.inst.equal(plugin));
    }
    clearPlugins() {
        this.pluginList.forEach(({ inst }) => inst.clear());
    }
}

class CaretEvent {
    constructor(position, caret) {
        this.position = position;
        this.caret = caret;
    }
}

const IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const BASE_PLUGIN_NAME = 'base';

class Plugin {
    constructor() {
        this.name = BASE_PLUGIN_NAME;
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        this.termInfo = termInfo;
        this.keyboardShortcutsManager = keyboardShortcutsManager;
    }
    updateTermInfo(termInfo) {
        this.termInfo = termInfo;
    }
    destroy() {
        this.clear();
    }
    equal(plugin) {
        return plugin.name === this.name;
    }
    clear() { }
}

class Term extends TemplateEngine {
    constructor(container, params = { lines: [], editLine: '' }) {
        super(template$4, container);
        this.isDisabled = false;
        this.headerField = '';
        this.history = {
            list: [], index: -1, stopHistory: false,
        };
        this.params = {
            label: '',
            delimiter: DEFAULT_DELIMITER,
            header: '',
            caret: '',
            scrollbarSize: 20,
            size: { width: 1, height: 1 },
        };
        this.isEditing = false;
        this.itemSize = { width: 1, height: 1 };
        this.heightCache = [];
        this.lines = [];
        this.listeners = {};
        this.addEventListener = (type, handler, options) => {
            const { listeners } = this;
            if (!listeners[type])
                listeners[type] = [];
            listeners[type].push({ handler, options });
            this.registerListener(type, handler, options);
        };
        this.removeEventListener = (type, handler, options) => {
            const list = this.listeners[type];
            if (!list)
                return;
            const index = list.findIndex((item) => item.handler === handler);
            if (index >= 0)
                list.splice(index, 1);
            this.unregisterListener(type, handler, options);
        };
        this.setLabel = (params = {}) => {
            const { editLine, params: currentParams } = this;
            const { label, delimiter } = params;
            let isUpdated = false;
            if (!isUndefined(label)) {
                currentParams.label = label;
                isUpdated = true;
            }
            if (!isUndefined(delimiter)) {
                currentParams.delimiter = delimiter;
                isUpdated = true;
            }
            if (editLine && editLine.label)
                editLine.label.params = params;
            if (isUpdated)
                this.updateTermInfo();
        };
        this.write = (data, options = {}) => {
            const { editLine, isEditing } = this;
            const { withSubmit, duration = 0 } = options;
            if (!editLine || isEditing)
                return duration ? Promise.resolve(false) : false;
            this.isEditing = true;
            editLine.disabled = true;
            if (duration >= 0) {
                const { value: original } = editLine;
                const str = isString(data) ? data : data.str;
                const millisecondCharactersCount = str.length / duration;
                let milliseconds = 0;
                const updatingValue = isString(data) ? { str: data } : Object.assign(Object.assign({}, data), { str: '' });
                return new Promise((res) => {
                    this.writingInterval = setInterval(() => {
                        milliseconds += 1;
                        const substr = str.substr(0, Math.floor(millisecondCharactersCount * milliseconds));
                        if (substr === str) {
                            clearInterval(this.writingInterval);
                            this.updateEditLine(data, true, original);
                            if (withSubmit)
                                editLine.submit();
                            res(true);
                        }
                        else if (updatingValue.str !== substr) {
                            updatingValue.str = substr;
                            this.updateEditLine(updatingValue, false, original);
                        }
                    }, 1);
                });
            }
            this.updateEditLine(data, true);
            if (withSubmit)
                editLine.submit();
            return true;
        };
        this.characterUpdater = () => {
            const { vl, itemSize } = this;
            const newItemSize = getItemSize(this.getRef('root'), true);
            if (!compareItemSize(itemSize, newItemSize)) {
                this.heightCache = [];
                this.itemSize = newItemSize;
                vl.updateViewport();
            }
        };
        this.itemGetter = (index, params) => {
            const { lines, vl, params: { delimiter, label } } = this;
            const { container, ref, append } = params || {};
            const virtualItemsContainer = container || (vl
                ? vl.getVirtualItemsContainer() : undefined);
            return virtualItemsContainer ? new Line(virtualItemsContainer, {
                ref, append, delimiter, label, editable: false, value: lines[index], className: 'Term__line',
            }) : null;
        };
        this.heightGetter = (index) => {
            const { heightCache, itemSize, lines, params: { delimiter, label, size, scrollbarSize }, } = this;
            if (isUndefined(heightCache[index])) {
                heightCache[index] = Line.getHeight({
                    itemSize,
                    delimiter,
                    label,
                    value: lines[index],
                    width: size.width - scrollbarSize,
                });
            }
            return heightCache[index];
        };
        this.observeHandler = (entries) => {
            const { params: { size }, vl } = this;
            const { width, height } = get(entries, '[0].contentRect');
            if (size.width !== width) {
                size.width = width;
                size.height = height;
                this.heightCache = [];
                vl.updateViewport();
                this.updateTermInfo();
            }
            else if (size.height !== height) {
                size.width = width;
                size.height = height;
                vl.updateViewport();
                this.updateTermInfo();
            }
        };
        this.clickHandler = (e) => {
            if (e.target === this.vl.getRef('root'))
                this.lastLineFocus();
        };
        this.submitHandler = (params) => {
            const { value, formattedValue, lockString } = params;
            const { vl, editLine, listeners, history: { list } } = this;
            const historyValue = value.substring(lockString.length);
            if (historyValue && last(list) !== historyValue && !(editLine === null || editLine === void 0 ? void 0 : editLine.secret))
                list.push(historyValue);
            if (!editLine)
                return;
            editLine.visible = false;
            this.lines.push(formattedValue);
            this.clearHistoryState();
            this.history.list = list;
            vl.length = this.lines.length;
            vl.scrollBottom();
            editLine.clear();
            editLine.secret = false;
            this.updateTermInfo();
            this.submitTimeout = setTimeout(() => {
                editLine.visible = true;
                editLine.focus();
                if (listeners[SUBMIT_EVENT_NAME]) {
                    const event = new ValueEvent(value, historyValue || undefined);
                    listeners[SUBMIT_EVENT_NAME].forEach((item) => item.handler(event));
                }
            }, 10);
        };
        this.changeHandler = (value) => {
            const { history: { list, index }, vl } = this;
            if (list[index] !== value)
                this.history.stopHistory = true;
            if (!value)
                this.history.stopHistory = false;
            vl.scrollBottom();
        };
        this.updateCaretPositionHandler = (position, caret) => {
            const { listeners } = this;
            this.updateTermInfo();
            if (listeners[UPDATE_CARET_POSITION_EVENT_NAME]) {
                const caretEvent = new CaretEvent(position, caret);
                listeners[UPDATE_CARET_POSITION_EVENT_NAME].forEach((item) => item.handler(caretEvent));
            }
        };
        this.lineKeydownHandler = (e) => {
            const keyCode = Number(getKeyCode(e));
            if (keyCode === UP_CODE) {
                this.prevHistory(e);
            }
            else if (keyCode === DOWN_CODE) {
                this.nextHistory(e);
            }
        };
        this.prevHistory = (e) => {
            const { index, list } = this.history;
            this.applyHistory(e, index < 0 ? list.length - 1 : Math.max(0, index - 1));
        };
        this.nextHistory = (e) => {
            const { index, list } = this.history;
            return index < 0
                ? this.applyHistory(e, -1)
                : this.applyHistory(e, index === list.length - 1 ? -1 : index + 1);
        };
        this.clearHandler = () => {
            this.setLines([]);
            this.updateTermInfo();
        };
        this.actionHandler = (action) => {
            const { listeners } = this;
            if (listeners[ACTION_EVENT_NAME]) {
                const event = new ActionEvent({ action });
                listeners[ACTION_EVENT_NAME].forEach((item) => item.handler(event));
            }
        };
        this.setLines = (lines) => {
            const { vl } = this;
            this.lines = lines;
            vl.length = lines.length;
            vl.clearCache();
            this.updateTermInfo();
        };
        this.updateTermInfo = () => {
            this.pluginManager.updateTermInfo(this.getTermInfo());
        };
        const { virtualizedTopOffset, virtualizedBottomOffset, header } = params;
        this.headerField = header || '';
        this.init(container, params);
        this.ro = new ResizeObserver(this.observeHandler);
        this.keyboardShortcutsManager = new KeyboardShortcutsManager({ onAction: this.actionHandler });
        this.vl = new VirtualizedList(this.getRef('linesContainer'), {
            length: this.lines.length,
            itemGetter: this.itemGetter,
            heightGetter: this.heightGetter,
            topOffset: virtualizedTopOffset || 0,
            bottomOffset: virtualizedBottomOffset || 0,
        });
        this.preStart(container, params);
        this.pluginManager = new PluginManager(this.getTermInfo(), this.keyboardShortcutsManager);
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled, editLine, keyboardShortcutsManager } = this;
        if (isDisabled === val)
            return;
        this.isDisabled = val;
        if (editLine)
            editLine.disabled = val;
        if (val)
            keyboardShortcutsManager.deactivate();
        else
            keyboardShortcutsManager.activate();
    }
    get header() {
        return this.headerField;
    }
    set header(val) {
        const { headerField } = this;
        if (headerField !== val) {
            const headerText = this.getRef('headerText');
            headerText.innerHTML = escapeString(val);
        }
        this.headerField = val;
    }
    destroy() {
        var _a;
        clearInterval(this.writingInterval);
        clearTimeout(this.submitTimeout);
        this.removeKeyDownHandler();
        this.unregisterAllListeners();
        (_a = this.editLine) === null || _a === void 0 ? void 0 : _a.destroy();
        this.removeListeners();
        this.pluginManager.destroy();
        this.keyboardShortcutsManager.destroy();
        getItemSize(this.getRef('root'));
        // TODO: add unobserve.
        super.destroy();
    }
    setCaret(caret) {
        this.params.caret = caret;
        if (!this.editLine)
            return;
        this.editLine.setCaret(caret);
        this.updateTermInfo();
    }
    setHeader(text) {
        const header = this.getRef('header');
        const headerText = this.getRef('headerText');
        if (text) {
            headerText.innerHTML = text;
            header === null || header === void 0 ? void 0 : header.classList.remove('Term__header--hidden');
        }
        else {
            header === null || header === void 0 ? void 0 : header.classList.add('Term__header--hidden');
        }
        this.params.header = '';
        this.updateTermInfo();
    }
    blur() {
        const { editLine } = this;
        if (editLine)
            editLine.blur();
    }
    updateEditLine(data, stopEdit, original) {
        const { editLine } = this;
        if (editLine) {
            const value = isUndefined(original) ? editLine.value : original;
            editLine.value = isArray(value) ? [...value, data] : [value, data];
            editLine.moveCaretToEnd();
            if (stopEdit)
                editLine.disabled = false;
        }
        if (stopEdit)
            this.isEditing = false;
    }
    init(container, params) {
        const { header = '' } = params;
        this.setParams(container, params);
        this.render({ header, hidden: header ? '' : 'Term__header--hidden' });
        this.params.scrollbarSize = getScrollbarSize(this.getRef('root'));
        this.itemSize = getItemSize(this.getRef('root'), true);
        this.addListeners();
    }
    preStart(container, params) {
        this.addEditLine(params.editLine || '');
        this.ro.observe(container);
        this.vl.scrollBottom();
        this.lastLineFocus();
        this.frameHandler = this.characterUpdater;
        this.registerFrameHandler();
        this.addKeyboardShortcutsManagerListeners();
        this.keyboardShortcutsManager.activate();
    }
    setParams(container, params) {
        const { params: currentParams } = this;
        this.lines = params.lines;
        currentParams.size.width = container.offsetWidth;
        currentParams.size.height = container.offsetHeight;
        currentParams.header = params.header || currentParams.header;
        currentParams.caret = params.caret || currentParams.caret;
        currentParams.label = params.label || currentParams.label;
        currentParams.delimiter = params.delimiter || currentParams.delimiter;
    }
    addListeners() {
        var _a;
        const { editLine } = this;
        const root = this.getRef('root');
        if (root)
            root.addEventListener('click', this.clickHandler);
        if (editLine)
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.addEventListener(CHANGE_EVENT_TYPE, this.updateTermInfo);
    }
    removeListeners() {
        var _a;
        const { editLine } = this;
        const root = this.getRef('root');
        if (root)
            root.removeEventListener('click', this.clickHandler);
        if (editLine)
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.removeEventListener(CHANGE_EVENT_TYPE, this.updateTermInfo);
    }
    addEditLine(editLineParams) {
        const { vl, params: { delimiter, label, caret } } = this;
        const generalItemsContainer = vl.getGeneralItemsContainer();
        if (!generalItemsContainer)
            return;
        this.editLine = new Line(generalItemsContainer, {
            label,
            delimiter,
            caret,
            className: ['Term__line', 'Term__editLine'].join(' '),
            value: isArray(editLineParams) || isString(editLineParams)
                ? editLineParams : editLineParams.value,
            editable: true,
            onSubmit: this.submitHandler,
            onChange: this.changeHandler,
            onUpdateCaretPosition: this.updateCaretPositionHandler,
            secret: get(editLineParams, 'secret') || false,
        });
        this.clearHistoryState();
        this.addKeyDownHandler();
    }
    lastLineFocus() {
        if (document.hasFocus() && this.editLine) {
            this.editLine.focus();
        }
    }
    clearHistoryState() {
        this.history = { list: [], index: -1, stopHistory: false };
    }
    addKeyDownHandler() {
        const { editLine } = this;
        if (!editLine || !editLine.input)
            return;
        editLine.input.addEventListener('keydown', this.lineKeydownHandler);
    }
    removeKeyDownHandler() {
        const { editLine } = this;
        if (!editLine || !editLine.input)
            return;
        editLine.input.removeEventListener('keydown', this.lineKeydownHandler);
    }
    applyHistory(e, newIndex) {
        const { history: { index, list, stopHistory }, editLine } = this;
        if (!list.length || !editLine || stopHistory)
            return null;
        if (index === newIndex)
            return e.stopPropagation();
        this.history.index = newIndex;
        editLine.value = newIndex >= 0 ? list[newIndex] || '' : '';
        editLine.moveCaretToEnd();
        return e.preventDefault();
    }
    addKeyboardShortcutsManagerListeners() {
        const { keyboardShortcutsManager } = this;
        if (IS_MAC) {
            keyboardShortcutsManager.addShortcut(CLEAR_ACTION_NAME, { code: K_CODE, meta: true });
        }
        else {
            keyboardShortcutsManager.addShortcut(CLEAR_ACTION_NAME, { code: K_CODE, ctrl: true });
        }
        keyboardShortcutsManager.addListener(CLEAR_ACTION_NAME, this.clearHandler);
    }
    registerListener(type, handler, options) {
        var _a;
        const { editLine } = this;
        if (editLine && INPUT_EVENT_LIST.includes(type)) {
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.addEventListener(type, handler, options);
        }
    }
    unregisterAllListeners() {
        const { listeners } = this;
        Object.keys(listeners).forEach((type) => {
            if (INPUT_EVENT_LIST.includes(type)) {
                listeners[type].forEach((item) => {
                    this.unregisterListener(type, item.handler, item.options);
                });
            }
        });
    }
    unregisterListener(type, handler, options) {
        var _a;
        const { editLine } = this;
        if (editLine && INPUT_EVENT_LIST.includes(type)) {
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.removeEventListener(type, handler, options);
        }
    }
    getTermInfo() {
        const { params: { header } } = this;
        return {
            title: header,
            elements: this.getTermInfoElements(),
            label: this.getTermInfoLabel(),
            caret: this.getTermInfoCaret(),
            edit: this.getTermInfoEdit(),
            lines: this.getTermInfoLines(),
            history: this.history.list,
            addEventListener: this.addEventListener,
            removeEventListener: this.removeEventListener,
        };
    }
    getTermInfoElements() {
        const { editLine } = this;
        return {
            root: this.getRef('content'),
            edit: editLine === null || editLine === void 0 ? void 0 : editLine.getRef('content'),
            title: this.getRef('header'),
        };
    }
    getTermInfoLabel() {
        const { label, delimiter } = this.params;
        return { label, delimiter, set: this.setLabel };
    }
    getTermInfoCaret() {
        var _a;
        const { editLine, itemSize } = this;
        return {
            position: ((_a = editLine === null || editLine === void 0 ? void 0 : editLine.input) === null || _a === void 0 ? void 0 : _a.caretPosition) || 0,
            offset: (editLine === null || editLine === void 0 ? void 0 : editLine.caretOffset) || { left: 0, top: 0 },
            size: { width: itemSize.width, height: itemSize.height },
            setCaretPosition: (position) => {
                if (position < 0) {
                    editLine === null || editLine === void 0 ? void 0 : editLine.moveCaretToEnd();
                    this.updateTermInfo();
                }
                else if (editLine && editLine.input && position >= 0) {
                    editLine.input.caretPosition = position;
                    this.updateTermInfo();
                }
            },
        };
    }
    getTermInfoEdit() {
        const { editLine } = this;
        return {
            value: BaseInput.getValueString((editLine === null || editLine === void 0 ? void 0 : editLine.value) || ''),
            parameterizedValue: (editLine === null || editLine === void 0 ? void 0 : editLine.value) || '',
            write: this.write,
            focus: () => editLine === null || editLine === void 0 ? void 0 : editLine.focus(),
            blur: () => editLine === null || editLine === void 0 ? void 0 : editLine.blur(),
            update: (params) => {
                if (!editLine)
                    return;
                if (isObject(params) && !isArray(params)) {
                    editLine.secret = Boolean(params.secret);
                    editLine.value = params.value;
                }
                else {
                    editLine.value = params;
                }
                this.updateTermInfo();
            },
            endOffset: (editLine === null || editLine === void 0 ? void 0 : editLine.endOffset) || { left: 0, top: 0 },
        };
    }
    getTermInfoLines() {
        const { lines } = this;
        return {
            list: lines.map((line) => BaseInput.getValueString(line)),
            parameterizedList: lines,
            update: this.setLines,
        };
    }
}

export { KeyboardShortcutsManager, Plugin, TemplateEngine, Term as default };
//# sourceMappingURL=index.js.map
           editLine.value = params.value;
                }
                else {
                    editLine.value = params;
                }
                this.updateTermInfo();
            },
            endOffset: (editLine === null || editLine === void 0 ? void 0 : editLine.endOffset) || { left: 0, top: 0 },
        };
    }
    getTermInfoLines() {
        const { lines } = this;
        return {
            list: lines.map((line) => BaseInput.getValueString(line)),
            parameterizedList: lines,
            update: this.setLines,
        };
    }
}

exports.KeyboardShortcutsManager = KeyboardShortcutsManager;
exports.Plugin = Plugin;
exports.TemplateEngine = TemplateEngine;
exports["default"] = Term;
//# sourceMappingURL=index.js.map
