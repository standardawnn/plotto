/* 원본 문서 보기 페이지 (viewer.html?file=<fileId>).
 * 앱 화면과 따로 새 페이지로 열려서, PDF 는 PDF 뷰어처럼 쪽을 이어 보여 주고 DOCX 는 Word 처럼 쪽 단위로 보여 준다.
 * 파일 경로는 scenario.json 에서 검증한 경로만 쓴다 (주소창에 임의 경로를 넣어도 열지 않음). */
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { renderAsync } from "docx-preview";
import { loadScenario, type DemoFile } from "./demo/scenario";
import "./viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

type State = { status: "loading" } | { status: "ready" } | { status: "error"; message: string };

async function drawPdf(url: string, box: HTMLDivElement, alive: () => boolean, onPages: (n: number) => void) {
  const doc = await pdfjs.getDocument({ url }).promise;
  onPages(doc.numPages);
  try {
    const width = Math.min(box.clientWidth, 900);
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // iPhone 메모리: 2배까지만
    for (let n = 1; n <= doc.numPages && alive(); n++) {
      const page = await doc.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: (width / base.width) * dpr });
      const canvas = document.createElement("canvas");
      canvas.className = "vw-page";
      canvas.dataset.page = String(n);
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
      box.appendChild(canvas);
      await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
      page.cleanup();
    }
  } finally {
    void doc.destroy();
  }
}

async function drawDocx(url: string, box: HTMLDivElement, onPages: (n: number) => void) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`파일을 받지 못했어요 (${res.status})`);
  await renderAsync(await res.blob(), box, undefined, { className: "docx", inWrapper: true, breakPages: true, ignoreLastRenderedPageBreak: false });
  onPages(box.querySelectorAll("section.docx").length);
  fitDocx(box);
}
/** Word 쪽(약 794px)이 화면보다 넓으면 화면 폭에 맞게 줄인다 */
function fitDocx(box: HTMLDivElement) {
  const page = box.querySelector<HTMLElement>("section.docx");
  const wrap = box.querySelector<HTMLElement>(".docx-wrapper");
  if (!page || !wrap) return;
  wrap.style.zoom = "";
  const k = Math.min(1, (box.clientWidth - 16) / page.offsetWidth);
  if (k < 1) wrap.style.zoom = String(k);
}

function close() {
  // 앱에서 새 창으로 열었으면 창을 닫고, 같은 창에서 열렸으면 앱으로 돌아간다
  if (window.opener) { window.close(); return; }
  if (history.length > 1) history.back(); else location.replace("/");
}

function Viewer() {
  const id = new URLSearchParams(location.search).get("file") || "";
  const [file, setFile] = useState<DemoFile | null>(null);
  const [state, setState] = useState<State>({ status: "loading" });
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const box = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLElement>(null);

  useEffect(() => {
    let alive = true;
    loadScenario().then(s => {
      const f = s.files.find(x => x.id === id && x.url);
      if (!alive) return;
      if (!f || !f.url) { setState({ status: "error", message: `문서를 찾을 수 없어요 (${id || "파일 없음"})` }); return; }
      setFile(f);
      document.title = `${f.displayFileName} · Plotto`;
      const el = box.current!;
      (f.kind === "pdf" ? drawPdf(f.url, el, () => alive, setPages) : drawDocx(f.url, el, setPages))
        .then(() => alive && setState({ status: "ready" }))
        .catch((e: unknown) => alive && setState({ status: "error", message: e instanceof Error ? e.message : String(e) }));
    }).catch((e: unknown) => alive && setState({ status: "error", message: e instanceof Error ? e.message : String(e) }));
    return () => { alive = false; };
  }, [id]);

  // 지금 보고 있는 쪽 번호
  useEffect(() => {
    const el = scroller.current, doc = box.current;
    if (!el || !doc || !pages) return;
    const onScroll = () => {
      const list = doc.querySelectorAll<HTMLElement>(file?.kind === "pdf" ? ".vw-page" : "section.docx");
      const line = el.getBoundingClientRect().top + el.clientHeight / 3;
      let n = 1;
      list.forEach((p, i) => { if (p.getBoundingClientRect().top <= line) n = i + 1; });
      setCurrent(n);
    };
    const onResize = () => { if (file?.kind === "docx") fitDocx(doc); };
    el.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => { el.removeEventListener("scroll", onScroll); removeEventListener("resize", onResize); };
  }, [pages, file]);

  return <div className={`vw ${file?.kind ?? ""}`}>
    <header className="vw-bar">
      <button type="button" className="vw-icon" aria-label="닫기" onClick={close}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <span className={`vw-kind ${file?.kind ?? ""}`}>{file?.kind === "pdf" ? "PDF" : file?.kind === "docx" ? "W" : ""}</span>
      <h1>{file?.displayFileName ?? "문서"}</h1>
      {pages > 0 && <span className="vw-count">{current} / {pages}</span>}
      {file?.url && <a className="vw-icon" href={file.url} download={file.displayFileName} aria-label="다운로드">
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" /></svg>
      </a>}
    </header>
    <main ref={scroller} className="vw-body">
      {state.status === "loading" && <div className="vw-state" role="status"><i className="vw-spin" />문서를 여는 중이에요</div>}
      {state.status === "error" && <div className="vw-state error" role="alert"><b>문서를 열지 못했어요</b><span>{state.message}</span></div>}
      {/* 문서는 React 가 관리하지 않는 이 칸에만 그린다 (docx-preview 가 칸을 비우고 다시 채움) */}
      <div ref={box} className="vw-doc" />
    </main>
  </div>;
}

createRoot(document.getElementById("root")!).render(<Viewer />);
