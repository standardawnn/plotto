import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { go } from "../../../journey";
import { appBack, pushNav, setNavHere, useNav } from "../../../navHistory";
import { useWorkStatus, type ExtraPhase } from "../../../workStatus";
import { useDemoWork } from "../demoScenario";
import AiChat from "./AiChat";
import ChatRoom from "./ChatRoom";
import { AI_TASKS, CHATS, MEMBERS, MEMBER_WORK, getPresence, type ChatId, type MemberId } from "./data";
import { relativeLabel, setSessionParticipants, useMessageStore } from "./store";
import { BackChevron, BRAND, ChevronRight, GroupAvatar, PAGE_BG, PlainAvatar, PresenceAvatar, type ChromeRender } from "./ui";

const imgSparkle = "/assets/briefing/68c56.svg";
const imgNavHome = "/assets/project/ee9b8.svg";
const imgNavHomeBar = "/assets/briefing/49e20.svg";
const imgNavGrid = "/assets/briefing/de536.svg";
const imgNavMy = "/assets/briefing/d609e.svg";
const imgBell = "/assets/briefing/3325d.svg";
const imgBellDot = "/assets/briefing/ef6d0.svg";
const imgChatActive = "/assets/briefing/chat-active.svg";

type Route = { kind: "list" } | { kind: "chat"; id: ChatId } | { kind: "ai"; id: string };
const PHASE_NOTE: Record<ExtraPhase, string> = {
  resume: "이어서 작업 가능",
  proposed: "공동세션 제안",
  reserved: "공동세션 예약됨",
  joinable: "공동세션 시작 가능",
  finished: "공동세션 종료",
};

/**
 * Message tab (GNB 3rd). Overlay inside the briefing module, so no shared router file is touched.
 * Presence / member work / seeded chats are stand-in data (data.ts); AI answers come from mockAi.ts.
 */
export default function Messages({ onBack, onHome, chrome }: { onBack: () => void; onHome: () => void; chrome: ChromeRender }) {
  // Route and profile sheet are history entries (navHistory.ts). The AI chat can be opened from the dial too
  // (the dial pushes msgRoute itself), so its back is history.back() and returns to wherever it was opened from.
  const route = useNav<Route>("msgRoute", { kind: "list" });
  const sheet = useNav<MemberId | null>("msgSheet", null);
  const setRoute = (r: Route) => pushNav({ msgRoute: r.kind === "list" ? undefined : r });
  const backToList = () => appBack(() => setNavHere({ msgRoute: undefined }));
  const setSheet = (id: MemberId | null) => (id ? pushNav({ msgSheet: id }) : appBack(() => setNavHere({ msgSheet: undefined })));
  const [query, setQuery] = useState("");
  const store = useMessageStore();
  const [real] = useWorkStatus();
  const work = useDemoWork(real);

  if (route.kind === "chat") return <ChatRoom chatId={route.id} onBack={backToList} chrome={chrome} />;
  if (route.kind === "ai") return <AiChat taskId={route.id} onBack={backToList} chrome={chrome} />;

  const q = query.trim();
  const lastOf = (id: ChatId) => store.chats[id].messages[store.chats[id].messages.length - 1];
  const stamp = (id: ChatId) => (store.chats[id].lastAt ? new Date(store.chats[id].lastAt!).getTime() : 0);
  const rows = CHATS.filter((c) => !q || c.name.includes(q) || lastOf(c.id).text.includes(q)).sort((a, b) => stamp(b.id) - stamp(a.id)); // newest activity first, seed order otherwise
  const tasks = [...AI_TASKS].filter((t) => !q || t.title.includes(q) || t.summary.includes(q)).sort((a, b) => {
    const ta = store.ai[a.id].lastAt ? new Date(store.ai[a.id].lastAt!).getTime() : 0;
    const tb = store.ai[b.id].lastAt ? new Date(store.ai[b.id].lastAt!).getTime() : 0;
    return tb - ta;
  });

  return (
    <div className="relative w-full h-full font-['Pretendard'] not-italic overflow-hidden" style={{ background: PAGE_BG }}>
      {chrome(true)}
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative mx-auto w-full max-w-[520px]" style={{ paddingBottom: 150 }}>
          <div className="relative text-white" style={{ height: 122, borderRadius: "0 0 28px 28px", background: "linear-gradient(#2e49d1, #8da0ff)" }}>
            <button aria-label="뒤로가기" onClick={onBack} className="absolute" style={{ left: 20, top: 70 }}><BackChevron color="#fff" /></button>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-white/20" style={{ top: 62, height: 38, paddingInline: 22, gap: 6 }}>
              <span className="font-medium" style={{ fontSize: 16 }}>마케팅 공모전</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </div>
            {/* Same bell markup as the home screen, so the shared notification screen (extra-screens.js) opens from here too. */}
            <div className="absolute size-6" style={{ right: 20, top: 69 }}>
              <img alt="알림" src={imgBell} className="block size-full" style={{ filter: "brightness(0) invert(1)" }} />
              {work.unreadNotifications > 0 && <img alt="" src={imgBellDot} className="absolute block size-[10px] -right-[0.1px] -top-[2px]" />}
            </div>
          </div>

          <div style={{ padding: "22px 20px 0" }}>
            <label className="flex items-center rounded-full bg-[#e8eaf3]" style={{ height: 46, paddingInline: 18, gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c8094" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="메시지" aria-label="메시지 검색" className="flex-1 bg-transparent outline-none text-[#111] placeholder:text-[#7c8094]" style={{ fontSize: 16 }} />
            </label>
          </div>

          <div className="flex" style={{ padding: "22px 20px 0", gap: 18 }}>
            {MEMBERS.map((m) => (
              <button key={m.id} onClick={() => setSheet(m.id)} aria-label={`${m.name} 프로필 보기`} className="flex flex-col items-center" style={{ width: 72 }}>
                <PresenceAvatar id={m.id} size={72} dot={16} />
                <span className="font-medium text-[#111]" style={{ marginTop: 8, fontSize: 16, lineHeight: "22px" }}>{m.name}</span>
                <span className="text-[#808289]" style={{ fontSize: 14, lineHeight: "20px" }}>{m.role}</span>
              </button>
            ))}
            <button onClick={() => setRoute({ kind: "chat", id: "group" })} aria-label="전체 팀 채팅" className="flex flex-col items-center" style={{ width: 72 }}>
              <GroupAvatar size={72} />
              <span className="font-medium text-[#111]" style={{ marginTop: 8, fontSize: 16, lineHeight: "22px" }}>전체</span>
              <span className="text-[#808289]" style={{ fontSize: 14, lineHeight: "20px" }}>팀 채팅</span>
            </button>
          </div>

          {rows.length > 0 && <h2 className="font-semibold text-[#111]" style={{ padding: "28px 20px 4px", fontSize: 18 }}>메시지</h2>}
          <ul>
            {rows.map((c, i) => {
              const rec = store.chats[c.id];
              const last = lastOf(c.id);
              const who = last.from === "me" ? "나" : last.from === "ai" ? "" : MEMBERS.find((x) => x.id === last.from)!.name;
              return (
                <li key={c.id}>
                  <button onClick={() => setRoute({ kind: "chat", id: c.id })} className="flex w-full items-center text-left" style={{ padding: "12px 20px", gap: 14, borderTop: i ? "1px solid #e4e6f2" : undefined }}>
                    {c.id === "group" ? <GroupAvatar size={48} /> : <PlainAvatar id={c.id as MemberId} size={48} />}
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-[#111]" style={{ fontSize: 16, lineHeight: "22px" }}>{c.name}</span>
                      <span className="block truncate text-[#57595d]" style={{ fontSize: 14, lineHeight: "20px" }}>{c.id === "group" ? `${who}: ` : ""}{last.text}</span>
                    </span>
                    <span className="flex flex-col items-end shrink-0" style={{ gap: 6 }}>
                      <span className="text-[#808289]" style={{ fontSize: 12.5 }}>{relativeLabel(rec.lastAt, c.seedLabel)}</span>
                      {rec.unread > 0 ? <span aria-label="읽지 않은 메시지" className="rounded-full" style={{ width: 8, height: 8, background: BRAND }} /> : <span style={{ height: 8 }} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <h2 className="font-semibold text-[#111]" style={{ padding: "26px 20px 4px", fontSize: 18 }}>AI와 작업한 기록</h2>
          <ul>
            {tasks.map((t, i) => {
              const rec = store.ai[t.id];
              const note = t.id === "market" ? PHASE_NOTE[work.extraPhase] : "";
              return (
                <li key={t.id}>
                  <button onClick={() => setRoute({ kind: "ai", id: t.id })} className="flex w-full items-center text-left" style={{ padding: "13px 20px", gap: 14, borderTop: i ? "1px solid #e4e6f2" : undefined }}>
                    <span className="grid place-items-center shrink-0 bg-[#e9ebff]" style={{ width: 44, height: 44, borderRadius: 14 }}><img alt="" src={imgSparkle} style={{ width: 22, height: 22 }} /></span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-[#111]" style={{ fontSize: 16, lineHeight: "22px" }}>{t.title}</span>
                      <span className="block text-[#57595d]" style={{ fontSize: 14, lineHeight: "20px" }}>{rec.messages.length > AI_SEEDLEN(t.id) ? rec.messages[rec.messages.length - 1].text.split("\n")[0] : t.summary}</span>
                      <span className="block text-[#808289]" style={{ fontSize: 12.5, lineHeight: "18px", marginTop: 2 }}>
                        {note && <span className={work.extraPhase === "resume" ? "text-[#536ffa]" : ""}>{note} · </span>}{relativeLabel(rec.lastAt, t.seedLabel)}
                      </span>
                    </span>
                    <ChevronRight />
                  </button>
                </li>
              );
            })}
          </ul>
          {!rows.length && !tasks.length && <p className="text-[#808289]" style={{ padding: "28px 20px", fontSize: 14 }}>검색 결과가 없어요.</p>}
        </div>
      </div>

      <nav className="absolute left-1/2 -translate-x-1/2 bottom-9 w-max bg-white drop-shadow-[0px_0px_3.5px_rgba(0,0,0,0.2)] px-5 py-4 rounded-[36px]" aria-label="주 메뉴">
        <div className="flex gap-6 items-center">
          <button aria-label="홈" onClick={onHome} className="relative shrink-0 w-6 h-6">
            <img alt="" src={imgNavHomeBar} className="absolute block max-w-none" style={{ left: 11, top: 15, width: 2, height: 8 }} />
            <img alt="" src={imgNavHome} className="absolute block max-w-none" style={{ left: 1.6, top: 1.23 }} />
          </button>
          <button aria-label="프로젝트" onClick={() => go("intervention", "project")}><img alt="" src={imgNavGrid} className="block" style={{ width: 24, height: 24 }} /></button>
          <button aria-label="메시지" aria-current="page"><img alt="" src={imgChatActive} className="block" style={{ width: 24, height: 24 }} /></button>
          <button aria-label="내 정보"><img alt="" src={imgNavMy} className="block" style={{ width: 24, height: 24 }} /></button>
        </div>
      </nav>

      <AnimatePresence>
        {sheet && (
          <ProfileSheet
            id={sheet}
            updatedMe={relativeLabel(work.lastActivityAt, "3시간 전")}
            onClose={() => setSheet(null)}
            onChat={(id) => setNavHere({ msgSheet: undefined, msgRoute: { kind: "chat", id } })}
            onSession={(id) => { setSessionParticipants([id], "profile"); go("booking"); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

import { AI_SEED } from "./data";
const AI_SEEDLEN = (id: string) => AI_SEED[id].length;

function ProfileSheet({ id, updatedMe, onClose, onChat, onSession }: { id: MemberId; updatedMe: string; onClose: () => void; onChat: (id: ChatId) => void; onSession: (id: "tae" | "yu") => void }) {
  const m = MEMBERS.find((x) => x.id === id)!;
  const p = getPresence(id);
  const w = MEMBER_WORK[id];
  const isMe = id === "me";
  return (
    <div className="absolute inset-0 z-30">
      <motion.div className="absolute inset-0 bg-[#14142e]/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden="true" />
      <motion.section
        role="dialog"
        aria-label={`${m.name} 프로필`}
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[520px] bg-white"
        style={{ borderRadius: "28px 28px 0 0", padding: "10px 20px 40px" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 600) onClose(); }}
      >
        <div className="mx-auto rounded-full bg-[#d5d8e4]" style={{ width: 40, height: 4 }} />
        <div className="flex items-center" style={{ marginTop: 20, gap: 14 }}>
          <PresenceAvatar id={id} size={56} dot={14} ring="#fff" />
          <div>
            <p className="font-semibold text-[#111]" style={{ fontSize: 20, lineHeight: "28px" }}>{m.name}{isMe ? "" : "님"}</p>
            <p className="text-[#808289]" style={{ fontSize: 14, lineHeight: "20px" }}>{m.sheetRole}</p>
          </div>
        </div>
        <p className="flex items-center text-[#57595d]" style={{ marginTop: 12, gap: 6, fontSize: 14 }}>
          <span className="rounded-full" style={{ width: 8, height: 8, background: p.online ? "#3fbf78" : "#b4b8c4" }} />
          {p.online ? "현재 접속 중" : `마지막 접속 ${p.lastSeen}`}
        </p>
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #e4e6f2" }}>
          <p className="text-[#808289]" style={{ fontSize: 13 }}>현재 작업 중</p>
          <p className="font-semibold text-[#111]" style={{ marginTop: 4, fontSize: 18, lineHeight: "26px" }}>{w.title}</p>
          <p className="text-[#57595d]" style={{ marginTop: 4, fontSize: 14, lineHeight: 1.55 }}>{w.detail}</p>
          <p className="text-[#808289]" style={{ marginTop: 8, fontSize: 12.5 }}>마지막 업데이트 · {isMe ? updatedMe : w.updated}</p>
        </div>
        {!isMe && (
          <div className="flex" style={{ marginTop: 22, gap: 12 }}>
            <button onClick={() => onChat(id as ChatId)} className="flex-1 font-semibold text-[#536ffa] bg-white border border-[#536ffa]" style={{ height: 52, borderRadius: 14, fontSize: 16 }}>채팅하기</button>
            <button onClick={() => onSession(id as "tae" | "yu")} className="flex-1 font-semibold text-white" style={{ height: 52, borderRadius: 14, fontSize: 16, background: "#6270e0" }}>공동세션</button>
          </div>
        )}
      </motion.section>
    </div>
  );
}
