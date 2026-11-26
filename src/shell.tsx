import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './shell.css';
import { flows } from './journey';
import { ErrorBoundary } from './ErrorBoundary';

// Full-screen host. The prototype always fills the device it runs on — phone,
// tablet or desktop — at real CSS pixels; each screen lays itself out for the
// width/height it is given (see public/responsive.css).
function App() {
  const frame = useRef<HTMLIFrameElement>(null);
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
      if (e.data?.type === 'plotto:navigate') {
        const map: Record<number, string> = e.data.stage ? { 2: 'intervention', 3: 'proposal', 4: 'booking', 5: 'session' } : { 1: 'project', 2: 'feedback', 3: 'classification' };
        const next = map[e.data.stage || e.data.screen];
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

  return <iframe className="app-frame" ref={frame} title="Plotto" src={initial} allow="microphone; camera; autoplay" />;
}

createRoot(document.getElementById('root')!).render(<ErrorBoundary label="shell"><App /></ErrorBoundary>);
