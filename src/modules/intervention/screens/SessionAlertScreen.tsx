const assetPathPrefix = "/assets/intervention";
const imgNameBellFillFalse = `${assetPathPrefix}/56759.svg`;
const imgImage3473 = `${assetPathPrefix}/2b675.png`;
const imgImage3492 = `${assetPathPrefix}/76cb0.png`;
const imgImage3470 = `${assetPathPrefix}/546e2.png`;
const imgImage3573 = `${assetPathPrefix}/68951.png`;
const imgFrame = `${assetPathPrefix}/8b917.svg`;
const imgEllipse323 = `${assetPathPrefix}/acd76.svg`;
const imgEllipse262 = `${assetPathPrefix}/cb6c2.svg`;
const imgNormal = `${assetPathPrefix}/00e17.svg`;
const imgEllipse325 = `${assetPathPrefix}/a3837.svg`;
const imgEllipse326 = `${assetPathPrefix}/62918.svg`;
const imgEllipse261 = `${assetPathPrefix}/ff5f9.svg`;
const imgEllipse324 = `${assetPathPrefix}/f1dd7.svg`;
const imgEllipse263 = `${assetPathPrefix}/13d51.svg`;
const imgEllipse264 = `${assetPathPrefix}/0edcb.svg`;
const imgEllipse265 = `${assetPathPrefix}/463be.svg`;
const imgEllipse266 = `${assetPathPrefix}/700d0.svg`;
const imgVector = `${assetPathPrefix}/4b44e.svg`;
const imgEllipse268 = `${assetPathPrefix}/ef6d0.svg`;

type IconNormalBellProps = {
  className?: string;
  fill?: "False";
  name?: "bell";
};

function IconNormalBell({ className }: IconNormalBellProps) {
  return (
    <div className={`${className ?? "relative"} size-[24px]`} data-node-id="2003:2080">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNameBellFillFalse} />
    </div>
  );
}

export default function SessionAlertScreen() {
  return (
    <div className="bg-white relative size-full" data-node-id="2003:2272" data-name="세션 알림">
      <div className="absolute bottom-0 content-stretch flex flex-col h-[34px] items-center justify-end left-0 pb-[8px] w-[402px]" data-node-id="2003:2273" data-name="Home Indicator">
        <div className="flex items-center justify-center relative shrink-0" data-node-id="I2003:2273;106:60028">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-black h-[5px] relative rounded-[100px] w-[144px]" data-name="Home Indicator" />
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex h-[62px] items-center justify-center left-[-0.1px] pt-[2.333px] px-[9px] top-0 w-[402px]" data-node-id="2003:2274" data-name="Status bar">
        <div className="content-stretch flex flex-[1_0_0] h-[13px] items-center justify-center min-w-px pr-[6px] relative" data-node-id="I2003:2274;5465:16808" data-name="Time">
          <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="I2003:2274;10465:42416" data-name="Frame">
            <p className="[word-break:break-word] font-['Pretendard:SemiBold'] leading-[22px] not-italic relative shrink-0 text-[17px] text-black text-center whitespace-nowrap" data-node-id="I2003:2274;5465:16809">
              9:41
            </p>
          </div>
        </div>
        <div className="bg-black h-[37px] relative rounded-[100px] shrink-0 w-[125px]" data-node-id="I2003:2274;10465:42998" data-name="Dynamic Island" />
        <div className="content-stretch flex flex-[1_0_0] h-[13px] items-center justify-center min-w-px pr-px relative" data-node-id="I2003:2274;5465:16811" data-name="Levels">
          <div className="h-[13px] relative shrink-0 w-[85.329px]" data-node-id="I2003:2274;10465:42533" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
          </div>
        </div>
      </div>
      <div className="absolute contents left-[-0.1px] top-[62px]" data-node-id="2003:2275">
        <div className="absolute content-stretch flex flex-col gap-[25px] h-[683px] items-start left-0 top-[337px] w-[402px]" data-node-id="2003:2276">
          <div className="h-[288px] relative shrink-0 w-full" data-node-id="2003:2277">
            <div className="absolute content-stretch flex h-[38px] items-center left-0 px-[20px] py-[8px] right-0 top-0" data-node-id="2003:2278">
              <p className="[word-break:break-word] font-['Pretendard:SemiBold'] leading-[22px] not-italic relative shrink-0 text-[#354052] text-[18px] whitespace-nowrap" data-node-id="2003:2279">
                열심히 일하고 있어요
              </p>
            </div>
            <div className="absolute h-[257px] left-0 right-0 top-[46px]" data-node-id="2003:2280">
              <div className="absolute content-stretch flex gap-[12px] h-[30px] items-center left-[20px] right-[20px] top-0" data-node-id="2003:2281">
                <div className="bg-[rgba(83,111,250,0.2)] border-[#536ffa] border-[1.5px] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[4px] relative rounded-[23px] shrink-0" data-node-id="2003:2282">
                  <p className="[word-break:break-word] font-['Pretendard:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="2003:2283">
                    마케팅 공모전
                  </p>
                </div>
                <div className="bg-[#ebedf6] border-[#c2c5cf] border-[1.5px] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[4px] relative rounded-[23px] shrink-0" data-node-id="2003:2284">
                  <p className="[word-break:break-word] font-['Pretendard:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="2003:2285">
                    청년 도움 프로젝트
                  </p>
                </div>
                <div className="bg-[#ebedf6] border-[#c2c5cf] border-[1.5px] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[4px] relative rounded-[23px] shrink-0" data-node-id="2003:2286">
                  <p className="[word-break:break-word] font-['Pretendard:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="2003:2287">
                    자원순환프로젝트
                  </p>
                </div>
                <div className="bg-[#ebedf6] border-[#c2c5cf] border-[1.5px] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[4px] relative rounded-[23px] shrink-0" data-node-id="2003:2288">
                  <p className="[word-break:break-word] font-['Pretendard:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="2003:2289">
                    아동자립캠프
                  </p>
                </div>
              </div>
              <div className="absolute h-[211px] left-[20px] overflow-x-auto overflow-y-clip top-[50px] w-[422px]" data-node-id="2003:2290">
                <div className="absolute h-[210.6px] left-[3.6px] top-0 w-[168.3px]" data-node-id="2003:2291">
                  <div className="absolute bg-white h-[158px] left-[0.4px] rounded-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.2)] top-[34px] w-[168px]" data-node-id="2003:2292" />
                  <div className="absolute bg-[#1c1a3c] h-[35.1px] left-[0.4px] rounded-bl-[20.7px] rounded-br-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.15)] top-[157px] w-[168.3px]" data-node-id="2003:2293" />
                  <p className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[calc(50%-69.75px)] not-italic text-[#95989f] text-[12.6px] top-[125px] tracking-[-0.0025px] whitespace-nowrap" data-node-id="2003:2294">
                    공모전 수상작 참고하여 정리
                  </p>
                  <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.445] left-[83.9px] not-italic text-[16.2px] text-black text-center top-[97px] tracking-[-0.0032px] whitespace-nowrap" data-node-id="2003:2295">
                    레퍼런스 정리
                  </p>
                  <div className="absolute contents left-[45.4px] top-[4px]" data-node-id="2003:2296">
                    <div className="absolute left-[48.03px] size-[75px] top-[6.16px]" data-node-id="2003:2297">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse323} />
                    </div>
                    <div className="absolute h-[50.915px] left-[61.48px] top-[18.39px] w-[49.837px]" data-node-id="2003:2298" data-name="image 3473">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img alt="" className="absolute h-[112.29%] left-[-240.55%] max-w-none top-[-7.75%] w-[344.16%]" src={imgImage3473} />
                      </div>
                    </div>
                    <div className="absolute left-[45.4px] size-[78.737px] top-[4px]" data-node-id="2003:2299">
                      <div className="absolute inset-[-4.3%]">
                        <img alt="" className="block max-w-none size-full" src={imgEllipse262} />
                      </div>
                    </div>
                  </div>
                  <div className="-translate-x-1/2 absolute contents left-[calc(50%+0.13px)] top-[164.59px]" data-node-id="2003:2300">
                    <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[94.66px] not-italic text-[13.758px] text-center text-white top-[164.59px] tracking-[-0.0028px] whitespace-nowrap" data-node-id="2003:2301">
                      진행도 100%
                    </p>
                    <div className="absolute inset-[79.3%_71.84%_13.58%_21.63%]" data-node-id="2003:2302" data-name="Normal">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNormal} />
                    </div>
                  </div>
                </div>
                <div className="absolute h-[210.6px] left-[187.9px] top-0 w-[168.3px]" data-node-id="2003:2303">
                  <div className="absolute bg-white h-[158px] left-[0.26px] rounded-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.2)] top-[34px] w-[168px]" data-node-id="2003:2304" />
                  <div className="absolute bg-[#1c1a3c] h-[35.1px] left-[0.26px] rounded-bl-[20.7px] rounded-br-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.15)] top-[157px] w-[168.3px]" data-node-id="2003:2305" />
                  <div className="absolute h-[63.644px] left-[55.03px] top-[17.99px] w-[62.296px]" data-node-id="2003:2306" data-name="image 3474" />
                  <p className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[calc(50%-52.89px)] not-italic text-[#95989f] text-[12.6px] top-[125px] tracking-[-0.0025px] whitespace-nowrap" data-node-id="2003:2307">
                    0922 회의 기반 수정
                  </p>
                  <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.445] left-[84.26px] not-italic text-[16.2px] text-black text-center top-[97px] tracking-[-0.0032px] whitespace-nowrap" data-node-id="2003:2308">
                    디자인 시안 수정
                  </p>
                  <div className="absolute contents left-[41.26px] top-0" data-node-id="2003:2309">
                    <div className="absolute left-[47.66px] size-[73.118px] top-[6.4px]" data-node-id="2003:2310">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse325} />
                    </div>
                    <div className="absolute left-[41.26px] size-[85px] top-0" data-node-id="2003:2311">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse326} />
                    </div>
                    <div className="absolute left-[41.26px] size-[85px] top-0" data-node-id="2003:2312">
                      <div className="absolute inset-[0_0_27.17%_0]">
                        <img alt="" className="block max-w-none size-full" src={imgEllipse261} />
                      </div>
                    </div>
                    <div className="absolute h-[47.527px] left-[53.14px] top-[19.2px] w-[59.409px]" data-node-id="2003:2313" data-name="image 3492">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img alt="" className="absolute h-[108.82%] left-[-7.65%] max-w-none top-[-5.88%] w-[130.59%]" src={imgImage3492} />
                      </div>
                    </div>
                  </div>
                  <div className="-translate-x-1/2 absolute contents left-[calc(50%-0.05px)] top-[164.59px]" data-node-id="2003:2314">
                    <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[94.6px] not-italic text-[13.758px] text-center text-white top-[164.59px] tracking-[-0.0028px] whitespace-nowrap" data-node-id="2003:2315">
                      진행도 60%
                    </p>
                    <div className="absolute inset-[79.3%_70.23%_13.58%_23.23%]" data-node-id="2003:2316" data-name="Normal">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNormal} />
                    </div>
                  </div>
                </div>
                <div className="absolute contents left-[372.2px] top-0" data-node-id="2003:2317">
                  <div className="absolute h-[210.6px] left-[372.2px] top-0 w-[168.3px]" data-node-id="2003:2318">
                    <div className="absolute bg-white h-[158px] left-[0.4px] rounded-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.15)] top-[34px] w-[168px]" data-node-id="2003:2319" />
                    <div className="absolute bg-[#1c1a3c] h-[35.1px] left-[0.4px] rounded-bl-[20.7px] rounded-br-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.15)] top-[157px] w-[168.3px]" data-node-id="2003:2320" />
                    <p className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[calc(50%-45.75px)] not-italic text-[#95989f] text-[12.6px] top-[125px] tracking-[-0.0025px] whitespace-nowrap" data-node-id="2003:2321">
                      프론트앤드 전달용
                    </p>
                    <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.445] left-[calc(50%+0.25px)] not-italic text-[16.2px] text-black text-center top-[97px] tracking-[-0.0032px] whitespace-nowrap" data-node-id="2003:2322">
                      GUI 제작
                    </p>
                    <div className="absolute contents left-[41.4px] top-0" data-node-id="2003:2323">
                      <div className="absolute contents left-[41.4px] top-0" data-node-id="2003:2324">
                        <div className="absolute left-[48.11px] size-[73.118px] top-[6.4px]" data-node-id="2003:2325">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse324} />
                        </div>
                        <div className="absolute left-[41.4px] size-[85px] top-0" data-node-id="2003:2326">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse326} />
                        </div>
                        <div className="absolute h-[44.177px] left-[54.3px] top-[18.66px] w-[55.327px]" data-node-id="2003:2327" data-name="image 3471">
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <img alt="" className="absolute h-[127.4%] left-[-99.04%] max-w-none top-[-17.31%] w-[305.18%]" src={imgImage3473} />
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-[38.844px] left-[49.31px] top-[3.66px] w-[73.434px]" data-node-id="2003:2328">
                        <div className="absolute inset-[-9.41%_-4.98%]">
                          <img alt="" className="block max-w-none size-full" src={imgEllipse263} />
                        </div>
                      </div>
                      <div className="absolute h-[38.844px] left-[49.31px] top-[3.66px] w-[73.434px]" data-node-id="2003:2329">
                        <div className="absolute inset-[-9.41%_-4.98%]">
                          <img alt="" className="block max-w-none size-full" src={imgEllipse264} />
                        </div>
                      </div>
                    </div>
                    <div className="-translate-x-1/2 absolute contents left-[calc(50%-0.35px)] top-[164.59px]" data-node-id="2003:2330">
                      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[94.3px] not-italic text-[13.758px] text-center text-white top-[164.59px] tracking-[-0.0028px] whitespace-nowrap" data-node-id="2003:2331">
                        진행도 40%
                      </p>
                      <div className="absolute inset-[79.3%_70.41%_13.58%_23.05%]" data-node-id="2003:2332" data-name="Normal">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNormal} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute h-[210.6px] left-[556.5px] top-0 w-[168.3px]" data-node-id="2003:2333">
                    <div className="absolute bg-white h-[158px] left-[0.26px] rounded-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.15)] top-[34px] w-[168px]" data-node-id="2003:2334" />
                    <div className="absolute bg-[#1c1a3c] h-[35.1px] left-[0.26px] rounded-bl-[20.7px] rounded-br-[20.7px] shadow-[0px_0px_5.4px_0px_rgba(0,0,0,0.15)] top-[157px] w-[168.3px]" data-node-id="2003:2335" />
                    <div className="absolute h-[63.644px] left-[55.03px] top-[17.99px] w-[62.296px]" data-node-id="2003:2336" data-name="image 3474" />
                    <p className="[word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[calc(50%-64.89px)] not-italic text-[#95989f] text-[12.6px] top-[125px] tracking-[-0.0025px] whitespace-nowrap" data-node-id="2003:2337">
                      팀원들 스케줄에 맞춰 정리
                    </p>
                    <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.445] left-[84.26px] not-italic text-[16.2px] text-black text-center top-[97px] tracking-[-0.0032px] whitespace-nowrap" data-node-id="2003:2338">
                      개발 일정 정리
                    </p>
                    <div className="absolute contents left-[41.26px] top-0" data-node-id="2003:2339">
                      <div className="absolute left-[47.66px] size-[73.118px] top-[6.4px]" data-node-id="2003:2340">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse325} />
                      </div>
                      <div className="absolute left-[41.26px] size-[85px] top-0" data-node-id="2003:2341">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse326} />
                      </div>
                      <div className="absolute h-[38.844px] left-[75.71px] top-[3.66px] w-[46.891px]" data-node-id="2003:2342">
                        <div className="absolute inset-[-9.41%_-7.8%]">
                          <img alt="" className="block max-w-none size-full" src={imgEllipse265} />
                        </div>
                      </div>
                      <div className="absolute h-[54.944px] left-[57.27px] top-[15.55px] w-[53.78px]" data-node-id="2003:2343" data-name="image 3473">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <img alt="" className="absolute h-[112.29%] left-[-240.55%] max-w-none top-[-7.75%] w-[344.16%]" src={imgImage3473} />
                        </div>
                      </div>
                      <div className="absolute h-[38.844px] left-[75.71px] top-[3.66px] w-[46.891px]" data-node-id="2003:2344">
                        <div className="absolute inset-[-9.41%_-7.8%]">
                          <img alt="" className="block max-w-none size-full" src={imgEllipse266} />
                        </div>
                      </div>
                    </div>
                    <div className="-translate-x-1/2 absolute contents left-[calc(50%-0.15px)] top-[164.59px]" data-node-id="2003:2345">
                      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:Medium'] leading-[1.445] left-[94.5px] not-italic text-[13.758px] text-center text-white top-[164.59px] tracking-[-0.0028px] whitespace-nowrap" data-node-id="2003:2346">
                        진행도 25%
                      </p>
                      <div className="absolute inset-[79.3%_69.99%_13.58%_23.47%]" data-node-id="2003:2347" data-name="Normal">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNormal} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="2003:2348">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="2003:2349">
              <div className="content-stretch flex items-center px-[20px] py-[8px] relative shrink-0 w-full" data-node-id="2003:2350">
                <p className="[word-break:break-word] font-['Pretendard:SemiBold'] leading-[22px] not-italic relative shrink-0 text-[#354052] text-[18px] whitespace-nowrap" data-node-id="2003:2351">
                  마감이 임박한 작업이에요!
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[10px] items-start px-[20px] py-[8px] relative shrink-0 w-full" data-node-id="2003:2352">
                <div className="border-[#bebfff] border-[1.5px] border-solid content-start flex flex-wrap items-start justify-between overflow-clip px-[14px] py-[16px] relative rounded-[20px] shrink-0 w-full" data-node-id="2003:2353">
                  <div aria-hidden className="absolute bg-gradient-to-r from-[rgba(222,219,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[20px] to-[rgba(239,195,255,0.5)]" />
                  <div className="[word-break:break-word] content-stretch flex flex-col font-['Pretendard:SemiBold'] gap-[8px] h-[44px] items-start not-italic relative shrink-0" data-node-id="2003:2354">
                    <p className="flex-[1_0_0] leading-[1.467] min-h-px relative text-[#070055] text-[15px] tracking-[0.144px] w-full" data-node-id="2003:2355">
                      기획안 수정하기
                    </p>
                    <p className="flex-[1_0_0] leading-[1.334] min-h-px relative text-[#929aaa] text-[12px] tracking-[0.3024px] w-full" data-node-id="2003:2356">
                      마케팅 공모전
                    </p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex font-['Pretendard:Medium'] gap-[4px] h-[22px] items-center leading-[1.385] not-italic relative shrink-0 text-[13px] tracking-[0.2522px] whitespace-nowrap" data-node-id="2003:2357">
                    <p className="relative shrink-0 text-[#ff3700]" data-node-id="2003:2358">
                      D-DAY
                    </p>
                    <p className="relative shrink-0 text-[#7c8494]" data-node-id="2003:2359">
                      ·
                    </p>
                    <p className="relative shrink-0 text-[#7c8494]" data-node-id="2003:2360">
                      30분 예상
                    </p>
                  </div>
                </div>
                <div className="border-[#bebfff] border-[1.5px] border-solid content-start flex flex-wrap items-start justify-between overflow-clip px-[14px] py-[16px] relative rounded-[20px] shrink-0 w-full" data-node-id="2003:2361">
                  <div aria-hidden className="absolute bg-gradient-to-r from-[rgba(222,219,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[20px] to-[rgba(239,195,255,0.5)]" />
                  <div className="[word-break:break-word] content-stretch flex flex-col font-['Pretendard:SemiBold'] gap-[8px] h-[44px] items-start not-italic relative shrink-0 whitespace-nowrap" data-node-id="2003:2362">
                    <p className="leading-[1.467] relative shrink-0 text-[#070055] text-[15px] tracking-[0.144px]" data-node-id="2003:2363">
                      디자인 피드백
                    </p>
                    <p className="leading-[1.334] relative shrink-0 text-[#929aaa] text-[12px] tracking-[0.3024px]" data-node-id="2003:2364">
                      청년 참여 프로젝트
                    </p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex font-['Pretendard:Medium'] gap-[4px] h-[22px] items-center leading-[1.385] not-italic relative shrink-0 text-[#7c8494] text-[13px] tracking-[0.2522px] whitespace-nowrap" data-node-id="2003:2365">
                    <p className="relative shrink-0" data-node-id="2003:2366">
                      D-1
                    </p>
                    <p className="relative shrink-0" data-node-id="2003:2367">
                      ·
                    </p>
                    <p className="relative shrink-0" data-node-id="2003:2368">
                      30분 예상
                    </p>
                  </div>
                </div>
                <div className="border-[#bebfff] border-[1.5px] border-solid content-start flex flex-wrap items-start justify-between overflow-clip px-[14px] py-[16px] relative rounded-[20px] shrink-0 w-full" data-node-id="2003:2369">
                  <div aria-hidden className="absolute bg-gradient-to-r from-[rgba(222,219,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[20px] to-[rgba(239,195,255,0.5)]" />
                  <div className="[word-break:break-word] content-stretch flex flex-col font-['Pretendard:SemiBold'] gap-[8px] h-[44px] items-start not-italic relative shrink-0 whitespace-nowrap" data-node-id="2003:2370">
                    <p className="leading-[1.467] relative shrink-0 text-[#070055] text-[15px] tracking-[0.144px]" data-node-id="2003:2371">
                      레퍼런스 정리
                    </p>
                    <p className="leading-[1.334] relative shrink-0 text-[#929aaa] text-[12px] tracking-[0.3024px]" data-node-id="2003:2372">
                      자원순환프로젝트
                    </p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex font-['Pretendard:Medium'] gap-[4px] h-[22px] items-center leading-[1.385] not-italic relative shrink-0 text-[#7c8494] text-[13px] tracking-[0.2522px] whitespace-nowrap" data-node-id="2003:2373">
                    <p className="relative shrink-0" data-node-id="2003:2374">
                      D-3
                    </p>
                    <p className="relative shrink-0" data-node-id="2003:2375">
                      ·
                    </p>
                    <p className="relative shrink-0" data-node-id="2003:2376">
                      30분 예상
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col items-start left-0 top-[110px] w-[402px]" data-node-id="2003:2377">
          <div className="content-stretch flex flex-col items-start overflow-clip px-[20px] py-[8px] relative rounded-[20px] shrink-0 w-full" data-node-id="2003:2378">
            <div className="content-stretch flex gap-[12px] items-center px-[20px] py-[24px] relative rounded-[24px] shrink-0 w-full" data-node-id="2003:2379" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 362 196' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-18.1 17.944 -33.142 -15.102 181 16.559)'><stop stop-color='rgba(48,45,110,1)' offset='0'/><stop stop-color='rgba(38,36,85,1)' offset='0.25'/><stop stop-color='rgba(28,26,59,1)' offset='0.5'/><stop stop-color='rgba(18,17,34,1)' offset='0.75'/><stop stop-color='rgba(12,12,21,1)' offset='0.875'/><stop stop-color='rgba(7,7,8,1)' offset='1'/></radialGradient></defs></svg>\")" }}>
              <div className="content-stretch flex flex-col gap-[18px] items-start relative shrink-0 w-[205px]" data-node-id="2003:2380">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 text-white w-full" data-node-id="2003:2381">
                  <p className="font-['Pretendard:Light'] leading-[26px] relative shrink-0 text-[15px] w-full" data-node-id="2003:2382">
                    09/29 Tue
                  </p>
                  <div className="font-['Pretendard:SemiBold'] leading-[0] relative shrink-0 text-[20px] w-full" data-node-id="2003:2383">
                    <p className="leading-[30px] mb-0">서연님이 자리를 비운 동안</p>
                    <p className="leading-[30px]">회의가 진행됐어요</p>
                  </div>
                </div>
                <div className="h-[38px] overflow-clip relative rounded-[32px] shrink-0 w-[103px]" data-node-id="2003:2384" style={{ backgroundImage: "linear-gradient(270deg, rgb(186, 184, 255) 0%, rgb(180, 225, 255) 40.919%, rgb(232, 246, 255) 76.67%, rgb(199, 233, 255) 89.494%)" }}>
                  <p className="[word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[26px] left-[15px] not-italic text-[#111] text-[16px] top-[6px] whitespace-nowrap" data-node-id="2003:2385">
                    브리핑 보기
                  </p>
                </div>
              </div>
              <div className="h-[125px] relative shrink-0 w-[109px]" data-node-id="2003:2386" data-name="image 3470">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[110.04%] left-[-33.65%] max-w-none top-[-7.28%] w-[152.11%]" src={imgImage3470} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute h-[48px] left-[-0.1px] overflow-clip top-[62px] w-[402px]" data-node-id="2003:2387" data-name="헤더">
          <div className="-translate-y-1/2 absolute h-[20px] left-[20px] top-1/2 w-[72px]" data-node-id="2003:2388" data-name="Vector">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
          </div>
          <IconNormalBell className="absolute left-[358px] top-[12px]" />
          <div className="absolute left-[372.1px] size-[10px] top-[10px]" data-node-id="2003:2390">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse268} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(0,0,0,0.5)] h-[874px] left-0 top-0 w-[402px]" data-node-id="2003:2391" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white h-[291px] left-1/2 overflow-clip rounded-[16px] top-[calc(50%+7.5px)] w-[344px]" data-node-id="2003:2392">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:SemiBold'] leading-[1.445] left-1/2 not-italic text-[18px] text-black text-center top-[26px] tracking-[-0.0036px] whitespace-nowrap" data-node-id="2003:2393">
          공동세션 시간이에요.
        </p>
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Pretendard:Regular'] leading-[1.467] left-[calc(50%-1px)] not-italic text-[15px] text-black text-center top-[61px] tracking-[0.144px] whitespace-nowrap" data-node-id="2003:2394">
          태훈님과 함께 세션을 진행해요.
        </p>
        <div className="-translate-x-1/2 absolute h-[100px] left-[calc(50%-0.5px)] top-[109px] w-[117px]" data-node-id="2003:2395" data-name="image 3573" style={{ animation: "hold 3s ease-in-out infinite" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[190.69%] left-[-127.24%] max-w-none top-[-1.87%] w-[243.42%]" src={imgImage3573} />
          </div>
        </div>
        <div className="absolute bg-[#536ffa] border border-[#ebf0fd] border-solid content-stretch flex h-[48px] items-center justify-center left-[38px] rounded-[30px] top-[225px] w-[262px]" data-node-id="2003:2396">
          <p className="[word-break:break-word] font-['Pretendard:SemiBold'] leading-[1.5] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[0.0912px] whitespace-nowrap" data-node-id="2003:2397">
            공동세션 하러가기
          </p>
        </div>
      </div>
    </div>
  );
}