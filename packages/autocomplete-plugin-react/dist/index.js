import{useRef as r,useEffect as t}from"react";import n from"@neuint/autocomplete-plugin";const e=e=>{const{data:a,term:u}=e,o=r(new n(u.pluginManager)),c=r([]);return t((()=>{const{current:r}=o;return u.pluginManager.register(r),()=>{u.pluginManager.unregister(r)}}),[u.pluginManager]),t((()=>{const{current:r}=o;c.current.forEach((r=>r()));const t=[];(Array.isArray(a)?a:[a]).forEach((({items:n,actionShortcut:e,icon:a})=>{t.push(r.addList(n,e,a))})),c.current=t}),[a]),null};export{e as default};
