import{TemplateEngine as t,Plugin as e}from"@neuint/term-js";import i,{CLOSE_ACTION as s,END_OF_LINE_TYPE as n}from"@neuint/context-menu-plugin";class o extends t{constructor(t,e){super('<li ref="root" class="Item {active}">\n  <span class="Item__matchText">{match}</span><span class="Item__text">{suggestion}</span>\n</li>\n',t),this.isActive=!1,this.isRendered=!1,this.clickHandler=()=>{const{text:t,onClick:e}=this;e&&e(t,this)},this.hoverHandler=()=>{const{text:t,onHover:e}=this;e&&e(t,this)};const{value:i,text:s,index:n,onHover:o,onClick:r}=e;this.text=s,this.index=n,this.match=i,this.onHover=o,this.onClick=r,this.suggestion=s.replace(i,"")}get active(){return this.isActive}set active(t){const e=this.getRef("root");t!==this.isActive&&e&&(t?e.classList.add("Item__active"):e.classList.remove("Item__active")),this.isActive=t}render(){const{match:t,suggestion:e,isActive:i,isRendered:s}=this;this.removeListeners(),super.render({match:t,suggestion:e,active:i?"Item__active":""},s?{replace:this}:{}),this.addListeners(),this.isRendered=!0}destroy(){this.removeListeners(),super.destroy()}addListeners(){const t=this.getRef("root");t&&(t.addEventListener("click",this.clickHandler),t.addEventListener("mousemove",this.hoverHandler))}removeListeners(){const t=this.getRef("root");t&&(t.removeEventListener("click",this.clickHandler),t.removeEventListener("mousemove",this.hoverHandler))}}class r extends t{constructor(t,e){super('<ul ref="root" class="List"></ul>\n',t),this.reRender=!1,this.listItems=[],this.itemsField=[],this.valueField="",this.indexField=0,this.onItemHover=(t,e)=>{const{listItems:i}=this;i.forEach(((t,i)=>{t===e?(this.indexField=i,t.active=!0):t.active=!1}))},this.onItemClick=(t,e)=>{const{onSelect:i}=this;i&&i(t,e.index)},this.onSelect=e,this.render()}get items(){return this.itemsField}set items(t){this.itemsField=t,this.render()}get value(){return this.valueField}set value(t){this.valueField!==t&&(this.valueField=t,this.render())}get index(){return this.indexField}set index(t){const e=Math.max(0,t);this.indexField!==e&&(this.indexField=e,this.render())}render(){super.render({},this.reRender?{replace:this}:{}),this.renderItems(),this.reRender=!0}renderItems(){const t=this.getRef("root"),{itemsField:e,valueField:i,indexField:s}=this,n=[];let r=!1;t&&(this.destroyItems(),e.forEach(((e,h)=>{if(!i||e.includes(i)){const c=s===h;r=r||c;const d=new o(t,{index:h,value:i,text:e,onHover:this.onItemHover,onClick:this.onItemClick});d.render(),d.active=c,n.push(d)}})),this.listItems=n,r||(this.indexField=0,n[0]&&(n[0].active=!0)))}destroyItems(){this.listItems.forEach((t=>t.destroy())),this.listItems=[]}}const h="dropdown-plugin-next",c="dropdown-plugin-down",d="dropdown-plugin-up",l="dropdown-plugin-submit";class a extends e{constructor(t){super(t),this.name="dropdown",this.isActionsLock=!1,this.itemsList=[],this.highlightField="",this.isActive=!1,this.onNext=(t,e)=>{const{isActive:i,list:s,isActionsLock:n}=this;if(i&&s&&!n){e.stopPropagation(),e.preventDefault();const t=s.index+1;s.index=t>=s.items.length?0:t}},this.onDown=(t,e)=>{const{isActive:i,list:s,isActionsLock:n}=this;i&&s&&!n&&(e.stopPropagation(),e.preventDefault(),s.index=Math.min(s.index+1,s.items.length-1))},this.onUp=(t,e)=>{const{isActive:i,list:s,isActionsLock:n}=this;i&&s&&!n&&(e.stopPropagation(),e.preventDefault(),s.index=Math.max(s.index-1,0))},this.onSubmit=(t,e)=>{const{onSelect:i,isActive:s,list:n}=this;s&&n&&(e.stopPropagation(),e.preventDefault(),i&&i(n.items[n.index],n.index)),this.clear()},this.selectHandler=(t,e)=>{const{onSelect:i}=this;this.hide(),i&&i(t,e)},this.hideContextMenuHandler=()=>{const{isActive:t}=this;t&&this.clear()},this.container=document.createElement("div")}get items(){return this.itemsList}set items(t){const{itemsList:e,append:i,container:s}=this;(e.length!==t.length||e.some(((e,i)=>e!==t[i])))&&(this.itemsList=t,this.renderList({append:i,className:s.className}))}get highlight(){return this.highlightField}set highlight(t){const{append:e,container:i}=this;t!==this.highlightField&&(this.highlightField=t,this.renderList({append:e,className:i.className}))}setTermInfo(t,e){super.setTermInfo(t,e),this.registerShortcut(),this.setContextMenuPlugin()}updateTermInfo(t){super.updateTermInfo(t)}clear(){this.hideList(),delete this.onSelect,delete this.onClose}destroy(){this.clear(),this.unregisterShortcut(),super.destroy()}show(t=[],e={}){t&&(this.itemsList=t);const{itemsList:i}=this,{onSelect:s,onClose:n}=e;i.length?(this.onSelect=s,this.onClose=n,this.isActive=!0,this.renderList(e)):(this.clear(),n&&n())}hide(){this.clear()}unregisterShortcut(){const{keyboardShortcutsManager:t}=this;t&&(t.removeShortcut(h),t.removeShortcut(c),t.removeShortcut(d),t.removeShortcut(l))}registerShortcut(){const{keyboardShortcutsManager:t}=this;t&&(t.addShortcut(h,{code:9}),t.addShortcut(c,{code:40}),t.addShortcut(d,{code:38}),t.addShortcut(l,{code:13}),t.addListener(h,this.onNext),t.addListener(c,this.onDown),t.addListener(d,this.onUp),t.addListener(l,this.onSubmit))}setContextMenuPlugin(){const{termInfo:t}=this;if(!t)return;const e=this.pluginManager.getPlugin(i);e?this.contextMenuPlugin=e:(this.contextMenuPlugin=new i,this.pluginManager.register(this.contextMenuPlugin))}renderList(t){const{contextMenuPlugin:e,container:i,itemsList:o,keyboardShortcutsManager:a,unlockCallback:u,highlightField:m}=this,{className:p="",append:g}=t;if(!e||!a)return;i.className=p,this.list||(this.list=new r(i,this.selectHandler)),this.renderAppend(g),u||(this.unlockCallback=a.lock([h,c,d,l,s]));const v=this.list;v.items=o,v.value=m.trim(),this.isActive=!1,e.show(i,n,{escHide:!0,aroundClickHide:!0,onHide:this.hideContextMenuHandler}),this.isActive=!0}renderAppend(t){const{container:e}=this;if(this.clearAppend(),t)if("string"==typeof t){const i=document.createElement("div");i.innerHTML=t.replace(/^[\n\t\s]+/,"");const s=i.firstChild;if(!s)return;e.appendChild(s),this.append=s}else e.appendChild(t),this.append=t}clearAppend(){const{container:t,append:e}=this;e&&t.removeChild(e),delete this.append}hideList(){const{list:t,unlockCallback:e,contextMenuPlugin:i,onClose:s}=this;this.clearAppend(),this.isActive=!1,e&&(e(),delete this.unlockCallback),t&&(t.destroy(),delete this.list),null==i||i.hide(),s&&s()}}export{a as default};
