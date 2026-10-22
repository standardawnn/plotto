import { useEffect, useState } from 'react'

const SCREEN_W = 402
const SCREEN_H = 874
const BEZEL = 11
const FRAME_W = SCREEN_W + BEZEL * 2
const FRAME_H = SCREEN_H + BEZEL * 2
const GUTTER = 120

type Mode = 'device' | 'full'

function useFrameScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerWidth - 48) / FRAME_W, (window.innerHeight - GUTTER) / FRAME_H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return scale
}

function ModeSwitch({ mode, onChange, floating }: { mode: Mode; onChange: (mode: Mode) => void; floating?: boolean }) {
  return (
    <div className={`device-switch ${floating ? 'is-floating' : ''}`} role="radiogroup" aria-label="보기 모드">
      {(['device', 'full'] as const).map((value) => (
        <button key={value} type="button" role="radio" aria-checked={mode === value} onClick={() => onChange(value)}>
          {value === 'device' ? '디바이스' : '전체 화면'}
        </button>
      ))}
    </div>
  )
}

// Desktop-only wrapper: the prototype runs untouched inside an iframe sized to the phone screen,
// so its own viewport-based scaling, scrolling and transitions behave exactly as on a device.
export default function DeviceFrame({ children }: { children: React.ReactNode }) {
  const scale = useFrameScale()
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('plotto-view') as Mode) || 'device')
  const change = (next: Mode) => {
    localStorage.setItem('plotto-view', next)
    setMode(next)
  }

  if (mode === 'full') {
    return (
      <>
        {children}
        <ModeSwitch mode={mode} onChange={change} floating />
      </>
    )
  }

  return (
    <div className="device-stage">
      <header className="device-caption">
        <span className="device-brand">Plotto</span>
        <span className="device-meta">iPhone 17 · 402 × 874</span>
      </header>
      <div className="device-slot" style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
        <div className="device-frame" style={{ transform: `scale(${scale})` }}>
          <span className="device-button device-button--action" />
          <span className="device-button device-button--vol-up" />
          <span className="device-button device-button--vol-down" />
          <span className="device-button device-button--power" />
          <div className="device-screen">
            <iframe title="Plotto 프로토타입" src={`${window.location.pathname}?embed=1`} className="device-iframe" />
            <div className="device-island" aria-hidden />
          </div>
        </div>
      </div>
      <ModeSwitch mode={mode} onChange={change} />
    </div>
  )
}
