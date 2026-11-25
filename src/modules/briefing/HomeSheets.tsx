import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { feedback } from "./revisionData";
import { MATES } from "./DocFlow";
import "./revision.css";
import "./homeSheets.css";

const EASE = [0.22, 1, 0.36, 1] as const;
const R = "/assets/revision/";

/* ---------------- 10.11 1차 기획안 본문 ----------------
   1·2번은 디자인 '직접 수정' 화면의 문구를 그대로 옮겼다(핵심 타깃 범위 변경 없음).
   2번 둘째 문단 중 '저장하기' 버튼에 가려 안 보이는 한 줄은 앞뒤 문장을 잇는 최소 표현으로 채웠다.
   3번은 디자인에 보이지 않아 기존 프로젝트 기획안(revisionData)의 핵심 기능 원문을 불러온다. */

export type PlanSection = { heading: string; blocks: string[] };
export const PLAN_TITLE = "10.11 1차 기획안";
export const PLAN_KEY = "plotto-plan-draft-v2";

const f3 = feedback[2];
const PLAN_ORIGINAL: PlanSection[] = [
  {
    heading: "1. 서비스 목표",
    blocks: [
      "최근 AI 서비스는 개인의 작업 지원을 넘어 협업 과정의 정보와 업무를 연결하는 방향으로 발전하고 있다.\n마케팅 분야에서도 AI를 활용해 소비자의 관심사와 시장 트렌드를 분석하고, 브랜드에 적합한 마케팅 전략을 수립하는 방식이 확대되고 있다.\n본 서비스는 여러 채널에 흩어진 마케팅 사례와 자료를 한곳에서 찾아볼 수 있도록 돕는다.",
      "이를 통해 사용자는 소비자의 관심과 요구를 보다 정확하게 파악하고, 브랜드의 메시지를 효과적으로 전달할 수 있다.",
    ],
  },
  {
    heading: "2. 핵심 타깃",
    blocks: [
      "본 서비스는 마케팅에 관심이 있거나 관련 정보를 필요로 하는 사용자를 대상으로 한다. 브랜드의 SNS를 운영하는 담당자, 상품 홍보를 준비하는 창업자, 마케팅 과제를 수행하는 대학생 등이 활용할 수 있다.",
      "주요 이용 상황은 다음 게시물의 주제를 정하거나 새 캠페인을 준비하는 경우로, 비슷한 분야에서 어떤 콘텐츠가 주목받았는지 살펴보고 기획에 필요한 자료를 탐색한다.",
    ],
  },
  {
    heading: f3.heading,
    blocks: [[...f3.before, f3.passage].join("\n"), ...f3.after],
  },
];

export function readPlan(): PlanSection[] {
  try {
    const v = JSON.parse(localStorage.getItem(PLAN_KEY) || "null");
    if (v && Array.isArray(v.sections) && v.sections.length === PLAN_ORIGINAL.length
      && v.sections.every((s: PlanSection) => typeof s?.heading === "string" && Array.isArray(s.blocks) && s.blocks.every(b => typeof b === "string")))
      return v.sections;
  } catch { /* storage unavailable → original text */ }
  return PLAN_ORIGINAL;
}
function savePlan(sections: PlanSection[]) {
  localStorage.setItem(PLAN_KEY, JSON.stringify({ title: PLAN_TITLE, sections, savedAt: new Date().toISOString() }));
}

/* ---------------- shared bits ---------------- */

function CloseIcon() {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
}
function HourglassIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M6 3h12v2c0 3-2.3 5-4.5 7 2.2 2 4.5 4 4.5 7v2H6v-2c0-3 2.3-5 4.5-7C8.3 10 6 8 6 5V3Zm2.2 2c.2 1.9 1.7 3.4 3.8 5.3C14.1 8.4 15.6 6.9 15.8 5H8.2Zm3.8 8.7c-2.1 1.9-3.6 3.4-3.8 5.3h7.6c-.2-1.9-1.7-3.4-3.8-5.3Z" fill="currentColor" /></svg>;
}
function DocIcon() {
  return <span className="revision-file-icon">
    <span className="revision-doc-body"><img src={`${R}doc-body.svg`} alt="" /></span>
    <span className="revision-doc-fold"><img src={`${R}doc-fold.svg`} alt="" /></span><span className="revision-doc-label">DOCX</span>
  </span>;
}

export function Toast({ text }: { text: string }) {
  return <AnimatePresence>{text && <motion.div key={text} className="hs-toast" role="status"
    initial={{ opacity: 0, y: 12, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, x: "-50%" }} transition={{ duration: .22 }}>{text}</motion.div>}</AnimatePresence>;
}
export function useToast(): [string, (t: string) => void] {
  const [text, setText] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [text, (t: string) => { clearTimeout(timer.current); setText(t); timer.current = setTimeout(() => setText(""), 1800); }];
}

/** 화면 아래에서 올라오는 팝업. 뒤 배경을 어둡게 깔고, X·배경·Esc로 닫는다. */
function BottomSheet({ title, sub, left, onClose, footer, tight, children }: { title: string; sub: string; left?: ReactNode; onClose: () => void; footer?: ReactNode; tight?: boolean; children: ReactNode }) {
  const reduced = useReducedMotion();
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    sheet.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => { removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className="hs-layer" data-no-lift>
      <motion.div className="hs-dim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }} />
      <motion.div ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="hs-sheet"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: reduced ? 0 : .42, ease: EASE }}>
        <div className="hs-grab" aria-hidden="true"><i /></div>
        <div className="hs-head">
          {left && <span className="hs-head-left">{left}</span>}
          <h2 className="hs-title">{title}</h2>
          <p className="hs-sub">{sub}</p>
          <button type="button" className="hs-close" aria-label="닫기" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className={`hs-body ${tight ? "tight" : ""}`}>{children}</div>
        {footer}
      </motion.div>
    </div>
  );
}

/* ---------------- 1. 기획안 수정하기 팝업 ---------------- */

export function PlanSheet({ onClose, onEdit, onViewFile, onToast }: { onClose: () => void; onEdit: () => void; onViewFile: () => void; onToast: (t: string) => void }) {
  return (
    <BottomSheet title="기획안 수정하기" sub="마케팅 공모전" left="D-DAY" onClose={onClose}
      footer={<div className="hs-foot">
        <button type="button" className="hs-btn ghost" onClick={onEdit}>직접 수정</button>
        <button type="button" className="hs-btn primary" onClick={onViewFile}>수정 파일 보기</button>
      </div>}>
      <p className="hs-sugg-title"><img src={`${R}sparkle.svg`} alt="" />수정 제안 {feedback.length}건</p>
      <p className="hs-sugg-desc">회의 의견을 바탕으로 기획안의 세 항목에 수정안을 준비했어요.</p>
      <ul className="hs-sugg-box">
        {feedback.map(f => <li key={f.heading}>{f.heading.replace(/^\d+\.\s*/, "")}</li>)}
      </ul>
      <div className="hs-sec">참고한 자료</div>
      <div className="hs-chips">
        <button type="button" className="hs-chip" onClick={() => onToast("'10.14 회의록' 파일은 아직 연결되지 않았어요")}><DocIcon />10.14 회의록</button>
        <button type="button" className="hs-chip" onClick={onEdit}><DocIcon />{PLAN_TITLE}</button>
      </div>
      <div className="hs-sec">공유 필요 팀원</div>
      <div className="hs-mates">
        {MATES.map(m => (
          <div key={m.name} className="hs-mate">
            <span className="hs-ava"><img alt="" src={m.img} className={m.crop} /></span>
            <span><b>{m.name}</b><small>{m.role}</small></span>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}

/* ---------------- 직접 수정: 10.11 1차 기획안 편집 ---------------- */

function AutoText({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fit = () => { const el = ref.current; if (el) { el.style.height = "0px"; el.style.height = `${el.scrollHeight}px`; } };
  useLayoutEffect(fit, [value]);
  useEffect(() => { const ro = new ResizeObserver(fit); if (ref.current) ro.observe(ref.current); return () => ro.disconnect(); }, []);
  return <textarea ref={ref} className="pe-text" aria-label={label} value={value} rows={1} spellCheck={false} onChange={e => onChange(e.target.value)} />;
}

export function PlanEditor({ onBack, onSaved }: { onBack: () => void; onSaved: () => void }) {
  const reduced = useReducedMotion();
  const [saved] = useState<PlanSection[]>(readPlan);
  const [draft, setDraft] = useState<PlanSection[]>(saved);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => { if (confirm) dialog.current?.showModal(); else if (dialog.current?.open) dialog.current.close(); }, [confirm]);

  const save = () => {
    try { savePlan(draft); setError(""); onSaved(); }
    catch { setError("저장하지 못했어요. 다시 시도해 주세요."); }
  };
  const back = () => (dirty ? setConfirm(true) : onBack());
  const edit = (si: number, bi: number, v: string) => setDraft(d => d.map((s, i) => (i === si ? { ...s, blocks: s.blocks.map((b, j) => (j === bi ? v : b)) } : s)));

  return (
    <motion.div className="pe-screen" data-no-lift initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: reduced ? 0 : .45, ease: EASE }}>
      <div className="integration-status" style={{ position: "absolute", zIndex: 5 }} aria-hidden="true"><span>9:41</span><i /><img src="/assets/intervention/8b917.svg" alt="" /></div>
      <header className="pe-head">
        <div className="pe-bar">
          <button type="button" className="pe-back" aria-label="뒤로가기" onClick={back}><img src={`${R}back.svg`} alt="" /></button>
          <h1>{PLAN_TITLE}</h1>
          <button type="button" className="pe-more" aria-label="더보기" tabIndex={-1} style={{ cursor: "default" }}><img src={`${R}more.svg`} alt="" /></button>
        </div>
        <div className="pe-info">
          <span className="pe-chip"><DocIcon />{PLAN_TITLE}</span>
          <span className="pe-state" aria-live="polite"><i aria-hidden="true" />수정중</span>
        </div>
      </header>
      <div className="pe-scroll">
        <div className="pe-doc">
          {draft.map((s, si) => (
            <section key={s.heading} className="pe-section">
              <h2>{s.heading}</h2>
              {s.blocks.map((b, bi) => <AutoText key={bi} label={`${s.heading} 본문 ${bi + 1}`} value={b} onChange={v => edit(si, bi, v)} />)}
            </section>
          ))}
        </div>
      </div>
      <div className="pe-foot">
        {error && <p className="revision-error" role="alert" style={{ position: "static", margin: "0 auto 8px", maxWidth: 720, pointerEvents: "auto" }}>{error}</p>}
        <button type="button" onClick={save}>저장하기</button>
      </div>
      <dialog ref={dialog} className="revision-confirm" aria-labelledby="pe-confirm-title" onCancel={e => { e.preventDefault(); setConfirm(false); }}>
        <p id="pe-confirm-title">저장하지 않은 수정 내용이 있어요.</p>
        <div><button type="button" autoFocus onClick={() => setConfirm(false)}>계속 수정하기</button><button type="button" onClick={() => { setConfirm(false); onBack(); }}>저장 안 하고 나가기</button></div>
      </dialog>
    </motion.div>
  );
}

/* ---------------- 2. 레퍼런스 정리 진행 상황 팝업 ---------------- */

const REF_PDF = "공모전 수상작 레퍼런스 정리_plotto.pdf";

export function ReferenceSheet({ onClose, onToast }: { onClose: () => void; onToast: (t: string) => void }) {
  return (
    <BottomSheet title="레퍼런스 정리" sub="마케팅 공모전" onClose={onClose} tight>
      <div className="hs-hero">
        <span className="hs-ring"><img src="/extra/p3.png" alt="돋보기로 자료를 살펴보는 Plotto" /></span>
        <div className="hs-hero-txt">
          <b>자료정리 100%</b>
          <p>팀원들에게 전달할 준비가 완료됐어요</p>
        </div>
      </div>
      <ol className="hs-steps">
        <li className="hs-step done">
          <span className="hs-dot" aria-label="완료"><CheckIcon /></span>
          <div className="hs-step-main">
            <div className="hs-step-row"><b>수상작 사례 수집</b></div>
            <p>공모전 수상작 이미지를 정리하고 수상 요인을 분석했어요</p>
          </div>
        </li>
        <li className="hs-step done">
          <span className="hs-dot" aria-label="완료"><CheckIcon /></span>
          <div className="hs-step-main">
            <div className="hs-step-row"><b>레퍼런스 파일 정리</b></div>
            <p>사례별로 컨셉과 시각자료를 묶어서 정리했어요</p>
            <button type="button" className="hs-file" onClick={() => onToast("PDF 원본 파일은 아직 연결되지 않았어요")}>
              <i><img src={`${R}pdf.svg`} alt="PDF" /></i><span>{REF_PDF}</span>
            </button>
          </div>
        </li>
        <li className="hs-step wait">
          <span className="hs-dot" aria-label="대기 중"><HourglassIcon /></span>
          <div className="hs-step-main">
            <div className="hs-step-row"><b>팀원에게 전달</b><span className="hs-badge">대기 중</span></div>
            <p>정리된 자료를 팀원에게 전달할 수 있어요</p>
          </div>
        </li>
      </ol>
    </BottomSheet>
  );
}
