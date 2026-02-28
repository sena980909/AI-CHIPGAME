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
        text: "하지만 아직 끝이 아니야.\n진짜 전쟁은 지금부터거든.\n\n다음 미션... 열관리라는 악마와 싸워야 해."
      }
    ],

    // ===== LEVEL 3 BRIEFING =====
    lv3_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "🔥",
        text: "세 번째 미션이다.\n4×4 그리드에 듀얼 NPU를 탑재한다."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🔥",
        text: "두 개의 NPU가 대각선으로 고정되어 있어.\n이번 핵심은 열 관리(Thermal Management)야.\n\n활성 블록이 밀집하면 발열 패널티가 치솟거든.\n라우팅(R)을 열 차단벽으로 활용해야 해."
      },
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "목표:\n  • 각 NPU에 SRAM이 인접해야 해\n  • 발열 패널티 8 이하 유지\n  • 컨트롤러(C)는 가장자리에!\n\n칩이 녹지 않게 설계해봐. 시작!"
      }
    ],

    // ===== LEVEL 3 COMPLETE =====
    lv3_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "열 폭주 없이 듀얼 NPU를 살려냈어!\n꽤 실력이 늘었는데?"
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "다음은 더 큰 스케일이다.\n6×6... 그리고 금지구역이 등장한다.\n실리콘 위에도 갈 수 없는 곳이 있거든."
      }
    ],

    // ===== LEVEL 4 BRIEFING =====
    lv4_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "🚧",
        text: "네 번째 미션. 6×6 멀티존 아키텍처다.\n이번엔 새로운 제약이 있어."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🚧",
        text: "빨간 X 표시가 보이지?\n그건 금지구역 — 전력 배선이 지나가는 곳이야.\n절대 블록을 놓을 수 없어.\n\n우회해서 floorplan을 짜야 한다."
      },
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "그리고 새로운 도전:\nSRAM 대칭 배치가 필요해.\nNPU 클러스터 기준으로 상하 또는 좌우 대칭!\n\n메모리 대역폭의 균형이 핵심이지.\n자, 우회로를 찾아보자!"
      }
    ],

    // ===== LEVEL 4 COMPLETE =====
    lv4_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "금지구역을 뚫고 대칭까지 맞추다니!\n넌 진짜 설계사가 되어가고 있어."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "다음은 7×7 풀 SoC... 본격적인 통합 설계야.\n\n여기까지 온 건 네가 처음이야.\n준비됐으면... 다음 전장으로!"
      }
    ],

    // ===== LEVEL 5 BRIEFING =====
    lv5_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "다섯 번째 미션이다.\n7×7 풀 SoC(System-on-Chip)를 완성해라."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "NPU 4개가 중앙에, 컨트롤러 4개가 십자 외곽에 고정.\n코너 4곳은 금지구역이야.\n\n이건 실제 반도체 설계와 거의 같은 조건이다.\nI/O 타이밍, 메모리 대역폭, 활용률...\n모든 것을 동시에 만족시켜야 해."
      },
      {
        speaker: "CANON MARCO",
        portrait: "😎",
        text: "핵심 목표:\n  • 모든 C에서 T까지 3홉 이내 (I/O 타이밍)\n  • NPU 인접 SRAM 4개 이상 (메모리 대역폭)\n  • 활용률 40% 이상\n\n한 단계 더 올라가는 거야.\n나노미터 우주에서 실력을 증명해봐!"
      }
    ],

    // ===== LEVEL 5 COMPLETE =====
    lv5_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "해냈어...!!\n7×7 풀 SoC를 완성하다니!!"
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "하지만 진짜 프로의 세계는 여기서부터야.\n더 큰 다이, 더 빡센 제약...\n\n8×8 전력 예산 설계가 기다리고 있다."
      }
    ],

    // ===== LEVEL 6 BRIEFING =====
    lv6_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "여섯 번째 미션이다.\n8×8 다이... 이번엔 전력 예산이 핵심이야."
      },
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "실제 칩 설계에서 가장 중요한 제약 중 하나:\n\"파워 버짓(Power Budget)\".\n\n총 전력 소비를 55 이하로 유지해야 해.\n블록을 마구 쌓으면 전력이 폭발하거든."
      },
      {
        speaker: "CANON MARCO",
        portrait: "😎",
        text: "팁을 하나 주지:\n\n  NPU(2.5) > SRAM(1.5) > T(1.0) > C(0.8) > R(0.3)\n\n라우팅은 전력이 가장 낮아.\n효율적인 배치가 승부를 가른다. 시작!"
      }
    ],

    // ===== LEVEL 6 COMPLETE =====
    lv6_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "전력 예산 안에서 해냈어!\n효율적인 설계야, 감탄스럽다."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "다음은 더 까다로워.\n크리티컬 패스... 신호 지연과의 싸움이다.\n\n모든 경로가 짧아야 칩이 빠르게 돌아가거든."
      }
    ],

    // ===== LEVEL 7 BRIEFING =====
    lv7_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "🔮",
        text: "일곱 번째 미션.\n같은 8×8지만 이번엔 완전히 다른 도전이야."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🔮",
        text: "NPU가 상하로 분리되어 있어.\n그 사이를 어떻게 연결하느냐가 관건이지.\n\n새로운 제약: 크리티컬 패스(최대 경로)가\n8홉을 넘으면 안 돼. 타이밍 클로저 실패야."
      },
      {
        speaker: "CANON MARCO",
        portrait: "⚡",
        text: "목표 정리:\n  • 코너의 C에서 T까지 3홉 이내\n  • 전체 크리티컬 패스 8홉 이하\n  • 활용률 40% 이상\n\n빠르고 밀도 높은 설계를 해봐. 파이팅!"
      }
    ],

    // ===== LEVEL 7 COMPLETE =====
    lv7_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "크리티컬 패스를 제어하다니...\n넌 이제 진짜 칩 아키텍트야."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "마지막 미션이 남았다.\n9×9... \"최종 병기: 테라팹\".\n\n지금까지 배운 모든 것을 쏟아부어야 해.\n준비됐지?"
      }
    ],

    // ===== LEVEL 8 BRIEFING =====
    lv8_briefing: [
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "최종 미션. \"최종 병기: 테라팹\".\n9×9 다이에 모든 메카닉이 총출동한다."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "NPU 6개가 중앙에 밀집, C 4개가 십자 외곽,\nSRAM 2개가 미리 배치.\n코너와 그 주변은 금지구역이야.\n\n열 관리, 전력 예산, I/O 타이밍, 메모리 대역폭,\n활용률... 전부 동시에 만족시켜야 한다."
      },
      {
        speaker: "CANON MARCO",
        portrait: "😎",
        text: "10개의 목표. 이건 실제 반도체 설계와\n거의 같은 수준의 도전이야.\n\n나노미터 우주의 끝에서...\n전설을 만들 준비가 됐다면, 시작하자!"
      }
    ],

    // ===== LEVEL 8 COMPLETE =====
    lv8_complete: [
      {
        speaker: "CANON MARCO",
        portrait: "🎉",
        text: "해...해냈어...!!!\n9×9 궁극의 SoC를 완성했다!!"
      },
      {
        speaker: "CANON MARCO",
        portrait: "🌟",
        text: "10개의 목표를 전부 달성하고\n이 괴물 같은 칩을 설계해낸 건...\n\n네가 이 은하 최초야."
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
        text: "넌 3×3 로직 블록 하나에서 시작해서\n9×9 궁극의 SoC를 완성했어.\n\n열 관리, 금지구역, 전력 예산, 크리티컬 패스,\nI/O 타이밍, 메모리 대역폭...\n여덟 단계의 여정을 전부 돌파했지.\n\n이게 바로 칩 설계의 로망이야.\n나노미터 세계에서 우주를 만드는 거."
      },
      {
        speaker: "CANON MARCO",
        portrait: "🛸",
        text: "언제든 돌아와.\n실리콘 은하는 항상 새로운 도전으로\n가득 차 있으니까.\n\n캐논 마르코는 여기서 기다리고 있을게.\n다음에 또 보자... 설계사!"
      }
    ]
  }
};
