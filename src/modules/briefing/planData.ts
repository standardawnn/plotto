/* 브리핑·홈 팝업·비교 화면이 함께 쓰는 기획안/레퍼런스 조회. 화면 컴포넌트를 import 하지 않는다(순환 참조 방지). */
import { currentVersion, eventsOf, fileById, proposalVersion, sharesOf, taskOf } from "../../demo/demoStore";
import type { DemoFile, Scenario } from "../../demo/scenario";

export const PLAN_TASK_ID = "review-plan";
export const REFERENCE_TASK_ID = "share-references";

/** 기획안 문서: 편집 기준 현재 버전(마지막 저장본, 없으면 V1)과 플로토 제안 V2, 비교할 섹션 제목 */
export function planDocs(s: Scenario) {
  const task = taskOf(s, PLAN_TASK_ID);
  const first = task?.fileIds.map(id => fileById(s, id)).find(f => f?.documentId) ?? undefined;
  if (!task || !first?.documentId) return null;
  const current = currentVersion(s, task.projectId, first.documentId);
  const proposal = proposalVersion(s, task.projectId, first.documentId);
  if (!current || !proposal) return null;
  const headings = task.reviewNoteHeadings?.length ? task.reviewNoteHeadings : proposal.sections.map(x => x.heading);
  const bodyOf = (f: DemoFile, h: string) => f.sections.find(x => x.heading === h)?.body ?? "";
  const nowEvent = eventsOf(s, task.projectId).find(e => e.type === "revision_proposed" && e.fileIds.includes(proposal.id));
  const meeting = task.fileIds.map(id => fileById(s, id)).find(f => f && !f.documentId);
  const meetingAt = meeting ? eventsOf(s, task.projectId).find(e => e.fileIds.includes(meeting.id))?.at : undefined;
  return { task, current, proposal, headings, bodyOf, nowEvent, meeting, meetingAt, documentId: first.documentId };
}

/** V1 문장이 V2 에 그대로 들어 있으면 '범위 유지 + 보완', 아니면 '문장 수정' */
export function changeKind(before: string, after: string): "same" | "kept" | "changed" {
  if (before === after) return "same";
  return after.includes(before) ? "kept" : "changed";
}

/** 기획안 공유 여부: 같은 문서의 어떤 버전이든 공유 후보에게 공유 기록이 있으면 그 기록 */
export function planShare(s: Scenario) {
  const d = planDocs(s);
  if (!d) return null;
  const ids = new Set(s.files.filter(f => f.documentId === d.documentId).map(f => f.id));
  return sharesOf(s, d.task.projectId).filter(x => x.origin === "local" && (ids.has(x.fileId) || x.fileId.startsWith(`saved-${d.documentId}-`))).pop() ?? null;
}

/** 레퍼런스 정리 작업의 공유 상태: 마지막 단계 수신자 모두에게 이 파일이 공유됐는지 */
export function referenceState(s: Scenario) {
  const task = taskOf(s, REFERENCE_TASK_ID);
  if (!task?.steps?.length) return null;
  const last = task.steps[task.steps.length - 1];
  const fileId = task.steps.find(x => x.fileId)?.fileId ?? task.fileIds[0];
  const recipients = last.recipientIds ?? [];
  const share = sharesOf(s, task.projectId).find(x => x.fileId === fileId && recipients.length > 0 && recipients.every(r => x.recipientIds.includes(r)));
  return { task, fileId, recipients, share };
}
