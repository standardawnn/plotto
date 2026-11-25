/**
 * 데모 기록 (브라우저 저장소) + 화면용 조회 함수.
 *
 * 서버가 없는 로컬 데모라서, 사용자가 확정한 동작만 이 브라우저의 localStorage 에 남긴다.
 * - 문서 버전: 프로젝트·사용자·문서별 키  plotto-demo:v1:{projectId}:{userId}:doc:{documentId}
 * - 활동(공유·세션·피드백 기록·이벤트): 프로젝트·사용자별 키  plotto-demo:v1:{projectId}:{userId}:activity
 * 기존 버전은 지우거나 덮어쓰지 않는다. 저장은 새 버전 추가만 한다.
 * 같은 내용을 다시 저장하거나 버튼을 빠르게 여러 번 눌러도 버전·공유·기록이 중복으로 생기지 않는다.
 * 실제 팀원에게 메시지를 보내지 않는다. 기록의 상태 이름도 sent 가 아니라 recorded 다.
 */
import type { DemoEvent, DemoFile, DemoShare, Scenario, Section, SessionSuggestion, FeedbackSuggestion, Slot } from "./scenario";

const PREFIX = "plotto-demo:v1";
const CLOCK_KEY = `${PREFIX}:clock`;

export type SavedVersion = {
  id: string; projectId: string; documentId: string; version: number; title: string;
  sections: Section[]; baseFileId: string; authorId: string; at: string; savedAtReal: string; source: "edit" | "apply";
};
export type SessionRecord = {
  id: string; projectId: string; title: string; reason: string; participantIds: string[]; agenda: string[];
  inviteDraft: string; slot: Slot | null; evidenceFileIds: string[]; evidenceEventIds: string[]; status: "recorded"; at: string;
};
export type FeedbackRecord = { id: string; projectId: string; inputId: string; recipientId: string; draft: string; evidenceFileIds: string[]; status: "recorded"; at: string };
type Activity = { events: DemoEvent[]; shares: DemoShare[]; sessions: SessionRecord[]; feedback: FeedbackRecord[] };
type Result<T> = { ok: true; value: T; duplicate?: boolean } | { ok: false; error: string };

// ---------------------------------------------------------------- 저장소 접근

function ls(): Storage | null { try { return window.localStorage; } catch { return null; } }
function read<T>(key: string, fallback: T): T {
  try { const raw = ls()?.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
}
function write(key: string, value: unknown): boolean {
  const s = ls(); if (!s) return false;
  try { s.setItem(key, JSON.stringify(value)); return s.getItem(key) !== null; } catch { return false; }
}
function restore(key: string, raw: string | null) {
  const s = ls(); if (!s) return;
  try { if (raw === null) s.removeItem(key); else s.setItem(key, raw); } catch { /* 되돌리기 실패는 다음 읽기에서 그대로 보인다 */ }
}
/** 여러 키를 순서대로 쓰고, 하나라도 실패하면 앞서 쓴 키를 되돌린다. */
function commit(writes: { key: string; value: unknown }[]): boolean {
  const s = ls(); if (!s) return false;
  const before = writes.map(w => { try { return s.getItem(w.key); } catch { return null; } });
  for (let i = 0; i < writes.length; i++) {
    if (!write(writes[i].key, writes[i].value)) { for (let j = i; j >= 0; j--) restore(writes[j].key, before[j]); return false; }
  }
  return true;
}

const docKey = (projectId: string, userId: string, documentId: string) => `${PREFIX}:${projectId}:${userId}:doc:${documentId}`;
const actKey = (projectId: string, userId: string) => `${PREFIX}:${projectId}:${userId}:activity`;
const emptyActivity = (): Activity => ({ events: [], shares: [], sessions: [], feedback: [] });
function readActivity(projectId: string, userId: string): Activity {
  const a = read<Partial<Activity>>(actKey(projectId, userId), {});
  return { events: Array.isArray(a.events) ? a.events : [], shares: Array.isArray(a.shares) ? a.shares : [],
    sessions: Array.isArray(a.sessions) ? a.sessions : [], feedback: Array.isArray(a.feedback) ? a.feedback : [] };
}
function readVersions(projectId: string, userId: string, documentId: string): SavedVersion[] {
  const v = read<unknown>(docKey(projectId, userId, documentId), []);
  return Array.isArray(v) ? (v as SavedVersion[]).filter(x => x && typeof x.id === "string" && Array.isArray(x.sections)) : [];
}

export function storageAvailable() { const s = ls(); if (!s) return false; try { s.setItem(`${PREFIX}:probe`, "1"); s.removeItem(`${PREFIX}:probe`); return true; } catch { return false; } }

// ---------------------------------------------------------------- 데모 시계

/**
 * 시연 기준 시각(demoNow)부터 흘러가는 시계. 처음 연 순간을 demoNow 로 두고 실제 경과 시간만큼 더한다.
 * 저장·공유 기록의 시각이 10/15 09:30 시나리오 뒤에 자연스럽게 이어지도록 한다.
 */
export function demoClock(s: Scenario): string {
  let origin = read<number | null>(CLOCK_KEY, null);
  if (typeof origin !== "number") { origin = Date.now(); write(CLOCK_KEY, origin); }
  return new Date(Date.parse(s.demoNow) + Math.max(0, Date.now() - origin)).toISOString();
}

// ---------------------------------------------------------------- 변경 알림 (같은 페이지 + 다른 탭)

const listeners = new Set<() => void>();
export function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => { if (!e.key || e.key.startsWith(PREFIX)) fn(); };
  addEventListener("storage", onStorage);
  return () => { listeners.delete(fn); removeEventListener("storage", onStorage); };
}
const notify = () => listeners.forEach(fn => fn());

/** 데모 기록을 모두 지운다(샘플 데이터는 그대로). */
export function resetDemo() {
  const s = ls(); if (!s) return false;
  try { Object.keys(s).filter(k => k.startsWith(PREFIX)).forEach(k => s.removeItem(k)); } catch { return false; }
  notify(); return true;
}

// ---------------------------------------------------------------- 조회

export const person = (s: Scenario, id: string) => s.people.find(p => p.id === id);
export const nameOf = (s: Scenario, id: string) => (id === "plotto" ? "플로토" : person(s, id)?.name ?? id);
export const roleOf = (s: Scenario, projectId: string, id: string) => person(s, id)?.rolesByProject[projectId] ?? "";
export const projectOf = (s: Scenario, id: string) => s.projects.find(p => p.id === id);
export const isMember = (s: Scenario, projectId: string, id: string) => !!projectOf(s, projectId)?.memberIds.includes(id);

function savedToFile(s: Scenario, v: SavedVersion): DemoFile {
  return {
    id: v.id, projectId: v.projectId, documentId: v.documentId, version: v.version, title: v.title,
    displayFileName: `${v.title}.txt`, url: null, mimeType: "text/plain", kind: "saved", ownerId: v.authorId,
    status: v.source === "apply" ? "saved_applied" : "saved_edit", includeInInitialSnapshot: true, sections: v.sections,
    origin: "local", createdAt: v.at, baseFileId: v.baseFileId,
  };
}
function localFiles(s: Scenario, projectId: string): DemoFile[] {
  const docs = new Set(s.files.filter(f => f.projectId === projectId && f.documentId).map(f => f.documentId as string));
  return [...docs].flatMap(d => readVersions(projectId, s.viewerId, d).map(v => savedToFile(s, v)));
}

/** 화면에 보이는 파일: 초기 스냅샷 샘플(V3 예시 제외) + 이 브라우저에서 저장한 버전. */
export function visibleFiles(s: Scenario, projectId: string): DemoFile[] {
  return [...s.files.filter(f => f.projectId === projectId && f.includeInInitialSnapshot), ...localFiles(s, projectId)];
}
/** fileId 로 문서 하나를 찾는다. 모든 화면이 이 함수를 쓴다. V3 예시는 초기 목록에서 빠졌으므로 열리지 않는다. */
export function fileById(s: Scenario, id: string): DemoFile | undefined {
  const sample = s.files.find(f => f.id === id);
  if (sample) return sample.includeInInitialSnapshot ? sample : undefined;
  for (const p of s.projects) { const f = localFiles(s, p.id).find(x => x.id === id); if (f) return f; }
  return undefined;
}
/** 문서의 버전 목록(오래된 순). */
export function versionsOf(s: Scenario, projectId: string, documentId: string): DemoFile[] {
  return visibleFiles(s, projectId).filter(f => f.documentId === documentId).sort((a, b) => (a.version ?? 0) - (b.version ?? 0));
}
/**
 * 편집 기준이 되는 현재 버전: 서연이 마지막으로 저장한 버전, 없으면 서연이 쓴 최신 확정본(V1).
 * V2(ai_proposed)는 아직 받아들이지 않은 제안이라 편집 기준이 아니다.
 */
export function currentVersion(s: Scenario, projectId: string, documentId: string): DemoFile | undefined {
  const all = versionsOf(s, projectId, documentId);
  const local = all.filter(f => f.origin === "local");
  if (local.length) return local[local.length - 1];
  const settled = all.filter(f => f.status !== "ai_proposed");
  return settled[settled.length - 1] ?? all[0];
}
export function proposalVersion(s: Scenario, projectId: string, documentId: string) {
  return versionsOf(s, projectId, documentId).find(f => f.status === "ai_proposed");
}

export function eventsOf(s: Scenario, projectId: string): DemoEvent[] {
  return [...s.events.filter(e => e.projectId === projectId), ...readActivity(projectId, s.viewerId).events].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}
export function sharesOf(s: Scenario, projectId: string): DemoShare[] {
  return [...s.shares.filter(x => x.projectId === projectId), ...readActivity(projectId, s.viewerId).shares].sort((a, b) => Date.parse(a.sharedAt) - Date.parse(b.sharedAt));
}
export function sharesOfFile(s: Scenario, file: DemoFile) { return sharesOf(s, file.projectId).filter(x => x.fileId === file.id); }
export function sessionsOf(s: Scenario, projectId: string) { return readActivity(projectId, s.viewerId).sessions; }
export function feedbackOf(s: Scenario, projectId: string) { return readActivity(projectId, s.viewerId).feedback; }
export const taskOf = (s: Scenario, id: string) => s.tasks.find(t => t.id === id);

/** 기존 앱의 프로젝트 이름을 시나리오 프로젝트 ID 로 매핑한다. 매핑이 없으면 null (빈 프로젝트). */
// 온보딩 샘플 '마케팅 프로젝트'와, 프로젝트를 고르지 않았을 때 프로젝트 홈의 기본값 'AI분석프로젝트'(팀원 나·태훈·유진)는 마케팅 공모전 팀이다.
const NAME_ALIASES: Record<string, string> = { "마케팅 프로젝트": "marketing", "마케팅 공모전": "marketing", "AI분석프로젝트": "marketing" };
export function resolveProjectId(s: Scenario, name: string | null | undefined): string | null {
  if (!name) return null;
  const n = name.trim();
  return s.projects.find(p => p.name === n)?.id ?? NAME_ALIASES[n] ?? null;
}

// ---------------------------------------------------------------- 문서 저장 (새 버전)

const sameSections = (a: Section[], b: Section[]) => JSON.stringify(a) === JSON.stringify(b);
const inFlight = new Set<string>();

/**
 * 편집한 본문을 새 버전으로 저장한다. 기존 버전(V1·V2·이전 저장본)은 그대로 남는다.
 * - 진행 중인 저장이 있으면 거절 (빠른 연속 클릭)
 * - 최신 버전과 본문이 같으면 새 버전을 만들지 않고 그 버전을 돌려준다
 * - 버전과 활동 이벤트를 함께 쓰고, 하나라도 실패하면 둘 다 되돌린다
 */
export function saveVersion(s: Scenario, args: { baseFileId: string; sections: Section[]; source: "edit" | "apply" }): Result<DemoFile> {
  const base = fileById(s, args.baseFileId);
  if (!base || !base.documentId) return { ok: false, error: "편집 기준 문서를 찾을 수 없어요." };
  const lock = `${base.projectId}:${base.documentId}`;
  if (inFlight.has(lock)) return { ok: false, error: "저장 중이에요. 잠시만 기다려 주세요." };
  if (!storageAvailable()) return { ok: false, error: "브라우저 저장소를 쓸 수 없어 저장하지 못했어요." };
  inFlight.add(lock);
  try {
    const all = versionsOf(s, base.projectId, base.documentId);
    const latestLocal = all.filter(f => f.origin === "local").pop();
    const compareTo = latestLocal ?? base;
    if (sameSections(compareTo.sections, args.sections)) return { ok: true, value: compareTo, duplicate: true };
    // 버전 번호: 보이는 버전(V1·V2·이전 저장본) 중 가장 큰 번호 + 1. 저장 후 예시(V3, 초기 목록 제외)는 세지 않으므로
    // 첫 저장이 V3 가 된다. ID 는 saved-… 로 예시 파일(plan-v3)과 겹치지 않는다.
    const maxVersion = Math.max(0, ...all.map(f => f.version ?? 0));
    const version = maxVersion + 1;
    const at = demoClock(s);
    const first = s.files.find(f => f.documentId === base.documentId && f.version === 1) ?? base;
    const v: SavedVersion = {
      id: `saved-${base.documentId}-v${version}`, projectId: base.projectId, documentId: base.documentId, version,
      title: `${first.title} V${version}`, sections: args.sections.map(x => ({ heading: x.heading, body: x.body })),
      baseFileId: base.id, authorId: s.viewerId, at, savedAtReal: new Date().toISOString(), source: args.source,
    };
    const act = readActivity(base.projectId, s.viewerId);
    const ev: DemoEvent = { id: `ev-${v.id}`, projectId: base.projectId, at, actorId: s.viewerId, type: "version_saved", origin: "local", fileIds: [v.id, base.id],
      summary: `${nameOf(s, s.viewerId)}이 V${base.version ?? "?"} 버전${args.source === "apply" ? "에 수정 제안을 반영해" : "을 직접 수정해"} V${version} 버전을 저장했어요.` };
    const ok = commit([
      { key: docKey(base.projectId, s.viewerId, base.documentId), value: [...readVersions(base.projectId, s.viewerId, base.documentId), v] },
      { key: actKey(base.projectId, s.viewerId), value: { ...act, events: [...act.events, ev] } },
    ]);
    if (!ok) return { ok: false, error: "저장 공간에 쓰지 못했어요. 기존 버전은 그대로예요. 다시 시도해 주세요." };
    notify();
    return { ok: true, value: savedToFile(s, v) };
  } finally { inFlight.delete(lock); }
}

// ---------------------------------------------------------------- 공유 확정

/** 사용자가 확인한 뒤에만 호출한다. 수신자는 같은 프로젝트 팀원이어야 하고, 같은 공유는 한 번만 기록된다. */
export function confirmShare(s: Scenario, args: { fileId: string; recipientIds: string[] }): Result<DemoShare> {
  const file = fileById(s, args.fileId);
  if (!file) return { ok: false, error: "공유할 파일을 찾을 수 없어요." };
  const recipients = [...new Set(args.recipientIds)].filter(r => r !== s.viewerId);
  if (!recipients.length) return { ok: false, error: "받을 팀원을 선택해 주세요." };
  const outsider = recipients.find(r => !isMember(s, file.projectId, r));
  if (outsider) return { ok: false, error: `${nameOf(s, outsider)}님은 이 프로젝트 팀원이 아니라 공유할 수 없어요.` };
  const id = `share-${file.id}-${[...recipients].sort().join("+")}`;
  const act = readActivity(file.projectId, s.viewerId);
  const existing = act.shares.find(x => x.id === id);
  if (existing) return { ok: true, value: existing, duplicate: true };
  const at = demoClock(s);
  const share: DemoShare = { id, projectId: file.projectId, fileId: file.id, senderId: s.viewerId, recipientIds: recipients, sharedAt: at, origin: "local" };
  const ev: DemoEvent = { id: `ev-${id}`, projectId: file.projectId, at, actorId: s.viewerId, type: "file_shared", origin: "local", fileIds: [file.id],
    summary: `${nameOf(s, s.viewerId)}이 ${file.title} 파일을 ${recipients.map(r => nameOf(s, r)).join("·")}에게 공유했어요.` };
  if (!commit([{ key: actKey(file.projectId, s.viewerId), value: { ...act, shares: [...act.shares, share], events: [...act.events, ev] } }]))
    return { ok: false, error: "공유 기록을 저장하지 못했어요. 다시 시도해 주세요." };
  notify();
  return { ok: true, value: share };
}

// ---------------------------------------------------------------- 제안: 입력 경계

/** 제안 입력. 실제 서버 단계에서 모델에 보낼 내용과 같은 경계다(제안 예시 mockSuggestions 는 들어가지 않는다). */
export type SuggestionInput = {
  projectId: string; viewerId: string; since: string | null;
  unseenEvents: DemoEvent[];
  files: { id: string; title: string; documentId: string | null; version: number | null; sections: Section[] }[];
  opinion: { id: string; authorId: string; text: string; fileIds: string[] } | null;
  members: { id: string; name: string; role: string }[];
  availability: { userId: string; startAt: string; endAt: string }[];
};
export function buildSuggestionInput(s: Scenario, projectId: string): SuggestionInput {
  const since = s.lastSeen.find(l => l.projectId === projectId && l.userId === s.viewerId)?.at ?? null;
  const unseenEvents = eventsOf(s, projectId).filter(e => e.actorId !== s.viewerId && (!since || Date.parse(e.at) > Date.parse(since)));
  const opinion = s.feedbackInput && s.feedbackInput.projectId === projectId ? s.feedbackInput : null;
  const ids = new Set([...unseenEvents.flatMap(e => e.fileIds), ...(opinion?.fileIds ?? [])]);
  const files = visibleFiles(s, projectId).filter(f => ids.has(f.id)) // V3 예시는 visibleFiles 에서 이미 빠진다
    .map(f => ({ id: f.id, title: f.title, documentId: f.documentId, version: f.version, sections: f.sections }));
  const project = projectOf(s, projectId);
  const members = (project?.memberIds ?? []).map(id => ({ id, name: nameOf(s, id), role: roleOf(s, projectId, id) }));
  const availability = s.availability.filter(a => project?.memberIds.includes(a.userId));
  return { projectId, viewerId: s.viewerId, since, unseenEvents, files, opinion, members, availability };
}

// ---------------------------------------------------------------- 제안: 출력(이번 데모는 mockSuggestions) + 검증

export type CheckedSession = SessionSuggestion & { projectId: string; issues: string[]; slotConfirmed: boolean };
export type CheckedFeedback = FeedbackSuggestion & { projectId: string; issues: string[] };
export type Suggestions = { projectId: string; input: SuggestionInput; session: CheckedSession | null; feedback: CheckedFeedback[]; none: string | null };

/** 모든 참여자의 가능 시간에 들어가는 슬롯인지 */
function slotFits(s: Scenario, slot: Slot, participantIds: string[]) {
  const a = Date.parse(slot.startAt), b = Date.parse(slot.endAt);
  return b > a && participantIds.every(p => s.availability.some(x => x.userId === p && Date.parse(x.startAt) <= a && Date.parse(x.endAt) >= b));
}

/**
 * 프로젝트의 제안을 돌려준다. 이번 로컬 데모의 응답은 mockSuggestions 에서 읽는다.
 * 근거 파일·이벤트가 그 프로젝트의 입력 안에 있을 때만 쓰므로, 관련 데이터가 없는 프로젝트에는 마케팅 공모전 제안이 나오지 않는다.
 * 참여자·수신자 멤버십과 후보 시간(가능 시간 교집합)을 다시 확인한다.
 */
export function suggestionsFor(s: Scenario, projectId: string): Suggestions {
  const input = buildSuggestionInput(s, projectId);
  const fileIds = new Set(input.files.map(f => f.id));
  const eventIds = new Set(eventsOf(s, projectId).map(e => e.id));
  const evidenceOk = (files: string[], events: string[] = []) => files.length > 0 && files.every(id => fileIds.has(id)) && events.every(id => eventIds.has(id));

  let session: CheckedSession | null = null;
  const ms = s.mockSuggestions.session;
  if (ms && evidenceOk(ms.evidenceFileIds, ms.evidenceEventIds)) {
    const issues: string[] = [];
    const participantIds = ms.participantIds.filter(p => isMember(s, projectId, p) || (issues.push(`${nameOf(s, p)}님은 프로젝트 팀원이 아니라 제외했어요`), false));
    const slotConfirmed = !!ms.slot && slotFits(s, ms.slot, participantIds);
    if (ms.slot && !slotConfirmed) issues.push("참여자 모두가 가능한 시간이 확인되지 않아 시간은 미정이에요");
    if (participantIds.length >= 2) session = { ...ms, participantIds, slot: slotConfirmed ? ms.slot : null, slotConfirmed, projectId, issues };
  }
  const feedback: CheckedFeedback[] = input.opinion
    ? s.mockSuggestions.feedback.filter(f => isMember(s, projectId, f.recipientId) && f.recipientId !== s.viewerId && evidenceOk(f.evidenceFileIds))
      .map(f => ({ ...f, projectId, issues: [] }))
    : [];
  const none = !session && !feedback.length ? "이 프로젝트에는 제안할 근거 자료가 아직 없어요." : null;
  return { projectId, input, session, feedback, none };
}

// ---------------------------------------------------------------- 세션·피드백 확정 (데모 기록)

export function confirmSession(s: Scenario, draft: CheckedSession & { inviteDraft: string; agenda: string[] }): Result<SessionRecord> {
  const bad = draft.participantIds.find(p => !isMember(s, draft.projectId, p));
  if (bad) return { ok: false, error: `${nameOf(s, bad)}님은 프로젝트 팀원이 아니에요.` };
  if (draft.slot && !slotFits(s, draft.slot, draft.participantIds)) return { ok: false, error: "선택한 시간에 참여자 모두가 가능한지 확인되지 않았어요." };
  if (!draft.inviteDraft.trim()) return { ok: false, error: "초대 문안을 입력해 주세요." };
  const id = `session-${draft.projectId}-${draft.evidenceFileIds.join("+")}`;
  const act = readActivity(draft.projectId, s.viewerId);
  const existing = act.sessions.find(x => x.id === id);
  if (existing) return { ok: true, value: existing, duplicate: true };
  const at = demoClock(s);
  const rec: SessionRecord = { id, projectId: draft.projectId, title: draft.title, reason: draft.reason, participantIds: draft.participantIds,
    agenda: draft.agenda.filter(x => x.trim()), inviteDraft: draft.inviteDraft.trim(), slot: draft.slot, evidenceFileIds: draft.evidenceFileIds,
    evidenceEventIds: draft.evidenceEventIds, status: "recorded", at };
  const ev: DemoEvent = { id: `ev-${id}`, projectId: draft.projectId, at, actorId: s.viewerId, type: "session_recorded", origin: "local", fileIds: draft.evidenceFileIds,
    summary: `${nameOf(s, s.viewerId)}이 '${draft.title}' 공동세션을 확정했어요.` };
  if (!commit([{ key: actKey(draft.projectId, s.viewerId), value: { ...act, sessions: [...act.sessions, rec], events: [...act.events, ev] } }]))
    return { ok: false, error: "세션 기록을 저장하지 못했어요. 다시 시도해 주세요." };
  notify();
  return { ok: true, value: rec };
}

export function confirmFeedback(s: Scenario, projectId: string, drafts: { recipientId: string; draft: string; evidenceFileIds: string[] }[]): Result<FeedbackRecord[]> {
  const input = s.feedbackInput;
  if (!input || input.projectId !== projectId) return { ok: false, error: "이 프로젝트에는 전달할 의견이 없어요." };
  const bad = drafts.find(d => !isMember(s, projectId, d.recipientId));
  if (bad) return { ok: false, error: `${nameOf(s, bad.recipientId)}님은 프로젝트 팀원이 아니에요.` };
  if (drafts.some(d => !d.draft.trim())) return { ok: false, error: "비어 있는 전달 문안이 있어요." };
  const act = readActivity(projectId, s.viewerId);
  const at = demoClock(s);
  const fresh = drafts.filter(d => !act.feedback.some(f => f.id === `feedback-${input.id}-${d.recipientId}`))
    .map(d => ({ id: `feedback-${input.id}-${d.recipientId}`, projectId, inputId: input.id, recipientId: d.recipientId, draft: d.draft.trim(), evidenceFileIds: d.evidenceFileIds, status: "recorded" as const, at }));
  if (!fresh.length) return { ok: true, value: act.feedback.filter(f => f.inputId === input.id), duplicate: true };
  const ev: DemoEvent = { id: `ev-feedback-${input.id}-${fresh.map(f => f.recipientId).join("+")}`, projectId, at, actorId: s.viewerId, type: "feedback_recorded", origin: "local",
    fileIds: [...new Set(fresh.flatMap(f => f.evidenceFileIds))], summary: `${nameOf(s, s.viewerId)}이 ${fresh.map(f => nameOf(s, f.recipientId)).join("·")}에게 전달할 피드백을 확정했어요.` };
  if (!commit([{ key: actKey(projectId, s.viewerId), value: { ...act, feedback: [...act.feedback, ...fresh], events: [...act.events, ev] } }]))
    return { ok: false, error: "전달 기록을 저장하지 못했어요. 다시 시도해 주세요." };
  notify();
  return { ok: true, value: [...act.feedback.filter(f => f.inputId === input.id), ...fresh] };
}
