import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { BackChevron, type ChromeRender } from "./ui";

const P = (n: string) => `/assets/proposal/${n}`;

/**
 * Shared chat frame, a visual copy of the original Plotto chat screens (proposal / intervention):
 * gradient header with white title, bottom glow on the page background, microphone + white pill composer.
 * Every chat in the message tab (AI task chats and people chats) renders inside this one shell.
 */
export default function ChatShell({
  title, subtitle, right, onBack, chrome, kb, children, above, value, onChange, onSend, placeholder, disabled, canSend, endRef,
}: {
  title: string; subtitle?: string; right?: ReactNode; onBack: () => void; chrome: ChromeRender; kb: number;
  children: ReactNode; above?: ReactNode;
  value: string; onChange: (v: string) => void; onSend: () => void; placeholder: string; disabled?: boolean; canSend: boolean;
  endRef: RefObject<HTMLDivElement | null>;
}) {
  const bottom = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(96);
  useEffect(() => {
    const el = bottom.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full bg-[#f4f7fd] font-['Pretendard'] not-italic overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 273, background: "radial-gradient(ellipse 129.05% 102.55% at 50% 102.55%, rgba(99,91,255,.3) 1.4423%, rgba(160,144,248,.65) 11.538%, #dcc4f2 21.635%, #d3d1ff 31.25%, #f5f6f9 100%)" }} />
      {chrome(true, true)}
      <header className="absolute inset-x-0 top-0 z-20" style={{ height: 112, borderRadius: "0 0 36px 36px", background: "linear-gradient(180deg,#2540c7,#8da0ff)" }}>
        <button aria-label="뒤로가기" onClick={onBack} className="absolute" style={{ left: 20, top: 66 }}><BackChevron color="#fff" /></button>
        {right && <div className="absolute" style={{ right: 20, top: 66 }}>{right}</div>}
        <div className="absolute inset-x-0 flex flex-col items-center pointer-events-none" style={{ top: subtitle ? 58 : 66 }}>
          <p className="font-semibold text-white" style={{ fontSize: 17, lineHeight: "24px" }}>{title}</p>
          {subtitle && <p className="text-white/75" style={{ fontSize: 12.5, lineHeight: "18px" }}>{subtitle}</p>}
        </div>
      </header>
      <div className="absolute inset-x-0 top-0 bottom-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden z-10" style={{ paddingTop: 112 + 22, paddingLeft: 20, paddingRight: 20, paddingBottom: h + 66 + kb }}>
        <div className="flex flex-col" style={{ minHeight: "100%" }}>{children}</div>
        <div ref={endRef} />
      </div>
      <div ref={bottom} className="absolute inset-x-0 z-20" style={{ bottom: kb > 0 ? kb + 10 : 43, padding: "0 20px" }}>
        {above}
        <form className="flex items-center" style={{ gap: 12, height: 50 }} onSubmit={(e) => { e.preventDefault(); onSend(); }}>
          <span aria-hidden className="shrink-0"><img alt="" src={P("d9333.svg")} style={{ width: 48, height: 48 }} /></span>
          <div className="flex flex-1 items-center bg-white border border-[#e1e7f2] min-w-0" style={{ height: 50, borderRadius: 60, padding: "0 18px" }}>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              aria-label="메시지 입력"
              disabled={disabled}
              onFocus={() => setTimeout(() => endRef.current?.scrollIntoView({ block: "end" }), 250)}
              className="w-full min-w-0 outline-none bg-transparent text-[#111] placeholder:text-[#a9b1c1]"
              style={{ fontSize: 14, lineHeight: 1.429, letterSpacing: ".203px" }}
            />
            <button type="submit" aria-label="보내기" disabled={!canSend} style={{ opacity: canSend ? 1 : 0.55 }}><img alt="" src={P("ab9cf.svg")} style={{ width: 24, height: 28, maxWidth: "none" }} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const UserBubble = ({ children }: { children: ReactNode }) => (
  <p className="self-end whitespace-pre-wrap bg-white text-[#111] text-right" style={{ maxWidth: "86%", fontSize: 16, lineHeight: 1.5, letterSpacing: ".0912px", padding: "12px 20px", borderRadius: 16 }}>{children}</p>
);
