import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import ProjectHome from './screens/ProjectHome'
import MaterialCheck from './screens/MaterialCheck'
import OpinionEmpty from './screens/OpinionEmpty'
import OpinionAttached from './screens/OpinionAttached'
import OpinionTyped from './screens/OpinionTyped'
import OpinionSaving from './screens/OpinionSaving'
import ShareModal from './screens/ShareModal'

// 분석 모션 전 시나리오: 홈 → 자료 확인 → 의견 입력(빈칸 → 첨부 → 작성) → 저장 중 → 전달 모달
// targets: 탭하면 다음 화면으로 넘어가는 Figma 노드 / auto: 로딩처럼 자동으로 넘어가는 화면
const prelude: { Screen: () => React.JSX.Element; targets?: string[]; auto?: number; instant?: boolean }[] = [
  { Screen: ProjectHome, targets: ['4:1071', '4:985'] },
  { Screen: MaterialCheck, targets: ['4:978'] },
  { Screen: OpinionEmpty, targets: ['4:915', '4:920'], instant: true },
  { Screen: OpinionAttached, targets: ['4:851'], instant: true },
  { Screen: OpinionTyped, targets: ['4:770'], instant: true },
  { Screen: OpinionSaving, auto: 1600 },
  { Screen: ShareModal, targets: ['4:633'] },
]

const milestones = [450, 950, 1400, 2050, 6550, 7650, 9000, 9550, 10800, 11400, 12550, 13700, 14350]

function Recipient({ second, step }: { second?: boolean; step: number }) {
  const expanded = step >= (second ? 11 : 10)
  const name = second ? '유진' : '태훈'
  return (
    <article className={`recipient ${second ? 'second' : 'first'} ${step >= (second ? 9 : 7) ? 'visible' : ''} ${expanded ? 'expanded' : ''}`}>
      <div className="recipient-header">
        <span className={`avatar ${second ? 'avatar-yujin' : 'avatar-taehun'}`}><img src={second ? '/assets/opinion/4d45b.png' : '/assets/opinion/8c6ad.png'} alt={`${name} 프로필 사진`} /></span>
        <div className="badge-label"><strong>{name}</strong><span>{second ? 'PPT' : '자료조사'}</span></div>
        <div className="card-title">{name}님께 전달할 의견</div>
        <img className="sparkles" src="/assets/opinion/b4207.svg" alt="" />
      </div>
      <div className="recipient-body" aria-hidden={!expanded}>
        <span className="category">{second ? 'PPT 그래픽 제작' : '자료조사'}</span>
        <div className="result-copy">{second ? <><p>경쟁 서비스 차이가 한눈에 보이는</p><p>자료 이미지를 만들어줘.</p></> : <><p>경쟁 서비스별 기능을 비교할 수 있는</p><p><em>시각 자료</em>랑 출처가 필요해.</p></>}</div>
      </div>
    </article>
  )
}

function Analysis() {
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  useEffect(() => {
    const timers = milestones.map((delay, index) => window.setTimeout(() => setStep(index + 1), delay))
    return () => timers.forEach(window.clearTimeout)
  }, [])

  return (
    <main className={`analysis-page analysis-enter step-${step} ${step >= 5 && step < 10 ? 'connecting' : ''} ${step >= 10 ? 'results' : ''}`}>
      <div className="bottom-glow" />
      <section className="top-card" aria-label="의견 분석">
        <h1 className={step >= 2 ? 'visible' : ''} aria-live="polite">{step >= 12 ? <>공유할 의견을<br />작성했어요.</> : '분석중이에요...'}</h1>
        <div className={`comment ${step >= 3 ? 'visible' : ''}`}>
          <p className="comment-label">서연님이 남긴 의견</p>
          <p className="comment-copy">경쟁 서비스의 차이가 잘 보이는 <em>문서</em>와 <em>이미지를 </em>첨부하면 좋을 거 같아. 한번 찾아봐 주면 좋겠어.</p>
        </div>
      </section>
      <div className={`character ${step >= 1 && (step < 10 || step >= 13) ? 'visible' : ''}`}>
        <img src="/assets/opinion/1a832.png" alt="보라색 분석 도우미 캐릭터" />
      </div>
      <div className={`loading-character ${step >= 4 && step < 5 ? 'visible' : ''}`}>
        <div className="loading-image"><img src="/assets/opinion/922d5.png" alt="로딩 바를 잡고 있는 캐릭터" /></div>
        <div className="progress-track" role="progressbar" aria-label="의견 분석 진행 중" aria-valuetext={step >= 5 ? '완료' : '분석 중'}><div className={step >= 4 ? 'progress-fill running' : 'progress-fill'} /></div>
      </div>
      <div className={`connection upper ${step >= 6 && step < 10 ? 'visible' : ''}`}><img src="/assets/opinion/2e42e.svg" alt="" /></div>
      <div className={`connection lower ${step >= 8 && step < 10 ? 'visible' : ''}`}><img src="/assets/opinion/e6299.svg" alt="" /></div>
      <Recipient step={step} />
      <Recipient step={step} second />
      <div className={`send-container ${step >= 12 ? 'visible' : ''}`}>
        <button disabled={step < 12 || sent} onClick={() => setSent(true)}>{sent ? '의견을 보냈어요' : '의견 보내기'}</button>
        <p className="send-confirmation" role="status">{sent ? '태훈님과 유진님께 의견을 전달했어요.' : ''}</p>
      </div>
    </main>
  )
}


export default function App() {
  const [scene, setScene] = useState(0)
  const screenRefs = useRef<(HTMLDivElement | null)[]>([])
  const next = () => setScene((current) => current + 1)

  useEffect(() => {
    const current = prelude[scene]
    if (!current) return
    if (current.auto) {
      const timer = window.setTimeout(next, current.auto)
      return () => window.clearTimeout(timer)
    }
    // 탭 가능한 영역을 버튼으로 표시 (시각 효과 없음)
    const root = screenRefs.current[scene]
    const hotspots = (current.targets ?? []).flatMap((id) => Array.from(root?.querySelectorAll<HTMLElement>(`[data-node-id="${id}"]`) ?? []))
    hotspots.forEach((el) => { el.classList.add('hotspot'); el.setAttribute('role', 'button'); el.tabIndex = 0 })
    return () => {
      hotspots.forEach((el) => { el.classList.remove('hotspot'); el.removeAttribute('role'); el.removeAttribute('tabindex') })
    }
  }, [scene])

  const activate = (event: React.SyntheticEvent) => {
    const targets = prelude[scene]?.targets
    if (targets && (event.target as HTMLElement).closest(targets.map((id) => `[data-node-id="${id}"]`).join(','))) next()
  }

  if (scene >= prelude.length) return <Analysis />
  return (
    <div className="prelude">
      {prelude.map(({ Screen, instant }, index) => (
        <div
          key={index}
          ref={(el) => { screenRefs.current[index] = el }}
          className={`prelude-screen ${index === scene ? 'active' : ''} ${instant ? 'instant' : ''}`}
          aria-hidden={index !== scene}
          onClick={index === scene ? activate : undefined}
          onKeyDown={index === scene ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(e) } } : undefined}
        >
          <Screen />
        </div>
      ))}
    </div>
  )
}
