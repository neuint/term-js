import { TemplateEngine, Plugin } from '@neuint/term-js';

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ":root {\n  --status-bar-plugin-text-color: #7b7b7b;\n  --status-bar-plugin-icon-color: #949494;\n  --status-bar-plugin-bg-color: #161f24;\n  --status-bar-plugin-border-color: black;\n}";
styleInject(css_248z$1);

var template = "<div class=\"root\">\n  <div class=\"icon\">{icon}</div>\n  <div class=\"text\">{text}</div>\n</div>\n";

var css_248z = ".index_root__3eru0 {\n  height: 1.5rem;\n  display: flex;\n  align-items: center;\n  border-top: 1px solid var(--status-bar-plugin-border-color);\n  background: var(--status-bar-plugin-bg-color);\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n\n.index_icon__zGxlq {\n  flex: 1;\n  display: flex;\n  justify-content: flex-end;\n  margin-right: 0.25rem;\n}\n.index_icon__zGxlq svg {\n  width: 1rem;\n  height: 1rem;\n  stroke: var(--status-bar-plugin-icon-color);\n  fill: var(--status-bar-plugin-icon-color);\n}\n\n.index_text__TEdNY {\n  font-size: 0.875rem;\n  color: var(--status-bar-plugin-text-color);\n}";
var css = {"root":"index_root__3eru0","icon":"index_icon__zGxlq","text":"index_text__TEdNY"};
styleInject(css_248z);

class StatusView extends TemplateEngine {
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
        super.render({ css, icon, text }, isRendered ? { replace: this } : {});
        this.isRendered = true;
    }
}

const PLUGIN_NAME = 'status-bar-plugin';

class StatusBar extends Plugin {
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

export { StatusBar as default };
//# sourceMappingURL=index.js.map
   }
}

exports["default"] = StatusBar;
//# sourceMappingURL=index.js.map
