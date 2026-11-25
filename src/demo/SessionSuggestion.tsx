/* 공동세션 제안 시트: 참여자 · 제안 이유 · 근거 자료 · 안건 · 초대 문안 · 후보 시간.
   이번 로컬 데모의 응답은 mockSuggestions 에서 읽고(demoStore.suggestionsFor), 사용자가 '확정'해야 기록이 생긴다. */
import { useEffect, useRef, useState } from "react";
import { openFile, useDemo } from "./useDemo";
import { Avatar, DemoGate, FileRow } from "./DemoUI";
import { confirmSession, eventsOf, fileById, nameOf, projectOf, roleOf, sessionsOf, suggestionsFor, type SessionRecord } from "./demoStore";
import { hhmmOf, mmddDayOf, stampOf, type Scenario, type Slot } from "./scenario";
import { currentDemoProjectId } from "./currentProject";

const EVENT_LABEL: Record<string, string> = { meeting_logged: "회의 기록", file_shared: "파일 공유", revision_proposed: "수정 제안", file_prepared: "파일 준비", version_saved: "버전 저장" };
export const slotLabel = (slot: Slot | null) => (slot ? `${mmddDayOf(slot.startAt)} ${hhmmOf(slot.startAt)}–${hhmmOf(slot.endAt)}` : "시간 미정");

function InputSummary({ s, projectId }: { s: Scenario; projectId: string }) {
  const input = suggestionsFor(s, projectId).input;
  return <details className="dm-input-summary">
    <summary>제안에 쓴 입력 보기</summary>
    <ul>
      <li>미열람 활동 {input.unseenEvents.length}건{input.since ? ` (${stampOf(input.since)} 이후)` : ""}: {input.unseenEvents.map(e => `${nameOf(s, e.actorId)} ${EVENT_LABEL[e.type] ?? e.type}`).join(", ") || "없음"}</li>
      <li>연관 파일 본문 {input.files.length}개: {input.files.map(f => `${f.title}${f.version ? ` V${f.version}` : ""}`).join(", ")}</li>
      <li>사용자 의견: {input.opinion ? `“${input.opinion.text}”` : "없음"}</li>
      <li>팀원 역할: {input.members.map(m => `${m.name}(${m.role || "역할 없음"})`).join(", ")}</li>
      <li>가능 시간: {input.availability.map(a => `${nameOf(s, a.userId)} ${hhmmOf(a.startAt)}–${hhmmOf(a.endAt)}`).join(", ") || "확인된 시간 없음"}</li>
    </ul>
    <p>저장 후 예시(V3)와 제안 예시는 입력에 넣지 않아요.</p>
  </details>;
}

function Body({ s, projectId, onClose, onConfirmed }: { s: Scenario; projectId: string | null; onClose: () => void; onConfirmed: (rec: SessionRecord) => void }) {
  const sug = projectId ? suggestionsFor(s, projectId) : null;
  const base = sug?.session ?? null;
  const done = projectId ? sessionsOf(s, projectId).find(r => base && r.evidenceFileIds.join("+") === base.evidenceFileIds.join("+")) : undefined;
  const [agenda, setAgenda] = useState<string[]>(() => base?.agenda ?? []);
  const [invite, setInvite] = useState(() => base?.inviteDraft ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!projectId || !base) return <>
    <div className="dm-sheet-body"><div className="dm-state">{sug?.none ?? "이 프로젝트에는 제안할 근거 자료가 아직 없어요."}<small style={{ color: "#a9b1c1" }}>근거가 없는 프로젝트에는 다른 프로젝트의 제안을 보여 주지 않아요.</small></div></div>
    <div className="dm-sheet-foot"><button type="button" className="dm-btn ghost" onClick={onClose}>닫기</button></div>
  </>;
  const evidenceEvents = base.evidenceEventIds.map(id => eventsOf(s, projectId).find(e => e.id === id)).filter(Boolean);
  const confirm = () => {
    if (busy) return;
    setBusy(true);
    const r = confirmSession(s, { ...base, agenda, inviteDraft: invite });
    setBusy(false);
    if (!r.ok) { setError(r.error); return; }
    onConfirmed(r.value);
  };
  return <>
    <div className="dm-sheet-body">
      {done && <div className="dm-done" role="status"><span>✓</span><div><b>{stampOf(done.at)}에 확정한 세션이에요</b>데모 기록에만 남았고 실제 초대는 보내지 않았어요.</div></div>}
      <section className="dm-block"><h3>제안 이유</h3><p className="dm-reason">{base.reason}</p></section>
      <section className="dm-block"><h3>참여자</h3>
        <div className="dm-people">{base.participantIds.map(p => <span key={p} className="dm-person"><Avatar s={s} id={p} size={28} />{nameOf(s, p)}<small>{roleOf(s, projectId, p)}</small></span>)}</div>
      </section>
      <section className="dm-block"><h3>근거 자료</h3>
        {base.evidenceFileIds.map(id => { const f = fileById(s, id); return f ? <FileRow key={id} s={s} file={f} onOpen={() => openFile(id)} /> : <p key={id} className="dm-error">근거 파일을 찾을 수 없어요 ({id})</p>; })}
        {evidenceEvents.map(e => e && <p key={e.id} className="dm-note">{stampOf(e.at)} · {e.summary}</p>)}
      </section>
      <section className="dm-block"><h3>안건</h3>
        <div className="dm-agenda">{agenda.map((a, i) => <input key={i} className="dm-input" aria-label={`안건 ${i + 1}`} value={a} onChange={e => setAgenda(list => list.map((x, j) => (j === i ? e.target.value : x)))} />)}</div>
      </section>
      <section className="dm-block"><h3>후보 시간</h3>
        <div className="dm-tags"><span className={`dm-tag ${base.slot ? "strong" : "warn"}`}>{slotLabel(base.slot)}</span>{base.slot && <span className="dm-tag ok">{base.participantIds.map(p => nameOf(s, p)).join("·")} 모두 가능</span>}</div>
        {base.issues.map(x => <p key={x} className="dm-note">{x}</p>)}
      </section>
      <section className="dm-block"><h3>초대 문안 <small>직접 고칠 수 있어요</small></h3>
        <textarea className="dm-field" aria-label="초대 문안" value={invite} onChange={e => setInvite(e.target.value)} />
        <p className="dm-note">확정하면 세션 기록과 활동에 남아요. 로컬 데모라 실제 초대 메시지는 보내지 않아요.</p>
      </section>
      <InputSummary s={s} projectId={projectId} />
      {error && <p className="dm-error" role="alert">{error}</p>}
    </div>
    <div className="dm-sheet-foot">
      <button type="button" className="dm-btn ghost" onClick={onClose}>닫기</button>
      <button type="button" className="dm-btn primary" disabled={busy} onClick={done ? () => onConfirmed(done) : confirm}>{done ? "세션 이어서 보기" : busy ? "기록하는 중…" : "이 내용으로 확정"}</button>
    </div>
  </>;
}

export function SessionSuggestionSheet({ onClose, onConfirmed }: { onClose: () => void; onConfirmed: (rec: SessionRecord) => void }) {
  const demo = useDemo();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus(); const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [onClose]);
  const projectId = demo.status === "ready" ? currentDemoProjectId(demo.s) : null;
  const title = demo.status === "ready" && projectId ? suggestionsFor(demo.s, projectId).session?.title : undefined;
  return <div className="dm-sheet-layer" data-no-lift>
    <div className="dm-sheet-dim" onClick={onClose} />
    <div ref={ref} tabIndex={-1} className="dm-sheet" role="dialog" aria-modal="true" aria-label="공동세션 제안">
      <div className="dm-sheet-head"><div><small>✦ 공동세션 제안{demo.status === "ready" && projectId ? ` · ${projectOf(demo.s, projectId)?.name}` : ""}</small><h2>{title ?? "공동세션"}</h2></div>
        <button type="button" className="dm-back" aria-label="닫기" onClick={onClose}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13" /></svg></button></div>
      {demo.status === "ready" ? <Body s={demo.s} projectId={projectId} onClose={onClose} onConfirmed={onConfirmed} />
        : <div className="dm-sheet-body"><DemoGate demo={demo}>{() => null}</DemoGate></div>}
    </div>
  </div>;
}
