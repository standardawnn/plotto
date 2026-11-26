import { useEffect, useReducer, useState } from "react";
import { loadScenario, type Scenario } from "./scenario";
import { subscribe } from "./demoStore";

export type DemoState =
  | { status: "loading"; retry: () => void }
  | { status: "error"; error: string; retry: () => void }
  | { status: "ready"; s: Scenario; retry: () => void };

/** 시나리오를 읽고, 데모 기록이 바뀔 때마다(같은 탭·다른 탭) 다시 그린다. */
export function useDemo(): DemoState {
  const [state, setState] = useState<{ s?: Scenario; error?: string }>({});
  const [attempt, setAttempt] = useState(0);
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    let alive = true;
    setState(prev => (prev.s ? prev : {}));
    loadScenario().then(s => alive && setState({ s }), e => alive && setState({ error: String(e?.message ?? e) }));
    return () => { alive = false; };
  }, [attempt]);
  useEffect(() => subscribe(rerender), []);
  const retry = () => setAttempt(n => n + 1);
  if (state.s) return { status: "ready", s: state.s, retry };
  if (state.error) return { status: "error", error: state.error, retry };
  return { status: "loading", retry };
}

// ---------------------------------------------------------------- 파일 열기 (어느 화면에서든 같은 뷰어)

const openers = new Set<(id: string) => void>();
export function openFile(fileId: string) { openers.forEach(fn => fn(fileId)); }
export function onOpenFile(fn: (id: string) => void) { openers.add(fn); return () => { openers.delete(fn); }; }
