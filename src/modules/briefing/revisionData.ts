// Document and feedback transcribed from Figma 7095:30297 (2026-10-15).
export const feedback = [
  {
    heading:'1. 서비스 목표', name:'유진', time:'4시간 전', source:'10.14 회의록', file:'doc',
    before:[
      '최근 AI 서비스는 개인의 작업 지원을 넘어 협업 과정의 정보와 업무를 연결하는 방향으로 발전하고 있다.',
      '마케팅 분야에서도 AI를 활용해 소비자의 관심사와 시장 트렌드를 분석하고, 브랜드에 적합한 마케팅 전략을 수립하는 방식이 확대되고 있다.',
    ],
    passage:'본 서비스는 AI를 활용해 다양한 마케팅 데이터를 분석하고, 사용자에게 유용한 정보와 아이디어를 제공하는 플랫폼이다.',
    emphasis:'분석한 정보를 어떻게 활용할 수 있는지', comment:'가 잘 안 보여.',
    suggestion:'본 서비스는 AI로 소비자 반응과 트렌드를 분석하고, 이를 바탕으로 브랜드에 적합한 캠페인 콘셉트와 구체적 마케팅 전략을 제안하는 플랫폼이다.',
    after:['이를 통해 사용자는 소비자의 관심과 요구를 보다 정확하게 파악하고, 브랜드의 메시지를 효과적으로 전달할 수 있다.'],
  },
  {
    heading:'2. 핵심 타깃', name:'유진', time:'3시간 전', source:'10.14 회의록', file:'doc', before:[],
    passage:'본 서비스는 브랜드 홍보와 마케팅 콘텐츠 제작에 관심이 있는 사용자를 대상으로 한다.',
    emphasis:'실제 마케팅에 어려움을 겪는 타깃', comment:'으로 좁히면 좋겠어.',
    suggestion:'주요 사용자는 자체 마케팅 인력이 부족해 소비자 트렌드 분석과 홍보 콘텐츠 제작에 어려움을 겪는 소규모 브랜드 운영자이다.',
    after:['소규모 브랜드 운영자부터 마케팅 담당자, 창업 준비생, 관련 분야를 공부하는 대학생까지 폭넓게 활용할 수 있으며, 소비자 트렌드를 파악하거나 새로운 캠페인 아이디어를 구상하는 과정에서 AI의 도움을 받고자 하는 사용자를 주요 대상으로 설정한다.'],
  },
  {
    heading:'3. 핵심 기능', name:'태훈', time:'8시간 전', source:'브랜드 아이덴티티 가이드', file:'pdf',
    before:[
      'AI 소비자 트렌드 분석',
      'AI가 SNS 콘텐츠와 소비자 반응 데이터를 분석하여 최근 주목받는 키워드와 관심사를 시각화한다.',
      '예를 들어 뷰티 브랜드의 경우 최근 소비자들이 관심을 보이는 제품 유형과 선호하는 콘텐츠 스타일을 확인할 수 있다.',
      '맞춤형 캠페인 추천',
      '사용자가 브랜드의 특성과 목표 소비자층을 설정하면 AI가 적합한 마케팅 콘셉트와 캠페인 아이디어를 제안한다.',
      '브랜드의 이미지와 소비자 특성을 고려하여 SNS 콘텐츠, 프로모션, 참여형 이벤트 등 다양한 방향을 추천한다.',
      '마케팅 콘텐츠 생성',
    ],
    passage:'선택한 캠페인 콘셉트를 바탕으로 AI가 홍보 문구와 콘텐츠 초안을 생성한다.',
    emphasis:'브랜드마다 분위기가 다른데, 그 특성', comment:'도 반영해야 해',
    suggestion:'AI는 브랜드의 기존 콘텐츠와 톤앤매너를 분석하여 고유한 이미지와 표현 방식을 유지하면서 홍보 문구와 콘텐츠 초안을 생성한다.',
    after:['사용자는 여러 문구와 시각적 콘셉트를 비교하고, 브랜드의 분위기에 맞게 수정하여 활용할 수 있다.'],
  },
] as const;

export type RevisionState = {reviewed:boolean[]; applied:boolean[]; completedAt?:string};
export const STORAGE_KEY='plotto-document-revision-v2';
export function readRevision():RevisionState {
  try {
    const saved=localStorage.getItem(STORAGE_KEY);
    const value=JSON.parse(saved||localStorage.getItem('plotto-document-revision-v1')||'null');
    if(value && ['reviewed','applied'].every(key=>Array.isArray(value[key]) && value[key].length===feedback.length && value[key].every((x:unknown)=>typeof x==='boolean')))
      return {reviewed:saved?value.reviewed:feedback.map(()=>false),applied:value.applied,completedAt:value.completedAt};
  } catch { /* A fresh state remains usable when storage is unavailable. */ }
  return {reviewed:feedback.map(()=>false),applied:feedback.map(()=>false)};
}
export function saveRevision(state:RevisionState) {
  localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,document:feedback.map((item,i)=>state.applied[i]?item.suggestion:item.passage)}));
}
