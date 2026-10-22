import { entry, go as navigate } from "../../journey"
import { useNodeActions } from "../../useNodeActions"
import { useEffect, useState, type ComponentType } from 'react'
import HomeScreen from './screens/HomeScreen'
import ProjectHomeScreen from './screens/ProjectHomeScreen'
import ChatStartScreen from './screens/ChatStartScreen'
import ChatTypingScreen from './screens/ChatTypingScreen'
import ChatAnalyzingScreen from './screens/ChatAnalyzingScreen'
import ChatResultScreen from './screens/ChatResultScreen'

type Step = 'home' | 'project' | 'chat' | 'typing' | 'analyzing' | 'result'

type Hotspot = { label: string; left: number; top: number; width: number; height: number; next: Step | 'done' }

const screens: Record<Step, ComponentType> = {
  home: HomeScreen,
  project: ProjectHomeScreen,
  chat: ChatStartScreen,
  typing: ChatTypingScreen,
  analyzing: ChatAnalyzingScreen,
  result: ChatResultScreen,
}

// Tap targets in the 402×874 design canvas
const hotspots: Record<Step, Hotspot[]> = {
  home: [{ label: '프로젝트 홈', left: 153, top: 786, width: 48, height: 48, next: 'project' }],
  project: [{ label: '이어서 하기', left: 20, top: 219, width: 362, height: 54, next: 'chat' }],
  chat: [{ label: '메시지 입력', left: 81, top: 777, width: 301, height: 48, next: 'typing' }],
  typing: [{ label: '보내기', left: 320, top: 480, width: 62, height: 69, next: 'analyzing' }],
  analyzing: [],
  result: [],
}

// Steps that advance on their own, in ms
const autoAdvance: Partial<Record<Step, [number, Step | 'done']>> = {
  analyzing: [2600, 'result'],
  result: [3200, 'done'],
}

export default function Prelude({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>(entry === 'chat' ? 'chat' : 'project')
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 402, window.innerHeight / 874))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const go = (next: Step | 'done') => (next === 'done' ? onDone() : setStep(next))

  useEffect(() => {
    const auto = autoAdvance[step]
    if (!auto) return
    const timer = window.setTimeout(() => go(auto[1]), auto[0])
    return () => window.clearTimeout(timer)
  }, [step])

  useNodeActions(step === 'project' ? {
    '2001:890': ['홈', () => navigate('briefing')],
    '2001:909': ['채팅', () => setStep('chat')],
    '2001:800': ['새로 전달된 자료 확인', () => navigate('opinion', 'material')],
    '2001:840': ['기획안 수정', () => navigate('opinion', 'material')],
    '2001:852': ['자료조사', () => navigate('opinion', 'material')],
  } : {}, step)
  const Screen = screens[step]

  return (
    <main className="prelude" aria-label="Plotto 프로젝트 이어하기">
      <div className="prelude-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div key={step} className="prelude-screen">
          <Screen />
          {hotspots[step].map(spot => (
            <button
              key={spot.label}
              className="prelude-hotspot"
              aria-label={spot.label}
              style={{ left: spot.left, top: spot.top, width: spot.width, height: spot.height }}
              onClick={() => go(spot.next)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
