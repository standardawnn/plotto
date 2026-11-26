/**
 * Share step entry for the dial's Next detail.
 *
 * The share step lives inside DocFlow.tsx (another owner) and cannot be opened on its own, so the dial's
 * "공유하기" would otherwise replay the document review first. This file only opens DocFlow's own Share step
 * (same layout, copy, assets, and the same `recordJourney({ sharedWith })` write) so Next -> 공유 대상 확인 -> 공유 완료
 * works with one change in DocFlow.tsx: `export` on Share (no design change).
 * REPLACE: once DocFlow accepts an initial step, open DocFlow at "share" instead of this file.
 */
import { motion, useReducedMotion } from "motion/react";
import { ShareStep } from "./DocFlow"; // the original share screen (same design and recordJourney write), opened on its own

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ShareEntry({ s, onClose }: { s: number; onClose: () => void }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="absolute inset-0 z-40 bg-white font-['Pretendard'] not-italic overflow-clip"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
    >
      <ShareStep s={s} onBack={onClose} onFinish={onClose} />
      <div className="integration-home-indicator" style={{ position: "absolute", zIndex: 50 }} aria-hidden="true" />
    </motion.div>
  );
}
