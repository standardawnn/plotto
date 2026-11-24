import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { isProjectDate, type Project } from '../../projectStore'
import type { ActionResult, useProjects } from './useProjects'
import './ProjectPicker.css'

type Props = {
  store: ReturnType<typeof useProjects>
  onClose: () => void
  /** Called after a project was opened or created and opened. */
  onOpened: (project: Project, created: boolean) => void
}

const detail = (memberCount: number | null, startDate: string | null) =>
  `인원: ${memberCount ?? '-'}명 | 시작일: ${startDate ?? '-'}`

const createdLabel = (iso: string) => {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} 생성`
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Focusable, rendered elements inside `root`, in tab order. */
const focusables = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0)

/** Project list + create, opened from the project name in the project home hero. */
export default function ProjectPicker({ store, onClose, onOpened }: Props) {
  const [view, setView] = useState<'list' | 'create'>('list')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [members, setMembers] = useState('')
  const [startDate, setStartDate] = useState('')
  const dialog = useRef<HTMLElement>(null)

  // While open: remember what had focus and lock background scrolling.
  // On close: restore both. Layout effect so this runs before the autofocus below moves focus.
  useLayoutEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const root = document.documentElement
    const body = document.body
    const scroll = [root.scrollTop, body.scrollTop]
    root.classList.add('picker-scroll-lock')
    return () => {
      root.classList.remove('picker-scroll-lock')
      root.scrollTop = scroll[0]
      body.scrollTop = scroll[1]
      if (previous && previous !== body && previous.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    dialog.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [view])

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return }
      // Keep Tab / Shift+Tab inside the dialog.
      const sheet = dialog.current
      if (event.key !== 'Tab' || !sheet) return
      const items = focusables(sheet)
      if (items.length === 0) { event.preventDefault(); sheet.focus(); return }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const inside = active instanceof Node && sheet.contains(active)
      if (!inside || active === (event.shiftKey ? first : last)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [onClose])

  function finish(result: ActionResult, created: boolean) {
    if (!result.ok) { setError(result.message); return }
    onOpened(result.project, created)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('프로젝트 이름을 입력해 주세요.'); return }
    const memberCount = members.trim() === '' ? null : Number(members)
    if (memberCount !== null && !(Number.isInteger(memberCount) && memberCount >= 1)) {
      setError('인원은 1 이상의 숫자로 입력해 주세요.'); return
    }
    const date = startDate ? startDate.replace(/-/g, '.') : null // <input type=date> gives YYYY-MM-DD
    if (date !== null && !isProjectDate(date)) { setError('시작일을 확인해 주세요.'); return }
    finish(store.create({ name: trimmed, memberCount, startDate: date }), true)
  }

  // Projects can share a name (same sample created twice), so show when each was made.
  const nameCount = new Map<string, number>()
  for (const p of store.projects) nameCount.set(p.name, (nameCount.get(p.name) ?? 0) + 1)

  return (
    <div className="picker-backdrop" onClick={onClose}>
      <section
        ref={dialog}
        className="picker-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="picker-header">
          {view === 'create' && (
            <button type="button" className="picker-icon-button" aria-label="프로젝트 목록으로" onClick={() => { setView('list'); setError('') }}>
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M16.136 3.363a.9.9 0 0 1 0 1.273L8.773 12l7.363 7.363a.9.9 0 1 1-1.272 1.273l-8-8a.9.9 0 0 1 0-1.273l8-8a.9.9 0 0 1 1.272 0Z" fill="currentColor" /></svg>
            </button>
          )}
          <h2 id="picker-title">{view === 'list' ? '프로젝트' : '새 프로젝트 만들기'}</h2>
          <button type="button" className="picker-icon-button picker-close" aria-label="닫기" onClick={onClose}>
            <img src="/brand/icon-close.svg" width="24" height="24" alt="" />
          </button>
        </header>

        {error && <p className="picker-error" role="alert">{error}</p>}

        {view === 'list' ? (
          <>
            {store.projects.length === 0
              ? <p className="picker-empty">아직 프로젝트가 없어요.<br />새 프로젝트를 만들어 시작해 보세요.</p>
              : (
                <ul className="picker-list" aria-label="내 프로젝트">
                  {store.projects.map((project, index) => {
                    const selected = project.id === store.current?.id
                    return (
                      <li key={project.id}>
                        <button
                          type="button"
                          className="picker-choice"
                          aria-current={selected ? 'true' : undefined}
                          data-autofocus={selected || (!store.current && index === 0) ? '' : undefined}
                          onClick={() => finish(store.select(project.id), false)}
                        >
                          <strong>{project.name}</strong>
                          <span>
                            {detail(project.memberCount, project.startDate)}
                            {(nameCount.get(project.name) ?? 0) > 1 && <> · {createdLabel(project.createdAt)}</>}
                          </span>
                          {selected && <em className="picker-badge">현재</em>}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            <button type="button" className="picker-primary" data-autofocus={store.projects.length === 0 ? '' : undefined} onClick={() => { setView('create'); setError('') }}>
              새 프로젝트 만들기
            </button>
          </>
        ) : (
          <div className="picker-create">
            <h3>샘플로 만들기</h3>
            <ul className="picker-list" aria-label="샘플 프로젝트">
              {store.samples.map((sample, index) => (
                <li key={sample.sampleId}>
                  <button
                    type="button"
                    className="picker-choice"
                    data-autofocus={index === 0 ? '' : undefined}
                    onClick={() => finish(store.createFromSample(sample.sampleId), true)}
                  >
                    <strong>{sample.name}</strong>
                    <span>{detail(sample.memberCount, sample.startDate)}</span>
                  </button>
                </li>
              ))}
            </ul>

            <h3>직접 만들기</h3>
            <form className="picker-form" onSubmit={submit} noValidate>
              <label>
                <span>프로젝트 이름</span>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="프로젝트 이름을 입력해 주세요" maxLength={30} />
              </label>
              <div className="picker-form-row">
                <label>
                  <span>인원 (선택)</span>
                  <input value={members} onChange={(event) => setMembers(event.target.value)} inputMode="numeric" type="number" min={1} step={1} placeholder="명" />
                </label>
                <label>
                  <span>시작일 (선택)</span>
                  <input value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" />
                </label>
              </div>
              <button type="submit" className="picker-primary">만들기</button>
            </form>
          </div>
        )}
      </section>
    </div>
  )
}
