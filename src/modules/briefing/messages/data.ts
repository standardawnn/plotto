/**
 * Message tab data (local only, no server).
 * Everything here is stand-in data: presence, member work, seeded conversations.
 * Replace the exported getters / seeds with real sources later; screens only use these exports.
 */
export type MemberId = "me" | "tae" | "yu";
export type ChatId = "group" | "tae" | "yu";
export type Msg = { id: string; from: MemberId | "ai"; text: string; time: string; at?: string };

export const MEMBERS: { id: MemberId; name: string; role: string; sheetRole: string; img: string }[] = [
  { id: "me", name: "나", role: "기획", sheetRole: "기획", img: "/assets/project/c79f2.png" },
  { id: "tae", name: "태훈", role: "자료조사", sheetRole: "자료조사", img: "/assets/project/e8f4a.png" },
  { id: "yu", name: "유진", role: "PPT", sheetRole: "PPT 제작", img: "/assets/project/4d45b.png" },
];
export const member = (id: MemberId) => MEMBERS.find((m) => m.id === id)!;

/** DUMMY presence. Replace with a real presence source later. */
export function getPresence(id: MemberId): { online: boolean; lastSeen?: string } {
  return { me: { online: true }, tae: { online: true }, yu: { online: false, lastSeen: "30분 전" } }[id];
}

/** Current work of each member. Scenario data first (Extra card title, Next share targets); "me" time comes from workStatus. */
export const MEMBER_WORK: Record<MemberId, { title: string; detail: string; updated: string }> = {
  tae: { title: "AI 서비스 활용 사례 조사", detail: "협업 과정에서 활용되는 AI 서비스의 실제 사례를 조사하고 있어요.", updated: "10분 전" },
  yu: { title: "최종 기획안 PPT 제작", detail: "수정된 기획안의 사용자 범위와 핵심 기능을 발표 자료에 반영하고 있어요.", updated: "1시간 전" },
  me: { title: "기업분석 보고서 작성", detail: "전달받은 조사 자료를 바탕으로 분석을 진행하고 있어요.", updated: "" },
};

export type ChatMeta = { id: ChatId; name: string; subtitle: string; members: MemberId[]; seedLabel: string };
export const CHATS: ChatMeta[] = [
  { id: "group", name: "마케팅 공모전", subtitle: "팀 채팅", members: ["me", "tae", "yu"], seedLabel: "1시간 전" },
  { id: "tae", name: "태훈", subtitle: "자료조사", members: ["me", "tae"], seedLabel: "어제" },
  { id: "yu", name: "유진", subtitle: "PPT", members: ["me", "yu"], seedLabel: "어제" },
];

const m = (id: string, from: Msg["from"], text: string, time: string): Msg => ({ id, from, text, time });
export const CHAT_SEED: Record<ChatId, { messages: Msg[]; unread: number }> = {
  group: {
    unread: 1,
    messages: [
      m("g1", "tae", "기획안 수정본 확인했어요. 타깃 범위가 바뀐 게 맞죠?", "어제 오후 4:20"),
      m("g2", "me", "네, 9월 25일 회의 내용을 반영해서 수정했어요.", "어제 오후 4:32"),
      m("g3", "yu", "그럼 PPT에 바뀐 사용자 범위랑 핵심 기능 먼저 반영해 둘게요.", "어제 오후 5:05"),
      m("g4", "tae", "조사 자료 전달했어요! 사례는 좀 더 보강할게요.", "1시간 전"),
    ],
  },
  tae: {
    unread: 0,
    messages: [
      m("t1", "tae", "서연님, 조사 자료 2개 전달했어요. 확인해 주세요.", "어제 오후 6:10"),
      m("t2", "me", "확인했어요. 사례 부분은 같이 보면 좋겠어요.", "어제 오후 6:18"),
      m("t3", "tae", "네, 시간 되실 때 공동세션으로 얘기해요.", "어제 오후 6:20"),
    ],
  },
  yu: {
    unread: 0,
    messages: [
      m("y1", "yu", "PPT에 들어갈 핵심 기능 정리해 주실 수 있어요?", "어제 오후 5:40"),
      m("y2", "me", "수정 기획안 기준으로 정리해서 보내 드릴게요.", "어제 오후 5:48"),
    ],
  },
};

export type AiTask = { id: string; title: string; summary: string; seedLabel: string; resumable: boolean; context: string };
export const AI_TASKS: AiTask[] = [
  { id: "market", title: "AI 서비스 시장 현황 분석", summary: "협업 서비스의 구체적인 활용 사례를 추가로 확인하고 있어요.", seedLabel: "3시간 전", resumable: true, context: "태훈님이 전달한 자료 2개" },
  { id: "review", title: "수정 기획안 검토", summary: "회의 내용을 바탕으로 변경된 타깃과 핵심 기능을 정리했어요.", seedLabel: "어제", resumable: false, context: "9월 25일 회의 내용" },
  { id: "target", title: "공모전 타깃 분석", summary: "주요 사용자 후보와 대상별 문제점을 비교했어요.", seedLabel: "9월 24일", resumable: false, context: "사용자 후보 비교" },
  { id: "direction", title: "서비스 방향 설정", summary: "핵심 기능과 초기 서비스 방향을 논의했어요.", seedLabel: "9월 23일", resumable: false, context: "초기 서비스 아이디어" },
];

/** Earlier conversation of each task. The "market" part reuses the existing resume chat (Prelude / ChatResult) text. */
export const AI_SEED: Record<string, Msg[]> = {
  market: [
    m("a1", "ai", "태훈님이 전달한 자료 2개를 확인했어요. 이 자료를 바탕으로 분석을 이어갈게요.", "3시간 전"),
    m("a2", "me", "이 자료를 바탕으로 AI 서비스 시장 현황을 분석해줘.", "3시간 전"),
    m("a3", "ai", "AI 서비스 시장 현황을 정리했어요.\n최근 AI 서비스는 단순한 정보 제공을 넘어 업무 과정에 직접 개입하고 작업을 지원하는 방향으로 확장되고 있어요.\n조사된 사례에서도 정보 탐색 → 작업 지원 → 자동화·협업으로 AI의 역할을 확인할 수 있어요.", "3시간 전"),
  ],
  review: [
    m("r1", "ai", "이전 회의 내용을 확인했어요. 9월 25일 회의에서 타깃과 핵심 기능이 달라졌어요.", "어제"),
    m("r2", "me", "기존 기획안과 달라진 점을 비교해줘.", "어제"),
    m("r3", "ai", "회의 내용을 바탕으로 변경된 타깃과 핵심 기능을 정리했어요.\n타깃은 소비자 중심에서 소규모 브랜드 운영자와 마케팅 담당자로, 핵심 기능은 트렌드 분석에서 맞춤형 캠페인 추천까지 넓어졌어요.", "어제"),
  ],
  target: [
    m("p1", "me", "공모전 타깃 후보를 비교해줘.", "9월 24일"),
    m("p2", "ai", "주요 사용자 후보와 대상별 문제점을 비교했어요.\n후보는 소규모 브랜드 운영자, 마케팅 담당자, 창업 준비생, 대학생이에요.", "9월 24일"),
  ],
  direction: [
    m("d1", "me", "초기 서비스 아이디어를 같이 정리해보자.", "9월 23일"),
    m("d2", "ai", "핵심 기능과 초기 서비스 방향을 논의했어요.\nAI로 소비자 반응과 트렌드를 분석하고, 브랜드에 맞는 마케팅 전략을 제안하는 아이디어가 나왔어요.", "9월 23일"),
  ],
};
