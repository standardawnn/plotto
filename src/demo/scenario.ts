/**
 * 데모 시나리오 로딩 지점 (하나뿐).
 *
 * public/demo/plotto/scenario.json 을 읽어 검증한 뒤 앱에서 쓰는 타입으로 바꾼다.
 * 브리핑·홈 팝업·프로젝트 파일 목록·공동세션·피드백 화면은 모두 이 모듈의 결과만 보고,
 * 문서 본문과 목록을 화면마다 따로 적지 않는다. 같은 fileId 는 어느 화면에서든 같은 문서다.
 *
 * - 다른 프로젝트의 파일을 가리키는 이벤트·공유·작업 참조는 버리고 warnings 에 남긴다(섞어 보여주지 않기).
 * - includeInInitialSnapshot=false 파일(V3 저장 후 예시)은 files 에는 남기되, 초기 목록·이력·제안 입력에서는 뺀다.
 * - 시연 기준 시각은 data.demoNow(한국 시간)다. 화면의 날짜 표시는 모두 이 값을 기준으로 한다.
 */

export const DEMO_BASE = "/demo/plotto/";
export const SCENARIO_URL = `${DEMO_BASE}scenario.json`;
export const TIME_ZONE = "Asia/Seoul";

// ---------------------------------------------------------------- 앱 타입

export type Section = { heading: string; body: string };
export type Person = { id: string; name: string; rolesByProject: Record<string, string> };
export type DemoProject = { id: string; name: string; memberIds: string[] };
export type FileKind = "pdf" | "docx" | "saved";

/** 파일 하나 = 문서의 한 버전(또는 버전이 없는 단일 문서). */
export type DemoFile = {
  id: string;
  projectId: string;
  /** 같은 문서의 버전끼리 공유하는 ID. 버전이 없는 문서는 null */
  documentId: string | null;
  version: number | null;
  title: string;
  displayFileName: string;
  /** 실제로 열 수 있는 경로. 브라우저에 저장한 버전은 원본 파일이 없어서 null */
  url: string | null;
  mimeType: string;
  kind: FileKind;
  ownerId: string;
  status: string;
  includeInInitialSnapshot: boolean;
  sections: Section[];
  /** sample: scenario.json, local: 이 브라우저에서 저장한 버전 */
  origin: "sample" | "local";
  createdAt?: string;
  baseFileId?: string;
};

export type DemoEvent = { id: string; projectId: string; at: string; actorId: string; type: string; summary: string; fileIds: string[]; origin: "sample" | "local" };
export type DemoShare = { id: string; projectId: string; fileId: string; senderId: string; recipientIds: string[]; sharedAt: string; origin: "sample" | "local" };
export type TaskStep = { label: string; state: "done" | "pending" | string; fileId?: string; recipientIds?: string[] };
export type DemoTask = {
  id: string; projectId: string; title: string; assigneeIds: string[]; status: string;
  dueAt?: string; fileIds: string[]; reviewNoteHeadings?: string[]; shareCandidateIds?: string[];
  progress?: number; steps?: TaskStep[]; reason?: string;
};
export type Slot = { startAt: string; endAt: string };
export type Availability = Slot & { userId: string };
export type SessionSuggestion = {
  kind: "session"; status: string; title: string; reason: string; participantIds: string[];
  evidenceEventIds: string[]; evidenceFileIds: string[]; slot: Slot | null; agenda: string[]; inviteDraft: string;
};
export type FeedbackSuggestion = { kind: "feedback"; status: string; recipientId: string; evidenceFileIds: string[]; draft: string };
export type FeedbackInput = { id: string; projectId: string; authorId: string; text: string; fileIds: string[] };
export type Briefing = {
  projectId: string;
  before: { eventIds: string[]; fileIds: string[] };
  now: { eventIds: string[]; fileIds: string[] };
  next: { taskIds: string[] };
};

export type Scenario = {
  demoNow: string;
  viewerId: string;
  fictional: boolean;
  people: Person[];
  projects: DemoProject[];
  /** V3 예시까지 포함한 전체 샘플 파일. 화면 목록에는 initialFiles() 를 쓴다. */
  files: DemoFile[];
  events: DemoEvent[];
  shares: DemoShare[];
  lastSeen: { projectId: string; userId: string; at: string }[];
  briefing: Briefing;
  tasks: DemoTask[];
  feedbackInput: FeedbackInput | null;
  availability: Availability[];
  mockSuggestions: { session: SessionSuggestion | null; feedback: FeedbackSuggestion[] };
  warnings: string[];
};

export class ScenarioError extends Error {}

// ---------------------------------------------------------------- 검증 도우미

type Raw = Record<string, unknown>;
const isRec = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, path: string): string => {
  if (typeof v !== "string" || !v.trim()) throw new ScenarioError(`${path}: 문자열이 필요해요`);
  return v;
};
const optStr = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);
const strList = (v: unknown, path: string): string[] => {
  if (v === undefined) return [];
  if (!Array.isArray(v) || !v.every(x => typeof x === "string")) throw new ScenarioError(`${path}: 문자열 목록이 필요해요`);
  return v as string[];
};
const time = (v: unknown, path: string): string => {
  const s = str(v, path);
  if (Number.isNaN(Date.parse(s))) throw new ScenarioError(`${path}: 시각 형식이 아니에요`);
  return s;
};
const list = (v: unknown, path: string): Raw[] => {
  if (!Array.isArray(v) || !v.every(isRec)) throw new ScenarioError(`${path}: 목록이 필요해요`);
  return v as Raw[];
};
const sections = (v: unknown, path: string): Section[] =>
  list(v, path).map((s, i) => ({ heading: str(s.heading, `${path}[${i}].heading`), body: str(s.body, `${path}[${i}].body`) }));

/** filePath 는 demo 폴더 안의 상대 경로만 허용한다(../ 나 외부 주소 금지). */
function safePath(p: string, path: string): string {
  if (!/^files\/[A-Za-z0-9._-]+$/.test(p)) throw new ScenarioError(`${path}: 허용하지 않는 파일 경로예요 (${p})`);
  return `${DEMO_BASE}${p}`;
}
function kindOf(mime: string, p: string): FileKind {
  if (mime === "application/pdf" || p.endsWith(".pdf")) return "pdf";
  return "docx";
}

// ---------------------------------------------------------------- 변환

export function parseScenario(raw: unknown): Scenario {
  if (!isRec(raw)) throw new ScenarioError("scenario.json 형식이 아니에요");
  if (raw.schemaVersion !== 1) throw new ScenarioError(`지원하지 않는 schemaVersion 이에요 (${String(raw.schemaVersion)})`);
  const warnings: string[] = [];

  const people: Person[] = list(raw.people, "people").map((p, i) => ({
    id: str(p.id, `people[${i}].id`),
    name: str(p.name, `people[${i}].name`),
    rolesByProject: isRec(p.rolesByProject) ? Object.fromEntries(Object.entries(p.rolesByProject).filter(([, r]) => typeof r === "string")) as Record<string, string> : {},
  }));
  const personIds = new Set(people.map(p => p.id));

  const projects: DemoProject[] = list(raw.projects, "projects").map((p, i) => ({
    id: str(p.id, `projects[${i}].id`),
    name: str(p.name, `projects[${i}].name`),
    memberIds: strList(p.members, `projects[${i}].members`).filter(id => personIds.has(id) || (warnings.push(`projects[${i}]: 모르는 팀원 ${id}`), false)),
  }));
  const projectById = new Map(projects.map(p => [p.id, p]));
  const isMember = (projectId: string, personId: string) => !!projectById.get(projectId)?.memberIds.includes(personId);

  const files: DemoFile[] = [];
  list(raw.files, "files").forEach((f, i) => {
    const path = `files[${i}]`;
    const projectId = str(f.projectId, `${path}.projectId`);
    if (!projectById.has(projectId)) { warnings.push(`${path}: 모르는 프로젝트 ${projectId}`); return; }
    const filePath = str(f.filePath, `${path}.filePath`);
    const mimeType = str(f.mimeType, `${path}.mimeType`);
    files.push({
      id: str(f.id, `${path}.id`),
      projectId,
      documentId: optStr(f.documentId) ?? null,
      version: typeof f.version === "number" ? f.version : null,
      title: str(f.title, `${path}.title`),
      displayFileName: str(f.displayFileName, `${path}.displayFileName`),
      url: safePath(filePath, `${path}.filePath`),
      mimeType,
      kind: kindOf(mimeType, filePath),
      ownerId: str(f.ownerId, `${path}.ownerId`),
      status: str(f.status, `${path}.status`),
      includeInInitialSnapshot: f.includeInInitialSnapshot !== false,
      sections: sections(f.sections, `${path}.sections`),
      origin: "sample",
    });
  });
  const fileById = new Map(files.map(f => [f.id, f]));
  /** 같은 프로젝트의 초기 스냅샷 파일만 통과 */
  const sameProjectFiles = (ids: string[], projectId: string, path: string) => ids.filter(id => {
    const f = fileById.get(id);
    if (!f) { warnings.push(`${path}: 없는 파일 ${id}`); return false; }
    if (f.projectId !== projectId) { warnings.push(`${path}: 다른 프로젝트(${f.projectId}) 파일 ${id} 제외`); return false; }
    return true;
  });

  const events: DemoEvent[] = [];
  list(raw.events, "events").forEach((e, i) => {
    const path = `events[${i}]`;
    const projectId = str(e.projectId, `${path}.projectId`);
    if (!projectById.has(projectId)) { warnings.push(`${path}: 모르는 프로젝트`); return; }
    events.push({
      id: str(e.id, `${path}.id`), projectId, at: time(e.at, `${path}.at`), actorId: str(e.actorId, `${path}.actorId`),
      type: str(e.type, `${path}.type`), summary: str(e.summary, `${path}.summary`),
      fileIds: sameProjectFiles(strList(e.fileIds, `${path}.fileIds`), projectId, path), origin: "sample",
    });
  });
  const eventById = new Map(events.map(e => [e.id, e]));

  const shares: DemoShare[] = [];
  list(raw.shares, "shares").forEach((s, i) => {
    const path = `shares[${i}]`;
    const projectId = str(s.projectId, `${path}.projectId`);
    const fileId = str(s.fileId, `${path}.fileId`);
    if (!sameProjectFiles([fileId], projectId, path).length) return;
    const recipientIds = strList(s.recipientIds, `${path}.recipientIds`).filter(r => isMember(projectId, r) || (warnings.push(`${path}: 프로젝트 팀원이 아닌 수신자 ${r} 제외`), false));
    shares.push({ id: str(s.id, `${path}.id`), projectId, fileId, senderId: str(s.senderId, `${path}.senderId`), recipientIds, sharedAt: time(s.sharedAt, `${path}.sharedAt`), origin: "sample" });
  });

  const tasks: DemoTask[] = [];
  list(raw.tasks, "tasks").forEach((t, i) => {
    const path = `tasks[${i}]`;
    const projectId = str(t.projectId, `${path}.projectId`);
    if (!projectById.has(projectId)) { warnings.push(`${path}: 모르는 프로젝트`); return; }
    const steps = Array.isArray(t.steps) ? list(t.steps, `${path}.steps`).map((s, j) => ({
      label: str(s.label, `${path}.steps[${j}].label`), state: str(s.state, `${path}.steps[${j}].state`),
      fileId: optStr(s.fileId) && sameProjectFiles([s.fileId as string], projectId, `${path}.steps[${j}]`).length ? (s.fileId as string) : undefined,
      recipientIds: strList(s.recipientIds, `${path}.steps[${j}].recipientIds`).filter(r => isMember(projectId, r)),
    })) : undefined;
    tasks.push({
      id: str(t.id, `${path}.id`), projectId, title: str(t.title, `${path}.title`),
      assigneeIds: strList(t.assigneeIds, `${path}.assigneeIds`), status: str(t.status, `${path}.status`),
      dueAt: t.dueAt === undefined ? undefined : time(t.dueAt, `${path}.dueAt`),
      fileIds: sameProjectFiles(strList(t.fileIds, `${path}.fileIds`), projectId, path),
      reviewNoteHeadings: t.reviewNoteHeadings === undefined ? undefined : strList(t.reviewNoteHeadings, `${path}.reviewNoteHeadings`),
      shareCandidateIds: strList(t.shareCandidateIds, `${path}.shareCandidateIds`).filter(r => isMember(projectId, r)),
      progress: typeof t.progress === "number" ? t.progress : undefined,
      steps, reason: optStr(t.reason),
    });
  });

  const b = isRec(raw.briefing) ? raw.briefing : {};
  const bProject = str(b.projectId, "briefing.projectId");
  const part = (v: unknown, path: string) => {
    const r = isRec(v) ? v : {};
    return {
      eventIds: strList(r.eventIds, `${path}.eventIds`).filter(id => eventById.get(id)?.projectId === bProject || (warnings.push(`${path}: 이벤트 ${id} 제외`), false)),
      fileIds: sameProjectFiles(strList(r.fileIds, `${path}.fileIds`), bProject, path),
    };
  };
  const nextRaw = isRec(b.next) ? b.next : {};
  const briefing: Briefing = {
    projectId: bProject,
    before: part(b.before, "briefing.before"),
    now: part(b.now, "briefing.now"),
    next: { taskIds: strList(nextRaw.taskIds, "briefing.next.taskIds").filter(id => tasks.some(t => t.id === id && t.projectId === bProject)) },
  };

  let feedbackInput: FeedbackInput | null = null;
  if (isRec(raw.feedbackInput)) {
    const f = raw.feedbackInput;
    const projectId = str(f.projectId, "feedbackInput.projectId");
    feedbackInput = { id: str(f.id, "feedbackInput.id"), projectId, authorId: str(f.authorId, "feedbackInput.authorId"), text: str(f.text, "feedbackInput.text"),
      fileIds: sameProjectFiles(strList(f.fileIds, "feedbackInput.fileIds"), projectId, "feedbackInput") };
  }

  const availability: Availability[] = (Array.isArray(raw.availability) ? list(raw.availability, "availability") : []).map((a, i) => ({
    userId: str(a.userId, `availability[${i}].userId`), startAt: time(a.startAt, `availability[${i}].startAt`), endAt: time(a.endAt, `availability[${i}].endAt`),
  }));

  const ms = isRec(raw.mockSuggestions) ? raw.mockSuggestions : {};
  let session: SessionSuggestion | null = null;
  if (isRec(ms.session)) {
    const s = ms.session;
    const slot = isRec(s.slot) ? { startAt: time(s.slot.startAt, "mockSuggestions.session.slot.startAt"), endAt: time(s.slot.endAt, "mockSuggestions.session.slot.endAt") } : null;
    session = {
      kind: "session", status: str(s.status, "mockSuggestions.session.status"), title: str(s.title, "mockSuggestions.session.title"),
      reason: str(s.reason, "mockSuggestions.session.reason"), participantIds: strList(s.participantIds, "mockSuggestions.session.participantIds"),
      evidenceEventIds: strList(s.evidenceEventIds, "mockSuggestions.session.evidenceEventIds"), evidenceFileIds: strList(s.evidenceFileIds, "mockSuggestions.session.evidenceFileIds"),
      slot, agenda: strList(s.agenda, "mockSuggestions.session.agenda"), inviteDraft: str(s.inviteDraft, "mockSuggestions.session.inviteDraft"),
    };
  }
  const feedback: FeedbackSuggestion[] = (Array.isArray(ms.feedback) ? list(ms.feedback, "mockSuggestions.feedback") : []).map((f, i) => ({
    kind: "feedback", status: str(f.status, `mockSuggestions.feedback[${i}].status`), recipientId: str(f.recipientId, `mockSuggestions.feedback[${i}].recipientId`),
    evidenceFileIds: strList(f.evidenceFileIds, `mockSuggestions.feedback[${i}].evidenceFileIds`), draft: str(f.draft, `mockSuggestions.feedback[${i}].draft`),
  }));

  const lastSeen = (Array.isArray(raw.lastSeen) ? list(raw.lastSeen, "lastSeen") : []).map((l, i) => ({
    projectId: str(l.projectId, `lastSeen[${i}].projectId`), userId: str(l.userId, `lastSeen[${i}].userId`), at: time(l.at, `lastSeen[${i}].at`),
  }));

  return {
    demoNow: time(raw.demoNow, "demoNow"), viewerId: str(raw.viewerId, "viewerId"), fictional: raw.fictionalDemo === true,
    people, projects, files, events, shares, lastSeen, briefing, tasks, feedbackInput, availability,
    mockSuggestions: { session, feedback }, warnings,
  };
}

// ---------------------------------------------------------------- 로딩 (페이지마다 한 번)

let pending: Promise<Scenario> | null = null;
export function loadScenario(): Promise<Scenario> {
  if (!pending) {
    pending = fetch(SCENARIO_URL, { cache: "no-cache" })
      .then(r => { if (!r.ok) throw new ScenarioError(`시나리오 파일을 불러오지 못했어요 (${r.status} ${SCENARIO_URL})`); return r.json(); })
      .then(parseScenario)
      .then(s => { if (s.warnings.length) console.warn("[plotto-demo] scenario warnings", s.warnings); return s; })
      .catch(e => { pending = null; throw e instanceof ScenarioError ? e : new ScenarioError(`시나리오를 읽지 못했어요: ${e?.message ?? e}`); });
  }
  return pending;
}

// ---------------------------------------------------------------- 시각 표시 (한국 시간)

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("ko-KR", { timeZone: TIME_ZONE, ...o });
const partsOf = (iso: string) => {
  const p = Object.fromEntries(fmt({ year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" })
    .formatToParts(new Date(iso)).map(x => [x.type, x.value]));
  return p as Record<string, string>;
};
/** "10/15" */
export const mmddOf = (iso: string) => { const p = partsOf(iso); return `${p.month}/${p.day}`; };
/** "10.14" */
export const dotOf = (iso: string) => { const p = partsOf(iso); return `${p.month}.${p.day}`; };
/** "10/15 목" */
export const mmddDayOf = (iso: string) => { const p = partsOf(iso); return `${p.month}/${p.day} ${p.weekday}`; };
/** "10월 14일" */
export const koreanDateOf = (iso: string) => { const p = partsOf(iso); return `${Number(p.month)}월 ${Number(p.day)}일`; };
/** "17:20" */
export const hhmmOf = (iso: string) => { const p = partsOf(iso); return `${p.hour}:${p.minute}`; };
/** "10/14 17:20" */
export const stampOf = (iso: string) => `${mmddOf(iso)} ${hhmmOf(iso)}`;
/** 한국 날짜 기준 일 수 차이 (b - a) */
export function dayDiff(aIso: string, bIso: string) {
  const d = (iso: string) => { const p = partsOf(iso); return Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day)); };
  return Math.round((d(bIso) - d(aIso)) / 86400000);
}
/** "D-DAY" / "D-3" / "D+1" */
export function dueLabel(nowIso: string, dueIso: string) {
  const n = dayDiff(nowIso, dueIso);
  return n === 0 ? "D-DAY" : n > 0 ? `D-${n}` : `D+${-n}`;
}
/** "방금" / "25분 전" / "3시간 전" / "어제" / "10/11" */
export function relativeOf(nowIso: string, iso: string) {
  const min = Math.round((Date.parse(nowIso) - Date.parse(iso)) / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  if (dayDiff(iso, nowIso) === 0) return `${Math.floor(min / 60)}시간 전`;
  if (dayDiff(iso, nowIso) === 1) return "어제";
  return mmddOf(iso);
}
