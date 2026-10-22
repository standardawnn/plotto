import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { StatusBarIPhone17Pro } from '../intervention/screens/SessionEnteredScreen';
import { feedback, readRevision, saveRevision, type RevisionState } from './revisionData';
import './revision.css';

const A='/assets/revision/';
const EASE=[.22,1,.36,1] as const;
function Asset({name}:{name:string}) {return <img src={`${A}${name}.svg`} alt="" draggable={false}/>;}
function SourceIcon({kind}:{kind:string}) {
  return <span className="revision-file-icon">{kind==='pdf'? <Asset name="pdf"/> : <>
    <span className="revision-doc-body"><Asset name="doc-body"/></span>
    <span className="revision-doc-fold"><Asset name="doc-fold"/></span><span className="revision-doc-label">DOCX</span>
  </>}</span>;
}

export default function DocumentReview({s,onBack,onSave}:{s:number;onBack:()=>void;onSave:()=>void}) {
  const reduced=useReducedMotion();
  const duration=reduced?0:.32;
  const [state,setState]=useState<RevisionState>(readRevision);
  const stateRef=useRef(state); stateRef.current=state;
  const [active,setActive]=useState(0);
  const [expanded,setExpanded]=useState<number|null>(null);
  const expandedRef=useRef(expanded); expandedRef.current=expanded;
  const [filtered,setFiltered]=useState(false);
  const [applying,setApplying]=useState<number|null>(null);
  const [illuminated,setIlluminated]=useState<number|null>(null);
  const [confirm,setConfirm]=useState(false);
  const [error,setError]=useState('');
  const scroller=useRef<HTMLDivElement>(null);
  const content=useRef<HTMLDivElement>(null);
  const passages=useRef<(HTMLDivElement|null)[]>([]);
  const dialog=useRef<HTMLDialogElement>(null);
  const finishButton=useRef<HTMLButtonElement>(null);
  const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
  const navigationTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const collapseTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const scrollLock=useRef(0);
  const anchor=useRef<{index:number;offset:number;until:number}|null>(null);
  const later=(callback:()=>void,ms:number)=>{timers.current.push(setTimeout(callback,ms));};
  useEffect(()=>()=>{timers.current.forEach(clearTimeout);clearTimeout(navigationTimer.current);clearTimeout(collapseTimer.current);},[]);
  const persist=(next:RevisionState)=>{
    stateRef.current=next;setState(next);
    try {saveRevision(next);setError('');return true;}
    catch {setError('변경 내용을 저장하지 못했어요. 다시 시도해 주세요.');return false;}
  };
  const keepAnchor=(index:number)=>{
    const el=passages.current[index],box=scroller.current;
    if(!el||!box)return;
    anchor.current={index,offset:(el.getBoundingClientRect().top-box.getBoundingClientRect().top)/s,until:performance.now()+450};
    scrollLock.current=performance.now()+550;
  };
  const restoreAnchor=()=>{
    const a=anchor.current,box=scroller.current;
    if(!a||!box||performance.now()>a.until)return;
    const el=passages.current[a.index];
    if(el)box.scrollTop+=(el.getBoundingClientRect().top-box.getBoundingClientRect().top)/s-a.offset;
  };
  useLayoutEffect(()=>{restoreAnchor();},[filtered,expanded,state.applied]);
  useEffect(()=>{
    const observer=new ResizeObserver(restoreAnchor);
    if(content.current)observer.observe(content.current);
    return ()=>observer.disconnect();
  },[s]);
  useEffect(()=>{
    if(confirm)dialog.current?.showModal();
    else if(dialog.current?.open){dialog.current.close();finishButton.current?.focus();}
  },[confirm]);

  const scrollTo=(index:number)=>{
    const box=scroller.current,el=passages.current[index]; if(!box||!el)return;
    anchor.current=null; scrollLock.current=performance.now()+800;
    box.scrollTo({top:box.scrollTop+(el.getBoundingClientRect().top-box.getBoundingClientRect().top)/s-20,behavior:reduced?'auto':'smooth'});
  };
  const select=(index:number,navigate=false)=>{
    if(applying!==null)return;
    clearTimeout(navigationTimer.current);
    keepAnchor(index); setActive(index);setExpanded(index);
    persist({...stateRef.current,reviewed:stateRef.current.reviewed.map((v,i)=>i===index?true:v)});
    if(navigate)navigationTimer.current=setTimeout(()=>scrollTo(index),reduced?0:340);
  };
  const toggleCard=(index:number)=>{
    if(applying!==null)return;
    if(expanded===index){keepAnchor(index);setExpanded(null);}else select(index);
  };
  const apply=(index:number)=>{
    if(applying!==null)return;
    clearTimeout(collapseTimer.current);
    keepAnchor(index);setApplying(index);
    later(()=>{
      const next={...stateRef.current,applied:stateRef.current.applied.map((v,i)=>i===index?!v:v),reviewed:stateRef.current.reviewed.map((v,i)=>i===index?true:v),completedAt:undefined};
      keepAnchor(index);persist(next);setApplying(null);setIlluminated(index);
      collapseTimer.current=setTimeout(()=>{if(expandedRef.current===index){keepAnchor(index);setExpanded(null);}setIlluminated(null);},reduced?0:900);
    },reduced?0:220);
  };
  const finish=()=>{
    if(applying!==null)return;
    if(persist({...stateRef.current,completedAt:new Date().toISOString()})){setConfirm(false);onSave();}
  };
  const onScroll=()=>{
    if(performance.now()<scrollLock.current)return;
    const box=scroller.current;if(!box)return;
    const y=box.getBoundingClientRect().top+box.clientHeight*s*.3;
    let nearest=0,distance=Infinity;
    passages.current.forEach((el,i)=>{if(el){const d=Math.abs(el.getBoundingClientRect().top-y);if(d<distance){nearest=i;distance=d;}}});
    setActive(nearest); // Scrolling updates navigation only, never review or expansion.
  };
  const interruptScroll=()=>{clearTimeout(navigationTimer.current);anchor.current=null;scrollLock.current=0;};

  return <div className="revision-screen" style={{transform:`scale(${s})`}}>
    <header className="revision-header">
      <StatusBarIPhone17Pro/>
      <div className="revision-titlebar">
        <button aria-label="뒤로가기" disabled={applying!==null} onClick={()=>{if(persist(stateRef.current))onBack();}}><Asset name="back"/></button>
        <h1>기획안_수정</h1><span aria-hidden="true"><Asset name="more"/></span>
      </div>
      <div className="revision-toolbar">
        <label className="revision-section-select"><span>{feedback[active].heading}</span><Asset name="down"/>
          <select aria-label="의견이 있는 항목으로 이동" value={active} onChange={e=>select(Number(e.target.value),true)} disabled={applying!==null}>
            {feedback.map((item,i)=><option key={item.heading} value={i}>{item.heading}</option>)}
          </select>
        </label>
        <button className="revision-filter" role="switch" aria-checked={filtered} disabled={applying!==null}
          onClick={()=>{keepAnchor(active);setFiltered(v=>!v);}}>
          <span>수정부분만 보기</span><span className="revision-switch"><Asset name="toggle-off"/>
            <motion.span className="revision-switch-on" animate={{opacity:filtered?1:0}} transition={{duration}}/>
            <motion.span className="revision-switch-knob" initial={false} animate={{x:filtered?28:0}} transition={{duration,ease:EASE}}/>
          </span>
        </button>
      </div>
    </header>
    <div ref={scroller} className="revision-scroll" onScroll={onScroll} onWheel={interruptScroll} onTouchStart={interruptScroll}>
      <div ref={content} className="revision-content">
        {feedback.map((item,index)=>{
          const open=expanded===index,applied=state.applied[index];
          return <section key={item.heading} className="revision-section" aria-label={item.heading}>
            <h2>{item.heading}</h2>
            <AnimatePresence initial={false}>
              {!filtered&&<motion.div key="before" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration,ease:EASE}} className="revision-context">
                {item.before.map(text=><p key={text} className={text.length<20?'revision-subheading':''}>{text}</p>)}
              </motion.div>}
            </AnimatePresence>
            <div ref={el=>{passages.current[index]=el;}} className="revision-passage" data-feedback={index}>
              <button className={`revision-highlight ${open?'selected':''} ${applied?'applied':''} ${illuminated===index?'illuminated':''}`}
                aria-expanded={open} aria-controls={`feedback-${index}`} aria-label={`${index+1}번 의견 본문: ${applied?item.suggestion:item.passage}`} onClick={()=>select(index)}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(applied)} style={{display:'inline'}} initial={{opacity:0}} animate={{opacity:applying===index?.65:1}} exit={{opacity:0}} transition={{duration:reduced?0:.18}}>
                    {applied?item.suggestion:item.passage}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
            <AnimatePresence initial={false} mode="wait">
              {!open ? <motion.button key="indicator" className="revision-indicator" onClick={()=>select(index)} aria-expanded={false} aria-controls={`feedback-${index}`}
                initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.12}}>
                <span className="revision-author">{item.name}<span>{item.time}</span></span><span>{applied?'수정 완료':''}</span><Asset name="down"/>
                {!state.reviewed[index]&&<img className="revision-unread" src="/assets/revision/unread.svg" alt="읽지 않은 의견"/>}
              </motion.button> : <motion.div key="card" id={`feedback-${index}`} className="revision-card-clip"
                initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration,ease:EASE}}>
                <motion.div className="revision-card" initial={{opacity:0,y:reduced?0:5}} animate={{opacity:1,y:0}} transition={{duration,delay:reduced?0:.06}}>
                  <button className="revision-card-top" onClick={()=>toggleCard(index)} aria-expanded={true} aria-label={`${item.name} 의견 접기`}>
                    <span className="revision-author">{item.name}<span>{item.time}</span></span>
                    <span className="revision-source"><SourceIcon kind={item.file}/>{item.source}</span>
                  </button>
                  <p className="revision-comment"><span>{item.emphasis}</span>{item.comment}</p>
                  <div className="revision-suggestion-label"><Asset name="sparkle"/>수정 제안{applied&&<span className="revision-applied-status">수정 완료</span>}</div>
                  <button className="revision-suggestion" onClick={()=>apply(index)} disabled={applying!==null}
                    aria-pressed={applied} aria-label={`${index+1}번 수정 제안 ${applied?'되돌리기':'적용'}`} title={applied?'다시 눌러서 수정 전 문장으로 되돌리기':'눌러서 수정 제안 적용'}>{item.suggestion}</button>
                </motion.div>
              </motion.div>}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {!filtered&&<motion.div key="after" className="revision-context revision-after" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration,ease:EASE}}>
                {item.after.map(text=><p key={text}>{text}</p>)}
              </motion.div>}
            </AnimatePresence>
          </section>;
        })}
      </div>
    </div>
    <footer className="revision-footer">
      <nav aria-label="의견 탐색" className="revision-navigation">
        <button aria-label="이전 의견" disabled={active===0||applying!==null} onClick={()=>select(active-1,true)}><Asset name="previous"/></button>
        <span aria-live="polite">{active+1} / {feedback.length}</span>
        <button aria-label="다음 의견" disabled={active===feedback.length-1||applying!==null} onClick={()=>select(active+1,true)}><Asset name="next"/></button>
      </nav>
      <button ref={finishButton} className="revision-finish" disabled={applying!==null} onClick={()=>state.reviewed.some(v=>!v)?setConfirm(true):finish()}>저장하기</button>
    </footer>
    {error&&<p className="revision-error" role="alert">{error}</p>}
    <span className="revision-sr" role="status">{applying!==null?'문장을 변경하고 있어요.':illuminated!==null?(state.applied[illuminated]?'수정 제안을 적용했어요.':'수정 전 문장으로 되돌렸어요.'):''}</span>
    <dialog ref={dialog} className="revision-confirm" aria-labelledby="revision-confirm-title" onCancel={e=>{e.preventDefault();setConfirm(false);}}>
      <p id="revision-confirm-title">아직 확인하지 않은 의견이 있어요.</p>
      {error&&<p role="alert">{error}</p>}
      <div><button autoFocus onClick={()=>setConfirm(false)}>계속 확인하기</button><button onClick={finish}>수정 끝내기</button></div>
    </dialog>
  </div>;
}
