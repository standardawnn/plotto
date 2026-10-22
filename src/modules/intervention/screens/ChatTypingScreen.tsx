const assetPathPrefix = "/assets/intervention";
const imgFrame = `${assetPathPrefix}/4d704.svg`;
const imgRatio = `${assetPathPrefix}/dba22.svg`;
const imgIconNormalChevronLeft = `${assetPathPrefix}/7c897.svg`;
const imgSend = `${assetPathPrefix}/13889.svg`;
const imgGroup1000012377 = `${assetPathPrefix}/8fd4f.svg`;
const imgAppLogo106 = `${assetPathPrefix}/049fc.svg`;
const imgFrame5 = `${assetPathPrefix}/b4207.svg`;
const imgIOsIconShift = `${assetPathPrefix}/ae3a6.svg`;
const imgIOsIconDelete = `${assetPathPrefix}/5d79c.svg`;
const imgIOsIconNumber = `${assetPathPrefix}/4867b.svg`;
const imgIOsIconEmojis = `${assetPathPrefix}/ada8c.svg`;
const imgIOsIconEnter = `${assetPathPrefix}/58b44.svg`;
const imgIOsIconGlobal = `${assetPathPrefix}/a8686.svg`;
const imgIOsIconMic = `${assetPathPrefix}/a6f27.svg`;

export default function ChatTypingScreen() {
  return (
    <div className="bg-[#f4f7fd] relative size-full" data-node-id="2001:750" data-name="작업 전 (대화형)">
      <div className="absolute h-[294px] left-0 top-[580px] w-[402px]" data-node-id="2001:751" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 402 294' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(2.0399e-14 -30.15 51.88 3.6255e-13 201 301.5)'><stop stop-color='rgba(99,91,255,0.3)' offset='0.014423'/><stop stop-color='rgba(160,144,248,0.65)' offset='0.11538'/><stop stop-color='rgba(220,196,242,1)' offset='0.21635'/><stop stop-color='rgba(211,209,255,1)' offset='0.3125'/><stop stop-color='rgba(245,246,249,1)' offset='1'/></radialGradient></defs></svg>\")" }} />
      <div className="absolute bottom-0 content-stretch flex flex-col h-[34px] items-center justify-end left-0 pb-[8px] w-[402px]" data-node-id="2001:752" data-name="Home Indicator">
        <div className="flex items-center justify-center relative shrink-0" data-node-id="I2001:752;106:60028">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-black h-[5px] relative rounded-[100px] w-[144px]" data-name="Home Indicator" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 content-stretch flex flex-col h-[34px] items-center justify-end left-0 pb-[8px] w-[402px]" data-node-id="2001:753" data-name="Home Indicator">
        <div className="flex items-center justify-center relative shrink-0" data-node-id="I2001:753;106:60028">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-black h-[5px] relative rounded-[100px] w-[144px]" data-name="Home Indicator" />
          </div>
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[#2540c7] h-[111px] left-0 rounded-bl-[36px] rounded-br-[36px] to-[#8da0ff] top-0 w-[402px]" data-node-id="2001:754" data-name="상단">
        <div className="absolute content-stretch flex h-[62px] items-center justify-center left-0 pt-[2.333px] px-[9px] right-0 top-0" data-node-id="2001:755" data-name="Status bar">
          <div className="content-stretch flex flex-[1_0_0] h-[13px] items-center justify-center min-w-px pr-[6px] relative" data-node-id="I2001:755;5465:16808" data-name="Time">
            <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="I2001:755;10465:42416" data-name="Frame">
              <p className="[word-break:break-word] font-['Pretendard:SemiBold'] leading-[22px] not-italic relative shrink-0 text-[17px] text-center text-white whitespace-nowrap" data-node-id="I2001:755;5465:16809">
                9:41
              </p>
            </div>
          </div>
          <div className="bg-black h-[37px] relative rounded-[100px] shrink-0 w-[125px]" data-node-id="I2001:755;10465:42998" data-name="Dynamic Island" />
          <div className="content-stretch flex flex-[1_0_0] h-[13px] items-center justify-center min-w-px pr-px relative" data-node-id="I2001:755;5465:16811" data-name="Levels">
            <div className="h-[13px] relative shrink-0 w-[85.329px]" data-node-id="I2001:755;10465:42533" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col h-[24px] items-center justify-center left-[20px] top-[72px]" data-node-id="2001:756" data-name="Icon/Normal/Chevron Left">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-clip relative" data-node-id="I2001:756;1690:1521" data-name="Ratio">
            <div className="flex flex-[1_0_0] items-center justify-center min-h-px relative w-[100px]" data-node-id="I2001:756;1690:1521;16215:17329">
              <div className="flex-none h-full rotate-[-19.47deg]">
                <div className="h-full relative w-[70.711px]" data-name="Ratio">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRatio} />
                </div>
              </div>
            </div>
          </div>
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconNormalChevronLeft} />
        </div>
        <p className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.5] left-[calc(50%-79px)] not-italic text-[16px] text-white top-[72px] tracking-[0.0912px] whitespace-nowrap" data-node-id="2001:757">
          AI 서비스 시장 현황 분석
        </p>
      </div>
      <div className="absolute bg-white border border-[#e1e7f2] border-solid h-[69px] left-[81px] overflow-clip rounded-[60px] top-[480px] w-[301px]" data-node-id="2001:758">
        <div className="absolute left-[261px] size-[24px] top-[21px]" data-node-id="2001:759" data-name="send">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSend} />
        </div>
        <p className="[word-break:break-word] absolute font-['Pretendard:Regular'] leading-[1.429] left-[17px] not-italic text-[14px] text-black top-[13px] tracking-[0.203px] w-[237px]" data-node-id="2001:762">
          이 자료를 바탕으로 AI 서비스 시장 현황을 분석해줘.
        </p>
      </div>
      <div className="absolute left-[20px] size-[48px] top-[501px]" data-node-id="2001:763">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1000012377} />
      </div>
      <div className="absolute bg-[#bebfff] content-stretch flex h-[30px] items-center justify-center left-[calc(25%+49.5px)] px-[12px] py-[6px] rounded-[20px] top-[134px] w-[92px]" data-node-id="2001:768">
        <p className="[word-break:break-word] font-['Pretendard:Regular'] leading-[1.385] not-italic relative shrink-0 text-[13px] text-right text-white tracking-[0.2522px] whitespace-nowrap" data-node-id="2001:769">
          2026.10.26
        </p>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-end left-1/2 top-[186px] w-[362px]" data-node-id="2001:770">
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-node-id="2001:771">
          <p className="[word-break:break-word] font-['Pretendard:Regular'] leading-[1.625] min-w-full not-italic relative shrink-0 text-[16px] text-black tracking-[0.0912px] w-[min-content]" data-node-id="2001:772">
            태훈님이 조사한 AI 서비스 사례를 요약했어요.
          </p>
          <div className="border border-[#edeeff] border-solid h-[213px] overflow-clip relative rounded-[16px] shrink-0 w-[362px]" data-node-id="2001:773" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 362 213' preserveAspectRatio='none'><g transform='matrix(-0.82493 10.65 -18.1 -0.78129 181 106.5)'><foreignObject x='-198' y='-198' width='395.99' height='395.99'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgb(7, 7, 8) 0%, rgb(12, 12, 21) 2.3438%, rgb(17, 17, 34) 4.6875%, rgb(28, 26, 59) 9.375%, rgb(38, 36, 85) 14.063%, rgb(48, 45, 110) 18.75%, rgb(66, 29, 130) 25.24%, rgb(84, 12, 150) 31.731%, rgb(65, 11, 114) 36.058%, rgb(45, 10, 79) 40.385%, rgb(26, 8, 43) 44.712%, rgb(17, 8, 26) 46.875%, rgb(7, 7, 8) 49.038%, rgb(12, 12, 21) 52.224%, rgb(17, 17, 34) 55.409%, rgb(28, 26, 59) 61.779%, rgb(38, 36, 85) 68.149%, rgb(48, 45, 110) 74.519%, rgb(38, 36, 85) 80.889%, rgb(28, 26, 59) 87.26%, rgb(17, 17, 34) 93.63%, rgb(12, 12, 21) 96.815%, rgb(7, 7, 8) 100%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")" }}>
            <div className="absolute bg-white h-[161px] left-[-1px] overflow-clip rounded-bl-[16px] rounded-br-[16px] top-[51px] w-[362px]" data-node-id="2001:774">
              <div className="absolute bg-[#f4f7fd] border border-[#ebefff] border-solid content-stretch flex gap-[4px] h-[40px] items-center left-[23px] px-[8px] py-[4px] rounded-[4px] top-[104px]" data-node-id="2001:775">
                <div className="relative shrink-0 size-[24px]" data-node-id="2001:776" data-name="App logo 106">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAppLogo106} />
                </div>
                <p className="[word-break:break-word] font-['Pretendard:Medium'] leading-[1.334] not-italic relative shrink-0 text-[#728198] text-[12px] text-right tracking-[0.3024px] whitespace-nowrap" data-node-id="2001:788">
                  경쟁업체 추가 모음.pptx
                </p>
              </div>
              <div className="[word-break:break-word] absolute font-['Pretendard:Regular'] leading-[0] left-[23px] not-italic text-[0px] text-black top-[15px] tracking-[0.0912px] whitespace-nowrap" data-node-id="2001:789">
                <p className="mb-0 text-[16px] whitespace-pre">
                  <span className="font-['Pretendard:Bold'] leading-[1.625]">서비스 A</span>
                  <span className="font-['Pretendard:Regular'] leading-[1.625]">{` - 자료 탐색 및 요약 지원`}</span>
                </p>
                <p className="mb-0 text-[16px] whitespace-pre">
                  <span className="font-['Pretendard:Bold'] leading-[1.625]">서비스 B</span>
                  <span className="font-['Pretendard:Regular'] leading-[1.625]">{` - 작업 자동화 및 실행 지원`}</span>
                </p>
                <p className="text-[16px] whitespace-pre">
                  <span className="font-['Pretendard:Bold'] leading-[1.625]">서비스 C</span>
                  <span className="font-['Pretendard:Regular'] leading-[1.625]">{` -  팀 내 정보 공유 및 협업 지원`}</span>
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.5] left-[22px] not-italic text-[16px] text-white top-[17px] tracking-[0.0912px] whitespace-nowrap" data-node-id="2001:790">
              AI 서비스 사례 요약
            </p>
            <div className="absolute left-[152px] size-[16px] top-[11px]" data-node-id="2001:791">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame5} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#353537] bottom-[0.05px] content-stretch flex flex-col items-center justify-end left-0 right-0" data-node-id="2001:794" data-name="Keyboard / KR / iOS">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I2001:794;16:3725" data-name="iOS Keyboard - KR">
          <div className="h-[235.84px] overflow-clip relative shrink-0 w-full" data-node-id="I2001:794;16:3726" data-name="Keyboard - KR">
            <div className="absolute h-[160.8px] left-[3.22px] right-[3.22px] top-[8.58px]" data-node-id="I2001:794;16:3727" data-name="Keyboard">
              <div className="absolute h-[45.024px] left-0 right-0 top-0" data-node-id="I2001:794;16:3728" data-name="Top Row">
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 pt-[2.144px] right-[calc(90%+5.25px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3729" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3729;2:4566">
                    <p className="leading-[normal]">ㅂ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(10%+1.18px)] pt-[2.144px] right-[calc(80%+5.15px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3730" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3730;2:4566">
                    <p className="leading-[normal]">ㅈ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(20%+1.29px)] pt-[2.144px] right-[calc(70%+3.97px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3731" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3731;2:4566">
                    <p className="leading-[normal]">ㄷ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(30%+2.47px)] pt-[2.144px] right-[calc(60%+3.86px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3732" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3732;2:4566">
                    <p className="leading-[normal]">ㄱ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(40%+2.57px)] pt-[2.144px] right-[calc(50%+2.68px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3733" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3733;2:4566">
                    <p className="leading-[normal]">ㅅ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(50%+3.75px)] pt-[2.144px] right-[calc(40%+2.57px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3734" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3734;2:4566">
                    <p className="leading-[normal]">ㅛ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(60%+3.86px)] pt-[2.144px] right-[calc(30%+2.47px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3735" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3735;2:4566">
                    <p className="leading-[normal]">ㅕ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(70%+3.97px)] pt-[2.144px] right-[calc(20%+1.29px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3736" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3736;2:4566">
                    <p className="leading-[normal]">ㅑ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(80%+5.15px)] pt-[2.144px] right-[calc(10%+1.18px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3737" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3737;2:4566">
                    <p className="leading-[normal]">ㅐ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(90%+5.25px)] pt-[2.144px] right-0 rounded-[5px] top-1/2" data-node-id="I2001:794;16:3738" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3738;2:4566">
                    <p className="leading-[normal]">ㅔ</p>
                  </div>
                </div>
              </div>
              <div className="absolute h-[45.024px] left-[20.9px] right-[20.9px] top-[57.89px]" data-node-id="I2001:794;16:3739" data-name="Middle Row">
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 pt-[2.144px] right-[calc(88.89%+5px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3740" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3740;2:4566">
                    <p className="leading-[normal]">ㅁ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(11.11%+1.43px)] pt-[2.144px] right-[calc(77.78%+5.72px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3741" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3741;2:4566">
                    <p className="leading-[normal]">ㄴ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(22.22%+0.71px)] pt-[2.144px] right-[calc(66.67%+4.29px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3742" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3742;2:4566">
                    <p className="leading-[normal]">ㅇ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(33.33%+2.14px)] pt-[2.144px] right-[calc(55.56%+2.86px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3743" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3743;2:4566">
                    <p className="leading-[normal]">ㄹ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(44.44%+3.57px)] pt-[2.144px] right-[calc(44.44%+3.57px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3744" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3744;2:4566">
                    <p className="leading-[normal]">ㅎ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(55.56%+2.86px)] pt-[2.144px] right-[calc(33.33%+2.14px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3745" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3745;2:4566">
                    <p className="leading-[normal]">ㅗ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(66.67%+4.29px)] pt-[2.144px] right-[calc(22.22%+0.71px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3746" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3746;2:4566">
                    <p className="leading-[normal]">ㅓ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(77.78%+5.72px)] pt-[2.144px] right-[calc(11.11%+1.43px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3747" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3747;2:4566">
                    <p className="leading-[normal]">ㅏ</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(88.89%+5px)] pt-[2.144px] right-0 rounded-[5px] top-1/2" data-node-id="I2001:794;16:3748" data-name="iOS /Key / Default">
                  <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3748;2:4566">
                    <p className="leading-[normal]">ㅣ</p>
                  </div>
                </div>
              </div>
              <div className="absolute h-[45.024px] left-0 right-0 top-[115.78px]" data-node-id="I2001:794;16:3749" data-name="Bottom Row">
                <div className="-translate-y-1/2 absolute bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 px-[6.432px] py-[8.576px] rounded-[5px] top-1/2 w-[47.168px]" data-node-id="I2001:794;16:3750" data-name="iOS /Key / Function">
                  <div className="relative shrink-0 size-[34.304px]" data-node-id="I2001:794;16:3750;3:3329" data-name="iOS / icon / Shift">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIOsIconShift} />
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute h-[45.024px] left-[62.18px] right-[63.25px] top-1/2" data-node-id="I2001:794;16:3751" data-name="Keys">
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-0 pt-[2.144px] right-[calc(85.71%+5.36px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3752" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3752;2:4566">
                      <p className="leading-[normal]">ㅋ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(14.29%+1.07px)] pt-[2.144px] right-[calc(71.43%+4.29px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3753" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3753;2:4566">
                      <p className="leading-[normal]">ㅌ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(28.57%+2.14px)] pt-[2.144px] right-[calc(57.14%+3.22px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3754" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3754;2:4566">
                      <p className="leading-[normal]">ㅊ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(42.86%+3.22px)] pt-[2.144px] right-[calc(42.86%+3.22px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3755" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3755;2:4566">
                      <p className="leading-[normal]">ㅍ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(57.14%+3.22px)] pb-[6.432px] pt-[2.144px] right-[calc(28.57%+2.14px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3756" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3756;2:4566">
                      <p className="leading-[normal]">ㅠ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(71.43%+4.29px)] pb-[5.36px] right-[calc(14.29%+1.07px)] rounded-[5px] top-1/2" data-node-id="I2001:794;16:3757" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3757;2:4566">
                      <p className="leading-[normal]">ㅜ</p>
                    </div>
                  </div>
                  <div className="-translate-y-1/2 absolute bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center left-[calc(85.71%+5.36px)] pb-[6.432px] pt-[2.144px] right-0 rounded-[5px] top-1/2" data-node-id="I2001:794;16:3758" data-name="iOS /Key / Default">
                    <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[23.58px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3758;2:4566">
                      <p className="leading-[normal]">ㅡ</p>
                    </div>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center px-[6.432px] py-[8.576px] right-0 rounded-[5px] top-1/2 w-[47.168px]" data-node-id="I2001:794;16:3759" data-name="iOS /Key / Function">
                  <div className="relative shrink-0 size-[34.304px]" data-node-id="I2001:794;16:3759;3:3329" data-name="iOS / icon / Shift">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIOsIconDelete} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute content-stretch flex gap-[6.432px] items-start left-[3.22px] right-[3.22px] top-[182.24px]" data-node-id="I2001:794;16:3760" data-name="Function Row">
              <div className="bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col items-center justify-center px-[6.432px] py-[8.576px] relative rounded-[5px] shrink-0 size-[45.024px]" data-node-id="I2001:794;16:3761" data-name="iOS /Key / Function">
                <div className="relative shrink-0 size-[34.304px]" data-node-id="I2001:794;16:3761;3:3329" data-name="iOS / icon / Shift">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIOsIconNumber} />
                </div>
              </div>
              <div className="bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center px-[6.432px] py-[8.576px] relative rounded-[5px] shrink-0 w-[46.096px]" data-node-id="I2001:794;16:3762" data-name="iOS /Key / Function">
                <div className="relative shrink-0 size-[34.304px]" data-node-id="I2001:794;16:3762;3:3329" data-name="iOS / icon / Shift">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIOsIconEmojis} />
                </div>
              </div>
              <div className="bg-[#727274] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-[1_0_0] h-[45.024px] items-center justify-center min-w-px pb-[1.072px] relative rounded-[5px]" data-node-id="I2001:794;16:3763" data-name="iOS / Key / Space">
                <div className="[word-break:break-word] flex flex-col font-['Apple_SD_Gothic_Neo:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[17.15px] text-center text-white whitespace-nowrap" data-node-id="I2001:794;16:3763;3:3321">
                  <p className="leading-[normal]">스페이스</p>
                </div>
              </div>
              <div className="bg-[#4e4e4e] content-stretch drop-shadow-[0px_1.072px_0px_black] flex flex-col h-[45.024px] items-center justify-center px-[6.432px] py-[8.576px] relative rounded-[5px] shrink-0 w-[97.552px]" data-node-id="I2001:794;16:3764" data-name="iOS /Key / Function">
                <div className="relative shrink-0 size-[34.304px]" data-node-id="I2001:794;16:3764;3:3329" data-name="iOS / icon / Shift">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIOsIconEnter} />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[76.112px] overflow-clip relative shrink-0 w-full" data-node-id="I2001:794;16:3765" data-name="Controller">
            <div className="-translate-y-1/2 absolute left-[23.58px] size-[42.88px] top-[calc(50%-4.82px)]" data-node-id="I2001:794;16:3767" data-name="iOS / icon / Global">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIOsIconGlobal} />
            </div>
            <div className="-translate-y-1/2 absolute right-[23.58px] size-[42.88px] top-[calc(50%-4.82px)]" data-node-id="I2001:794;16:3768" data-name="iOS / icon/Mic">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIOsIconMic} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}