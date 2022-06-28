import{TemplateEngine as e,Plugin as t}from"@neuint/term-js";import{isString as i,noop as o}from"lodash-es";const n=e=>{let{size:t}=n;if(t)return t;const i=e||document.body,o=document.createElement("div"),s=document.createElement("div");return o.style.width="100px",o.style.height="100px",o.style.overflow="scroll",s.style.height="100px",i.appendChild(o),o.appendChild(s),t=o.offsetWidth-s.offsetWidth,i.removeChild(o),n.size=t,t},s=e=>null==e?void 0:e.stopPropagation();class r extends e{constructor(e){super('<div ref="root" class="ContextMenuView"></div>\n',e),this.reRender=!1}render(){super.render({},this.reRender?{replace:this}:{}),this.reRender=!0}}const d="end of line",l="context-menu-plugin-close";class h extends t{constructor(){super(...arguments),this.name="context-menu",this.isVisible=!1,this.escHide=!1,this.aroundClickHide=!1,this.escHandler=()=>{this.escHide&&this.hide()},this.rootClickHandler=()=>{this.aroundClickHide&&this.hide()}}show(e,t,i={}){this.hide();const{position:o,escHide:n=!1,aroundClickHide:s=!1,onHide:r}=i;("position"!==t||o)&&(this.target=t,this.escHide=n,this.onHide=r,this.aroundClickHide=s,this.render(e),this.updatePosition())}hide(){const{contextMenuView:e,onHide:t}=this;if(e){const i=e.getRef("root");i&&i.removeEventListener("click",s),e.destroy(),delete this.contextMenuView,t&&t()}}setTermInfo(e,t){super.setTermInfo(e,t);const{root:i}=e.elements;null==i||i.addEventListener("click",this.rootClickHandler),t.addShortcut(l,{code:27}),t.addListener(l,this.escHandler),this.updatePosition()}updateTermInfo(e){super.updateTermInfo(e),this.updatePosition()}destroy(){const{keyboardShortcutsManager:e,termInfo:t}=this,i=null==t?void 0:t.elements.root;e&&(e.removeListener(this.escHandler),e.removeShortcut(l)),i&&i.removeEventListener("click",this.rootClickHandler),super.destroy()}clear(){this.hide()}render(e){var t,o;const{termInfo:n,target:d}=this,l="end of line"===d?null===(t=null==n?void 0:n.elements)||void 0===t?void 0:t.edit:null===(o=null==n?void 0:n.elements)||void 0===o?void 0:o.root;if(!l)return;const h=new r(l);h.render();const c=h.getRef("root");c&&(c.addEventListener("click",s),this.contextMenuView=h,this.isVisible=!1,i(e)?c.innerHTML=e:c.appendChild(e))}updatePosition(){const{target:e,isVisible:t}=this;({"end of line":()=>this.updateEndOfLinePosition(),position:()=>this.updateFixedPosition()}[e||""]||o)(),t||this.setVisible()}updateEndOfLinePosition(){const{termInfo:e,contextMenuView:t}=this;if(!e||!t)return;const{size:{height:i}}=e.caret,{endOffset:{left:o,top:n}}=e.edit,s=t.getRef("root");if(!s)return;const r=n+i;s.style.left=`${o}px`,s.style.top=`${r}px`,this.normalizedPosition(o,r)}updateFixedPosition(){const{position:e,contextMenuView:t}=this;if(!e||!t)return;const i=t.getRef("root");i&&(i.style.left=`${e.left}px`,i.style.top=`${e.top}px`,this.normalizedPosition(e.left,e.top))}setVisible(){const{contextMenuView:e}=this;if(!e)return;const t=e.getRef("root");t&&(t.style.visibility="visible",this.isVisible=!0)}normalizedPosition(e,t){var i,o;const{contextMenuView:s,target:r,termInfo:d}=this,l=null===(o=null===(i=this.termInfo)||void 0===i?void 0:i.elements)||void 0===o?void 0:o.root;if(!s||!l)return;const h=s.getRef("root");if(!h)return;const{right:c,bottom:u}=((e,t)=>{const i=n(t),o=e.getBoundingClientRect(),s=t.getBoundingClientRect(),r=o.left-s.left,d=o.top-s.top,l=s.width-i;return{left:r,top:d,bottom:s.height-i-d-o.height,right:l-r-o.width,width:o.width,height:o.height}})(h,l);if(c<0&&(h.style.left=`${e+c}px`),u<0){const e=t-h.offsetHeight-("end of line"===r&&(null==d?void 0:d.caret.size.height)||0);h.style.top=`${e}px`}}}export{l as CLOSE_ACTION,d as END_OF_LINE_TYPE,h as default};