if(!self.define){let s,e={};const l=(l,n)=>(l=new URL(l+".js",n).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(n,r)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let u={};const o=s=>l(s,i),c={module:{uri:i},exports:u,require:o};e[i]=Promise.all(n.map((s=>c[s]||o(s)))).then((s=>(r(...s),u)))}}define(["./workbox-db5fc017"],(function(s){"use strict";s.setCacheNameDetails({prefix:"admin"}),self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"/css/178.4d3a2dce.css",revision:null},{url:"/css/217.774814c9.css",revision:null},{url:"/css/app.aeebe7ea.css",revision:null},{url:"/css/chunk-vendors.59935f5c.css",revision:null},{url:"/index.html",revision:"53bdd3e23586bccc3cc6f507cf75db92"},{url:"/js/120.b02d1df8.js",revision:null},{url:"/js/178.03723730.js",revision:null},{url:"/js/217.413192be.js",revision:null},{url:"/js/442.d1160df2.js",revision:null},{url:"/js/6.9bb973a2.js",revision:null},{url:"/js/658.267df1c5.js",revision:null},{url:"/js/730.dc1885e4.js",revision:null},{url:"/js/813.85c2e696.js",revision:null},{url:"/js/app.a992c7d3.js",revision:null},{url:"/js/chunk-vendors.20a48937.js",revision:null},{url:"/manifest.json",revision:"ad1c7122216ff6e919bd68f90e80d94d"},{url:"/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map