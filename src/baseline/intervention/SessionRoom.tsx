import { useEffect, useState } from 'react'
import SessionEnteredScreen from './screens/SessionEnteredScreen'
import SessionLiveScreen from './screens/SessionLiveScreen'

const character = '/assets/intervention/546e2.png'
const GUIDE = '방금 남기신 의견을 분석하여\n각 팀원에 맞게 수정하여 의견을 보내드려요.'
const TOOLS = [
  { key: 'mic', label: '마이크', left: 114 },
  { key: 'camera', label: '카메라', left: 161 },
  { key: 'audio', label: '스피커', left: 208 },
] as const

type Phase = 'speaking' | 'hiding' | 'hidden'

export default function SessionRoom({ onExit }: { onExit: () => void }) {
  const [doc, setDoc] = useState(false)
  const [phase, setPhase] = useState<Phase>('speaking')
  const [typed, setTyped] = useState(0)
  const [muted, setMuted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (phase !== 'speaking') return
    const type = window.setInterval(() => setTyped((n) => Math.min(n + 1, GUIDE.length)), 65)
    const hide = window.setTimeout(() => setPhase('hiding'), 4800)
    return () => {
      window.clearInterval(type)
      window.clearTimeout(hide)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'hiding') return
    const timer = window.setTimeout(() => setPhase('hidden'), 900)
    return () => window.clearTimeout(timer)
  }, [phase])

  const toolbar = (
    <>
      {TOOLS.map((tool) => (
        <button
          key={tool.key}
          type="button"
          aria-label={`${tool.label} ${muted[tool.key] ? '켜기' : '끄기'}`}
          aria-pressed={!muted[tool.key]}
          className={`room-tool ${muted[tool.key] ? 'is-off' : ''}`}
          style={{ left: tool.left, top: 778 }}
          onClick={() => setMuted((m) => ({ ...m, [tool.key]: !m[tool.key] }))}
        />
      ))}
    </>
  )

  return (
    <div className={`room ${doc ? 'is-doc' : ''}`}>
      <div className="room-track">
        <section className={`room-panel room-board phase-${phase}`} aria-label="공동세션 보드">
          <SessionEnteredScreen />
          <button type="button" className="prelude-hotspot" aria-label="뒤로" style={{ left: 10, top: 52, width: 44, height: 44 }} onClick={onExit} />
          <button type="button" className="room-pdf" aria-label="자료조사.pdf 열기" onClick={() => setDoc(true)} />
          {phase !== 'hidden' && (
            <>
              <p className="room-guide" aria-live="polite">{GUIDE.slice(0, typed)}<span className="room-caret" /></p>
              <img alt="" src={character} className="room-character" />
            </>
          )}
          {toolbar}
        </section>
        <section className="room-panel room-doc" aria-label="자료조사.pdf">
          {doc && <SessionLiveScreen />}
          <button type="button" className="prelude-hotspot" aria-label="보드로 돌아가기" style={{ left: 10, top: 52, width: 44, height: 44 }} onClick={() => setDoc(false)} />
          {toolbar}
        </section>
      </div>
    </div>
  )
}
