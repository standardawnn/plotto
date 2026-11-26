import { useEffect, useRef, useState, type ReactNode } from "react";
import "./demo.css";
import { onOpenFile, useDemo, type DemoState } from "./useDemo";
import { fileById, nameOf, projectOf, roleOf, sharesOfFile, versionsOf } from "./demoStore";
import { stampOf, type DemoFile, type Scenario } from "./scenario";
import { openSavedDocx } from "./realFile";

// ---------------------------------------------------------------- 작은 공통 요소

const AVATARS: Record<string, string> = {
  yujin: "/assets/briefing/4d45b.png",
  taehun: "/assets/briefing/8c6ad.png",
  seoyeon: "/stage1/assets/c79f2.png",
};
export function Avatar({ s, id, size = 32 }: { s: Scenario; id: string; size?: number }) {
  const src = AVATARS[id];
  return <span className="dm-ava" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
    {src ? <img src={src} alt="" /> : nameOf(s, id).slice(0, 1)}
  </span>;
}

export const STATUS_LABEL: Record<string, string> = {
  draft: "초안", shared: "공유됨", ai_proposed: "플로토 수정 제안", awaiting_share: "전달 대기",
  saved_edit: "직접 수정 저장본", saved_applied: "제안 반영 저장본", post_save_example: "저장 후 예시",
};
export const versionLabel = (f: DemoFile) => (f.version ? `V${f.version}` : "");
/** 상태 이름. 전달 대기 파일은 공유 기록이 생기면 전달 완료로 보여 준다. */
export const statusOf = (s: Scenario, f: DemoFile) => (f.status === "awaiting_share" && sharesOfFile(s, f).length ? "전달 완료" : STATUS_LABEL[f.status] ?? f.status);
/** 브라우저 저장본은 원본 파일이 없으므로 확장자 없이 문서 이름만 */
export const shownName = (f: DemoFile) => (f.origin === "local" ? f.title : f.displayFileName);

export function FileIcon({ kind }: { kind: DemoFile["kind"] }) {
  return <span className={`dm-ficon ${kind}`} aria-hidden="true">{kind === "pdf" ? "PDF" : "DOCX"}</span>;
}

/** 로딩·오류 상태를 화면에 보여 준다. ready 일 때는 children 을 그린다. */
export function DemoGate({ demo, children, compact }: { demo: DemoState; children: (s: Scenario) => ReactNode; compact?: boolean }) {
  if (demo.status === "ready") return <>{children(demo.s)}</>;
  if (demo.status === "loading") return <div className={`dm-state ${compact ? "compact" : ""}`} role="status"><i className="dm-spin" />자료를 불러오는 중이에요</div>;
  return <div className={`dm-state error ${compact ? "compact" : ""}`} role="alert">
    <b>자료를 불러오지 못했어요</b><span>{demo.error}</span>
    <button type="button" onClick={demo.retry}>다시 시도</button>
  </div>;
}

/** 확정 전 확인 대화상자. busy 동안 버튼을 막아 중복 실행을 막는다. */
export function ConfirmDialog({ title, children, confirmLabel, onConfirm, onCancel, error }: {
  title: string; children?: ReactNode; confirmLabel: string; onConfirm: () => void | Promise<void>; onCancel: () => void; error?: string;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus(); const k = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onCancel(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [busy, onCancel]);
  return <div className="dm-modal" data-no-lift role="presentation" onClick={() => !busy && onCancel()}>
    <div ref={ref} tabIndex={-1} className="dm-dialog" role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()}>
      <h2>{title}</h2>
      {children}
      {error && <p className="dm-error" role="alert">{error}</p>}
      <div className="dm-dialog-actions">
        <button type="button" className="dm-btn ghost" disabled={busy} onClick={onCancel}>취소</button>
        <button type="button" className="dm-btn primary" disabled={busy} onClick={async () => { if (busy) return; setBusy(true); try { await onConfirm(); } finally { setBusy(false); } }}>{busy ? "기록하는 중…" : confirmLabel}</button>
      </div>
    </div>
  </div>;
}

// ---------------------------------------------------------------- 파일 뷰어

type PathState = "checking" | "ok" | "missing";
function usePathCheck(url: string | null): PathState {
  const [state, setState] = useState<PathState>(url ? "checking" : "ok");
  useEffect(() => {
    if (!url) { setState("ok"); return; }
    let alive = true; setState("checking");
    fetch(url, { method: "HEAD", cache: "no-cache" })
      .then(r => { const t = r.headers.get("content-type") || ""; alive && setState(r.ok && !t.includes("text/html") ? "ok" : "missing"); })
      .catch(() => alive && setState("missing"));
    return () => { alive = false; };
  }, [url]);
  return state;
}

function FileBody({ s, file, onOpen }: { s: Scenario; file: DemoFile; onOpen: (id: string) => void }) {
  const path = usePathCheck(file.url);
  const [making, setMaking] = useState(false);
  const [makeError, setMakeError] = useState("");
  const openSaved = async () => {
    if (making) return;
    setMaking(true); setMakeError("");
    try { await openSavedDocx(file); }
    catch (e) { setMakeError(`DOCX 파일을 만들지 못했어요: ${e instanceof Error ? e.message : String(e)}`); }
    finally { setMaking(false); }
  };
  const project = projectOf(s, file.projectId);
  const versions = file.documentId ? versionsOf(s, file.projectId, file.documentId) : [];
  const shares = sharesOfFile(s, file);
  return <>
    <section className="dm-meta">
      <div className="dm-meta-top"><FileIcon kind={file.kind} /><div><b>{file.title}</b><span>{project?.name} · {nameOf(s, file.ownerId)}{roleOf(s, file.projectId, file.ownerId) && ` (${roleOf(s, file.projectId, file.ownerId)})`}</span></div></div>
      <div className="dm-tags">
        {file.version && <span className="dm-tag strong">{versionLabel(file)}</span>}
        <span className="dm-tag">{statusOf(s, file)}</span>
        {file.createdAt && <span className="dm-tag">{stampOf(file.createdAt)} 저장</span>}
      </div>
      {file.origin === "sample" && path === "checking" && <p className="dm-note" role="status">파일 경로를 확인하는 중이에요…</p>}
      {file.origin === "sample" && path === "missing" && <p className="dm-error" role="alert">파일 경로를 열 수 없어요: {file.url}<br />본문은 아래에서 읽을 수 있어요.</p>}
      {file.origin === "sample" && path === "ok" && file.url && <div className="dm-actions">
        {/* 실제 파일 주소를 연다: PDF 는 브라우저의 PDF 뷰어, DOCX 는 기기의 문서 앱(Word·Pages, iPhone 은 미리보기) */}
        <a className="dm-btn primary" href={file.url} target="_blank" rel="noopener" type={file.mimeType}>{file.kind === "pdf" ? "PDF 열기" : "DOCX로 열기"}</a>
      </div>}
      {file.origin === "local" && <>
        <div className="dm-actions"><button type="button" className="dm-btn primary" disabled={making} onClick={openSaved}>{making ? "파일을 만드는 중…" : "DOCX로 열기"}</button></div>
        <p className="dm-note">이 브라우저에 저장한 버전이에요. 누르면 저장한 내용으로 DOCX 파일을 만들어 Word·Pages 같은 앱에서 열 수 있어요.</p>
        {makeError && <p className="dm-error" role="alert">{makeError}</p>}
      </>}
    </section>
    {versions.length > 1 && <section className="dm-block">
      <h3>버전</h3>
      <ul className="dm-list">{versions.map(v => <li key={v.id} className={v.id === file.id ? "on" : ""}>
        <span className="dm-tag strong">{versionLabel(v)}</span><span className="dm-grow">{v.title}<small>{STATUS_LABEL[v.status] ?? v.status}{v.createdAt ? ` · ${stampOf(v.createdAt)}` : ""}</small></span>
        {v.id !== file.id ? <button type="button" className="dm-link" onClick={() => onOpen(v.id)}>열기</button> : <small>보는 중</small>}
      </li>)}</ul>
    </section>}
    <section className="dm-block">
      <h3>본문 {file.kind === "pdf" && <small>(텍스트 추출본)</small>}</h3>
      {file.sections.map(sec => <div key={sec.heading} className="dm-sec"><h4>{sec.heading}</h4><p>{sec.body}</p></div>)}
    </section>
    <section className="dm-block">
      <h3>공유 이력</h3>
      {shares.length ? <ul className="dm-list">{shares.map(x => <li key={x.id}>
        <Avatar s={s} id={x.senderId} size={26} />
        <span className="dm-grow">{nameOf(s, x.senderId)} → {x.recipientIds.map(r => nameOf(s, r)).join(", ")}<small>{stampOf(x.sharedAt)}{x.origin === "local" ? " · 이 브라우저 기록" : ""}</small></span>
      </li>)}</ul> : <p className="dm-note">아직 공유하지 않았어요.</p>}
    </section>
    {s.fictional && <p className="dm-foot-note">시연용 가상 자료예요.</p>}
  </>;
}

/** 화면마다 한 번 붙여 두면 openFile(fileId) 로 어디서든 연다. */
export function FileViewerHost() {
  const demo = useDemo();
  const [stack, setStack] = useState<string[]>([]);
  useEffect(() => onOpenFile(id => setStack(st => [...st, id])), []);
  useEffect(() => {
    if (!stack.length) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setStack(st => st.slice(0, -1)); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [stack.length]);
  if (!stack.length) return null;
  const id = stack[stack.length - 1];
  const file = demo.status === "ready" ? fileById(demo.s, id) : undefined;
  return <div className="dm-viewer" data-no-lift role="dialog" aria-modal="true" aria-label={file ? shownName(file) : "파일"}>
    <header className="dm-viewer-head">
      <button type="button" className="dm-back" aria-label="뒤로가기" onClick={() => setStack(st => st.slice(0, -1))}><img src="/assets/revision/back.svg" alt="" /></button>
      <h1>{file ? shownName(file) : "파일"}</h1>
      <button type="button" className="dm-back" aria-label="닫기" onClick={() => setStack([])}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13" /></svg></button>
    </header>
    <div className="dm-viewer-body">
      <DemoGate demo={demo}>{s => file
        ? <FileBody key={file.id} s={s} file={file} onOpen={next => setStack(st => [...st, next])} />
        : <div className="dm-state error" role="alert"><b>파일 정보를 찾을 수 없어요</b><span>fileId: {id}</span></div>}</DemoGate>
    </div>
  </div>;
}

/** 파일 한 줄 (이름 + 열기). 같은 fileId 는 어디서든 같은 뷰어로 열린다. */
export function FileRow({ s, file, onOpen, extra }: { s: Scenario; file: DemoFile; onOpen: () => void; extra?: ReactNode }) {
  return <div className="dm-frow">
    <FileIcon kind={file.kind} />
    <span className="dm-grow"><b>{shownName(file)}</b><small>{versionLabel(file) && `${versionLabel(file)} · `}{statusOf(s, file)} · {nameOf(s, file.ownerId)}</small>{extra}</span>
    <button type="button" className="dm-link" onClick={onOpen}>열기</button>
  </div>;
}
