import{TemplateEngine as t,Plugin as e}from"@neuint/term-js";import{noop as s}from"lodash-es";class i extends t{constructor(t){super('<div class="StatusView">\n  <div class="StatusView__icon">{icon}</div>\n  <div class="StatusView__text">{text}</div>\n</div>\n',t),this.iconField="",this.textField="",this.isRendered=!1}set icon(t){this.iconField=t,this.render()}get icon(){return this.iconField}set text(t){this.textField=t,this.render()}get text(){return this.textField}render(){const{icon:t,text:e,isRendered:s}=this;super.render({icon:t,text:e},s?{replace:this}:{}),this.isRendered=!0}}class n extends e{constructor(){super(...arguments),this.name="status-bar-plugin",this.text="",this.icon="",this.clear=s}set status(t){const{view:e}=this;this.text=t.text,this.icon=t.icon||"",e&&(e.icon=this.icon,e.text=this.text)}get status(){const{text:t,icon:e}=this;return{text:t,icon:e}}setTermInfo(t,e){super.setTermInfo(t,e),this.setView()}updateTermInfo(t){super.updateTermInfo(t),this.setView()}destroy(){const{view:t}=this;t&&t.destroy(),super.destroy()}setView(){const{termInfo:t,text:e,icon:s,view:n}=this;if(!t)return;const{root:r}=t.elements;r&&!n&&(this.view=new i(r),this.view.text=e,this.view.icon=s,this.view.render())}}export{n as default};
