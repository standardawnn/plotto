/**
 * Common work status for the dial (and any screen that needs the same facts).
 *
 * Source of every field (see `sources` in the result):
 *  - 'revision' : modules/briefing/revisionData  (localStorage, already written by DocumentReview)
 *  - 'journey'  : journey.ts                      (sessionStorage, already written by DocFlow / booking / session)
 *  - 'dummy'    : not recorded by any screen yet. Stored here (sessionStorage 'plotto-work-status-v1')
 *                 and defaults to "not done". Replace the read in `readStored()` / DUMMY_* with real data later.
 *
 * Writers for other owners (call these from the screen that owns the event):
 *  - recordMaterialChecked()      feedback owner: when the shared materials were actually checked
 *  - markNotificationRead(id)     whoever opens the item a notification points to
 *  - recordSessionProposed()      proposal owner: when the co-session proposal is shown
 *  - recordSessionJoinable()      session owner: when the reserved co-session can actually be entered (reminder shown)
 *  - recordSessionResult(r)       session owner: the real result of a finished session ({ decision?, nextAction? })
 *  - recordBriefingChecked()      briefing: the session briefing was actually opened (done from the dial's Extra detail)
 *  - recordActivity()             any screen: the user performed real work (updates "last activity")
 * Already recorded elsewhere, nothing to add: opinions read/applied/completed (DocumentReview),
 * sharedWith (DocFlow), sessionTopic/sessionTime (booking), sessionFinished (session).
 */
import { useCallback, useEffect, useState } from 'react';
import { readJourney } from './journey';
import { readRevision } from './modules/briefing/revisionData';

export const WORK_STATUS_KEY = 'plotto-work-status-v1';
const CHANGE_EVENT = 'plotto:work-status';

export type FieldSource = 'journey' | 'revision' | 'dummy' | 'demo';
export type WorkNotification = { id: string; kind: 'file' | 'opinion' | 'session'; read: boolean };

// Dummy data: replace with a backend/notification feed later. Ids only; no new UI copy.
const DUMMY_NOTIFICATIONS: Omit<WorkNotification, 'read'>[] = [
  { id: 'taehun-files', kind: 'file' }, // matches the project screen's "새로운 활동 1" (태훈님이 파일 2개를 전달)
];
const DUMMY_IDLE_MS = 3 * 60 * 60 * 1000; // matches the project screen's "3시간 전 중단"

type Stored = {
  materialChecked?: boolean; readNotificationIds?: string[]; lastActivityAt?: string; sessionProposed?: boolean;
  sessionJoinable?: boolean; briefingChecked?: boolean; sessionResult?: SessionResult;
};

export type SessionResult = { decision?: string; nextAction?: string };
/** What the dial's Extra detail shows. Always derived from recorded facts, never from clicks. */
export type ExtraPhase = 'resume' | 'proposed' | 'reserved' | 'joinable' | 'finished';
export function deriveExtraPhase(f: { finished: boolean; reserved: boolean; joinable: boolean; proposed: boolean }): ExtraPhase {
  return f.finished ? 'finished' : f.reserved ? (f.joinable ? 'joinable' : 'reserved') : f.proposed ? 'proposed' : 'resume';
}

export type WorkStatus = {
  materialChecked: boolean;
  notifications: WorkNotification[];
  unreadNotifications: number;
  opinions: { total: number; reviewed: number; unread: number };
  revisionCompleted: boolean;
  revisionCompletedAt?: string;
  documentShared: boolean;
  sharedWith: string[];
  lastActivityAt: string;
  sessionProposed: boolean;
  sessionReserved: boolean;
  sessionTopic?: string;
  sessionTime?: string;
  sessionFinished: boolean;
  /** Not recorded by any screen yet (dummy: false). Set through recordSessionJoinable(). */
  sessionJoinable: boolean;
  sessionResult?: SessionResult;
  briefingChecked: boolean;
  extraPhase: ExtraPhase;
  /** Whole flow finished (session finished and its briefing checked): the dial stops marking a current card. */
  workComplete: boolean;
  /** Dial step the work has reached: 'now' (revision not done) -> 'next' (share) -> 'extra' (after sharing). Derived only; the dial does not use it yet. */
  currentStep: 'now' | 'next' | 'extra';
  sources: Record<'materialChecked' | 'notifications' | 'opinions' | 'revisionCompleted' | 'documentShared' | 'lastActivityAt' | 'sessionProposed' | 'sessionReserved' | 'sessionFinished' | 'sessionJoinable' | 'sessionResult' | 'briefingChecked', FieldSource>;
};

let memory: Stored = {}; // fallback when sessionStorage is unavailable
function readStored(): Stored {
  try {
    const value = JSON.parse(sessionStorage.getItem(WORK_STATUS_KEY) || 'null');
    if (value && typeof value === 'object') return value;
  } catch { /* fall through to memory */ }
  return memory;
}
function writeStored(patch: Stored) {
  memory = { ...readStored(), ...patch };
  try { sessionStorage.setItem(WORK_STATUS_KEY, JSON.stringify(memory)); } catch { /* memory fallback already updated */ }
  try { window.dispatchEvent(new Event(CHANGE_EVENT)); } catch { /* non-browser */ }
}

/** The document review now keeps its state per scenario document (DocumentReview stateKey "plotto-demo:v1:…:review:…").
 *  The newest of those wins; the older single key (revisionData) is the fallback. */
function readReview(): { reviewed: boolean[]; applied: boolean[]; completedAt?: string } {
  let best: { reviewed: boolean[]; applied: boolean[]; completedAt?: string } | null = null;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!k.startsWith('plotto-demo:v1:') || !k.includes(':review:')) continue;
      const v = JSON.parse(localStorage.getItem(k) || 'null');
      if (!v || !Array.isArray(v.reviewed)) continue;
      if (!best || (v.completedAt || '') > (best.completedAt || '')) best = { reviewed: v.reviewed, applied: v.applied || [], completedAt: v.completedAt };
    }
  } catch { /* storage unavailable */ }
  return best ?? readRevision();
}

export function getWorkStatus(): WorkStatus {
  let stored = readStored();
  if (!stored.lastActivityAt) { // first read in this session: dummy baseline, kept stable afterwards
    writeStored({ lastActivityAt: new Date(Date.now() - DUMMY_IDLE_MS).toISOString() });
    stored = readStored();
  }
  const journey = readJourney();
  const revision = readReview(); // document review state (scenario doc flow first, older revisionData as fallback)
  const read = new Set(stored.readNotificationIds || []);
  const notifications = DUMMY_NOTIFICATIONS.map(item => ({ ...item, read: read.has(item.id) }));
  const reviewed = revision.reviewed.filter(Boolean).length;
  // A real completion time is newer than the dummy baseline once the user actually finishes the revision.
  const activity = [stored.lastActivityAt!, revision.completedAt].filter((t): t is string => !!t).sort().pop()!;
  return {
    materialChecked: !!stored.materialChecked,
    notifications,
    unreadNotifications: notifications.filter(item => !item.read).length,
    opinions: { total: revision.reviewed.length, reviewed, unread: revision.reviewed.length - reviewed },
    revisionCompleted: !!revision.completedAt,
    revisionCompletedAt: revision.completedAt,
    documentShared: (journey.sharedWith?.length ?? 0) > 0,
    sharedWith: journey.sharedWith ?? [],
    lastActivityAt: activity,
    sessionProposed: !!stored.sessionProposed,
    sessionReserved: !!journey.sessionTime,
    sessionTopic: journey.sessionTopic,
    sessionTime: journey.sessionTime,
    sessionFinished: !!journey.sessionFinished,
    sessionJoinable: !!stored.sessionJoinable,
    sessionResult: stored.sessionResult,
    briefingChecked: !!stored.briefingChecked,
    extraPhase: deriveExtraPhase({ finished: !!journey.sessionFinished, reserved: !!journey.sessionTime, joinable: !!stored.sessionJoinable, proposed: !!stored.sessionProposed }),
    workComplete: !!journey.sessionFinished && !!stored.briefingChecked,
    currentStep: !revision.completedAt ? 'now' : (journey.sharedWith?.length ?? 0) > 0 ? 'extra' : 'next',
    sources: {
      materialChecked: 'dummy', notifications: 'dummy', opinions: 'revision', revisionCompleted: 'revision',
      documentShared: 'journey', lastActivityAt: 'dummy', sessionProposed: 'dummy', sessionReserved: 'journey', sessionFinished: 'journey',
      sessionJoinable: 'dummy', sessionResult: 'dummy', briefingChecked: 'dummy',
    },
  };
}

// ---- Writers for values no screen records yet (call from the owning screen) ----
export function recordActivity() { writeStored({ lastActivityAt: new Date().toISOString() }); }
export function recordMaterialChecked() { writeStored({ materialChecked: true, lastActivityAt: new Date().toISOString() }); }
export function recordSessionProposed() { writeStored({ sessionProposed: true }); }
export function recordSessionJoinable() { writeStored({ sessionJoinable: true }); }
export function recordSessionResult(result: SessionResult) { writeStored({ sessionResult: result }); }
export function recordBriefingChecked() { writeStored({ briefingChecked: true, lastActivityAt: new Date().toISOString() }); }
export function markNotificationRead(id: string) {
  const ids = new Set(readStored().readNotificationIds || []);
  ids.add(id);
  writeStored({ readNotificationIds: [...ids] });
}
export function resetWorkStatus() { // this module's own key only; journey/revision are untouched
  memory = {};
  try { sessionStorage.removeItem(WORK_STATUS_KEY); } catch { /* ignore */ }
  try { window.dispatchEvent(new Event(CHANGE_EVENT)); } catch { /* ignore */ }
}

/** React hook: current status plus `refresh()` for state written by other screens in the same page. */
export function useWorkStatus(): [WorkStatus, () => void] {
  const [status, setStatus] = useState(getWorkStatus);
  const refresh = useCallback(() => setStatus(getWorkStatus()), []);
  useEffect(() => {
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener('pageshow', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener(CHANGE_EVENT, refresh); window.removeEventListener('pageshow', refresh); window.removeEventListener('focus', refresh); };
  }, [refresh]);
  return [status, refresh];
}
