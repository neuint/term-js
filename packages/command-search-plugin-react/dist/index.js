import{useRef as n,useEffect as r}from"react";import e from"@neuint/command-search-plugin";const t=({term:t,commands:a})=>{const u=n(new e(t.pluginManager));return r((()=>{const{current:n}=u;return t.pluginManager.register(n),()=>{t.pluginManager.unregister(n)}}),[t.pluginManager]),r((()=>{u.current.commands=a}),[a]),null};export{t as default};
