import { recordJourney } from "../../journey";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import DocumentReview from "./DocumentReview";
import { StatusBarIPhone17Pro } from "../intervention/screens/SessionEnteredScreen";
const IS_IOS = typeof navigator !== 'undefined' && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

const A = "/assets/briefing";
const imgChevronLeft = `${A}/7531e.svg`;
const imgAvatarYujin = `${A}/4d45b.png`;
const imgAvatarTaehun = `${A}/8c6ad.png`;
const imgCharShare = `${A}/share-updated.png`;
// File icon layers (share screen / done screen variants)
const FILE_ICON = {
  share: { bg: `${A}/faa33.svg`, body: `${A}/eaea9.svg`, fold: `${A}/2b170.svg` },
  done: { bg: `${A}/1aba4.svg`, body: `${A}/5953d.svg`, fold: `${A}/71062.svg` },
};

type Step = "review" | "done" | "share";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function DocFlow({ s, onClose }: { s: number; onClose: () => void }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>("review");
  const back = () => (step === "share" ? setStep("review") : onClose());

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-white font-['Pretendard'] not-italic overflow-clip"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 24 * s }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 * s }}
          transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
        >
          {step === "review" && <DocumentReview s={s} onBack={back} onSave={() => setStep("done")} />}
          {step === "done" && <Done s={s} onNext={() => setStep("share")} />}
          {step === "share" && <Share s={s} onBack={back} onFinish={onClose} />}
        </motion.div>
      </AnimatePresence>
      <div className="integration-home-indicator" style={{position:'absolute',zIndex:50}} aria-hidden="true"/>
    </motion.div>
  );
}

function BackButton({ s, onClick, top = 74 }: { s: number; onClick: () => void; top?: number }) {
  return (
    <button aria-label="뒤로가기" onClick={onClick} className="absolute" style={{ left: 20 * s, top: top * s, width: 24 * s, height: 24 * s }}>
      <img alt="" src={imgChevronLeft} className="block" style={{ width: 24 * s, height: 24 * s }} />
    </button>
  );
}

function FileIcon({ s, size, variant }: { s: number; size: number; variant: "share" | "done" }) {
  const k = (size / 70) * s;
  const src = FILE_ICON[variant];
  return (
    <div className="relative" style={{ width: 70 * k, height: 70 * k }}>
      <img alt="" src={src.bg} className="absolute block inset-0 size-full" />
      <img alt="" src={src.body} className="absolute block" style={{ left: 18.7 * k, top: 12.2 * k, width: 33.2 * k, height: 45.5 * k }} />
      <img alt="" src={src.fold} className="absolute block" style={{ left: 40.4 * k, top: 12.2 * k, width: 11.5 * k, height: 11.5 * k }} />
      <div className="absolute bg-white" style={{ left: 26 * k, top: 29.8 * k, width: 18.6 * k, height: 2.6 * k }} />
      <div className="absolute bg-white" style={{ left: 26 * k, top: 36 * k, width: 18.6 * k, height: 2.6 * k }} />
      <div className="absolute bg-white" style={{ left: 26 * k, top: 42.2 * k, width: 13.6 * k, height: 2.6 * k }} />
    </div>
  );
}

/* ---------- 정리 완료 (13:1509) ---------- */

function Done({ s, onNext }: { s: number; onNext: () => void }) {
  const reduced = useReducedMotion();
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!finished) return;
    const timer = setTimeout(onNext, 900);
    return () => clearTimeout(timer);
  }, [finished, onNext]);
  return (
    <div className="absolute inset-0 bg-white">
      <div style={{transform:`scale(${s})`,transformOrigin:'top left'}}><StatusBarIPhone17Pro/></div>
      {/* icon + message sit together in the optical centre of the screen */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: 40 * s }}>
        {IS_IOS ? <img alt="Plotto 기획안 정리 완료" src="/onboarding/spin.png"
          onLoad={()=>{setTimeout(()=>setFinished(true), reduced ? 0 : 4300);}}
          onError={()=>setFinished(true)}
          style={{width:180*s,height:180*s,objectFit:'contain'}}/> : <video aria-label="Plotto 기획안 정리 완료" src="/onboarding/spin.webm" muted playsInline autoPlay={!reduced}
          onLoadedData={e=>{if(reduced){e.currentTarget.currentTime=4.1;setFinished(true);}}}
          onEnded={()=>setFinished(true)}
          onError={()=>setFinished(true)}
          style={{width:180*s,height:180*s,objectFit:'contain'}}/>}
        <p className="text-center font-semibold text-[#111]" style={{ marginTop: -3 * s, fontSize: 22 * s, lineHeight: 1.364, letterSpacing: -0.4268 * s }}>
          기획안 정리가 완료되었어요
        </p>
      </div>
      <div data-name="home-indicator" style={{position:'absolute',left:129*s,bottom:8*s,width:144*s,height:5*s,borderRadius:8,background:'black'}}/>
    </div>
  );
}

/* ---------- 팀원에게 전달 (13:1464) ---------- */

export const MATES = [
  { name: "유진", role: "PPT 제작", title: "변경된 사용자와 추가 기능 전달", sub: "발표 자료에 반영할 수 있도록", img: imgAvatarYujin, crop: "top-[-2.22%]" },
  { name: "태훈", role: "자료조사", title: "새 사용자에 맞는 조사 내용 전달", sub: "관련 AI 서비스 사례를 보완할 수 있도록", img: imgAvatarTaehun, crop: "top-[-6.66%]" },
];

function Share({ s, onBack, onFinish }: { s: number; onBack: () => void; onFinish: () => void }) {
  const [picked, setPicked] = useState([true, true]);
  const [sent, setSent] = useState(false);
  const count = picked.filter(Boolean).length;
  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(onFinish, 1400);
    return () => clearTimeout(timer);
  }, [sent, onFinish]);

  const send = () => {
    if (!count || sent) return;
    setSent(true);
    recordJourney({sharedWith: ["유진", "태훈"].filter((_, index) => picked[index])});
  };

  return (
    <div className="absolute inset-0 bg-white">
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative" style={{ height: (472 + MATES.length * 108 + 120) * s }}>
      <div style={{transform:`scale(${s})`,transformOrigin:"top left"}}><StatusBarIPhone17Pro/></div><BackButton s={s} onClick={onBack} />
      <p className="absolute font-semibold text-[#536ffa]" style={{ left: 20 * s, top: 122 * s, fontSize: 14 * s, lineHeight: 1.571, letterSpacing: 0.203 * s }}>
        ✦ 해당 파일을 공유할 수 있어요
      </p>
      <div className="absolute font-semibold text-[#363636] whitespace-nowrap" style={{ left: 20 * s, top: 156 * s, fontSize: 22 * s, lineHeight: 1.364, letterSpacing: -0.4268 * s }}>
        <p>수정된 자료를</p>
        <p>팀원에게 전달해요</p>
      </div>
      <div className="absolute overflow-hidden pointer-events-none animate-[float_4s_ease-in-out_infinite]" style={{ left: 261 * s, top: 122 * s, width: 129 * s, height: 96 * s }}>
        <img alt="" src={imgCharShare} className="absolute max-w-none h-[206.88%] left-[-124.99%] top-[-104.96%] w-[232.47%]" />
      </div>
      {/* File */}
      <div className="absolute flex flex-col items-center bg-[#f2f2ff] rounded-[20px]" style={{ left: 20 * s, right: 20 * s, top: 232 * s, height: 168 * s, paddingTop: 20 * s }}>
        <div style={{width:72*s,height:72*s,borderRadius:'50%',background:'white',position:'relative'}}>
          <img alt="PDF" src="/assets/revision/pdf.svg" style={{position:'absolute',left:21*s,top:16*s,width:30*s,height:40*s}}/>
        </div>
        <p className="font-semibold text-[#536ffa]" style={{ marginTop: 12 * s, fontSize: 17 * s, lineHeight: 1.412 }}>
          기획안_수정.pdf
        </p>
        <p className="text-[#7b899e]" style={{ marginTop: 5 * s, fontSize: 13 * s, lineHeight: 1.5, letterSpacing: -0.6 * s }}>
          원본 반영과 팀원에게 전달은 각각 확인해요
        </p>
      </div>
      <p className="absolute font-semibold text-[#363636]" style={{ left: 20 * s, top: 426 * s, fontSize: 18 * s, lineHeight: 1.445 }}>
        공유 추천 팀원 <span className="text-[#536ffa]">{count}</span>
      </p>
      {/* Teammates */}
      {MATES.map((m, i) => (
        <button
          key={m.name}
          aria-pressed={picked[i]}
          onClick={() => setPicked((p) => p.map((v, j) => (j === i ? !v : v)))}
          className="absolute bg-white border-solid rounded-[15px] overflow-clip text-left transition-colors duration-200"
          style={{ left: 20 * s, right: 20 * s, top: (472 + i * 108) * s, height: 99 * s, borderWidth: 1.5, borderColor: picked[i] ? "#bebfff" : "#dde4ee" }}
        >
          <div className="absolute overflow-hidden rounded-full transition-opacity" style={{ left: 16 * s, top: 14 * s, width: 40 * s, height: 40 * s, opacity: picked[i] ? 1 : 0.5 }}>
            <img alt={m.name} src={m.img} className={`absolute left-0 max-w-none w-full h-[133.33%] ${m.crop}`} />
          </div>
          <p className="absolute font-semibold text-[#363636]" style={{ left: 74 * s, top: 14 * s, fontSize: 16 * s, lineHeight: 1.445 }}>
            {m.name}
          </p>
          <p className="absolute font-medium text-[#929aaa]" style={{ left: 109 * s, top: 15 * s, fontSize: 15 * s, lineHeight: 1.6 }}>
            |
          </p>
          <p className="absolute font-medium text-[#929aaa]" style={{ left: 119 * s, top: 15 * s, fontSize: 14 * s, lineHeight: 1.6 }}>
            {m.role}
          </p>
          <p className="absolute font-semibold text-[#363636] whitespace-nowrap" style={{ left: 74 * s, top: 45 * s, fontSize: 15 * s, lineHeight: 1.467 }}>
            {m.title}
          </p>
          <p className="absolute font-normal text-[#a9b1c1] whitespace-nowrap" style={{ left: 74 * s, top: 69 * s, fontSize: 12 * s, lineHeight: 1.334 }}>
            {m.sub}
          </p>
          <img alt="" src={imgChevronLeft} className="absolute block rotate-180" style={{ right: 11 * s, top: 37 * s, width: 24 * s, height: 24 * s }} />
        </button>
      ))}
      </div>
      </div>
      {/* Actions (pinned; content scrolls underneath) */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 120 * s, background: "linear-gradient(to bottom, rgba(255,255,255,0), #fff 40%)" }} />
      <div className="absolute flex justify-between" style={{ left: 24 * s, right: 23 * s, bottom: 36 * s, gap: 15 * s }}>
        <button
          onClick={send}
          className="flex-1 bg-white border-solid border-[#dde4ee] rounded-[12px] font-semibold text-[#1f2b3b] transition-transform active:scale-95"
          style={{ height: 54 * s, borderWidth: 1.429, fontSize: 16 * s, letterSpacing: -0.9 * s }}
        >
          직접 공유하기
        </button>
        <button
          onClick={send}
          disabled={!count}
          className="flex-1 bg-[#536ffa] rounded-[12px] font-semibold text-white transition-[transform,opacity] active:scale-95 disabled:opacity-40"
          style={{ height: 54 * s, fontSize: 16 * s, letterSpacing: -0.9 * s }}
        >
          공유하기
        </button>
      </div>
      {/* Sent toast */}
      <AnimatePresence>
        {sent && (
          <motion.div
            className="absolute left-1/2 bg-[#1c1a3c] text-white font-medium rounded-full whitespace-nowrap"
            initial={{ opacity: 0, y: 12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0 }}
            style={{ bottom: 114 * s, paddingInline: 18 * s, paddingBlock: 10 * s, fontSize: 14 * s }}
          >
            팀원 {count}명에게 공유했어요
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
