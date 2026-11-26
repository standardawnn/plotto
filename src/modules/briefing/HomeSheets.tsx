import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { feedback } from "./revisionData";
import { MATES } from "./DocFlow";
import { CHAR_SEARCH, type HomeTask } from "./homeData";
import "./revision.css";
import "./homeSheets.css";
import { openFile, useDemo } from "../../demo/useDemo";
import { ConfirmDialog, DemoGate } from "../../demo/DemoUI";
import { confirmShare, fileById, nameOf, projectOf, roleOf, saveVersion } from "../../demo/demoStore";
import { dotOf, dueLabel, relativeOf, stampOf, type DemoFile, type Scenario } from "../../demo/scenario";
import { planDocs, referenceState } from "./planData";

/* ---------------- 시나리오 연결 (마케팅 공모전 기획안·레퍼런스) ----------------
   기획안 문서와 수정 제안, 레퍼런스 작업은 모두 public/demo/plotto/scenario.json 에서 온다(src/demo).
   화면에 본문을 따로 적지 않고, 같은 fileId 는 openFile() 로 같은 뷰어에서 연다. */
const AVATAR: Record<string, { img: string; crop: string }> = {
  yujin: { img: MATES[0].img, crop: MATES[0].crop },
  taehun: { img: MATES[1].img, crop: MATES[1].crop },
};
function planTaskData(s: Scenario): TaskData | null {
  const d = planDocs(s);
  if (!d) return null;
  const { task, current, proposal, headings, bodyOf, nowEvent, meetingAt } = d;
  return {
    project: projectOf(s, task.projectId)?.name ?? "", due: task.dueAt ? dueLabel(s.demoNow, task.dueAt) : "", title: task.title, label: "수정 제안",
    desc: `${meetingAt ? `${dotOf(meetingAt)} 회의 내용을 바탕으로 ` : ""}Plotto가 ${current.origin === "local" ? current.title : `${current.title}(V${current.version})`}의 수정할 부분을 정리했어요`,
    items: headings.map(h => ({
      title: h, who: "플로토", time: nowEvent ? relativeOf(s.demoNow, nowEvent.at) : "",
      emphasis: `현재 V${current.version}: `, comment: bodyOf(current, h) || "(해당 항목 없음)", proposal: bodyOf(proposal, h),
    })),
    sources: task.fileIds.map(id => fileById(s, id)).filter((f): f is DemoFile => !!f)
      .map(f => ({ name: f.version ? `${f.title} (V${f.version})` : f.title, kind: f.kind === "pdf" ? "pdf" : "doc", fileId: f.id })),
    mates: (task.shareCandidateIds ?? []).map(id => ({ name: nameOf(s, id), role: roleOf(s, task.projectId, id), title: "수정 기획안을 확인하고 공유받을 팀원", img: AVATAR[id]?.img ?? "", crop: AVATAR[id]?.crop ?? "" })),
  };
}

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

/** 편집 문서 저장/불러오기 (브라우저 localStorage). 문서마다 키가 다르다. */
function readDoc(key: string, original: PlanSection[]): PlanSection[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    if (v && Array.isArray(v.sections) && v.sections.length === original.length
      && v.sections.every((s: PlanSection) => typeof s?.heading === "string" && Array.isArray(s.blocks) && s.blocks.every(b => typeof b === "string")))
      return v.sections;
  } catch { /* storage unavailable → original text */ }
  return original;
}
function saveDoc(key: string, title: string, sections: PlanSection[]) {
  localStorage.setItem(key, JSON.stringify({ title, sections, savedAt: new Date().toISOString() }));
}
export const readPlan = () => readDoc(PLAN_KEY, PLAN_ORIGINAL);

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
function BottomSheet({ title, sub, left, head, legacy, onClose, footer, tight, children }: { title: string; sub?: string; left?: ReactNode; head?: ReactNode; legacy?: boolean; onClose: () => void; footer?: ReactNode; tight?: boolean; children: ReactNode }) {
  const reduced = useReducedMotion();
  const sheet = useRef<HTMLDivElement>(null);
  /* The home behind the sheet must stay exactly where it is: focus without scrolling, and keep the effect from
     re-running (it re-focused the card behind the sheet on every home re-render) by reading onClose through a ref. */
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    sheet.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    addEventListener("keydown", onKey);
    return () => { removeEventListener("keydown", onKey); prev?.focus?.({ preventScroll: true }); };
  }, []);
  return (
    <div className="hs-layer" data-no-lift>
      <motion.div className="hs-dim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }} />
      <motion.div ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`hs-sheet ${legacy ? "legacy" : ""}`}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: reduced ? 0 : .42, ease: EASE }}>
        <div className="hs-grab" aria-hidden="true"><i /></div>
        <div className="hs-head">
          {head ?? <>
            {left && <span className="hs-head-left">{left}</span>}
            <h2 className="hs-title">{title}</h2>
            {sub && <p className="hs-sub">{sub}</p>}
          </>}
          <button type="button" className="hs-close" aria-label="닫기" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className={`hs-body ${tight ? "tight" : ""}`}>{children}</div>
        {footer}
      </motion.div>
    </div>
  );
}

/* ---------------- 1. 기획안 수정하기 팝업 ---------------- */

// 1차 구현 UI: 수정 제안을 카드(의견 + 제안 문장)로 보여 주는 버전
const SOURCES = feedback.reduce<{ name: string; kind: string }[]>((list, f) => list.some(x => x.name === f.source) ? list : [...list, { name: f.source, kind: f.file }], []);
function SourceIcon({ kind }: { kind: string }) {
  return kind === "pdf" ? <span className="revision-file-icon"><img src={`${R}pdf.svg`} alt="" /></span> : <DocIcon />;
}

/** 마감 임박 작업 팝업(카드형). 네 작업 모두 같은 틀·같은 버튼(직접 수정 / 수정 파일 보기)을 쓴다. */
type TaskItem = { title: string; who: string; time: string; emphasis: string; comment: string; proposal: string; original?: string };
type TaskData = {
  project: string; due: string; title: string; desc: string; label: string;
  items: TaskItem[]; sources: { name: string; kind: string; fileId?: string }[];
  mates: { name: string; role: string; title: string; img: string; crop: string }[];
};
function TaskSheet({ data, onClose, onToast, onEdit, onViewFile }: { data: TaskData; onClose: () => void; onToast: (t: string) => void; onEdit: () => void; onViewFile: () => void }) {
  return (
    <BottomSheet title={data.title} legacy onClose={onClose}
      head={<>
        <div className="hs-meta"><span>{data.project}</span><span>·</span><span className={data.due === "D-DAY" ? "hot" : ""}>{data.due}</span></div>
        <h2 className="hs-title">{data.title}</h2>
        <p className="hs-desc">{data.desc}</p>
      </>}
      footer={<div className="hs-foot">
        <button type="button" className="hs-btn ghost" onClick={onEdit}>직접 수정</button>
        <button type="button" className="hs-btn primary" onClick={onViewFile}>수정 파일 보기</button>
      </div>}>
      <div className="hs-sec"><img src={`${R}sparkle.svg`} alt="" /><span>{data.label} <b>{data.items.length}</b>건</span></div>
      <div className="hs-sugg">
        {data.items.map((f, i) => (
          <div key={f.title} className="hs-card">
            <div className="hs-card-top"><span className="hs-num">{i + 1}</span><h3>{f.title}</h3><span>{f.who} · {f.time}</span></div>
            <p className="hs-comment"><span>{f.emphasis}</span>{f.comment}</p>
            <p className="hs-proposal">{f.proposal}</p>
          </div>
        ))}
      </div>
      <div className="hs-sec">참고한 자료</div>
      <div className="hs-chips">
        {data.sources.map(s => (
          <button type="button" key={s.name} className="hs-chip" onClick={() => s.fileId ? openFile(s.fileId) : onToast(`'${s.name}'은 시연용 이름만 있고 실제 파일은 없어요`)}>
            <SourceIcon kind={s.kind} />{s.name}
          </button>
        ))}
      </div>
      <div className="hs-sec">공유 필요 팀원 <b>{data.mates.length}</b></div>
      <div className="hs-mates">
        {data.mates.map(m => (
          <div key={m.name} className="hs-mate">
            <span className="hs-ava">{m.img ? <img alt="" src={m.img} className={m.crop} /> : m.name.slice(0, 1)}</span>
            <div className="hs-mate-txt"><b>{m.name}<small>{m.role}</small></b><p>{m.title}</p></div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}

const PLAN_TASK: TaskData = {
  project: "마케팅 공모전", due: "D-DAY", title: "기획안 수정하기", label: "수정 제안",
  desc: `회의 내용을 바탕으로 Plotto가 ${PLAN_TITLE}의 수정할 부분을 정리했어요`,
  items: feedback.map(f => ({ title: f.heading.replace(/^\d+\.\s*/, ""), who: f.name, time: f.time, emphasis: f.emphasis, comment: f.comment, proposal: f.suggestion })),
  sources: SOURCES, mates: MATES.map(m => ({ ...m })),
};

// 디자인 피드백 (청년 참여 프로젝트). 데모용 데이터: 팀원 의견 → Plotto 정리안.
const [YUJIN, TAEHUN] = MATES;
const DESIGN_FEEDBACK_TASK: TaskData = {
  project: "청년 참여 프로젝트", due: "D-1", title: "디자인 피드백", label: "피드백",
  desc: "팀원들이 디자인 시안에 남긴 의견을 Plotto가 정리했어요",
  items: [
    { title: "메인 컬러", who: "유진", time: "어제", emphasis: "버튼 색이 배경과 비슷해서", comment: " 잘 안 보여.", proposal: "주요 버튼은 브랜드 블루(#536FFA)로 통일하고, 배경과 충분히 대비되도록 바꿔요.",
      original: "주요 버튼은 연보라색(#C9CFFD) 배경에 흰 글씨로 표시한다." },
    { title: "타이포그래피", who: "태훈", time: "어제", emphasis: "제목과 본문 크기 차이가 작아서", comment: " 위계가 잘 안 느껴져.", proposal: "제목은 22px 굵게, 본문은 15px로 정리해 정보의 순서가 한눈에 보이게 해요.",
      original: "제목은 18px, 본문은 16px로 표시한다." },
    { title: "아이콘", who: "유진", time: "5시간 전", emphasis: "화면마다 아이콘 스타일이 달라서", comment: " 통일하면 좋겠어.", proposal: "선 두께 1.8px의 라운드 라인 아이콘으로 모든 화면의 아이콘을 맞춰요.",
      original: "화면마다 필요한 아이콘을 각각 골라 사용한다." },
  ],
  sources: [{ name: "디자인 시안 v2", kind: "pdf" }, { name: "피드백 회의록", kind: "doc" }],
  mates: [
    { ...YUJIN, role: "PPT 제작", title: "수정된 시안을 발표 자료에 반영할 수 있도록" },
    { ...TAEHUN, role: "자료조사", title: "참고한 디자인 사례를 함께 확인할 수 있도록" },
  ],
};
// 레퍼런스 정리 (자원순환프로젝트, D-3) · GUI 제작 (청년 도움 프로젝트, D-5). 데모용 데이터.
const DEADLINE_TASKS: Record<"refcheck" | "guicheck", TaskData & { progressId: string }> = {
  refcheck: {
    progressId: "rc-ref", project: "자원순환프로젝트", due: "D-3", title: "레퍼런스 정리", label: "확인 요청",
    desc: "Plotto가 모은 캠페인 사례 중 확인이 필요한 부분을 정리했어요",
    items: [
      { title: "사례 범위", who: "태훈", time: "2시간 전", emphasis: "해외 사례까지 넣을지", comment: " 정해야 해.", proposal: "국내 지자체 캠페인 8건을 중심으로 두고, 참고용 해외 사례 2건만 따로 묶어요.",
        original: "국내외 자원순환 캠페인 사례를 구분 없이 수집한다." },
      { title: "정리 기준", who: "유진", time: "어제", emphasis: "사례마다 비교 기준이 달라서", comment: " 한눈에 안 들어와.", proposal: "메시지·홍보 채널·참여 방식 세 가지 기준으로 표를 맞춰 정리해요.",
        original: "사례마다 눈에 띄는 특징을 자유롭게 메모해 정리한다." },
      { title: "활용 방향", who: "태훈", time: "어제", emphasis: "포스터 시안에 바로 쓸 수 있게", comment: " 정리해 주면 좋겠어.", proposal: "사례마다 포스터에 참고할 문구와 이미지 포인트를 한 줄씩 덧붙여요.",
        original: "수집한 사례는 팀 회의 참고 자료로 사용한다." },
    ],
    sources: [{ name: "자원순환 캠페인 사례 모음", kind: "pdf" }, { name: "10.20 회의록", kind: "doc" }],
    mates: [
      { ...YUJIN, role: "PPT 제작", title: "발표 자료에 사례를 넣을 수 있도록" },
      { ...TAEHUN, role: "자료조사", title: "추가 사례 조사 범위를 맞출 수 있도록" },
    ],
  },
  guicheck: {
    progressId: "yh-gui", project: "청년 도움 프로젝트", due: "D-5", title: "GUI 제작", label: "확인 요청",
    desc: "프론트엔드에 전달하기 전에 확인이 필요한 화면을 정리했어요",
    items: [
      { title: "메인 화면", who: "유진", time: "3시간 전", emphasis: "주요 버튼 위치가", comment: " 화면마다 조금씩 달라.", proposal: "주요 버튼은 모든 화면에서 하단 고정 위치로 통일해요.",
        original: "주요 버튼은 화면 구성에 맞춰 위치를 정한다." },
      { title: "상세 화면", who: "태훈", time: "어제", emphasis: "정보가 너무 많아서", comment: " 스크롤이 길어.", proposal: "핵심 정보만 먼저 보여 주고, 나머지는 펼쳐 보기로 접어 둬요.",
        original: "상세 화면에는 작업에 필요한 모든 정보를 한 번에 보여 준다." },
      { title: "전달 파일", who: "유진", time: "어제", emphasis: "개발자가 바로 쓸 수 있게", comment: " 간격이랑 색 값을 적어 줘.", proposal: "화면별 간격·색상·폰트 값을 정리한 가이드 파일을 함께 전달해요.",
        original: "완성된 화면 이미지를 프론트엔드 담당에게 전달한다." },
    ],
    sources: [{ name: "GUI 시안 v3", kind: "pdf" }, { name: "화면 구조도", kind: "doc" }],
    mates: [
      { ...YUJIN, role: "PPT 제작", title: "발표 자료에 최신 화면을 넣을 수 있도록" },
      { ...TAEHUN, role: "자료조사", title: "참고한 UI 사례를 함께 확인할 수 있도록" },
    ],
  },
};
/* 작업별 문서: '직접 수정'은 원문(original)을 편집, '수정 파일 보기'는 제안이 반영된 수정본을 보여 준다.
   기획안은 기존 1차 기획안 편집 화면과 기존 '기획안_수정' 검토 화면(DocFlow)을 그대로 쓴다. */
export type TaskKind = "plan" | "feedback" | "refcheck" | "guicheck";
type TaskDoc = { data: TaskData; docTitle: string; key: string };
const TASK_DOCS: Record<TaskKind, TaskDoc> = {
  plan: { data: PLAN_TASK, docTitle: PLAN_TITLE, key: PLAN_KEY },
  feedback: { data: DESIGN_FEEDBACK_TASK, docTitle: "디자인 시안 v2", key: "plotto-doc-design-feedback-v1" },
  refcheck: { data: DEADLINE_TASKS.refcheck, docTitle: "자원순환 캠페인 사례 모음", key: "plotto-doc-reference-v1" },
  guicheck: { data: DEADLINE_TASKS.guicheck, docTitle: "GUI 시안 v3", key: "plotto-doc-gui-v1" },
};
function docOriginal(kind: TaskKind): PlanSection[] {
  if (kind === "plan") return PLAN_ORIGINAL;
  return TASK_DOCS[kind].data.items.map((it, i) => ({ heading: `${i + 1}. ${it.title}`, blocks: [it.original ?? ""] }));
}

export function DeadlineTaskSheet({ kind, onClose, onToast, onEdit, onViewFile }: { kind: TaskKind; onClose: () => void; onToast: (t: string) => void; onEdit: () => void; onViewFile: () => void }) {
  const demo = useDemo();
  if (kind !== "plan") return <TaskSheet data={TASK_DOCS[kind].data} onClose={onClose} onToast={onToast} onEdit={onEdit} onViewFile={onViewFile} />;
  // 기획안: 시나리오(V1/V2) 기준. 불러오는 동안·실패 시 상태를 시트 안에 보여 준다.
  const data = demo.status === "ready" ? planTaskData(demo.s) : null;
  if (data) return <TaskSheet data={data} onClose={onClose} onToast={onToast} onEdit={onEdit} onViewFile={onViewFile} />;
  return <BottomSheet title="기획안 수정하기" legacy onClose={onClose}>
    <DemoGate demo={demo}>{() => <div className="dm-state error" role="alert"><b>기획안 데이터를 찾지 못했어요</b><span>scenario.json 의 review-plan 작업과 V1·V2 파일을 확인해 주세요.</span></div>}</DemoGate>
  </BottomSheet>;
}

/* ---------------- 직접 수정: 10.11 1차 기획안 편집 ---------------- */

function AutoText({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fit = () => { const el = ref.current; if (el) { el.style.height = "0px"; el.style.height = `${el.scrollHeight}px`; } };
  useLayoutEffect(fit, [value]);
  useEffect(() => { const ro = new ResizeObserver(fit); if (ref.current) ro.observe(ref.current); return () => ro.disconnect(); }, []);
  return <textarea ref={ref} className="pe-text" aria-label={label} value={value} rows={1} spellCheck={false} onChange={e => onChange(e.target.value)} />;
}

/** 기획안 직접 수정: 앱에서 현재 버전(마지막 저장본, 없으면 V1)을 열고, 저장하면 새 버전을 만든다. 기존 버전은 남는다. */
function ScenarioPlanEditor({ s, onBack, onSaved }: { s: Scenario; onBack: () => void; onSaved: (msg: string) => void }) {
  const reduced = useReducedMotion();
  const docs = planDocs(s);
  const [base] = useState(() => docs?.current);
  const [draft, setDraft] = useState(() => base?.sections.map(x => ({ ...x })) ?? []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const busy = useRef(false); // 빠른 연속 클릭: 첫 저장이 끝나기 전·끝난 뒤의 클릭은 무시
  const [confirm, setConfirm] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dirty = !!base && JSON.stringify(draft) !== JSON.stringify(base.sections);
  useEffect(() => { if (confirm) dialog.current?.showModal(); else if (dialog.current?.open) dialog.current.close(); }, [confirm]);
  if (!base) return <div className="pe-screen" data-no-lift><div className="dm-state error" role="alert" style={{ marginTop: 120 }}><b>편집할 기획안을 찾지 못했어요</b><button type="button" onClick={onBack}>돌아가기</button></div></div>;
  const save = () => {
    if (busy.current) return;
    busy.current = true; setSaving(true);
    const r = saveVersion(s, { baseFileId: base.id, sections: draft, source: "edit" });
    setSaving(false);
    if (!r.ok) { busy.current = false; setError(r.error); return; }
    setError("");
    onSaved(r.duplicate ? `바뀐 내용이 없어 새 버전을 만들지 않았어요 (현재 V${r.value.version})` : `V${r.value.version} 버전으로 저장했어요 · V${base.version} 버전도 남아 있어요`);
  };
  const back = () => (dirty ? setConfirm(true) : onBack());
  return (
    <motion.div className="pe-screen" data-no-lift initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: reduced ? 0 : .45, ease: EASE }}>
      <div className="integration-status" style={{ position: "absolute", zIndex: 5 }} aria-hidden="true"><span>9:41</span><i /><img src="/assets/intervention/8b917.svg" alt="" /></div>
      <header className="pe-head">
        <div className="pe-bar">
          <button type="button" className="pe-back" aria-label="뒤로가기" onClick={back}><img src={`${R}back.svg`} alt="" /></button>
          <h1>{base.title}</h1>
          <button type="button" className="pe-more" aria-label="파일 정보 보기" onClick={() => openFile(base.id)}><img src={`${R}more.svg`} alt="" /></button>
        </div>
        <div className="pe-info">
          <button type="button" className="pe-chip" onClick={() => openFile(base.id)}><DocIcon />{base.displayFileName} · V{base.version}</button>
          <span className="pe-state" aria-live="polite"><i aria-hidden="true" />{saving ? "저장 중" : dirty ? `V${base.version} 기준 수정중` : `V${base.version}`}</span>
        </div>
      </header>
      <div className="pe-scroll">
        <div className="pe-doc">
          {draft.map((sec, si) => (
            <section key={sec.heading} className="pe-section">
              <h2>{si + 1}. {sec.heading}</h2>
              <AutoText label={`${sec.heading} 본문`} value={sec.body} onChange={v => setDraft(d => d.map((x, i) => (i === si ? { ...x, body: v } : x)))} />
            </section>
          ))}
        </div>
      </div>
      <div className="pe-foot">
        {error && <p className="revision-error" role="alert" style={{ position: "static", margin: "0 auto 8px", maxWidth: 720, pointerEvents: "auto" }}>{error}</p>}
        <button type="button" onClick={save} disabled={saving} aria-busy={saving}>{saving ? "저장하는 중…" : "저장하기"}</button>
      </div>
      <dialog ref={dialog} className="revision-confirm" aria-labelledby="pe-confirm-title" onCancel={e => { e.preventDefault(); setConfirm(false); }}>
        <p id="pe-confirm-title">저장하지 않은 수정 내용이 있어요.</p>
        <div><button type="button" autoFocus onClick={() => setConfirm(false)}>계속 수정하기</button><button type="button" onClick={() => { setConfirm(false); onBack(); }}>저장 안 하고 나가기</button></div>
      </dialog>
    </motion.div>
  );
}

export function PlanEditor({ kind = "plan", onBack, onSaved }: { kind?: TaskKind; onBack: () => void; onSaved: (msg?: string) => void }) {
  const demo = useDemo();
  if (kind === "plan") {
    if (demo.status === "ready") return <ScenarioPlanEditor s={demo.s} onBack={onBack} onSaved={onSaved} />;
    return <div className="pe-screen" data-no-lift><div style={{ marginTop: 120 }}><DemoGate demo={demo}>{() => null}</DemoGate></div>
      <div className="pe-foot"><button type="button" onClick={onBack}>돌아가기</button></div></div>;
  }
  return <LegacyEditor kind={kind} onBack={onBack} onSaved={() => onSaved()} />;
}

function LegacyEditor({ kind, onBack, onSaved }: { kind: TaskKind; onBack: () => void; onSaved: () => void }) {
  const reduced = useReducedMotion();
  const doc = TASK_DOCS[kind];
  const [saved] = useState<PlanSection[]>(() => readDoc(doc.key, docOriginal(kind)));
  const [draft, setDraft] = useState<PlanSection[]>(saved);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => { if (confirm) dialog.current?.showModal(); else if (dialog.current?.open) dialog.current.close(); }, [confirm]);

  const save = () => {
    try { saveDoc(doc.key, doc.docTitle, draft); setError(""); onSaved(); }
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
          <h1>{doc.docTitle}</h1>
          <button type="button" className="pe-more" aria-label="더보기" tabIndex={-1} style={{ cursor: "default" }}><img src={`${R}more.svg`} alt="" /></button>
        </div>
        <div className="pe-info">
          <span className="pe-chip"><DocIcon />{doc.docTitle}</span>
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

/* ---------------- 수정 파일 보기 (기획안 외 작업) ----------------
   제안이 반영된 수정본을 읽기 전용으로 보여 준다. 바뀐 문장은 기획안_수정 화면처럼 연파랑 하이라이트. */
export function TaskFileView({ kind, onBack }: { kind: Exclude<TaskKind, "plan">; onBack: () => void }) {
  const reduced = useReducedMotion();
  const doc = TASK_DOCS[kind];
  const fileName = `${doc.docTitle}_수정`;
  return (
    <motion.div className="pe-screen" data-no-lift initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: reduced ? 0 : .45, ease: EASE }}>
      <div className="integration-status" style={{ position: "absolute", zIndex: 5 }} aria-hidden="true"><span>9:41</span><i /><img src="/assets/intervention/8b917.svg" alt="" /></div>
      <header className="pe-head">
        <div className="pe-bar">
          <button type="button" className="pe-back" aria-label="뒤로가기" onClick={onBack}><img src={`${R}back.svg`} alt="" /></button>
          <h1>{fileName}</h1>
          <button type="button" className="pe-more" aria-label="더보기" tabIndex={-1} style={{ cursor: "default" }}><img src={`${R}more.svg`} alt="" /></button>
        </div>
        <div className="pe-info">
          <span className="pe-chip"><img src={`${R}pdf.svg`} alt="" style={{ width: 12, height: 16 }} />{fileName}</span>
          <span className="pe-state"><i aria-hidden="true" style={{ background: "#536ffa" }} />수정 {doc.data.items.length}건 반영</span>
        </div>
      </header>
      <div className="pe-scroll">
        <div className="pe-doc" style={{ paddingBottom: 60 }}>
          {doc.data.items.map((it, i) => (
            <section key={it.title} className="pe-section">
              <h2>{i + 1}. {it.title}</h2>
              <p className="pf-text"><span>{it.proposal}</span></p>
              <p className="pf-note"><b>{it.who}</b> {it.emphasis}{it.comment}</p>
            </section>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- 2. 레퍼런스 정리 진행 상황 팝업 ---------------- */

/** 진행 중인 작업 팝업. 레퍼런스 정리 · 디자인 시안 수정이 같은 틀을 쓴다.
    done = 완료(파란 체크), wait = 대기 중(모래시계), active = 진행 중, todo = 예정. */
type Step = { status: "done" | "wait" | "active" | "todo"; title: string; desc: string; file?: string; fileId?: string; action?: { label: string; run: () => void }; note?: string };
type ProgressData = { project: string; title: string; pct: number; label: string; message: string; char: string; charAlt: string; steps: Step[] };
const BADGE: Record<Step["status"], string> = { done: "", wait: "대기 중", active: "진행 중", todo: "예정" };

function ProgressSheet({ data, onClose, onToast }: { data: ProgressData; onClose: () => void; onToast: (t: string) => void }) {
  return (
    <BottomSheet title={data.title} sub={data.project} onClose={onClose} tight>
      <div className="hs-hero">
        <span className="hs-ring" style={{ "--p": `${data.pct}%` } as React.CSSProperties} data-full={data.pct >= 100 || undefined}
          role="progressbar" aria-label={data.label} aria-valuenow={data.pct} aria-valuemin={0} aria-valuemax={100}>
          <img src={data.char} alt={data.charAlt} />
        </span>
        <div className="hs-hero-txt">
          <b>{data.label} {data.pct}%</b>
          <p>{data.message}</p>
        </div>
      </div>
      <ol className="hs-steps">
        {data.steps.map(s => (
          <li key={s.title} className={`hs-step ${s.status}`}>
            <span className="hs-dot" aria-label={s.status === "done" ? "완료" : BADGE[s.status]}>
              {s.status === "done" ? <CheckIcon /> : s.status === "wait" ? <HourglassIcon /> : <i className="hs-dot-core" />}
            </span>
            <div className="hs-step-main">
              <div className="hs-step-row"><b>{s.title}</b>{BADGE[s.status] && <span className="hs-badge">{BADGE[s.status]}</span>}</div>
              <p>{s.desc}</p>
              {s.file && <button type="button" className="hs-file" onClick={() => s.fileId ? openFile(s.fileId) : onToast(`'${s.file}'은 시연용 이름만 있고 실제 파일은 없어요`)}>
                <i><img src={`${R}pdf.svg`} alt="PDF" /></i><span>{s.file}</span>
              </button>}
              {s.note && <p className="hs-step-note">{s.note}</p>}
              {s.action && <button type="button" className="hs-step-action" onClick={s.action.run}>{s.action.label}</button>}
            </div>
          </li>
        ))}
      </ol>
    </BottomSheet>
  );
}

const REFERENCE_PROGRESS: ProgressData = {
  project: "마케팅 공모전", title: "레퍼런스 정리", pct: 100, label: "자료정리", message: "팀원들에게 전달할 준비가 완료됐어요",
  char: CHAR_SEARCH, charAlt: "돋보기로 자료를 살펴보는 Plotto",
  steps: [
    { status: "done", title: "수상작 사례 수집", desc: "공모전 수상작 이미지를 정리하고 수상 요인을 분석했어요" },
    { status: "done", title: "레퍼런스 파일 정리", desc: "사례별로 컨셉과 시각자료를 묶어서 정리했어요", file: "공모전 수상작 레퍼런스 정리_plotto.pdf" },
    { status: "wait", title: "팀원에게 전달", desc: "정리된 자료를 팀원에게 전달할 수 있어요" },
  ],
};
// 디자인 시안 수정 (마케팅 공모전, 진행도 60%). 데모용 데이터.
const DESIGN_PROGRESS: ProgressData = {
  project: "마케팅 공모전", title: "디자인 시안 수정", pct: 60, label: "시안 수정", message: "회의 피드백을 시안에 반영하고 있어요",
  char: "/extra/q1.png", charAlt: "노트북으로 시안을 수정하는 Plotto",
  steps: [
    { status: "done", title: "회의 피드백 정리", desc: "회의에서 나온 시안 수정 요청을 항목별로 정리했어요" },
    { status: "active", title: "시안 수정", desc: "메인 화면과 상세 화면에 수정 사항을 반영하고 있어요", file: "마케팅 공모전 디자인 시안_v2.pdf" },
    { status: "todo", title: "팀원 검토 요청", desc: "수정이 끝나면 팀원에게 검토를 요청할 수 있어요" },
  ],
};

/** 그 밖의 진행 카드: 진행도에 맞춰 3단계 상태를 정한다.
    100% → 완료·완료·대기 중 / 30% 이상 → 완료·진행 중·예정 / 그 미만 → 진행 중·예정·예정 */
export function TaskProgressSheet({ task, onClose, onToast }: { task: HomeTask; onClose: () => void; onToast: (t: string) => void }) {
  const st: Step["status"][] = task.pct >= 100 ? ["done", "done", "wait"] : task.pct >= 30 ? ["done", "active", "todo"] : ["active", "todo", "todo"];
  const data: ProgressData = {
    project: task.project, title: task.title, pct: task.pct, label: "진행도",
    message: task.pct >= 100 ? "작업을 마치고 다음 단계를 기다리고 있어요" : `${task.status}이에요`,
    char: task.char, charAlt: `${task.title} 작업 중인 Plotto`,
    steps: task.steps.map(([title, desc], i) => ({ status: st[i], title, desc })),
  };
  return <ProgressSheet data={data} onClose={onClose} onToast={onToast} />;
}

/** 레퍼런스 정리: 사례 수집 완료 → 파일 정리 완료(PDF 열기) → 팀원 전달 대기. PDF 열기와 공유 확정은 서로 다른 행동이다. */
function ScenarioReferenceSheet({ s, onClose, onToast }: { s: Scenario; onClose: () => void; onToast: (t: string) => void }) {
  const st = referenceState(s);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  if (!st) return <ProgressSheet data={REFERENCE_PROGRESS} onClose={onClose} onToast={onToast} />;
  const { task, fileId, recipients, share } = st;
  const file = fileById(s, fileId);
  const who = recipients.map(r => `${nameOf(s, r)}님`).join("·");
  const descs = REFERENCE_PROGRESS.steps.map(x => x.desc);
  const data: ProgressData = {
    ...REFERENCE_PROGRESS,
    project: projectOf(s, task.projectId)?.name ?? REFERENCE_PROGRESS.project, title: task.title, pct: task.progress ?? REFERENCE_PROGRESS.pct,
    message: share ? `${who}에게 전달했어요` : REFERENCE_PROGRESS.message,
    steps: (task.steps ?? []).map((x, i) => {
      const isLast = i === (task.steps?.length ?? 0) - 1;
      const done = x.state === "done" || (isLast && !!share);
      return {
        status: done ? "done" : "wait", title: x.label,
        desc: isLast ? (share ? `${who}에게 전달했어요` : `${who}에게 전달하기 전이에요`) : (descs[i] ?? ""),
        ...(x.fileId && fileById(s, x.fileId) ? { file: fileById(s, x.fileId)!.displayFileName, fileId: x.fileId } : {}),
        ...(isLast && share ? { note: `공유 이력 · ${stampOf(share.sharedAt)} · ${nameOf(s, share.senderId)} → ${share.recipientIds.map(r => nameOf(s, r)).join(", ")}` } : {}),
        ...(isLast && !share && recipients.length ? { action: { label: `${who}에게 전달하기`, run: () => { setError(""); setAsking(true); } } } : {}),
      };
    }),
  };
  return <>
    <ProgressSheet data={data} onClose={onClose} onToast={onToast} />
    {asking && <ConfirmDialog title={`${who}에게 전달할까요?`} confirmLabel="전달 확정" error={error} onCancel={() => setAsking(false)}
      onConfirm={() => {
        const r = confirmShare(s, { fileId, recipientIds: recipients });
        if (!r.ok) { setError(r.error); return; }
        setAsking(false);
        onToast(`${who}에게 공유 이력을 남겼어요`);
      }}>
      <p>{file?.displayFileName}을(를) {recipients.map(r => `${nameOf(s, r)}(${roleOf(s, task.projectId, r)})`).join(", ")}에게 공유해요.</p>
      <p>확정하면 프로젝트 공유 이력에 기록돼요. 로컬 데모라 실제 메시지는 보내지 않아요.</p>
    </ConfirmDialog>}
  </>;
}

export function ReferenceSheet({ onClose, onToast }: { onClose: () => void; onToast: (t: string) => void }) {
  const demo = useDemo();
  if (demo.status === "ready") return <ScenarioReferenceSheet s={demo.s} onClose={onClose} onToast={onToast} />;
  return <BottomSheet title="레퍼런스 정리" onClose={onClose} tight><DemoGate demo={demo}>{() => null}</DemoGate></BottomSheet>;
}
export function DesignProgressSheet({ onClose, onToast }: { onClose: () => void; onToast: (t: string) => void }) {
  return <ProgressSheet data={DESIGN_PROGRESS} onClose={onClose} onToast={onToast} />;
}
