const assetPathPrefix = "/assets/intervention";
const imgFrame = `${assetPathPrefix}/8b917.svg`;
const img = `${assetPathPrefix}/8c6ad.png`;
const imgImage3470 = `${assetPathPrefix}/546e2.png`;
const imgRatio = `${assetPathPrefix}/dba22.svg`;
const imgIconNormalChevronLeft = `${assetPathPrefix}/2f631.svg`;
const imgVector25136 = `${assetPathPrefix}/6adf8.svg`;
const imgEllipse343 = `${assetPathPrefix}/f80eb.svg`;
const imgGroup1000012360 = `${assetPathPrefix}/c5ecb.svg`;
const imgGroup1000012385 = `${assetPathPrefix}/e1fc8.svg`;
const imgGroup1000012361 = `${assetPathPrefix}/4caa2.svg`;
const imgGroup1000012386 = `${assetPathPrefix}/9ee30.svg`;
const imgMoreVert = `${assetPathPrefix}/d61d3.svg`;

type StatusBarIPhone17ProProps = {
  className?: string;
  time?: string;
};

export function StatusBarIPhone17Pro({ className, time = "9:41" }: StatusBarIPhone17ProProps) {
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

export default function SessionEnteredScreen() {
  return (
    <div className="bg-[#f4f7fd] relative size-full" data-node-id="2003:2162" data-name="공동세션">
      <div className="absolute h-[294px] left-0 top-[624px] w-[402px]" data-node-id="2003:2163" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 402 294' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(2.0399e-14 -30.15 51.88 3.6255e-13 201 301.5)'><stop stop-color='rgba(99,91,255,0.3)' offset='0.014423'/><stop stop-color='rgba(160,144,248,0.65)' offset='0.11538'/><stop stop-color='rgba(220,196,242,1)' offset='0.21635'/><stop stop-color='rgba(211,209,255,1)' offset='0.3125'/><stop stop-color='rgba(245,246,249,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col h-[24px] items-center justify-center left-[20px] top-[calc(50%-353px)]" data-node-id="2003:2164" data-name="Icon/Normal/Chevron Left">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-clip relative" data-node-id="I2003:2164;1690:1521" data-name="Ratio">
          <div className="flex flex-[1_0_0] items-center justify-center min-h-px relative w-[100px]" data-node-id="I2003:2164;1690:1521;16215:17329">
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
      <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.7)] border border-[#536ffa] border-solid content-stretch flex gap-[8px] items-center left-[calc(75%-4px)] px-[12px] py-[8px] rounded-[36px] top-[89px]" data-node-id="2003:2166">
        <div className="relative rounded-[250px] shrink-0 size-[26px]" data-node-id="2003:2167" data-name="프사">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[250px]">
            <img alt="" className="absolute h-[133.33%] left-0 max-w-none top-[-6.66%] w-full" src={img} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['Pretendard:Medium'] leading-[1.385] not-italic relative shrink-0 text-[13px] text-black tracking-[0.2522px] whitespace-nowrap" data-node-id="2003:2168">
          태훈님이 입장했어요.
        </p>
      </div>
      <div className="absolute flex h-[228.274px] items-center justify-center left-[calc(25%+67.18px)] top-[245.49px] w-[175.401px]" data-node-id="2003:2169">
        <div className="flex-none rotate-[-5.02deg]">
          <div className="h-[215.359px] relative w-[157.177px]">
            <div className="absolute inset-[-0.65%_-1.15%_-1.18%_-0.68%]">
              <img alt="" className="block max-w-none size-full" src={imgVector25136} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute contents h-[229.295px] left-[29.25px] top-[168px] w-[184.197px]" data-node-id="2003:2170">
        <div className="absolute flex h-[229.295px] items-center justify-center left-[29.25px] top-[168px] w-[184.197px]" data-node-id="2003:2171">
          <div className="flex-none rotate-[-6.64deg]">
            <div className="bg-white border-[#ebefff] border-[1.127px] border-solid h-[212.13px] overflow-clip relative rounded-[9.012px] shadow-[0px_0px_9.012px_0px_rgba(83,111,250,0.2)] w-[160.745px]">
              <div className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[0] left-[11.26px] not-italic text-[#536ffa] text-[14px] top-[16.36px] tracking-[0.203px] w-[79.985px]" data-node-id="2003:2172">
                <p className="leading-[1.429] mb-0">주제선정_</p>
                <p className="leading-[1.429]">자료조사.pdf</p>
              </div>
              <div className="absolute bg-[#9693ff] h-[5.633px] left-[12.09px] rounded-[56.327px] top-[64.83px] w-[67.593px]" data-node-id="2003:2173" />
              <div className="absolute bg-[#eef2fb] h-[5.633px] left-[12.08px] rounded-[56.327px] top-[80.6px] w-[91.25px]" data-node-id="2003:2174" />
              <div className="absolute bg-[#eef2fb] h-[5.633px] left-[12.09px] rounded-[56.327px] top-[96.37px] w-[91.25px]" data-node-id="2003:2175" />
              <div className="absolute bg-[#eef2fb] h-[5.633px] left-[12.09px] rounded-[56.327px] top-[112.15px] w-[91.25px]" data-node-id="2003:2176" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[65px] top-[440.76px]" data-node-id="2003:2177">
        <div className="absolute bg-white border border-[#ebefff] border-solid h-[168px] left-[65px] overflow-clip rounded-[8px] shadow-[0px_0px_8px_0px_rgba(83,111,250,0.2)] top-[440.76px] w-[151.507px]" data-node-id="2003:2178">
          <p className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.385] left-[10px] not-italic text-[#536ffa] text-[13px] top-[17px] tracking-[0.2522px] whitespace-nowrap" data-node-id="2003:2179">
            최근 AI 서비스 자료
          </p>
          <div className="absolute bg-[#9693ff] h-[5px] left-[10px] rounded-[50px] top-[46px] w-[60px]" data-node-id="2003:2180" />
          <div className="absolute bg-[#eef2fb] h-[5px] left-[10px] rounded-[50px] top-[60px] w-[81px]" data-node-id="2003:2181" />
          <div className="absolute bg-[#eef2fb] h-[5px] left-[10px] rounded-[50px] top-[74px] w-[81px]" data-node-id="2003:2182" />
          <div className="absolute bg-[#eef2fb] h-[5px] left-[10px] rounded-[50px] top-[88px] w-[81px]" data-node-id="2003:2183" />
        </div>
      </div>
      <div className="absolute flex h-[141.664px] items-center justify-center left-[calc(50%+45px)] top-[225.76px] w-[129.594px]" data-node-id="2003:2184">
        <div className="flex-none rotate-[8.65deg]">
          <div className="bg-white border border-[#ebefff] border-solid h-[126.274px] overflow-clip relative rounded-[8px] shadow-[0px_0px_8px_0px_rgba(83,111,250,0.2)] w-[111.874px]">
            <div className="-translate-x-1/2 absolute bg-gradient-to-l from-[#c6c7fa] h-[63.809px] left-[calc(50%-0.86px)] rounded-[6px] to-[#9693ff] top-[36.1px] w-[92.529px]" data-node-id="2003:2185" />
            <p className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.334] left-[8.59px] not-italic text-[#536ffa] text-[12px] top-[12.71px] tracking-[0.3024px] w-[88.571px]" data-node-id="2003:2186">
              AI 서비스 이미지
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#d8e0ff] h-[93px] left-[calc(50%+45px)] overflow-clip rounded-[4px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)] top-[423.76px] w-[102px]" data-node-id="2003:2187">
        <p className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.273] left-[10px] not-italic text-[#070055] text-[11px] top-[13px] tracking-[0.3421px] whitespace-nowrap" data-node-id="2003:2188">
          비교 기준 정하기
        </p>
      </div>
      <div className="absolute flex h-[110.732px] items-center justify-center left-[calc(50%+63px)] top-[524.76px] w-[117.852px]" data-node-id="2003:2189">
        <div className="flex-none rotate-[10.98deg]">
          <div className="bg-[#ebefff] h-[93px] overflow-clip relative rounded-[4px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)] w-[102px]">
            <p className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.273] left-[10.28px] not-italic text-[#070055] text-[11px] top-[11.25px] tracking-[0.3421px] whitespace-nowrap" data-node-id="2003:2190">
              경쟁사 3곳?
            </p>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute h-[191px] left-1/2 top-[771px] w-[412px]" data-node-id="2003:2191">
        <div className="absolute inset-[-6.28%_-1.94%_-2.09%_-1.94%]">
          <img alt="" className="block max-w-none size-full" src={imgEllipse343} />
        </div>
      </div>
      <div className="absolute h-[32px] left-[calc(50%+28px)] top-[758px] w-[88px]" data-node-id="2003:2192" data-name="image 3470">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[351.94%] left-[-33.65%] max-w-none top-[-23.3%] w-[152.11%]" src={imgImage3470} />
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-[#070055] h-[56px] left-1/2 overflow-clip rounded-[45.882px] top-[770px] w-[208px]" data-node-id="2003:2193">
        <div className="absolute left-[17.29px] size-[32.708px] top-[11.17px]" data-node-id="2003:2194">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012360} />
        </div>
        <div className="absolute left-[64.53px] size-[33.06px] top-[11px]" data-node-id="2003:2199">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012385} />
        </div>
        <div className="absolute left-[111.94px] size-[33.06px] top-[11px]" data-node-id="2003:2204">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012361} />
        </div>
        <div className="absolute contents left-[159.36px] top-[11px]" data-node-id="2003:2209">
          <div className="absolute left-[159.36px] size-[33.057px] top-[11px]" data-node-id="2003:2210">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012386} />
          </div>
          <div className="absolute left-[165.26px] size-[21.251px] top-[16.9px]" data-node-id="2003:2212" data-name="more_vert">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoreVert} />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-0 content-stretch flex flex-col h-[34px] items-center justify-end left-1/2 pb-[8px] w-[402px]" data-node-id="2003:2215" data-name="Home Indicator">
        <div className="flex items-center justify-center relative shrink-0" data-node-id="I2003:2215;106:60028">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-black h-[5px] relative rounded-[100px] w-[144px]" data-name="Home Indicator" />
          </div>
        </div>
      </div>
    </div>
  );
}