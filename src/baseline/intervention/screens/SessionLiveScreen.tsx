const assetPathPrefix = "/assets/intervention";
const imgFrame = `${assetPathPrefix}/8b917.svg`;
const imgRectangle34627058 = `${assetPathPrefix}/f9e12.svg`;
const imgRatio = `${assetPathPrefix}/dba22.svg`;
const imgIconNormalChevronLeft = `${assetPathPrefix}/2f631.svg`;
const imgVector25139 = `${assetPathPrefix}/4f34d.svg`;
const imgGroup1000012360 = `${assetPathPrefix}/c5ecb.svg`;
const imgGroup1000012385 = `${assetPathPrefix}/e1fc8.svg`;
const imgGroup1000012361 = `${assetPathPrefix}/4caa2.svg`;
const imgGroup1000012386 = `${assetPathPrefix}/9ee30.svg`;
const imgMoreVert = `${assetPathPrefix}/d61d3.svg`;
const imgAdd = `${assetPathPrefix}/7ce15.svg`;

type StatusBarIPhone17ProProps = {
  className?: string;
  time?: string;
};

function StatusBarIPhone17Pro({ className, time = "9:41" }: StatusBarIPhone17ProProps) {
  return (
    <div className={className || "content-stretch flex h-[62px] items-center justify-center pt-[2.333px] px-[9px] relative w-[402px]"} data-node-id="2003:2016" data-name="Status bar - iPhone 17 Pro">
      <div className="content-stretch flex flex-[1_0_0] h-[13px] items-center justify-center min-w-px pr-[6px] relative" data-node-id="2003:2017" data-name="Time">
        <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="2003:2018" data-name="Frame">
          <p className="[word-break:break-word] font-['SF_Pro:Semibold'] font-[590] leading-[22px] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap" data-node-id="2003:2019" style={{ fontVariationSettings: '"wdth" 100' }}>
            {time}
          </p>
        </div>
      </div>
      <div className="bg-black h-[37px] relative rounded-[100px] shrink-0 w-[125px]" data-node-id="2003:2020" data-name="Dynamic Island" />
      <div className="content-stretch flex flex-[1_0_0] h-[13px] items-center justify-center min-w-px pr-px relative" data-node-id="2003:2021" data-name="Levels">
        <div className="h-[13px] relative shrink-0 w-[85.329px]" data-node-id="2003:2022" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
        </div>
      </div>
    </div>
  );
}

export default function SessionLiveScreen() {
  return (
    <div className="bg-[#f4f7fd] relative size-full" data-node-id="2003:2106" data-name="공동세션">
      <div className="absolute contents left-px top-[3px]" data-node-id="2003:2107" data-name="Mask group">
        <div className="absolute bg-[#d8e0ff] h-[867px] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[399px_867px] opacity-80 top-[3px] w-[399px]" data-node-id="2003:2109" style={{ maskImage: `url("${imgRectangle34627058}")` }} />
      </div>
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col h-[24px] items-center justify-center left-[20px] top-[calc(50%-353px)]" data-node-id="2003:2110" data-name="Icon/Normal/Chevron Left">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-clip relative" data-node-id="I2003:2110;1690:1521" data-name="Ratio">
          <div className="flex flex-[1_0_0] items-center justify-center min-h-px relative w-[100px]" data-node-id="I2003:2110;1690:1521;16215:17329">
            <div className="flex-none h-full rotate-[-19.47deg]">
              <div className="h-full relative w-[70.711px]" data-name="Ratio">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRatio} />
              </div>
            </div>
          </div>
        </div>
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconNormalChevronLeft} />
      </div>
      <StatusBarIPhone17Pro className="absolute content-stretch flex h-[62px] items-center justify-center left-[-0.1px] pt-[2.333px] px-[9px] top-0 w-[402px]" />
      <div className="-translate-x-1/2 absolute bg-[#070055] content-stretch flex h-[49px] items-center justify-between left-1/2 px-[16px] py-[12px] rounded-[36px] top-[126px] w-[362px]" data-node-id="2003:2112">
        <p className="[word-break:break-word] font-['Pretendard:Regular'] leading-[1.429] not-italic relative shrink-0 text-[14px] text-white tracking-[0.203px] whitespace-nowrap" data-node-id="2003:2113">
          태훈님이 말하고 있어요..
        </p>
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="2003:2114">
          <div className="bg-white col-1 ml-0 mt-[7.23px] relative rounded-[39px] row-1 size-[2.853px]" data-node-id="2003:2115" />
          <div className="bg-white col-1 h-[13.462px] ml-[3.98px] mt-[1.83px] relative rounded-[39px] row-1 w-[2.853px]" data-node-id="2003:2116" />
          <div className="bg-white col-1 h-[17.206px] ml-[8.02px] mt-0 relative rounded-[39px] row-1 w-[2.853px]" data-node-id="2003:2117" />
          <div className="bg-white col-1 h-[10.876px] ml-[12.04px] mt-[3.21px] relative rounded-[39px] row-1 w-[2.853px]" data-node-id="2003:2118" />
          <div className="bg-white col-1 ml-[16.05px] mt-[7.23px] relative rounded-[39px] row-1 size-[2.853px]" data-node-id="2003:2119" />
        </div>
      </div>
      <div className="absolute bg-white h-[456px] left-[20px] overflow-clip rounded-[20px] shadow-[0px_0px_8px_0px_rgba(83,111,250,0.3)] top-[193px] w-[362px]" data-node-id="2003:2120">
        <div className="absolute bg-[#d7ecff] h-[22px] left-[23px] top-[289px] w-[141px]" data-node-id="2003:2121" />
        <div className="absolute bg-[#d7ecff] h-[22px] left-[145px] top-[241px] w-[85px]" data-node-id="2003:2122" />
        <p className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.412] left-[23px] not-italic text-[#536ffa] text-[17px] top-[25px] whitespace-nowrap" data-node-id="2003:2123">
          주제선정_자료조사.pdf
        </p>
        <ol className="[word-break:break-word] absolute block font-['Pretendard:SemiBold'] leading-[0] left-[23px] list-decimal not-italic text-[15px] text-black top-[111px] tracking-[0.144px] whitespace-nowrap" data-node-id="2003:2124" start={1}>
          <li className="ms-[22.5px]">
            <span className="leading-[1.467]">조사 목적</span>
          </li>
        </ol>
        <ol className="[word-break:break-word] absolute block font-['Pretendard:SemiBold'] leading-[0] left-[23px] list-decimal not-italic text-[15px] text-black top-[193px] tracking-[0.144px] whitespace-nowrap" data-node-id="2003:2125" start={2}>
          <li className="ms-[22.5px]">
            <span className="leading-[1.467]">기능별 비교 기준</span>
          </li>
        </ol>
        <ol className="[word-break:break-word] absolute block font-['Pretendard:SemiBold'] leading-[0] left-[23px] list-decimal not-italic text-[15px] text-black top-[324px] tracking-[0.144px] whitespace-nowrap" data-node-id="2003:2126" start={3}>
          <li className="ms-[22.5px]">
            <span className="leading-[1.467]">기획안에 적용할 관점</span>
          </li>
        </ol>
        <div className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[0] left-[27px] not-italic text-[#3f4450] text-[14px] top-[139px] tracking-[0.203px] whitespace-nowrap" data-node-id="2003:2127">
          <p className="leading-[1.429] mb-0">AI 협업 서비스의 주요 기능을 살펴보고,</p>
          <p className="leading-[1.429]">팀 작업을 지원하는 방식을 비교한다.</p>
        </div>
        <div className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[0] left-[27px] not-italic text-[#3f4450] text-[0px] top-[221px] tracking-[0.203px] whitespace-nowrap" data-node-id="2003:2128">
          <p className="font-['Pretendard:Bold'] leading-[1.429] mb-0 text-[#111] text-[14px]">작업 자동화</p>
          <p className="text-[14px]">
            <span className="leading-[1.429]">{`자료 요약, 문서 작성, `}</span>
            <span className="[word-break:break-word] font-['Pretendard:Bold'] leading-[1.429] not-italic text-[#536ffa] tracking-[0.203px]">반복 업무 처리</span>
          </p>
        </div>
        <div className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[0] left-[27px] not-italic text-[#3f4450] text-[14px] top-[352px] tracking-[0.203px] whitespace-nowrap" data-node-id="2003:2129">
          <p className="leading-[1.429] mb-0">업무가 이어지는 과정과 사용자가</p>
          <p className="leading-[1.429]">확인할 수 있는 범위를 함께 살펴본다.</p>
        </div>
        <div className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[0] left-[27px] not-italic text-[#3f4450] text-[0px] top-[269px] tracking-[0.203px] whitespace-nowrap" data-node-id="2003:2130">
          <p className="font-['Pretendard:Bold'] leading-[1.429] mb-0 text-[#111] text-[14px]">맥락 연결</p>
          <p className="text-[14px]">
            <span className="[word-break:break-word] font-['Pretendard:Bold'] leading-[1.429] not-italic text-[#536ffa] tracking-[0.203px]">관련 자료와 담당자 탐색</span>
            <span className="leading-[1.429]">, 변경 내용 전달</span>
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Pretendard:Bold'] leading-[1.5] left-[23px] not-italic text-[16px] text-black top-[78px] tracking-[0.0912px] whitespace-pre" data-node-id="2003:2131">{`AI  협업 서비스 현황 조사`}</p>
        <p className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.385] left-[27px] not-italic text-[#c1c8d8] text-[13px] top-[413px] tracking-[0.2522px] whitespace-nowrap" data-node-id="2003:2132">{`원문 보기 >`}</p>
        <div className="absolute h-0 left-[16px] top-[63px] w-[328px]" data-node-id="2003:2133">
          <div className="absolute inset-[-0.5px_0]">
            <img alt="" className="block max-w-none size-full" src={imgVector25139} />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-[#070055] h-[56px] left-1/2 overflow-clip rounded-[45.882px] top-[770px] w-[208px]" data-node-id="2003:2134">
        <div className="absolute left-[17.29px] size-[32.708px] top-[11.17px]" data-node-id="2003:2135">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012360} />
        </div>
        <div className="absolute left-[64.53px] size-[33.06px] top-[11px]" data-node-id="2003:2140">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012385} />
        </div>
        <div className="absolute left-[111.94px] size-[33.06px] top-[11px]" data-node-id="2003:2145">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012361} />
        </div>
        <div className="absolute contents left-[159.36px] top-[11px]" data-node-id="2003:2150">
          <div className="absolute left-[159.36px] size-[33.057px] top-[11px]" data-node-id="2003:2151">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012386} />
          </div>
          <div className="absolute left-[165.26px] size-[21.251px] top-[16.9px]" data-node-id="2003:2153" data-name="more_vert">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoreVert} />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-[#607af9] h-[54px] left-[calc(75%-8px)] rounded-[14px] top-[667px] w-[177px]" data-node-id="2003:2156">
        <div className="absolute left-[26.5px] size-[24px] top-[15px]" data-node-id="2003:2157" data-name="add">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAdd} />
        </div>
        <p className="[word-break:break-word] absolute font-['Pretendard:Bold'] leading-[1.5] left-[58px] not-italic text-[16px] text-white top-[15px] tracking-[0.0912px] whitespace-nowrap" data-node-id="2003:2160">
          자료 추가하기
        </p>
      </div>
      <div className="-translate-x-1/2 absolute bottom-0 content-stretch flex flex-col h-[34px] items-center justify-end left-1/2 pb-[8px] w-[402px]" data-node-id="2003:2161" data-name="Home Indicator">
        <div className="flex items-center justify-center relative shrink-0" data-node-id="I2003:2161;106:60028">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-black h-[5px] relative rounded-[100px] w-[144px]" data-name="Home Indicator" />
          </div>
        </div>
      </div>
    </div>
  );
}