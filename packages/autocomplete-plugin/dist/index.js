import{v1 as t}from"uuid";import{Plugin as s}from"@neuint/term-js";import i from"@neuint/dropdown-plugin";const e="autocomplete-plugin-show";class o extends s{constructor(){super(...arguments),this.name="autocomplete-plugin",this.listsInfo=[],this.activeSuggestions=[],this.commandList=[],this.active="",this.isSetShowHandler=!1,this.onAutocomplete=(t,s,i)=>{var e;const{dropdownPlugin:o,listsInfo:n,active:r}=this,u=null==i?void 0:i.shortcut;!u||r&&r!==u||(this.commandList=(null===(e=n.find((t=>t.uuid===u)))||void 0===e?void 0:e.items)||[],s.stopPropagation(),s.preventDefault(),o&&this.setSuggestions()&&(this.active=u,o.isActionsLock=!0,this.showSuggestions(),setTimeout((()=>o.isActionsLock=!1),0)))},this.onSelect=t=>{const{termInfo:s}=this;if(s){const{edit:i}=s;i.focus(),i.write(t.replace(i.value,""))}this.clear()},this.onClose=()=>{this.activeSuggestions=[],this.active=""}}addList(s,i,e){const o={icon:e,items:s,actionShortcut:i,isRegistered:!1,uuid:t()};return this.hideSuggestionsList(),this.listsInfo.push(o),this.registerShortcut(o),()=>this.removeList(o.uuid)}removeList(t){const{listsInfo:s,keyboardShortcutsManager:i}=this,o=s.findIndex((s=>s.uuid===t));if(o<0)return;const n=s[o];s.splice(o,1),i&&i.removeShortcut(e,n.actionShortcut)}setTermInfo(t,s){super.setTermInfo(t,s),this.registerShortcut(),this.setDropdownPlugin()}updateTermInfo(t){const{termInfo:s,active:i}=this,e=null==s?void 0:s.edit.value,o=t.edit.value;super.updateTermInfo(t),i&&o&&e!==o?(this.setSuggestions(),this.showSuggestions()):i&&!o&&this.clear()}clear(){this.hideSuggestionsList(),this.active=""}destroy(){var t;this.unregisterShortcut(),null===(t=this.dropdownPlugin)||void 0===t||t.hide(),super.destroy()}unregisterShortcut(){const{keyboardShortcutsManager:t}=this;t&&t.removeShortcut(e)}registerShortcut(t){const{keyboardShortcutsManager:s,listsInfo:i,isSetShowHandler:o}=this;!s||t&&t.isRegistered||(t?(s.addShortcut(e,t.actionShortcut,t.uuid),t.isRegistered=!0):i.forEach((t=>this.registerShortcut(t))),o||(s.addListener(e,this.onAutocomplete),this.isSetShowHandler=!0))}setDropdownPlugin(){const{termInfo:t}=this;if(!t)return;const s=this.pluginManager.getPlugin(i);s?this.dropdownPlugin=s:(this.dropdownPlugin=new i(this.pluginManager),this.pluginManager.register(this.dropdownPlugin))}setSuggestions(){const{termInfo:t,commandList:s}=this;if(!t)return this.setNewSuggestions([]);const{caret:{position:i},edit:{value:e}}=t;return this.setNewSuggestions(i!==e.length?[]:s.filter((t=>0===t.indexOf(e)&&t!==e)))}setNewSuggestions(t){const{activeSuggestions:s}=this;return this.activeSuggestions=t,s.length!==t.length||t.some(((t,i)=>t!==s[i]))}showSuggestions(){const{activeSuggestions:t}=this;t.length?this.renderSuggestionsList():this.clear()}renderSuggestionsList(){var t;const{dropdownPlugin:s,activeSuggestions:i,termInfo:e,active:o,listsInfo:n}=this,r=null==e?void 0:e.edit.value;if(!s||!r)return;const u=null===(t=n.find((t=>t.uuid===o)))||void 0===t?void 0:t.icon;s.show(i,{onSelect:this.onSelect,onClose:this.onClose,append:u,className:u?"Autocomplete__withIcon":""}),s.highlight=r.trim()}hideSuggestionsList(){const{dropdownPlugin:t}=this;t&&t.hide(),this.activeSuggestions=[]}}export{o as default};
