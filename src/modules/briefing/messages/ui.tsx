import { useEffect, useState, type ReactNode } from "react";
import { getPresence, type MemberId, member } from "./data";

export type ChromeRender = (light: boolean, darkIndicator?: boolean) => ReactNode;
export const PAGE_BG = "#f4f7fd";
export const BRAND = "#536ffa";

export function PresenceAvatar({ id, size, dot = 14, ring = PAGE_BG }: { id: MemberId; size: number; dot?: number; ring?: string }) {
  const m = member(id);
  const online = getPresence(id).online;
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <img alt={`${m.name} 프로필`} src={m.img} className="block rounded-full object-cover" style={{ width: size, height: size }} />
      <span
        aria-label={online ? "온라인" : "오프라인"}
        className="absolute rounded-full"
        style={{ width: dot, height: dot, right: 1, bottom: 1, background: online ? "#3fbf78" : "#b4b8c4", border: `2px solid ${ring}` }}
      />
    </span>
  );
}
export function PlainAvatar({ id, size }: { id: MemberId; size: number }) {
  return <img alt="" src={member(id).img} className="block shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
}
export function PeopleIcon({ size = 22, color = BRAND }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.4-3 2.5-4.8 5.5-4.8s5.1 1.8 5.5 4.8" />
      <circle cx="17" cy="9.5" r="2.3" /><path d="M16.5 14.4c2.3.1 3.7 1.5 4 4" />
    </svg>
  );
}
export function GroupAvatar({ size }: { size: number }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size, background: "#e7e9ff" }}>
      <PeopleIcon size={size * 0.5} />
    </span>
  );
}
export function ChevronRight({ color = "#8d90a0" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
  );
}
export function BackChevron({ color = "#111" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
  );
}
export function SendIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? BRAND : "#a3a6b5"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 3 10 14" /><path d="m21 3-7 18-4-7-7-4z" /></svg>
  );
}

/** Height covered by the on-screen keyboard (visualViewport), so inputs and the latest message stay visible. */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setInset(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)));
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);
  return inset;
}
