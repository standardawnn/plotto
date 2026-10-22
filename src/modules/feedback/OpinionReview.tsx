import { useEffect, useRef, useState } from 'react';
const imgImage3470 = '/assets/screen2/546e2.png';
const imgChatBubble = '/assets/screen2/279da.svg';

export default function OpinionReview({ text, onClose }: { text: string; onClose: () => void }) {
  const [arrived, setArrived] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') { event.preventDefault(); cardRef.current?.querySelector<HTMLButtonElement>('.review-forward')?.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.documentElement.style.overflow = previousRootOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [onClose]);
  return <div className="opinion-layer review-layer"><button className="scrim" aria-label="의견 확인 닫기" onClick={onClose} tabIndex={-1} />
      <div className={`review-card ${arrived ? "has-arrived" : ""}`} ref={cardRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="review-title" onAnimationEnd={event => { if (event.target === event.currentTarget) setArrived(true); }} data-node-id="1:2612" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 362 378' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-18.1 34.607 -33.142 -29.125 181 31.935)'><stop stop-color='rgba(48,45,110,1)' offset='0'/><stop stop-color='rgba(38,36,85,1)' offset='0.25'/><stop stop-color='rgba(28,26,59,1)' offset='0.5'/><stop stop-color='rgba(18,17,34,1)' offset='0.75'/><stop stop-color='rgba(12,12,21,1)' offset='0.875'/><stop stop-color='rgba(7,7,8,1)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 51.954%), linear-gradient(270deg, rgb(186, 184, 255) 0%, rgb(180, 225, 255) 40.919%, rgb(232, 246, 255) 76.67%, rgb(199, 233, 255) 89.494%)" }}>
        <div className="review-quote" data-node-id="1:2613">
          <p className="review-quote-text">{text.split(/(문서|이미지)/).map((part, index) => part === '문서' || part === '이미지' ? <strong className={part === '문서' ? 'document-highlight' : 'image-highlight'} key={index}>{part}</strong> : part)}</p>
        </div>
        <div className="review-character" data-node-id="1:2615" data-name="image 3470">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[110.04%] left-[-33.65%] max-w-none top-[-7.28%] w-[152.11%]" src={imgImage3470} />
          </div>
        </div>
        <div className="[word-break:break-word] absolute font-['Pretendard'] leading-[0] left-[20px] not-italic text-[20px] text-white top-[26px] tracking-[-0.24px] whitespace-nowrap" id="review-title" data-node-id="1:2616">
          <p className="leading-[1.4] mb-0">해당 의견을 팀원의 역할에 맞게</p>
          <p className="leading-[1.4]">분석하여 전달할 수 있어요</p>
        </div>
        <button type="button" onClick={() => window.parent.postMessage({ type: "plotto:navigate", screen: 3 }, window.location.origin)} className="review-forward" data-node-id="1:2617" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 302 54' preserveAspectRatio='none'><g transform='matrix(-11.902 2.3786 -13.302 -3.4255 151 27)'><foreignObject x='-178.56' y='-178.56' width='357.12' height='357.12'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgb(220, 223, 255) 0%, rgb(220, 223, 255) 6.7308%, rgb(245, 234, 255) 26.923%, rgb(220, 223, 255) 53.846%, rgb(245, 234, 255) 80.769%, rgb(220, 223, 255) 100%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")" }} data-name="BTN">
          <p className="[word-break:break-word] font-['Pretendard'] leading-[1.5] not-italic relative shrink-0 text-[#111] text-[16px] tracking-[0.0912px] whitespace-nowrap" data-node-id="I1:2617;7098:8989">
            팀원에게 전달하기
          </p>
        </button>
        <div className="absolute content-stretch flex gap-[6px] items-center left-[16px] top-[174px]" data-node-id="1:2618">
          <div className="relative shrink-0 size-[16px]" data-node-id="1:2619" data-name="chat_bubble">
            <img alt="" className="block max-w-none" src={imgChatBubble} />
          </div>
          <p className="[word-break:break-word] font-['Pretendard'] leading-[1.385] not-italic relative shrink-0 text-[13px] text-white tracking-[0.2522px] whitespace-nowrap" data-node-id="1:2622">
            방금 서연님이 남기신 의견이에요
          </p>
        </div>
      </div>
</div>;
}
