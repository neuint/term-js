import { uniq } from 'lodash-es';
import { Plugin } from '@term-js/term';
import { Autocomplete } from '@term-js/autocomplete-plugin';

var icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n  <path stroke=\"none\" d=\"M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z\"/>\n</svg>\n";

const PLUGIN_NAME = 'history-search-plugin';
const HISTORY_KEY_CODE = 89;
const IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

class HistorySearch extends Plugin {
    constructor(actionShortcut) {
        super();
        this.name = PLUGIN_NAME;
        this.history = [];
        this.actionShortcut = {
            code: HISTORY_KEY_CODE, meta: IS_MAC, ctrl: !IS_MAC,
        };
        if (actionShortcut)
            this.actionShortcut = actionShortcut;
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        this.setAutocomplete();
        this.setHistoryList();
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
        this.setHistoryList();
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
    setHistoryList() {
        const { termInfo, removeList, autocomplete } = this;
        if (!termInfo || !autocomplete)
            return;
        if (this.checkUpdateHistoryList()) {
            if (removeList)
                removeList();
            this.removeList = autocomplete.addList(this.history, this.actionShortcut, icon);
        }
    }
    checkUpdateHistoryList() {
        var _a;
        const { history } = this;
        const newHistory = uniq(((_a = this.termInfo) === null || _a === void 0 ? void 0 : _a.history) || []);
        const isUpdated = newHistory.length && (history.length !== newHistory.length
            || newHistory.some((item, i) => item !== history[i]));
        if (isUpdated) {
            this.history = newHistory;
            return true;
        }
        return false;
    }
}

export { HistorySearch };
//# sourceMappingURL=index.es.js.map
