import{v1 as t}from"uuid";import{Plugin as s}from"@neuint/term-js";import e from"@neuint/dropdown-plugin";const i="autocomplete-plugin-show",o=t=>{const{edit:{parameterizedValue:s}}=t;return(t=>{if("string"==typeof t)return t;let s="";return t.forEach((t=>"string"==typeof t?s=`${s}${t}`:t.lock?s="":`${s}${t.str}`)),s})(s.value?s.value:s)};class n extends s{constructor(){super(...arguments),this.name="autocomplete-plugin",this.listsInfo=[],this.activeSuggestions=[],this.commandList=[],this.active="",this.isSetShowHandler=!1,this.onAutocomplete=(t,s,e)=>{const i=null==e?void 0:e.shortcut;this.showAutocomplete(i),s.stopPropagation(),s.preventDefault()},this.onSelect=t=>{const{termInfo:s}=this;if(s){const{edit:e}=s;let i=(t=>{const{edit:{parameterizedValue:s}}=t;if("string"==typeof s)return"";let e=-1;const i=s.reduce(((t,s,i)=>("string"==typeof s&&t.push(s),s.lock&&(t.push(s),e=i),t)),[]);return-1===e?"":i.slice(0,e+1)})(s);e.focus(),"string"==typeof i?i=t:i.push(t),e.update(i)}this.clear()},this.onClose=()=>{this.activeSuggestions=[],this.active=""}}addList(s,e,i){const o={icon:i,items:s,actionShortcut:e,isRegistered:!1,uuid:t(),emptyOpen:!1};return this.hideSuggestionsList(),this.listsInfo.push(o),this.registerShortcut(o),()=>this.removeList(o.uuid)}showList(s,e,i){const o={icon:i,items:s,actionShortcut:e,isRegistered:!1,uuid:t(),emptyOpen:!0};return this.hideSuggestionsList(),this.listsInfo.push(o),this.registerShortcut(o),setTimeout((()=>this.showAutocomplete(o.uuid)),0),()=>this.removeList(o.uuid)}removeList(t){const{listsInfo:s,keyboardShortcutsManager:e}=this,o=s.findIndex((s=>s.uuid===t));if(o<0)return;const n=s[o];s.splice(o,1),e&&e.removeShortcut(i,n.actionShortcut)}setTermInfo(t,s){super.setTermInfo(t,s),this.registerShortcut(),this.setDropdownPlugin()}updateTermInfo(t){var s;const{termInfo:e,active:i}=this,n=o(e),r=o(t),u=null===(s=this.listsInfo.find((t=>t.uuid===i)))||void 0===s?void 0:s.emptyOpen;super.updateTermInfo(t),i&&(r||!r&&u)&&n!==r?(this.setSuggestions(),this.showSuggestions()):i&&this.clear()}clear(){this.hideSuggestionsList(),this.active=""}destroy(){var t;this.unregisterShortcut(),null===(t=this.dropdownPlugin)||void 0===t||t.hide(),super.destroy()}unregisterShortcut(){const{keyboardShortcutsManager:t}=this;t&&t.removeShortcut(i)}registerShortcut(t){const{keyboardShortcutsManager:s,listsInfo:e,isSetShowHandler:o}=this;!s||t&&t.isRegistered||(t?(s.addShortcut(i,t.actionShortcut,t.uuid),t.isRegistered=!0):e.forEach((t=>this.registerShortcut(t))),o||(s.addListener(i,this.onAutocomplete),this.isSetShowHandler=!0))}setDropdownPlugin(){const{termInfo:t}=this;if(!t)return;const s=this.pluginManager.getPlugin(e);s?this.dropdownPlugin=s:(this.dropdownPlugin=new e(this.pluginManager),this.pluginManager.register(this.dropdownPlugin))}showAutocomplete(t){var s;const{dropdownPlugin:e,listsInfo:i,active:o}=this;return!(!t||o&&o!==t)&&(this.commandList=(null===(s=i.find((s=>s.uuid===t)))||void 0===s?void 0:s.items)||[],!(!e||!this.setSuggestions())&&(this.active=t,e.isActionsLock=!0,this.showSuggestions(),setTimeout((()=>e.isActionsLock=!1),0),!0))}setSuggestions(){const{termInfo:t,commandList:s}=this;if(!t)return this.setNewSuggestions([]);const{caret:{position:e},edit:{value:i}}=t,n=o(t).toLowerCase();return this.setNewSuggestions(e!==i.length?[]:s.filter((t=>{const s=t.toLowerCase();return 0===s.indexOf(n)&&s!==n})))}setNewSuggestions(t){const{activeSuggestions:s}=this;return this.activeSuggestions=t,s.length!==t.length||t.some(((t,e)=>t!==s[e]))}showSuggestions(){const{activeSuggestions:t}=this;t.length?this.renderSuggestionsList():this.clear()}renderSuggestionsList(){const{dropdownPlugin:t,activeSuggestions:s,termInfo:e,active:i,listsInfo:n}=this,r=o(e).toLowerCase(),{icon:u,emptyOpen:h}=n.find((t=>t.uuid===i))||{};t&&(r||h)&&(t.show(s,{onSelect:this.onSelect,onClose:this.onClose,append:u,className:u?"Autocomplete__withIcon":""}),t.highlight=r)}hideSuggestionsList(){const{dropdownPlugin:t}=this;t&&t.hide(),this.activeSuggestions=[]}}export{n as default};
