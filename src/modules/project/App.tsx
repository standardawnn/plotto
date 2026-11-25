import { go } from '../../journey';
import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { dayDifference, getScheduleDates, projectToday, shiftDate } from './scheduleDates'
import ProjectPicker from './ProjectPicker'
import { useProjects } from './useProjects'
import type { HomeTask } from './projectHomeData'

const assets = '/stage1/assets'
const portraits: Record<string, string> = {
  me: 'c79f2.png',
  tae: 'e8f4a.png',
  yu: '4d45b.png',
}
function Avatar({ name, kind }: { name: string; kind: string }) {
  return (
    <span className={`avatar avatar-${kind}`}>
      <img src={`${assets}/${portraits[kind]}`} alt={`${name} 프로필`} />
    </span>
  )
}

/** A schedule chip. Done chips carry the check icon after the title ('references': before it). */
function TaskChip({ task }: { task: HomeTask }) {
  if (!task.done) return <span className={`task ${task.kind}`}>{task.title}</span>
  const check = <img src={`${assets}/ef293.svg`} alt="완료" />
  return task.kind === 'references'
    ? <span className={`task completed ${task.kind}`}>{check}{task.title}</span>
    : <span className={`task completed ${task.kind}`}>{task.title}{check}</span>
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
  const projects = useProjects()
  const [pickerOpen, setPickerOpen] = useState(false)
  const projectLabel = useRef<HTMLButtonElement>(null)
  const home = projects.home
  const dates = getScheduleDates(selectedDate)

  function closePicker() {
    setPickerOpen(false)
    projectLabel.current?.focus()
  }

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
        <button
          type="button"
          ref={projectLabel}
          className="project-label"
          aria-haspopup="dialog"
          aria-expanded={pickerOpen}
          aria-label={`현재 프로젝트 ${projects.current?.name ?? 'AI분석프로젝트'}, 프로젝트 목록 열기`}
          onClick={() => setPickerOpen(true)}
        >
          <span className="project-label-name">{projects.current?.name ?? 'AI분석프로젝트'}</span><img src={`${assets}/57b8b.svg`} alt="" />
        </button>
        <h1>{home.focus.titleLines.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}</h1>
        <p className="last-active"><img src={`${assets}/de2c6.svg`} alt="" />{home.focus.lastActiveLabel}</p>
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
        <h2 id="activity-title">새로운 활동 <span>{home.activities.length}</span></h2>
        {home.activities.map((activity, i) => {
          const actor = home.members.find((member) => member.id === activity.actorId)
          if (!actor) return null
          return (
            <button key={i} className="activity-card" onClick={() => go('feedback')} aria-label={`${actor.name}님이 전달한 파일 ${activity.fileCount}개 보기`}>
              <Avatar name={actor.name} kind={actor.avatar} />
              <p className="activity-copy">{`${actor.name}님이`}<br /><span>{`${activity.fileCount}개의 파일`}</span>을 전달했어요.</p>
              <p className="activity-time">{activity.timeLabel}</p>
              <div className="file-art" aria-hidden="true">
                <img src={`${assets}/0ffc9.png`} alt="" />
              </div>
            </button>
          )
        })}
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
                {home.members.map((member, i) => (
                  <div className="schedule-row" key={member.id}>
                    <div className="member">
                      <Avatar name={member.name} kind={member.avatar} />
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                    <div className={`tasks tasks-${i}`}>
                      {(home.tasks[member.id] ?? []).map((task, j) => <TaskChip key={j} task={task} />)}
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
      {pickerOpen && (
        <ProjectPicker
          store={projects}
          onClose={closePicker}
          onOpened={(project, created) => {
            closePicker()
            setNotice(`'${project.name}' 프로젝트를 ${created ? '만들고 열었어요' : '열었어요'}.`)
          }}
        />
      )}
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
