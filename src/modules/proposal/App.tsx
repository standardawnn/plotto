import { useEffect, useState } from 'react'
import { SessionSuggestionSheet, slotLabel } from '../../demo/SessionSuggestion'
import { recordJourney } from '../../journey'

const asset = (name: string) => `/stage3/assets/${name}`

export default function App() {
  const [phase, setPhase] = useState<'idle' | 'pull' | 'reveal'>('idle')
  const [message, setMessage] = useState('')
  const [sentMessages, setSentMessages] = useState<string[]>([])
  const [dismissed, setDismissed] = useState(false)
  // '공동세션 하러가기' → 제안 시트(참여자·이유·근거·안건·초대 문안·후보 시간). 확정한 뒤에만 기존 예약 화면으로 이어진다.
  const [suggesting, setSuggesting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const pull = window.setTimeout(() => setPhase('pull'), 1100)
    const reveal = window.setTimeout(() => setPhase('reveal'), 2850)
    return () => { window.clearTimeout(pull); window.clearTimeout(reveal) }
  }, [])

  return (
    <main className={`experience phase-${phase}`} aria-label="Plotto 공동세션 안내">
      <div className="bottom-glow" />
      <section className="conversation" aria-label="AI 서비스 시장 현황 분석">
        <div className="analysis-copy">
          AI 서비스 시장 현황을 정리했어요.<br />
          최근 AI 서비스는 단순한 정보 제공을 넘어<br />
          <strong>업무 과정에 직접 개입하고 작업을 지원하는 방향</strong>으로 확장되고 있어요.<br />
          조사된 사례에서도 <strong>정보 탐색 → 작업 지원 → 자동화·협업으로 AI의 역할이 확대되는 흐름</strong>을 확인할 수 있어요.
        </div>
        <section className="recommendations">
          <h2>기획안에 작성할 주제 추천 <img src={asset('b4207.svg')} alt="" /></h2>
          <div className="recommendation first">
            <img src={asset('87641.svg')} alt="" />
            <div><h3>시장 변화 중심</h3><p>“AI 서비스는 정보 제공을 넘어 사용자의 작업 과정에 직접 개입하는 방향으로 확장되고 있다.”</p></div>
          </div>
          <div className="recommendation second">
            <img src={asset('37309.svg')} alt="" />
            <div><h3>협업 변화 중심</h3><p>“최근 AI 서비스는 개인의 작업 지원을 넘어 협업 과정의 정보와 업무를 연결하는 방향으로 발전하고 있다.”</p></div>
          </div>
        </section>
        <div className="chat-bubbles">
          <p>근데 태훈이가 조사한 사례들이<br />실제로 협업 과정까지 연결해주는 서비스였나</p>
          <p>왜 저걸로 서비스 조사를 해왔지?</p>
          {sentMessages.map((text, index) => <p key={index}>{text}</p>)}
          {phase === 'idle' && dismissed && <button className="reopen-question" type="button" onClick={() => { setDismissed(false); setPhase('pull'); window.setTimeout(() => setPhase('reveal'), 1750) }}>의문 다시 보기</button>}
        </div>
      </section>
      <img className="idle-character" src={asset('4e55b.png')} alt="플로토 캐릭터" />
      <form className="composer" onSubmit={event => { event.preventDefault(); if (message.trim()) { setSentMessages(list => [...list, message.trim()]); setMessage('') } }}>
        <span className="microphone" aria-hidden="true"><img src={asset('d9333.svg')} alt="" /></span>
        <div className="input-wrap"><input aria-label="메시지 입력" placeholder="작업을 이어가요..." value={message} onChange={event => setMessage(event.target.value)} /><button type="submit" aria-label="보내기"><img src={asset('ab9cf.svg')} alt="" /></button></div>
      </form>
      <div className="scrim" aria-hidden="true" />
      <div className="panel-motion">
        <section className="gradient-panel" aria-label="공동세션 제안" aria-hidden={phase !== 'reveal'}>
          <div className="header-content"><button aria-label="뒤로 가기" type="button" onClick={() => { setDismissed(true); setPhase('idle') }}><img src={asset('c75a5.svg')} alt="" /></button><p>AI 서비스 시장 현황 분석</p></div>
          <div className="panel-light right"><img src={asset('da14a.png')} alt="" /></div>
          <div className="panel-light bottom"><img src={asset('d130c.png')} alt="" /></div>
          <div className="panel-light left"><img src={asset('da14a.png')} alt="" /></div>
          <div className="final-character"><img src={asset('b021f.png')} alt="의문이 생긴 플로토 캐릭터" /></div>
          <h1 className="reveal-title">해당 작업에 대한 의문이 생겼어요.</h1>
          <p className="reveal-description">자료를 전달한 태훈님과 함께<br />추후에 공동세션을 진행할까요?</p>
          <button className="reserve-button flex items-center justify-center" onClick={() => setSuggesting(true)}>공동세션 하러가기</button>
        </section>
        <img className="pull-character" src={asset('c40a6.png')} alt="상단 박스를 잡아 끌어내리는 플로토 캐릭터" />
      </div>
      {suggesting && <SessionSuggestionSheet onClose={() => setSuggesting(false)} onConfirmed={rec => {
        recordJourney({ sessionTopic: rec.title, sessionTime: slotLabel(rec.slot) })
        setSuggesting(false)
        window.parent.postMessage({ type: 'plotto:navigate', stage: 4 }, '*')
      }} />}
      <button className="close-button" type="button" aria-label="닫기" onClick={() => { setDismissed(true); setPhase('idle') }}><img src={asset('7fe7a.svg')} alt="" /></button>
    </main>
  )
}
