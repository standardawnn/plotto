// Plotto handing over a folder (6-pose sprite sheet, 3 x 2 cells).
export default function HandoffCharacter({ active }: { active: boolean }) {
  return (
    <div className={`handoff-character ${active ? 'offering' : 'waiting'}`} role="img" aria-label="파일을 건네는 Plotto">
      <span className="handoff-frames" />
    </div>
  )
}
