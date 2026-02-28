/**
 * Operation Tera-Fab — Story & Dialogue
 * Canon Marco: 우주적 비유, 거침없고 유쾌한 한국어
 */
var TeraFab = window.TeraFab || {};

TeraFab.Story = {
  // Dialogue sequences keyed by story phase
  sequences: {

    // ===== INTRO =====
    intro: [
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "환영한다, 신입 설계사!\n나는 캐논 마르코, 반도체 은하의 수석 설계사이자\n네 미션을 이끌어줄 가이드야."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "\"오퍼레이션 테라팹\"...\n차세대 AI 칩을 설계하는 극비 작전이지.\n\n네가 할 일은 칩 위에 컴포넌트를 배치하고\n최고의 PPA를 뽑아내는 거야.\nPerformance, Power, Area — 이 세 가지의 균형이 핵심!"
      },
      {
        speaker: "CANON MARCO",
        portrait: "😎",
        text: "부품을 가까이 두면 시너지가 나고,\n너무 밀집하면 열이 폭발하지.\n마치 우주선에 엔진을 쑤셔넣는 것처럼...\n\n자, 준비됐으면 시작해볼까?"
      }
    ],

    // ===== LEVEL 1 BRIEFING =====
    lv1_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "좋아, 첫 번째 미션이다.\n3×3 다이 위에 기본 로직을 설계해봐."
      },
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "사용할 수 있는 IP 블록은 세 가지:\n\n  [T] 로직 블록 — 수십억 트랜지스터가 담긴 연산의 심장\n  [C] 컨트롤러 — 데이터 입출력을 조율하는 버스\n  [R] 라우팅 — 배선, 블록 간 데이터의 고속도로"
      },
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "로직 블록과 라우팅이 붙어있으면\n데이터가 쏜살같이 흐르지. +10 보너스!\n\n그리고 모든 블록은 반드시 서로 연결되어야 해.\nfloorplan에서 고립된 블록은 칩을 망친다고."
      },
      {
        speaker: "CANON MARCO",
        portrait: "😎",
        text: "실제 칩 설계처럼 생각해봐.\n연산은 가운데, 배선은 블록 사이에.\n로직과 라우팅이 반드시 맞닿아야 해!\n\n준비됐으면... floorplanning 시작이다!"
      }
    ],

    // ===== LEVEL 1 COMPLETE =====
    lv1_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "오오, 나쁘지 않은데?\n첫 번째 칩 치고는 꽤 쓸만하군!"
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "하지만 진짜는 지금부터야.\n다음 미션은 차원이 다르거든.\n\n5×5 그리드에... NPU가 등장한다."
      }
    ],

    // ===== LEVEL 2 BRIEFING =====
    lv2_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "🔮",
        text: "자, 본격적인 AI 칩 설계다.\n5×5 그리드. 부품도 5종류 전부 사용한다."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🔮",
        text: "새로운 IP 블록들을 소개하지:\n\n  [S] SRAM — 고속 온칩 메모리, NPU의 절친\n  [N] NPU — 신경처리장치, AI 추론의 두뇌\n\n NPU는 이미 다이 중앙에 고정되어 있어.\n그 주위를 어떻게 floorplan하느냐가 관건이야."
      },
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "핵심 시너지를 알려주지:\n\n  SRAM ↔ NPU 인접: on-chip bandwidth 극대화! +20\n  로직 블록 ↔ 라우팅: 데이터 경로 최적화! +10\n\n그리고 I/O 컨트롤러는 다이 가장자리에 놓아야 해.\n실제 칩에서도 I/O pad는 항상 외곽이거든.\n\n활성 블록이 3개 이상 밀집하면\nthermal hotspot 발생... 발열 패널티! 주의해!"
      },
      {
        speaker: "CANON MARCO",
        portrait: "😎",
        text: "이건 마치 블랙홀 주변에 우주정거장을\n건설하는 것과 같아.\n\nNPU라는 중력의 중심을 살리면서,\nPPA 밸런스를 잡아야 해.\ndie utilization도 신경 써!\n\n가보자고!"
      }
    ],

    // ===== LEVEL 2 COMPLETE =====
    lv2_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "해냈어...! 진짜로 해냈다고!!"
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "이 칩이면 충분해.\n차세대 AI를 돌릴 수 있는 프로세서...\n네가 만든 거야."
      }
    ],

    // ===== ENDING =====
    ending: [
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "\"오퍼레이션 테라팹\"... 작전 완수다."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "넌 작은 로직 블록 하나에서 시작해서\nNPU 탑재 AI 프로세서를 완성했어.\n\n이게 바로 칩 설계의 로망이지.\n나노미터 세계에서 우주를 만드는 거."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "언제든 돌아와.\n실리콘 은하는 항상 새로운 도전으로\n가득 차 있으니까.\n\n캐논 마르코는 여기서 기다리고 있을게.\n다음에 또 보자... 설계사!"
      }
    ]
  }
};
