import { projectStore } from "../projectStore";
import { resolveProjectId } from "./demoStore";
import type { Scenario } from "./scenario";

/** 프로젝트 화면에서 고른 현재 프로젝트를 시나리오 프로젝트 ID 로. 고르지 않았으면 프로젝트 홈 기본값(AI분석프로젝트 = 마케팅 공모전 팀). */
export function currentDemoProjectId(s: Scenario): string | null {
  let name: string | null = null;
  try { name = projectStore.getCurrentProject()?.name ?? null; } catch { /* 저장소를 못 읽으면 기본값 */ }
  return resolveProjectId(s, name ?? "AI분석프로젝트");
}
