/**
 * Back navigation that follows the real path the person took.
 *
 * Every in-app screen change that the person can come back from (dial detail, document flow, message list ->
 * chat, AI chat, bottom sheets, booking steps ...) is a browser history entry. The screen state lives in
 * `history.state.plottoNav`, so:
 *  - the in-app back button and the browser/Android back do the same thing: `history.back()`;
 *  - a page that is reloaded when the person comes back to it (every `go()` is a full page load) restores the
 *    screen it was showing from that entry, e.g. booking -> back returns to the AI chat or the message list,
 *    not to a fixed home screen;
 *  - the same screen reached from two places (AI chat from the dial or from the message tab) goes back to
 *    wherever it was opened from, because "back" is simply the previous entry.
 *
 * `appBack(fallback)` only uses `history.back()` when the previous entry belongs to the app (an entry pushed
 * here, or a page reached with go()); on the very first screen it runs the fallback instead of leaving the app.
 */
import { useEffect, useState } from 'react';

const KEY = 'plottoNav';
const NAV_EVENT = 'plotto:nav';
const PENDING = 'plotto-nav-pending';

type NavState = { d?: number; cross?: boolean; [key: string]: unknown };

export function navState(): NavState {
  try { return (history.state && history.state[KEY]) || {}; } catch { return {}; }
}

export function readNav<T>(key: string, fallback: T): T {
  const value = navState()[key];
  return value === undefined ? fallback : (value as T);
}

/** New history entry with these values (undefined = back to the screen's default). */
export function pushNav(patch: Record<string, unknown>) {
  const s = navState();
  try { history.pushState({ ...(history.state || {}), [KEY]: { ...s, ...patch, d: (s.d || 0) + 1 } }, ''); } catch { /* ignore */ }
  window.dispatchEvent(new Event(NAV_EVENT));
}

/** Update the current entry without adding one (positions, remembered choices). */
export function replaceNav(patch: Record<string, unknown>) {
  try { history.replaceState({ ...(history.state || {}), [KEY]: { ...navState(), ...patch } }, ''); } catch { /* ignore */ }
}

/** Change the current entry's screen state in place (used when there is no app entry to go back to). */
export function setNavHere(patch: Record<string, unknown>) {
  replaceNav(patch);
  window.dispatchEvent(new Event(NAV_EVENT));
}

/** True when the previous history entry is part of the app (so history.back() stays in the app). */
export function canGoBack() {
  const s = navState();
  return (s.d || 0) > 0 || !!s.cross;
}

export function appBack(fallback?: () => void) {
  if (canGoBack()) history.back();
  else fallback?.();
}

/** Call right before a full page navigation inside the app (go(), shell frame change). */
export function markCrossNavigation() {
  try { sessionStorage.setItem(PENDING, '1'); } catch { /* ignore */ }
}


// The page that a go() opened marks its first entry, so its back button returns to the page before it.
try {
  if (sessionStorage.getItem(PENDING)) {
    sessionStorage.removeItem(PENDING);
    const s = navState();
    if (!s.cross && !s.d) replaceNav({ cross: true });
  }
} catch { /* ignore */ }

/** Screen state kept in the history entry. Changes go through pushNav / history.back(). */
export function useNav<T>(key: string, initial: T): T {
  const [value, setValue] = useState<T>(() => readNav(key, initial));
  useEffect(() => {
    const sync = () => setValue(readNav(key, initial));
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener(NAV_EVENT, sync); };
    // initial is a constant default per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return value;
}
