/**
 * Project store — data model and persistence for project create / load.
 *
 * - UI-free: no React, no DOM besides the storage adapter. A future DB can
 *   replace the storage by passing another `KeyValueStorage` to
 *   `createProjectStore`, or by re-implementing the `ProjectStore` interface.
 * - Per-project data only. The global `plotto-journey` session state
 *   (src/journey.ts) is intentionally not read or written here.
 * - The onboarding key `plotto-projects` (public/onboarding/launch.js) is read
 *   only. It holds a JSON string array of the selected sample names and is
 *   never overwritten or removed here.
 * - The initial state is the snapshot taken when a project is created. It is
 *   stored apart from the current working state and is never overwritten.
 *
 * Write safety (localStorage has no transactions):
 * - Every write goes through `commit()`: all checks and backups happen before
 *   the first write, and if a later write fails the earlier ones are undone.
 * - Damaged data is copied to `<key>:backup:<hash>` (one key per distinct
 *   content, never overwritten) before it is replaced. If that copy cannot be
 *   made and verified, nothing is overwritten.
 * - Damaged initial snapshots and data with an unknown version are never
 *   overwritten.
 */

// ---------------------------------------------------------------- types

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
/** Free-form per-project working data (JSON only, so it can move to a DB). */
export type ProjectData = { [key: string]: JsonValue };

export type ProjectId = string;
/**
 * What the project was made from.
 * - `sample`: one of the onboarding sample projects
 * - `legacy`: imported from `plotto-projects` by name only, with no matching sample
 * - `custom`: created with user-supplied info
 */
export type ProjectSource = 'sample' | 'legacy' | 'custom';
/**
 * How the project entered the list.
 * - `onboarding`: imported from the onboarding selection (`plotto-projects`)
 * - `user`: created through this store (`createProject` / `createProjectFromSample`)
 * - `unknown`: stored before this field existed and not provably from onboarding
 */
export type ProjectOrigin = 'onboarding' | 'user' | 'unknown';

export interface ProjectInfo {
  name: string;
  /** Number of members; null when unknown. */
  memberCount: number | null;
  /** Start date in the onboarding format `YYYY.MM.DD`; null when unknown. */
  startDate: string | null;
}

export interface Project extends ProjectInfo {
  id: ProjectId;
  source: ProjectSource;
  origin: ProjectOrigin;
  /** Set when the project was created from a sample. Several projects may share it. */
  sampleId: string | null;
  /** ISO 8601 creation time. */
  createdAt: string;
}

export interface SampleProject {
  sampleId: string;
  name: string;
  memberCount: number;
  startDate: string;
}

/** Initial state: what the project looked like when it was created. */
export interface ProjectSnapshot {
  projectId: ProjectId;
  capturedAt: string;
  info: ProjectInfo;
  data: ProjectData;
}

export interface RestoreResult {
  project: Project;
  data: ProjectData;
  /** Which stored parts were rewritten; both false when they already matched the initial state. */
  changed: { state: boolean; meta: boolean };
}

export type StoreError =
  /** No storage is available (e.g. blocked site data). */
  | 'storage-unavailable'
  /** A write failed. Earlier writes of the same operation were undone: nothing changed. */
  | 'write-failed'
  /** A write failed and undoing earlier writes also failed: stored data may be partly changed. */
  | 'rollback-failed'
  /** Damaged data could not be backed up, so it was not overwritten. Nothing changed. */
  | 'backup-failed'
  /** The stored initial snapshots are damaged and are protected from overwriting. Nothing changed. */
  | 'data-damaged'
  /** Stored data has a version this code does not understand; it is not overwritten. Nothing changed. */
  | 'unsupported-version'
  | 'not-found'
  | 'invalid-input'
  | 'already-exists';

export type StoreResult<T> = { ok: true; value: T } | { ok: false; error: StoreError };

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ProjectStoreOptions {
  /** Returns the storage to use, or null when none is available. Default: window.localStorage. */
  storage?: () => KeyValueStorage | null;
  now?: () => Date;
  createId?: () => string;
}

export interface ProjectStore {
  listSampleProjects(): SampleProject[];
  listProjects(): Project[];
  getProject(id: ProjectId): Project | null;
  createProject(info: ProjectInfo, data?: ProjectData): StoreResult<Project>;
  createProjectFromSample(sampleId: string, data?: ProjectData): StoreResult<Project>;
  getCurrentProjectId(): ProjectId | null;
  getCurrentProject(): Project | null;
  setCurrentProjectId(id: ProjectId | null): StoreResult<ProjectId | null>;
  getInitialSnapshot(id: ProjectId): ProjectSnapshot | null;
  saveInitialSnapshot(id: ProjectId, data?: ProjectData): StoreResult<ProjectSnapshot>;
  getProjectState(id: ProjectId): ProjectData | null;
  saveProjectState(id: ProjectId, data: ProjectData): StoreResult<ProjectData>;
  restoreInitialState(id: ProjectId): StoreResult<RestoreResult>;
}

// ---------------------------------------------------------------- constants

export const STORAGE_KEYS = {
  /** Written by public/onboarding/launch.js. Read only. */
  legacyProjects: 'plotto-projects',
  projects: 'plotto-project-list-v1',
  currentProject: 'plotto-current-project-v1',
  snapshots: 'plotto-project-initial-v1',
  states: 'plotto-project-state-v1',
} as const;

/** Same names, member counts and start dates as public/onboarding/launch.js (line 17), in the same order. */
const SAMPLE_PROJECTS: readonly SampleProject[] = [
  { sampleId: 'onboarding-1', name: '마케팅 프로젝트', memberCount: 3, startDate: '2026.01.01' },
  { sampleId: 'onboarding-2', name: '청년 도움 프로젝트', memberCount: 6, startDate: '2025.02.17' },
  { sampleId: 'onboarding-3', name: '자원순환프로젝트', memberCount: 11, startDate: '2026.05.24' },
  { sampleId: 'onboarding-4', name: '아동자립캠프', memberCount: 5, startDate: '2026.07.14' },
  { sampleId: 'onboarding-5', name: '한국어 교육 봉사', memberCount: 2, startDate: '2025.01.01' },
  { sampleId: 'onboarding-6', name: '바롬프로젝트', memberCount: 6, startDate: '2025.07.06' },
];

const LIST_VERSION = 1;
const MAX_BACKUP_SLOTS = 32;

// ---------------------------------------------------------------- validation

const has = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function isJsonValue(value: unknown, depth = 0): value is JsonValue {
  if (depth > 64) return false;
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(item => isJsonValue(item, depth + 1));
  if (isRecord(value)) return Object.values(value).every(item => isJsonValue(item, depth + 1));
  return false;
}

export function isProjectData(value: unknown): value is ProjectData {
  return isRecord(value) && isJsonValue(value);
}

/** `YYYY.MM.DD` that is a real calendar date. */
export function isProjectDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isIsoTime(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isMemberCount(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isInteger(value) && value >= 1);
}

export function isProjectInfo(value: unknown): value is ProjectInfo {
  return (
    isRecord(value) &&
    isNonEmptyString(value.name) &&
    isMemberCount(value.memberCount) &&
    (value.startDate === null || isProjectDate(value.startDate))
  );
}

export function isProject(value: unknown): value is Project {
  return (
    isProjectInfo(value) &&
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    (value.source === 'sample' || value.source === 'legacy' || value.source === 'custom') &&
    (value.origin === 'onboarding' || value.origin === 'user' || value.origin === 'unknown') &&
    (value.sampleId === null || isNonEmptyString(value.sampleId)) &&
    isIsoTime(value.createdAt)
  );
}

export function isProjectSnapshot(value: unknown): value is ProjectSnapshot {
  return (
    isRecord(value) &&
    isNonEmptyString(value.projectId) &&
    isIsoTime(value.capturedAt) &&
    isProjectInfo(value.info) &&
    isProjectData(value.data)
  );
}

// ---------------------------------------------------------------- helpers

function browserLocalStorage(): KeyValueStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null; // Access can throw when site data is blocked.
  }
}

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return `prj_${crypto.randomUUID()}`;
  } catch { /* fall through */ }
  return `prj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Short stable fingerprint of a text (FNV-1a, 32-bit, plus length). Not for security. */
function fingerprint(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${text.length.toString(36)}${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sameJson(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function parseJson(raw: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false };
  }
}

function pickInfo(info: ProjectInfo): ProjectInfo {
  return { name: info.name, memberCount: info.memberCount, startDate: info.startDate };
}

/**
 * A stored entry as read now.
 * - `empty`: key not present
 * - `ok`: fully valid
 * - `damaged`: unreadable or some entries invalid (`value` holds the valid part)
 * - `unsupported`: a version this code does not understand (`value` is empty)
 */
type LoadStatus = 'empty' | 'ok' | 'damaged' | 'unsupported';
type Loaded<T> = { value: T; raw: string | null; status: LoadStatus };
type ListFile = { version: typeof LIST_VERSION; projects: Project[]; legacyImport: string | null };

/** One planned write. `protect`: refuse instead of replacing damaged data. */
type Write = { key: string; value: unknown; loaded: Loaded<unknown>; protect?: boolean };

/**
 * Reads one stored project. Entries saved before `origin` existed get a safe
 * value: name-only imports (`legacy`) can only come from onboarding; anything
 * else is `unknown`.
 */
function readProject(item: unknown): Project | null {
  if (!isRecord(item)) return null;
  const origin = item.origin === undefined ? (item.source === 'legacy' ? 'onboarding' : 'unknown') : item.origin;
  const candidate = { ...item, origin };
  if (!isProject(candidate)) return null;
  return {
    id: candidate.id,
    source: candidate.source,
    origin: candidate.origin,
    sampleId: candidate.sampleId,
    createdAt: candidate.createdAt,
    ...pickInfo(candidate),
  };
}

// ---------------------------------------------------------------- store

export function createProjectStore(options: ProjectStoreOptions = {}): ProjectStore {
  const getStorage = options.storage ?? browserLocalStorage;
  const now = options.now ?? (() => new Date());
  const createId = options.createId ?? randomId;

  // ---- raw storage access (never throws)

  function readRaw(key: string): string | null {
    const storage = getStorage();
    if (!storage) return null;
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeRaw(key: string, value: string): boolean {
    const storage = getStorage();
    if (!storage) return false;
    try {
      storage.setItem(key, value);
      return true;
    } catch {
      return false; // Quota exceeded or storage blocked.
    }
  }

  /** Puts a key back to an earlier raw value (null = the key did not exist). */
  function restoreRaw(key: string, raw: string | null): boolean {
    const storage = getStorage();
    if (!storage) return false;
    try {
      if (raw === null) storage.removeItem(key);
      else storage.setItem(key, raw);
      return storage.getItem(key) === raw;
    } catch {
      return false;
    }
  }

  function failure<T>(error: StoreError): StoreResult<T> {
    return { ok: false, error };
  }

  // ---- backup and transactional write

  /**
   * Keeps `raw` under `<key>:backup:<fingerprint>`. An existing backup with the
   * same content counts as done; a slot holding other content is never
   * overwritten (the next slot is used). The copy is verified by reading it back.
   */
  function backupRaw(key: string, raw: string): boolean {
    const base = `${key}:backup:${fingerprint(raw)}`;
    for (let slot = 0; slot < MAX_BACKUP_SLOTS; slot++) {
      const backupKey = slot === 0 ? base : `${base}-${slot}`;
      const existing = readRaw(backupKey);
      if (existing === raw) return true;
      if (existing !== null) continue;
      return writeRaw(backupKey, raw) && readRaw(backupKey) === raw;
    }
    return false;
  }

  /**
   * Applies writes in order, all or nothing as far as storage allows:
   * 1. refuse unknown versions and protected damaged data (nothing written)
   * 2. back up every damaged value that will be replaced (nothing written yet)
   * 3. write in order; on a failure, undo the earlier writes in reverse order
   * Returns null on success.
   */
  function commit(writes: Write[]): StoreError | null {
    if (!getStorage()) return 'storage-unavailable';
    for (const write of writes) {
      if (write.loaded.status === 'unsupported') return 'unsupported-version';
      if (write.loaded.status === 'damaged' && write.protect) return 'data-damaged';
    }
    for (const write of writes) {
      if (write.loaded.status === 'damaged' && write.loaded.raw !== null && !backupRaw(write.key, write.loaded.raw)) {
        return 'backup-failed';
      }
    }
    const done: Write[] = [];
    for (const write of writes) {
      if (writeRaw(write.key, JSON.stringify(write.value))) {
        done.push(write);
        continue;
      }
      let undone = true;
      for (const previous of done.reverse()) {
        if (!restoreRaw(previous.key, previous.loaded.raw)) undone = false;
      }
      return undone ? 'write-failed' : 'rollback-failed';
    }
    return null;
  }

  // ---- loaders (each entry validated; invalid entries are skipped and flag the data as damaged)

  function loadList(): Loaded<ListFile> {
    const raw = readRaw(STORAGE_KEYS.projects);
    const empty: ListFile = { version: LIST_VERSION, projects: [], legacyImport: null };
    if (raw === null) return { value: empty, raw, status: 'empty' };
    const parsed = parseJson(raw);
    if (!parsed.ok || !isRecord(parsed.value)) return { value: empty, raw, status: 'damaged' };
    const file = parsed.value;
    if (has(file, 'version') && file.version !== LIST_VERSION) return { value: empty, raw, status: 'unsupported' };
    if (!has(file, 'version') || !Array.isArray(file.projects)) return { value: empty, raw, status: 'damaged' };

    const seen = new Set<string>();
    const projects: Project[] = [];
    for (const item of file.projects) {
      const project = readProject(item);
      if (project && !seen.has(project.id)) {
        seen.add(project.id);
        projects.push(project);
      }
    }
    const legacyValid = file.legacyImport === undefined || file.legacyImport === null || typeof file.legacyImport === 'string';
    const legacyImport = typeof file.legacyImport === 'string' ? file.legacyImport : null;
    const status: LoadStatus = projects.length === file.projects.length && legacyValid ? 'ok' : 'damaged';
    return { value: { version: LIST_VERSION, projects, legacyImport }, raw, status };
  }

  function loadMap<T>(key: string, isValid: (value: unknown, id: string) => boolean): Loaded<Record<string, T>> {
    const raw = readRaw(key);
    const map: Record<string, T> = Object.create(null);
    if (raw === null) return { value: map, raw, status: 'empty' };
    const parsed = parseJson(raw);
    if (!parsed.ok || !isRecord(parsed.value)) return { value: map, raw, status: 'damaged' };
    let status: LoadStatus = 'ok';
    for (const id of Object.keys(parsed.value)) {
      const item = parsed.value[id];
      if (isValid(item, id)) map[id] = item as T;
      else status = 'damaged';
    }
    return { value: map, raw, status };
  }

  const loadSnapshots = () =>
    loadMap<ProjectSnapshot>(STORAGE_KEYS.snapshots, (value, id) => isProjectSnapshot(value) && value.projectId === id);
  const loadStates = () => loadMap<ProjectData>(STORAGE_KEYS.states, value => isProjectData(value));

  // ---- building blocks

  function randomProjectId(existing: Project[]): ProjectId {
    for (let attempt = 0; attempt < 10; attempt++) {
      const id = createId();
      if (isNonEmptyString(id) && !existing.some(project => project.id === id)) return id;
    }
    return randomId();
  }

  /**
   * Stable id for an onboarding import, so a failed and retried import reuses
   * the same id instead of leaving a new orphan snapshot each time.
   */
  function onboardingProjectId(key: string, existing: Project[]): ProjectId {
    const base = `prj_onboarding_${key}`;
    let id = base;
    for (let n = 2; existing.some(project => project.id === id); n++) id = `${base}_${n}`;
    return id;
  }

  function buildSnapshot(project: Project, data: ProjectData): ProjectSnapshot {
    return { projectId: project.id, capturedAt: project.createdAt, info: pickInfo(project), data: clone(data) };
  }

  /** `plotto-projects` as written by onboarding: a JSON array of names. Anything else is ignored. */
  function readLegacyNames(): { raw: string; names: string[] } | null {
    const raw = readRaw(STORAGE_KEYS.legacyProjects);
    if (raw === null) return null;
    const parsed = parseJson(raw);
    if (!parsed.ok || !Array.isArray(parsed.value) || !parsed.value.every(name => typeof name === 'string')) return null;
    const names = Array.from(new Set((parsed.value as string[]).map(name => name.trim()).filter(Boolean)));
    return { raw, names };
  }

  /**
   * Current list, including projects selected during onboarding.
   *
   * Each time `plotto-projects` changes, names not yet imported are added. Only
   * onboarding imports count here (and `unknown` entries, which may be one), so
   * a project the user created from the same sample does not block the import.
   * Known sample names take that sample's data; any other name keeps only the
   * name (member count and start date stay null). Nothing is removed, and
   * `plotto-projects` itself is not modified.
   *
   * The new projects are returned only when they and their snapshots were
   * saved. On failure the stored list is returned unchanged.
   */
  function loadProjects(): Loaded<ListFile> {
    const loaded = loadList();
    if (loaded.status === 'unsupported') return loaded;
    const legacy = readLegacyNames();
    if (!legacy || legacy.raw === loaded.value.legacyImport) return loaded;

    const projects = [...loaded.value.projects];
    const added: Project[] = [];
    const mayBeImport = (project: Project) => project.origin === 'onboarding' || project.origin === 'unknown';
    for (const name of legacy.names) {
      const sample = SAMPLE_PROJECTS.find(item => item.name === name);
      const imported = sample
        ? projects.some(project => mayBeImport(project) && project.sampleId === sample.sampleId)
        : projects.some(project => mayBeImport(project) && project.source === 'legacy' && project.name === name);
      if (imported) continue;
      const info: ProjectInfo = sample ? pickInfo(sample) : { name, memberCount: null, startDate: null };
      const project: Project = {
        id: onboardingProjectId(sample ? sample.sampleId : `name-${fingerprint(name)}`, projects),
        source: sample ? 'sample' : 'legacy',
        origin: 'onboarding',
        sampleId: sample ? sample.sampleId : null,
        createdAt: now().toISOString(),
        ...info,
      };
      projects.push(project);
      added.push(project);
    }

    const value: ListFile = { version: LIST_VERSION, projects, legacyImport: legacy.raw };
    const writes: Write[] = [];
    if (added.length) {
      const snapshots = loadSnapshots();
      // A snapshot left by an earlier failed attempt has the same id and is kept as is.
      const missing = added.filter(project => !has(snapshots.value, project.id));
      if (missing.length) {
        const next = Object.assign(Object.create(null), snapshots.value) as Record<string, ProjectSnapshot>;
        for (const project of missing) next[project.id] = buildSnapshot(project, {});
        writes.push({ key: STORAGE_KEYS.snapshots, value: next, loaded: snapshots, protect: true });
      }
    }
    writes.push({ key: STORAGE_KEYS.projects, value, loaded });
    if (commit(writes) !== null) return loaded;
    return { value, raw: JSON.stringify(value), status: 'ok' };
  }

  /** Adds a user-created project together with its initial snapshot. */
  function insertProject(info: ProjectInfo, source: ProjectSource, sampleId: string | null, data: ProjectData): StoreResult<Project> {
    if (!getStorage()) return failure('storage-unavailable');
    const list = loadProjects();
    if (list.status === 'unsupported') return failure('unsupported-version');
    const project: Project = {
      id: randomProjectId(list.value.projects),
      source,
      origin: 'user',
      sampleId,
      createdAt: now().toISOString(),
      ...pickInfo(info),
    };
    const snapshots = loadSnapshots();
    const nextSnapshots = Object.assign(Object.create(null), snapshots.value) as Record<string, ProjectSnapshot>;
    nextSnapshots[project.id] = buildSnapshot(project, data);
    const error = commit([
      { key: STORAGE_KEYS.snapshots, value: nextSnapshots, loaded: snapshots, protect: true },
      { key: STORAGE_KEYS.projects, value: { ...list.value, projects: [...list.value.projects, project] }, loaded: list },
    ]);
    return error ? failure(error) : { ok: true, value: clone(project) };
  }

  function findProject(id: ProjectId): Project | undefined {
    return loadProjects().value.projects.find(project => project.id === id);
  }

  // ---- public API (plain closures, no `this`: methods may be destructured)

  const store: ProjectStore = {
    /** The six onboarding sample projects, unchanged. */
    listSampleProjects() {
      return SAMPLE_PROJECTS.map(sample => ({ ...sample }));
    },

    listProjects() {
      return clone(loadProjects().value.projects);
    },

    getProject(id) {
      const project = findProject(id);
      return project ? clone(project) : null;
    },

    /** Creates a custom project and stores its initial snapshot. */
    createProject(info, data = {}) {
      if (!isProjectInfo(info) || !isProjectData(data)) return failure('invalid-input');
      return insertProject({ ...pickInfo(info), name: info.name.trim() }, 'custom', null, data);
    },

    /** Creates a new, independent project from a sample. The same sample may be used any number of times. */
    createProjectFromSample(sampleId, data = {}) {
      const sample = SAMPLE_PROJECTS.find(item => item.sampleId === sampleId);
      if (!sample) return failure('not-found');
      if (!isProjectData(data)) return failure('invalid-input');
      return insertProject(sample, 'sample', sample.sampleId, data);
    },

    /** The saved current project id, or null when none is saved or it no longer exists. */
    getCurrentProjectId() {
      const id = readRaw(STORAGE_KEYS.currentProject);
      return id && findProject(id) ? id : null;
    },

    getCurrentProject() {
      const id = readRaw(STORAGE_KEYS.currentProject);
      const project = id ? findProject(id) : undefined;
      return project ? clone(project) : null;
    },

    /** Saves the current project id; null clears it. */
    setCurrentProjectId(id) {
      const storage = getStorage();
      if (!storage) return failure('storage-unavailable');
      if (id === null) {
        try {
          storage.removeItem(STORAGE_KEYS.currentProject);
          return { ok: true, value: null };
        } catch {
          return failure('write-failed');
        }
      }
      if (!findProject(id)) return failure('not-found');
      return writeRaw(STORAGE_KEYS.currentProject, id) ? { ok: true, value: id } : failure('write-failed');
    },

    getInitialSnapshot(id) {
      const snapshots = loadSnapshots().value;
      return has(snapshots, id) ? clone(snapshots[id]) : null;
    },

    /**
     * Stores the initial snapshot for a project that has none (normally done by
     * create). An existing initial state is never replaced: 'already-exists'.
     */
    saveInitialSnapshot(id, data = {}) {
      if (!isProjectData(data)) return failure('invalid-input');
      const project = findProject(id);
      if (!project) return failure('not-found');
      const snapshots = loadSnapshots();
      if (has(snapshots.value, id)) return failure('already-exists');
      const snapshot = buildSnapshot(project, data);
      const next = Object.assign(Object.create(null), snapshots.value) as Record<string, ProjectSnapshot>;
      next[id] = snapshot;
      const error = commit([{ key: STORAGE_KEYS.snapshots, value: next, loaded: snapshots, protect: true }]);
      return error ? failure(error) : { ok: true, value: clone(snapshot) };
    },

    /** Current working data; until something is saved it equals the initial snapshot's data. */
    getProjectState(id) {
      if (!findProject(id)) return null;
      const states = loadStates().value;
      if (has(states, id)) return clone(states[id]);
      const snapshots = loadSnapshots().value;
      return has(snapshots, id) ? clone(snapshots[id].data) : null;
    },

    saveProjectState(id, data) {
      if (!isProjectData(data)) return failure('invalid-input');
      if (!findProject(id)) return failure('not-found');
      const states = loadStates();
      const next = Object.assign(Object.create(null), states.value) as Record<string, ProjectData>;
      next[id] = clone(data);
      const error = commit([{ key: STORAGE_KEYS.states, value: next, loaded: states }]);
      return error ? failure(error) : { ok: true, value: clone(data) };
    },

    /**
     * Resets the working data and the project's name, member count and start
     * date to the initial snapshot.
     *
     * Only parts that differ are written (working data first, then the list).
     * Both previous values are kept, and if the second write fails the first is
     * put back: the result is then 'write-failed' and nothing changed, or
     * 'rollback-failed' when putting it back also failed.
     */
    restoreInitialState(id) {
      if (!getStorage()) return failure('storage-unavailable');
      const list = loadProjects();
      if (list.status === 'unsupported') return failure('unsupported-version');
      const index = list.value.projects.findIndex(project => project.id === id);
      if (index < 0) return failure('not-found');
      const snapshots = loadSnapshots();
      if (!has(snapshots.value, id)) return failure(snapshots.status === 'damaged' ? 'data-damaged' : 'not-found');
      const snapshot = snapshots.value[id];

      // No stored working data means the working data already equals the initial data.
      const states = loadStates();
      const stateChanged = has(states.value, id) && !sameJson(states.value[id], snapshot.data);
      const current = list.value.projects[index];
      const metaChanged = !sameJson(pickInfo(current), pickInfo(snapshot.info));
      const project: Project = { ...current, ...pickInfo(snapshot.info) };

      const writes: Write[] = [];
      if (stateChanged) {
        const next = Object.assign(Object.create(null), states.value) as Record<string, ProjectData>;
        next[id] = clone(snapshot.data);
        writes.push({ key: STORAGE_KEYS.states, value: next, loaded: states });
      }
      if (metaChanged) {
        const projects = list.value.projects.map((item, i) => (i === index ? project : item));
        writes.push({ key: STORAGE_KEYS.projects, value: { ...list.value, projects }, loaded: list });
      }
      const error = writes.length ? commit(writes) : null;
      if (error) return failure(error);
      return {
        ok: true,
        value: { project: clone(project), data: clone(snapshot.data), changed: { state: stateChanged, meta: metaChanged } },
      };
    },
  };
  return store;
}

/** Shared browser instance (localStorage). */
export const projectStore: ProjectStore = createProjectStore();
