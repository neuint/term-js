'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uuid = require('uuid');
var term = require('@term-js/term');
var dropdownPlugin = require('@term-js/dropdown-plugin');

var css = {"withIcon":"withIcon-autocomplete-plugin-️3606278efd34a3558ed3ac1666cdcb6e"};

const SHOW_ACTION = 'autocomplete-plugin-show';
const PLUGIN_NAME = 'autocomplete-plugin';

class Autocomplete extends term.Plugin {
    constructor() {
        super(...arguments);
        this.name = PLUGIN_NAME;
        this.listsInfo = [];
        this.activeSuggestions = [];
        this.commandList = [];
        this.active = '';
        this.isSetShowHandler = false;
        this.onAutocomplete = (action, e, info) => {
            var _a;
            const { dropdownPlugin, listsInfo, active } = this;
            const infoUuid = info === null || info === void 0 ? void 0 : info.shortcut;
            if (!infoUuid || (active && active !== infoUuid))
                return;
            this.commandList = ((_a = listsInfo.find(item => item.uuid === infoUuid)) === null || _a === void 0 ? void 0 : _a.items) || [];
            e.stopPropagation();
            e.preventDefault();
            if (dropdownPlugin && this.setSuggestions()) {
                this.active = infoUuid;
                dropdownPlugin.isActionsLock = true;
                this.showSuggestions();
                setTimeout(() => dropdownPlugin.isActionsLock = false, 0);
            }
        };
        this.onSelect = (text) => {
            const { termInfo } = this;
            if (termInfo) {
                const { edit } = termInfo;
                edit.focus();
                edit.write(text.replace(edit.value, ''));
            }
            this.clear();
        };
        this.onClose = () => {
            this.activeSuggestions = [];
            this.active = '';
        };
    }
    addList(items, actionShortcut, icon) {
        const info = {
            icon, items, actionShortcut, isRegistered: false, uuid: uuid.v1(),
        };
        this.listsInfo.push(info);
        this.registerShortcut(info);
        return () => this.removeList(info.uuid);
    }
    removeList(uuidValue) {
        const { listsInfo, keyboardShortcutsManager } = this;
        const index = listsInfo.findIndex(item => item.uuid === uuidValue);
        if (index < 0)
            return;
        const listInfo = listsInfo[index];
        listsInfo.splice(index, 1);
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.removeShortcut(SHOW_ACTION, listInfo.actionShortcut);
        }
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        this.registerShortcut();
        this.setDropdownPlugin();
    }
    updateTermInfo(termInfo) {
        const { termInfo: termInfoPrev, active } = this;
        const prevValue = termInfoPrev === null || termInfoPrev === void 0 ? void 0 : termInfoPrev.edit.value;
        const currentValue = termInfo.edit.value;
        super.updateTermInfo(termInfo);
        if (active && currentValue && prevValue !== currentValue) {
            this.setSuggestions();
            this.showSuggestions();
        }
        else if (active && !currentValue) {
            this.clear();
        }
    }
    clear() {
        this.hideSuggestionsList();
        this.active = '';
        super.clear();
    }
    destroy() {
        var _a;
        this.unregisterShortcut();
        (_a = this.dropdownPlugin) === null || _a === void 0 ? void 0 : _a.hide();
        super.destroy();
    }
    unregisterShortcut() {
        const { keyboardShortcutsManager } = this;
        if (keyboardShortcutsManager)
            keyboardShortcutsManager.removeShortcut(SHOW_ACTION);
    }
    registerShortcut(info) {
        const { keyboardShortcutsManager, listsInfo, isSetShowHandler } = this;
        if (!keyboardShortcutsManager || (info && info.isRegistered))
            return;
        if (info) {
            keyboardShortcutsManager.addShortcut(SHOW_ACTION, info.actionShortcut, info.uuid);
            info.isRegistered = true;
        }
        else {
            listsInfo.forEach(item => this.registerShortcut(item));
        }
        if (!isSetShowHandler) {
            keyboardShortcutsManager.addListener(SHOW_ACTION, this.onAutocomplete);
            this.isSetShowHandler = true;
        }
    }
    setDropdownPlugin() {
        const { termInfo } = this;
        if (!termInfo)
            return;
        const dropdownPlugin$1 = termInfo.pluginManager.getPlugin(dropdownPlugin.Dropdown);
        if (dropdownPlugin$1) {
            this.dropdownPlugin = dropdownPlugin$1;
        }
        else {
            this.dropdownPlugin = new dropdownPlugin.Dropdown();
            termInfo.pluginManager.register(this.dropdownPlugin);
        }
    }
    setSuggestions() {
        const { termInfo, commandList } = this;
        if (!termInfo)
            return this.setNewSuggestions([]);
        const { caret: { position }, edit: { value } } = termInfo;
        return this.setNewSuggestions(position !== value.length
            ? []
            : commandList
                .filter(command => command.indexOf(value) === 0 && command !== value));
    }
    setNewSuggestions(newActiveSuggestions) {
        const { activeSuggestions } = this;
        this.activeSuggestions = newActiveSuggestions;
        return activeSuggestions.length !== newActiveSuggestions.length
            || newActiveSuggestions.some((item, i) => item !== activeSuggestions[i]);
    }
    showSuggestions() {
        const { activeSuggestions } = this;
        if (activeSuggestions.length) {
            this.renderSuggestionsList();
        }
        else {
            this.clear();
        }
    }
    renderSuggestionsList() {
        var _a;
        const { dropdownPlugin, activeSuggestions, termInfo, active, listsInfo } = this;
        const value = termInfo === null || termInfo === void 0 ? void 0 : termInfo.edit.value;
        if (!dropdownPlugin || !value)
            return;
        const icon = (_a = listsInfo.find(item => item.uuid === active)) === null || _a === void 0 ? void 0 : _a.icon;
        dropdownPlugin.show(activeSuggestions, {
            onSelect: this.onSelect,
            onClose: this.onClose,
            append: icon,
            className: icon ? css.withIcon : '',
        });
        dropdownPlugin.highlight = value.trim();
    }
    hideSuggestionsList() {
        const { dropdownPlugin } = this;
        if (dropdownPlugin)
            dropdownPlugin.hide();
        this.activeSuggestions = [];
    }
}

exports.Autocomplete = Autocomplete;
//# sourceMappingURL=index.js.map
