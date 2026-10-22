import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './shell.css';
import { flows } from './journey';
function App() {
 const frame=useRef<HTMLIFrameElement>(null);
 const [viewport,setViewport]=useState({width:innerWidth,height:innerHeight});
 useEffect(()=>{const resize=()=>setViewport({width:innerWidth,height:innerHeight});addEventListener('resize',resize);return()=>removeEventListener('resize',resize);},[]);
 const scale=viewport.width<=600?viewport.width/402:Math.min(viewport.width/402,viewport.height/874);
 const logicalHeight=Math.max(600,viewport.height/scale);
 const [route]=useState(()=>{const p=new URLSearchParams(location.hash.slice(1));return (flows as readonly string[]).includes(p.get('flow')||'')?p.toString():'';});
 useEffect(()=>{const message=(e:MessageEvent)=>{if(e.origin!==location.origin||e.source!==frame.current?.contentWindow)return;if(e.data?.type==='plotto:navigate'){const map=e.data.stage?{2:'intervention',3:'proposal',4:'booking',5:'session'}:{1:'project',2:'feedback',3:'classification'};const next=map[(e.data.stage||e.data.screen) as keyof typeof map];if(next&&frame.current)frame.current.src=`./mobile.html?flow=${next}&entry=chat`;return;}if(e.data?.type==='plotto:route'&&(flows as readonly string[]).includes(e.data.flow))history.replaceState(null,'',`${location.pathname}${location.search}#${new URLSearchParams({flow:e.data.flow,entry:e.data.entry||''})}`);};addEventListener('message',message);return()=>removeEventListener('message',message);},[]);
 return <main className="app-viewport"><div className="design-canvas" style={{width:402*scale,height:logicalHeight*scale}}><iframe style={{width:402,height:logicalHeight,transform:`scale(${scale})`}} ref={frame} title="Plotto" src={route?`./mobile.html?${route}`:'./onboarding/launch.html'}/></div></main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
