if(!self.define){let s,e={};const l=(l,n)=>(l=new URL(l+".js",n).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(n,r)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let u={};const o=s=>l(s,i),c={module:{uri:i},exports:u,require:o};e[i]=Promise.all(n.map((s=>c[s]||o(s)))).then((s=>(r(...s),u)))}}define(["./workbox-db5fc017"],(function(s){"use strict";s.setCacheNameDetails({prefix:"admin"}),self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"/css/360.774814c9.css",revision:null},{url:"/css/919.d04d8d27.css",revision:null},{url:"/css/app.0e70b062.css",revision:null},{url:"/css/chunk-vendors.59935f5c.css",revision:null},{url:"/index.html",revision:"34d4dadf0d740807ad6240607c3ee496"},{url:"/js/212.1e05faef.js",revision:null},{url:"/js/360.f9e581f9.js",revision:null},{url:"/js/6.b8f00a68.js",revision:null},{url:"/js/658.267df1c5.js",revision:null},{url:"/js/829.bb77a001.js",revision:null},{url:"/js/897.08f502de.js",revision:null},{url:"/js/919.d19c2f3c.js",revision:null},{url:"/js/975.500e93f5.js",revision:null},{url:"/js/app.81ee8bdf.js",revision:null},{url:"/js/chunk-vendors.20a48937.js",revision:null},{url:"/manifest.json",revision:"ad1c7122216ff6e919bd68f90e80d94d"},{url:"/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
