import { useEffect, useRef, useState, type ComponentType } from 'react'
import SessionAlertScreen from './screens/SessionAlertScreen'
import SessionRoom from './SessionRoom'

const assetPathPrefix = '/assets/intervention'
const imgCharacter = `${assetPathPrefix}/aec60.png`
const imgClockCharacter = `${assetPathPrefix}/33517.png`
const imgChevronLeft = `${assetPathPrefix}/6d599.svg`
const imgEdit = `${assetPathPrefix}/e03eb.svg`
const imgSparkle = `${assetPathPrefix}/bcd3c.svg`
const imgDivider = `${assetPathPrefix}/3457d.svg`
const imgBubbleTail = `${assetPathPrefix}/e8afb.svg`

const DEFAULT_TOPIC = '협업 과정에서 쓰이는 AI 서비스 사례를 알고싶음'
const SUGGESTIONS = [
  '새로운 AI 서비스 사례를 찾을 필요가 있음',
  'AI 서비스 사례에 대한 이해가 어려움',
  'AI 서비스 사례를 해당 자료로 찾아온 이유를 알고싶음',
]
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']
const MERIDIEMS = ['오전', '오후']

type Step = 'topic' | 'time' | 'message' | 'alert' | 'room'

// Static follow-up screens: tap targets and auto-advance in the 402×874 canvas
const followUps: Partial<Record<Step, { Screen: ComponentType; next?: Step; tap?: [number, number, number, number]; after?: number }>> = {
  alert: { Screen: SessionAlertScreen, next: 'room', tap: [68, 525, 260, 46] },
}

const backdrop =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 402 874' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.6634e-13 -40.55 23.472 4.8761e-13 201 405.5)'><stop stop-color='rgba(99,91,255,0.3)' offset='0.014423'/><stop stop-color='rgba(160,144,248,0.65)' offset='0.11538'/><stop stop-color='rgba(220,196,242,1)' offset='0.21635'/><stop stop-color='rgba(211,209,255,1)' offset='0.3125'/><stop stop-color='rgba(245,246,249,1)' offset='1'/></radialGradient></defs></svg>\")"

function useCanvasScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 402, window.innerHeight / 874))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return scale
}

function BackHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute flex items-center left-0 px-[20px] py-[12px] top-[62px] w-[402px]">
      <button type="button" aria-label="뒤로 가기" onClick={onBack} className="booking-back relative size-[24px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
      </button>
    </div>
  )
}

function Title({ lines }: { lines: [string, string] }) {
  return (
    <div className="absolute font-['Pretendard:SemiBold'] leading-[0] left-[calc(50%-174px)] not-italic text-[22px] text-black top-[110px] tracking-[-0.4268px] whitespace-nowrap">
      <p className="leading-[1.364] mb-0">{lines[0]}</p>
      <p className="leading-[1.364]">{lines[1]}</p>
    </div>
  )
}

// Character lifts the board it holds while the "?" bubble pops out; split into two clipped layers so nothing boxy shows
function Character() {
  const crop = <img alt="" className="absolute h-[206.04%] left-[-147.85%] max-w-none top-[-108.86%] w-[264.83%]" src={imgCharacter} />
  return (
    <div className="booking-character absolute h-[114px] left-[27px] top-[193px] w-[133px]" role="img" aria-label="질문이 있는 플로토 캐릭터">
      <div className="booking-character-body absolute inset-0">{crop}</div>
      <div className="booking-character-bubble absolute inset-0">{crop}</div>
    </div>
  )
}

function Sheet({ children, top = 323 }: { children: React.ReactNode; top?: number }) {
  return (
    <div className="absolute bg-white h-[551px] left-0 overflow-clip rounded-tl-[24px] rounded-tr-[24px] w-[402px]" style={{ top }}>
      {children}
    </div>
  )
}

function PrimaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="booking-primary absolute bg-[#607af9] flex h-[54px] items-center justify-center left-[20px] px-[20px] py-[16px] rounded-[14px] top-[453px] w-[362px]">
      <span className="font-['Pretendard:SemiBold'] leading-[1.412] text-[17px] text-white whitespace-nowrap">{label}</span>
    </button>
  )
}

function Wheel({ items, value, onChange, label, width }: { items: string[]; value: string; onChange: (v: string) => void; label: string; width: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const ROW = 24
  const index = items.indexOf(value)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = index * ROW
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = () => {
    if (!ref.current) return
    const next = items[Math.max(0, Math.min(items.length - 1, Math.round(ref.current.scrollTop / ROW)))]
    if (next !== value) onChange(next)
  }

  return (
    <div className="bg-white border border-[#e1e7f2] border-solid h-[97px] overflow-clip relative rounded-[12px] shrink-0" style={{ width }}>
      <div ref={ref} onScroll={handleScroll} role="listbox" aria-label={label} tabIndex={0} className="booking-wheel absolute inset-x-0 top-[12px] h-[72px] overflow-y-scroll">
        <div style={{ height: ROW }} />
        {items.map(item => {
          const selected = item === value
          return (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => ref.current?.scrollTo({ top: items.indexOf(item) * ROW, behavior: 'smooth' })}
              className={`booking-wheel-item flex items-center justify-center w-full not-italic whitespace-nowrap ${
                selected ? "font-['Pretendard:Bold'] leading-[1.5] text-[#111827] text-[16px] tracking-[0.0912px]" : "font-['Pretendard:Regular'] leading-[1.429] text-[#9ca3af] text-[14px] tracking-[0.203px]"
              }`}
              style={{ height: ROW }}
            >
              {item}
            </button>
          )
        })}
        <div style={{ height: ROW }} />
      </div>
    </div>
  )
}

function TopicStep({ topic, setTopic, onBack, onNext }: { topic: string; setTopic: (t: string) => void; onBack: () => void; onNext: () => void }) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus({ preventScroll: true })
  }, [editing])

  return (
    <>
      <BackHeader onBack={onBack} />
      <Title lines={['공동 세션 주제를 ', '알려주세요.']} />
      <Character />
      <Sheet>
        <div className={`-translate-x-1/2 absolute bg-white border border-solid flex gap-[8px] items-center justify-between left-1/2 p-[16px] rounded-[16px] top-[31px] w-[362px] ${editing ? 'border-[#607af9]' : 'border-[#d8e0ff]'}`}>
          {editing ? (
            <input
              ref={inputRef}
              aria-label="공동 세션 주제"
              value={topic}
              onChange={event => setTopic(event.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={event => event.key === 'Enter' && setEditing(false)}
              className="flex-1 min-w-0 bg-transparent outline-none font-['Pretendard:Medium'] leading-[1.467] text-[15px] text-black tracking-[0.144px]"
            />
          ) : (
            <p key={topic} className="booking-topic-text flex-1 min-w-0 truncate font-['Pretendard:Medium'] leading-[1.467] not-italic text-[15px] text-black tracking-[0.144px]">{topic}</p>
          )}
          <button type="button" aria-label="주제 수정" onMouseDown={event => event.preventDefault()} onClick={() => setEditing(value => !value)} className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEdit} />
          </button>
        </div>
        <p className="-translate-x-1/2 absolute font-['Pretendard:SemiBold'] leading-[1.429] left-[57px] not-italic text-[#6967ff] text-[14px] text-center top-[116px] tracking-[0.203px] whitespace-nowrap">Plotto 추천</p>
        <div className="absolute left-[97px] size-[16px] top-[116px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSparkle} />
        </div>
        {SUGGESTIONS.map((suggestion, i) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => { setTopic(suggestion); setEditing(false) }}
            className={`booking-chip absolute bg-[#ebefff] border-2 border-solid flex items-center left-[24px] px-[16px] py-[12px] rounded-[30px] ${topic === suggestion ? 'border-[#9693ff]' : 'border-[#d7d6ff]'}`}
            style={{ top: 147 + i * 56 }}
          >
            <span className={`leading-[1.429] not-italic text-[14px] tracking-[0.203px] whitespace-nowrap ${i === 0 ? "font-['Pretendard:Regular'] text-black" : "font-['Pretendard:Medium'] text-[#3f4450]"}`}>{suggestion}</span>
          </button>
        ))}
        <PrimaryButton label="다음" onClick={onNext} />
      </Sheet>
    </>
  )
}

function TimeStep({ time, setTime, onBack, onNext }: { time: Time; setTime: (t: Time) => void; onBack: () => void; onNext: () => void }) {
  return (
    <>
      <BackHeader onBack={onBack} />
      <Title lines={['공동 세션 시간을', '정해주세요. ']} />
      <Character />
      <Sheet top={322}>
        <div className="absolute bg-[#eef2fb] flex flex-col gap-[14px] items-center left-[52px] not-italic overflow-clip p-[20px] rounded-[20px] top-[82px] w-[298px] whitespace-nowrap">
          <p key={formatTime(time, true)} className="booking-time-text font-['Pretendard:SemiBold'] leading-[1.364] text-[#2518bb] text-[22px] text-center tracking-[-0.4268px]" aria-live="polite">
            {formatTime(time, true)}
          </p>
          <p className="font-['Pretendard:Regular'] leading-[1.429] text-[#708097] text-[14px] tracking-[0.203px]">태훈님이 가장 많이 활동하는 시간대에요.</p>
        </div>
        <div className="booking-clock absolute left-[165px] size-[60px] top-[32px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgClockCharacter} />
        </div>
        <div className="absolute h-[110px] left-[29px] top-[240px] w-[344px]">
          <p className="absolute font-['Pretendard:Regular'] leading-[1.429] left-[42px] not-italic text-[#6b7280] text-[14px] top-0 tracking-[0.203px] whitespace-nowrap">시</p>
          <p className="absolute font-['Pretendard:Regular'] leading-[1.429] left-[178px] not-italic text-[#6b7280] text-[14px] top-0 tracking-[0.203px] whitespace-nowrap">분</p>
          <div className="absolute flex gap-[20px] items-center left-0 top-[31px]">
            <Wheel label="시" width={93} items={HOURS} value={time.hour} onChange={hour => setTime({ ...time, hour })} />
            <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic text-[#525966] text-[24px] whitespace-nowrap">:</p>
            <Wheel label="분" width={92} items={MINUTES} value={time.minute} onChange={minute => setTime({ ...time, minute })} />
            <Wheel label="오전 오후" width={92} items={MERIDIEMS} value={time.meridiem} onChange={meridiem => setTime({ ...time, meridiem })} />
          </div>
        </div>
        <PrimaryButton label="다음" onClick={onNext} />
      </Sheet>
    </>
  )
}

function MessageStep({ topic, time, onBack, onNext }: { topic: string; time: Time; onBack: () => void; onNext: () => void }) {
  const rows: [string, React.ReactNode][] = [
    ['주제', topic],
    ['시간', formatTime(time, false)],
    ['내용', <>실제 사례에 대한 내용이 부족하여 더욱 다양한<br aria-hidden />자료가 필요함</>],
  ]
  return (
    <>
      <BackHeader onBack={onBack} />
      <Title lines={['태훈님께 아래 내용으로', '메세지를 남길게요.']} />
      <Character />
      <Sheet>
        <div className="absolute flex flex-col gap-[16px] items-start left-[24px] not-italic top-[37px] w-[344px]">
          {rows.map(([label, value], i) => (
            <div key={label} className="booking-reveal flex gap-[10px] items-start w-full" style={{ animationDelay: `${0.25 + i * 0.4}s` }}>
              <p className="font-['Pretendard:SemiBold'] leading-[1.412] shrink-0 text-[17px] text-black whitespace-nowrap">{label}</p>
              <p className="font-['Pretendard:Regular'] leading-[1.5] text-[#3f4450] text-[16px] tracking-[0.0912px]">{value}</p>
            </div>
          ))}
        </div>
        <div className="booking-reveal -translate-x-1/2 absolute h-0 left-1/2 top-[184px] w-[360px]" style={{ animationDelay: '1.45s' }}>
          <div className="absolute inset-[-0.5px_0]">
            <img alt="" className="block max-w-none size-full" src={imgDivider} />
          </div>
        </div>
        <p className="booking-reveal absolute font-['Pretendard:Medium'] leading-[1.429] left-[24px] not-italic text-[#6967ff] text-[14px] top-[203px] tracking-[0.203px] whitespace-nowrap" style={{ animationDelay: '1.6s' }}>
          메시지 내용을 미리 볼 수 있어요.
        </p>
        <div className="booking-bubble absolute left-[23px] top-[235px] w-[357px]">
          <div className="bg-[#ebefff] flex items-center justify-center overflow-clip px-[20px] py-[12px] rounded-[16px] w-[357px]">
            <div className="flex-1 font-['Pretendard:Regular'] min-w-px not-italic text-[15px] text-black tracking-[0.144px] whitespace-pre-wrap">
              <p className="leading-[1.6] mb-0">{`태훈아, 나 지금 AI 서비스 시장 현황 정리하다가 `}</p>
              <p className="leading-[1.6] mb-0">{`궁금한게 생겼는데 이 사례들을 어떤 기준으로 `}</p>
              <p className="leading-[1.6]">
                골랐는지 같이 보면서 공동세션으로 얘기하고 싶어!
                <br aria-hidden />
                오늘 7시 반쯤 괜찮아?
              </p>
            </div>
          </div>
          <div className="absolute h-[16.5px] left-[312px] top-[119px] w-[19.999px]">
            <div className="absolute inset-[0_2.37%_2.98%_0]">
              <img alt="" className="block max-w-none size-full" src={imgBubbleTail} />
            </div>
          </div>
        </div>
        <PrimaryButton label="메세지 보내기" onClick={onNext} />
      </Sheet>
    </>
  )
}

type Time = { hour: string; minute: string; meridiem: string }

function formatTime({ hour, minute, meridiem }: Time, withSuffix: boolean) {
  const base = `${meridiem} ${Number(hour)}:${minute}`
  return withSuffix ? `${base} ${meridiem === '오전' ? 'am' : 'pm'}` : base
}

export default function SessionBooking({ onExit }: { onExit: () => void }) {
  const scale = useCanvasScale()
  const [step, setStep] = useState<Step>('topic')
  const [topic, setTopic] = useState(DEFAULT_TOPIC)
  const [time, setTime] = useState<Time>({ hour: '07', minute: '30', meridiem: '오후' })
  const followUp = followUps[step]

  useEffect(() => {
    if (!followUp?.after || !followUp.next) return
    const timer = window.setTimeout(() => setStep(followUp.next!), followUp.after)
    return () => window.clearTimeout(timer)
  }, [step, followUp])

  const formStep = !followUp && step !== 'room'

  return (
    <main className="prelude booking" style={formStep ? { backgroundImage: backdrop, backgroundSize: '100% 100%' } : undefined} aria-label="공동세션 예약">
      <div className="prelude-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div key={step} className="prelude-screen">
          {step === 'topic' && <TopicStep topic={topic} setTopic={setTopic} onBack={onExit} onNext={() => setStep('time')} />}
          {step === 'time' && <TimeStep time={time} setTime={setTime} onBack={() => setStep('topic')} onNext={() => setStep('message')} />}
          {step === 'message' && <MessageStep topic={topic} time={time} onBack={() => setStep('time')} onNext={() => setStep('alert')} />}
          {step === 'room' && <SessionRoom onExit={() => setStep('alert')} />}
          {followUp && (
            <>
              <followUp.Screen />
              {followUp.tap && followUp.next && (
                <button
                  type="button"
                  className="prelude-hotspot"
                  aria-label="공동세션 하러가기"
                  style={{ left: followUp.tap[0], top: followUp.tap[1], width: followUp.tap[2], height: followUp.tap[3] }}
                  onClick={() => setStep(followUp.next!)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
