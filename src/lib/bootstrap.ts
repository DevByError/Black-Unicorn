/**
 * Inline pre-paint script (Part 13.5, 15.6, 12.4). Runs before first paint so there is no flash of the
 * wrong theme, no flash of site content before the intro overlay, and reveal states are never hidden
 * without JS. The intro plays in full on every page load (refresh included): nothing is remembered about
 * earlier plays. A reload also starts at the top of the page (no restored scroll position, no #hash). Only ?intro=skip bypasses the intro. Kept as a string so it can be hashed for the CSP at build time.
 */
export const BOOTSTRAP_SCRIPT = `(function(){var d=document.documentElement;try{
d.classList.add('js');
var ls=function(k){try{return localStorage.getItem(k)}catch(e){return null}};
var theme=ls('bu:theme');
if(theme!=='light'&&theme!=='dark'){theme=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
d.setAttribute('data-theme',theme);
var mo=ls('bu:motion');
var reduced=mo==='reduce'||(mo!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
if(mo==='full'||mo==='reduce')d.setAttribute('data-motion',mo);
d.classList.add(reduced?'js-reduced':'js-motion');
var qs=new URLSearchParams(location.search).get('intro');
var nt=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];
var reload=nt?nt.type==='reload':(performance.navigation&&performance.navigation.type===1);
if(reload){
d.setAttribute('data-nav','reload');
try{history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);scrollTo(0,0)}catch(e){}
}
var mode;
if(qs==='skip')mode='skip';
else if(qs==='force'||qs==='slow'||qs==='debug')mode=reduced?'reduced':'full';
else if(reduced)mode='reduced';
else mode='full';
d.setAttribute('data-intro',mode);
if(qs)d.setAttribute('data-intro-flag',qs);
if(mode!=='skip')d.classList.add('is-intro');
}catch(e){d.setAttribute('data-intro','skip');d.classList.add('js','js-reduced')}})();`;
