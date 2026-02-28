# Operation Tera-Fab

> AI 칩 설계 시뮬레이션 RPG

차세대 AI 프로세서를 설계하는 플로어플래닝 퍼즐 게임입니다.
캐논 마르코의 가이드를 따라 칩 위에 IP 블록을 배치하고, 최고의 PPA(Performance, Power, Area) 점수를 달성하세요.

## 플레이

**[https://ai-chipgame.vercel.app](https://ai-chipgame.vercel.app)**

## 스크린샷

```
┌───────────────────────────────────┐
│  OPERATION TERA-FAB               │
│  ┌───┬───┬───┐   PPA METRICS     │
│  │ T │ R │ T │   Performance  72  │
│  ├───┼───┼───┤   Power Eff.   68  │
│  │ C │ T │ S │   Area         55  │
│  ├───┼───┼───┤                    │
│  │   │ R │ N │   TOTAL        65  │
│  └───┴───┴───┘                    │
└───────────────────────────────────┘
```

## 게임 개요

- **Lv.1** — 3×3 그리드에서 기본 로직 설계 (T, C, R 블록)
- **Lv.2** — 5×5 그리드에서 NPU 탑재 AI 칩 설계 (T, S, N, C, R 블록)
- **튜토리얼** — 13단계 대화형 가이드로 초보자도 쉽게 시작

## IP 블록

| 키 | 이름 | 설명 |
|-----|------|------|
| **T** | 로직 블록 | 수십억 트랜지스터로 구성된 연산 IP 블록 |
| **S** | SRAM | 고속 온칩 메모리. NPU 인접 시 성능 대폭 향상 |
| **N** | NPU | 신경처리장치. AI 추론의 핵심 |
| **C** | 컨트롤러 | I/O 버스 컨트롤러. 다이 가장자리 배치 권장 |
| **R** | 라우팅 | 블록 간 데이터를 전달하는 인터커넥트 |

## PPA 스코어링

실제 반도체 설계 원리를 반영한 채점 시스템:

- **Performance** — BFS 경로 효율 + 인접 시너지 보너스 + 크리티컬 패스 페널티
  - SRAM ↔ NPU 인접: +20
  - 로직 ↔ 라우팅 인접: +10
- **Power Efficiency** — 낮은 전력 소모 = 높은 점수
  - 블록별 차등 누설전력 (SRAM > NPU > 로직 > 컨트롤러 > 라우팅)
  - 열 밀집 페널티 (활성 블록 3개 이상 클러스터)
  - 열지도 시각화로 핫스팟 확인 가능
- **Area** — 다이 활용률 + 밀집도 + 데드 스페이스 페널티

## 조작법

| 키 | 동작 |
|-----|------|
| `1`-`5` | 컴포넌트 선택 |
| `E` | 지우개 모드 |
| `H` | 힌트 보기 |
| `Ctrl+Z` | 되돌리기 |
| `Enter` | 제출 |
| `ESC` | 대화 스킵 / 튜토리얼 건너뛰기 |

## 기술 스택

- 순수 HTML / CSS / JavaScript (프레임워크 없음)
- 사이버펑크 다크 테마
- localStorage 기반 진행 저장
- Vercel 정적 배포

## 파일 구조

```
index.html        — HTML 스켈레톤
css/style.css     — 사이버펑크 테마 스타일
js/levels.js      — 레벨 설정 및 컴포넌트 메타데이터
js/story.js       — 캐논 마르코 대화 스크립트
js/engine.js      — PPA 계산 엔진 (순수 연산, DOM 없음)
js/renderer.js    — DOM 렌더링 (그리드, HUD, 대화, 열지도)
js/tutorial.js    — 13단계 대화형 튜토리얼
js/game.js        — 상태 머신 게임 컨트롤러
asset/            — BGM 오디오
vercel.json       — 배포 설정
```

## 로컬 실행

```bash
# 브라우저에서 바로 열기
open index.html

# 또는 로컬 서버 사용
npx serve .
```

## 라이선스

MIT
