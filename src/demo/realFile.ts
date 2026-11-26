/* 브라우저에 저장한 버전(V3, V4…)을 실제 DOCX 파일로 만든다.
 * 앱에서 본문만 보여 주는 게 아니라, Word·Pages 같은 실제 앱으로 열 수 있는 파일을 건넨다.
 * docx 라이브러리는 무거워서 이 버튼을 누를 때만 불러온다. */
import type { DemoFile } from "./scenario";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const savedDocxName = (f: DemoFile) => `${f.title.replace(/[\\/:*?"<>|]/g, " ").trim() || "문서"}.docx`;

export async function buildDocx(f: DemoFile): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const font = "Malgun Gothic";
  const children = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: f.title, font })] }),
    new Paragraph({ children: [new TextRun({ text: `V${f.version ?? ""}${f.createdAt ? ` · ${f.createdAt.slice(0, 16).replace("T", " ")} 저장` : ""}`, color: "7B899E", size: 18, font })] }),
    ...f.sections.flatMap(sec => [
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240 }, children: [new TextRun({ text: sec.heading, font })] }),
      ...sec.body.split(/\n+/).map(line => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: line, font, size: 22 })] })),
    ]),
  ];
  const doc = new Document({ creator: "Plotto", title: f.title, sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return blob.type ? blob : new Blob([blob], { type: DOCX_MIME });
}

/** 휴대폰: 공유 시트(→ Word·Pages·파일 앱에서 열기). 컴퓨터: .docx 파일로 받아 Word 로 연다. */
export async function openSavedDocx(f: DemoFile) {
  const blob = await buildDocx(f);
  const name = savedDocxName(f);
  const file = new File([blob], name, { type: DOCX_MIME });
  const mobile = /iP(hone|ad|od)|Android/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (mobile && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: f.title }); return; }
    catch (e) { if (e instanceof DOMException && e.name === "AbortError") return; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
