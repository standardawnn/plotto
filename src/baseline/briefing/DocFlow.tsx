import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const A = "/assets/briefing";
const imgChevronLeft = `${A}/7531e.svg`;
const imgMore = `${A}/72ffa.svg`;
const imgAvatarSeoyeon = `${A}/c79f2.png`;
const imgAvatarYujin = `${A}/4d45b.png`;
const imgAvatarTaehun = `${A}/8c6ad.png`;
const imgPencil = `${A}/cd8b5.svg`;
const imgDivider = `${A}/c9bb7.svg`;
const imgKnob = `${A}/5b512.svg`;
const imgChipDivider = `${A}/b03a7.svg`;
const imgCharShare = `${A}/b021f.png`;
const imgCharDone = `${A}/7220f.png`;
// File icon layers (share screen / done screen variants)
const FILE_ICON = {
  share: { bg: `${A}/faa33.svg`, body: `${A}/eaea9.svg`, fold: `${A}/2b170.svg` },
  done: { bg: `${A}/1aba4.svg`, body: `${A}/5953d.svg`, fold: `${A}/71062.svg` },
};

type Step = "review" | "done" | "share";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function DocFlow({ s, onClose }: { s: number; onClose: () => void }) {
  const [step, setStep] = useState<Step>("review");
  const back = () => (step === "share" ? setStep("review") : onClose());

  // completion screen moves on to the share suggestion by itself
  useEffect(() => {
    if (step !== "done") return;
    const t = setTimeout(() => setStep("share"), 1800);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-white font-['Pretendard'] not-italic overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 24 * s }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 * s }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {step === "review" && <Review s={s} onBack={back} onSave={() => setStep("done")} />}
          {step === "done" && <Done s={s} onBack={back} onNext={() => setStep("share")} />}
          {step === "share" && <Share s={s} onBack={back} onFinish={onClose} />}
        </motion.div>
      </AnimatePresence>
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

/* ---------- 기획안 검토 (13:1529) ---------- */

type Run = { t: string; b?: boolean; hl?: boolean };
type Block = { kind: "h" | "p" | "li"; runs: Run[]; changed?: boolean };
const DOC: Block[] = [
  { kind: "h", runs: [{ t: "1. 서비스 목표" }] },
  { kind: "p", runs: [{ t: "본 서비스의 목표는 단순히 업무를 기록하는 것을 넘어, 사용자가 현재 상황에서 필요한 정보를 빠르게 이해하고 다음 행동으로 자연스럽게 이동할 수 있도록 지원하는 것이다." }] },
  { kind: "p", runs: [{ t: "AI는 프로젝트의 일정, 문서, 업무 진행 상황을 분석하여 사용자가 확인해야 할 내용을 정리하고 필요한 경우 관련 업무를 연결한다." }] },
  { kind: "p", runs: [{ t: "이를 통해 사용자는 정보를 찾고 정리하는 데 사용하는 시간을 줄이고 실제 업무 수행에 더 집중할 수 있다." }] },
  { kind: "h", runs: [{ t: "2. 핵심 타깃" }] },
  { kind: "p", changed: true, runs: [{ t: "주요 사용자는 여러 프로젝트와 업무를 동시에 관리해야 하는 대학생, 직장인, 프로젝트 팀원", b: true, hl: true }, { t: "이다." }] },
  { kind: "p", runs: [{ t: "특히 다음과 같은 사용자를 핵심 대상으로 설정한다." }] },
  { kind: "li", runs: [{ t: "여러 프로젝트를 동시에 진행하는 사용자" }] },
  { kind: "li", runs: [{ t: "협업 과정에서 문서와 자료 변경이 자주 발생하는 사용자" }] },
  { kind: "li", runs: [{ t: "업무 우선순위 관리에 어려움을 느끼는 사용자" }] },
  { kind: "li", runs: [{ t: "반복적인 자료 탐색과 정리에 많은 시간을 사용하는 사용자" }] },
  { kind: "h", runs: [{ t: "3. 핵심 기능" }] },
  { kind: "p", runs: [{ t: "AI 업무 브리핑" }] },
  { kind: "p", changed: true, runs: [{ t: "사용자가 서비스에 접속하면 " }, { t: "현재 진행 중인 프로젝트의 주요 변화와 해야 할 업무를 AI가 요약하여 제공", b: true, hl: true }, { t: "한다." }] },
  { kind: "p", runs: [{ t: "예를 들어 새로운 자료가 추가되거나 일정이 변경된 경우, 해당 변화가 어떤 업무와 관련되어 있는지 함께 보여준다." }] },
  { kind: "p", runs: [{ t: "변경 사항 연결" }] },
  { kind: "p", runs: [{ t: "새로운 문서나 의견이 추가되었을 때 기존 프로젝트의 어떤 부분과 관련되어 있는지 AI가 분석한다." }] },
  { kind: "p", runs: [{ t: "사용자는 단순히 새로운 자료를 확인하는 것이 아니라 해당 자료가 현재 작업에 어떤 영향을 주는지 함께 확인할 수 있다." }] },
];

function Review({ s, onBack, onSave }: { s: number; onBack: () => void; onSave: () => void }) {
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [comment, setComment] = useState(true);
  const blocks = onlyChanged ? DOC.filter((b) => b.changed || b.kind === "h") : DOC;

  return (
    <div className="absolute inset-0 bg-white">
      {/* Header */}
      <div className="absolute inset-x-0 flex items-center justify-between" style={{ top: 62 * s, paddingInline: 20 * s, paddingBlock: 8 * s }}>
        <button aria-label="뒤로가기" onClick={onBack} style={{ width: 24 * s, height: 24 * s }}>
          <img alt="" src={imgChevronLeft} className="block" style={{ width: 24 * s, height: 24 * s }} />
        </button>
        <p className="font-bold text-[#111]" style={{ fontSize: 17 * s, lineHeight: 1.412 }}>
          기획안 검토
        </p>
        <button aria-label="더보기" style={{ width: 24 * s, height: 24 * s }}>
          <img alt="" src={imgMore} className="block" style={{ width: 24 * s, height: 24 * s }} />
        </button>
      </div>
      {/* Owner */}
      <div className="absolute overflow-hidden rounded-full" style={{ left: 26 * s, top: 119 * s, width: 46 * s, height: 46 * s }}>
        <img alt="서연" src={imgAvatarSeoyeon} className="absolute left-0 max-w-none w-full h-[133.33%] top-[-4.81%]" />
      </div>
      <p className="absolute font-medium text-black" style={{ left: 86 * s, top: 123 * s, fontSize: 15 * s }}>
        서연
      </p>
      <p className="absolute font-medium text-[#7c8494]" style={{ left: 123 * s, top: 125 * s, fontSize: 12 * s }}>
        담당자
      </p>
      <p className="absolute font-normal text-[#929aaa] whitespace-pre" style={{ left: 86 * s, top: 147 * s, fontSize: 12 * s }}>
        {"최근 수정일: 13시간 전  | 최초 작성일: 2026. 09. 26"}
      </p>
      <img alt="" src={imgDivider} className="absolute block" style={{ left: 20 * s, top: 175 * s, width: 362 * s, height: 1 }} />
      {/* Doc title + toggle */}
      <p className="absolute font-semibold text-black" style={{ left: 20 * s, top: 189 * s, fontSize: 17 * s }}>
        Plotto 수정 기획안
      </p>
      <img alt="" src={imgPencil} className="absolute block" style={{ left: 154 * s, top: 192 * s, width: 14.4 * s, height: 14.385 * s }} />
      <p className="absolute font-normal text-[#929aaa]" style={{ left: 20 * s, top: 217.25 * s, fontSize: 12 * s }}>
        최근 수정일: 13시간 전
      </p>
      <button
        role="switch"
        aria-checked={onlyChanged}
        onClick={() => setOnlyChanged((v) => !v)}
        className="absolute flex items-center"
        style={{ left: 271 * s, top: 192 * s, gap: 10 * s }}
      >
        <span className="font-normal text-[#676e7d]" style={{ fontSize: 13 * s }}>
          수정부분만
        </span>
        <span
          className="relative block rounded-[40px] transition-colors duration-300"
          style={{ width: 44.8 * s, height: 22.4 * s, background: onlyChanged ? "#536ffa" : "#e1e7f2" }}
        >
          <motion.img
            alt=""
            src={imgKnob}
            className="absolute block"
            animate={{ x: onlyChanged ? 22.4 * s : 0 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            style={{ left: 3.2 * s, top: 3.2 * s, width: 16 * s, height: 16 * s }}
          />
        </span>
      </button>
      {/* Document body */}
      <div className="absolute inset-x-0 bottom-0 bg-[#f5f7f8]" style={{ top: 247 * s }}>
        <div
          className="absolute inset-0 overflow-y-auto touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ paddingInline: 26 * s, paddingTop: 12 * s, paddingBottom: 140 * s }}
        >
          <AnimatePresence initial={false}>
            {blocks.map((b) => (
              <motion.div
                key={b.runs[0].t}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`text-[#525966] ${b.kind === "h" ? "font-bold" : "font-normal"} ${b.kind === "li" ? "flex" : ""}`}
                style={{ fontSize: 15 * s, lineHeight: 1.6, letterSpacing: 0.144 * s, marginBottom: b.kind === "li" ? 8 * s : 0 }}
              >
                {b.kind === "li" && <span className="shrink-0 text-center" style={{ width: 22 * s }}>•</span>}
                <p>
                  {b.runs.map((r, i) => (
                    <span key={i} className={`${r.b ? "font-bold" : ""} ${r.hl ? "text-[#536ffa]" : ""}`}>
                      {r.t}
                    </span>
                  ))}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {/* Teammate comment */}
        <AnimatePresence>
          {comment && (
            <motion.button
              onClick={() => setComment(false)}
              initial={{ opacity: 0, y: 8 * s }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 * s }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.4 }}
              className="absolute flex items-center bg-[#693dfc] rounded-[40px] text-white whitespace-nowrap"
              style={{ left: 43 * s, top: 438 * s, gap: 6 * s, paddingInline: 16 * s, paddingBlock: 8 * s }}
            >
              <span className="font-medium" style={{ fontSize: 12.137 * s, lineHeight: 1.7 }}>
                태훈
              </span>
              <img alt="" src={imgChipDivider} className="block" style={{ width: 1, height: 10 * s }} />
              <span className="font-normal" style={{ fontSize: 14 * s, lineHeight: 1.429, letterSpacing: 0.203 * s }}>
                접속했을 때 변경사항이나 내가 해야할 업무를···.
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      {/* Save bar */}
      <div className="absolute inset-x-0 bottom-0 bg-white flex justify-center" style={{ height: 108 * s, paddingTop: 18 * s }}>
        <button
          onClick={onSave}
          className="flex items-center justify-center bg-[#536ffa] rounded-[30px] text-white font-semibold transition-transform active:scale-95"
          style={{ width: 148 * s, height: 48 * s, fontSize: 15 * s }}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

/* ---------- 정리 완료 (13:1509) ---------- */

function Done({ s, onBack, onNext }: { s: number; onBack: () => void; onNext: () => void }) {
  return (
    <div className="absolute inset-0 bg-white" onClick={onNext}>
      <BackButton s={s} onClick={onBack} />
      <motion.div
        className="absolute left-1/2 overflow-hidden"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.35 }}
        style={{ top: 234 * s, width: 148 * s, height: 153 * s, marginLeft: -76 * s }}
      >
        <img alt="" src={imgCharDone} className="absolute max-w-none h-[179.33%] left-[-153.16%] top-0 w-[277.76%]" />
      </motion.div>
      <p className="absolute inset-x-0 text-center font-bold text-[#363636]" style={{ top: 413 * s, fontSize: 22 * s, lineHeight: 1.364, letterSpacing: -0.4268 * s }}>
        기획안 정리가 완료되었어요
      </p>
      <div className="absolute flex flex-col items-center bg-[#f2f2ff] rounded-[20px]" style={{ left: 20 * s, right: 20 * s, top: 463 * s, height: 161 * s, paddingTop: 20 * s }}>
        <FileIcon s={s} size={82} variant="done" />
        <p className="font-semibold text-[#536ffa]" style={{ marginTop: 15 * s, fontSize: 17 * s, lineHeight: 1.412 }}>
          기획안_수정.hwp
        </p>
      </div>
    </div>
  );
}

/* ---------- 팀원에게 전달 (13:1464) ---------- */

const MATES = [
  { name: "유진", role: "PPT 제작", title: "변경된 타깃과 추가 기능 전달", sub: "발표 자료에 반영할 수 있도록", img: imgAvatarYujin, crop: "top-[-2.22%]" },
  { name: "태훈", role: "자료조사", title: "새 타깃에 맞는 조사 내용 전달", sub: "관련 AI 서비스 사례를 보완할 수 있도록", img: imgAvatarTaehun, crop: "top-[-6.66%]" },
];

function Share({ s, onBack, onFinish }: { s: number; onBack: () => void; onFinish: () => void }) {
  const [picked, setPicked] = useState([true, true]);
  const [sent, setSent] = useState(false);
  const count = picked.filter(Boolean).length;

  const send = () => {
    if (!count || sent) return;
    setSent(true);
    setTimeout(onFinish, 1400);
  };

  return (
    <div className="absolute inset-0 bg-white">
      <BackButton s={s} onClick={onBack} />
      <p className="absolute font-semibold text-[#536ffa]" style={{ left: 27 * s, top: 118 * s, fontSize: 14 * s, lineHeight: 1.571, letterSpacing: 0.203 * s }}>
        Plotto 공유 제안
      </p>
      <div className="absolute font-bold text-[#363636] whitespace-nowrap" style={{ left: 27 * s, top: 148 * s, fontSize: 22 * s, lineHeight: 1.364, letterSpacing: -0.4268 * s }}>
        <p>수정된 자료를 각 팀원에게</p>
        <p>맞는 방식으로 공유할 수 있어요</p>
      </div>
      <div className="absolute overflow-hidden pointer-events-none animate-[float_4s_ease-in-out_infinite]" style={{ left: 264 * s, top: 105 * s, width: 129 * s, height: 96 * s }}>
        <img alt="" src={imgCharShare} className="absolute max-w-none h-[206.88%] left-[-124.99%] top-[-104.96%] w-[232.47%]" />
      </div>
      {/* File */}
      <div className="absolute flex flex-col items-center bg-[#f2f2ff] rounded-[20px]" style={{ left: 20 * s, right: 20 * s, top: 235 * s, height: 171 * s, paddingTop: 20 * s }}>
        <FileIcon s={s} size={70} variant="share" />
        <p className="font-semibold text-[#536ffa]" style={{ marginTop: 12 * s, fontSize: 17 * s, lineHeight: 1.412 }}>
          기획안_수정.hwp
        </p>
        <p className="text-[#7b899e]" style={{ marginTop: 5 * s, fontSize: 13 * s, lineHeight: 1.5, letterSpacing: -0.6 * s }}>
          원본 반영과 팀원에게 전달은 각각 확인해요
        </p>
      </div>
      <p className="absolute font-semibold text-[#363636]" style={{ left: 20 * s, top: 437 * s, fontSize: 18 * s, lineHeight: 1.445 }}>
        공유 추천 팀원 <span className="text-[#536ffa]">{count}</span>
      </p>
      {/* Teammates */}
      {MATES.map((m, i) => (
        <button
          key={m.name}
          aria-pressed={picked[i]}
          onClick={() => setPicked((p) => p.map((v, j) => (j === i ? !v : v)))}
          className="absolute bg-white border-solid rounded-[15px] overflow-clip text-left transition-colors duration-200"
          style={{ left: 20 * s, right: 20 * s, top: (478 + i * 126) * s, height: 116 * s, borderWidth: 1.5, borderColor: picked[i] ? "#536ffa" : "#dde4ee" }}
        >
          <div className="absolute overflow-hidden rounded-full transition-opacity" style={{ left: 19.25 * s, top: 20.25 * s, width: 54 * s, height: 54 * s, opacity: picked[i] ? 1 : 0.5 }}>
            <img alt={m.name} src={m.img} className={`absolute left-0 max-w-none w-full h-[133.33%] ${m.crop}`} />
          </div>
          <p className="absolute font-semibold text-[#363636]" style={{ left: 88 * s, top: 19.25 * s, fontSize: 18 * s, lineHeight: 1.445 }}>
            {m.name}
          </p>
          <p className="absolute font-medium text-[#929aaa]" style={{ left: 130 * s, top: 20.25 * s, fontSize: 15 * s, lineHeight: 1.6 }}>
            |
          </p>
          <p className="absolute font-medium text-[#929aaa]" style={{ left: 145 * s, top: 20.25 * s, fontSize: 15 * s, lineHeight: 1.6 }}>
            {m.role}
          </p>
          <p className="absolute font-semibold text-[#363636] whitespace-nowrap" style={{ left: 88 * s, top: 52.25 * s, fontSize: 15 * s, lineHeight: 1.467 }}>
            {m.title}
          </p>
          <p className="absolute font-normal text-[#a9b1c1] whitespace-nowrap" style={{ left: 88 * s, top: 79.25 * s, fontSize: 12 * s, lineHeight: 1.334 }}>
            {m.sub}
          </p>
          <img alt="" src={imgChevronLeft} className="absolute block rotate-180" style={{ right: 11 * s, top: 46 * s, width: 24 * s, height: 24 * s }} />
        </button>
      ))}
      <p className="absolute font-medium text-[#7b899e]" style={{ right: 20 * s, top: 735 * s, fontSize: 13 * s, lineHeight: 1.385 }}>
        {"전달 내용 미리보기 >"}
      </p>
      {/* Actions */}
      <div className="absolute flex justify-between" style={{ left: 24 * s, right: 23 * s, top: 784 * s, gap: 15 * s }}>
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
          className="flex-1 bg-[#583bff] rounded-[12px] font-semibold text-white transition-[transform,opacity] active:scale-95 disabled:opacity-40"
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
            style={{ top: 720 * s, paddingInline: 18 * s, paddingBlock: 10 * s, fontSize: 14 * s }}
          >
            팀원 {count}명에게 공유했어요
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
