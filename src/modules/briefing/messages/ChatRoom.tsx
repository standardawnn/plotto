import { useEffect, useRef, useState } from "react";
import { CHATS, member, type ChatId, type Msg } from "./data";
import { go } from "../../../journey";
import { markChatRead, sendChatMessage, setSessionParticipants, useMessageStore } from "./store";
import { GroupAvatar, PlainAvatar, useKeyboardInset, type ChromeRender } from "./ui";
import ChatShell from "./ChatShell";

/** Person-to-person and team chat rooms. Local data only (store.ts); there is no server yet. */
export default function ChatRoom({ chatId, onBack, chrome }: { chatId: ChatId; onBack: () => void; chrome: ChromeRender }) {
  const meta = CHATS.find((c) => c.id === chatId)!;
  const store = useMessageStore();
  const rec = store.chats[chatId];
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const kb = useKeyboardInset();

  useEffect(() => { markChatRead(chatId); }, [chatId, rec.messages.length]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [rec.messages.length, kb]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendChatMessage(chatId, t);
    setText("");
  };
  const group = chatId === "group";

  return (
    <ChatShell
      title={group ? meta.name : `${meta.name}님`} subtitle={group ? "팀 채팅 · 3명" : meta.subtitle} onBack={onBack} chrome={chrome} kb={kb} endRef={end}
      right={group ? <button onClick={() => { setSessionParticipants(["tae", "yu"], "group"); go("booking"); }} className="font-semibold text-white" style={{ fontSize: 15 }}>공동세션</button> : undefined}
      value={text} onChange={setText} onSend={send} placeholder="메시지를 입력하세요" canSend={!!text.trim()}
    >
      <div className="flex flex-col" style={{ gap: 14 }}>
        {rec.messages.map((msg) => <Bubble key={msg.id} msg={msg} group={group} />)}
      </div>
    </ChatShell>
  );
}

function Bubble({ msg, group }: { msg: Msg; group: boolean }) {
  if (msg.from === "me") {
    return (
      <div className="flex flex-col items-end" style={{ gap: 4 }}>
        <p className="whitespace-pre-wrap bg-white text-[#111]" style={{ maxWidth: "76%", fontSize: 16, lineHeight: 1.5, padding: "10px 18px", borderRadius: 16 }}>{msg.text}</p>
        <span className="text-[#9a9db0]" style={{ fontSize: 11.5 }}>{msg.time}</span>
      </div>
    );
  }
  if (msg.from === "ai") return null;
  const who = member(msg.from);
  return (
    <div className="flex items-start" style={{ gap: 8 }}>
      <PlainAvatar id={msg.from} size={34} />
      <div className="flex flex-col items-start" style={{ gap: 4, maxWidth: "76%" }}>
        {group && <span className="font-medium text-[#57595d]" style={{ fontSize: 12.5 }}>{who.name}</span>}
        <p className="whitespace-pre-wrap text-[#111]" style={{ fontSize: 16, lineHeight: 1.5, padding: "2px 0" }}>{msg.text}</p>
        <span className="text-[#9a9db0]" style={{ fontSize: 11.5 }}>{msg.time}</span>
      </div>
    </div>
  );
}
export { GroupAvatar };
