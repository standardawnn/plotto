import { go } from "../../journey";
import { useEffect, useRef, useState } from "react";
import { animate, motion, AnimatePresence } from "motion/react";
import DocFlow from "./DocFlow";
import BriefingCharacter from "../../BriefingCharacter";

const A = "/assets/briefing";
const imgCharacter = `${A}/546e2.png`;
const imgChevron = `${A}/46565.svg`;
const imgCharacterNow = `${A}/b021f.png`;
const imgSparkle = `${A}/68c56.svg`;
const imgSparkleSm = `${A}/091a8.svg`;
const imgChevronRight = `${A}/71752.svg`;
const imgListCheck = `${A}/61baa.svg`;
const imgLogoA = `${A}/390c5.svg`;
const imgLogoB = `${A}/e127e.svg`;
const imgLogoStroke = `${A}/06af8.svg`;
const imgLogoGroup = `${A}/8f63c.svg`;
const imgLogoMask = `${A}/01e2a.svg`;
const imgLogoGroup2 = `${A}/1ed88.svg`;
const imgDialRing = `${A}/dial-ring.png`;
const imgHand = `${A}/57972.png`;
const imgClock = `${A}/9bfb2.svg`;
const imgWarning = `${A}/c3f48.svg`;
// Home
const imgPlotto = "/brand/logotype.svg";
const imgBell = `${A}/3325d.svg`;
const imgBellDot = `${A}/ef6d0.svg`;
const imgChars = `${A}/2b675.png`;
const imgChar3492 = `${A}/76cb0.png`;
const imgHourglass = `${A}/00e17.svg`;
const imgE323 = `${A}/acd76.svg`;
const imgE262 = `${A}/cb6c2.svg`;
const imgE325 = `${A}/a3837.svg`;
const imgE326 = `${A}/62918.svg`;
const imgE261 = `${A}/ff5f9.svg`;
const imgE324 = `${A}/f1dd7.svg`;
const imgE263 = `${A}/13d51.svg`;
const imgE264 = `${A}/0edcb.svg`;
const imgE265 = `${A}/463be.svg`;
const imgE266 = `${A}/700d0.svg`;
const imgNavHomeBar = `${A}/49e20.svg`;
const imgNavHome = `${A}/e4e8a.svg`;
const imgNavGrid = `${A}/de536.svg`;
const imgNavChat = `${A}/fdd84.svg`;
const imgNavMy = `${A}/d609e.svg`;

const BG =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 402 874' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-20.1 80.016 -36.804 -67.343 201 73.838)'><stop stop-color='rgba(48,45,110,1)' offset='0'/><stop stop-color='rgba(38,36,85,1)' offset='0.25'/><stop stop-color='rgba(28,26,59,1)' offset='0.5'/><stop stop-color='rgba(18,17,34,1)' offset='0.75'/><stop stop-color='rgba(12,12,21,1)' offset='0.875'/><stop stop-color='rgba(7,7,8,1)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 51.954%), linear-gradient(270deg, rgb(186, 184, 255) 0%, rgb(180, 225, 255) 40.919%, rgb(232, 246, 255) 76.67%, rgb(199, 233, 255) 89.494%)";
const HOME_TOP_BG =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 402 294' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(2.0399e-14 -30.15 51.88 3.6255e-13 201 301.5)'><stop stop-color='rgba(99,91,255,0.3)' offset='0.014423'/><stop stop-color='rgba(160,144,248,0.65)' offset='0.11538'/><stop stop-color='rgba(220,196,242,1)' offset='0.21635'/><stop stop-color='rgba(211,209,255,1)' offset='0.3125'/><stop stop-color='rgba(245,246,249,1)' offset='1'/></radialGradient></defs></svg>\")";
const BRIEF_CARD_BG =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 362 196' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-18.1 17.944 -33.142 -15.102 181 16.559)'><stop stop-color='rgba(48,45,110,1)' offset='0'/><stop stop-color='rgba(38,36,85,1)' offset='0.25'/><stop stop-color='rgba(28,26,59,1)' offset='0.5'/><stop stop-color='rgba(18,17,34,1)' offset='0.75'/><stop stop-color='rgba(12,12,21,1)' offset='0.875'/><stop stop-color='rgba(7,7,8,1)' offset='1'/></radialGradient></defs></svg>\")";

const STEPS = [
  { label: "Before", title: "0925 회의 진행", body: ["9월 25일 유진님과 태훈님의", "기획안 회의가 진행됐어요"] },
  { label: "Now", title: "수정 기획안 확인", body: ["9월 25일 회의를 기반으로", "Plotto가 기획안을 수정했어요"] },
  { label: "Next", title: "최종 기획안 공유", body: ["최종 확정된 기획안을 연관된", "팀원과 공유해야 해요"] },
  { label: "Extra", title: "기업분석 보고서 작성", body: ["그 다음 진행해야 할 일이에요", "태훈님이 기다리고 있어요"] },
];
// Collapsed stack (design 10:166): Now in front, the rest as offset ghost cards
const STACK = [
  { x: 30, y: 392, o: 0.7 },
  { x: 20, y: 380, o: 1 },
  { x: 40, y: 400, o: 0.4 },
  { x: 50, y: 410, o: 0.2 },
];

// Design base: 402 x 874
const BASE_W = 402;
const GAP_DEG = 26;
const ACTIVE_DEG = 183;
const HEADER_BOTTOM = 200; // header safe boundary (design px)
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type View = "dial" | "before" | "now";
const EASE = [0.22, 1, 0.36, 1] as const;

function DeviceChrome({light=false}:{light?:boolean}) {
  return <><div className={`integration-status ${light?'light':''}`} style={{position:'absolute',zIndex:35}} aria-hidden="true"><span>9:41</span><i/><img src="/assets/intervention/8b917.svg" alt=""/></div><div className="integration-home-indicator" style={{position:'absolute',zIndex:35,background:light?'white':'black'}} aria-hidden="true"/></>;
}

export default function App() {
  const [screen, setScreen] = useState<"home" | "briefing">("home");
  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {screen === "home" ? (
          <motion.div key="home" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Home onBriefing={() => setScreen("briefing")} />
          </motion.div>
        ) : (
          <motion.div key="briefing" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Briefing onExit={() => setScreen("home")} />
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes pinch{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
    </div>
  );
}

function Briefing({ onExit }: { onExit: () => void }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(BASE_W);
  // dialRotation in step units: 0 = Before active, 3 = Extra active
  const [rot, setRot] = useState(0);
  const rotRef = useRef(0);
  // spread: 0 = collapsed stack, 1 = fanned out on the dial
  const [sp, setSp] = useState(0);
  const spRef = useRef(0);
  const [view, setView] = useState<View>("dial");
  const [docOpen, setDocOpen] = useState(false);
  const anim = useRef<ReturnType<typeof animate> | null>(null);
  const spAnim = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => () => { anim.current?.stop(); spAnim.current?.stop(); }, []);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d0: number; start: number } | null>(null);
  const drag = useRef<{ x: number; start: number; startIdx: number; samples: { x: number; t: number }[]; tap: number | null; moved: number } | null>(null);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.min(el.clientWidth, 520)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const s = w / BASE_W;
  const expanded = sp > 0.999;
  const setRotation = (v: number) => {
    rotRef.current = v;
    setRot(v);
  };
  const setSpread = (v: number) => {
    spRef.current = v;
    setSp(v);
  };
  const snapTo = (target: number) => {
    anim.current?.stop();
    anim.current = animate(rotRef.current, target, { type: "spring", duration: 0.55, bounce: 0.08, onUpdate: setRotation });
  };
  const spreadTo = (target: number) => {
    spAnim.current?.stop();
    spAnim.current = animate(spRef.current, target, { type: "spring", duration: 0.7, bounce: 0.1, onUpdate: setSpread });
  };

  const pxPerStep = 150 * s;
  const dist = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!expanded) {
      if (pointers.current.size === 2) {
        spAnim.current?.stop();
        pinch.current = { d0: dist(), start: spRef.current };
      }
      drag.current = pointers.current.size === 1
        ? { x: e.clientX, start: 0, startIdx: 0, samples: [], tap: null, moved: 0 }
        : null;
      return;
    }
    if (pointers.current.size > 1) return;
    anim.current?.stop();
    const el = (e.target as Element).closest("[data-step]");
    drag.current = {
      x: e.clientX,
      start: rotRef.current,
      startIdx: Math.round(rotRef.current),
      samples: [{ x: e.clientX, t: performance.now() }],
      tap: el ? Number(el.getAttribute("data-step")) : null,
      moved: 0,
    };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!expanded) {
      if (pinch.current && pointers.current.size === 2) {
        setSpread(clamp(pinch.current.start + (dist() - pinch.current.d0) / (140 * s), 0, 1));
      } else if (drag.current) {
        drag.current.moved = Math.max(drag.current.moved, Math.abs(e.clientX - drag.current.x));
      }
      return;
    }
    const d = drag.current;
    if (!d) return;
    d.moved = Math.max(d.moved, Math.abs(e.clientX - d.x));
    // drag left → advance (next step comes up the arc)
    let v = d.start - (e.clientX - d.x) / pxPerStep;
    v = clamp(v, d.startIdx - 1, d.startIdx + 1);
    if (v < 0) v = v * 0.3;
    if (v > 3) v = 3 + (v - 3) * 0.3;
    setRotation(v);
    d.samples.push({ x: e.clientX, t: performance.now() });
    if (d.samples.length > 6) d.samples.shift();
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (!expanded) {
      if (pinch.current) {
        if (pointers.current.size < 2) {
          spreadTo(spRef.current > 0.3 ? 1 : 0);
          pinch.current = null;
          drag.current = null;
        }
        return;
      }
      // mouse fallback: a plain tap on the stack fans it out
      if (drag.current && drag.current.moved < 6) spreadTo(1);
      drag.current = null;
      return;
    }
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    // tap (no real drag) on Before / Now card → open its detail screen
    if (d.moved < 6 && (d.tap === 0 || d.tap === 1)) {
      if (d.tap !== Math.round(rotRef.current)) snapTo(d.tap);
      setView(d.tap === 0 ? "before" : "now");
      return;
    }
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const vel = (last.x - first.x) / Math.max(1, last.t - first.t); // px/ms
    let target = Math.round(rotRef.current);
    if (Math.abs(vel) > 0.35 && target === d.startIdx) target = d.startIdx + (vel < 0 ? 1 : -1);
    snapTo(clamp(clamp(target, d.startIdx - 1, d.startIdx + 1), 0, 3));
  };
  // trackpad pinch (ctrl + wheel) also spreads the stack
  const onWheel = (e: React.WheelEvent) => {
    if (expanded || !e.ctrlKey) return;
    spAnim.current?.stop();
    const v = clamp(spRef.current - e.deltaY / 120, 0, 1);
    setSpread(v);
    if (v >= 1 || v > 0.6) spreadTo(1);
  };

  const onBack = () => {
    if (view !== "dial") setView("dial");
    else if (sp > 0) {
      snapTo(0);
      spreadTo(0);
    } else onExit();
  };

  // Dial geometry (relative to screen width)
  const R = 402 * s;
  const cx = 19 * s + R * Math.cos(((ACTIVE_DEG - 180) * Math.PI) / 180);
  const cy = 316 * s - R * Math.sin(((ACTIVE_DEG - 180) * Math.PI) / 180);
  const activeIdx = clamp(Math.round(rot), 0, 3);
  const tNow = sp * clamp(1 - Math.abs(1 - rot), 0, 1); // Now-emphasis amount

  const header =
    view === "now" || (view === "dial" && expanded && activeIdx === 1)
      ? ["수정된 기획안을", "확인해주세요"]
      : view === "dial" && expanded && activeIdx >= 2
        ? ["모든 팀원에게", "공유할 작업이에요"]
        : view === "before" || sp > 0.5
        ? ["서연님이 자리를 비운 동안", "회의가 진행됐어요"]
        : ["프로젝트가 어떻게", "진행되는지 함께 살펴요."];

  return (
    <div ref={screenRef} className="relative w-full h-full overflow-hidden select-none touch-none" style={{ backgroundImage: BG }}>
      {!docOpen && <DeviceChrome light/>}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[520px] overflow-clip">
        {/* DialBackground — static: the circles never rotate */}
        <img
          alt=""
          src={imgDialRing}
          className="absolute block max-w-none pointer-events-none mix-blend-screen"
          style={{ left: 7 * s, top: 153 * s, height: 659 * s, width: (659 * 2220 / 3810) * s }}
        />

        {/* Gesture tooltips — only while collapsed */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 1 - clamp(sp * 2.5, 0, 1) }}>
          <div className="absolute flex flex-col items-end font-['Pretendard']" style={{ left: 137 * s, top: 290 * s, width: 245 * s, gap: 2 * s }}>
            <div className="flex items-center" style={{ gap: 5 * s }}>
              <img alt="" src={imgSparkleSm} className="block" style={{ width: 24 * s, height: 24 * s }} />
              <p className="font-medium text-white whitespace-nowrap" style={{ fontSize: 18 * s, lineHeight: 1.445 }}>
                플로토가 제안하는 할 일이에요
              </p>
            </div>
            <p className="font-normal text-white/50 text-right whitespace-nowrap" style={{ fontSize: 14 * s, lineHeight: 1.429, letterSpacing: 0.203 * s }}>
              카드를 펼쳐 자세히 확인할 수 있어요
            </p>
          </div>
          <img
            alt=""
            src={imgHand}
            className="absolute block object-cover animate-[pinch_1.6s_ease-in-out_infinite]"
            style={{ left: 189.5 * s, top: 526 * s, width: 155 * s, height: 155 * s }}
          />
          <p className="absolute font-['Pretendard'] font-medium text-white/40 whitespace-nowrap" style={{ left: 214 * s, top: 689 * s, fontSize: 14 * s, lineHeight: 1.445 }}>
            두 손으로 확대해서 펼치기
          </p>
        </div>

        {/* DialContentViewport — clipped below the header boundary, fades in at the edge */}
        <motion.div
          animate={{ opacity: view === "dial" ? 1 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`absolute inset-x-0 bottom-0 overflow-hidden ${expanded ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"} ${view === "dial" ? "" : "pointer-events-none"}`}
          style={{
            top: HEADER_BOTTOM * s,
            maskImage: `linear-gradient(to bottom, transparent 0px, black ${32 * s}px)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, black ${32 * s}px)`,
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onWheel={onWheel}
        >
          {STEPS.map((step, i) => {
            const offset = i - rot;
            const d = Math.abs(offset);
            const t = clamp(1 - d, 0, 1); // activeness on the dial
            const dScale = 1 - 0.11 * clamp(d, 0, 1) - 0.09 * clamp(d - 1, 0, 1);
            const dOpacity = 1 - 0.38 * clamp(d, 0, 1) - 0.32 * clamp(d - 1, 0, 1);
            const ang = ((ACTIVE_DEG - offset * GAP_DEG) * Math.PI) / 180;
            const st = STACK[i];
            const x = lerp(st.x * s, cx + R * Math.cos(ang), sp);
            const y = lerp(st.y * s, cy + R * Math.sin(ang), sp) - HEADER_BOTTOM * s;
            const scale = lerp(1, dScale, sp);
            const opacity = lerp(st.o, dOpacity, sp);
            const isNow = i === 1;
            // label: Now is shown above the stack while collapsed; others appear as it spreads
            const lt = lerp(isNow ? 1 : 0, t, sp);
            const labelOpacity = isNow ? 1 : sp;
            const contentOpacity = isNow ? 1 : clamp(sp * 1.6 - 0.2, 0, 1);
            const body = isNow
              ? sp < 0.5
                ? ["9월 25일 회의를 기반으로", "수정된 기획안이에요"]
                : tNow > 0.5
                  ? ["9월 25일 회의를 기반으로", "Plotto가 기획안을 수정했어요"]
                  : step.body
              : step.body;
            return (
              <div
                key={step.label}
                className="absolute left-0 top-0 origin-top-left will-change-transform"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  opacity,
                  zIndex: isNow && sp < 0.5 ? 20 : 10 - Math.round(lerp(i === 0 ? 1 : i, d, sp)),
                }}
                aria-current={expanded && i === activeIdx ? "step" : undefined}
              >
                <p
                  className="absolute left-0 top-0 font-['Montserrat:SemiBold'] font-semibold whitespace-nowrap"
                  style={{
                    opacity: labelOpacity,
                    fontSize: lerp(14, 18, lt) * s,
                    lineHeight: 1.445,
                    color: `rgb(${lerp(190, 255, lt)}, ${lerp(191, 255, lt)}, 255)`,
                    transform: `translate(calc(${-(1 - lt) * 100}% - ${(1 - lt) * 13 * s}px), calc(${-lt * 100}% - ${lt * 4 * s}px))`,
                  }}
                >
                  {step.label}
                </p>
                <div
                  data-step={i}
                  className={`bg-white overflow-clip ${i <= 1 && expanded ? "cursor-pointer" : ""}`}
                  style={{
                    width: lerp(214, 200, sp) * s,
                    padding: 20 * s,
                    borderRadius: 20 * s,
                    boxShadow: `inset 0 0 0 ${2 * s}px rgba(255,105,40,${isNow ? 1 : 0}), ${4 * s}px ${4 * s}px ${4 * s}px rgba(0,0,0,0.08)`,
                  }}
                >
                  <div className="font-['Pretendard'] not-italic" style={{ minHeight: 96 * s, opacity: contentOpacity }}>
                    <p className="font-semibold text-black" style={{ fontSize: 18 * s, lineHeight: 1.445, letterSpacing: -0.0036 * s }}>
                      <span className="bg-[#d8e0ff]" style={{ padding: `0 ${2 * s}px`, boxDecorationBreak: "clone" }}>
                        {step.title}
                      </span>
                    </p>
                    <div className="font-medium text-[#808289]" style={{ marginTop: 8 * s, fontSize: 13 * s, lineHeight: 1.429, letterSpacing: 0.1885 * s }}>
                      <p>{body[0]}</p>
                      <p>{body[1]}</p>
                    </div>

                  </div>
                </div>
                {isNow && (
                  <div
                    className="absolute flex items-center pointer-events-none"
                    style={{ left: (200 + 15) * s, top: 64 * s, gap: 6 * s, opacity: tNow }}
                  >
                    <img alt="" src={imgWarning} className="block" style={{ width: 14 * s, height: 12 * s }} />
                    <p className="font-['Pretendard'] font-semibold text-white whitespace-nowrap" style={{ fontSize: 13 * s, lineHeight: 1.385, letterSpacing: 0.2522 * s }}>
                      빠른 확인이 필요해요
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* HeaderScrim — readability plate, header zone only */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none backdrop-blur-[6px]"
          style={{
            height: (HEADER_BOTTOM + 24) * s,
            background: "linear-gradient(to bottom, rgba(14,13,32,0.7) 0%, rgba(20,19,46,0.6) 70%, rgba(20,19,46,0) 100%)",
            maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />

        {/* Detail screens */}
        <AnimatePresence>
          {view !== "dial" && (
            <motion.div
              key={view}
              className="absolute inset-0 z-10"
              initial={{ opacity: 0, y: 24 * s }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 * s }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {view === "before" ? <BeforeDetail s={s} /> : <NowDetail s={s} onOpen={() => setDocOpen(true)} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FixedHeader */}
        <div className="absolute inset-x-0 top-0 z-20">
          <button aria-label="뒤로가기" onClick={onBack} className="absolute" style={{ left: 20 * s, top: 72 * s, width: 24 * s, height: 24 * s }}>
            <img alt="" src={imgChevron} className="block size-full" />
          </button>
          <div
            className="absolute font-['Pretendard'] font-semibold text-white whitespace-nowrap"
            style={{ left: 20 * s, top: 124 * s, fontSize: 22 * s, lineHeight: 1.364, letterSpacing: -0.4268 * s }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={header[0]} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
                <p>{header[0]}</p>
                <p>{header[1]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <BriefingCharacter view={view} spread={sp} scale={s} progress={rot} />
        <AnimatePresence>{docOpen && <DocFlow s={s} onClose={() => setDocOpen(false)} />}</AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- Home (design 10:498) ---------------- */

type Ring = { src: string; l: number; t: number; w: number; h: number; inset?: string };
const PROGRESS: { title: string; sub: string; pct: string; rings: Ring[]; char?: { src: string; l: number; t: number; w: number; h: number; img: string } }[] = [
  {
    title: "레퍼런스 정리",
    sub: "공모전 수상작 참고하여 정리",
    pct: "진행도 100%",
    rings: [
      { src: imgE323, l: 48.03, t: 6.16, w: 75, h: 75 },
      { src: imgE262, l: 45.4, t: 4, w: 78.737, h: 78.737, inset: "-4.3%" },
    ],
    char: { src: imgChars, l: 61.48, t: 18.39, w: 49.837, h: 50.915, img: "h-[112.29%] left-[-240.55%] top-[-7.75%] w-[344.16%]" },
  },
  {
    title: "디자인 시안 수정",
    sub: "0922 회의 기반 수정",
    pct: "진행도 60%",
    rings: [
      { src: imgE325, l: 47.66, t: 6.4, w: 73.118, h: 73.118 },
      { src: imgE326, l: 41.26, t: 0, w: 85, h: 85 },
      { src: imgE261, l: 41.26, t: 0, w: 85, h: 61.905 },
    ],
    char: { src: imgChar3492, l: 53.14, t: 19.2, w: 59.409, h: 47.527, img: "h-[108.82%] left-[-7.65%] top-[-5.88%] w-[130.59%]" },
  },
  {
    title: "GUI 제작",
    sub: "프론트앤드 전달용",
    pct: "진행도 40%",
    rings: [
      { src: imgE324, l: 48.11, t: 6.4, w: 73.118, h: 73.118 },
      { src: imgE326, l: 41.4, t: 0, w: 85, h: 85 },
      { src: imgE263, l: 49.31, t: 3.66, w: 73.434, h: 38.844, inset: "-9.41% -4.98%" },
      { src: imgE264, l: 49.31, t: 3.66, w: 73.434, h: 38.844, inset: "-9.41% -4.98%" },
    ],
    char: { src: imgChars, l: 54.3, t: 18.66, w: 55.327, h: 44.177, img: "h-[127.4%] left-[-99.04%] top-[-17.31%] w-[305.18%]" },
  },
  {
    title: "개발 일정 정리",
    sub: "팀원들 스케줄에 맞춰 정리",
    pct: "진행도 25%",
    rings: [
      { src: imgE325, l: 47.66, t: 6.4, w: 73.118, h: 73.118 },
      { src: imgE326, l: 41.26, t: 0, w: 85, h: 85 },
      { src: imgE265, l: 75.71, t: 3.66, w: 46.891, h: 38.844, inset: "-9.41% -7.8%" },
      { src: imgE266, l: 75.71, t: 3.66, w: 46.891, h: 38.844, inset: "-9.41% -7.8%" },
    ],
    char: { src: imgChars, l: 57.27, t: 15.55, w: 53.78, h: 54.944, img: "h-[112.29%] left-[-240.55%] top-[-7.75%] w-[344.16%]" },
  },
];
const DEADLINES = [
  { title: "기획안 수정하기", project: "마케팅 공모전", due: "D-DAY", hot: true },
  { title: "디자인 피드백", project: "청년 참여 프로젝트", due: "D-1" },
  { title: "레퍼런스 정리", project: "자원순환프로젝트", due: "D-3" },
];

function Home({ onBriefing }: { onBriefing: () => void }) {
  return (
    <div className="relative w-full h-full bg-[#f4f7fd] font-['Pretendard'] not-italic">
      <DeviceChrome/>
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 h-[294px] -scale-y-100 pointer-events-none" style={{ backgroundImage: HOME_TOP_BG, backgroundSize: "100% 100%" }} />
        <div className="relative mx-auto w-full max-w-[520px] pb-[120px] pt-[max(40px,env(safe-area-inset-top))]">
          {/* Header */}
          <div className="relative h-[48px] mt-[22px]">
            <img alt="plotto" src={imgPlotto} className="absolute left-5 top-1/2 -translate-y-1/2 block" style={{ width: 72, height: 20 }} />
            <div className="absolute right-5 top-3 size-6">
              <img alt="알림" src={imgBell} className="block size-full" />
              <img alt="" src={imgBellDot} className="absolute block size-[10px] -right-[0.1px] -top-[2px]" />
            </div>
          </div>
          {/* Briefing card */}
          <div className="relative px-5 py-2">
            <div className="flex gap-3 items-center px-5 py-6 rounded-[24px] overflow-hidden" style={{ backgroundImage: BRIEF_CARD_BG }}>
              <div className="flex flex-col gap-[18px] w-[205px] shrink-0 text-white">
                <div className="flex flex-col gap-[6px]">
                  <p className="font-light text-[15px] leading-[26px]">09/29 화</p>
                  <div className="font-semibold text-[20px] leading-[30px]">
                    <p>서연님이 자리를 비운 동안</p>
                    <p>회의가 진행됐어요</p>
                  </div>
                </div>
                <button
                  onClick={onBriefing}
                  className="relative h-[38px] w-[103px] rounded-[32px] overflow-hidden text-left transition-transform active:scale-95"
                  style={{
                    backgroundImage:
                      "conic-gradient(from 90deg, rgb(220, 223, 255) 0%, rgb(220, 223, 255) 6.7308%, rgb(245, 234, 255) 26.923%, rgb(220, 223, 255) 53.846%, rgb(245, 234, 255) 80.769%, rgb(220, 223, 255) 100%)",
                  }}
                >
                  <span className="absolute left-[15px] top-[6px] font-semibold text-[16px] leading-[26px] text-[#111] whitespace-nowrap">브리핑 보기</span>
                </button>
              </div>
              <div className="relative h-[125px] w-[109px] shrink-0 overflow-hidden">
                <video className="home-walk" autoPlay loop muted playsInline preload="auto" aria-label="걸으며 회의 자료를 확인하는 Plotto" src={`${A}/home-walk.webm`} />
                <img alt="Plotto" src={imgCharacter} className="home-walk-still absolute h-[110.04%] left-[-33.65%] max-w-none top-[-7.28%] w-[152.11%]" />
              </div>
            </div>
          </div>
          {/* Working on */}
          <div className="relative mt-[21px]">
            <div className="flex items-center h-[38px] px-5 py-2">
              <p className="font-semibold text-[18px] leading-[22px] text-[#354052]">열심히 일하고 있어요</p>
            </div>
            <div className="flex gap-3 px-5 mt-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {["마케팅 공모전", "청년 도움 프로젝트", "자원순환프로젝트", "아동자립캠프"].map((c, i) => (
                <div
                  key={c}
                  {...(i === 0 ? { role: "button", tabIndex: 0, onClick: () => go("intervention", "project"), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") go("intervention", "project"); } } : {})}
                  className={`shrink-0 flex items-center justify-center px-3 py-1 rounded-[23px] border-[1.5px] border-solid ${i === 0 ? "bg-[rgba(83,111,250,0.2)] border-[#536ffa]" : "bg-[#ebedf6] border-[#c2c5cf]"}`}
                >
                  <p className="font-medium text-[14px] leading-[22px] text-black whitespace-nowrap">{c}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-5 pl-[23.6px] pr-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PROGRESS.map((p) => (
                <div key={p.title} className="relative shrink-0 h-[210.6px] w-[168.3px]">
                  <div className="absolute bg-white h-[158px] left-0 rounded-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.2)] top-[34px] w-[168px]" />
                  <div className="absolute bg-[#1c1a3c] h-[35.1px] left-0 rounded-bl-[20.7px] rounded-br-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.15)] top-[157px] w-[168.3px]" />
                  <p className="absolute left-1/2 -translate-x-1/2 top-[97px] font-semibold text-[16.2px] leading-[1.445] text-black whitespace-nowrap">{p.title}</p>
                  <p className="absolute left-1/2 -translate-x-1/2 top-[125px] font-medium text-[12.6px] leading-[1.445] text-[#95989f] whitespace-nowrap">{p.sub}</p>
                  {p.rings.slice(0, 1).map((r, k) => (
                    <RingImg key={k} r={r} />
                  ))}
                  {p.char && (
                    <div className="absolute overflow-hidden pointer-events-none" style={{ left: p.char.l, top: p.char.t, width: p.char.w, height: p.char.h }}>
                      <img alt="" src={p.char.src} className={`absolute max-w-none ${p.char.img}`} />
                    </div>
                  )}
                  {p.rings.slice(1).map((r, k) => (
                    <RingImg key={k} r={r} />
                  ))}
                  <div className="absolute flex items-center justify-center gap-[6px] left-0 w-[168.3px] top-[164.59px]">
                    <img alt="" src={imgHourglass} className="block" style={{ width: 11, height: 15 }} />
                    <p className="font-medium text-[13.758px] leading-[1.445] text-white whitespace-nowrap">{p.pct}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Deadlines */}
          <div className="relative mt-[25px]">
            <div className="flex items-center px-5 py-2">
              <p className="font-semibold text-[18px] leading-[22px] text-[#354052]">마감이 임박한 작업이에요!</p>
            </div>
            <div className="flex flex-col gap-[10px] px-5 py-2">
              {DEADLINES.map((d) => (
                <div key={d.title} className="relative flex flex-wrap items-start justify-between px-[14px] py-4 rounded-[20px] border-[1.5px] border-solid border-[#bebfff] overflow-clip">
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[rgba(222,219,255,0.5)] to-[rgba(239,195,255,0.5)] mix-blend-overlay pointer-events-none" />
                  <div className="relative flex flex-col gap-2 font-semibold">
                    <p className="text-[15px] leading-[1.467] tracking-[0.144px] text-[#070055]">{d.title}</p>
                    <p className="text-[12px] leading-[1.334] tracking-[0.3024px] text-[#929aaa]">{d.project}</p>
                  </div>
                  <div className="relative flex items-center gap-1 h-[22px] font-medium text-[13px] leading-[1.385] tracking-[0.2522px] text-[#7c8494] whitespace-nowrap">
                    <p className={d.hot ? "text-[#ff3700]" : ""}>{d.due}</p>
                    <p>·</p>
                    <p>30분 예상</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom nav */}
      <nav className="absolute left-1/2 -translate-x-1/2 bottom-9 w-max bg-white drop-shadow-[0px_0px_3.5px_rgba(0,0,0,0.2)] px-5 py-4 rounded-[36px]">
        <div className="flex gap-6 items-center">
          <div className="relative shrink-0 w-6 h-6">
            <img alt="" src={imgNavHomeBar} className="absolute block max-w-none" style={{ left: 11, top: 15, width: 2, height: 8 }} />
            <img alt="홈" src={imgNavHome} className="absolute block max-w-none" style={{ left: 2.6, top: 2.23, width: 18.7999, height: 19.1705 }} />
          </div>
          {[imgNavGrid, imgNavChat, imgNavMy].map((src, i) => (
            <img key={src} {...(i < 2 ? {role: "button", tabIndex: 0, "aria-label": i === 0 ? "프로젝트" : "채팅", onClick: () => go("intervention", i === 0 ? "project" : "chat"), onKeyDown: (e: React.KeyboardEvent) => {if(e.key === "Enter" || e.key === " ") go("intervention", i === 0 ? "project" : "chat");}} : {})} alt="" src={src} className="block shrink-0 max-w-none" style={{ width: 24, height: 24 }} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function RingImg({ r }: { r: Ring }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: r.l, top: r.t, width: r.w, height: r.h }}>
      {r.inset ? (
        <div className="absolute" style={{ inset: r.inset }}>
          <img alt="" src={r.src} className="block max-w-none size-full" />
        </div>
      ) : (
        <img alt="" src={r.src} className="absolute inset-0 block max-w-none size-full" />
      )}
    </div>
  );
}

function DetailShell({ s, label, height, title, subtitle, children }: { s: number; label: string; height: number; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <>
      <p className="absolute font-['Pretendard'] font-bold text-white whitespace-nowrap" style={{ left: 27 * s, top: 279 * s, fontSize: 17 * s, lineHeight: 1.412 }}>
        {label}
      </p>
      <div
        className="absolute bg-white overflow-clip font-['Pretendard'] not-italic"
        style={{ left: 26 * s, top: 315 * s, width: 402 * s, height: height * s, borderRadius: 22.305 * s, boxShadow: `${4.461 * s}px ${4.461 * s}px ${4.461 * s}px rgba(0,0,0,0.08)` }}
      >
        <div className="absolute left-0 bg-[#ebefff]" style={{ top: 98 * s, width: 387 * s, height: 379 * s }} />
        
        <p className="absolute font-semibold text-black" style={{ left: 24.537 * s, top: 22.303 * s, width: 145 * s, fontSize: 20 * s, lineHeight: 1.4, letterSpacing: -0.24 * s }}>
          {title}
        </p>
        <p className="absolute font-normal text-[#808289] whitespace-nowrap" style={{ left: 25 * s, top: 59 * s, fontSize: 16 * s, lineHeight: 1.5, letterSpacing: 0.0912 * s }}>
          {subtitle}
        </p>
        <div className="absolute flex flex-col" style={{ left: 6 * s, top: 113 * s, width: 361.8 * s, gap: 16.2 * s }}>
          {children}
        </div>
      </div>
    </>
  );
}

function SparkleRow({ s, text }: { s: number; text: string }) {
  return (
    <div className="flex items-start w-full" style={{ gap: 4.5 * s, paddingInline: 18 * s }}>
      <img alt="" src={imgSparkle} className="block shrink-0" style={{ width: 21.6 * s, height: 21.6 * s }} />
      <p className="font-medium text-[#111] whitespace-nowrap" style={{ fontSize: 18 * s, lineHeight: `${23.4 * s}px` }}>
        {text}
      </p>
    </div>
  );
}

function Bullets({ s, items }: { s: number; items: string[] }) {
  return (
    <ul className="list-disc font-medium text-[#57595d]" style={{ fontSize: 13.5 * s, letterSpacing: 0.1296 * s }}>
      {items.map((t, i) => (
        <li key={t} style={{ marginInlineStart: 20.25 * s, marginBottom: i < items.length - 1 ? 7.2 * s : 0, lineHeight: 1.6 }}>
          {t}
        </li>
      ))}
    </ul>
  );
}

function BeforeDetail({ s }: { s: number }) {
  return (
    <DetailShell s={s} label="Before" height={334} title="0925 회의 진행" subtitle="유진님과 태훈님이 기획안 회의를 진행했어요">
      <div className="flex flex-col items-end" style={{ gap: 16.2 * s }}>
        <div className="flex flex-col w-full" style={{ gap: 16 * s }}>
          <SparkleRow s={s} text="회의 중 중요한 내용을 요약했어요." />
          <div className="w-full" style={{ paddingInline: 18 * s }}>
            <Bullets
              s={s}
              items={[
                "주요 사용자는 여러 프로젝트와 업무를 동시에 관리해야 하는 대학생, 직장인, 프로젝트 팀원이다.",
                "사용자가 바뀌면서 조사해야 하는 AI 서비스 사례도 변화해야 한다.",
              ]}
            />
          </div>
        </div>
        <button className="flex items-center justify-center bg-[#9693ff]" style={{ gap: 6 * s, paddingInline: 16 * s, paddingBlock: 12 * s, borderRadius: 30 * s }}>
          <span className="font-medium text-white whitespace-nowrap" style={{ fontSize: 16 * s, lineHeight: 1.5, letterSpacing: 0.0912 * s }}>
            회의록 확인하기
          </span>
          <img alt="" src={imgChevronRight} className="block" style={{ width: 24 * s, height: 24 * s }} />
        </button>
      </div>
    </DetailShell>
  );
}

function NowDetail({ s, onOpen }: { s: number; onOpen: () => void }) {
  return (
    <DetailShell s={s} label="NOW" height={402} title="수정 기획안 확인" subtitle="회의를 기반으로 Plotto가 기획안을 수정했어요">
      <SparkleRow s={s} text="기획안을 확인해주세요." />
      <div className="flex flex-col w-full" style={{ gap: 9 * s, paddingInline: 18 * s }}>
        <div
          className="relative flex items-center justify-between overflow-clip border-solid border-[#4b3bff] w-full"
          style={{ borderWidth: 0.9 * s, paddingInline: 12.6 * s, paddingBlock: 14.4 * s, borderRadius: 13 * s }}
        >
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,0,85,0.3)] to-[rgba(0,0,0,0.3)] mix-blend-plus-lighter" />
            <div className="absolute inset-0 bg-[rgba(255,255,255,0.9)] backdrop-blur-[13.5px]" />
          </div>
          <div className="relative flex items-center" style={{ gap: 10.8 * s }}>
            <div className="relative shrink-0" style={{width:31*s,height:36*s}}>
              <img src="/assets/briefing/pdf-outline.svg" alt="" style={{position:'absolute',left:4*s,width:27*s,height:36*s}}/>
              <span style={{position:'absolute',left:0,top:18*s,background:'#f04438',borderRadius:2,padding:'1px 2px',fontSize:9*s,fontWeight:700,color:'white'}}>PDF</span>
            </div>
            <p className="font-medium text-black whitespace-nowrap" style={{ fontSize: 13.5 * s, lineHeight: 1.467, letterSpacing: 0.1296 * s }}>
              기획안_수정.pdf
            </p>
          </div>
          <button
            onClick={onOpen}
            className="relative font-medium text-[#4b3bff] whitespace-nowrap active:opacity-60"
            style={{ fontSize: 11.7 * s, lineHeight: 1.385, letterSpacing: 0.227 * s, padding: 6 * s, margin: -6 * s }}
          >
            열기
          </button>
        </div>
        <div
          className="relative bg-white border-solid border-[#dbe3ee] shrink-0"
          style={{ borderWidth: 1.35 * s, width: 325.8 * s, height: 149 * s, borderRadius: 12.6 * s }}
        >
          <div className="absolute bg-[#f4f4fe]" style={{ left: 15.3 * s, top: 13.5 * s, width: 27.9 * s, height: 27.9 * s, borderRadius: 6.3 * s }} />
          <img alt="" src={imgListCheck} className="absolute block" style={{ left: 20 * s, top: 18.117 * s, width: 18 * s, height: 18 * s }} />
          <p className="absolute font-semibold text-[#1e2838] whitespace-nowrap" style={{ left: 57.15 * s, top: 15.75 * s, fontSize: 14.4 * s, lineHeight: 1.445 }}>
            어떤 내용이 바뀌었나요?
          </p>
          <div className="absolute" style={{ left: 16.65 * s, top: 56 * s, width: 286.2 * s }}>
            <Bullets s={s} items={["핵심(메인) 타깃의 변화: 대학생, 직장인, 프로젝트 팀원", "핵심 기능의 일부 추가: AI 업무 브리핑"]} />
          </div>
        </div>
      </div>
    </DetailShell>
  );
}
