import { Component, type ErrorInfo, type ReactNode } from 'react';

// Catches render errors so a crash shows a recovery screen instead of a blank white page.
// Errors are also written to sessionStorage 'plotto-diag' (see public/recovery.js).
type Props = { children: ReactNode; label: string };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[plotto] render error', this.props.label, error, info.componentStack);
    try {
      const list = JSON.parse(sessionStorage.getItem('plotto-diag') || '[]');
      list.push({
        t: new Date().toISOString(),
        mode: 'react',
        kind: 'render',
        msg: `${this.props.label}: ${String(error.message).slice(0, 280)}`,
        stack: String(error.stack || '').slice(0, 800),
      });
      sessionStorage.setItem('plotto-diag', JSON.stringify(list.slice(-20)));
    } catch {
      /* storage unavailable */
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ position: 'fixed', inset: 0, zIndex: 2147483000, background: '#f4f7fd', color: '#222', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center', font: '15px/1.5 -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif' }}>
        <p>화면을 불러오지 못했어요.</p>
        <button type="button" onClick={() => location.reload()} style={{ padding: '12px 20px', border: 0, borderRadius: 12, background: '#536ffa', color: '#fff', fontSize: 15, minWidth: 200 }}>
          다시 시작
        </button>
      </div>
    );
  }
}
