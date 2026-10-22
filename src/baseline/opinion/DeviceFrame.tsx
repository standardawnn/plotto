import { useEffect, useState, type ReactNode } from 'react'

const SCREEN_W = 402
const SCREEN_H = 874
const BEZEL = 11
const FRAME_W = SCREEN_W + BEZEL * 2
const FRAME_H = SCREEN_H + BEZEL * 2
const PAD = 48

type Mode = 'mockup' | 'full'

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight, phone: window.matchMedia('(max-width: 600px) and (pointer: coarse), (max-width: 480px)').matches })
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const onResize = () => setVp(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

export default function DeviceFrame({ children }: { children: ReactNode }) {
  const { w, h, phone } = useViewport()
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('plotto-view') as Mode) || 'mockup')
  useEffect(() => localStorage.setItem('plotto-view', mode), [mode])

  // 실제 스마트폰: 목업 없이 402 기준 화면을 가로폭에 맞춰 전체 화면으로 표시
  if (phone) {
    const scale = w / SCREEN_W
    return (
      <div className="device-phone">
        <div className="device-stage" style={{ height: SCREEN_H * scale }}>
          <div className="device-screen" style={{ transform: `scale(${scale})` }}>{children}</div>
        </div>
      </div>
    )
  }

  const scale = Math.max(0.3, Math.min(1, (h - PAD * 2) / FRAME_H, (w - PAD * 2) / FRAME_W))
  return (
    <div className={`device-desktop ${mode}`}>
      <div className="device-toggle" role="group" aria-label="보기 모드">
        <button aria-pressed={mode === 'mockup'} onClick={() => setMode('mockup')}>디바이스 목업</button>
        <button aria-pressed={mode === 'full'} onClick={() => setMode('full')}>전체 화면</button>
      </div>
      {mode === 'full' ? (
        <div className="device-fluid">{children}</div>
      ) : (
        <div className="device-slot" style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
          <div className="device-frame" style={{ transform: `scale(${scale})` }}>
            <span className="device-button device-button-action" />
            <span className="device-button device-button-vol-up" />
            <span className="device-button device-button-vol-down" />
            <span className="device-button device-button-power" />
            <div className="device-screen">{children}</div>
            <div className="device-status" aria-hidden>
              <span>9:41</span>
              <span className="device-status-icons">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.6c2.2 0 4.2.8 5.7 2.2l1.2-1.3A10 10 0 0 0 8 .8 10 10 0 0 0 1.1 3.5l1.2 1.3A8.2 8.2 0 0 1 8 2.6Zm0 3.5c1.2 0 2.3.4 3.2 1.2l1.2-1.3A6.6 6.6 0 0 0 8 4.3a6.6 6.6 0 0 0-4.4 1.7l1.2 1.3c.9-.8 2-1.2 3.2-1.2Zm0 3.4c-.6 0-1.1.2-1.5.5L8 11.6l1.5-1.6c-.4-.3-.9-.5-1.5-.5Z" /></svg>
                <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45" /></svg>
              </span>
            </div>
            <span className="device-island" aria-hidden />
            <span className="device-home" aria-hidden />
          </div>
        </div>
      )}
    </div>
  )
}
