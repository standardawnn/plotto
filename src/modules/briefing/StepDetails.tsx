/**
 * Next / Extra detail screens of the dial (new file; Before/Now and DetailShell are untouched).
 * Same look as Before/Now: same card, typography and colors. The layout is a flow layout (no fixed text
 * coordinates), so long titles never wrap into the subtitle and the card height follows its content.
 *
 * What is shown always comes from workStatus (real recorded state), never from click counts:
 *  - Next : revisionCompleted -> share button enabled, documentShared -> "공유했어요"
 *  - Extra: extraPhase (resume / proposed / reserved / joinable / finished)
 * Destinations are the existing screens of other owners (go(...)); nothing is rebuilt here.
 */
import type { ReactNode } from "react";
import { go } from "../../journey";
import { markNotificationRead, recordActivity, recordMaterialChecked, type ExtraPhase, type WorkStatus } from "../../workStatus";

const A = "/assets/briefing";
const imgSparkle = `${A}/68c56.svg`;
const imgChevronRight = `${A}/71752.svg`;
const imgBellDot = `${A}/ef6d0.svg`;
const imgPdf = "/assets/revision/pdf.svg"; // same PDF icon as the dial's Now detail (Vercel)
const imgAvatarYujin = `${A}/4d45b.png`;
const imgAvatarTaehun = `${A}/8c6ad.png`;

/** Header (the two white lines on top) and card subtitle / Plotto line per state. Copy is kept short and non-repeating. */
export const NEXT_HEADER: [string, string] = ["모든 팀원에게", "공유할 작업이에요"];
const EXTRA_COPY: Record<ExtraPhase, { head: [string, string]; sub: string; sparkle: string }> = {
  resume: { head: ["태훈님이 자료를 전달했어요", "작업을 이어가 볼까요?"], sub: "이어서 진행할 작업이에요", sparkle: "마지막 작업 내용을 정리했어요." },
  proposed: { head: ["논의가 필요한 내용이", "생겼어요"], sub: "태훈님과 함께 풀어볼 수 있어요", sparkle: "공동세션을 제안했어요." },
  reserved: { head: ["공동세션 일정이", "정해졌어요"], sub: "태훈님과 함께 진행해요", sparkle: "예약 내용을 정리했어요." },
  joinable: { head: ["지금 공동세션을", "시작할 수 있어요"], sub: "태훈님이 기다리고 있어요", sparkle: "참여할 세션을 준비했어요." },
  finished: { head: ["공동세션이", "마무리됐어요"], sub: "태훈님과 나눈 내용이에요", sparkle: "세션 내용을 정리했어요." },
};
export const extraHeader = (phase: ExtraPhase) => EXTRA_COPY[phase].head;

// Existing character assets other than the Now pose (resume keeps the dial's own Now character).
const EXTRA_CHAR: Partial<Record<ExtraPhase, string>> = {
  proposed: "/assets/opinion/39e80.png",
  reserved: "/assets/booking/33517.png",
  joinable: "/assets/briefing/546e2.png",
  finished: "/assets/classification/1a832.png",
};
/** The dial's own character stage is used only for these (so the shared BriefingCharacter stays as is). */
export const usesDialCharacter = (phase: ExtraPhase) => !EXTRA_CHAR[phase];

/* ---------------- shared pieces ---------------- */

function Shell({ s, label, title, sub, char, children }: { s: number; label: string; title: string; sub: string; char?: string; children: ReactNode }) {
  return (
    <div style={{ wordBreak: "keep-all" }}>
      <p className="absolute font-['Pretendard'] font-bold text-white whitespace-nowrap" style={{ left: 27 * s, top: 279 * s, fontSize: 17 * s, lineHeight: 1.412 }}>
        {label}
      </p>
      {char && (
        <div className="absolute flex items-end justify-end" style={{ right: 8 * s, top: 160 * s, width: 225 * s, height: 177 * s }}>
          <img alt="Plotto" src={char} className="block max-w-full max-h-full object-contain" />
        </div>
      )}
      <div
        className="absolute bg-white overflow-clip font-['Pretendard'] not-italic"
        style={{ left: 26 * s, top: 315 * s, width: 402 * s, borderRadius: 22.305 * s, boxShadow: `${4.461 * s}px ${4.461 * s}px ${4.461 * s}px rgba(0,0,0,0.08)` }}
      >
        <div style={{ padding: `${22.3 * s}px ${24.5 * s}px ${15 * s}px` }}>
          <p className="font-semibold text-black whitespace-nowrap" style={{ fontSize: 20 * s, lineHeight: 1.4, letterSpacing: -0.24 * s }}>{title}</p>
          <p className="font-normal text-[#808289] whitespace-nowrap" style={{ marginTop: 8.7 * s, fontSize: 16 * s, lineHeight: 1.5, letterSpacing: 0.0912 * s }}>{sub}</p>
        </div>
        <div className="bg-[#ebefff]" style={{ padding: `${15 * s}px 0 ${26 * s}px` }}>
          <div className="flex flex-col" style={{ marginLeft: 6 * s, width: 361.8 * s, gap: 16.2 * s }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function Sparkle({ s, text }: { s: number; text: string }) {
  return (
    <div className="flex items-start w-full" style={{ gap: 4.5 * s, paddingInline: 18 * s }}>
      <img alt="" src={imgSparkle} className="block shrink-0" style={{ width: 21.6 * s, height: 21.6 * s }} />
      <p className="font-medium text-[#111] whitespace-nowrap" style={{ fontSize: 18 * s, lineHeight: `${23.4 * s}px` }}>{text}</p>
    </div>
  );
}

/** Card stack: same 9 gap as Now; every action sits the same distance below the last card. */
function Stack({ s, children }: { s: number; children: ReactNode }) {
  return <div className="flex flex-col w-full" style={{ gap: 9 * s, paddingInline: 18 * s }}>{children}</div>;
}

function Card({ s, tone, onClick, children, row }: { s: number; tone?: "key" | "lavender"; onClick?: () => void; children: ReactNode; row?: boolean }) {
  const border = tone === "key" ? `${0.9 * s}px solid #4b3bff` : tone === "lavender" ? `${1.35 * s}px solid #bebfff` : `${1.35 * s}px solid #dbe3ee`;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full text-left ${row ? "flex-row items-center" : "flex-col"} ${onClick ? "active:opacity-70" : ""}`}
      style={{ background: tone === "lavender" ? "#e4e5ff" : "#fff", border, borderRadius: 12.6 * s, padding: row ? `${14 * s}px ${18 * s}px` : 18 * s, gap: row ? 12 * s : 6 * s }}
    >
      {children}
    </Tag>
  );
}
const Title = ({ s, children }: { s: number; children: ReactNode }) => <p className="font-semibold text-[#1e2838]" style={{ fontSize: 14.4 * s, lineHeight: 1.445 }}>{children}</p>;
const Body = ({ s, children }: { s: number; children: ReactNode }) => <p className="font-medium text-[#57595d]" style={{ fontSize: 13.5 * s, lineHeight: 1.6, letterSpacing: 0.1296 * s }}>{children}</p>;
const Meta = ({ s, children }: { s: number; children: ReactNode }) => <p className="font-medium text-[#808289]" style={{ fontSize: 12.5 * s, lineHeight: 1.5 }}>{children}</p>;
const Avatar = ({ s, src }: { s: number; src: string }) => (
  <span className="block shrink-0 overflow-hidden rounded-full" style={{ width: 24 * s, height: 24 * s }}>
    <img alt="" src={src} className="block size-full object-cover object-top" />
  </span>
);
const Mate = ({ s, src, children }: { s: number; src: string; children: ReactNode }) => (
  <div className="flex items-center" style={{ gap: 8 * s }}>
    <Avatar s={s} src={src} />
    <Body s={s}>{children}</Body>
  </div>
);

/** Same button as Before's "회의록 확인하기" (bg #9693ff, radius 30, 16 medium, chevron). Disabled keeps the shape, greyed. */
function Action({ s, label, onClick, disabled }: { s: number; label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <div className="flex justify-end" style={{ paddingInline: 18 * s, marginTop: -2 * s }}>
      <button
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled || undefined}
        className={`flex items-center justify-center ${disabled ? "bg-[#cfd2e3] cursor-not-allowed" : "bg-[#9693ff]"}`}
        style={{ gap: 6 * s, paddingInline: 16 * s, paddingBlock: 12 * s, borderRadius: 30 * s }}
      >
        <span className="font-medium text-white whitespace-nowrap" style={{ fontSize: 16 * s, lineHeight: 1.5, letterSpacing: 0.0912 * s }}>{label}</span>
        <img alt="" src={imgChevronRight} className="block" style={{ width: 24 * s, height: 24 * s }} />
      </button>
    </div>
  );
}

/* ---------------- Next ---------------- */

const MATES = [
  { name: "유진님", role: "PPT 제작", img: imgAvatarYujin },
  { name: "태훈님", role: "자료조사", img: imgAvatarTaehun },
];

export function NextDetail({ s, work, onShare }: { s: number; work: WorkStatus; onShare: () => void }) {
  return (
    <Shell s={s} label="NEXT" title="최종 기획안 공유" sub="연관된 팀원과 공유해야 해요">
      <Sparkle s={s} text={work.documentShared ? "팀원에게 공유를 마쳤어요." : work.revisionCompleted ? "해당 파일을 공유할 수 있어요." : "기획안 수정을 마치면 공유할 수 있어요."} />
      <Stack s={s}>
        <Card s={s} row>
          <img src={imgPdf} alt="PDF" className="block shrink-0" style={{ width: 27 * s, height: 36 * s }} />
          <Title s={s}>기획안_수정.pdf</Title>
        </Card>
        <Card s={s}>
          <Title s={s}>공유 추천 팀원 {MATES.length}</Title>
          <div className="flex flex-col" style={{ gap: 8 * s, marginTop: 4 * s }}>
            {MATES.map((m) => (
              <div key={m.name} className="flex items-center" style={{ gap: 8 * s }}>
                <Avatar s={s} src={m.img} />
                <Body s={s}>{m.name}</Body>
                <Meta s={s}>{m.role}</Meta>
              </div>
            ))}
          </div>
        </Card>
      </Stack>
      {work.documentShared ? (
        <div style={{ paddingInline: 22 * s, marginTop: -2 * s }}><Meta s={s}>공유 완료 · {work.sharedWith.map((n) => `${n}님`).join(", ")}에게 전달했어요</Meta></div>
      ) : work.revisionCompleted ? (
        <Action s={s} label="공유하기" onClick={onShare} />
      ) : (
        // Not finished yet: explain why, and send the user back to the existing review screen (never a dead button).
        <>
          <div style={{ paddingInline: 22 * s, marginTop: -2 * s }}><Meta s={s}>기획안 수정이 아직 완료되지 않았어요</Meta></div>
          <Action s={s} label="기획안 수정하기" onClick={onShare} />
        </>
      )}
    </Shell>
  );
}

/* ---------------- Extra ---------------- */

export function ExtraDetail({ s, work, onBriefing, onResume }: { s: number; work: WorkStatus; onBriefing: () => void; onResume: () => void }) {
  const phase = work.extraPhase;
  const copy = EXTRA_COPY[phase];
  const topic = work.sessionTopic;
  const when = `오늘 ${work.sessionTime ?? ""} · 태훈님과 함께`;
  const result = work.sessionResult;

  let content: ReactNode;
  if (phase === "resume") {
    content = (
      <>
        <Stack s={s}>
          <Card s={s}>
            <Meta s={s}>3시간 전 중단</Meta>
            <Title s={s}>AI 서비스 시장 현황 분석</Title>
            <Body s={s}>태훈님의 조사 자료를 바탕으로 분석을 이어가 보세요.</Body>
          </Card>
          <Card
            s={s}
            row
            onClick={() => { markNotificationRead("taehun-files"); recordMaterialChecked(); go("feedback"); }}
          >
            <img src={imgPdf} alt="PDF" className="block shrink-0" style={{ width: 27 * s, height: 36 * s }} />
            <span className="flex flex-col grow" style={{ gap: 2 * s }}>
              <Title s={s}>태훈님이 전달한 자료 2개</Title>
              <Meta s={s}>1시간 전</Meta>
            </span>
            {work.unreadNotifications > 0 && <img alt="안 읽음" src={imgBellDot} className="block shrink-0" style={{ width: 8 * s, height: 8 * s }} />}
            <svg viewBox="0 0 24 24" width={18 * s} height={18 * s} fill="none" stroke="#808289" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M9 6l6 6-6 6" /></svg>
          </Card>
        </Stack>
        <Action s={s} label="이어서 하기" onClick={() => { recordActivity(); onResume(); }} />
      </>
    );
  } else if (phase === "proposed") {
    content = (
      <>
        <Stack s={s}>
          <Card s={s} tone="lavender">
            <Title s={s}>해당 작업에 대한 의문이 생겼어요.</Title>
            <Body s={s}>자료를 전달한 태훈님과 함께 추후에 공동세션을 진행할까요?</Body>
            <div style={{ marginTop: 4 * s }}><Mate s={s} src={imgAvatarTaehun}>태훈님과 함께</Mate></div>
          </Card>
        </Stack>
        <Action s={s} label="공동세션 예약하기" onClick={() => go("booking")} />
      </>
    );
  } else if (phase === "reserved") {
    content = (
      <>
        <Stack s={s}>
          <Card s={s}>
            {topic && <Title s={s}>{topic}</Title>}
            <Body s={s}>{when}</Body>
          </Card>
        </Stack>
        <div style={{ paddingInline: 22 * s, marginTop: -2 * s }}><Meta s={s}>태훈님께 메시지를 보냈어요.</Meta></div>
      </>
    );
  } else if (phase === "joinable") {
    content = (
      <>
        <Stack s={s}>
          <Card s={s}>
            {topic && <Title s={s}>{topic}</Title>}
            <Body s={s}>{when}</Body>
          </Card>
        </Stack>
        <Action s={s} label="공동세션 하러가기" onClick={() => go("session")} />
      </>
    );
  } else {
    content = (
      <>
        <Stack s={s}>
          {/* Briefing not opened yet: the session itself. After "브리핑 보기": the session result (briefing). */}
          {work.briefingChecked && result?.decision && <Card s={s}><Title s={s}>주요 결정 사항</Title><Body s={s}>{result.decision}</Body></Card>}
          {work.briefingChecked && result?.nextAction && <Card s={s}><Title s={s}>다음 할 일</Title><Body s={s}>{result.nextAction}</Body></Card>}
          {(!work.briefingChecked || (!result?.decision && !result?.nextAction)) && (
            <Card s={s}>
              {topic && <Title s={s}>{topic}</Title>}
              <Body s={s}>{when}</Body>
            </Card>
          )}
        </Stack>
        {!work.briefingChecked && <Action s={s} label="브리핑 보기" onClick={onBriefing} />}
      </>
    );
  }

  return (
    <Shell s={s} label="EXTRA" title="기업분석 보고서 작성" sub={copy.sub} char={EXTRA_CHAR[phase]}>
      <Sparkle s={s} text={copy.sparkle} />
      {content}
    </Shell>
  );
}
