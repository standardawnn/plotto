import { AnimatePresence, motion } from "motion/react";

const A = (n: string) => `/assets/proposal/${n}`;

/**
 * Co-session proposal shown over the AI chat. Visual copy of the proposal screen's final "reveal" state
 * (gradient panel, character, title, white reserve button, close), so the chat no longer jumps to a different UI.
 * Sizes follow that screen's 402×874 design canvas via --u / --v.
 */
export default function ProposalSheet({ open, onClose, onReserve }: { open: boolean; onClose: () => void; onReserve: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40"
          style={{ ["--u" as string]: "0.9328px", ["--v" as string]: "0.929px" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          role="dialog" aria-label="공동세션 제안"
        >
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.5)" }} onClick={onClose} />
          <motion.section
            className="absolute left-0 right-0 top-0 overflow-hidden"
            style={{ height: "calc(473 * var(--v))", borderRadius: "0 0 36px 36px", background: "linear-gradient(180deg,#2540c7,#8da0ff)" }}
            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute pointer-events-none" style={{ top: 0, bottom: 0, left: 0, width: 78 }}><img alt="" src={A("da14a.png")} style={{ width: 78, height: "100%", objectFit: "fill", borderBottomLeftRadius: 36 }} /></div>
            <div className="absolute pointer-events-none" style={{ top: 0, bottom: 0, right: 0, width: 78, transform: "scaleX(-1)" }}><img alt="" src={A("da14a.png")} style={{ width: 78, height: "100%", objectFit: "fill", borderBottomLeftRadius: 36 }} /></div>
            <div className="absolute pointer-events-none overflow-hidden" style={{ bottom: 0, left: 0, right: 0, height: "calc(103 * var(--v))" }}>
              <img alt="" src={A("d130c.png")} style={{ position: "absolute", left: "50%", top: "50%", width: "calc(103 * var(--v))", height: "100vw", borderRadius: "36px 0 0 36px", transform: "translate(-50%,-50%) rotate(-90deg) scaleY(-1)", maxWidth: "none" }} />
            </div>
            <div className="absolute overflow-hidden" style={{ right: "calc(28 * var(--u))", top: "calc(116 * var(--v))", width: "calc(152 * var(--u))", height: "calc(121 * var(--u))" }}>
              <img alt="의문이 생긴 플로토 캐릭터" src={A("b021f.png")} className="absolute max-w-none" style={{ width: "241.18%", height: "201.34%", left: "-129.32%", top: "-101.34%" }} />
            </div>
            <h1 className="absolute text-white font-semibold" style={{ top: "calc(264 * var(--v))", left: "calc(25 * var(--u))", fontSize: "calc(22 * var(--u))", lineHeight: 1.364, letterSpacing: "-.4268px" }}>해당 작업에 대한 의문이 생겼어요.</h1>
            <p className="absolute text-white" style={{ top: "calc(314 * var(--v))", left: "calc(25 * var(--u))", fontSize: "calc(16 * var(--u))", lineHeight: 1.625, letterSpacing: ".0912px" }}>자료를 전달한 태훈님과 함께<br />추후에 공동세션을 진행할까요?</p>
            <button onClick={onReserve} className="absolute flex items-center justify-center bg-white font-semibold" style={{ top: "calc(391 * var(--v))", left: "calc(20 * var(--u))", right: "calc(20 * var(--u))", height: "calc(54 * var(--v))", minHeight: 44, borderRadius: 12, color: "#070055", fontSize: "calc(16 * var(--u))", lineHeight: 1.5, letterSpacing: ".0912px" }}>공동세션 하러가기</button>
          </motion.section>
          <button aria-label="닫기" onClick={onClose} className="absolute" style={{ left: "calc(50% - 18px)", top: "calc(485 * var(--v))" }}><img alt="" src={A("7fe7a.svg")} style={{ width: 36, height: 36 }} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
