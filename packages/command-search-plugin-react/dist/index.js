import{useRef as n,useEffect as r}from"react";import e from"@neuint/command-search-plugin";const a=({term:a,commands:t})=>{const m=n(new e(a.pluginManager));return r((()=>{a.pluginManager.register(m.current)}),[a.pluginManager]),r((()=>{m.current.commands=t}),[t]),null};export{a as default};