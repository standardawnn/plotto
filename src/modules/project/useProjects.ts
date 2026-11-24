import { useState } from 'react'
import { projectStore, type Project, type ProjectInfo, type StoreError } from '../../projectStore'
import { createHomeProjectData, readProjectHome, type ProjectHome } from './projectHomeData'

/** Outcome of a picker action: the opened project, or a message for the user. */
export type ActionResult = { ok: true; project: Project } | { ok: false; message: string }

export function storeErrorMessage(error: StoreError): string {
  switch (error) {
    case 'storage-unavailable': return '브라우저 저장소를 사용할 수 없어 저장하지 못했어요.'
    case 'write-failed': return '저장 공간이 부족해 저장하지 못했어요. 기존 프로젝트는 그대로예요.'
    case 'rollback-failed': return '저장 중 문제가 생겼어요. 새로고침한 뒤 프로젝트 목록을 확인해 주세요.'
    case 'backup-failed':
    case 'data-damaged':
    case 'unsupported-version': return '저장된 프로젝트 데이터를 안전하게 바꿀 수 없어 저장하지 않았어요.'
    case 'not-found': return '프로젝트를 찾을 수 없어요. 목록을 다시 확인해 주세요.'
    case 'invalid-input': return '입력한 내용을 확인해 주세요.'
    case 'already-exists': return '이미 저장된 정보예요.'
  }
}

/**
 * Home data to show for `project`: its stored `home` data, or the default template when
 * there is no project, no data ({}), or the data is not valid. Read-only: never writes back.
 */
function homeOf(project: Project | null): ProjectHome {
  return readProjectHome(project ? projectStore.getProjectState(project.id) : null)
}

/**
 * Project list, current project and its home data for the project home, backed by projectStore.
 * React state mirrors the store; it is re-read from the store after every successful write.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => projectStore.listProjects())
  const [current, setCurrent] = useState<Project | null>(() => projectStore.getCurrentProject())
  const [home, setHome] = useState<ProjectHome>(() => homeOf(projectStore.getCurrentProject()))

  function sync() {
    const next = projectStore.getCurrentProject()
    setProjects(projectStore.listProjects())
    setCurrent(next)
    setHome(homeOf(next))
  }

  /** Makes `id` the current project. State changes only when the store accepted it. */
  function select(id: string): ActionResult {
    const result = projectStore.setCurrentProjectId(id)
    if (!result.ok) return { ok: false, message: storeErrorMessage(result.error) }
    sync()
    const project = projectStore.getProject(id)
    return project ? { ok: true, project } : { ok: false, message: storeErrorMessage('not-found') }
  }

  /** After a successful create: refresh the list, then open the new project. */
  function openCreated(created: ReturnType<typeof projectStore.createProject>): ActionResult {
    if (!created.ok) return { ok: false, message: storeErrorMessage(created.error) }
    setProjects(projectStore.listProjects())
    const selected = select(created.value.id)
    return selected.ok
      ? selected
      : { ok: false, message: `프로젝트는 만들었지만 열지 못했어요. ${selected.message}` }
  }

  return {
    projects,
    current,
    home,
    samples: projectStore.listSampleProjects(),
    select,
    // Sample projects start with their own copy of the default home data (stored as the initial snapshot).
    createFromSample: (sampleId: string) => openCreated(projectStore.createProjectFromSample(sampleId, createHomeProjectData())),
    create: (info: ProjectInfo) => openCreated(projectStore.createProject(info)),
  }
}
