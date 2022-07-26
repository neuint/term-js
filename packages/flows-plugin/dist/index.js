import{Plugin as t}from"@neuint/term-js";import{isArray as s,noop as i,get as e}from"lodash-es";const n=t=>{if("string"==typeof t)return{value:{str:t}};if(void 0!==(null==t?void 0:t.str))return{value:t};if(void 0!==(null==t?void 0:t.value)){const{value:s,withSubmit:i}=t;return{withSubmit:i,value:"string"==typeof s?{str:s}:s}}},r=(t,i)=>{const e=(t=>{if(void 0===(null==t?void 0:t.data))return[n(t)];const{duration:i,data:e}=t,r=s(e)?e.map(n):[n(e)],o=i?r.reduce(((t,s)=>t+s.value.str.length),0):0,h=i&&o?i/o:0;return r.map((t=>Object.assign(Object.assign({},t),{duration:i?t.value.str.length*h:void 0})))})(i);return new Promise((s=>{const i=()=>{const n=e.shift();if(!n)return void s(void 0);const r=t.write(n.value,{duration:n.duration,withSubmit:n.withSubmit});r instanceof Promise?r.then(i):i()};i()}))};class o extends t{constructor(){super(...arguments),this.flowsField={},this.step=0,this.branchData={},this.isWaiting=!1,this.clear=i,this.onKeyboardShortcut=()=>{var t,s;const{branch:i,step:e}=this;i&&(null===(s=null===(t=i[e])||void 0===t?void 0:t.onExit)||void 0===s||s.call(t,this.branchData),this.branch=void 0,this.step=0,this.branchData={}),this.termInfo.edit.write("",{withSubmit:!0})},this.onSubmit=t=>{let{branch:s,flows:i,branchData:e,isWaiting:n}=this;if(n)return;let r=t.typedValue||"";if(s){const{handler:t=(()=>Promise.resolve()),variableName:i}=s[this.step];i&&(e[i]=r);const n=t(e);return n&&(this.isWaiting=!0),void(n||Promise.resolve(void 0)).then(this.onStepResult)}r=r.trim(),s=i[r],s&&(this.step=0,this.branch=s,this.branchData={},this.showStep())},this.onStepResult=t=>{const{to:s,write:i}=t||{};if(s){const[t,i]=s.split("|");this.step=parseInt(t,10),this.branch=i?this.flows[i]:this.branch}else this.step+=1;const e=i?r(this.termInfo,i):void 0;(e instanceof Promise?e:Promise.resolve(!0)).then((()=>{this.showStep()}))},this.showStep=()=>{const{branch:t,step:s}=this;if(this.isWaiting=!1,t.length-1<s)return this.branch=void 0,this.step=0,void(this.branchData={});const{write:i,onEnter:e,before:n,onWrite:o,secret:h=!1}=t[s];if(n){const t=n(this.branchData);if(t)return r(this.termInfo,t),this.branch=void 0,this.step=0,void(this.branchData={})}const a=i&&"function"==typeof i?i(this.branchData):i,c=a?r(this.termInfo,a):void 0;if((c instanceof Promise?c:Promise.resolve(!0)).then((()=>{if(this.termInfo.secret(h),o){const t=o(this.branchData);t&&t.then(this.onStepResult)}})),!e)return;const u=e(this.branchData);u&&(r(this.termInfo,u),this.branch=void 0,this.step=0,this.branchData={})}}get flows(){return this.flowsField}set flows(t){this.flowsField=t,this.runAutoStartBranch()}setTermInfo(t,s){super.setTermInfo(t,s),this.termInfo.addEventListener("submit",this.onSubmit),this.runAutoStartBranch(),s.addShortcut("flows",{code:67,ctrl:!0}),s.addListener("flows",this.onKeyboardShortcut)}runAutoStartBranch(){const{flows:t,termInfo:s,branch:i}=this;if(!s||i)return;const n=Object.keys(t).find((s=>e(t[s],"0.autostart")));n&&(this.step=0,this.branch=t[n],this.branchData={},this.showStep())}}export{o as default};
