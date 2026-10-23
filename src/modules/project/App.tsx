import { go } from '../../journey';
import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { dayDifference, getScheduleDates, projectToday, shiftDate } from './scheduleDates'

const assets = '/stage1/assets'
const portraits: Record<string, string> = {
  me: 'c79f2.png',
  tae: 'e8f4a.png',
  yu: '4d45b.png',
}
const members = [
  { name: '나', role: '기획', avatar: 'me' },
  { name: '태훈', role: '자료조사', avatar: 'tae' },
  { name: '유진', role: 'PPT', avatar: 'yu' },
]
function Avatar({ name, kind }: { name: string; kind: string }) {
  return (
    <span className={`avatar avatar-${kind}`}>
      <img src={`${assets}/${portraits[kind]}`} alt={`${name} 프로필`} />
    </span>
  )
}

export default function App() {
  const schedule = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)
  const dragged = useRef(false)
  const selectedDateButton = useRef<HTMLButtonElement>(null)
  const focusSelectedDate = useRef(false)
  const [selectedDate, setSelectedDate] = useState(projectToday)
  const [notice, setNotice] = useState('')
  const [showFiles, setShowFiles] = useState(false)
  const dates = getScheduleDates(selectedDate)

  useLayoutEffect(() => {
    schedule.current?.scrollTo({ left: 0 })
    if (focusSelectedDate.current) {
      selectedDateButton.current?.focus({ preventScroll: true })
      focusSelectedDate.current = false
    }
  }, [selectedDate])

  function selectDate(date: Date) {
    focusSelectedDate.current = true
    setSelectedDate(date)
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    dragged.current = false
    if (event.pointerType !== 'mouse' || !schedule.current) return
    drag.current = { x: event.clientX, left: schedule.current.scrollLeft }
  }

  return (
    <main className="app" lang="ko">
      <header className="hero">
        <div className="project-label">AI분석프로젝트<img src={`${assets}/57b8b.svg`} alt="" /></div>
        <h1>AI 서비스 시장의<br />현황 분석을 이어서 해요.</h1>
        <p className="last-active"><img src={`${assets}/de2c6.svg`} alt="" />3시간 전 중단</p>
        <div className="hero-art" aria-hidden="true">
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={`${assets}/2b675.png`} />
            <img src={`${assets}/plotto-typing.gif`} alt="" />
          </picture>
        </div>
        <button className="continue-button" onClick={() => {
          window.parent.postMessage({type: 'plotto:navigate', stage: 2}, '*')
        }}>이어서 하기</button>
      </header>

      <section className="activity" aria-labelledby="activity-title">
        <h2 id="activity-title">새로운 활동 <span>1</span></h2>
        <button className="activity-card" onClick={() => go('feedback')} aria-label="태훈님이 전달한 파일 2개 보기">
          <Avatar name="태훈" kind="tae" />
          <p className="activity-copy">태훈님이<br /><span>2개의 파일</span>을 전달했어요.</p>
          <p className="activity-time">1시간 전</p>
          <div className="file-art" aria-hidden="true">
            <img src={`${assets}/0ffc9.png`} alt="" />
          </div>
        </button>
      </section>

      <section className="schedule-section" aria-labelledby="schedule-title">
        <h2 id="schedule-title">프로젝트 일정</h2>
        <div className="schedule-viewport">
          <div
            className="schedule-scroll"
            ref={schedule}
            tabIndex={0}
            role="region"
            aria-label="프로젝트 일정. 날짜를 선택하거나 좌우로 스와이프할 수 있습니다."
            onPointerDown={startDrag}
            onPointerMove={(event) => {
              if (drag.current && schedule.current) {
                const distance = event.clientX - drag.current.x
                if (Math.abs(distance) > 5) {
                  dragged.current = true
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                if (dragged.current) {
                  schedule.current.scrollLeft = drag.current.left - distance
                }
              }
            }}
            onPointerUp={() => { drag.current = null }}
            onPointerCancel={() => { drag.current = null }}
            onLostPointerCapture={() => { drag.current = null }}
            onPointerLeave={() => { if (!dragged.current) drag.current = null }}
            onClickCapture={(event) => {
              if (dragged.current && event.detail !== 0) {
                event.preventDefault()
                event.stopPropagation()
              }
              dragged.current = false
            }}
            onWheel={(event) => {
              if (event.shiftKey && schedule.current) schedule.current.scrollLeft += event.deltaY
            }}
          >
            <div
              className="schedule-canvas"
              style={{ '--schedule-day-shift': dayDifference(projectToday, selectedDate) } as CSSProperties}
            >
              <div className="date-row" role="group" aria-label="일정 날짜 선택">
                {dates.map(({ date, key, label, weekday, isToday, isSelected }) => (
                  <button
                    type="button"
                    className={`date ${isSelected ? 'selected' : ''}`}
                    key={key}
                    ref={isSelected ? selectedDateButton : undefined}
                    aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}요일${isToday ? ', 오늘' : ''}`}
                    aria-pressed={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => selectDate(date)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        event.preventDefault()
                        selectDate(shiftDate(date, event.key === 'ArrowLeft' ? -1 : 1))
                      } else if (event.key === 'Home') {
                        event.preventDefault()
                        selectDate(new Date(projectToday))
                      }
                    }}
                  >
                    <span>{label}</span><span>{isToday ? '오늘' : weekday}</span>
                  </button>
                ))}
              </div>
              <div className="schedule-rows">
                {members.map((member, i) => (
                  <div className="schedule-row" key={member.name}>
                    <div className="member">
                      <Avatar name={member.name} kind={member.avatar} />
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                    <div className={`tasks tasks-${i}`}>
                      {i === 0 && <><span className="task completed planning">기획안 작성<img src={`${assets}/ef293.svg`} alt="완료" /></span><span className="task revision">기획안 수정</span></>}
                      {i === 1 && <><span className="task completed collecting">자료 수집<img src={`${assets}/ef293.svg`} alt="완료" /></span><span className="task research">자료조사</span><span className="task extra">자료 추가 조사</span></>}
                      {i === 2 && <><span className="task completed references"><img src={`${assets}/ef293.svg`} alt="완료" />레퍼런스 수집</span><span className="task slides">PPT 제작</span></>}
                    </div>
                  </div>
                ))}
              </div>
              <img className="selected-date-line" src={`${assets}/e6847.svg`} alt="" />
            </div>
          </div>
        </div>
      </section>

      <div className="bottom-fade" aria-hidden="true" />
      <nav className="bottom-nav" aria-label="주 메뉴">
        <button aria-label="홈" onClick={() => go('briefing')}>
          <span className="home-icon"><img src="/brand/nav-home.svg" alt="" /></span>
        </button>
        <button aria-label="프로젝트" aria-current="page" onClick={() => schedule.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
          <img src="/brand/nav-project-active.svg" alt="" />
        </button>
        <button aria-label="채팅" onClick={() => go('intervention','chat')}>
          <img src="/brand/nav-chat.svg" alt="" />
        </button>
        <button aria-label="내 정보" onClick={() => setNotice('내 정보 · ' + (localStorage.getItem('plotto-nickname') || '서연') + '님 · 기획 담당')}>
          <img src="/brand/nav-profile.svg" alt="" />
        </button>
      </nav>
      {notice && <div className="toast" role="status" onClick={() => setNotice('')}>{notice}<button aria-label="알림 닫기" onClick={() => setNotice('')}><img src="/brand/icon-close.svg" width="24" height="24" alt="" /></button></div>}
      {showFiles && <div className="modal-backdrop" onClick={() => setShowFiles(false)}>
        <section className="file-dialog" role="dialog" aria-modal="true" aria-labelledby="files-title" onClick={(event) => event.stopPropagation()}>
          <h2 id="files-title">태훈님이 전달한 파일</h2>
          <p>2개의 파일을 전달했어요.</p>
          <p className="file-note">파일 상세 정보는 아직 연결되지 않았어요.</p>
          <button autoFocus onClick={() => setShowFiles(false)}>닫기</button>
        </section>
      </div>}
    </main>
  )
}
