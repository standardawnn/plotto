// 홈 데이터 (데모). 프로젝트마다 진행 중인 작업 4개, 마감 임박 작업은 가로로 넘겨 본다.
export const PROJECT_CHIPS = ["마케팅 공모전", "청년 도움 프로젝트", "자원순환프로젝트", "아동자립캠프"] as const;

export type HomeTask = {
  id: string; project: string; title: string; status: string; pct: number; char: string;
  /** 팝업 진행 단계 3개 [제목, 설명] */
  steps: [string, string][];
};

const X = "/extra/";
export const TASKS: HomeTask[] = [
  // 마케팅 공모전
  { id: "mk-ref", project: "마케팅 공모전", title: "레퍼런스 정리", status: "팀원에게 자료 전달 대기 중", pct: 100, char: `${X}p3.png`, steps: [] },
  { id: "mk-design", project: "마케팅 공모전", title: "디자인 시안 수정", status: "수정안 작성 중", pct: 60, char: `${X}desk.png`, steps: [] },
  { id: "mk-copy", project: "마케팅 공모전", title: "홍보 문구 작성", status: "카피 초안 작성 중", pct: 40, char: `${X}q1.png`,
    steps: [["브랜드 톤 정리", "기획안의 핵심 메시지와 말투를 정리했어요"], ["카피 초안 작성", "SNS용 홍보 문구 초안을 쓰고 있어요"], ["팀원 검토 요청", "초안이 완성되면 팀원에게 검토를 요청해요"]] },
  { id: "mk-deck", project: "마케팅 공모전", title: "발표 자료 구성", status: "목차 정리 중", pct: 25, char: `${X}q2.png`,
    steps: [["발표 목차 정리", "기획안 흐름에 맞춰 발표 목차를 잡고 있어요"], ["슬라이드 초안", "목차별로 넣을 내용을 슬라이드에 배치해요"], ["유진님에게 전달", "PPT 제작을 맡은 유진님에게 전달해요"]] },
  // 청년 도움 프로젝트
  { id: "yh-gui", project: "청년 도움 프로젝트", title: "GUI 제작", status: "프론트엔드 전달용 제작 중", pct: 40, char: `${X}tablet.png`,
    steps: [["화면 구조 정리", "주요 화면과 이동 흐름을 정리했어요"], ["GUI 디자인", "메인·상세 화면 GUI를 만들고 있어요"], ["프론트엔드 전달", "완성되면 개발 담당에게 전달해요"]] },
  { id: "yh-schedule", project: "청년 도움 프로젝트", title: "개발 일정 정리", status: "팀원 스케줄 취합 중", pct: 25, char: `${X}q2.png`,
    steps: [["팀원 스케줄 취합", "팀원별 가능한 시간을 모으고 있어요"], ["개발 일정표 작성", "기능별 개발 순서와 기간을 정리해요"], ["팀원에게 공유", "확정된 일정을 팀원에게 공유해요"]] },
  { id: "yh-interview", project: "청년 도움 프로젝트", title: "사용자 인터뷰 정리", status: "인사이트 정리 중", pct: 80, char: `${X}p3.png`,
    steps: [["인터뷰 녹취 정리", "인터뷰 5건의 녹취를 정리했어요"], ["인사이트 도출", "공통으로 나온 불편함을 묶어서 정리하고 있어요"], ["기획 반영 요청", "정리가 끝나면 기획 담당에게 전달해요"]] },
  { id: "yh-feedback", project: "청년 도움 프로젝트", title: "디자인 피드백 반영", status: "피드백 3건 반영 중", pct: 60, char: `${X}desk.png`,
    steps: [["피드백 정리", "팀원들이 남긴 디자인 의견 3건을 정리했어요"], ["시안 반영", "컬러·타이포·아이콘 의견을 시안에 반영하고 있어요"], ["팀원 확인 요청", "반영이 끝나면 팀원에게 확인을 요청해요"]] },
  // 자원순환프로젝트
  { id: "rc-poster", project: "자원순환프로젝트", title: "캠페인 포스터 시안", status: "시안 2종 제작 중", pct: 60, char: `${X}desk.png`,
    steps: [["캠페인 메시지 정리", "분리배출 캠페인의 핵심 문구를 정했어요"], ["포스터 시안 제작", "시안 2종을 만들고 있어요"], ["팀원 투표", "완성되면 팀원 투표로 최종안을 골라요"]] },
  { id: "rc-pickup", project: "자원순환프로젝트", title: "수거 일정 정리", status: "지역별 수거 요일 확인 중", pct: 25, char: `${X}q2.png`,
    steps: [["지역별 요일 확인", "구청 공지에서 지역별 수거 요일을 확인하고 있어요"], ["일정표 정리", "한눈에 볼 수 있는 표로 정리해요"], ["홍보물에 반영", "정리한 일정을 홍보물에 넣어요"]] },
  { id: "rc-ref", project: "자원순환프로젝트", title: "레퍼런스 정리", status: "캠페인 사례 수집 중", pct: 70, char: `${X}p3.png`,
    steps: [["캠페인 사례 수집", "다른 지역의 자원순환 캠페인 사례를 모았어요"], ["레퍼런스 파일 정리", "사례별로 메시지와 홍보 방식을 정리하고 있어요"], ["팀원에게 전달", "정리가 끝나면 팀원에게 전달해요"]] },
  { id: "rc-survey", project: "자원순환프로젝트", title: "설문지 제작", status: "팀원 검토 대기 중", pct: 100, char: `${X}check.png`,
    steps: [["문항 구성", "분리배출 습관을 묻는 문항 12개를 만들었어요"], ["설문지 완성", "설문 폼으로 옮겨 응답 흐름을 확인했어요"], ["팀원 검토", "팀원 검토를 기다리고 있어요"]] },
  // 아동자립캠프
  { id: "cc-program", project: "아동자립캠프", title: "프로그램 기획", status: "3일차 활동 구성 중", pct: 40, char: `${X}q1.png`,
    steps: [["일정 뼈대 잡기", "3박 4일 일정의 큰 틀을 잡았어요"], ["활동 구성", "3일차 활동을 구성하고 있어요"], ["팀원 검토 요청", "완성되면 팀원에게 검토를 요청해요"]] },
  { id: "cc-roster", project: "아동자립캠프", title: "참가자 명단 정리", status: "보호자 확인 대기 중", pct: 100, char: `${X}check.png`,
    steps: [["신청서 취합", "참가 신청서 24건을 모았어요"], ["명단 확정", "신청서 기반으로 명단을 확정했어요"], ["보호자 확인", "보호자 확인 문자 회신을 기다리고 있어요"]] },
  { id: "cc-supplies", project: "아동자립캠프", title: "준비물 목록 작성", status: "항목별 수량 확인 중", pct: 60, char: `${X}stand.png`,
    steps: [["준비물 항목 정리", "활동별로 필요한 준비물을 정리했어요"], ["수량 확인", "참가 인원에 맞춰 수량을 확인하고 있어요"], ["구매 요청", "확인이 끝나면 담당자에게 구매를 요청해요"]] },
  { id: "cc-notice", project: "아동자립캠프", title: "안내문 작성", status: "초안 작성 중", pct: 25, char: `${X}tablet.png`,
    steps: [["안내 항목 정리", "일정·준비물·연락처 등 안내할 항목을 모으고 있어요"], ["안내문 디자인", "보호자용 안내문으로 정리해요"], ["보호자에게 발송", "완성되면 보호자에게 보내요"]] },
];

// 마감 임박 작업은 모두 같은 카드형 팝업(TaskSheet)으로 연다.
export type DeadlineSheet = "plan" | "feedback" | "refcheck" | "guicheck";
export type Deadline = { title: string; project: string; due: string; hot?: boolean; sheet: DeadlineSheet };
export const DEADLINES: Deadline[] = [
  { title: "기획안 수정하기", project: "마케팅 공모전", due: "D-DAY", hot: true, sheet: "plan" },
  { title: "디자인 피드백", project: "청년 참여 프로젝트", due: "D-1", sheet: "feedback" },
  { title: "레퍼런스 정리", project: "자원순환프로젝트", due: "D-3", sheet: "refcheck" },
  { title: "GUI 제작", project: "청년 도움 프로젝트", due: "D-5", sheet: "guicheck" },
];

/** 진행도 바 색: 높을수록 진하게 (시안: 100% #3524dd, 60% #6c63ff) */
export function barColor(pct: number) {
  return pct >= 100 ? "#3524dd" : pct >= 60 ? "#6c63ff" : pct >= 40 ? "#8a83ff" : "#a8a3ff";
}
