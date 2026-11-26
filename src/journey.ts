export const flows = ['briefing','intervention','opinion','project','proposal','booking','session','feedback','classification'] as const;
export type Flow = typeof flows[number];
export type Journey = { sharedWith?: string[]; sessionTopic?: string; sessionTime?: string; sessionFinished?: boolean; opinionSent?: boolean; opinionText?: string; recipientMessages?: string[] };
import { markCrossNavigation } from './navHistory';
export function readJourney(): Journey {
  try { return JSON.parse(sessionStorage.getItem('plotto-journey') || '{}'); } catch { return {}; }
}
export function recordJourney(update: Journey) {
  try { sessionStorage.setItem('plotto-journey', JSON.stringify({ ...readJourney(), ...update })); } catch { /* Private browser storage may be unavailable. */ }
}
export function go(flow: Flow, entry = '') {
  if (flow === 'intervention' && entry === 'project') { flow = 'project'; entry = ''; }
  if (flow === 'intervention' && entry === 'booking') { flow = 'booking'; entry = ''; }
  if (flow === 'intervention' && entry === 'session') { flow = 'proposal'; entry = ''; }
  if (flow === 'opinion') { flow = 'feedback'; entry = ''; }
  const url = new URL('mobile.html', window.location.href);
  url.search = new URLSearchParams({ flow, ...(entry ? { entry } : {}) }).toString();
  markCrossNavigation(); // the next page's back button returns here (see navHistory.ts)
  window.location.assign(url);
}
export const entry = new URLSearchParams(window.location.search).get('entry') || '';
