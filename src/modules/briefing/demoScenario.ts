/**
 * DEMO ONLY. Stand-alone scenario layer for the dial's Next/Extra flow.
 *
 * Why it exists: three facts of the scenario are not recorded by any other owner's screen yet.
 * Until they are, this file stands in for them so the whole flow can be walked through by hand:
 *
 *   fact                 real writer (other owner)          demo stand-in used here
 *   -------------------  ---------------------------------  ----------------------------------------------
 *   sessionProposed      recordSessionProposed()            NOT demo any more: written for real by messages/AiChat
 *                                                          when the task chat reaches its proposal stage
 *                                                          (demoMarkResumeEntered is kept but no longer called)
 *   sessionJoinable      recordSessionJoinable()            DEMO_JOINABLE_AFTER_MS after the reservation was first
 *                                                          seen on the dial (stands for "the time has come")
 *   sessionResult        recordSessionResult({...})         DEMO_SESSION_RESULT once the session is finished
 *
 * A real value always wins over the demo value. To integrate later: make the owners call the real writers and
 * delete this file, its import in App.tsx (`useDemoWork`, `consumeDemoReset`).
 * Nothing else depends on it.
 */
import { useEffect, useState } from 'react';
import { deriveExtraPhase, type SessionResult, type WorkStatus } from '../../workStatus';

export const DEMO_SCENARIO = true;
export const DEMO_JOINABLE_AFTER_MS = 10_000;
export const DEMO_SESSION_RESULT: SessionResult = {
  decision: '기업별 AI 협업 서비스 사례를 중심으로 분석하기로 했어요.',
  nextAction: '논의한 내용을 기업분석 보고서에 반영해 주세요.',
};

const KEY = 'plotto-demo-scenario-v1';
type DemoState = { resumeEntered?: boolean; reservedSeenAt?: number };
function read(): DemoState {
  try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function write(patch: DemoState) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch })); } catch { /* storage unavailable */ }
}

/** Called when the user presses "이어서 하기" in Extra. */
export function demoMarkResumeEntered() { write({ resumeEntered: true }); }

/**
 * Start a fresh walk-through: open `mobile.html?flow=briefing&demoReset=1`.
 * Clears this prototype's own session/local keys (journey, work status, revision, demo) and drops the parameter.
 */
export function consumeDemoReset() {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('demoReset')) return;
    ['plotto-journey', 'plotto-work-status-v1', KEY].forEach(k => sessionStorage.removeItem(k));
    localStorage.removeItem('plotto-document-revision-v2');
    localStorage.removeItem('plotto-messages-v1');
    Object.keys(localStorage).filter(k => k.startsWith('plotto-demo:')).forEach(k => localStorage.removeItem(k)); // scenario demo (files, versions, shares)
    url.searchParams.delete('demoReset');
    window.history.replaceState(null, '', url);
  } catch { /* ignore */ }
}

/** Pure overlay: real values stay, missing ones are filled with the demo stand-ins. */
export function applyDemo(work: WorkStatus, now = Date.now()): WorkStatus {
  if (!DEMO_SCENARIO) return work;
  const d = read();
  const sessionProposed = work.sessionProposed || !!d.resumeEntered;
  const waiting = work.sessionReserved && !work.sessionFinished && !work.sessionJoinable;
  const sessionJoinable = work.sessionJoinable || (waiting && !!d.reservedSeenAt && now - d.reservedSeenAt >= DEMO_JOINABLE_AFTER_MS);
  const sessionResult = work.sessionResult ?? (work.sessionFinished ? DEMO_SESSION_RESULT : undefined);
  return {
    ...work,
    sessionProposed,
    sessionJoinable,
    sessionResult,
    extraPhase: deriveExtraPhase({ finished: work.sessionFinished, reserved: work.sessionReserved, joinable: sessionJoinable, proposed: sessionProposed }),
    sources: {
      ...work.sources,
      sessionProposed: work.sessionProposed ? work.sources.sessionProposed : 'demo',
      sessionJoinable: work.sessionJoinable ? work.sources.sessionJoinable : 'demo',
      sessionResult: work.sessionResult ? work.sources.sessionResult : 'demo',
    },
  };
}

/** Hook: overlay + the clock for the "time has come" stand-in. */
export function useDemoWork(work: WorkStatus): WorkStatus {
  const [, tick] = useState(0);
  const waiting = work.sessionReserved && !work.sessionFinished && !work.sessionJoinable;
  useEffect(() => {
    if (!DEMO_SCENARIO || !waiting) return;
    if (!read().reservedSeenAt) write({ reservedSeenAt: Date.now() });
    const timer = window.setInterval(() => tick(n => n + 1), 1000);
    return () => window.clearInterval(timer);
  }, [waiting]);
  return applyDemo(work);
}
