# WORK_STATUS_GUIDE

다이얼(홈 벨 점, 현재 업무 강조)이 읽는 공통 업무 상태 사용 가이드입니다.

- 파일: `src/workStatus.ts` (다른 파일은 수정하지 않고 가져다 쓰기만 하면 됩니다)
- 저장 위치: 새 값은 `sessionStorage['plotto-work-status-v1']`. 기존 `journey`(`plotto-journey`)와 `revisionData`(`plotto-document-revision-v2`)는 복사하지 않고 그대로 읽습니다.
- 값 출처는 `getWorkStatus().sources`에서 `journey` / `revision` / `dummy`로 확인할 수 있습니다. `dummy`는 아직 실제 화면이 기록하지 않는 값입니다.

## 1. 이미 연결됨 (추가 작업 없음)

| 상태 | 기록하는 곳 | 기록 시점 |
|---|---|---|
| 수정 의견 읽음 (`opinions.unread`) | `briefing/DocumentReview` → `revisionData.reviewed[]` | 의견을 확인했을 때 |
| 수정 완료 (`revisionCompleted`) | `briefing/DocumentReview` → `revisionData.completedAt` | "수정 끝내기" |
| 문서 공유 (`documentShared`) | `briefing/DocFlow` → `journey.sharedWith` | "공유하기" |
| 예약 여부·시간 (`sessionReserved`, `sessionTime`) | `booking` → `journey.sessionTime` | 메시지 전송 완료 |
| 세션 종료 (`sessionFinished`) | `session` → `journey.sessionFinished` | 세션 종료 |

수정 완료와 의견 읽음은 별도 값입니다. 의견을 안 읽고 끝내면 `revisionCompleted=true`, `opinions.unread>0`이 됩니다.

## 2. 담당자가 호출해야 하는 함수 (아직 아무도 호출하지 않음)

```ts
import { recordMaterialChecked, markNotificationRead, recordSessionProposed, recordActivity } from "<상대경로>/workStatus";
```

| 함수 | 담당 화면 | 호출 시점 | 효과 |
|---|---|---|---|
| `recordMaterialChecked()` | 자료 확인(feedback 등) | 사용자가 자료를 실제로 확인했을 때 | 자료 확인 `true`, 마지막 활동 시각 갱신 |
| `markNotificationRead(id)` | 알림이 가리키는 항목을 여는 화면 | 해당 항목을 실제로 열었을 때. 현재 id는 `'taehun-files'` | 읽지 않은 알림 감소 → 홈 벨 점 숨김 |
| `recordSessionProposed()` | 공동 세션 제안(proposal) | 제안을 사용자에게 보냈을 때 | 세션 제안 `true`, 마지막 활동 시각 갱신 |
| `recordActivity()` | 업무를 수행하는 모든 화면 | 사용자가 실제 작업을 했을 때 | 마지막 활동 시각 갱신 |

화면에 진입하거나 버튼을 누른 것만으로는 호출하지 않습니다. 실제 행동이 끝난 시점에 호출합니다.

```tsx
// 예: 파일 알림이 가리키는 화면에서 파일 목록을 열었을 때
const open = () => {
  markNotificationRead("taehun-files");
  recordActivity();
  setOpened(true);
};
```

## 3. 상태를 화면에 반영할 때

```tsx
import { useWorkStatus } from "<상대경로>/workStatus";

function Example() {
  const [work, refresh] = useWorkStatus();
  // 복귀 시 다시 읽으려면: useEffect(refresh, [someOpenFlag, refresh]);
  return work.unreadNotifications > 0 ? <Dot /> : null;
}
```

React 밖에서는 `getWorkStatus()`를 사용합니다. `go()`로 이동하면 전체 새로고침이므로 React state는 사라지고 위 저장소 값만 남습니다.

### 주요 필드

| 필드 | 의미 |
|---|---|
| `unreadNotifications`, `notifications[]` | 읽지 않은 알림 수와 목록 (현재 더미 1건) |
| `opinions { total, reviewed, unread }` | 수정 의견 읽음 현황 |
| `revisionCompleted`, `documentShared` | 수정 완료, 공유 완료 |
| `currentStep` | 현재 업무 카드. `'now'`(수정 완료 전) → `'next'`(수정 완료 후) → `'extra'`(공유 완료 후) |
| `sessionProposed`, `sessionReserved`, `sessionTime`, `sessionFinished` | 공동 세션 상태 |
| `lastActivityAt` | 마지막 업무 활동 시각 (더미 기준값 + 실제 수정 완료 시각) |

## 4. 다른 담당자가 이어서 연결할 곳

- **홈 벨 점**: `briefing/App.tsx`의 `Home`은 이미 `unreadNotifications`에 연결됨. `modules/intervention/screens/HomeScreen.tsx` 464~477행의 벨 점(`imgEllipse269`)은 해당 담당자가 `useWorkStatus()`로 `work.unreadNotifications > 0` 조건만 붙이면 됩니다.
- **다이얼**: `currentStep`은 이미 강조 테두리에 연결됨. 사용자가 탐색 중인 카드(`activeIdx`, `aria-current`)와 별개입니다.

## 5. 더미 값을 실제 데이터로 교체할 때

`workStatus.ts`의 `DUMMY_NOTIFICATIONS`, `DUMMY_IDLE_MS`, 저장 필드(`materialChecked`, `readNotificationIds`, `lastActivityAt`, `sessionProposed`)만 바꾸면 됩니다. 화면 쪽은 `getWorkStatus()`의 반환 형태가 같으면 수정할 필요가 없습니다.

## 6. 테스트

```js
// 브라우저 콘솔
const m = await import('/src/workStatus.ts');
m.getWorkStatus();            // 현재 상태
m.markNotificationRead('taehun-files');
m.resetWorkStatus();          // 이 모듈의 저장 값만 초기화
```

## Extra / Next detail (src/modules/briefing/StepDetails.tsx)

The dial's Next and Extra cards now open a detail screen. Everything shown is derived from `getWorkStatus()`; no click counters.

| Extra phase (`work.extraPhase`) | Condition | Who records it | Status |
|---|---|---|---|
| resume | default | - | connected |
| proposed | `sessionProposed` | proposal owner calls `recordSessionProposed()` when the proposal is shown | **not called yet** (stays resume) |
| reserved | `journey.sessionTime` | booking (already) | connected |
| joinable | reserved + `sessionJoinable` | session owner calls `recordSessionJoinable()` when the reminder allows entry | **not called yet** (stays reserved) |
| finished | `journey.sessionFinished` | session (already) | connected |

- Material read: the "태훈님이 전달한 자료" row calls `markNotificationRead('taehun-files')` + `recordMaterialChecked()` and goes to `feedback` (bell dot and row dot disappear).
- Session result (decision / next action): `recordSessionResult({ decision, nextAction })` by the session owner. Without it, the finished phase shows only the session (topic and time).
- Briefing check: the finished phase's "브리핑 보기" calls `recordBriefingChecked()` and opens the dial's Before detail. When the session is finished and its briefing checked, `workComplete` is true and the dial's orange ring is removed.
- Next: share button is disabled until `revisionCompleted`; it opens the existing DocFlow (review step). Opening DocFlow directly at the share step needs `initialStep` in DocFlow.tsx (other owner, not changed).
- Reserved date: only the time is recorded by booking; the screen shows "오늘 {time}" (matches the booking message). A real date needs booking to record it.

## 독립 시연 레이어 (demoScenario.ts)

다른 담당자의 writer가 없는 구간만 `src/modules/briefing/demoScenario.ts`에서 대신합니다. 실제 값이 있으면 항상 실제 값이 우선합니다.

| 상태 | 시연용 대체 규칙 | 실제 연동 시 |
| --- | --- | --- |
| 공동세션 제안(proposed) | 사용자가 Extra에서 "이어서 하기"를 누르면 활성화 | `recordSessionProposed()` 호출 |
| 참여 가능(joinable) | 예약이 다이얼에 처음 보인 뒤 10초 | `recordSessionJoinable()` 호출 |
| 세션 결과 | `DEMO_SESSION_RESULT` | `recordSessionResult(r)` 호출 |

- 처음부터 다시: `mobile.html?flow=briefing&demoReset=1`
- 제거: demoScenario.ts 삭제, App.tsx의 import와 `useDemoWork`/`consumeDemoReset`/`onResumeEntered` 제거
- 세션 결과 브리핑은 Before 회의록과 연결하지 않고 Extra 안에서 결정 사항/다음 할 일로 표시합니다.

- Next의 "공유하기"(수정 완료 후)는 `ShareEntry.tsx`로 공유 단계에 바로 연결됩니다. DocFlow의 공유 단계를 복제한 임시 파일이며, DocFlow가 공유 단계를 직접 열 수 있게 되면 삭제하고 App.tsx의 `shareOpen`을 DocFlow로 교체합니다.

## 메시지 탭 (홈 GNB 3번째)

`src/modules/briefing/messages/` (briefing 모듈 안의 오버레이, 공유 라우터·타 담당 파일 미수정)

| 파일 | 역할 |
| --- | --- |
| `Messages.tsx` | 메시지 메인(프로필·접속 표시·팀 채팅·개인 채팅·AI 작업 기록), 프로필 바텀시트 |
| `ChatRoom.tsx` | 개인/전체 채팅방 (로컬 저장, 직접 입력·전송) |
| `AiChat.tsx` | 업무별 AI 채팅 UI (응답 로직 없음) |
| `mockAi.ts` | 목 AI. `getAiReply()` 한 함수만 실제 API(자체 백엔드 경유)로 교체. API 키는 프론트에 두지 않음 |
| `store.ts` | 대화·읽음·마지막 활동 저장(`plotto-messages-v1`). 다이얼 "이어서 하기"도 같은 업무 기록(`market`)을 사용 |
| `data.ts` | 더미 데이터: 접속 상태(`getPresence`), 팀원 업무, 시드 대화 |

- 공동세션 제안 단계에 도달하면 `recordSessionProposed()`로 업무 상태 갱신 후 기존 제안 화면(`proposal`)으로 이동합니다.
- 프로필의 "공동세션"은 `setSessionParticipant()`로 참여자를 저장하고 기존 예약 화면(`booking`)으로 이동합니다. 예약 화면이 이 값을 읽도록 하는 것은 해당 담당자 작업입니다(현재 예약 화면은 태훈 고정).
- 프로젝트 화면 등 다른 담당자 화면의 GNB 채팅 아이콘은 그대로 기존 동작입니다.

### 이어하기 · 공동세션 연결 (메시지 탭 연동)

- 다이얼 Extra의 "이어서 하기"는 메시지 탭의 `market` AI 기록(`plotto-messages-v1`)을 그대로 열어 같은 대화·단계를 보여줍니다.
- 추천 질문과 의미가 유사한 입력(키워드 그룹 또는 유사도 0.5 이상)만 단계가 진행되고, 무관한 입력은 안내 답변만 하며 단계는 유지됩니다.
- 공동세션 제안 단계 도달 시 다이얼(Extra `proposed`)과 메시지 목록("공동세션 제안 · 시간")에 함께 반영됩니다.
- 예약 연결용 데이터: `sessionStorage['plotto-session-participants-v1']` = `{ids:["yu"], names:["유진"], source:"profile"|"group", at}`. 프로필은 1명, 단체 채팅은 `["tae","yu"]`. 예약 화면 담당자는 이 값을 읽어 참여자 표시에 사용하면 됩니다(현재 예약 화면은 태훈 고정이라 미반영).

### GNB 연결 규칙

| 슬롯 | 목적지 |
| --- | --- |
| 1 홈 | `briefing` 홈 |
| 2 프로젝트 | `project` |
| 3 메시지 | `go('briefing','messages')` (메시지 메인 화면) |
| 4 내 정보 | 아직 화면 없음 (project는 안내 토스트, 나머지는 동작 없음) |

- `src/gnbRoutes.ts`(공통 연결부, `mobile.tsx`에서 설치)가 project 화면 GNB의 "채팅" 버튼을 메시지 메인으로 보냅니다. project 담당자가 `project/App.tsx`의 `go('intervention','chat')`(GNB 버튼 1곳)을 `go('briefing','messages')`로 바꾸면 이 파일은 삭제해도 됩니다. 같은 파일의 헤더 "이어서 하기" 버튼은 별개 기능이라 그대로 둡니다.
- session 홈 하단 메뉴(홈/프로젝트/공동세션/내 작업)는 공동세션 리마인더 기능이 3번째 슬롯이라 건드리지 않았습니다. 통일하려면 session 담당자가 `session/App.tsx`의 3번째 버튼 `onClick`을 `go('briefing','messages')`로 바꾸면 됩니다(리마인더 진입은 다른 경로 필요).

- AI 채팅에서 공동세션 제안 단계에 도달하면 `proposal` 화면으로 이동하지 않고, 같은 디자인의 제안 시트(`messages/ProposalSheet.tsx`)를 채팅 위에 띄웁니다. "공동세션 예약하기"는 `{ids:["tae"], source:"ai"}` 저장 후 `booking`으로 이동합니다.
- 메시지 탭의 모든 채팅(AI 업무 채팅, 전체/개인 채팅)은 `messages/ChatShell.tsx` 한 곳의 틀(그라데이션 헤더, 하단 글로우, 마이크+흰 입력창)을 씁니다. 원본 Plotto 채팅 화면의 시각 복제이며 원본 파일은 수정하지 않았습니다.

### 알림 · 마이페이지 (배포본과 맞춤)

- 배포본(Vercel)은 `public/extra-screens.js`(알림 벨, 마이페이지)를 `mobile.html`에서 불러와 덧씌웁니다. 이 저장소에는 그 파일이 없어 로컬에서는 보이지 않았고, 메시지 화면에는 벨도 없었습니다.
- 반영: `public/extra-screens.js`와 `public/extra/`를 배포본과 동일하게 복사하고 `mobile.html`에 `<script src="/extra-screens.js" defer>` 한 줄을 추가했습니다. 메시지 화면 헤더에 홈과 같은 벨(`img[alt="알림"]`, 안 읽은 알림 점)을 넣었고, GNB 4번째 아이콘은 nav의 마지막 `img`라서 같은 스크립트가 마이페이지를 엽니다.
- GNB 메시지 아이콘(활성)은 전달받은 `chat.svg`를 `public/assets/briefing/chat-active.svg`로 넣어 사용합니다.
