import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './shell.css';
import { flows } from './journey';
import { markCrossNavigation } from './navHistory';
import { ErrorBoundary } from './ErrorBoundary';

// Full-screen host. The prototype always fills the device it runs on — phone,
// tablet or desktop — at real CSS pixels; each screen lays itself out for the
// width/height it is given (see public/responsive.css).
function App() {
  const frame = useRef<HTMLIFrameElement>(null);
  // ?kbdebug=1 shows the keyboard numbers on screen (diagnostics for the chat composer)
  const debug = /[?&#]kbdebug/.test(location.search + location.hash);
  const [dbg, setDbg] = useState('');
  const [dbgFrame, setDbgFrame] = useState('');
  const [initial] = useState(() => {
    // 카카오(Supabase) 로그인에서 돌아온 경우: 결과(?code= / ?error=)를 온보딩 화면에 그대로 넘긴다.
    // 넘기지 않으면 결과가 사라지고 온보딩 첫 화면부터 다시 시작된다. 주소창에서는 결과를 지운다.
    const q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.slice(1));
    if (q.has('code') || q.has('error') || h.has('error')) {
      const src = `./onboarding/launch.html${location.search}${location.hash}`;
      history.replaceState(null, '', location.pathname);
      return src;
    }
    return (flows as readonly string[]).includes(h.get('flow') || '') ? `./mobile.html?${h}` : './onboarding/launch.html';
  });

  useEffect(() => {
    const message = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === 'plotto:kbdebug') { setDbgFrame(`screen: own=${e.data.own} fromShell=${e.data.fromShell}`); return; }
      if (e.data?.type === 'plotto:navigate') {
        const map: Record<number, string> = e.data.stage ? { 2: 'intervention', 3: 'proposal', 4: 'booking', 5: 'session' } : { 1: 'project', 2: 'feedback', 3: 'classification' };
        const next = map[e.data.stage || e.data.screen];
        if (next && frame.current) markCrossNavigation();
        if (next && frame.current) frame.current.src = `./mobile.html?flow=${next}&entry=chat`;
        return;
      }
      if (e.data?.type === 'plotto:route' && (flows as readonly string[]).includes(e.data.flow)) {
        history.replaceState(null, '', `${location.pathname}${location.search}#${new URLSearchParams({ flow: e.data.flow, entry: e.data.entry || '' })}`);
      }
    };
    addEventListener('message', message);
    return () => removeEventListener('message', message);
  }, []);

  // iOS Safari does not report the on-screen keyboard to a page inside an iframe, so the chat composer could stay
  // hidden behind it. Measure the keyboard here, on the top-level page, and tell the screen how tall it is.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    let last = -1;
    const send = () => {
      const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      if (debug) setDbg(`shell: innerH=${Math.round(window.innerHeight)} vvH=${Math.round(vv.height)} vvTop=${Math.round(vv.offsetTop)} inset=${inset}`);
      if (inset === last) return;
      last = inset;
      frame.current?.contentWindow?.postMessage({ type: 'plotto:kb', inset }, location.origin);
    };
    vv.addEventListener('resize', send);
    vv.addEventListener('scroll', send);
    return () => { vv.removeEventListener('resize', send); vv.removeEventListener('scroll', send); };
  }, []);

  return (
    <>
      <iframe className="app-frame" ref={frame} title="Plotto" src={initial} allow="microphone; camera; autoplay" />
      {debug && <div style={{ position: 'fixed', top: 54, left: 8, right: 8, zIndex: 99999, background: '#000c', color: '#9f9', font: '11px/1.4 monospace', padding: 6, pointerEvents: 'none', whiteSpace: 'pre-wrap' }}>{dbg || 'shell: waiting for keyboard'}{'\n'}{dbgFrame || 'screen: no message yet'}</div>}
    </>
  );
}

createRoot(document.getElementById('root')!).render(<ErrorBoundary label="shell"><App /></ErrorBoundary>);
