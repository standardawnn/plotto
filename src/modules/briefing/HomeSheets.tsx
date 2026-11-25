import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { feedback, readRevision } from "./revisionData";
import { MATES } from "./DocFlow";
import "./revision.css";
import "./homeSheets.css";

const EASE = [0.22, 1, 0.36, 1] as const;
const R = "/assets/revision/";
const imgWarning = "/assets/briefing/c3f48.svg";

/* ---------------- 1차 기획안 본문 (revisionData의 기획안 원문을 그대로 사용) ---------------- */

export type PlanSection = { heading: string; body: string };
export const PLAN_TITLE = "10.11 1차 기획안";
export const PLAN_KEY = "plotto-plan-draft-v1";

function initialPlan(): PlanSection[] {
  // 기존 '수정 파일 보기'에서 적용한 제안이 있으면 그 문장을, 없으면 원문 문장을 넣는다.
  const { applied } = readRevision();
  return feedback.map((item, i) => ({
    heading: item.heading,
    body: [...item.before, applied[i] ? item.suggestion : item.passage, ...item.after].join("\n"),
  }));
}
export function readPlan(): PlanSection[] {
  try {
    const v = JSON.parse(localStorage.getItem(PLAN_KEY) || "null");
    if (v && Array.isArray(v.sections) && v.sections.length === feedback.length && v.sections.every((s: PlanSection) => typeof s?.heading === "string" && typeof s?.body === "string"))
      return v.sections;
  } catch { /* storage unavailable → original text */ }
  return initialPlan();
}
function savePlan(sections: PlanSection[]) {
  localStorage.setItem(PLAN_KEY, JSON.stringify({ title: PLAN_TITLE, sections, savedAt: new Date().toISOString() }));
}

/* ---------------- shared bits ---------------- */

function CloseIcon() {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5l3 2" /></svg>;
}
function SourceIcon({ kind }: { kind: string }) {
  return <span className="revision-file-icon">{kind === "pdf" ? <img src={`${R}pdf.svg`} alt="" /> : <>
    <span className="revision-doc-body"><img src={`${R}doc-body.svg`} alt="" /></span>
    <span className="revision-doc-fold"><img src={`${R}doc-fold.svg`} alt="" /></span><span className="revision-doc-label">DOCX</span>
  </>}</span>;
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
function BottomSheet({ label, onClose, head, footer, hero, children }: { label: string; onClose: () => void; head: ReactNode; footer?: ReactNode; hero?: ReactNode; children: ReactNode }) {
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
      <motion.div ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className="hs-sheet" style={{ outline: "none" }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: reduced ? 0 : .42, ease: EASE }}>
        <div className="hs-grab" aria-hidden="true"><i /></div>
        <div className="hs-head">
          {head}
          <button type="button" className="hs-close" aria-label="닫기" onClick={onClose}><CloseIcon /></button>
        </div>
        {hero}
        <div className="hs-body">{children}</div>
        {footer}
      </motion.div>
    </div>
  );
}

/* ---------------- 1. 기획안 수정하기 팝업 ---------------- */

const SOURCES = feedback.reduce<{ name: string; kind: string }[]>((list, f) => list.some(x => x.name === f.source) ? list : [...list, { name: f.source, kind: f.file }], []);

export function PlanSheet({ onClose, onEdit, onViewFile, onToast }: { onClose: () => void; onEdit: () => void; onViewFile: () => void; onToast: (t: string) => void }) {
  return (
    <BottomSheet label="기획안 수정하기" onClose={onClose}
      head={<>
        <div className="hs-meta"><span>마케팅 공모전</span><span>·</span><span className="hot">D-DAY</span></div>
        <h2 className="hs-title">기획안 수정하기</h2>
        <p className="hs-desc">회의 내용을 바탕으로 Plotto가 {PLAN_TITLE}의 수정할 부분을 정리했어요</p>
      </>}
      footer={<div className="hs-foot">
        <button type="button" className="hs-btn ghost" onClick={onViewFile}>수정 파일 보기</button>
        <button type="button" className="hs-btn primary" onClick={onEdit}>직접 수정</button>
      </div>}>
      <div className="hs-sec"><img src={`${R}sparkle.svg`} alt="" /><span>수정 제안 <b>{feedback.length}</b>건</span></div>
      <div className="hs-sugg">
        {feedback.map((f, i) => (
          <div key={f.heading} className="hs-card">
            <div className="hs-card-top"><span className="hs-num">{i + 1}</span><h3>{f.heading.replace(/^\d+\.\s*/, "")}</h3><span>{f.name} · {f.time}</span></div>
            <p className="hs-comment"><span>{f.emphasis}</span>{f.comment}</p>
            <p className="hs-proposal">{f.suggestion}</p>
          </div>
        ))}
      </div>
      <div className="hs-sec">참고한 자료</div>
      <div className="hs-chips">
        {SOURCES.map(s => (
          <button type="button" key={s.name} className="hs-chip" onClick={() => onToast(`'${s.name}' 원본 파일은 아직 연결되지 않았어요`)}>
            <SourceIcon kind={s.kind} />{s.name}
          </button>
        ))}
      </div>
      <div className="hs-sec">공유 필요 팀원 <b>{MATES.length}</b></div>
      <div className="hs-mates">
        {MATES.map(m => (
          <div key={m.name} className="hs-mate">
            <span className="hs-ava"><img alt="" src={m.img} className={m.crop} /></span>
            <div className="hs-mate-txt"><b>{m.name}<small>{m.role}</small></b><p>{m.title}</p></div>
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
  const [saved, setSaved] = useState<PlanSection[]>(readPlan);
  const [draft, setDraft] = useState<PlanSection[]>(saved);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dirty = draft.some((s, i) => s.body !== saved[i].body);
  useEffect(() => { if (confirm) dialog.current?.showModal(); else if (dialog.current?.open) dialog.current.close(); }, [confirm]);

  const save = () => {
    try { savePlan(draft); setSaved(draft); setError(""); onSaved(); }
    catch { setError("저장하지 못했어요. 다시 시도해 주세요."); }
  };
  const back = () => (dirty ? setConfirm(true) : onBack());

  return (
    <motion.div className="pe-screen" data-no-lift initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: reduced ? 0 : .45, ease: EASE }}>
      <div className="integration-status" style={{ position: "absolute", zIndex: 5 }} aria-hidden="true"><span>9:41</span><i /><img src="/assets/intervention/8b917.svg" alt="" /></div>
      <header className="pe-head">
        <div className="pe-bar">
          <button type="button" aria-label="뒤로가기" onClick={back}><img src={`${R}back.svg`} alt="" /></button>
          <h1>{PLAN_TITLE}</h1>
          <span className={`pe-state ${dirty ? "dirty" : ""}`} aria-live="polite">{dirty ? "수정 중" : "저장됨"}</span>
        </div>
        <div className="pe-info"><img src={`${R}sparkle.svg`} alt="" />본문을 눌러 바로 고칠 수 있어요</div>
      </header>
      <div className="pe-scroll">
        <div className="pe-doc">
          {draft.map((s, i) => (
            <section key={s.heading} className="pe-section">
              <h2>{s.heading}</h2>
              <AutoText label={`${s.heading} 본문`} value={s.body} onChange={v => setDraft(d => d.map((x, j) => (j === i ? { ...x, body: v } : x)))} />
            </section>
          ))}
        </div>
      </div>
      <div className="pe-foot">
        {error && <p className="revision-error" role="alert" style={{ position: "static", margin: "0 auto 8px", maxWidth: 720, pointerEvents: "auto" }}>{error}</p>}
        <button type="button" disabled={!dirty} onClick={save}>저장하기</button>
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
    <BottomSheet label="레퍼런스 정리 진행 상황" onClose={onClose}
      head={<>
        <div className="hs-meta"><span>마케팅 공모전</span></div>
        <h2 className="hs-title">레퍼런스 정리</h2>
        <p className="hs-desc">공모전 수상작 참고하여 정리</p>
      </>}
      hero={<div className="hs-hero">
        <img src="/extra/check.png" alt="자료 정리를 마친 Plotto" />
        <div className="hs-hero-txt">
          <small>Plotto 작업 현황</small>
          <strong>자료정리 <em>100%</em></strong>
          <div className="hs-bar" role="progressbar" aria-label="자료정리 진행도" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}><i /></div>
        </div>
      </div>}>
      <div className="hs-sec">진행 과정</div>
      <ol className="hs-steps">
        <li className="hs-step done">
          <span className="hs-dot"><CheckIcon /></span>
          <div className="hs-step-main">
            <div className="hs-step-row"><b>수상작 사례 수집</b><span className="hs-badge done">완료</span></div>
            <p>공모전 수상작 사례를 모았어요</p>
          </div>
        </li>
        <li className="hs-step done next-wait">
          <span className="hs-dot"><CheckIcon /></span>
          <div className="hs-step-main">
            <div className="hs-step-row"><b>레퍼런스 파일 정리</b><span className="hs-badge done">완료</span></div>
            <p>모은 사례를 한 파일로 정리했어요</p>
            <button type="button" className="hs-file" onClick={() => onToast("PDF 원본 파일은 아직 연결되지 않았어요")}>
              <img src={`${R}pdf.svg`} alt="PDF" /><span>{REF_PDF}</span><em>열기</em>
            </button>
          </div>
        </li>
        <li className="hs-step wait">
          <span className="hs-dot"><ClockIcon /></span>
          <div className="hs-step-main">
            <div className="hs-step-row"><b>팀원에게 전달</b><span className="hs-badge wait">대기 중</span></div>
            <p>정리한 자료를 팀원에게 아직 전달하지 않았어요</p>
          </div>
        </li>
      </ol>
      <div className="hs-note"><img src={imgWarning} alt="" style={{ filter: "brightness(0) saturate(100%) invert(48%) sepia(83%) saturate(2500%) hue-rotate(352deg)" }} />자료 정리는 끝났어요. 팀원에게 전달만 남아 있어요.</div>
    </BottomSheet>
  );
}
