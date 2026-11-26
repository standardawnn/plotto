/**
 * Local message store (localStorage, no server). One record per chat / per AI task, shared by every entry point:
 * the message tab and the dial's "이어서 하기" read and write the same task record, so a task never gets two histories.
 */
import { useSyncExternalStore } from "react";
import { AI_SEED, AI_TASKS, CHAT_SEED, type ChatId, type Msg } from "./data";

export const MESSAGES_KEY = "plotto-messages-v1";
export type ChatRecord = { messages: Msg[]; unread: number; lastAt?: string };
export type AiRecord = { messages: Msg[]; stage: number; lastAt?: string; proposed?: boolean };
export type MessageStore = { chats: Record<ChatId, ChatRecord>; ai: Record<string, AiRecord> };

const seed = (): MessageStore => ({
  chats: {
    group: { ...CHAT_SEED.group, messages: [...CHAT_SEED.group.messages] },
    tae: { ...CHAT_SEED.tae, messages: [...CHAT_SEED.tae.messages] },
    yu: { ...CHAT_SEED.yu, messages: [...CHAT_SEED.yu.messages] },
  },
  ai: Object.fromEntries(AI_TASKS.map((t) => [t.id, { messages: [...AI_SEED[t.id]], stage: 0 }])),
});

let current: MessageStore | null = null;
const listeners = new Set<() => void>();

function load(): MessageStore {
  if (current) return current;
  const base = seed();
  try {
    const saved = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "null") as Partial<MessageStore> | null;
    if (saved) current = { chats: { ...base.chats, ...saved.chats }, ai: { ...base.ai, ...saved.ai } };
  } catch { /* fall back to the seed */ }
  return (current ??= base);
}
function commit(next: MessageStore) {
  current = next;
  try { localStorage.setItem(MESSAGES_KEY, JSON.stringify(next)); } catch { /* in-memory only */ }
  listeners.forEach((l) => l());
}
export function useMessageStore(): MessageStore {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, load, load);
}
export const getMessageStore = load;

export const clock = (d = new Date()) => `${d.getHours() < 12 ? "오전" : "오후"} ${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;
export function relativeLabel(iso: string | undefined, fallback: string, now = Date.now()) {
  if (!iso) return fallback;
  const min = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  if (min < 60 * 24) return `${Math.floor(min / 60)}시간 전`;
  return fallback;
}
const uid = () => Math.random().toString(36).slice(2, 9);

export function sendChatMessage(chat: ChatId, text: string) {
  const s = load();
  const at = new Date().toISOString();
  const msg: Msg = { id: uid(), from: "me", text, time: clock(), at };
  commit({ ...s, chats: { ...s.chats, [chat]: { ...s.chats[chat], messages: [...s.chats[chat].messages, msg], lastAt: at } } });
}
export function markChatRead(chat: ChatId) {
  const s = load();
  if (!s.chats[chat].unread) return;
  commit({ ...s, chats: { ...s.chats, [chat]: { ...s.chats[chat], unread: 0 } } });
}
export function appendAi(taskId: string, msgs: Msg[], patch: Partial<AiRecord> = {}) {
  const s = load();
  const at = new Date().toISOString();
  const rec = s.ai[taskId];
  commit({ ...s, ai: { ...s.ai, [taskId]: { ...rec, ...patch, messages: [...rec.messages, ...msgs], lastAt: at } } });
}
export const newMsg = (from: Msg["from"], text: string): Msg => ({ id: uid(), from, text, time: clock(), at: new Date().toISOString() });
/** The dial's "이어서 하기" opens this task elsewhere; mark the same record as active instead of creating another one. */
export function touchAiTask(taskId: string) {
  const s = load();
  commit({ ...s, ai: { ...s.ai, [taskId]: { ...s.ai[taskId], lastAt: new Date().toISOString() } } });
}
/**
 * Interface for the booking screen (another owner). The booking screen does not read participants yet, so the choice is
 * published under a stable key it can read later: sessionStorage["plotto-session-participants-v1"]
 *   { ids: ("tae"|"yu")[], names: string[], source: "profile" | "group", at: ISO string }
 */
export const PARTICIPANTS_KEY = "plotto-session-participants-v1";
export type SessionParticipants = { ids: ("tae" | "yu")[]; names: string[]; source: "profile" | "group" | "ai"; at: string };
export function setSessionParticipants(ids: ("tae" | "yu")[], source: "profile" | "group" | "ai") {
  const names = ids.map((i) => (i === "tae" ? "태훈" : "유진"));
  try { sessionStorage.setItem(PARTICIPANTS_KEY, JSON.stringify({ ids, names, source, at: new Date().toISOString() } satisfies SessionParticipants)); } catch { /* ignore */ }
}
export function getSessionParticipants(): SessionParticipants | null {
  try { return JSON.parse(sessionStorage.getItem(PARTICIPANTS_KEY) || "null"); } catch { return null; }
}
