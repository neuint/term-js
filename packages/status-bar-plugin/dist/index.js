'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var termJs = require('@neuint/term-js');

var template = "<div class=\"StatusView\">\n  <div class=\"StatusView__icon\">{icon}</div>\n  <div class=\"StatusView__text\">{text}</div>\n</div>\n";

class StatusView extends termJs.TemplateEngine {
    constructor(container) {
        super(template, container);
        this.iconField = '';
        this.textField = '';
        this.isRendered = false;
    }
    set icon(val) {
        this.iconField = val;
        this.render();
    }
    get icon() {
        return this.iconField;
    }
    set text(val) {
        this.textField = val;
        this.render();
    }
    get text() {
        return this.textField;
    }
    render() {
        const { icon, text, isRendered } = this;
        super.render({ icon, text }, isRendered ? { replace: this } : {});
        this.isRendered = true;
    }
}

const PLUGIN_NAME = 'status-bar-plugin';

class StatusBar extends termJs.Plugin {
    constructor() {
        super(...arguments);
        this.name = PLUGIN_NAME;
        this.text = '';
        this.icon = '';
    }
    set status(val) {
        const { view } = this;
        this.text = val.text;
        this.icon = val.icon || '';
        if (view) {
            view.icon = this.icon;
            view.text = this.text;
        }
    }
    get status() {
        const { text, icon } = this;
        return { text, icon };
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        this.setView();
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
        this.setView();
    }
    destroy() {
        const { view } = this;
        if (view)
            view.destroy();
        super.destroy();
    }
    setView() {
        const { termInfo, text, icon, view } = this;
        if (!termInfo)
            return;
        const { root } = termInfo.elements;
        if (!root || view)
            return;
        this.view = new StatusView(root);
        this.view.text = text;
        this.view.icon = icon;
        this.view.render();
    }
}

exports["default"] = StatusBar;
//# sourceMappingURL=index.js.map
