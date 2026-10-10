/**
 * Inline pre-paint script (Part 13.5, 15.6, 12.4). Runs before first paint so there is no flash of the
 * wrong theme, no flash of site content before the intro overlay, and reveal states are never hidden
 * without JS. Kept as a string so it can be hashed for the CSP at build time.
 */
export const BOOTSTRAP_SCRIPT = `(function(){var d=document.documentElement;try{
d.classList.add('js');
var ls=function(k){try{return localStorage.getItem(k)}catch(e){return null}};
var ss=function(k){try{return sessionStorage.getItem(k)}catch(e){return null}};
var theme=ls('bu:theme');
if(theme!=='light'&&theme!=='dark'){theme=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
d.setAttribute('data-theme',theme);
var mo=ls('bu:motion');
var reduced=mo==='reduce'||(mo!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
if(mo==='full'||mo==='reduce')d.setAttribute('data-motion',mo);
d.classList.add(reduced?'js-reduced':'js-motion');
var qs=new URLSearchParams(location.search).get('intro');
var last=parseInt(ls('bu:intro-last')||'0',10);
var recent=last&&(Date.now()-last)<6048e5;
var mode;
if(qs==='skip')mode='skip';
else if(qs==='force'||qs==='slow'||qs==='debug')mode=reduced?'reduced':'full';
else if(ss('bu:intro-session')==='1')mode='skip';
else if(reduced)mode='reduced';
else if(recent)mode='short';
else mode='full';
d.setAttribute('data-intro',mode);
if(qs)d.setAttribute('data-intro-flag',qs);
if(mode!=='skip')d.classList.add('is-intro');
}catch(e){d.setAttribute('data-intro','skip');d.classList.add('js','js-reduced')}})();`;
