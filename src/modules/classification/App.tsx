import { useEffect, useState } from 'react'
import { useDemo, openFile } from '../../demo/useDemo'
import { ConfirmDialog } from '../../demo/DemoUI'
import { confirmFeedback, feedbackOf, fileById, nameOf, roleOf, suggestionsFor } from '../../demo/demoStore'
import { currentDemoProjectId } from '../../demo/currentProject'
import { stampOf } from '../../demo/scenario'

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
  // 같은 의견을 팀원 업무에 맞춘 두 초안(태훈: 원문 링크·캡처 날짜·비교, 유진: 경쟁 시장 슬라이드·각주 자리). 이번 데모 응답은 mockSuggestions.
  const demo = useDemo()
  const sc = demo.status === 'ready' ? demo.s : null
  const projectId = sc ? currentDemoProjectId(sc) : null
  const sug = sc && projectId ? suggestionsFor(sc, projectId) : null
  const drafts = sug?.feedback ?? []
  const opinion = sug?.input.opinion?.text
  const recorded = sc && projectId ? feedbackOf(sc, projectId) : []
  const isRecorded = drafts.length > 0 && drafts.every(d => recorded.some(r => r.recipientId === d.recipientId))
  const [messages, setMessages] = useState<string[]>([])
  const [asking, setAsking] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { if (drafts.length && !messages.length) setMessages(drafts.map(d => d.draft)) }, [drafts.length])
  const names = drafts.map(d => nameOf(sc!, d.recipientId)).join('·')

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
          <p className="comment-copy">{opinion ?? (demo.status === 'error' ? '의견을 불러오지 못했어요.' : sc ? '이 프로젝트에는 전달할 의견이 없어요.' : '의견을 불러오는 중이에요…')}</p>
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
        {drafts.map((draft, index) => {
          const name = nameOf(sc!, draft.recipientId)
          const expanded = step >= 8 + index
          const visible = connectedRecipients[index] || expanded
          return <article key={name} className={`recipient recipient-${index} ${visible ? 'visible' : ''} ${expanded ? 'expanded' : ''}`} aria-hidden={!visible} inert={!visible}>
            <div className="recipient-heading">
              <div className={`avatar avatar-${index}`}>{draft.recipientId === 'taehun' || draft.recipientId === 'yujin' ? <img src={`${assets}/${draft.recipientId === 'taehun' ? '8c6ad.png' : '4d45b.png'}`} alt={`${name} 프로필`} /> : name.slice(0, 1)}</div>
              <div className="recipient-name"><span>{name}{expanded && '님께 전달할 의견'}</span>{!expanded && <small>{roleOf(sc!, projectId!, draft.recipientId)}</small>}</div>
              {expanded && <img className="sparkle" src={`${assets}/b4207.svg`} alt="" />}
            </div>
            <div className="recipient-body" inert={!expanded}>
              <span className="tag">{roleOf(sc!, projectId!, draft.recipientId)}</span>
              <div className="message">
                {editing === index ? <textarea autoFocus aria-label={`${name}에게 전달할 의견 수정`} value={messages[index] ?? ''} onChange={event => setMessages(previous => previous.map((text, i) => i === index ? event.target.value : text))} onBlur={() => setEditing(null)} /> :
                  <p>{messages[index] ?? draft.draft}</p>}
                <button className="edit" aria-label={`${name}에게 전달할 의견 수정`} onClick={() => setEditing(index)}><img src={`${assets}/32d88.svg`} alt="" /></button>
              </div>
              <div className="evidence">근거 {draft.evidenceFileIds.map(id => <button key={id} type="button" onClick={() => openFile(id)}>{fileById(sc!, id)?.title ?? id}</button>)}</div>
            </div>
          </article>
        })}
      </section>
      {step >= 10 && <footer className="actions">
        <button className="send" disabled={!drafts.length} onClick={() => (sent || isRecorded) ? restart() : (setError(''), setAsking(true))}>{(sent || isRecorded) ? '다시 보기' : '검토 후 전달 확정'}</button>
        {(sent || isRecorded) && <p role="status" className="sent-message">{names}님께 전달할 피드백을 기록했어요{recorded[0] ? ` (${stampOf(recorded[0].at)})` : ''}. 실제 메시지는 보내지 않았어요.</p>}
      </footer>}
      {asking && sc && projectId && <ConfirmDialog title={`${names}님께 전달할 피드백을 확정할까요?`} confirmLabel="전달 기록 남기기" error={error} onCancel={() => setAsking(false)}
        onConfirm={() => {
          const r = confirmFeedback(sc, projectId, drafts.map((d, i) => ({ recipientId: d.recipientId, draft: messages[i] ?? d.draft, evidenceFileIds: d.evidenceFileIds })))
          if (!r.ok) { setError(r.error); return }
          setAsking(false); setSent(true)
        }}>
        {drafts.map((d, i) => <p key={d.recipientId}><b>{nameOf(sc, d.recipientId)} ({roleOf(sc, projectId, d.recipientId)})</b><br />{messages[i] ?? d.draft}</p>)}
        <p>확정하면 전달 상태와 활동 기록이 바뀌어요. 로컬 데모라 팀원에게 실제 메시지는 보내지 않아요.</p>
      </ConfirmDialog>}
      <span className="sr-only" role="status">{step < 5 ? '의견을 분석하고 있어요.' : step < 10 ? '전달할 의견을 작성하고 있어요.' : '의견 작성이 완료되었어요.'}</span>
    </main>
  )
}
