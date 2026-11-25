/**
 * Per-project data for the project home (hero, members, activity, schedule tasks).
 *
 * Stored inside a project's `ProjectData` under the `home` key
 * (`projectStore.getProjectState(id)?.home`), so other screens can add their own
 * keys next to it later.
 *
 * - `DEFAULT_PROJECT_HOME` is the content the project home showed before this data
 *   existed (src/modules/project/App.tsx). It is the template for new sample
 *   projects and what is shown when a project has no (or unusable) home data.
 * - `readProjectHome` never writes and does not throw for stored (JSON) data:
 *   anything that is not valid version-1 home data is shown as the default template.
 * - Times are display labels for now ("3시간 전 중단"), not timestamps.
 */
import type { ProjectData } from '../../projectStore'

export const PROJECT_HOME_VERSION = 1

/** Profile pictures that exist in /stage1/assets (see `portraits` in App.tsx). */
export const HOME_AVATARS = ['me', 'tae', 'yu'] as const
export type HomeAvatar = (typeof HOME_AVATARS)[number]

/** Schedule chip styles; each is an existing class in src/modules/project/index.css. */
export const HOME_TASK_KINDS = ['planning', 'revision', 'collecting', 'research', 'extra', 'references', 'slides'] as const
export type HomeTaskKind = (typeof HOME_TASK_KINDS)[number]

export type HomeMember = {
  /** Stable key within this project; `tasks` and `activities` refer to it. */
  id: string
  name: string
  role: string
  avatar: HomeAvatar
}

export type HomeTask = {
  title: string
  done: boolean
  kind: HomeTaskKind
}

/** "{actor}님이 {fileCount}개의 파일을 전달했어요." */
export type HomeActivity = {
  actorId: string
  fileCount: number
  timeLabel: string
}

export type HomeFocus = {
  /** Hero heading, one entry per line. */
  titleLines: string[]
  lastActiveLabel: string
}

export type ProjectHome = {
  version: typeof PROJECT_HOME_VERSION
  focus: HomeFocus
  /** In schedule row order. */
  members: HomeMember[]
  activities: HomeActivity[]
  /** Schedule chips per member id, in display order. Every member has an entry. */
  tasks: { [memberId: string]: HomeTask[] }
}

// ---------------------------------------------------------------- default

const DEFAULT_HOME_SOURCE: ProjectHome = {
  version: PROJECT_HOME_VERSION,
  focus: {
    titleLines: ['AI 서비스 시장의', '현황 분석을 이어서 해요.'],
    lastActiveLabel: '3시간 전 중단',
  },
  members: [
    { id: 'me', name: '나', role: '기획', avatar: 'me' },
    { id: 'tae', name: '태훈', role: '자료조사', avatar: 'tae' },
    { id: 'yu', name: '유진', role: 'PPT', avatar: 'yu' },
  ],
  activities: [{ actorId: 'tae', fileCount: 2, timeLabel: '1시간 전' }],
  tasks: {
    me: [
      { title: '기획안 작성', done: true, kind: 'planning' },
      { title: '기획안 수정', done: false, kind: 'revision' },
    ],
    tae: [
      { title: '자료 수집', done: true, kind: 'collecting' },
      { title: '자료조사', done: false, kind: 'research' },
      { title: '자료 추가 조사', done: false, kind: 'extra' },
    ],
    yu: [
      { title: '레퍼런스 수집', done: true, kind: 'references' },
      { title: 'PPT 제작', done: false, kind: 'slides' },
    ],
  },
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) deepFreeze(child)
    Object.freeze(value)
  }
  return value
}

/** The current project home content. Frozen: use `createHomeTemplate()` for a copy to store or edit. */
export const DEFAULT_PROJECT_HOME: Readonly<ProjectHome> = deepFreeze(DEFAULT_HOME_SOURCE)

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

/** A fresh, independent copy of the default template. */
export function createHomeTemplate(): ProjectHome {
  return copy(DEFAULT_PROJECT_HOME as ProjectHome)
}

/** `ProjectData` holding a fresh template, for `projectStore.createProjectFromSample(id, data)`. */
export function createHomeProjectData(): ProjectData {
  return { home: createHomeTemplate() }
}

// ---------------------------------------------------------------- validation

const LIMITS = { text: 100, lines: 3, members: 50, tasksPerMember: 30, activities: 30, fileCount: 999 } as const
const RESERVED_IDS = new Set(['__proto__', 'constructor', 'prototype'])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const own = (record: object, key: string) => Object.prototype.hasOwnProperty.call(record, key)
const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '' && value.length <= LIMITS.text
const isId = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(value) && !RESERVED_IDS.has(value)
const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (list as readonly string[]).includes(value)
const isArrayOf = (value: unknown, max: number, min = 0): value is unknown[] =>
  Array.isArray(value) && value.length >= min && value.length <= max

function parseFocus(value: unknown): HomeFocus | null {
  if (!isRecord(value)) return null
  const { titleLines, lastActiveLabel } = value
  if (!isArrayOf(titleLines, LIMITS.lines, 1) || !titleLines.every(isText) || !isText(lastActiveLabel)) return null
  return { titleLines: [...titleLines], lastActiveLabel }
}

function parseMember(value: unknown): HomeMember | null {
  if (!isRecord(value)) return null
  const { id, name, role, avatar } = value
  if (!isId(id) || !isText(name) || !isText(role) || !isOneOf(HOME_AVATARS, avatar)) return null
  return { id, name, role, avatar }
}

function parseTask(value: unknown): HomeTask | null {
  if (!isRecord(value)) return null
  const { title, done, kind } = value
  if (!isText(title) || typeof done !== 'boolean' || !isOneOf(HOME_TASK_KINDS, kind)) return null
  return { title, done, kind }
}

function parseActivity(value: unknown): HomeActivity | null {
  if (!isRecord(value)) return null
  const { actorId, fileCount, timeLabel } = value
  if (!isId(actorId) || !isText(timeLabel)) return null
  if (typeof fileCount !== 'number' || !Number.isInteger(fileCount) || fileCount < 1 || fileCount > LIMITS.fileCount) return null
  return { actorId, fileCount, timeLabel }
}

function parseAll<T>(values: unknown[], parse: (value: unknown) => T | null): T[] | null {
  const result: T[] = []
  for (const value of values) {
    const parsed = parse(value)
    if (parsed === null) return null
    result.push(parsed)
  }
  return result
}

/**
 * Valid version-1 home data as a new object (unknown extra fields are left out),
 * or null. All-or-nothing: one bad member, task or activity rejects the whole value.
 */
export function parseProjectHome(value: unknown): ProjectHome | null {
  if (!isRecord(value) || value.version !== PROJECT_HOME_VERSION) return null

  const focus = parseFocus(value.focus)
  if (!focus) return null

  if (!isArrayOf(value.members, LIMITS.members, 1)) return null
  const members = parseAll(value.members, parseMember)
  if (!members) return null
  const ids = new Set(members.map(member => member.id))
  if (ids.size !== members.length) return null

  if (!isArrayOf(value.activities, LIMITS.activities)) return null
  const activities = parseAll(value.activities, parseActivity)
  if (!activities || !activities.every(activity => ids.has(activity.actorId))) return null

  // Exactly one task list per member: no missing members, no unknown ids.
  const rawTasks = value.tasks
  if (!isRecord(rawTasks)) return null
  const taskKeys = Object.keys(rawTasks)
  if (taskKeys.length !== members.length || !taskKeys.every(key => ids.has(key))) return null
  const tasks: ProjectHome['tasks'] = {}
  for (const member of members) {
    if (!own(rawTasks, member.id)) return null
    const list = rawTasks[member.id]
    if (!isArrayOf(list, LIMITS.tasksPerMember)) return null
    const parsed = parseAll(list, parseTask)
    if (!parsed) return null
    tasks[member.id] = parsed
  }

  return { version: PROJECT_HOME_VERSION, focus, members, activities, tasks }
}

/**
 * Home data to show for a project, given its stored data (`getProjectState`).
 * Falls back to a copy of the default template when there is no project data,
 * no `home` key (e.g. `{}`), or `home` is not valid version-1 data. Never writes.
 */
export function readProjectHome(data: ProjectData | null | undefined): ProjectHome {
  const stored = isRecord(data) && own(data, 'home') ? parseProjectHome(data.home) : null
  return stored ?? createHomeTemplate()
}
