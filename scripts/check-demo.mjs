// 데모 샘플 경로 점검: scenario.json 이 가리키는 파일이 public 과 빌드 결과(dist)에 모두 있고 형식이 맞는지 확인한다.
// 사용: npm run build && npm run check:demo
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const roots = ["public", "dist"];
let failed = 0;
const fail = msg => { failed++; console.error("✗", msg); };

for (const root of roots) {
  const base = join(root, "demo", "plotto");
  const scenarioPath = join(base, "scenario.json");
  if (!existsSync(scenarioPath)) { fail(`${scenarioPath} 없음`); continue; }
  const s = JSON.parse(readFileSync(scenarioPath, "utf8"));
  const projects = new Set(s.projects.map(p => p.id));
  const files = new Map(s.files.map(f => [f.id, f]));
  for (const f of s.files) {
    const p = join(base, f.filePath);
    if (!/^files\/[A-Za-z0-9._-]+$/.test(f.filePath)) fail(`${root}: 허용하지 않는 경로 ${f.filePath}`);
    if (!existsSync(p)) { fail(`${root}: ${f.id} → ${p} 없음`); continue; }
    const head = readFileSync(p).subarray(0, 4).toString("latin1");
    if (f.mimeType === "application/pdf" && !head.startsWith("%PDF")) fail(`${root}: ${p} 가 PDF 가 아님`);
    if (f.mimeType.includes("wordprocessingml") && !head.startsWith("PK")) fail(`${root}: ${p} 가 DOCX(zip) 가 아님`);
    if (!projects.has(f.projectId)) fail(`${root}: ${f.id} 의 프로젝트 ${f.projectId} 없음`);
  }
  // 다른 프로젝트 파일을 섞어 가리키는 참조가 있는지 (앱은 이런 참조를 버리고 경고한다)
  const mixed = [];
  for (const e of s.events) for (const id of e.fileIds) if (files.get(id)?.projectId !== e.projectId) mixed.push(`event ${e.id} → ${id}`);
  for (const x of s.shares) if (files.get(x.fileId)?.projectId !== x.projectId) mixed.push(`share ${x.id} → ${x.fileId}`);
  for (const t of s.tasks) for (const id of t.fileIds) if (files.get(id)?.projectId !== t.projectId) mixed.push(`task ${t.id} → ${id}`);
  if (mixed.length) fail(`${root}: 다른 프로젝트 파일 참조 ${mixed.join(", ")}`);
  const hidden = s.files.filter(f => f.includeInInitialSnapshot === false).map(f => f.id);
  console.log(`✓ ${root}: 파일 ${s.files.length}개 확인 (초기 목록 제외: ${hidden.join(", ") || "없음"})`);
}
if (failed) { console.error(`\n${failed}건 실패`); process.exit(1); }
