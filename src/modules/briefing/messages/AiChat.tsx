import { useEffect, useRef, useState } from "react";
import { go } from "../../../journey";
import { recordActivity, recordSessionProposed } from "../../../workStatus";
import { AI_TASKS, type Msg } from "./data";
import { getAiReply, stageCount, suggestionsFor } from "./mockAi";
import { appendAi, newMsg, setSessionParticipants, useMessageStore } from "./store";
import ProposalSheet from "./ProposalSheet";
import { appBack, pushNav, setNavHere, useNav } from "../../../navHistory";
import { useKeyboardInset, type ChromeRender } from "./ui";
import ChatShell, { UserBubble } from "./ChatShell";

const sparkle = "/assets/briefing/68c56.svg";

/**
 * Per-task AI chat. UI only: answers come from getAiReply (mockAi.ts).
 * History and stage live in the shared message store, so the same task opened from the dial or from this tab is one conversation.
 */
export default function AiChat({ taskId, onBack, chrome }: { taskId: string; onBack: () => void; chrome: ChromeRender }) {
  const task = AI_TASKS.find((t) => t.id === taskId)!;
  const store = useMessageStore();
  const rec = store.ai[taskId];
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const sheet = useNav<boolean>("aiSheet", false); // history entry: back closes the sheet first
  const setSheet = (open: boolean) => (open ? pushNav({ aiSheet: true }) : appBack(() => setNavHere({ aiSheet: undefined })));
  const end = useRef<HTMLDivElement>(null);
  const kb = useKeyboardInset();
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [rec.messages.length, busy, kb]);

  const suggestions = suggestionsFor(taskId, rec.stage);
  const send = async () => {
    const t = text.trim();
    if (!t || busy) return;
    setText("");
    setBusy(true);
    appendAi(taskId, [newMsg("me", t)]);
    const [turn] = await Promise.all([getAiReply({ taskId, stage: rec.stage, text: t }), new Promise((r) => setTimeout(r, 1600))]);
    appendAi(taskId, [newMsg("ai", turn.reply)], { stage: turn.stage, ...(turn.proposeSession ? { proposed: true } : {}) });
    setBusy(false);
    if (turn.proposeSession) {
      // The real proposal moment: update the shared work status, then show the proposal over this chat.
      recordSessionProposed();
      recordActivity();
      setTimeout(() => { if (alive.current) setSheet(true); }, 900);
    }
  };

  return (
    <>
      <ChatShell
        title={task.title} subtitle={task.context} onBack={onBack} chrome={chrome} kb={kb} endRef={end}
        value={text} onChange={setText} onSend={() => void send()} placeholder="작업을 이어가요..." disabled={busy} canSend={!!text.trim() && !busy}
        above={suggestions.length > 0 && !busy ? (
          <div className="flex flex-wrap" style={{ gap: 8, marginBottom: 10 }}>
            {suggestions.map((q) => (
              <button key={q} onClick={() => setText(q)} className="text-left text-[#3f3f5a] bg-white/90 border border-[#bebfff]" style={{ fontSize: 14, lineHeight: 1.4, padding: "9px 14px", borderRadius: 18 }}>{q}</button>
            ))}
          </div>
        ) : undefined}
      >
        <div className="flex flex-col" style={{ gap: 18 }}>
          {rec.messages.map((m) => <AiBubble key={m.id} msg={m} />)}
          {busy && (
            <div className="flex items-center text-[#6b6e86]" style={{ gap: 8, fontSize: 14 }} role="status">
              <img alt="" src={sparkle} style={{ width: 18, height: 18 }} />
              <span>분석하고 있어요</span>
              <span className="inline-flex" style={{ gap: 3 }}>
                {[0, 1, 2].map((i) => <i key={i} className="block rounded-full bg-[#9693ff]" style={{ width: 5, height: 5, animation: `plottoDot 1s ${i * 0.15}s infinite ease-in-out` }} />)}
              </span>
            </div>
          )}
          {rec.stage >= stageCount(taskId) && !busy && <p className="text-[#8d90a8]" style={{ fontSize: 12.5 }}>이 업무에서 준비된 대화는 여기까지예요.</p>}
        </div>
        <img alt="" src="/assets/proposal/4e55b.png" className="mx-auto mt-auto" style={{ width: 112, height: 112, objectFit: "cover", marginTop: 24 }} />
        <style>{`@keyframes plottoDot{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}`}</style>
      </ChatShell>
      <ProposalSheet open={sheet} onClose={() => setSheet(false)} onReserve={() => { setSessionParticipants(["tae"], "ai"); go("booking"); }} />
    </>
  );
}

function AiBubble({ msg }: { msg: Msg }) {
  if (msg.from === "me") return <UserBubble>{msg.text}</UserBubble>;
  return <p className="whitespace-pre-wrap text-[#111]" style={{ fontSize: 16, lineHeight: 1.625, letterSpacing: ".0912px" }}>{msg.text}</p>;
}
