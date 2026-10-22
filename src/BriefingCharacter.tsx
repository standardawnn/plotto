import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ReferenceCharacter from './ReferenceCharacter';

// A single moving stage keeps the character's position continuous while its pose changes.
export default function BriefingCharacter({view, spread, scale, progress}: {view: 'dial'|'before'|'now'; spread:number; scale:number; progress:number}) {
  const reduced = useReducedMotion();
  const amount = Math.max(0, Math.min(1, spread));
  const pose = view === 'dial' ? 'dial' : view;
  return <div className="absolute inset-0 z-30 pointer-events-none" style={{transform:`scale(${scale})`,transformOrigin:'top left'}}>
    <motion.div className="absolute inset-0" initial={false}
      animate={{y:view === 'dial' ? 230*amount : view === 'now' ? 80 : 0}}
      transition={{duration:reduced ? 0 : view === 'dial' && amount < 1 ? 0 : .65,ease:[.22,1,.36,1]}}>
      <AnimatePresence initial={false}>
        <motion.div key={pose} className="absolute inset-0" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          transition={{duration:reduced ? 0 : .28}}>
          {pose === 'before' ? <ReferenceCharacter kind="typing" scale={1}/> : pose === 'now' ?
            <div className="absolute overflow-hidden" style={{left:201,top:135,width:181,height:118}}>
              <img alt="Plotto" src="/assets/briefing/now-updated.png" className="absolute h-[206.41%] left-[-97.68%] max-w-none top-[-5.48%] w-[202.24%]"/>
            </div> : <>
              <div className="absolute overflow-hidden" style={{left:259,top:125,width:123,height:142,opacity:1-amount}}>
                <img alt="Plotto" src="/assets/briefing/546e2.png" className="absolute h-[110.04%] left-[-33.65%] max-w-none top-[-7.28%] w-[152.11%]"/>
              </div>
              <div className="absolute inset-0" style={{transform:'translateY(-230px)',opacity:amount}}>
                <ReferenceCharacter kind="wand" scale={1} progress={progress}/>
              </div>
            </>}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  </div>;
}
