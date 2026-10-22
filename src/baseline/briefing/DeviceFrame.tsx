import { useEffect, useState, type ReactNode } from "react";

// Logical phone screen (design width 402, 9:19.5)
const SCREEN_W = 402;
const SCREEN_H = Math.round((SCREEN_W * 19.5) / 9); // 871
const BEZEL = 12;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;
const MARGIN = 48;

type Mode = "device" | "full";

const isPhone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse) and (max-width: 820px)").matches || window.innerWidth < 600);

const initialMode = (): Mode => {
  const q = new URLSearchParams(window.location.search).get("mode");
  if (q === "full" || q === "device") return q;
  return (localStorage.getItem("plotto-view") as Mode) || "device";
};

/** Outer presentation shell only — the app itself renders untouched inside. */
export default function DeviceFrame({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState(isPhone);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      setPhone(isPhone());
      const avail = window.innerHeight - MARGIN * 2 - 40;
      setScale(Math.min(1, avail / FRAME_H, (window.innerWidth - MARGIN * 2) / FRAME_W));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    localStorage.setItem("plotto-view", mode);
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f" && !(e.target instanceof HTMLInputElement)) setMode((m) => (m === "device" ? "full" : "device"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  // Real phones: plain full-screen app, safe areas handled by the app itself
  if (phone) {
    return <div className="fixed inset-0 overflow-hidden overscroll-none">{children}</div>;
  }

  const toggle = (
    <div className="fixed top-5 right-5 z-[100] flex items-center gap-1 rounded-full bg-white/90 p-1 font-['Pretendard'] text-[12px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.06)] backdrop-blur">
      {(["device", "full"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`rounded-full px-3.5 py-1.5 transition-colors ${mode === m ? "bg-[#111] text-white" : "text-[#6b7280] hover:text-[#111]"}`}
        >
          {m === "device" ? "디바이스" : "전체 화면"}
        </button>
      ))}
    </div>
  );

  if (mode === "full") {
    return (
      <div className="fixed inset-0 overflow-hidden">
        {children}
        {toggle}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#eef0f2] bg-[radial-gradient(ellipse_at_50%_40%,#f8f9fa_0%,#eef0f2_60%,#e6e8eb_100%)]">
      {toggle}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
          <div
            className="relative origin-top-left"
            style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
          >
            {/* side buttons */}
            <span className="absolute -left-[3px] top-[150px] h-[30px] w-[3px] rounded-l-sm bg-[#2a2b2e]" />
            <span className="absolute -left-[3px] top-[205px] h-[56px] w-[3px] rounded-l-sm bg-[#2a2b2e]" />
            <span className="absolute -left-[3px] top-[272px] h-[56px] w-[3px] rounded-l-sm bg-[#2a2b2e]" />
            <span className="absolute -right-[3px] top-[230px] h-[88px] w-[3px] rounded-r-sm bg-[#2a2b2e]" />
            {/* body */}
            <div
              className="absolute inset-0 rounded-[64px] bg-[#1b1c1e]"
              style={{ boxShadow: "inset 0 0 0 1.5px #4a4b4f, inset 0 0 0 3px #111, 0 30px 60px -20px rgba(15,20,30,0.28), 0 8px 20px -8px rgba(15,20,30,0.18)" }}
            />
            {/* screen */}
            <div
              className="absolute overflow-hidden rounded-[52px] bg-white [transform:translateZ(0)]"
              style={{ left: BEZEL, top: BEZEL, width: SCREEN_W, height: SCREEN_H }}
            >
              {children}
              {/* dynamic island + home indicator */}
              <div className="pointer-events-none absolute left-1/2 top-[11px] z-[90] h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
              <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-[90] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/80" />
            </div>
          </div>
        </div>
        <p className="mt-5 font-['Pretendard'] text-[12px] text-[#9aa0a8]">Plotto Prototype · F 키로 보기 전환</p>
      </div>
    </div>
  );
}
