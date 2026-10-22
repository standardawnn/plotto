import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './shell.css';
import { flows } from './journey';

const W = 402, H = W * 19.5 / 9, BEZEL = 11;
type Mode = 'device' | 'full';
function App() {
  const host = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [mode, setMode] = useState<Mode>(() => new URLSearchParams(location.search).get('mode') === 'full' || localStorage.getItem('plotto-view') === 'full' ? 'full' : 'device');
  const [viewport, setViewport] = useState({ width: innerWidth, height: innerHeight });
  const [initialRoute] = useState(() => {
    const params = new URLSearchParams(location.hash.slice(1));
    const flow = params.get('flow');
    return (flows as readonly string[]).includes(flow || '') ? params.toString() : ''; 
  });
  const phone = viewport.width <= 600 || matchMedia('(pointer: coarse) and (max-width: 820px)').matches;
  const device = !phone && mode === 'device';
  const scale = Math.max(.1, device
    ? Math.min(1, (viewport.width - 64) / (W + BEZEL * 2), (viewport.height - 110) / (H + BEZEL * 2))
    : Math.min(viewport.width / W, viewport.height / H));
  const logicalHeight = phone ? Math.max(H, viewport.height / scale) : H;
  const b = device ? BEZEL : 0;

  useEffect(() => {
    const resize = () => {
      const style = host.current ? getComputedStyle(host.current) : null;
      const safeHeight = (parseFloat(style?.paddingTop || '0') || 0) + (parseFloat(style?.paddingBottom || '0') || 0);
      setViewport({ width: innerWidth, height: innerHeight - safeHeight });
    };
    resize();
    const message = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'plotto:toggle') setMode(m => m === 'device' ? 'full' : 'device');
      if (event.data?.type === 'plotto:route' && (flows as readonly string[]).includes(event.data.flow)) {
        history.replaceState(null, '', `${location.pathname}${location.search}#${new URLSearchParams({flow:event.data.flow,entry:event.data.entry || ''})}`);
      }
    };
    const key = (event: KeyboardEvent) => { if (event.key.toLowerCase() === 'f') setMode(m => m === 'device' ? 'full' : 'device'); };
    addEventListener('resize', resize); addEventListener('message', message); addEventListener('keydown', key);
    return () => { removeEventListener('resize', resize); removeEventListener('message', message); removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { localStorage.setItem('plotto-view', mode); }, [mode]);

  return <main ref={host} className={`presenter ${device ? 'with-device' : 'without-device'} ${phone ? 'on-phone' : ''}`}>
    {!phone && <div className="view-toggle" role="group" aria-label="보기 모드">
      <button aria-pressed={mode === 'device'} onClick={() => setMode('device')}>디바이스</button>
      <button aria-pressed={mode === 'full'} onClick={() => setMode('full')}>전체 화면</button>
    </div>}
    <div className="phone-slot" style={{ width: (W+2*b)*scale, height:(logicalHeight+2*b)*scale }}>
      <div className="phone-body" style={{width:W+2*b,height:logicalHeight+2*b,transform:`scale(${scale})`,padding:b}}>
        <span className="side-button action"/><span className="side-button volume-up"/><span className="side-button volume-down"/><span className="side-button power"/>
        <div className="phone-screen" style={{width:W,height:logicalHeight}}>
          <iframe ref={frame} title="Plotto 프로토타입" src={initialRoute ? `./mobile.html?${initialRoute}` : "./onboarding/launch.html"} />
          <span className="island" aria-hidden="true"/>
        </div>
      </div>
    </div>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App />);
