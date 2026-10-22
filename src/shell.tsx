import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './shell.css';
import { flows } from './journey';
function App() {
 const frame=useRef<HTMLIFrameElement>(null);
 const [route]=useState(()=>{const p=new URLSearchParams(location.hash.slice(1));return (flows as readonly string[]).includes(p.get('flow')||'')?p.toString():'';});
 useEffect(()=>{const message=(e:MessageEvent)=>{if(e.origin!==location.origin||e.source!==frame.current?.contentWindow)return;if(e.data?.type==='plotto:route'&&(flows as readonly string[]).includes(e.data.flow))history.replaceState(null,'',`${location.pathname}${location.search}#${new URLSearchParams({flow:e.data.flow,entry:e.data.entry||''})}`);};addEventListener('message',message);return()=>removeEventListener('message',message);},[]);
 return <main className="app-viewport"><iframe ref={frame} title="Plotto" src={route?`./mobile.html?${route}`:'./onboarding/launch.html'}/></main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
