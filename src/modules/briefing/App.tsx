import { entry, go } from "../../journey";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "../../demo/useDemo";
import { DemoGate } from "../../demo/DemoUI";
import { dueLabel, mmddDayOf } from "../../demo/scenario";
import { BeforeDetail, NowDetail, buildSteps } from "./BriefingDetails"; // Next/Extra detail: StepDetails (dial owner)
import { PLAN_TASK_ID, planShare, referenceState } from "./planData";
import { taskOf } from "../../demo/demoStore";
import { animate, motion, AnimatePresence } from "motion/react";
import DocFlow from "./DocFlow";
import ShareEntry from "./ShareEntry";
import Messages from "./messages/Messages";
import { touchAiTask } from "./messages/store";
import { ExtraDetail, NextDetail, extraHeader, NEXT_HEADER, usesDialCharacter } from "./StepDetails";
import { DeadlineTaskSheet, DesignProgressSheet, PlanEditor, ReferenceSheet, TaskFileView, TaskProgressSheet, Toast, useToast, type TaskKind } from "./HomeSheets";
import { PROJECT_CHIPS, TASKS, DEADLINES, barColor, type DeadlineSheet, type HomeTask } from "./homeData";
// 홈 카드 → 팝업 연결. 전용 팝업이 있는 작업은 아래 키로, 나머지 진행 카드는 TaskProgressSheet로 연다.
type SheetKey = DeadlineSheet | "ref" | "design";
const TASK_SHEET: Record<string, SheetKey> = { "mk-ref": "ref", "mk-design": "design" };
import BriefingCharacter from "../../BriefingCharacter";
import { getWorkStatus, recordBriefingChecked, useWorkStatus } from "../../workStatus";
import { consumeDemoReset, useDemoWork } from "./demoScenario";
import { appBack, pushNav, readNav, replaceNav, setNavHere, useNav } from "../../navHistory";
const IS_IOS = typeof navigator !== 'undefined' && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

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

// 다이얼 카드 문구는 시나리오(briefing·events·tasks)에서 만든다: BriefingDetails.buildSteps
// Card index of the current work (workStatus.currentStep)
const STEP_INDEX = { now: 1, next: 2, extra: 3 } as const;
const DIAL_STEPS = [
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

type View = "dial" | "before" | "now" | "next" | "extra";
const EASE = [0.22, 1, 0.36, 1] as const;

function DeviceChrome({light=false,darkIndicator=false}:{light?:boolean;darkIndicator?:boolean}) {
  return <><div className={`integration-status ${light?'light':''}`} style={{position:'absolute',zIndex:35}} aria-hidden="true"><span>9:41</span><i/><img src="/assets/intervention/8b917.svg" alt=""/></div><div className="integration-home-indicator" style={{position:'absolute',zIndex:35,background:light&&!darkIndicator?'white':'black'}} aria-hidden="true"/></>;
}

export default function App() {
  consumeDemoReset(); // demo only: ?demoReset=1 starts a fresh walk-through
  // Screen state is kept in the history entry (navHistory.ts): back returns along the path that was taken.
  const screen = useNav<"home" | "briefing" | "messages">("screen", entry === "messages" ? "messages" : entry === "briefing" ? "briefing" : "home"); // entry=messages: opened from another screen's GNB
  const toHome = () => setNavHere({ screen: "home" }); // first screen of the app: nothing to go back to
  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {screen === "home" ? (
          <motion.div key="home" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Home onBriefing={() => pushNav({ screen: "briefing", dialView: undefined, docOpen: undefined, shareOpen: undefined, dialRot: undefined })} onMessages={() => pushNav({ screen: "messages", msgRoute: undefined, msgSheet: undefined, aiSheet: undefined })} />
          </motion.div>
        ) : screen === "messages" ? (
          <motion.div key="messages" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Messages onBack={() => appBack(toHome)} onHome={() => pushNav({ screen: "home" })} chrome={(light, dark) => <DeviceChrome light={light} darkIndicator={dark} />} />
          </motion.div>
        ) : (
          <motion.div key="briefing" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Briefing onExit={() => appBack(toHome)} onOpenTask={(id) => pushNav({ screen: "messages", msgRoute: { kind: "ai", id }, msgSheet: undefined, aiSheet: undefined })} />
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes pinch{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
    </div>
  );
}

function Briefing({ onExit, onOpenTask }: { onExit: () => void; onOpenTask: (id: string) => void }) {
  const demo = useDemo();
  const sc = demo.status === "ready" ? demo.s : null;
  // Before/Now cards come from the scenario (their details are the scenario details); Next/Extra keep the dial's own
  // cards so they match the Next/Extra details, the AI chat and the co-session flow (StepDetails).
  const STEPS = [...buildSteps(sc).slice(0, 2), ...DIAL_STEPS];
  const [refOpen, setRefOpen] = useState(false);
  const [toast, showToast] = useToast();
  const screenRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(BASE_W);
  // dialRotation in step units: 0 = Before active, 3 = Extra active
  // On first entry the dial starts on the current work card (afterwards only the user moves it).
  // Coming back to the dial (from a detail, the document flow or the AI chat) keeps the card the person was on.
  const [startRot] = useState<number>(() => readNav("dialRot", STEP_INDEX[getWorkStatus().currentStep]));
  const [rot, setRot] = useState(startRot);
  const rotRef = useRef(startRot);
  // spread: 0 = collapsed stack, 1 = fanned out on the dial.
  // Once fanned out it stays that way for this visit, so coming back doesn't start over.
  const wasSpread = (() => { try { return sessionStorage.getItem("plotto-briefing-spread") === "1"; } catch { return false; } })();
  const [sp, setSp] = useState(wasSpread ? 1 : 0);
  const spRef = useRef(wasSpread ? 1 : 0);
  // Detail view / document flow / share are history entries: opening pushes, back = history.back().
  const view = useNav<View>("dialView", "dial");
  const docOpen = useNav<boolean>("docOpen", false);
  const shareOpen = useNav<boolean>("shareOpen", false);
  const setView = (v: View) => pushNav({ dialView: v === "dial" ? undefined : v });
  const setDocOpen = (open: boolean) => (open ? pushNav({ docOpen: true }) : appBack(() => setNavHere({ docOpen: undefined })));
  const setShareOpen = (open: boolean) => (open ? pushNav({ shareOpen: true }) : appBack(() => setNavHere({ shareOpen: undefined })));
  // Shared work status (revision/journey values are re-read when returning from the document flow or a detail view).
  const [realWork, refreshWork] = useWorkStatus();
  const work = useDemoWork(realWork); // real values + demo stand-ins (see demoScenario.ts)
  // Current work card (state: Now -> Next -> Extra). Separate from activeIdx, which is the card the user is browsing.
  const currentIdx = STEP_INDEX[work.currentStep];
  useEffect(refreshWork, [docOpen, shareOpen, view, refreshWork]);
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
    if (v >= 1) { try { sessionStorage.setItem("plotto-briefing-spread", "1"); } catch { /* storage unavailable */ } }
  };
  const snapTo = (target: number, velocity = 0) => {
    anim.current?.stop();
    // velocity in steps/s keeps the flick's momentum, so the dial glides into place
    anim.current = animate(rotRef.current, target, { type: "spring", stiffness: 240, damping: 30, velocity, onUpdate: setRotation });
    replaceNav({ dialRot: target }); // remembered in this history entry
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
    // drag left → advance (next step comes up the arc); a long drag can pass several steps
    let v = d.start - (e.clientX - d.x) / pxPerStep;
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
    // tap (no real drag) on a card → open its detail screen
    if (d.moved < 6 && d.tap !== null && d.tap >= 0 && d.tap <= 3) {
      if (d.tap !== Math.round(rotRef.current)) snapTo(d.tap);
      setView((["before", "now", "next", "extra"] as const)[d.tap]);
      return;
    }
    const now = performance.now();
    const recent = d.samples.filter((p) => now - p.t < 120);
    const first = recent[0] ?? d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const vel = (last.x - first.x) / Math.max(1, last.t - first.t); // px/ms
    const stepsPerSec = (-vel * 1000) / pxPerStep;
    // project where a flick would carry the dial, then settle on the nearest card
    let target = Math.round(rotRef.current + stepsPerSec * 0.18);
    if (Math.abs(vel) > 0.2 && target === d.startIdx) target = d.startIdx + (vel < 0 ? 1 : -1);
    snapTo(clamp(target, 0, 3), stepsPerSec);
  };
  // trackpad pinch (ctrl + wheel) also spreads the stack
  const wheelSnap = useRef<number>(0);
  const onWheel = (e: React.WheelEvent) => {
    if (expanded && !e.ctrlKey) {
      // mouse wheel / trackpad scroll turns the dial on desktop
      anim.current?.stop();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      setRotation(clamp(rotRef.current + delta / 260, -0.2, 3.2));
      window.clearTimeout(wheelSnap.current);
      wheelSnap.current = window.setTimeout(() => snapTo(clamp(Math.round(rotRef.current), 0, 3)), 120);
      return;
    }
    if (expanded || !e.ctrlKey) return;
    spAnim.current?.stop();
    const v = clamp(spRef.current - e.deltaY / 120, 0, 1);
    setSpread(v);
    if (v >= 1 || v > 0.6) spreadTo(1);
  };

  const onBack = () => {
    if (view !== "dial") appBack(() => setNavHere({ dialView: undefined }));
    else if (sp > 0) {
      snapTo(currentIdx);
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
      : view === "next" || (view === "dial" && expanded && activeIdx === 2)
        ? [...NEXT_HEADER]
        : view === "extra" || (view === "dial" && expanded && activeIdx === 3)
        ? [...extraHeader(work.extraPhase)]
        : view === "before" || sp > 0.5
        ? ["서연님이 자리를 비운 동안", "회의가 진행됐어요"]
        : ["프로젝트가 어떻게", "진행되는지 함께 살펴요."];

  return (
    <div ref={screenRef} className="relative w-full h-full overflow-hidden select-none touch-none" style={{ backgroundImage: BG }}>
      {!docOpen && !shareOpen && <DeviceChrome light/>}
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
            const others = [0, 1, 2, 3].filter(k => k !== currentIdx);
            const isFront = i === currentIdx; // current work card sits in front of the collapsed stack
            const st = isFront ? STACK[1] : STACK[[0, 2, 3][others.indexOf(i)]];
            const x = lerp(st.x * s, cx + R * Math.cos(ang), sp);
            const y = lerp(st.y * s, cy + R * Math.sin(ang), sp) - HEADER_BOTTOM * s;
            const scale = lerp(1, dScale, sp);
            const opacity = lerp(st.o, dOpacity, sp);
            const isNow = i === 1;
            // label: Now is shown above the stack while collapsed; others appear as it spreads
            const lt = lerp(isFront ? 1 : 0, t, sp);
            const labelOpacity = isFront ? 1 : sp;
            const contentOpacity = isFront ? 1 : clamp(sp * 1.6 - 0.2, 0, 1);
            const body = isNow && sp < 0.5 ? [step.body[0], "수정된 기획안이에요"] : step.body; // card text from the scenario (BriefingDetails.buildSteps)
            return (
              <div
                key={step.label}
                className="absolute left-0 top-0 origin-top-left will-change-transform"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  opacity,
                  zIndex: isFront && sp < 0.5 ? 20 : 10 - Math.round(lerp(isFront ? 1 : others.indexOf(i) + 1, d, sp)),
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
                  data-current={i === currentIdx ? "true" : undefined}
                  className={`bg-white overflow-clip ${expanded ? "cursor-pointer" : ""}`}
                  style={{
                    width: lerp(214, 200, sp) * s,
                    padding: 20 * s,
                    borderRadius: 20 * s,
                    boxShadow: `inset 0 0 0 ${2 * s}px rgba(255,105,40,${i === currentIdx && !work.workComplete ? 1 : 0}), ${4 * s}px ${4 * s}px ${4 * s}px rgba(0,0,0,0.08)`,
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
                    style={{ left: (200 + 15) * s, top: 64 * s, gap: 6 * s, opacity: work.revisionCompleted ? 0 : tNow }}
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
              {view === "before" || view === "now" ? (sc ? (view === "before" ? <BeforeDetail s={s} sc={sc} /> : <NowDetail s={s} sc={sc} onCompare={() => setDocOpen(true)} />)
                  : <div className="bf-card" style={{ left: 20 * s, right: 20 * s, top: 315 * s }}><DemoGate demo={demo}>{() => null}</DemoGate></div>)
                : view === "next" ? <NextDetail s={s} work={work} onShare={() => (work.revisionCompleted ? setShareOpen(true) : setDocOpen(true))} />
                : <ExtraDetail s={s} work={work} onResume={() => { touchAiTask("market"); onOpenTask("market"); }} onBriefing={recordBriefingChecked} />}
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

        {!(view === "extra" && !usesDialCharacter(work.extraPhase)) && (
          <BriefingCharacter view={view === "next" || view === "extra" ? "now" : view} spread={sp} scale={s} progress={rot} />
        )}
        <AnimatePresence>{docOpen && <DocFlow s={s} onClose={() => setDocOpen(false)} />}</AnimatePresence>
        <AnimatePresence>{shareOpen && <ShareEntry s={s} onClose={() => setShareOpen(false)} />}</AnimatePresence>
      </div>
      <AnimatePresence>{refOpen && <ReferenceSheet key="ref" onClose={() => setRefOpen(false)} onToast={showToast} />}</AnimatePresence>
      <Toast text={toast} />
    </div>
  );
}

/* ---------------- Home (design 10:498) ---------------- */

type Ring = { src: string; l: number; t: number; w: number; h: number; inset?: string };

function Home({ onBriefing, onMessages }: { onBriefing: () => void; onMessages: () => void }) {
  const [work] = useWorkStatus();
 const [selectedProject,setSelectedProject]=useState(0);
 const cardRow=useRef<HTMLDivElement>(null);
 const demo=useDemo();
 const sc=demo.status==="ready"?demo.s:null;
 // 시나리오 상태를 홈 카드에 반영: 기획안 마감(D-DAY)과 레퍼런스 전달 여부
 const planTask=sc?taskOf(sc,PLAN_TASK_ID):undefined;
 const ref=sc?referenceState(sc):null;
 const dueOf=(d:{sheet:string;due:string})=>d.sheet==="plan"&&sc&&planTask?.dueAt?dueLabel(sc.demoNow,planTask.dueAt):d.due;
 const statusOf=(p:HomeTask)=>p.id==="mk-ref"&&sc&&ref?.share?`${ref.recipients.map(r=>sc.people.find(x=>x.id===r)?.name).join("·")}님에게 전달 완료`:p.status;
 const visibleTasks=TASKS.filter(p=>p.project===PROJECT_CHIPS[selectedProject]);
 const pickProject=(i:number)=>{setSelectedProject(i);cardRow.current?.scrollTo({left:0,behavior:"smooth"});};
 // 홈 팝업. 편집 화면과 수정 파일 보기는 기획안 팝업 위에 쌓인다.
 // Sheets, editor and file view are history entries (navHistory.ts): back / browser back close the top one first.
 const sheet=useNav<null|SheetKey>("homeSheet",null);
 const taskSheetId=useNav<string|null>("homeTask",null);
 const taskSheet:HomeTask|null=TASKS.find(x=>x.id===taskSheetId)??null;
 const layer=(key:string)=>(v:unknown)=>(v?pushNav({[key]:v}):appBack(()=>setNavHere({[key]:undefined})));
 const setSheet=layer("homeSheet") as (v:SheetKey|null)=>void;
 const setTaskSheet=(t:HomeTask|null)=>layer("homeTask")(t?t.id:null);
 const openTask=(id:string)=>{const t=TASKS.find(x=>x.id===id);if(!t)return;if(TASK_SHEET[id])setSheet(TASK_SHEET[id]);else setTaskSheet(t);};
 const editing=useNav<TaskKind|null>("homeEdit",null);
 const fileOpen=useNav<TaskKind|null>("homeFile",null);
 const setEditing=layer("homeEdit") as (v:TaskKind|null)=>void;
 const setFileOpen=layer("homeFile") as (v:TaskKind|null)=>void;
 const [toast,showToast]=useToast();
 const homeRef=useRef<HTMLDivElement>(null);
 const [homeW,setHomeW]=useState(BASE_W);
 useEffect(()=>{const el=homeRef.current;if(!el)return;const ro=new ResizeObserver(()=>setHomeW(Math.min(el.clientWidth,520)));ro.observe(el);return()=>ro.disconnect();},[]);
 const tapProps=(open:()=>void,label:string)=>({role:"button",tabIndex:0,"aria-label":label,onClick:open,onKeyDown:(e:React.KeyboardEvent)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}}});
  return (
    <div ref={homeRef} className="relative w-full h-full bg-[#f4f7fd] font-['Pretendard'] not-italic">
      <DeviceChrome/>
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 h-[294px] -scale-y-100 pointer-events-none" style={{ backgroundImage: HOME_TOP_BG, backgroundSize: "100% 100%" }} />
        <div className="relative mx-auto w-full max-w-[520px] pb-[120px] pt-[max(4px,env(safe-area-inset-top))]">
          {/* Header */}
          <div className="relative h-[48px] mt-[22px]">
            <img alt="plotto" src={imgPlotto} className="absolute left-5 top-1/2 -translate-y-1/2 block" style={{ width: 72, height: 20 }} />
            <div className="absolute right-5 top-3 size-6">
              <img alt="알림" src={imgBell} className="block size-full" />
              {work.unreadNotifications > 0 && <img alt="" src={imgBellDot} className="absolute block size-[10px] -right-[0.1px] -top-[2px]" />}
            </div>
          </div>
          {/* Briefing card */}
          <div className="relative px-5 py-2">
            <div className="flex gap-3 items-center px-5 py-6 rounded-[24px] overflow-hidden" style={{ backgroundImage: BRIEF_CARD_BG }}>
              <div className="flex flex-col gap-[18px] min-w-0 flex-1 max-w-[240px] min-[700px]:max-w-[420px] text-white">
                <div className="flex flex-col gap-[6px]">
                  <p className="font-light text-[14px] leading-[22px]">{sc?mmddDayOf(sc.demoNow):""}</p>
                  <p className="font-semibold text-[19px] leading-[28px] [word-break:keep-all]">서연님이 자리를 비운 동안<br />변경된 내용을 정리했어요</p>
                </div>
                <button
                  onClick={onBriefing}
                  className="relative self-start h-[42px] px-4 rounded-[32px] overflow-hidden transition-transform active:scale-95"
                  style={{
                    backgroundImage:
                      "conic-gradient(from 90deg, rgb(220, 223, 255) 0%, rgb(220, 223, 255) 6.7308%, rgb(245, 234, 255) 26.923%, rgb(220, 223, 255) 53.846%, rgb(245, 234, 255) 80.769%, rgb(220, 223, 255) 100%)",
                  }}
                >
                  <span className="font-semibold text-[15px] leading-[26px] text-[#111] whitespace-nowrap">브리핑 확인하기</span>
                </button>
              </div>
              <div className="relative h-[125px] w-[109px] shrink-0 overflow-hidden">
                {/* 저해상도 크로마키 애니메이션(home-walk.png/webm)은 휴대폰에서 가장자리가 깨져 보여서, 고해상도 정지 이미지에 떠다니는 모션을 준다 */}
                <div className="home-char absolute inset-0">
                  <img alt="태블릿으로 회의 자료를 확인하는 Plotto" src={imgCharacter} className="absolute h-[110.04%] left-[-33.65%] max-w-none top-[-7.28%] w-[152.11%]" />
                </div>
              </div>
            </div>
          </div>
          {/* 확인이 필요한 작업 — 옆으로 넘겨 보는 카드 */}
          <div className="relative mt-[22px]">
            <div className="flex items-center px-5 py-1">
              <p className="font-semibold text-[17px] leading-[24px] text-[#111]">확인이 필요한 작업이에요</p>
            </div>
            <div className="home-deadline-row flex gap-[13px] mt-3 px-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {DEADLINES.map((d) => {
                const open = () => setSheet(d.sheet);
                return (
                  <div key={d.title} {...tapProps(open, `${d.title} 열기`)}
                    className="snap-start shrink-0 w-full max-w-[480px] flex items-start justify-between gap-3 bg-white px-5 pt-[18px] pb-4 rounded-[20px] border-[1.5px] border-solid border-[#bebfff] cursor-pointer active:scale-[.98] transition-transform">
                    <div className="flex flex-col gap-[6px] min-w-0">
                      <p className="font-semibold text-[16px] leading-[1.45] text-[#070055] truncate">{d.title}</p>
                      <p className="font-medium text-[12.5px] leading-[1.35] text-[#a9b1c1]">{d.project}</p>
                    </div>
                    <div className="flex items-center gap-1 h-[23px] font-medium text-[13px] leading-[1.385] text-[#929aaa] whitespace-nowrap">
                      <span className={dueOf(d) === "D-DAY" ? "text-[#ff6928]" : ""}>{dueOf(d)}</span><span>·</span><span>30분 예상</span>
                    </div>
                  </div>
                );
              })}
              <div aria-hidden className="shrink-0 w-[7px]" />
            </div>
          </div>
          {/* plotto가 열심히 작업중이에요 — 프로젝트별 작업 4개 */}
          <div className="relative mt-[26px]">
            <div className="flex items-center gap-[6px] px-5 py-1">
              <img alt="" src="/assets/revision/sparkle.svg" className="block size-[22px]" />
              <p className="font-semibold text-[17px] leading-[24px] text-[#111]">plotto가 열심히 작업중이에요</p>
            </div>
            <div className="flex gap-[9px] px-5 mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PROJECT_CHIPS.map((c, i) => (
                <button
                  type="button"
                  key={c}
                  aria-pressed={i === selectedProject}
                  onClick={() => pickProject(i)}
                  className={`home-chip shrink-0 flex items-center justify-center px-[13px] h-[36px] rounded-[23px] border-[1.5px] border-solid transition-colors duration-200 ${i === selectedProject ? "bg-[rgba(83,111,250,0.2)] border-[#536ffa] text-[#1d2a8a]" : "bg-[#ebedf6] border-[#d5d8e2] text-[#555b6a]"}`}
                >
                  <span className="font-medium text-[14px] leading-[22px] whitespace-nowrap">{c}</span>
                </button>
              ))}
            </div>
            <div ref={cardRow} className="home-task-row flex gap-[15px] mt-[15px] px-5 pb-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleTasks.map((p, i) => (
                <div key={`${selectedProject}-${p.id}`} {...tapProps(() => openTask(p.id), `${p.title} 진행 상황 보기`)}
                  className="home-task relative shrink-0 h-[190px] w-[168px] cursor-pointer active:scale-[.97] transition-transform" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="absolute inset-x-0 top-[31px] bottom-0 bg-white rounded-[20px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.12)] overflow-hidden">
                    <p className="absolute inset-x-2 top-[64px] text-center font-semibold text-[16px] leading-[1.445] text-[#111] truncate">{p.title}</p>
                    <p className="absolute inset-x-2 top-[90px] text-center font-medium text-[12.5px] leading-[1.445] text-[#a9b1c1] truncate">{statusOf(p)}</p>
                    <div className="absolute inset-x-0 bottom-0 h-[35px] flex items-center justify-center gap-[6px]" style={{ background: barColor(p.pct) }}>
                      <img alt="" src={imgHourglass} className="block brightness-0 invert" style={{ width: 11, height: 15 }} />
                      <span className="font-medium text-[14px] leading-[1.445] text-white whitespace-nowrap">진행도 {p.pct}%</span>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 size-[84px] rounded-full"
                    style={{ background: `radial-gradient(closest-side,#fff calc(100% - 6px),transparent calc(100% - 5.5px)),conic-gradient(#536ffa ${p.pct}%,#dedfe4 0)` }}>
                    <img alt="" src={p.char} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-[58px] h-[58px] object-contain pointer-events-none" />
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
            <img key={src} {...(i < 2 ? {role: "button", tabIndex: 0, "aria-label": i === 0 ? "프로젝트" : "메시지", onClick: () => (i === 0 ? go("intervention", "project") : onMessages()), onKeyDown: (e: React.KeyboardEvent) => {if(e.key === "Enter" || e.key === " ") (i === 0 ? go("intervention", "project") : onMessages());}} : {})} alt="" src={src} className="block shrink-0 max-w-none" style={{ width: 24, height: 24 }} />
          ))}
        </div>
      </nav>
      <AnimatePresence>
        {sheet && sheet !== "ref" && sheet !== "design" && <DeadlineTaskSheet key={sheet} kind={sheet} onClose={() => setSheet(null)} onToast={showToast}
          onEdit={() => setEditing(sheet)} onViewFile={() => setFileOpen(sheet)} />}
        {sheet === "ref" && <ReferenceSheet key="ref" onClose={() => setSheet(null)} onToast={showToast} />}
        {sheet === "design" && <DesignProgressSheet key="design" onClose={() => setSheet(null)} onToast={showToast} />}
        {taskSheet && <TaskProgressSheet key={taskSheet.id} task={taskSheet} onClose={() => setTaskSheet(null)} onToast={showToast} />}
      </AnimatePresence>
      <AnimatePresence>
        {editing && <PlanEditor key={`editor-${editing}`} kind={editing} onBack={() => setEditing(null)} onSaved={(msg) => { setEditing(null); showToast(msg ?? "수정 내용을 저장했어요"); }} />}
      </AnimatePresence>
      <AnimatePresence>
        {fileOpen === "plan" && <div key="file" className="absolute inset-0 z-[60]" data-no-lift><DocFlow s={homeW / BASE_W} onClose={() => setFileOpen(null)} /></div>}
        {fileOpen && fileOpen !== "plan" && <TaskFileView key={`file-${fileOpen}`} kind={fileOpen} onBack={() => setFileOpen(null)} />}
      </AnimatePresence>
      <Toast text={toast} />
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

