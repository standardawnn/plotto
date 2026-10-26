import { useEffect, useState } from 'react'

const assets = '/assets/screen3'
const schedule = [0, 600, 1150, 1750, 2700, 6500, 7300, 8300, 11600, 12500, 13500, 14200]

function Character({ className = '' }: { className?: string }) {
  return <div className={`character ${className}`}><img src={`${assets}/1a832.png`} alt="플로토 캐릭터" /></div>
}

export default function App() {
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)
  const [sent, setSent] = useState(false)
  const [connectedRecipients, setConnectedRecipients] = useState([false, false])
  const [editing, setEditing] = useState<number | null>(null)
  const [messages, setMessages] = useState([
    '경쟁 서비스별 기능을 비교할 수 있는\n시각 자료랑 출처가 필요해.',
    '경쟁 서비스 차이가 한눈에 보이는\n자료 이미지를 만들어줘.',
  ])

  useEffect(() => {
    const timers = schedule.slice(1).map((time, i) => window.setTimeout(() => setStep(i + 1), time))
    return () => timers.forEach(window.clearTimeout)
  }, [run])

  const restart = () => {
    setStep(0)
    setSent(false)
    setConnectedRecipients([false, false])
    setRun(value => value + 1)
  }

  const revealRecipient = (index: number, propertyName: string) => {
    if (propertyName === 'clip-path' && step >= 6 + index) {
      setConnectedRecipients(previous => previous.map((connected, i) => connected || i === index))
    }
  }

  return (
    <main className={`experience step-${step}`} aria-label="의견 분석 및 전달">
      <header className="analysis-header">
        <Character className={`header-character ${step === 1 || step === 2 || step === 3 || step >= 11 ? 'visible' : ''}`} />
        <h1 className={step >= 2 ? 'visible' : ''}>{step >= 8 ? <>공유할 의견을<br />작성했어요.</> : '분석중이에요...'}</h1>
        <section className={`comment ${step >= 3 ? 'visible' : ''}`}>
          <p className="comment-label">서연님이 남긴 의견</p>
          <p className="comment-copy">경쟁 서비스의 차이가 잘 보이는 <strong>문서</strong>와 <strong>이미지를 </strong>첨부하면 좋을 거 같아. 한번 찾아봐 주면 좋겠어.</p>
        </section>
      </header>

      {step >= 4 && step < 5 && <div className="loading-scene">
        <div className="loading-image"><img src={`${assets}/922d5.png`} alt="로딩 바를 들고 분석하는 캐릭터" /></div>
        <div className="progress-track" role="progressbar" aria-label="의견 분석 중" aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" /></div>
      </div>}

      <section className={`connections ${step >= 5 && step < 8 ? 'visible' : ''}`} aria-hidden="true">
        {step >= 5 && step < 9 && <div className="center-character">
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={`${assets}/character-analysis-still.webp`} />
            <img src={`${assets}/character-analysis.png`} alt="태블릿을 보며 의견을 분석하는 플로토 캐릭터" width={105} height={105} />
          </picture>
        </div>}
        <div className={`connector connector-one ${step >= 6 ? 'drawn' : ''}`} onTransitionEnd={event => revealRecipient(0, event.propertyName)}><img src={`${assets}/f6fd1.svg`} alt="" /></div>
        <div className={`connector connector-two ${step >= 7 ? 'drawn' : ''}`} onTransitionEnd={event => revealRecipient(1, event.propertyName)}><img src={`${assets}/961f4.svg`} alt="" /></div>
      </section>

      <section className={`results ${step >= 5 ? 'visible' : ''}`} aria-label="분석된 전달 의견">
        {['태훈', '유진'].map((name, index) => {
          const expanded = step >= 8 + index
          const visible = connectedRecipients[index] || expanded
          return <article key={name} className={`recipient recipient-${index} ${visible ? 'visible' : ''} ${expanded ? 'expanded' : ''}`} aria-hidden={!visible} inert={!visible}>
            <div className="recipient-heading">
              <div className={`avatar avatar-${index}`}><img src={`${assets}/${index === 0 ? '8c6ad.png' : '4d45b.png'}`} alt={`${name} 프로필`} /></div>
              <div className="recipient-name"><span>{name}{expanded && '님께 전달할 의견'}</span>{!expanded && <small>{index === 0 ? '자료조사' : 'PPT'}</small>}</div>
              {expanded && <img className="sparkle" src={`${assets}/b4207.svg`} alt="" />}
            </div>
            <div className="recipient-body" inert={!expanded}>
              <span className="tag">{index === 0 ? '자료조사' : 'PPT 그래픽 제작'}</span>
              <div className="message">
                {editing === index ? <textarea autoFocus aria-label={`${name}에게 전달할 의견 수정`} value={messages[index]} onChange={event => setMessages(previous => previous.map((text, i) => i === index ? event.target.value : text))} onBlur={() => setEditing(null)} /> :
                  <p>{messages[index].split('\n').map((line, i) => <span key={i}>{i === 1 ? <><em>{index === 0 ? '시각 자료' : '자료 이미지'}</em>{line.replace(index === 0 ? '시각 자료' : '자료 이미지', '')}</> : line}{i === 0 && <br />}</span>)}</p>}
                <button className="edit" aria-label={`${name}에게 전달할 의견 수정`} onClick={() => setEditing(index)}><img src={`${assets}/32d88.svg`} alt="" /></button>
              </div>
            </div>
          </article>
        })}
      </section>
      {step >= 10 && <footer className="actions">
        <button className="send" onClick={() => sent ? restart() : setSent(true)}>{sent ? '다시 보기' : '전달하기'}</button>
        {sent && <p role="status" className="sent-message">태훈님과 유진님께 의견을 전달했어요.</p>}
      </footer>}
      <span className="sr-only" role="status">{step < 5 ? '의견을 분석하고 있어요.' : step < 10 ? '전달할 의견을 작성하고 있어요.' : '의견 작성이 완료되었어요.'}</span>
    </main>
  )
}
