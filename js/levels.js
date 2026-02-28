/**
 * Operation Tera-Fab — Level Definitions
 * Each level defines grid size, available components, objectives, and scoring weights.
 */
var TeraFab = window.TeraFab || {};

TeraFab.Levels = [
  // ===== LEVEL 1: 3x3, Basics =====
  {
    id: 1,
    name: "기본 로직 설계",
    subtitle: "로직 블록 배치의 기초",
    gridSize: 3,
    // Available component types for this level
    components: ['T', 'C', 'R'],
    // Pre-placed (locked) cells: { row, col, type }
    locked: [],
    // PPA weights
    weights: { performance: 0.40, power: 0.30, area: 0.30 },
    // Rank thresholds
    ranks: { S: 85, A: 70, B: 50, C: 0 },
    // Objectives the player must meet to submit
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 2개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 2;
        }
      },
      {
        id: 'min_C',
        desc: '컨트롤러(C) 1개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'C') >= 1;
        }
      },
      {
        id: 'min_R',
        desc: '라우팅(R) 1개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 1;
        }
      },
      {
        id: 'adj_TR',
        desc: '로직 블록(T)과 라우팅(R)이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.hasAdjacentType(grid, 'T', 'R');
        }
      },
      {
        id: 'connected',
        desc: '모든 컴포넌트가 연결됨',
        check: function(grid) {
          return TeraFab.Engine.isConnected(grid);
        }
      }
    ],
    // Hint for S-rank layout (for testing)
    _sRankHint: "T-C-T / R-T-_ / _-_-_ compact + T↔R adjacent"
  },

  // ===== LEVEL 2: 5x5, Full Components =====
  {
    id: 2,
    name: "NPU 통합 설계",
    subtitle: "신경처리장치 중심 아키텍처",
    gridSize: 5,
    components: ['T', 'S', 'N', 'C', 'R'],
    // NPU is pre-placed in center
    locked: [
      { row: 2, col: 2, type: 'N' }
    ],
    weights: { performance: 0.35, power: 0.35, area: 0.30 },
    ranks: { S: 90, A: 75, B: 55, C: 0 },
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 4개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 4;
        }
      },
      {
        id: 'min_S',
        desc: 'SRAM(S) 2개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 2;
        }
      },
      {
        id: 'min_C',
        desc: '컨트롤러(C) 2개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'C') >= 2;
        }
      },
      {
        id: 'min_R',
        desc: '라우팅(R) 3개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 3;
        }
      },
      {
        id: 'npu_adj',
        desc: 'NPU에 SRAM이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.hasAdjacentType(grid, 'N', 'S');
        }
      },
      {
        id: 'connected',
        desc: '모든 컴포넌트가 연결됨',
        check: function(grid) {
          return TeraFab.Engine.isConnected(grid);
        }
      }
    ],
    _sRankHint: "Dense layout around NPU center with SRAM adjacent"
  }
];

// Component metadata
TeraFab.Components = {
  T: {
    name: '로직 블록',
    nameEn: 'Logic Block',
    key: 'T',
    color: '#00c853',
    desc: '수백만 트랜지스터로 구성된 연산 IP 블록. 데이터를 처리하는 핵심 단위.',
    power: 1.0,
    perf: 1.0
  },
  S: {
    name: 'SRAM',
    nameEn: 'SRAM',
    key: 'S',
    color: '#2979ff',
    desc: '고속 메모리. NPU 인접 시 성능 대폭 향상.',
    power: 1.5,
    perf: 1.2
  },
  N: {
    name: 'NPU',
    nameEn: 'Neural Processing Unit',
    key: 'N',
    color: '#aa00ff',
    desc: '신경처리장치. AI 연산의 핵심.',
    power: 2.5,
    perf: 2.0
  },
  C: {
    name: '컨트롤러',
    nameEn: 'I/O Controller',
    key: 'C',
    color: '#ff6d00',
    desc: '외부 인터페이스 관리. 데이터 입출력을 조율하는 버스 컨트롤러.',
    power: 0.8,
    perf: 0.8
  },
  R: {
    name: '라우팅',
    nameEn: 'Routing',
    key: 'R',
    color: '#00bcd4',
    desc: '배선 경로. 컴포넌트 간 데이터 전달.',
    power: 0.3,
    perf: 0.5
  }
};
