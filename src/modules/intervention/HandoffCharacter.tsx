// Keep the offering pose intact; animate only the whole image's position and angle.
export default function HandoffCharacter({ active }: { active: boolean }) {
  return (
    <div className={`handoff-character ${active ? "offering" : "waiting"}`} role="img" aria-label="파일을 건네는 AI 도우미">
      <div className="handoff-sprite">
        <img className="handoff-poses" src="/stage2/assets/character-handoff-sheet.png" alt="" />
      </div>
    </div>
  )
}
