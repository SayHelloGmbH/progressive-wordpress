this.workbox=this.workbox||{},this.workbox.precaching=function(t,e,s,n,i,c,r,o){"use strict";function a(){return(a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n])}return t}).apply(this,arguments)}try{self["workbox:precaching:6.1.1"]&&_()}catch(t){}function h(t){if(!t)throw new s.WorkboxError("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:e,url:n}=t;if(!n)throw new s.WorkboxError("add-to-cache-list-unexpected-type",{entry:t});if(!e){const t=new URL(n,location.href);return{cacheKey:t.href,url:t.href}}const i=new URL(n,location.href),c=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",e),{cacheKey:i.href,url:c.href}}class l{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:t,state:e})=>{e&&(e.originalRequest=t)},this.cachedResponseWillBeUsed=async({event:t,state:e,cachedResponse:s})=>{if("install"===t.type){const t=e.originalRequest.url;s?this.notUpdatedURLs.push(t):this.updatedURLs.push(t)}return s}}}class u{constructor({precacheController:t}){this.cacheKeyWillBeUsed=async({request:t,params:e})=>{const s=e&&e.cacheKey||this.et.getCacheKeyForURL(t.url);return s?new Request(s):t},this.et=t}}class f extends c.Strategy{constructor(t={}){t.cacheName=e.cacheNames.getPrecacheName(t.cacheName),super(t),this.st=!1!==t.fallbackToNetwork,this.plugins.push(f.copyRedirectedCacheableResponsesPlugin)}async _handle(t,e){const s=await e.cacheMatch(t);return s||(e.event&&"install"===e.event.type?await this.nt(t,e):await this.it(t,e))}async it(t,e){let n;if(!this.st)throw new s.WorkboxError("missing-precache-entry",{cacheName:this.cacheName,url:t.url});return n=await e.fetch(t),n}async nt(t,e){this.ct();const n=await e.fetch(t);if(!await e.cachePut(t,n.clone()))throw new s.WorkboxError("bad-precaching-response",{url:t.url,status:n.status});return n}ct(){let t=null,e=0;for(const[s,n]of this.plugins.entries())n!==f.copyRedirectedCacheableResponsesPlugin&&(n===f.defaultPrecacheCacheabilityPlugin&&(t=s),n.cacheWillUpdate&&e++);0===e?this.plugins.push(f.defaultPrecacheCacheabilityPlugin):e>1&&null!==t&&this.plugins.splice(t,1)}}f.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:t})=>!t||t.status>=400?null:t},f.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await i.copyResponse(t):t};class w{constructor({cacheName:t,plugins:s=[],fallbackToNetwork:n=!0}={}){this.rt=new Map,this.ot=new Map,this.at=new Map,this.ht=new f({cacheName:e.cacheNames.getPrecacheName(t),plugins:[...s,new u({precacheController:this})],fallbackToNetwork:n}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.ht}precache(t){this.addToCacheList(t),this.lt||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.lt=!0)}addToCacheList(t){const e=[];for(const n of t){"string"==typeof n?e.push(n):n&&void 0===n.revision&&e.push(n.url);const{cacheKey:t,url:i}=h(n),c="string"!=typeof n&&n.revision?"reload":"default";if(this.rt.has(i)&&this.rt.get(i)!==t)throw new s.WorkboxError("add-to-cache-list-conflicting-entries",{firstEntry:this.rt.get(i),secondEntry:t});if("string"!=typeof n&&n.integrity){if(this.at.has(t)&&this.at.get(t)!==n.integrity)throw new s.WorkboxError("add-to-cache-list-conflicting-integrities",{url:i});this.at.set(t,n.integrity)}if(this.rt.set(i,t),this.ot.set(i,c),e.length>0){const t=`Workbox is precaching URLs without revision info: ${e.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(t)}}}install(t){return n.waitUntil(t,(async()=>{const e=new l;this.strategy.plugins.push(e);for(const[e,s]of this.rt){const n=this.at.get(s),i=this.ot.get(e),c=new Request(e,{integrity:n,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:c,event:t}))}const{updatedURLs:s,notUpdatedURLs:n}=e;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(t){return n.waitUntil(t,(async()=>{const t=await self.caches.open(this.strategy.cacheName),e=await t.keys(),s=new Set(this.rt.values()),n=[];for(const i of e)s.has(i.url)||(await t.delete(i),n.push(i.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this.rt}getCachedURLs(){return[...this.rt.keys()]}getCacheKeyForURL(t){const e=new URL(t,location.href);return this.rt.get(e.href)}async matchPrecache(t){const e=t instanceof Request?t.url:t,s=this.getCacheKeyForURL(e);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(t){const e=this.getCacheKeyForURL(t);if(!e)throw new s.WorkboxError("non-precached-url",{url:t});return s=>(s.request=new Request(t),s.params=a({cacheKey:e},s.params),this.strategy.handle(s))}}let d;const y=()=>(d||(d=new w),d);class p extends o.Route{constructor(t,e){super((({request:s})=>{const n=t.getURLsToCacheKeys();for(const t of function*(t,{ignoreURLParametersMatching:e=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:i}={}){const c=new URL(t,location.href);c.hash="",yield c.href;const r=function(t,e=[]){for(const s of[...t.searchParams.keys()])e.some((t=>t.test(s)))&&t.searchParams.delete(s);return t}(c,e);if(yield r.href,s&&r.pathname.endsWith("/")){const t=new URL(r.href);t.pathname+=s,yield t.href}if(n){const t=new URL(r.href);t.pathname+=".html",yield t.href}if(i){const t=i({url:c});for(const e of t)yield e.href}}(s.url,e)){const e=n.get(t);if(e)return{cacheKey:e}}}),t.strategy)}}function R(t){const e=y(),s=new p(e,t);r.registerRoute(s)}function U(t){y().precache(t)}return t.PrecacheController=w,t.PrecacheFallbackPlugin=class{constructor({fallbackURL:t,precacheController:e}){this.handlerDidError=()=>this.et.matchPrecache(this.ut),this.ut=t,this.et=e||y()}},t.PrecacheRoute=p,t.PrecacheStrategy=f,t.addPlugins=function(t){y().strategy.plugins.push(...t)},t.addRoute=R,t.cleanupOutdatedCaches=function(){self.addEventListener("activate",(t=>{const s=e.cacheNames.getPrecacheName();t.waitUntil((async(t,e="-precache-")=>{const s=(await self.caches.keys()).filter((s=>s.includes(e)&&s.includes(self.registration.scope)&&s!==t));return await Promise.all(s.map((t=>self.caches.delete(t)))),s})(s).then((t=>{})))}))},t.createHandlerBoundToURL=function(t){return y().createHandlerBoundToURL(t)},t.getCacheKeyForURL=function(t){return y().getCacheKeyForURL(t)},t.matchPrecache=function(t){return y().matchPrecache(t)},t.precache=U,t.precacheAndRoute=function(t,e){U(t),R(e)},t}({},workbox.core._private,workbox.core._private,workbox.core._private,workbox.core,workbox.strategies,workbox.routing,workbox.routing);
//# sourceMappingURL=workbox-precaching.prod.js.map