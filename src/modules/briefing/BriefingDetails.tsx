/* 브리핑 Before / Now / Next 상세. 내용은 모두 scenario.json(briefing·events·files·tasks)에서 온다. */
import type { ReactNode } from "react";
import { openFile } from "../../demo/useDemo";
import { Avatar, FileIcon, versionLabel, statusOf, shownName } from "../../demo/DemoUI";
import { eventsOf, fileById, nameOf, projectOf, taskOf } from "../../demo/demoStore";
import { dotOf, dueLabel, hhmmOf, koreanDateOf, mmddOf, stampOf, type DemoFile, type Scenario } from "../../demo/scenario";
import { changeKind, planDocs, planShare, referenceState } from "./planData";
import "./briefingDetails.css";

const sectionOf = (f: DemoFile | undefined, heading: string) => f?.sections.find(x => x.heading === heading)?.body;

/** 다이얼 카드 4장(Before · Now · Next · Extra) 문구 */
export function buildSteps(sc: Scenario | null) {
  if (!sc) return [
    { label: "Before", title: "회의 진행", body: ["자료를 불러오는 중이에요", ""] },
    { label: "Now", title: "수정 기획안 확인", body: ["자료를 불러오는 중이에요", ""] },
    { label: "Next", title: "다음 할 일", body: ["자료를 불러오는 중이에요", ""] },
    { label: "Extra", title: "그다음 할 일", body: ["자료를 불러오는 중이에요", ""] },
  ];
  const b = sc.briefing;
  const before = b.before.eventIds.map(id => eventsOf(sc, b.projectId).find(e => e.id === id)).filter(Boolean);
  const actors = [...new Set(before.map(e => e!.actorId))].map(id => `${nameOf(sc, id)}님`);
  const firstAt = before[0]?.at ?? sc.demoNow;
  const plan = planDocs(sc);
  const ref = referenceState(sc);
  const shared = planShare(sc);
  const [t1, t2, t3] = b.next.taskIds.map(id => taskOf(sc, id));
  const blocked = t3 && t3.status === "blocked";
  return [
    { label: "Before", title: `${dotOf(firstAt)} 회의 진행`, body: [`${mmddOf(firstAt)} ${actors.join("과 ")}이`, "기획안 회의와 자료조사를 했어요"] },
    { label: "Now", title: "수정 기획안 확인", body: [`${plan?.meetingAt ? koreanDateOf(plan.meetingAt) : ""} 회의를 기반으로`, "Plotto가 기획안을 수정했어요"] },
    { label: "Next", title: shared ? "기획안 공유 완료" : "기획안 확인과 공유", body: [ref?.share ? "레퍼런스 전달도 마쳤어요" : `레퍼런스 ${ref ? ref.recipients.map(r => nameOf(sc, r)).join("·") + "님 " : ""}전달 대기`, t1?.dueAt ? `오늘 ${hhmmOf(t1.dueAt)}까지 확인해요` : "확인이 필요해요"] },
    { label: "Extra", title: t3 ? t3.title.replace("대표 사례와 원문 출처 확정", "대표 사례·출처 확정") : (t2?.title ?? ""), body: [t3 ? `${t3.assigneeIds.map(a => nameOf(sc, a) + "님").join("·")} 담당이에요` : "", blocked ? "실제 원문 링크가 아직 없어요" : ""] },
  ];
}

function Shell({ s, label, title, subtitle, children }: { s: number; label: string; title: string; subtitle: string; children: ReactNode }) {
  return <>
    <p className="absolute font-['Pretendard'] font-bold text-white whitespace-nowrap" style={{ left: 27 * s, top: 279 * s, fontSize: 17 * s, lineHeight: 1.412 }}>{label}</p>
    <div className="bf-card" style={{ left: 20 * s, right: 20 * s, top: 315 * s }}>
      <div className="bf-head"><h2>{title}</h2><p>{subtitle}</p></div>
      <div className="bf-body">{children}</div>
    </div>
  </>;
}
function FileLine({ sc, id, badge }: { sc: Scenario; id: string; badge?: string }) {
  const f = fileById(sc, id);
  if (!f) return <p className="bf-missing" role="alert">파일을 찾을 수 없어요 ({id})</p>;
  return <button type="button" className="bf-file" onClick={() => openFile(f.id)}>
    <FileIcon kind={f.kind} />
    <span className="bf-grow"><b>{shownName(f)}</b><small>{versionLabel(f) && `${versionLabel(f)} · `}{badge ?? statusOf(sc, f)} · {nameOf(sc, f.ownerId)}</small></span>
    <span className="bf-open">열기</span>
  </button>;
}

export function BeforeDetail({ s, sc }: { s: number; sc: Scenario }) {
  const b = sc.briefing;
  const events = b.before.eventIds.map(id => eventsOf(sc, b.projectId).find(e => e.id === id)).filter((e): e is NonNullable<typeof e> => !!e);
  const files = b.before.fileIds.map(id => fileById(sc, id));
  const meeting = files.find(f => f && f.sections.some(x => x.heading === "합의 사항"));
  const research = files.find(f => f && f.sections.some(x => x.heading === "확인이 필요한 부분"));
  const since = sc.lastSeen.find(l => l.projectId === b.projectId && l.userId === sc.viewerId)?.at;
  return <Shell s={s} label="Before" title={`${dotOf(events[0]?.at ?? sc.demoNow)} 회의 진행`} subtitle={`${nameOf(sc, sc.viewerId)}님이 자리를 비운 동안${since ? ` (${stampOf(since)} 이후)` : ""} 정해진 내용이에요`}>
    <ul className="bf-events">
      {events.map(e => <li key={e.id}><Avatar s={sc} id={e.actorId} size={30} /><div><b>{nameOf(sc, e.actorId)} <small>{stampOf(e.at)}</small></b><p>{e.summary}</p></div></li>)}
    </ul>
    {meeting && sectionOf(meeting, "합의 사항") && <div className="bf-box"><h3>누가 무엇을 정했나요 <small>{meeting.title}</small></h3><p>{sectionOf(meeting, "합의 사항")}</p></div>}
    {research && sectionOf(research, "조사 기준") && <div className="bf-box"><h3>{nameOf(sc, research.ownerId)}님의 조사 기준 <small>{research.title}</small></h3><p>{sectionOf(research, "조사 기준")}</p></div>}
    {research && sectionOf(research, "확인이 필요한 부분") && <div className="bf-box warn"><h3>남은 출처 확인</h3><p>{sectionOf(research, "확인이 필요한 부분")}</p></div>}
    <div className="bf-files">{b.before.fileIds.map(id => <FileLine key={id} sc={sc} id={id} />)}</div>
  </Shell>;
}

export function NowDetail({ s, sc, onCompare }: { s: number; sc: Scenario; onCompare: () => void }) {
  const d = planDocs(sc);
  const b = sc.briefing;
  if (!d) return <Shell s={s} label="NOW" title="수정 기획안 확인" subtitle=""><p className="bf-missing" role="alert">기획안 V1·V2 데이터를 찾지 못했어요.</p></Shell>;
  const { current, proposal, headings, bodyOf, meetingAt } = d;
  const others = b.now.eventIds.map(id => eventsOf(sc, b.projectId).find(e => e.id === id)).filter(e => e && e.type !== "revision_proposed");
  return <Shell s={s} label="NOW" title="수정 기획안 확인" subtitle={`${meetingAt ? dotOf(meetingAt) + " " : ""}회의를 기반으로 Plotto가 기획안을 수정했어요`}>
    <div className="bf-files">
      <FileLine sc={sc} id={current.id} badge={current.origin === "local" ? "현재 버전 · 저장본" : "현재 버전 · 원본"} />
      <FileLine sc={sc} id={proposal.id} badge="플로토 수정 제안" />
    </div>
    <div className="bf-box"><h3>어떤 내용이 바뀌었나요? <small>V{current.version} → V{proposal.version}</small></h3>
      <ul className="bf-changes">{headings.map(h => {
        const k = changeKind(bodyOf(current, h), bodyOf(proposal, h));
        return <li key={h}><b>{h}</b><span className={`bf-tag ${k}`}>{k === "same" ? "변경 없음" : k === "kept" ? "범위 유지 · 내용 보완" : "문장 수정"}</span></li>;
      })}</ul>
    </div>
    <button type="button" className="bf-primary" onClick={onCompare}>수정 제안 {headings.length}개 비교하기</button>
    {others.map(e => e && <div key={e.id} className="bf-box"><h3>{nameOf(sc, e.actorId)}님 · {stampOf(e.at)}</h3><p>{e.summary}</p>
      <div className="bf-files">{e.fileIds.map(id => <FileLine key={id} sc={sc} id={id} />)}</div></div>)}
  </Shell>;
}

export function NextDetail({ s, sc, onCompare, onReference }: { s: number; sc: Scenario; onCompare: () => void; onReference: () => void }) {
  const b = sc.briefing;
  const shared = planShare(sc);
  const ref = referenceState(sc);
  return <Shell s={s} label="Next" title="다음 할 일" subtitle={`${projectOf(sc, b.projectId)?.name} · ${mmddOf(sc.demoNow)} 기준`}>
    <ol className="bf-tasks">{b.next.taskIds.map(id => {
      const t = taskOf(sc, id);
      if (!t) return null;
      let state = "", tone = "", action: ReactNode = null;
      if (t.status === "needs_review") {
        state = shared ? `공유 완료 · ${shared.recipientIds.map(r => nameOf(sc, r)).join("·")}` : "확인 필요";
        tone = shared ? "ok" : "warn";
        action = !shared && <button type="button" className="bf-primary small" onClick={onCompare}>수정안 확인하고 공유하기</button>;
      } else if (t.status === "awaiting_share") {
        state = ref?.share ? `전달 완료 · ${stampOf(ref.share.sharedAt)}` : `전달 대기 · ${ref?.recipients.map(r => nameOf(sc, r)).join("·")}님`;
        tone = ref?.share ? "ok" : "wait";
        action = !ref?.share && <button type="button" className="bf-primary small" onClick={onReference}>전달 확인하기</button>;
      } else if (t.status === "blocked") { state = "막힘"; tone = "warn"; }
      return <li key={t.id}>
        <div className="bf-task-top"><b>{t.title}</b><span className={`bf-tag ${tone}`}>{state}</span></div>
        <small>{t.assigneeIds.map(a => nameOf(sc, a)).join("·")} 담당{t.dueAt ? ` · ${dueLabel(sc.demoNow, t.dueAt)} ${hhmmOf(t.dueAt)}까지` : ""}</small>
        {t.reason && <p>{t.reason}</p>}
        {t.status === "blocked" && <div className="bf-files">{t.fileIds.map(fid => <FileLine key={fid} sc={sc} id={fid} />)}</div>}
        {action}
      </li>;
    })}</ol>
  </Shell>;
}
