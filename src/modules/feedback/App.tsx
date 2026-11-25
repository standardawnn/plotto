import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { mmdd } from '../../today';
import OpinionReview from './OpinionReview';
import { useDemo } from '../../demo/useDemo';
const assetPathPrefix = "/assets/screen2";
const imgSend = `${assetPathPrefix}/c578c.svg`;
const imgSendActive = `${assetPathPrefix}/f5a38.svg`;
const imgFrame = `${assetPathPrefix}/8b917.svg`;
const imgImage3496 = `${assetPathPrefix}/b021f.png`;
const imgSubtract = `${assetPathPrefix}/374fd.png`;
const imgVector = `${assetPathPrefix}/e8991.svg`;
const imgVector1 = `${assetPathPrefix}/c1514.svg`;
const imgVector2 = `${assetPathPrefix}/6a4db.svg`;
const imgVector24686 = `${assetPathPrefix}/beff5.svg`;
const imgVector3 = `${assetPathPrefix}/fef8c.svg`;
const imgVector4 = `${assetPathPrefix}/ca82b.svg`;
const imgVector5 = `${assetPathPrefix}/55493.svg`;
const imgVector6 = `${assetPathPrefix}/7ebad.svg`;
const imgVector7 = `${assetPathPrefix}/701fc.svg`;
const imgFrame5 = `${assetPathPrefix}/b4207.svg`;
const imgRatio = `${assetPathPrefix}/dba22.svg`;
const imgIconNormalChevronLeft = `${assetPathPrefix}/c3070.svg`;
const imgIOsIconShift = `${assetPathPrefix}/50858.svg`;
const imgIOsIconDelete = `${assetPathPrefix}/733f8.svg`;
const imgIOsIconNumber = `${assetPathPrefix}/64621.svg`;
const imgIOsIconEmojis = `${assetPathPrefix}/40e2f.svg`;
const imgIOsIconEnter = `${assetPathPrefix}/cd96e.svg`;
const imgIOsIconGlobal = `${assetPathPrefix}/71837.svg`;
const imgIOsIconMic = `${assetPathPrefix}/7cd27.svg`;
const imgAttachFile = `${assetPathPrefix}/a80d7.svg`;
const imgAttachedDocument = `${assetPathPrefix}/55356.svg`;
const imgAttachedFold = `${assetPathPrefix}/d26ca.svg`;
const opinionExample = '경쟁 서비스의 차이가 잘 보이는 문서와 이미지를 첨부하면 좋을 거 같아. 한번 찾아봐 주면 좋겠어.';


export default function App() {
  // 의견 예시는 시나리오의 feedbackInput(서연의 의견)을 쓴다. 불러오기 전에는 기존 문구.
  const demo = useDemo();
  const example = demo.status === 'ready' && demo.s.feedbackInput ? demo.s.feedbackInput.text : opinionExample;
  const [open, setOpen] = useState(false);
  const [selectedFile,setSelectedFile]=useState<string|null>(null);
  const [ready, setReady] = useState(false);
  const [text, setText] = useState('');
  const [attached, setAttached] = useState(false);
  const [typing, setTyping] = useState(false);
  const [exampleStarted, setExampleStarted] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const isSendActive = text.trim().length > 0 && !typing;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const showComposer = () => { setReady(false); setOpen(true); };
  const close = () => { setTyping(false); setOpen(false); setReady(false); };
  const previewOpinion = () => {
    close();
    setReviewing(true);
  };
  const startExample = () => {
    if (exampleStarted || text) return;
    setAttached(true);
    setExampleStarted(true);
    setTyping(true);
  };
  useEffect(() => {
    if (!typing || !open) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(example);
      setTyping(false);
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setText(example.slice(0, index));
      if (index >= example.length) {
        window.clearInterval(timer);
        setTyping(false);
      }
    }, 65);
    return () => window.clearInterval(timer);
  }, [typing, open, example]);
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = '0px';
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    if (typing) inputRef.current.setSelectionRange(text.length, text.length);
  }, [text, ready]);
  useEffect(() => { if (ready) inputRef.current?.focus({ preventScroll: true }); }, [ready]);
  useEffect(() => { if (!open) return; const listener = (e: KeyboardEvent) => { if(e.key === 'Escape') close(); }; window.addEventListener('keydown', listener); return () => window.removeEventListener('keydown', listener); }, [open]);
  const handleKeyboard = (e: MouseEvent<HTMLDivElement>) => {
    setTyping(false);
    const el = e.target as HTMLElement;
    const image = el.closest('img');
    if (image?.getAttribute('src') === imgIOsIconDelete) setText(t => t.slice(0,-1));
    const key = el.closest('[data-name="iOS /\bKey / Default"], [data-name="iOS / Key / Space"]');
    const label = key?.textContent?.trim();
    if (label) setText(t => t + (label === '스페이스' ? ' ' : label));
    inputRef.current?.focus({preventScroll:true});
  };
  return (
    <div className={`page ${reviewing ? 'is-reviewing' : ''}`} data-node-id="1:1772" data-name="자료 확인">
      <div className="related absolute flex flex-col gap-[12px] items-start top-[583px]" data-node-id="1:1774">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="1:1775">
          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] font-['Pretendard'] gap-[4px] items-center leading-[1.445] min-w-px not-italic relative text-[18px] tracking-[-0.0036px] whitespace-nowrap" data-node-id="1:1776">
            <p className="relative shrink-0 text-[#111]" data-node-id="1:1777">
              관련된 작업
            </p>
            <p className="relative shrink-0 text-[#6967ff]" data-node-id="1:1778">
              2
            </p>
          </div>
        </div>
        <div className="bg-white border border-[#ebf0fd] border-solid content-stretch flex flex-col gap-[12px] items-start p-[12px] relative rounded-[16px] shrink-0 w-full" data-node-id="1:1779">
          <div className="content-stretch flex gap-[11px] items-center relative shrink-0" data-node-id="1:1780">
            <div className="relative shrink-0 size-[28px]" data-node-id="1:1781" data-name="Files Icons">
              <div className="-translate-y-1/2 absolute contents left-[3.5px] top-1/2" data-node-id="I1:1781;2001:2738" data-name="Group">
                <div className="absolute bottom-0 left-[2.45px] top-0 w-[21px]" data-node-id="I1:1781;2001:2739" data-name="Vector">
                  <img alt="" className="block max-w-none" src={imgVector} />
                </div>
                <div className="absolute bottom-[80.11%] left-[12.9px] top-0 w-[6.064px]" data-node-id="I1:1781;2001:2740" data-name="Vector">
                  <div className="absolute inset-[-12.57%_-11.54%_-37.7%_-34.63%]">
                    <img alt="" className="block max-w-none" src={imgVector1} />
                  </div>
                </div>
                <div className="absolute content-stretch flex items-center justify-center left-[2.45px] px-[1.4px] py-[2.1px] rounded-[2px] top-[10.29px] w-[21px]" data-node-id="I1:1781;2001:2741">
                  <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Pretendard'] font-bold leading-[normal] not-italic relative shrink-0 text-[6.3px] text-center text-white whitespace-nowrap" data-node-id="I1:1781;2001:2742">
                    PDF
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[11px] items-center relative shrink-0" data-node-id="1:1782">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[262px]" data-node-id="1:1783">
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[159px]" data-node-id="1:1784">
                  <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="1:1785">
                    <p className="[word-break:break-word] font-['Pretendard'] leading-[1.6] not-italic relative shrink-0 text-[#3f4450] text-[15px] tracking-[0.144px] whitespace-nowrap" data-node-id="1:1786">
                      기획안 수정
                    </p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0" data-node-id="1:1787">
                    <p className="[word-break:break-word] font-['Pretendard'] leading-[1.334] not-italic relative shrink-0 text-[#676e7d] text-[13px] tracking-[0.3276px] whitespace-nowrap" data-node-id="1:1788">
                      경쟁 서비스 분석 내용 추가 필요
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-[12px] relative shrink-0 w-[8px]" data-node-id="1:1789" data-name="Vector">
                <img alt="" className="block max-w-none" src={imgVector2} />
              </div>
            </div>
          </div>
          <div className="h-0 relative shrink-0 w-[330px]" data-node-id="1:1790">
            <div className="absolute inset-[-0.5px_-0.15%]">
              <img alt="" className="block max-w-none" src={imgVector24686} />
            </div>
          </div>
          <div className="content-stretch flex gap-[11px] items-center relative shrink-0 w-full" data-node-id="1:1791">
            <div className="relative shrink-0 size-[28px]" data-node-id="1:1792" data-name="Files Icons">
              <div className="-translate-y-1/2 absolute contents left-[3.5px] top-1/2" data-node-id="I1:1792;2001:2960" data-name="Group">
                <div className="absolute bottom-0 left-[2.45px] top-0 w-[21px]" data-node-id="I1:1792;2001:2961" data-name="Vector">
                  <img alt="" className="block max-w-none" src={imgVector3} />
                </div>
                <div className="absolute bottom-[80.11%] left-[12.9px] top-0 w-[6.064px]" data-node-id="I1:1792;2001:2962" data-name="Vector">
                  <div className="absolute inset-[-12.57%_-11.54%_-37.7%_-34.63%]">
                    <img alt="" className="block max-w-none" src={imgVector1} />
                  </div>
                </div>
                <div className="absolute content-stretch flex items-center justify-center left-[2.45px] px-[1.4px] py-[2.1px] rounded-[2px] top-[10.29px] w-[21px]" data-node-id="I1:1792;2001:2963">
                  <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Pretendard'] font-bold leading-[normal] not-italic relative shrink-0 text-[6.3px] text-center text-white whitespace-nowrap" data-node-id="I1:1792;2001:2964">
                    PPT
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] gap-[11px] items-center min-w-px relative" data-node-id="1:1793">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-node-id="1:1794">
                <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="1:1795">
                  <p className="[word-break:break-word] font-['Pretendard'] leading-[1.6] not-italic relative shrink-0 text-[#3f4450] text-[15px] tracking-[0.144px] whitespace-nowrap" data-node-id="1:1796">
                    PPT 수정
                  </p>
                </div>
                <div className="content-stretch flex items-start relative shrink-0" data-node-id="1:1797">
                  <p className="[word-break:break-word] font-['Pretendard'] leading-[1.334] not-italic relative shrink-0 text-[#676e7d] text-[13px] tracking-[0.3276px] whitespace-nowrap" data-node-id="1:1798">
                    슬라이드 3~5 내용 수정 필요
                  </p>
                </div>
              </div>
              <div className="h-[12px] relative shrink-0 w-[8px]" data-node-id="1:1799" data-name="Vector">
                <img alt="" className="block max-w-none" src={imgVector2} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[6px] items-center left-[20px] right-[20px] top-[202px]" data-node-id="1:1800">
        <div className="bg-white border-[#eef2fb] border-[1.058px] border-solid content-stretch flex flex-col gap-[8px] h-[124px] items-center justify-center px-[20px] py-[14px] relative rounded-[20.7px] shrink-0 file-card" data-node-id="1:1801" role="button" tabIndex={0} aria-pressed={selectedFile==='ppt'} onClick={()=>setSelectedFile(selectedFile==='ppt'?null:'ppt')} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedFile('ppt');}}}>
          <div className="relative shrink-0 size-[40px]" data-node-id="1:1802" data-name="Files Icons">
            <div className="-translate-y-1/2 absolute contents left-[5px] top-1/2" data-node-id="I1:1802;2001:2948" data-name="Group">
              <div className="absolute bottom-0 left-[5px] top-0 w-[30px]" data-node-id="I1:1802;2001:2949" data-name="Vector">
                <img alt="" className="block max-w-none" src={imgVector4} />
              </div>
              <div className="absolute bottom-[80.11%] left-[26.34px] top-0 w-[8.663px]" data-node-id="I1:1802;2001:2950" data-name="Vector">
                <div className="absolute inset-[-12.57%_-11.54%_-37.7%_-34.63%]">
                  <img alt="" className="block max-w-none" src={imgVector5} />
                </div>
              </div>
              <div className="absolute content-stretch flex items-center justify-center left-[5px] px-[2px] py-[3px] rounded-[2px] top-[21px] w-[30px]" data-node-id="I1:1802;2001:2951">
                <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Pretendard'] font-bold leading-[normal] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap" data-node-id="I1:1802;2001:2952">
                  PPTX
                </p>
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 whitespace-nowrap" data-node-id="1:1803">
            <p className="font-['Pretendard'] leading-[1.5] relative shrink-0 text-[#111] text-[16px] text-center tracking-[0.0912px]" data-node-id="1:1804">
              경쟁 시장 조사_수정
            </p>
            <p className="font-['Pretendard'] leading-[1.385] relative shrink-0 text-[#929aaa] text-[13px] tracking-[0.2522px]" data-node-id="1:1805">
              {mmdd()} 17:22
            </p>
          </div>
        </div>
        <div className="bg-white border-[#eef2fb] border-[1.058px] border-solid content-stretch flex flex-col gap-[8px] h-[124px] items-center justify-center px-[20px] py-[14px] relative rounded-[20.7px] shrink-0 file-card" data-node-id="1:1806" role="button" tabIndex={0} aria-pressed={selectedFile==='xls'} onClick={()=>setSelectedFile(selectedFile==='xls'?null:'xls')} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedFile('xls');}}}>
          <div className="relative shrink-0 size-[40px]" data-node-id="1:1807" data-name="Files Icons">
            <div className="-translate-y-1/2 absolute contents left-[5px] top-1/2" data-node-id="I1:1807;2001:2924" data-name="Group">
              <div className="absolute bottom-0 left-[5px] top-0 w-[30px]" data-node-id="I1:1807;2001:2925" data-name="Vector">
                <img alt="" className="block max-w-none" src={imgVector6} />
              </div>
              <div className="absolute bottom-[80.11%] left-[26.34px] top-0 w-[8.663px]" data-node-id="I1:1807;2001:2926" data-name="Vector">
                <div className="absolute inset-[-12.57%_-11.54%_-37.7%_-34.63%]">
                  <img alt="" className="block max-w-none" src={imgVector7} />
                </div>
              </div>
              <div className="absolute content-stretch flex items-center justify-center left-[5px] px-[2px] py-[3px] rounded-[2px] top-[21px] w-[30px]" data-node-id="I1:1807;2001:2927">
                <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Pretendard'] font-bold leading-[normal] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap" data-node-id="I1:1807;2001:2928">
                  XLS
                </p>
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0 whitespace-nowrap" data-node-id="1:1808">
            <p className="font-['Pretendard'] leading-[1.5] relative shrink-0 text-[#111] text-[16px] text-center tracking-[0.0912px]" data-node-id="1:1809">
              경쟁 업체 리스트
            </p>
            <p className="font-['Pretendard'] leading-[1.385] relative shrink-0 text-[#929aaa] text-[13px] tracking-[0.2522px]" data-node-id="1:1810">
              {mmdd()} 17:23
            </p>
          </div>
        </div>
      </div>
      <div className="absolute border border-[#d8e0ff] border-solid summary h-[213px] left-[20px] overflow-clip rounded-[16px] top-[350.12px] right-[20px]" data-node-id="1:1811" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 362 213' preserveAspectRatio='none'><g transform='matrix(-0.82493 10.65 -18.1 -0.78129 181 106.5)'><foreignObject x='-198' y='-198' width='395.99' height='395.99'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgb(7, 7, 8) 0%, rgb(12, 12, 21) 2.3438%, rgb(17, 17, 34) 4.6875%, rgb(28, 26, 59) 9.375%, rgb(38, 36, 85) 14.063%, rgb(48, 45, 110) 18.75%, rgb(66, 29, 130) 25.24%, rgb(84, 12, 150) 31.731%, rgb(65, 11, 114) 36.058%, rgb(45, 10, 79) 40.385%, rgb(26, 8, 43) 44.712%, rgb(17, 8, 26) 46.875%, rgb(7, 7, 8) 49.038%, rgb(12, 12, 21) 52.224%, rgb(17, 17, 34) 55.409%, rgb(28, 26, 59) 61.779%, rgb(38, 36, 85) 68.149%, rgb(48, 45, 110) 74.519%, rgb(38, 36, 85) 80.889%, rgb(28, 26, 59) 87.26%, rgb(17, 17, 34) 93.63%, rgb(12, 12, 21) 96.815%, rgb(7, 7, 8) 100%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")" }}>
        <div className="absolute bg-white h-[161px] left-[-1px] overflow-clip rounded-bl-[16px] rounded-br-[16px] top-[51px] right-[-1px]" data-node-id="1:1812">
          <div className="[word-break:break-word] absolute font-['Pretendard'] leading-[0] left-[22px] not-italic text-[0px] text-black top-[25px] tracking-[0.0912px] whitespace-nowrap" data-node-id="1:1813">
            <p className="font-['Pretendard'] mb-0 text-[15px] tracking-[0.144px] whitespace-pre">
              <span className="leading-[1.467] text-[#536ffa]">경쟁 서비스의 AI 자동화 기능</span>
              <span className="leading-[1.467] text-[#202b3b]">과</span>
            </p>
            <p className="font-['Pretendard'] mb-0 text-[15px] tracking-[0.144px] whitespace-pre">
              <span className="leading-[1.467] text-[#536ffa]">새로운 AI 서비스에 대한 내용</span>
              <span className="leading-[1.467] text-[#202b3b]">이 추가되었어요.</span>
            </p>
            <p className="leading-[1.625] mb-0 text-[15px] whitespace-pre">​</p>
            <p className="font-['Pretendard'] mb-0 text-[15px] tracking-[0.144px] whitespace-pre">
              <span className="leading-[1.467] text-[#202b3b]">현재 기획안</span>
              <span className="leading-[1.467] text-[#202b3b]">{`의 `}</span>
              <span className="leading-[1.467] text-[#2b6eff]">‘경쟁 시장’ 내용</span>
              <span className="leading-[1.467] text-[#202b3b]">과</span>
            </p>
            <p className="font-['Pretendard'] leading-[1.467] text-[#202b3b] text-[15px] tracking-[0.144px] whitespace-pre">달라질 수 있어요.</p>
          </div>
        </div>
        <div className="absolute contents left-[82.55px] top-[11px]" data-node-id="1:1814">
          <p className="[word-break:break-word] absolute font-['Pretendard'] leading-[1.5] left-[83.55px] not-italic text-[16px] text-white top-[18px] tracking-[0.0912px] whitespace-nowrap" data-node-id="1:1815">
            자료 내용을 요약했어요
          </p>
          <div className="absolute left-[235.55px] size-[16px] top-[12px]" data-node-id="1:1816">
            <img alt="" className="block max-w-none" src={imgFrame5} />
          </div>
        </div>
        <div className="absolute flex h-[48.495px] items-center justify-center left-[7px] top-[11px] w-[67.554px]" data-node-id="1:1819">
          <div className="flex-none rotate-[-5.08deg]">
            <div className="h-[43px] relative w-[64px]" data-name="image 3496">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute h-[199.56%] left-[-0.07%] max-w-none top-0 w-[202.24%]" src={imgImage3496} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="back-button" aria-label="뒤로 가기" onClick={() => { if (open) close(); else window.parent.postMessage({ type: "plotto:navigate", screen: 1 }, window.location.origin); }}><img src={imgIconNormalChevronLeft} alt="" /></button>
      <div className="absolute h-[31px] left-[calc(50%+57px)] top-[773px] w-[41px]" data-node-id="1:1823" data-name="Subtract">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="31" src={imgSubtract} width="41" />
      </div>
      <div className="[word-break:break-word] absolute font-['Pretendard'] leading-[0] left-[calc(37.5%-130.75px)] not-italic text-[#111] text-[22px] top-[118px] tracking-[-0.4268px] whitespace-nowrap" data-node-id="1:1824">
        <p className="leading-[1.364] mb-0">태훈님이 전달한</p>
        <p className="leading-[1.364]">새로운 자료를 확인해요.</p>
      </div>
      <div className="-translate-x-1/2 absolute bg-[#536ffa] content-stretch flex h-[54px] items-center justify-center left-1/2 pl-[46px] pr-[45px] py-[15px] rounded-[12px] top-[786px] w-[168px]" onClick={showComposer} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showComposer(); } }} data-node-id="1:1825" data-name="BTN">
        <p className="[word-break:break-word] font-['Pretendard'] leading-[1.5] not-italic relative shrink-0 text-[16px] text-white tracking-[0.0912px] whitespace-nowrap" data-node-id="I1:1825;6859:16549">
          의견 남기기
        </p>
      </div>
      {open && <div className="opinion-layer" role="dialog" aria-modal="true" aria-label="의견 남기기"><button className="scrim" aria-label="의견 입력 닫기" onClick={close} />      <div className="keyboard" onAnimationEnd={() => setReady(true)} onClick={handleKeyboard} data-node-id="1:1881" data-name="Keyboard / KR / iOS">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I1:1881;16:3725" data-name="iOS Keyboard - KR">
          <div className="h-[235.84px] overflow-clip relative shrink-0 w-full" data-node-id="I1:1881;16:3726" data-name="Keyboard - KR">
            <div className="absolute h-[160.8px] left-[3.22px] right-[3.22px] top-[8.58px]" data-node-id="I1:1881;16:3727" data-name="Keyboard">
              <div className="absolute h-[45.024px] left-0 right-0 top-0" data-node-id="I1:1881;16:3728" data-name="Top Row">
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 pt-[2.144px] right-[calc(90%+5.25px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3729" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3729;2:4566">
                    <p className="leading-[normal]">ㅂ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(10%+1.18px)] pt-[2.144px] right-[calc(80%+5.15px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3730" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3730;2:4566">
                    <p className="leading-[normal]">ㅈ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(20%+1.29px)] pt-[2.144px] right-[calc(70%+3.97px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3731" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3731;2:4566">
                    <p className="leading-[normal]">ㄷ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(30%+2.47px)] pt-[2.144px] right-[calc(60%+3.86px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3732" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3732;2:4566">
                    <p className="leading-[normal]">ㄱ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(40%+2.57px)] pt-[2.144px] right-[calc(50%+2.68px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3733" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3733;2:4566">
                    <p className="leading-[normal]">ㅅ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(50%+3.75px)] pt-[2.144px] right-[calc(40%+2.57px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3734" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3734;2:4566">
                    <p className="leading-[normal]">ㅛ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(60%+3.86px)] pt-[2.144px] right-[calc(30%+2.47px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3735" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3735;2:4566">
                    <p className="leading-[normal]">ㅕ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(70%+3.97px)] pt-[2.144px] right-[calc(20%+1.29px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3736" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3736;2:4566">
                    <p className="leading-[normal]">ㅑ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(80%+5.15px)] pt-[2.144px] right-[calc(10%+1.18px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3737" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3737;2:4566">
                    <p className="leading-[normal]">ㅐ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(90%+5.25px)] pt-[2.144px] right-0 rounded-[5px] top-1/2" data-node-id="I1:1881;16:3738" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3738;2:4566">
                    <p className="leading-[normal]">ㅔ</p>
                  </div>
                </div>
              </div>
              <div className="absolute h-[45.024px] left-[20.9px] right-[20.9px] top-[57.89px]" data-node-id="I1:1881;16:3739" data-name="Middle Row">
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 pt-[2.144px] right-[calc(88.89%+5px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3740" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3740;2:4566">
                    <p className="leading-[normal]">ㅁ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(11.11%+1.43px)] pt-[2.144px] right-[calc(77.78%+5.72px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3741" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3741;2:4566">
                    <p className="leading-[normal]">ㄴ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(22.22%+0.71px)] pt-[2.144px] right-[calc(66.67%+4.29px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3742" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3742;2:4566">
                    <p className="leading-[normal]">ㅇ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(33.33%+2.14px)] pt-[2.144px] right-[calc(55.56%+2.86px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3743" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3743;2:4566">
                    <p className="leading-[normal]">ㄹ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(44.44%+3.57px)] pt-[2.144px] right-[calc(44.44%+3.57px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3744" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3744;2:4566">
                    <p className="leading-[normal]">ㅎ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(55.56%+2.86px)] pt-[2.144px] right-[calc(33.33%+2.14px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3745" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3745;2:4566">
                    <p className="leading-[normal]">ㅗ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(66.67%+4.29px)] pt-[2.144px] right-[calc(22.22%+0.71px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3746" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3746;2:4566">
                    <p className="leading-[normal]">ㅓ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(77.78%+5.72px)] pt-[2.144px] right-[calc(11.11%+1.43px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3747" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3747;2:4566">
                    <p className="leading-[normal]">ㅏ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(88.89%+5px)] pt-[2.144px] right-0 rounded-[5px] top-1/2" data-node-id="I1:1881;16:3748" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3748;2:4566">
                    <p className="leading-[normal]">ㅣ</p>
                  </div>
                </div>
              </div>
              <div className="absolute h-[45.024px] left-0 right-0 top-[115.78px]" data-node-id="I1:1881;16:3749" data-name="Bottom Row">
                <div className="-translate-y-1/2 absolute bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 px-[6.432px] py-[8.576px] rounded-[5px] top-1/2 w-[47.168px]" data-node-id="I1:1881;16:3750" data-name="iOS /Key / Function">
                  <div className="relative shrink-0 size-[34.304px]" data-node-id="I1:1881;16:3750;3:3329" data-name="iOS / icon / Shift">
                    <img alt="" className="block max-w-none" src={imgIOsIconShift} />
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute h-[45.024px] left-[62.18px] right-[63.25px] top-1/2" data-node-id="I1:1881;16:3751" data-name="Keys">
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 pt-[2.144px] right-[calc(85.71%+5.36px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3752" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3752;2:4566">
                      <p className="leading-[normal]">ㅋ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(14.29%+1.07px)] pt-[2.144px] right-[calc(71.43%+4.29px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3753" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3753;2:4566">
                      <p className="leading-[normal]">ㅌ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(28.57%+2.14px)] pt-[2.144px] right-[calc(57.14%+3.22px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3754" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3754;2:4566">
                      <p className="leading-[normal]">ㅊ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(42.86%+3.22px)] pt-[2.144px] right-[calc(42.86%+3.22px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3755" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3755;2:4566">
                      <p className="leading-[normal]">ㅍ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(57.14%+3.22px)] pb-[6.432px] pt-[2.144px] right-[calc(28.57%+2.14px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3756" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3756;2:4566">
                      <p className="leading-[normal]">ㅠ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(71.43%+4.29px)] pb-[5.36px] right-[calc(14.29%+1.07px)] rounded-[5px] top-1/2" data-node-id="I1:1881;16:3757" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3757;2:4566">
                      <p className="leading-[normal]">ㅜ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(85.71%+5.36px)] pb-[6.432px] pt-[2.144px] right-0 rounded-[5px] top-1/2" data-node-id="I1:1881;16:3758" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3758;2:4566">
                      <p className="leading-[normal]">ㅡ</p>
                    </div>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center px-[6.432px] py-[8.576px] right-0 rounded-[5px] top-1/2 w-[47.168px]" data-node-id="I1:1881;16:3759" data-name="iOS /Key / Function">
                  <div className="relative shrink-0 size-[34.304px]" data-node-id="I1:1881;16:3759;3:3329" data-name="iOS / icon / Shift">
                    <img alt="" className="block max-w-none" src={imgIOsIconDelete} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute content-stretch flex gap-[6.432px] items-start left-[3.22px] right-[3.22px] top-[182.24px]" data-node-id="I1:1881;16:3760" data-name="Function Row">
              <div className="bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col items-center justify-center px-[6.432px] py-[8.576px] relative rounded-[5px] shrink-0 size-[45.024px]" data-node-id="I1:1881;16:3761" data-name="iOS /Key / Function">
                <div className="relative shrink-0 size-[34.304px]" data-node-id="I1:1881;16:3761;3:3329" data-name="iOS / icon / Shift">
                  <img alt="" className="block max-w-none" src={imgIOsIconNumber} />
                </div>
              </div>
              <div className="bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center px-[6.432px] py-[8.576px] relative rounded-[5px] shrink-0 w-[46.096px]" data-node-id="I1:1881;16:3762" data-name="iOS /Key / Function">
                <div className="relative shrink-0 size-[34.304px]" data-node-id="I1:1881;16:3762;3:3329" data-name="iOS / icon / Shift">
                  <img alt="" className="block max-w-none" src={imgIOsIconEmojis} />
                </div>
              </div>
              <div className="bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-[1_0_0] h-[45.024px] items-center justify-center min-w-px pb-[1.072px] relative rounded-[5px]" data-node-id="I1:1881;16:3763" data-name="iOS / Key / Space">
                <div className="[word-break:break-word] flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-[17.15px] text-center text-white whitespace-nowrap" data-node-id="I1:1881;16:3763;3:3321">
                  <p className="leading-[normal]">스페이스</p>
                </div>
              </div>
              <div className="bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center px-[6.432px] py-[8.576px] relative rounded-[5px] shrink-0 w-[97.552px]" data-node-id="I1:1881;16:3764" data-name="iOS /Key / Function">
                <div className="relative shrink-0 size-[34.304px]" data-node-id="I1:1881;16:3764;3:3329" data-name="iOS / icon / Shift">
                  <img alt="" className="block max-w-none" src={imgIOsIconEnter} />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[76.112px] overflow-clip relative shrink-0 w-full" data-node-id="I1:1881;16:3765" data-name="Controller">
            <div className="-translate-y-1/2 absolute left-[23.58px] size-[42.88px] top-[calc(50%-4.82px)]" data-node-id="I1:1881;16:3767" data-name="iOS / icon / Global">
              <img alt="" className="block max-w-none" src={imgIOsIconGlobal} />
            </div>
            <div className="-translate-y-1/2 absolute right-[23.58px] size-[42.88px] top-[calc(50%-4.82px)]" data-node-id="I1:1881;16:3768" data-name="iOS / icon/Mic">
              <img alt="" className="block max-w-none" src={imgIOsIconMic} />
            </div>
          </div>
        </div>
      </div>
      <div className={`composer ${ready ? "is-ready" : ""}`} data-node-id="1:1882" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 380 120' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-19 10.986 -34.79 -9.2461 190 10.138)'><stop stop-color='rgba(48,45,110,1)' offset='0'/><stop stop-color='rgba(38,36,85,1)' offset='0.25'/><stop stop-color='rgba(28,26,59,1)' offset='0.5'/><stop stop-color='rgba(18,17,34,1)' offset='0.75'/><stop stop-color='rgba(12,12,21,1)' offset='0.875'/><stop stop-color='rgba(7,7,8,1)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 51.954%), linear-gradient(270deg, rgb(186, 184, 255) 0%, rgb(180, 225, 255) 40.919%, rgb(232, 246, 255) 76.67%, rgb(199, 233, 255) 89.494%)" }}>
        <div className="attachment-group">
        <button type="button" className="attachment-trigger content-stretch flex gap-[4px] items-center relative shrink-0" onClick={() => setAttached(true)} aria-pressed={attached} data-node-id="1:1883">
          <div className="relative shrink-0 size-[24px]" data-node-id="1:1884" data-name="attach_file">
            <img alt="" className="block max-w-none" src={imgAttachFile} />
          </div>
          <p className="[word-break:break-word] font-['Pretendard'] leading-[1.429] not-italic relative shrink-0 text-[#f4f7fd] text-[14px] tracking-[0.203px] whitespace-nowrap" data-node-id="1:1887">
            첨부파일
          </p>
        </button>
        {attached && <div className="attached-file" data-node-id="1:2190">
          <div className="attached-file-icon" aria-hidden="true">
            <img className="attached-document" src={imgAttachedDocument} alt="" />
            <img className="attached-fold" src={imgAttachedFold} alt="" />
            <span className="attached-extension">PPTX</span>
          </div>
          <span className="attached-file-name">경쟁 시장 조사_수정.pptx</span>
        </div>}
        </div>
        <div className={`input-pill ${text ? 'has-text' : ''}`}><textarea ref={inputRef} rows={1} value={text} onClick={startExample} onChange={e => { setTyping(false); setExampleStarted(true); setText(e.target.value); }} inputMode="none" placeholder="작업을 이어가요..." aria-label="의견 입력" aria-description="누르면 예시 의견이 타이핑됩니다." onKeyDown={e => { if (e.key === 'Escape') close(); }} /><button type="button" className="send-icon" aria-label="의견 보내기" onClick={previewOpinion}><img src={isSendActive ? imgSendActive : imgSend} alt="" /></button></div>
      </div></div>}
      {reviewing && <OpinionReview text={text.trim() || example} onClose={() => { setReviewing(false); requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-node-id="1:1825"]')?.focus()); }} />}
    </div>
  );
}
