import { installCarousels } from './carousel';
import { installIdentity } from './identity';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import { flows } from './journey';

const query = new URLSearchParams(location.search);
let flow = (flows as readonly string[]).includes(query.get('flow') || '') ? query.get('flow')! : 'briefing';
const baseline = import.meta.env.DEV && query.has('baseline');
if (!baseline) {
  if(flow === 'intervention' && query.get('entry') === 'project') flow = 'project';
  else if(flow === 'intervention' && query.get('entry') === 'booking') flow = 'booking';
  else if(flow === 'intervention' && query.get('entry') === 'session') flow = 'proposal';
  else if(flow === 'opinion') flow = 'feedback';
}
// Each original stylesheet has its own document. Viewport units, fixed elements,
// keyframe names and Tailwind resets cannot leak into another Make project.
const apps = { ...import.meta.glob<{ default: ComponentType }>('./modules/*/App.tsx'), ...(import.meta.env.DEV ? import.meta.glob<{ default: ComponentType }>('./baseline/*/App.tsx') : {}) };
const styles = { ...import.meta.glob('./modules/*/index.css'), ...(import.meta.env.DEV ? import.meta.glob('./baseline/*/index.css') : {}) };
const group = baseline ? 'baseline' : 'modules';
async function boot() {
await styles[`./${group}/${flow}/index.css`]();
const { default: App } = await apps[`./${group}/${flow}/App.tsx`]();
await import('./mobile.css');
document.documentElement.dataset.flow = flow;
document.documentElement.dataset.embed = '';
const chrome = ['project','proposal','booking','classification','session','intervention','feedback'].includes(flow);
createRoot(document.getElementById('root')!).render(<><App />{chrome && <div className={`integration-status ${['project','proposal','classification','intervention'].includes(flow)?'light':''}`} aria-hidden="true"><span>9:41</span><i/><img src="/assets/intervention/8b917.svg" alt=""/></div>}{chrome && <div className="integration-home-indicator" aria-hidden="true"/>}</>);
if (window.parent !== window) window.parent.postMessage({ type: 'plotto:route', flow, entry: query.get('entry') || '' }, location.origin);
}
installIdentity();
installCarousels();
void boot();
window.addEventListener('keydown', event => {
  if (event.key.toLowerCase() === 'f' && !(event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable=true]'))) {
    window.parent.postMessage({ type: 'plotto:toggle' }, location.origin);
  }
});

window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==window||e.data?.type!=='plotto:navigate')return;});
