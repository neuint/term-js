import { Plugin } from '@term-js/term';
import { Autocomplete } from '@term-js/autocomplete-plugin';

var icon = "<svg fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n  <polyline fill=\"none\" points=\"4 17 10 11 4 5\"/><line x1=\"12\" x2=\"20\" y1=\"19\" y2=\"19\"/>\n</svg>\n";

const PLUGIN_NAME = 'command-search-plugin';
const SHOW_KEY_CODE = 9;

class CommandSearch extends Plugin {
    constructor(actionShortcut) {
        super();
        this.name = PLUGIN_NAME;
        this.commandList = [];
        this.actionShortcut = { code: SHOW_KEY_CODE };
        if (actionShortcut)
            this.actionShortcut = actionShortcut;
    }
    set commands(list) {
        this.commandList = list;
        this.setList();
    }
    get commands() {
        return this.commandList;
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        this.setAutocomplete();
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
    }
    clear() {
        const { autocomplete } = this;
        if (autocomplete)
            autocomplete.clear();
        super.clear();
    }
    destroy() {
        this.clear();
        super.destroy();
    }
    setAutocomplete() {
        const { termInfo } = this;
        if (!termInfo)
            return;
        const autocomplete = termInfo.pluginManager.getPlugin(Autocomplete);
        if (autocomplete)
            return this.autocomplete = autocomplete;
        this.autocomplete = new Autocomplete();
        termInfo.pluginManager.register(this.autocomplete);
    }
    setList() {
        const { termInfo, removeList, autocomplete } = this;
        if (!termInfo || !autocomplete)
            return;
        if (removeList)
            removeList();
        this.removeList = autocomplete.addList(this.commandList, this.actionShortcut, icon);
    }
}

export { CommandSearch };
//# sourceMappingURL=index.es.js.map
