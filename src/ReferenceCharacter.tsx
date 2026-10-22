import { useEffect, useRef } from 'react';
import { mountTyping, mountWand } from './referenceMotion.js';
export default function ReferenceCharacter({kind, scale, progress = 0}: {kind: 'typing' | 'wand'; scale: number; progress?: number}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef(progress); current.current = progress;
  useEffect(() => {
    let cancelled = false, dispose: (() => void) | undefined;
    const init = kind === 'typing' ? mountTyping(canvas.current!) : mountWand(canvas.current!, () => current.current);
    init.then(stop => { if(cancelled) stop(); else dispose=stop; }).catch(console.error);
    return () => {cancelled=true;dispose?.();};
  }, [kind]);
  return <div className="absolute inset-0 pointer-events-none z-30" style={{transform:`scale(${scale})`,transformOrigin:'top left'}}>
    <canvas key={kind} ref={canvas} role="img" aria-label={kind === 'typing' ? '노트북을 타이핑하는 Plotto' : '카드 이동을 따라 마법봉을 움직이는 Plotto'} style={{position:'absolute', ...(kind === 'wand' ? {left:222,top:346,width:180,height:200} : {})}} />
  </div>;
}
