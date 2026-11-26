/**
 * Mock AI. The chat UI never contains answer logic: it only calls getAiReply().
 * To connect a real AI later, replace the body of getAiReply (call your own backend; never put API keys in the front end).
 *
 * Rules of the mock:
 *  - the answer depends on taskId, the current stage and the user's text;
 *  - a message that does not match the current stage never advances the scenario (a guide answer is returned);
 *  - proposeSession is true only on the stage that is defined as the session-proposal stage.
 */
export type AiRequest = { taskId: string; stage: number; text: string };
export type AiTurn = { reply: string; stage: number; matched: boolean; proposeSession: boolean };

/** A stage matches when EVERY group has at least one hit (so one common word is never enough), or when the text is very close to the suggested question. */
type Stage = { name: string; prompt: string; groups: string[][]; reply: string; proposeSession?: boolean };

const SCRIPTS: Record<string, Stage[]> = {
  market: [
    { name: "활용 사례 확인", prompt: "태훈이 조사한 사례가 실제로 협업 과정까지 연결해주는 서비스였는지 확인해줘", groups: [["사례", "서비스", "조사", "자료"], ["협업", "연결", "공동", "팀", "실제", "확인", "맞"]], reply: "확인해 보니 조사된 사례 대부분은 개인 작업을 돕는 서비스예요.\n협업 과정까지 이어지는 구체적인 활용 사례는 부족해요." },
    { name: "보완 방법", prompt: "그럼 이 부분을 어떻게 보완하면 좋을까?", groups: [["보완", "보강", "부족", "채우", "메우", "해결", "추가"], ["어떻게", "방법", "방안", "어떡", "좋을", "해야", "할까", "하면"]], reply: "자료를 조사한 태훈님과 함께 협업 사례를 보완해 보는 게 좋겠어요.\n공동세션을 제안할게요.", proposeSession: true },
  ],
  review: [
    { name: "수정 방향 논의", prompt: "수정 방향은 어떻게 잡으면 좋을까?", groups: [["수정", "방향", "고치", "바꾸", "개선"], ["어떻게", "어떤", "방향", "순서", "먼저", "할까", "좋을"]], reply: "변경된 타깃에 맞춰 사용자 문제와 핵심 기능 설명을 먼저 고치고, 나머지 항목은 그 기준에 맞춰 정리하는 순서가 좋아요." },
    { name: "공유 대상 확인", prompt: "수정한 내용은 누구에게 공유하면 좋을까?", groups: [["공유", "전달", "보내", "알려"], ["누구", "팀원", "유진", "태훈", "대상", "에게"]], reply: "발표 자료를 만드는 유진님과 자료를 조사하는 태훈님께 전달하는 것을 추천해요." },
  ],
  target: [
    { name: "주요 문제점 정리", prompt: "대상별 주요 문제점을 정리해줘", groups: [["문제", "불편", "어려움", "고충"], ["정리", "비교", "대상", "후보", "타깃", "사용자", "별"]], reply: "소규모 브랜드 운영자는 트렌드를 분석할 인력이 부족하고, 마케팅 담당자는 캠페인 아이디어를 구상할 시간이 부족해요.\n대학생은 실제 브랜드 데이터를 다뤄 볼 기회가 적어요." },
    { name: "핵심 타깃 선정", prompt: "그럼 핵심 타깃은 누구로 잡을까?", groups: [["타깃", "타겟", "대상", "사용자", "고객"], ["누구", "선정", "정하", "잡", "핵심", "추천"]], reply: "인력이 부족한 소규모 브랜드 운영자와 마케팅 담당자를 핵심 타깃으로 추천해요." },
  ],
  direction: [
    { name: "기능 비교", prompt: "핵심 기능 후보를 비교해줘", groups: [["기능", "후보", "아이디어"], ["비교", "정리", "차이", "장단점", "우선"]], reply: "트렌드 분석, 맞춤형 캠페인 추천, 콘텐츠 초안 작성을 비교했어요.\n초기에는 분석과 추천의 효과가 가장 커요." },
    { name: "서비스 방향 결정", prompt: "초기 서비스 방향은 어떻게 정하면 좋을까?", groups: [["방향", "서비스", "초기"], ["정하", "결정", "어떻게", "잡", "추천", "선정", "할까"]], reply: "트렌드 분석에서 시작해 맞춤형 캠페인 추천으로 이어지는 방향을 추천해요." },
  ],
};

/** Total number of scripted stages after the seeded conversation (stage index starts at 0). */
export const stageCount = (taskId: string) => SCRIPTS[taskId]?.length ?? 0;
/** Suggested question for the current stage ([] when the scripted part is finished). */
export function suggestionsFor(taskId: string, stage: number): string[] {
  const s = SCRIPTS[taskId]?.[stage];
  return s ? [s.prompt] : [];
}

const normalize = (t: string) => t.replace(/[\s.,?!~'"‘’“”]/g, "");
/** Bigram overlap (Dice coefficient) between two normalized strings. */
function dice(a: string, b: string) {
  const grams = (t: string) => { const m = new Map<string, number>(); for (let i = 0; i < t.length - 1; i++) m.set(t.slice(i, i + 2), (m.get(t.slice(i, i + 2)) ?? 0) + 1); return m; };
  const A = grams(a), B = grams(b);
  let hit = 0;
  A.forEach((n, g) => { hit += Math.min(n, B.get(g) ?? 0); });
  const total = Math.max(a.length - 1, 0) + Math.max(b.length - 1, 0);
  return total ? (2 * hit) / total : 0;
}

/** Replace this function (and only this) to use a real AI service. */
export async function getAiReply({ taskId, stage, text }: AiRequest): Promise<AiTurn> {
  const stages = SCRIPTS[taskId] ?? [];
  const current = stages[stage];
  if (!current) {
    return { reply: "이 업무에서 준비된 대화는 모두 마쳤어요.\n다른 업무는 AI와 작업한 기록에서 이어갈 수 있어요.", stage, matched: false, proposeSession: false };
  }
  const input = normalize(text);
  const matched = current.groups.every((g) => g.some((k) => input.includes(k))) || dice(input, normalize(current.prompt)) >= 0.5;
  if (!matched) {
    return { reply: `지금은 ${current.name} 단계예요.\n아래 질문처럼 이어서 물어봐 주세요.`, stage, matched: false, proposeSession: false };
  }
  return { reply: current.reply, stage: stage + 1, matched: true, proposeSession: !!current.proposeSession };
}
