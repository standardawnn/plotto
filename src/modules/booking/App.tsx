import { useEffect, useRef, useState } from 'react';

const suggestions = ['새로운 AI 서비스 사례를 찾을 필요가 있음', 'AI 서비스 사례에 대한 이해가 어려움', 'AI 서비스 사례를 해당 자료로 찾아온 이유를 알고싶음'];
const hours = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

function Wheel({ label, items, value, onChange }: { label: string; items: string[]; value: string; onChange: (value: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = items.indexOf(value) * 26;
  }, []);
  return <div className="wheel-column"><span className="wheel-label">{label === '오전·오후' ? '\u00a0' : label}</span><div className="wheel" ref={scrollRef} role="listbox" aria-label={label} onScroll={(event) => {
    const index = Math.max(0, Math.min(items.length - 1, Math.round(event.currentTarget.scrollTop / 26)));
    if (items[index] !== value) onChange(items[index]);
  }}>{items.map((item) => <button key={item} type="button" role="option" aria-selected={item === value} className={item === value ? 'wheel-item selected' : 'wheel-item'} onClick={() => scrollRef.current?.scrollTo({ top: items.indexOf(item) * 26, behavior: 'smooth' })}>{item}</button>)}</div></div>;
}

function Character() {
  return <div className="character" aria-label="물건을 들어 올리며 말풍선을 띄우는 Plotto 캐릭터" role="img">
    <div className="character-layer"><img src="/stage4/assets/aec60.png" alt="" /></div>
  </div>;
}

export default function App() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState('협업 과정에서 쓰이는 AI 서비스 사례를 알고싶음');
  const [editing, setEditing] = useState(false);
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('30');
  const [period, setPeriod] = useState('오후');
  const [sent, setSent] = useState(false);
  const [preparingMessage, setPreparingMessage] = useState(true);
  useEffect(() => {
    if (step !== 2) {
      setPreparingMessage(true);
      return;
    }
    // Keep the writing state visible after the three summary rows appear.
    const timer = window.setTimeout(() => setPreparingMessage(false), 7000);
    return () => window.clearTimeout(timer);
  }, [step]);
  const inputRef = useRef<HTMLInputElement>(null);
  const time = `${period} ${Number(hour)}:${minute}`;
  const selectedMinutes = (Number(hour) % 12 + (period === '오후' ? 12 : 0)) * 60 + Number(minute);
  const isTaehunActiveTime = selectedMinutes >= 19 * 60 + 30 && selectedMinutes <= 20 * 60;
  const titles = [<>공동 세션 주제를<br />알려주세요.</>, <>공동 세션 시간을<br />정해주세요.</>, <>태훈님께 아래 내용으로<br />메세지를 남길게요.</>];
  const message = '태훈아, 나 지금 AI 서비스 시장 현황 정리하다가 궁금한게 생겼는데 이 사례들을 어떤 기준으로 골랐는지 같이 보면서 공동세션으로 얘기하고 싶어! 오늘 7시 반쯤 괜찮아?';
  return <main className={`session-app screen-${step}${step === 2 && preparingMessage ? ' is-message-loading' : ''}`}>
    <header className="hero">
      <button className="back-button" aria-label="이전 화면" onClick={() => { setStep(Math.max(0, step - 1)); setSent(false); }}><img src={step === 2 ? '/stage4/assets/13b25.svg' : '/stage4/assets/7531e.svg'} alt="" /></button>
      <h1 key={step}>{titles[step]}</h1>
      {step !== 2 && <Character key={`character-${step}`} />}
    </header>
    <section className={`panel step-${step}`} key={step} aria-label={['주제 입력', '시간 선택', '메시지 미리보기'][step]}>
      {step === 0 && <div className="topic-content">
        <div className={`topic-field ${editing ? 'editing' : ''}`}>
          <input ref={inputRef} aria-label="협업 과정" value={topic} readOnly={!editing} onChange={(event) => setTopic(event.target.value)} onBlur={() => setEditing(false)} onKeyDown={(event) => { if (event.key === 'Enter') inputRef.current?.blur(); }} />
          <button aria-label="주제 수정" onClick={() => { setEditing(true); requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select(); }); }}><img src="/stage4/assets/9fe7a.svg" alt="" /></button>
        </div>
        <div className="recommendations"><p className="recommendation-label">Plotto 추천 <img src="/stage4/assets/eec1f.svg" alt="" /></p>
          {suggestions.map((suggestion) => <button className="suggestion" key={suggestion} onClick={() => { setTopic(suggestion); setEditing(false); }}>{suggestion}</button>)}
        </div>
      </div>}
      {step === 1 && <div className="time-content">
        <div className="time-card"><img className="clock-character" src="/stage4/assets/33517.png" alt="시계를 들고 있는 Plotto" /><p className="chosen-time" aria-live="polite">{time} {period === '오후' ? 'pm' : 'am'}</p><p className="time-hint" aria-live="polite">{isTaehunActiveTime ? '태훈님이 가장 많이 활동하는 시간대에요.' : '서연님이 원하는 시간대에요.'}</p></div>
        <div className="time-wheels"><Wheel label="시" items={hours} value={hour} onChange={setHour} /><span className="colon">:</span><Wheel label="분" items={minutes} value={minute} onChange={setMinute} /><Wheel label="오전·오후" items={['오전', '오후']} value={period} onChange={setPeriod} /></div>
      </div>}
      {step === 2 && <div className="review-content">
        <dl className="summary"><div className="reveal reveal-one"><dt>주제</dt><dd>{topic}</dd></div><div className="reveal reveal-two"><dt>시간</dt><dd>{time}</dd></div><div className="reveal reveal-three"><dt>내용</dt><dd>실제 사례에 대한 내용이 부족하여 더욱 다양한 자료가 필요함</dd></div></dl>
        {preparingMessage ? <div className="message-loading-stage reveal reveal-four">
          <img className="loading-divider" src="/stage4/assets/03654.svg" alt="" />
          <div className="message-loading" role="status">
            <p>Plotto가 메시지를 작성하고 있어요..</p>
            <div className="writing-character"><img src="/stage4/assets/plotto-typing.gif" alt="" /></div>
          </div>
        </div> : <div className="message-preview reveal"><img className="divider" src="/stage4/assets/918af.svg" alt="" /><p className="message-label">메시지 내용을 미리 볼 수 있어요.</p><div className="message-bubble">{message}<img className="bubble-tail" src="/stage4/assets/7f995.svg" alt="" /></div></div>}
      </div>}
      {!(step === 2 && preparingMessage) && <div className="panel-footer"><button className="primary-button" disabled={step === 0 && !topic.trim() || sent} onClick={() => { if (step < 2) { setStep(step + 1); setEditing(false); } else { setSent(true); window.parent.postMessage({type: 'plotto:navigate', stage: 5, session: {topic, hour, minute, period}}, '*'); } }}>{step < 2 ? '다음' : sent ? '메시지를 보냈어요' : '메세지 보내기'}</button>{sent && <p className="sent-notice" role="status">태훈님께 보낼 메시지가 준비되었어요.</p>}</div>}
    </section>
  </main>;
}
