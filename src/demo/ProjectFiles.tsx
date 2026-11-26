/* 프로젝트 파일 목록 · 개인별 공유 내역 시트. 선택한 프로젝트 ID 의 파일과 공유 기록만 보여 준다. */
import { useEffect, useRef, useState } from "react";
import { openFile, useDemo } from "./useDemo";
import { Avatar, DemoGate, FileRow, shownName } from "./DemoUI";
import { nameOf, projectOf, resetDemo, sharesOf, visibleFiles } from "./demoStore";
import { stampOf, type DemoShare, type Scenario } from "./scenario";

type Tab = "files" | "received" | "sent";

function ShareLine({ s, x }: { s: Scenario; x: DemoShare }) {
  return <small className="dm-share-line">{nameOf(s, x.senderId)} → {x.recipientIds.map(r => nameOf(s, r)).join(", ")} · {stampOf(x.sharedAt)}{x.origin === "local" ? " · 이 브라우저 기록" : ""}</small>;
}

function Content({ s, projectId, focusFileIds }: { s: Scenario; projectId: string | null; focusFileIds?: string[] }) {
  const [tab, setTab] = useState<Tab>("files");
  const [resetAsk, setResetAsk] = useState(false);
  if (!projectId) return <div className="dm-state">이 프로젝트에는 아직 연결된 파일이 없어요.<small style={{ color: "#a9b1c1" }}>시연 데이터는 마케팅 공모전 · 청년 도움 · 자원순환 · 아동자립캠프 · 개발 프로젝트에 있어요.</small></div>;
  const files = visibleFiles(s, projectId).filter(f => !focusFileIds || focusFileIds.includes(f.id));
  const shares = sharesOf(s, projectId);
  const me = s.viewerId;
  const received = shares.filter(x => x.recipientIds.includes(me)).reverse();
  const sent = shares.filter(x => x.senderId === me).reverse();
  const title = (id: string) => { const f = visibleFiles(s, projectId).find(x => x.id === id); return f ? shownName(f) : id; };
  const shareList = (list: DemoShare[], empty: string) => list.length
    ? <ul className="dm-list">{list.map(x => <li key={x.id}><Avatar s={s} id={x.senderId === me ? x.recipientIds[0] : x.senderId} size={30} />
      <span className="dm-grow"><b>{title(x.fileId)}</b><ShareLine s={s} x={x} /></span>
      <button type="button" className="dm-link" onClick={() => openFile(x.fileId)}>열기</button></li>)}</ul>
    : <p className="dm-note">{empty}</p>;
  return <>
    {!focusFileIds && <div className="dm-tabs" role="tablist">
      {([["files", `파일 ${files.length}`], ["received", `받은 공유 ${received.length}`], ["sent", `보낸 공유 ${sent.length}`]] as const).map(([k, label]) =>
        <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>)}
    </div>}
    {tab === "files" && (files.length ? files.map(f => {
      const fs = shares.filter(x => x.fileId === f.id);
      return <FileRow key={f.id} s={s} file={f} onOpen={() => openFile(f.id)} extra={fs.length ? fs.map(x => <ShareLine key={x.id} s={s} x={x} />) : <small className="dm-share-line muted">공유 기록 없음</small>} />;
    }) : <p className="dm-note">이 프로젝트에는 아직 파일이 없어요.</p>)}
    {tab === "received" && shareList(received, `${nameOf(s, me)}님이 받은 공유가 없어요.`)}
    {tab === "sent" && shareList(sent, `${nameOf(s, me)}님이 보낸 공유가 아직 없어요. 팝업에서 공유를 확정하면 여기에 기록돼요.`)}
    {!focusFileIds && <div className="dm-reset">
      {resetAsk ? <><span>이 브라우저의 데모 기록(저장 버전·공유·세션·피드백)을 지울까요?</span>
        <button type="button" className="dm-link" onClick={() => { resetDemo(); setResetAsk(false); }}>지우기</button>
        <button type="button" className="dm-link" onClick={() => setResetAsk(false)}>취소</button></>
        : <button type="button" className="dm-link" onClick={() => setResetAsk(true)}>데모 기록 초기화</button>}
    </div>}
  </>;
}

/** projectId 가 null 이면 빈 프로젝트 안내. focusFileIds 를 주면 그 파일만 보여 준다(활동 카드). */
export function ProjectFilesSheet({ projectId, title, focusFileIds, onClose }: { projectId: string | null; title?: string; focusFileIds?: string[]; onClose: () => void }) {
  const demo = useDemo();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus(); const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [onClose]);
  const name = demo.status === "ready" && projectId ? projectOf(demo.s, projectId)?.name : null;
  return <div className="dm-sheet-layer" data-no-lift>
    <div className="dm-sheet-dim" onClick={onClose} />
    <div ref={ref} tabIndex={-1} className="dm-sheet" role="dialog" aria-modal="true" aria-label={title ?? "프로젝트 파일"}>
      <div className="dm-sheet-head"><div><small>{name ?? "프로젝트"}</small><h2>{title ?? "파일과 공유 내역"}</h2></div>
        <button type="button" className="dm-back" aria-label="닫기" onClick={onClose}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13" /></svg></button></div>
      <div className="dm-sheet-body"><DemoGate demo={demo}>{s => <Content s={s} projectId={projectId} focusFileIds={focusFileIds} />}</DemoGate></div>
    </div>
  </div>;
}
