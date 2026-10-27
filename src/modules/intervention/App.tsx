import { useEffect, useRef, useState } from "react"
import { dotted } from '../../today'
import HandoffCharacter from "./HandoffCharacter"

const prompt = "이 자료를 바탕으로 AI 서비스 시장 현황을 분석해줘."
const assetPathPrefix = "/stage2/assets"
const resultSegments = [
  { text: "AI 서비스 시장 현황을 정리했어요.\n최근 AI 서비스는 단순한 정보 제공을 넘어\n" },
  { text: "업무 과정에 직접 개입하고 작업을 지원하는 방향", bold: true },
  { text: "으로 확장되고 있어요.\n조사된 사례에서도 " },
  { text: "정보 탐색 → 작업 지원 → 자동화·협업으로 AI의 역할이 확대되는 흐름", bold: true },
  { text: "을 확인할 수 있어요." },
]
const resultText = resultSegments.map(segment => segment.text).join("")
const followupPrompts = [
  "근데 태훈이가 조사한 사례들이\n실제로 협업 과정까지 연결해주는 서비스였나",
  "왜 저걸로 서비스 조사를 해왔지?",
]
type VoiceRecognition = {
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: {
    results: { [index: number]: { [index: number]: { transcript: string } } }
  }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}
const keyRows = [
  ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"],
  ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"],
  ["⇧", "ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ", "⌫"],
]

export default function App() {
  const [stage, setStage] = useState<"idle" | "writing" | "sent" | "result">("idle")
  const [showResult, setShowResult] = useState(false)
  const [resultCharacters, setResultCharacters] = useState(0)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(1)
  const [followupMode, setFollowupMode] = useState(false)
  const [followupMessages, setFollowupMessages] = useState<string[]>([])
  const [followupsComplete, setFollowupsComplete] = useState(false)
  const resultScroll = useRef<HTMLElement>(null)
  const messageTimers = useRef<number[]>([])
  const [text, setText] = useState("")
  const [typing, setTyping] = useState(false)
  const [sentText, setSentText] = useState("")
  const input = useRef<HTMLTextAreaElement>(null)
  const voice = useRef<VoiceRecognition | null>(null)
  const [listening, setListening] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState("")
  const currentPrompt = showResult ? "" : prompt

  useEffect(() => {
    if (!followupsComplete) return
    const timer = window.setTimeout(() => window.parent.postMessage({type: 'plotto:navigate', stage: 3}, '*'), 2000)
    return () => window.clearTimeout(timer)
  }, [followupsComplete])

  useEffect(() => {
    if (!showResult || !showRecommendations) return
    messageTimers.current = followupPrompts.map((message, index) => window.setTimeout(() => {
      setFollowupMode(true)
      setFollowupMessages(messages => [...messages, message])
      if (index === followupPrompts.length - 1) setFollowupsComplete(true)
    }, (index + 1) * 3000))
    return () => messageTimers.current.forEach(timer => window.clearTimeout(timer))
  }, [showResult, showRecommendations])

  useEffect(() => {
    if (followupMode) resultScroll.current?.scrollTo({ top: resultScroll.current.scrollHeight, behavior: "smooth" })
  }, [followupMode, followupMessages])

  useEffect(() => () => voice.current?.stop(), [])

  useEffect(() => {
    setResultCharacters(0)
    setShowRecommendations(false)
    if (!showResult) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let characters = 0
    const timer = window.setInterval(() => {
      characters = Math.min(resultText.length, characters + (reducedMotion ? resultText.length : 1))
      setResultCharacters(characters)
      if (characters === resultText.length) window.clearInterval(timer)
    }, 22)
    return () => window.clearInterval(timer)
  }, [showResult])

  useEffect(() => {
    if (!showResult || resultCharacters < resultText.length) return
    const timer = window.setTimeout(() => setShowRecommendations(true), 550)
    return () => window.clearTimeout(timer)
  }, [showResult, resultCharacters])

  useEffect(() => {
    if (stage !== "sent") return
    const timer = window.setTimeout(() => {
      setShowResult(true)
      setStage("result")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [stage])

  function goBack() {
    messageTimers.current.forEach(timer => window.clearTimeout(timer))
    if (followupMode) {
      setFollowupMode(false)
      setFollowupMessages([])
      setFollowupsComplete(false)
      setStage("result")
      setTyping(false)
      setText("")
      input.current?.blur()
      return
    }
    setShowResult(false)
    voice.current?.stop()
    setTyping(false)
    setStage("idle")
    setText("")
    setSentText("")
    setVoiceNotice("")
    input.current?.blur()
  }

  function startVoice() {
    if (listening) {
      voice.current?.stop()
      return
    }
    const browser = window as typeof window & {
      SpeechRecognition?: new () => VoiceRecognition
      webkitSpeechRecognition?: new () => VoiceRecognition
    }
    const Recognition =
      browser.SpeechRecognition ?? browser.webkitSpeechRecognition
    if (!Recognition) {
      setVoiceNotice("이 브라우저는 음성 입력을 지원하지 않아요.")
      return
    }
    const recognition = new Recognition()
    voice.current = recognition
    recognition.lang = "ko-KR"
    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript)
      setVoiceNotice("")
    }
    recognition.onerror = () => {
      setListening(false)
      setVoiceNotice("마이크 권한을 확인한 뒤 다시 시도해주세요.")
    }
    recognition.onend = () => setListening(false)
    setStage("writing")
    setTyping(false)
    setVoiceNotice("듣고 있어요. 말씀해주세요.")
    try {
      recognition.start()
      setListening(true)
    } catch {
      setVoiceNotice("음성 입력을 시작할 수 없어요. 다시 시도해주세요.")
    }
  }

  useEffect(() => {
    if (!typing) return
    const timer = window.setInterval(() => {
      setText((previous) => {
        if (previous.length >= currentPrompt.length) return previous
        return currentPrompt.slice(0, previous.length + 1)
      })
    }, 65)
    return () => window.clearInterval(timer)
  }, [typing, currentPrompt])

  useEffect(() => {
    if (text === currentPrompt) setTyping(false)
  }, [text, currentPrompt])

  function begin() {
    if (showResult) setFollowupMode(true)
    setStage("writing")
    setText("")
    setTyping(Boolean(currentPrompt))
    input.current?.focus()
  }

  function send() {
    if (typing) { setTyping(false); return }
    if (!text.trim()) return
    setSentText(text.trim())
    setStage(showResult ? "result" : "sent")
    if (showResult) {
      setFollowupMode(true)
      setFollowupMessages(messages => [...messages, text.trim()])
      setVoiceNotice("")
    }
    setText("")
    input.current?.blur()
  }

  function pressKey(key: string) {
    setTyping(false)
    if (key === "⌫") setText((value) => value.slice(0, -1))
    else if (key !== "⇧") setText((value) => value + key)
  }

  return (
    <main className={`app stage-${stage} ${showResult ? "result-page" : ""} ${followupMode ? "followup-page" : ""}`}>
      <div className="status-bar" aria-hidden="true"><span>9:41</span><i className="dynamic-island" /><span className="status-icons"><svg width="18" height="15" viewBox="0 0 18 15"><path d="M1 14V10H4V14ZM6 14V7H9V14ZM11 14V4H14V14ZM16 14V1H18V14Z" fill="currentColor" /></svg><svg width="19" height="15" viewBox="0 0 20 16"><path d="M2 5Q10 -1 18 5M5 9Q10 5 15 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="10" cy="13" r="1.5" fill="currentColor"/></svg><span className="battery" /></span></div>
      <div className="home-indicator" aria-hidden="true" />
      <div className="ambient" aria-hidden="true" />
      <header className="page-header">
        <button
          type="button"
          className="back-button"
          aria-label="뒤로 가기"
          onClick={goBack}
        >
          <img src={`${assetPathPrefix}/94933.svg`} alt="" />
        </button>
        <h1>AI 서비스 시장 현황 분석</h1>
      </header>
      {!showResult && <div className="date">{dotted()}</div> }

      {showResult ? (
        <section ref={resultScroll} className="result-content" aria-label={followupMode ? "추천 주제와 이어지는 메시지" : "AI 서비스 시장 분석 결과"}>
          {!followupMode && <p className={`result-intro ${resultCharacters < resultText.length ? "revealing" : ""}`} aria-label={resultText}>
            {resultSegments.map((segment, index) => {
              const offset = resultSegments.slice(0, index).reduce((sum, part) => sum + part.text.length, 0)
              const visible = segment.text.slice(0, Math.max(0, resultCharacters - offset))
              return segment.bold ? <strong key={index} aria-hidden="true">{visible}</strong> : <span key={index} aria-hidden="true">{visible}</span>
            })}
          </p>}
          {showRecommendations && <article className="recommendations">
            <h2>기획안에 작성할 주제 추천 <img src={assetPathPrefix + '/b4207.svg'} alt="" /></h2>
            <div role="radiogroup" aria-label="기획안 주제 선택" className="topic-options">
              {[
                { title: "시장 변화 중심", description: "AI 서비스는 정보 제공을 넘어 사용자의 작업 과정에 직접 개입하는 방향으로 확장되고 있다." },
                { title: "협업 변화 중심", description: "최근 AI 서비스는 개인의 작업 지원을 넘어 협업 과정의 정보와 업무를 연결하는 방향으로 발전하고 있다." },
              ].map((topic, index) => (
                <button type="button" className="topic-card" role="radio" aria-checked={selectedTopic === index} key={topic.title} onClick={() => setSelectedTopic(index)} onKeyDown={(event) => { if (event.key.startsWith('Arrow')) { event.preventDefault(); setSelectedTopic(index === 0 ? 1 : 0); (event.currentTarget.parentElement?.children[index === 0 ? 1 : 0] as HTMLButtonElement)?.focus() } }}>
                  <span className="topic-check" aria-hidden="true"><img src="/brand/icon-check.svg" width="20" height="20" alt="" /></span>
                  <span><strong>{topic.title}</strong><span className="topic-description">“{topic.description}”</span></span>
                </button>
              ))}
            </div>
          </article>}
          {followupMode && <div className="followup-messages" role="log" aria-label="보낸 메시지" aria-live="polite">
            {followupMessages.map((message, index) => <div className="followup-message-row" key={index}>
              <svg className="message-launch-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 5h20a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3h-5l-6 5v-5H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" fill="white" stroke="#b4a9f3" strokeWidth="1.5"/><path d="M10 14h.01M16 14h.01M22 14h.01" stroke="#8773e8" strokeWidth="3" strokeLinecap="round"/></svg>
              <div className="followup-message"><span>{message}</span></div>
            </div>)}
          </div>}
        </section>
      ) : <section className="conversation" aria-label="대화">
        <p className="intro">태훈님이 조사한 AI 서비스 사례를 요약했어요.</p>
        <article className="summary-card">
          <div className="card-heading">
            <h2>AI 서비스 사례 요약</h2>
            <img
              src={`${assetPathPrefix}/b4207.svg`}
              alt=""
              className="sparkle"
            />
          </div>
          <div className="card-content">
            <p>
              <strong>서비스 A</strong> - 자료 탐색 및 요약 지원
            </p>
            <p>
              <strong>서비스 B</strong> - 작업 자동화 및 실행 지원
            </p>
            <p>
              <strong>서비스 C</strong> - 팀 내 정보 공유 및 협업 지원
            </p>
            <div className="attachment">
              <span className="pptx-icon" aria-hidden="true">
                <img className="pptx-page" src={`${assetPathPrefix}/55356.svg`} alt="" />
                <img className="pptx-fold" src={`${assetPathPrefix}/d26ca.svg`} alt="" />
                <span className="pptx-label">PPTX</span>
              </span>
              <span>경쟁업체 추가 모음.pptx</span>
            </div>
          </div>
        </article>
        {stage === "sent" && (
          <div className="message" role="status">
            {sentText}
          </div>
        )}
      </section>}

      {(showResult || stage !== "writing") && (
        <section
          className={`assistant ${stage === "sent" ? "analyzing" : ""}`}
          aria-live="polite"
        >
          {stage === "sent" && (
            <p aria-label="태훈님이 조사한 자료를 분석 중이에요.">
              {Array.from("태훈님이 조사한 자료를 분석 중이에요.").map((character, index) => (
                <span
                  className="bouncing-letter"
                  aria-hidden="true"
                  key={index}
                  style={{ animationDelay: `${index * 0.085}s` }}
                >
                  {character === " " ? "\u00a0" : character}
                </span>
              ))}
            </p>
          )}
          {showResult ? (
            <HandoffCharacter active={showRecommendations} />
          ) : stage === "idle" ? (
            <HandoffCharacter active={false} />
          ) : (
            <div className="analysis-character">
              <img
                className="analysis-still"
                src={`${assetPathPrefix}/2b675.png`}
                alt="자료를 분석하는 AI 도우미"
              />
              <img
                className="analysis-animation"
                src={`${assetPathPrefix}/character-magnifier.gif`}
                alt="돋보기를 가까이 댔다 떼며 자료를 분석하는 AI 도우미"
              />
            </div>
          )}
        </section>
      )}

      <div className={`composer-area ${stage === "writing" && !showResult ? "expanded" : ""}`}>
        {voiceNotice && (
          <p className="voice-notice" role="status">
            {voiceNotice}
          </p>
        )}
        <button
          type="button"
          className={`voice-button ${listening ? "listening" : ""}`}
          aria-label={listening ? "음성 입력 중지" : "음성 입력"}
          aria-pressed={listening}
          onClick={startVoice}
        >
          <img src={`${assetPathPrefix}/f8542.svg`} alt="" />
        </button>
        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <textarea
            ref={input}
            aria-label="메시지 입력"
            placeholder="작업을 이어가요..."
            value={text}
            rows={stage === "writing" && text.length > 22 ? 2 : 1}
            inputMode={showResult ? "text" : "none"}
            disabled={showResult && !showRecommendations}
            onFocus={() => {
              if (stage !== "writing") begin()
            }}
            onChange={(event) => {
              setTyping(false)
              setText(event.target.value)
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                send()
              }
            }}
          />
          <button
            type="submit"
            className="send-button"
            aria-label="보내기"
            disabled={stage !== "writing" || (!typing && !text.trim())}
          >
            <img src={`${assetPathPrefix}/e1ffa.svg`} alt="" />
          </button>
        </form>
      </div>

      {stage === "writing" && !showResult && (
        <section className="keyboard" aria-label="한글 키보드">
          <div className="keyboard-toolbar">
            <span>한국어</span>
            <button
              type="button"
              onClick={() => {
                setTyping(false)
                setStage(showResult ? "result" : "idle")
                setText("")
              }}
              aria-label="입력 취소"
            >
              닫기
            </button>
          </div>
          {keyRows.map((row, index) => (
            <div className={`key-row row-${index}`} key={index}>
              {row.map((key) => (
                <button type="button" key={key} onClick={() => pressKey(key)}>
                  {key}
                </button>
              ))}
            </div>
          ))}
          <div className="key-row bottom-row">
            <button type="button" onClick={() => pressKey("123")}>
              123
            </button>
            <button
              type="button"
              className="space"
              onClick={() => pressKey(" ")}
            >
              스페이스
            </button>
            <button
              type="button"
              disabled={!typing && !text.trim()}
              onClick={send}
            >
              보내기
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
