import { ErrorBoundary } from './ErrorBoundary';
import { installCarousels } from './carousel';
import { installIdentity } from './identity';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import { flows, go, type Flow } from './journey';
import { FileViewerHost } from './demo/DemoUI';

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
// Start all three loads together (same order, so stylesheet order is unchanged), then wait for each.
const cssLoad = styles[`./${group}/${flow}/index.css`]();
const appLoad = apps[`./${group}/${flow}/App.tsx`]();
const mobileCss = import('./mobile.css');
await cssLoad;
const { default: App } = await appLoad;
await mobileCss;
document.documentElement.dataset.flow = flow;
document.documentElement.dataset.embed = '';
const chrome = ['project','proposal','booking','classification','session','intervention','feedback'].includes(flow);
createRoot(document.getElementById('root')!).render(<><ErrorBoundary label={flow}><App /></ErrorBoundary><ErrorBoundary label="file-viewer"><FileViewerHost /></ErrorBoundary>{chrome && <div className={`integration-status ${['project','proposal','classification','intervention'].includes(flow)?'light':''}`} aria-hidden="true"><span>9:41</span><i/><img src="/assets/intervention/8b917.svg" alt=""/></div>}{chrome && <div className="integration-home-indicator" aria-hidden="true"/>}</>);
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

// mobile.html 로 직접 들어온 경우(셸 iframe 밖): 셸과 같은 표로 다음 화면으로 이동한다.
window.addEventListener('message',e=>{
  if(e.origin!==location.origin||e.source!==window||e.data?.type!=='plotto:navigate'||window.parent!==window)return;
  const map: Record<number, Flow> = e.data.stage ? { 2: 'intervention', 3: 'proposal', 4: 'booking', 5: 'session' } : { 1: 'project', 2: 'feedback', 3: 'classification' };
  const next = map[e.data.stage || e.data.screen];
  if (next) go(next, 'chat');
});
