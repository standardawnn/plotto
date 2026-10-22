import { useEffect, useRef, useState, type ReactNode } from "react"

const assetPathPrefix = "/stage5/assets"

function Asset({ name, className = "" }: { name: string; className?: string }) {
  return (
    <img
      src={`${assetPathPrefix}/${name}`}
      alt=""
      className={`asset ${className}`}
      draggable={false}
    />
  )
}

function Plotto({ className = "" }: { className?: string }) {
  return (
    <div className={`plotto-crop ${className}`} aria-hidden="true">
      <Asset name="546e2.png" />
    </div>
  )
}

function Dialog({
  children,
  onClose,
  label,
  className = "",
}: {
  children: ReactNode
  onClose: () => void
  label: string
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    document.body.classList.add("dialog-open")
    return () => {
      dialog?.close()
      document.body.classList.remove("dialog-open")
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      {children}
    </dialog>
  )
}

function SessionReminder({
  onJoin,
  onPostpone,
}: {
  onJoin: () => void
  onPostpone: () => void
}) {
  return (
    <Dialog
      label="공동세션 알림"
      onClose={onPostpone}
      className="session-reminder"
    >
      <h1>공동세션 시간이에요.</h1>
      <p className="reminder-description">태훈님과 함께 세션을 진행해요.</p>
      <div className="reminder-character" aria-hidden="true">
        <Asset name="68951.png" />
      </div>
      <button className="primary-button join-button" onClick={onJoin} autoFocus>
        공동세션 하러가기
      </button>
      <button className="postpone-button" onClick={onPostpone}>
        일정 미루기
      </button>
    </Dialog>
  )
}

const projects = [
  "마케팅 공모전",
  "청년 도움 프로젝트",
  "자원순환프로젝트",
  "아동자립캠프",
]
const tasks = [
  {
    title: "레퍼런스 정리",
    description: "공모전 수상작 참고하여 정리",
    progress: 100,
  },
  {
    title: "디자인 시안 수정",
    description: "0922 회의 기반 수정",
    progress: 60,
  },
  { title: "GUI 제작", description: "프론트앤드 전달용", progress: 40 },
  {
    title: "개발 일정 정리",
    description: "팀원들 스케줄에 맞춰 정리",
    progress: 20,
  },
]

function TaskArtwork({ index }: { index: number }) {
  return (
    <div className={`task-artwork task-artwork-${index}`} aria-hidden="true">
      <Asset
        name={
          index === 0 ? "acd76.svg" : index === 2 ? "f1dd7.svg" : "a3837.svg"
        }
        className="task-disc"
      />
      {index !== 0 && <Asset name="62918.svg" className="task-ring" />}
      {index === 1 && <Asset name="ff5f9.svg" className="task-progress-ring" />}
      {index === 3 && <Asset name="463be.svg" className="task-quarter-back" />}
      <div className="task-character-crop">
        <Asset name={index === 1 ? "76cb0.png" : "2b675.png"} />
      </div>
      {index === 0 && <Asset name="cb6c2.svg" className="task-full-ring" />}
      {index === 2 && (
        <>
          <Asset name="13d51.svg" className="task-half-ring" />
          <Asset name="0edcb.svg" className="task-half-ring" />
        </>
      )}
      {index === 3 && <Asset name="700d0.svg" className="task-quarter-front" />}
    </div>
  )
}

function Home({
  onReminder,
  reminderOpen,
  onBriefing,
}: {
  onReminder: () => void
  reminderOpen: boolean
  onBriefing: () => void
}) {
  const [project, setProject] = useState(projects[0])
  const [activeNav, setActiveNav] = useState("홈")
  const workRef = useRef<HTMLElement>(null)
  const deadlinesRef = useRef<HTMLElement>(null)

  return (
    <main className="app home-screen" data-node-id="2:289">
      <div className="home-glow" aria-hidden="true" />
      <header className="home-header flex items-center justify-between">
        <Asset name="32232.svg" />
        <button
          className="notification-button icon-button"
          aria-label="공동세션 알림 열기"
          onClick={onReminder}
        >
          <Asset name="98c83.svg" />
          <Asset name="402d4.svg" className="notification-dot" />
        </button>
      </header>

      <section className="briefing-section" aria-label="회의 브리핑">
        <div className="briefing-card flex items-center justify-between">
          <div className="briefing-copy">
            <p className="briefing-date">09/29 화</p>
            <h1>
              서연님이 자리를 비운 동안
              <br />
              회의가 진행됐어요
            </h1>
            <button className="briefing-button" onClick={onBriefing}>
              브리핑 보기
            </button>
          </div>
          <Plotto className="briefing-character" />
        </div>
      </section>

      <div className="home-sections">
        <section
          className="work-section"
          ref={workRef}
          aria-labelledby="work-heading"
        >
          <h2 id="work-heading" className="section-heading">
            열심히 일하고 있어요
          </h2>
          <div
            className="project-tabs no-scrollbar flex"
            role="tablist"
            aria-label="프로젝트"
          >
            {projects.map((name) => (
              <button
                key={name}
                className={`project-tab ${project === name ? "selected" : ""}`}
                role="tab"
                id={`project-${projects.indexOf(name)}`}
                aria-selected={project === name}
                aria-controls="project-tasks"
                onClick={() => setProject(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div
            id="project-tasks"
            className="task-carousel no-scrollbar flex"
            role="tabpanel"
            aria-labelledby={`project-${projects.indexOf(project)}`}
          >
            {tasks.map((task, index) => (
              <article className="task-card" key={task.title}>
                <div className="task-card-surface" />
                <TaskArtwork index={index} />
                <h3>{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-progress flex items-center justify-center">
                  <Asset name="d8eda.svg" />
                  <p>진행도 {task.progress}%</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="deadlines-section"
          ref={deadlinesRef}
          aria-labelledby="deadlines-heading"
        >
          <h2 id="deadlines-heading" className="section-heading">
            마감이 임박한 작업이에요!
          </h2>
          <div className="deadline-list flex flex-col">
            {[
              {
                title: "기획안 수정하기",
                project: "마케팅 공모전",
                due: "D-DAY",
                time: "30분 예상",
              },
              {
                title: "디자인 피드백",
                project: "청년 참여 프로젝트",
                due: "D-1",
                time: "50분 예상",
              },
              {
                title: "레퍼런스 정리",
                project: "자원순환프로젝트",
                due: "D-3",
                time: "20분 예상",
              },
            ].map((task) => (
              <article
                key={task.title}
                className="deadline-card flex justify-between"
              >
                <div className="deadline-copy">
                  <h3>{task.title}</h3>
                  <p>{task.project}</p>
                </div>
                <div className="deadline-time flex items-center">
                  <span className={task.due === "D-DAY" ? "due-today" : ""}>
                    {task.due}
                  </span>
                  <span>·</span>
                  <span>{task.time}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {!reminderOpen && (
        <nav
          className="home-navigation flex items-center"
          aria-label="하단 메뉴"
        >
          <button
            className={`icon-button ${activeNav === "홈" ? "nav-active" : ""}`}
            aria-label="홈"
            aria-current={activeNav === "홈" ? "page" : undefined}
            onClick={() => {
              setActiveNav("홈")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <span className="home-icon">
              <Asset name="49e20.svg" className="home-icon-door" />
              <Asset name="e4e8a.svg" className="home-icon-shape" />
            </span>
          </button>
          <button
            className="icon-button"
            aria-label="프로젝트"
            onClick={() => {
              setActiveNav("프로젝트")
              workRef.current?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <Asset name="a7fd4.svg" />
          </button>
          <button
            className="icon-button"
            aria-label="공동세션"
            onClick={onReminder}
          >
            <Asset name="f73ff.svg" />
          </button>
          <button
            className="icon-button"
            aria-label="내 작업"
            onClick={() => {
              setActiveNav("내 작업")
              deadlinesRef.current?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <Asset name="7153c.svg" />
          </button>
        </nav>
      )}
    </main>
  )
}

const files = [
  {
    title: "경쟁 업체 추가 모음",
    type: "PPTX",
    time: "17분 전",
    owner: "태훈",
    asset: "ca82b.svg",
  },
  {
    title: "주제선정_자료조사",
    type: "PDF",
    time: "1시간 전",
    owner: "태훈",
    asset: "2e09b.svg",
  },
  {
    title: "마케팅 기획안_최종",
    type: "DOC",
    time: "8시간 전",
    owner: "서연",
    asset: "036a7.svg",
  },
]

function SessionFileScroller({
  children,
  className,
  label,
}: {
  children: ReactNode
  className: string
  label: string
}) {
  const drag = useRef<{
    pointerId: number
    startX: number
    scrollLeft: number
  } | null>(null)

  return (
    <div
      className={`${className} no-scrollbar flex`}
      role="region"
      aria-label={label}
      tabIndex={0}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          scrollLeft: event.currentTarget.scrollLeft,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        const current = drag.current
        if (!current || current.pointerId !== event.pointerId) return
        event.currentTarget.scrollLeft =
          current.scrollLeft - (event.clientX - current.startX)
      }}
      onLostPointerCapture={() => {
        drag.current = null
      }}
    >
      {children}
    </div>
  )
}

function SessionFolder({
  review = false,
  className = "",
}: {
  review?: boolean
  className?: string
}) {
  return (
    <article
      className={`delivery-folder ${
        review ? "review-folder" : ""
      } ${className}`}
    >
      <Asset
        name={review ? "86716.svg" : "a1b46.svg"}
        className="delivery-folder-shape"
      />
      <div className="delivery-folder-badge">
        <span>{review ? "기획안 검토" : "Plotto 추천"}</span>
        {!review && <Asset name="6c196.svg" />}
      </div>
      <div className="delivery-folder-copy">
        <p>{review ? "기획안 수정_공동세션" : "AI 서비스 사례_공동세션"}</p>
        <p>3개의 관련된 파일</p>
      </div>
    </article>
  )
}

function SessionFileDelivery({ finished }: { finished: boolean }) {
  return (
    <div
      className={`file-delivery ${finished ? "is-finished" : ""}`}
      data-node-id="14:1809"
      role="img"
      aria-label="Plotto가 왼쪽에서 AI 서비스 사례 공동세션 파일 3개를 끌고 옵니다."
      aria-hidden={finished}
    >
      <div className="file-delivery-procession">
        <SessionFolder />
        <div className="delivery-character" data-node-id="14:1838">
          <Asset name="59b2c.png" />
        </div>
      </div>
    </div>
  )
}

function SessionRecommendations({
  characterVisible,
  bubbleVisible,
}: {
  characterVisible: boolean
  bubbleVisible: boolean
}) {
  return (
    <div className="session-recommendations" data-node-id="14:2133">
      <svg width="0" height="0" aria-hidden="true" className="walk-filter-definitions">
        <defs>
          <filter id="walk-without-ground-shadow" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feFlood floodColor="white" x="0" y="110" width="108" height="15" result="ground" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2126 0.7152 0.0722 0 0" result="brightness" />
            <feComposite in="brightness" in2="SourceAlpha" operator="in" result="visibleBrightness" />
            <feComponentTransfer in="visibleBrightness" result="feetMask">
              <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="feetMask" operator="in" result="feet" />
            <feComposite in="feet" in2="ground" operator="in" result="cleanGround" />
            <feComposite in="SourceGraphic" in2="ground" operator="out" result="body" />
            <feMerge><feMergeNode in="body" /><feMergeNode in="cleanGround" /></feMerge>
          </filter>
        </defs>
      </svg>
      <SessionFileScroller
        className="recommendation-folders"
        label="공동세션 추천 폴더, 좌우로 스크롤하여 다른 폴더 보기"
      >
        <SessionFolder className="recommendation-folder" />
        <SessionFolder className="recommendation-folder" review />
      </SessionFileScroller>
      <div
        className={`plotto-crop greeting-character recommendation-character ${
          characterVisible ? "is-visible" : ""
        }`}
        aria-hidden="true"
      >
        <div className="recommendation-character-motion" />
      </div>
      <div
        className={`greeting-bubble recommendation-bubble ${
          bubbleVisible ? "is-visible" : ""
        }`}
        aria-hidden={!bubbleVisible}
        data-node-id="14:2194"
      >
        <p>
          Plotto가 추천한
          <br />
          AI 서비스 사례를 함께 살펴보는 것을
          <br />
          추천해요!
        </p>
      </div>
    </div>
  )
}

const initialSessionSeconds = 11 * 60 + 41

type SessionStage = "intro" | "delivery" | "files" | "character" | "complete"

function Session({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState(true)
  const [muted, setMuted] = useState(false)
  const [camera, setCamera] = useState(true)
  const [sound, setSound] = useState(true)
  const [menu, setMenu] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSessionSeconds)
  const [characterVisible, setCharacterVisible] = useState(false)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [stage, setStage] = useState<SessionStage>("intro")
  const deliveryStarted = stage !== "intro"
  const recommendationsVisible = deliveryStarted && stage !== "delivery"

  function startDelivery() {
    if (stage !== "intro") return
    setExpanded(false)
    setStage("delivery")
  }

  useEffect(() => {
    if (stage === "intro" || stage === "complete") return
    const nextStage =
      stage === "delivery"
        ? "files"
        : stage === "files"
          ? "character"
          : "complete"
    const delay = stage === "delivery" ? 3200 : stage === "files" ? 1000 : 900
    const timeout = window.setTimeout(() => setStage(nextStage), delay)
    return () => window.clearTimeout(timeout)
  }, [stage])

  useEffect(() => {
    const startedAt = Date.now()
    const timer = window.setInterval(() => {
      setElapsedSeconds(
        initialSessionSeconds + Math.floor((Date.now() - startedAt) / 1000),
      )
    }, 1000)
    const characterTimeout = window.setTimeout(() => {
      setCharacterVisible(true)
    }, 2000)
    const bubbleTimeout = window.setTimeout(() => {
      setBubbleVisible(true)
    }, 3000)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(characterTimeout)
      window.clearTimeout(bubbleTimeout)
    }
  }, [])

  const sessionMinutes = Math.floor(elapsedSeconds / 60)
  const sessionSeconds = elapsedSeconds % 60

  return (
    <main
      className={`app session-screen ${deliveryStarted ? "is-active" : ""}`}
      data-node-id={recommendationsVisible ? "14:2133" : "2:695"}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest(
            "button, a, .file-carousel, .recommendation-folders",
          )
        ) {
          return
        }
        startDelivery()
      }}
    >
      <div className="session-glow" aria-hidden="true" />
      <div className="session-stage" aria-hidden="true">
        <Asset name="f80eb.svg" />
      </div>
      <header className="session-header flex items-center">
        <button
          className="icon-button back-button"
          aria-label="홈으로 돌아가기"
          onClick={onBack}
        >
          <Asset name="c3070.svg" />
        </button>
        <div
          className={`session-status ${deliveryStarted ? "is-speaking" : ""}`}
          aria-label={
            deliveryStarted
              ? "태훈님이 말하고 있어요."
              : `서연님과 태훈님 참여중, ${sessionMinutes}분 ${sessionSeconds}초`
          }
        >
          <div
            className="session-presence flex items-center"
            aria-hidden={deliveryStarted}
          >
            <div className="participants flex">
              <div className="participant">
                <div className="avatar-crop">
                  <Asset name="8c6ad.png" />
                </div>
                <Asset name="52191.svg" className="online-dot" />
              </div>
              <div className="participant">
                <div className="avatar-crop second-avatar">
                  <Asset name="4d45b.png" />
                </div>
                <Asset name="52191.svg" className="online-dot" />
              </div>
            </div>
            <span className="participating-label">참여중</span>
            <span className="session-time" role="timer" aria-live="off">
              {String(sessionMinutes).padStart(2, "0")}:
              {String(sessionSeconds).padStart(2, "0")}
            </span>
          </div>
          <div
            className="session-speaker flex items-center"
            aria-hidden={!deliveryStarted}
          >
            <div className="participant">
              <div className="avatar-crop">
                <Asset name="8c6ad.png" />
              </div>
              <Asset name="52191.svg" className="online-dot" />
            </div>
            <span>태훈님이 말하고 있어요.</span>
            <span className="speaker-wave" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
      </header>

      <section
        className={`session-topic ${expanded ? "" : "topic-collapsed"} ${
          deliveryStarted ? "is-minutes" : ""
        }`}
        aria-label="공동세션 주제"
      >
        {deliveryStarted && (
          <button
            className="minutes-toggle"
            aria-expanded={expanded}
            aria-controls="session-topic-content"
            onClick={() => setExpanded(!expanded)}
          >
            <span>{expanded ? "회의록 접기" : "회의록 펼치기"}</span>
            <Asset name="ef9e6.svg" className={expanded ? "is-expanded" : ""} />
          </button>
        )}
        <div
          className="topic-content"
          id="session-topic-content"
          inert={deliveryStarted && !expanded}
          aria-hidden={deliveryStarted && !expanded}
        >
          <div className="topic-content-inner">
            <div className="topic-group">
              <h2>주제</h2>
              <p>브랜딩에서 쓰이는 AI 서비스 사례를 알고 싶음</p>
            </div>
            {(expanded || deliveryStarted) && (
              <div className="topic-group" id="session-topic-details">
                <h2>내용</h2>
                <p>실제 사례에 대한 더욱 다양한 자료가 필요함</p>
              </div>
            )}
            <div className="topic-toggle-row flex justify-end">
              <button
                className={`icon-button topic-toggle ${
                  expanded ? "" : "is-collapsed"
                }`}
                aria-label={expanded ? "내용 접기" : "내용 펼치기"}
                aria-expanded={expanded}
                aria-controls="session-topic-details"
                onClick={() => setExpanded(!expanded)}
              >
                <Asset name="5fd5a.svg" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="assistant-greeting" aria-label="Plotto 세션 안내">
        {deliveryStarted && (
          <SessionFileDelivery finished={recommendationsVisible} />
        )}
        {recommendationsVisible && (
          <SessionRecommendations
            characterVisible={stage === "character" || stage === "complete"}
            bubbleVisible={stage === "complete"}
          />
        )}
        {!deliveryStarted && (
          <>
            <div
              className={`greeting-bubble ${bubbleVisible ? "is-visible" : ""}`}
              aria-hidden={!bubbleVisible}
            >
              <p>
                안녕하세요 서연님.
                <br />
                공동세션 진행에 필요한 파일들을
                <br />
                Plotto가 가져올게요
              </p>
            </div>
            <Plotto
              className={`greeting-character ${
                characterVisible ? "is-visible" : ""
              }`}
            />
            <Asset
              name="901cb.svg"
              className={`greeting-decoration ${
                characterVisible ? "is-visible" : ""
              }`}
            />
            <button
              className="delivery-trigger"
              aria-label="Plotto가 파일을 끌고 오는 애니메이션 재생"
              onClick={startDelivery}
            />
          </>
        )}
      </section>

      <section className="session-files" aria-labelledby="files-heading">
        <div className="files-heading flex items-center justify-between">
          <div className="flex items-center">
            <Asset name="7f86f.svg" />
            <h2 id="files-heading">세션과 관련 자료를 모았어요.</h2>
          </div>
          <button
            className="icon-button files-more"
            aria-label="세션 메뉴 열기"
            onClick={() => setMenu(!menu)}
          >
            <Asset name="d5abd.svg" />
          </button>
        </div>
        <SessionFileScroller
          className="file-carousel"
          label="세션 자료 목록, 좌우로 스크롤하여 다른 파일 보기"
        >
          {files.map((file) => (
            <article
              key={file.title}
              className="file-card flex flex-col items-center justify-center"
            >
              <div className="file-icon" aria-hidden="true">
                <Asset name={file.asset} className="file-icon-sheet" />
                <Asset
                  name={file.type === "DOC" ? "b8c7b.svg" : "55493.svg"}
                  className="file-icon-fold"
                />
                <span>{file.type}</span>
              </div>
              <div className="file-info">
                <h3>{file.title}</h3>
                <p>
                  {file.time} · 담당자: {file.owner}
                </p>
              </div>
            </article>
          ))}
        </SessionFileScroller>
      </section>

      <div
        className="session-controls flex items-center"
        role="group"
        aria-label="공동세션 통화 설정"
      >
        <button
          className={`call-button microphone ${
            muted ? "control-disabled" : ""
          }`}
          aria-label={muted ? "마이크 켜기" : "마이크 끄기"}
          aria-pressed={!muted}
          onClick={() => setMuted(!muted)}
        >
          <Asset name="7551b.svg" />
          {muted && <span className="control-slash" />}
        </button>
        <button
          className={`call-button ${camera ? "" : "control-disabled"}`}
          aria-label={camera ? "카메라 끄기" : "카메라 켜기"}
          aria-pressed={camera}
          onClick={() => setCamera(!camera)}
        >
          <Asset name="d388f.svg" />
          {!camera && <span className="control-slash" />}
        </button>
        <button
          className={`call-button ${sound ? "" : "control-disabled"}`}
          aria-label={sound ? "소리 끄기" : "소리 켜기"}
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
        >
          <Asset name="84aad.svg" />
          {!sound && <span className="control-slash" />}
        </button>
        <button
          className="call-button more-call-button"
          aria-label="통화 메뉴"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          <Asset name="9ee30.svg" />
          <Asset name="3f257.svg" className="call-more-icon" />
        </button>
        {menu && (
          <div className="call-menu">
            <button onClick={onBack}>세션 나가기</button>
            <button onClick={() => setMenu(false)}>닫기</button>
          </div>
        )}
      </div>
      <div className="sr-only" role="status">
        {muted ? "마이크가 꺼져 있어요." : "마이크가 켜져 있어요."}
      </div>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState(() =>
    location.hash === "#session" ? "session" : "home",
  )
  const [reminderOpen, setReminderOpen] = useState(
    () => location.hash !== "#session",
  )
  const [briefingOpen, setBriefingOpen] = useState(false)

  useEffect(() => {
    const onNavigate = () => {
      setScreen(location.hash === "#session" ? "session" : "home")
      setReminderOpen(false)
      setBriefingOpen(false)
    }
    window.addEventListener("popstate", onNavigate)
    return () => window.removeEventListener("popstate", onNavigate)
  }, [])

  function navigate(to: "home" | "session") {
    setReminderOpen(false)
    setBriefingOpen(false)
    setScreen(to)
    history.pushState(
      null,
      "",
      to === "session" ? "#session" : location.pathname + location.search,
    )
    window.scrollTo(0, 0)
  }

  return (
    <>
      {screen === "home" ? (
        <Home
          onReminder={() => setReminderOpen(true)}
          reminderOpen={reminderOpen}
          onBriefing={() => setBriefingOpen(true)}
        />
      ) : (
        <Session onBack={() => navigate("home")} />
      )}
      {reminderOpen && (
        <SessionReminder
          onJoin={() => navigate("session")}
          onPostpone={() => setReminderOpen(false)}
        />
      )}
      {briefingOpen && (
        <Dialog
          label="회의 브리핑"
          onClose={() => setBriefingOpen(false)}
          className="briefing-dialog"
        >
          <p className="briefing-dialog-date">09/29 화</p>
          <h2>
            서연님이 자리를 비운 동안
            <br />
            회의가 진행됐어요
          </h2>
          <p>
            태훈님과 함께 공동세션에서
            <br />
            회의 내용과 관련 자료를 확인해 보세요.
          </p>
          <button
            className="primary-button"
            onClick={() => {
              setBriefingOpen(false)
              setReminderOpen(true)
            }}
          >
            공동세션 확인하기
          </button>
          <button
            className="text-button"
            onClick={() => setBriefingOpen(false)}
          >
            닫기
          </button>
        </Dialog>
      )}
    </>
  )
}
