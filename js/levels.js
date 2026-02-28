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
    _sRankHint: "T-C-T / R-T-_ / _-_-_ compact + T↔R adjacent",
    // Step-by-step beginner hints
    hints: [
      {
        condition: function(grid) { return TeraFab.Engine.countPlaced(grid) === 0; },
        text: "먼저 로직 블록(T)을 가운데(1,1)에 놓아보세요! 핵심 연산 블록은 중앙이 유리해요.",
        recommend: [{row:1, col:1, type:'T'}]
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 1 && TeraFab.Engine.countType(grid, 'R') === 0;
        },
        text: "좋아요! 이제 라우팅(R)을 로직 블록 바로 옆에 놓으세요. 붙어있으면 +10 보너스!",
        recommendFn: function(grid) {
          var cells = TeraFab.Engine.getPlacedCells(grid);
          var recs = [];
          var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
          for (var i = 0; i < cells.length; i++) {
            if (cells[i].type === 'T') {
              for (var d = 0; d < dirs.length; d++) {
                var nr = cells[i].row + dirs[d][0], nc = cells[i].col + dirs[d][1];
                if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 && !grid[nr][nc]) {
                  recs.push({row:nr, col:nc, type:'R'});
                }
              }
            }
          }
          return recs;
        }
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 1 && TeraFab.Engine.countType(grid, 'R') >= 1 && TeraFab.Engine.countType(grid, 'C') === 0;
        },
        text: "잘하고 있어요! 컨트롤러(C)를 배치하세요. 로직 블록 옆이면 +5 보너스!",
        recommendFn: function(grid) {
          var cells = TeraFab.Engine.getPlacedCells(grid);
          var recs = [];
          var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
          for (var i = 0; i < cells.length; i++) {
            if (cells[i].type === 'T') {
              for (var d = 0; d < dirs.length; d++) {
                var nr = cells[i].row + dirs[d][0], nc = cells[i].col + dirs[d][1];
                if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 && !grid[nr][nc]) {
                  recs.push({row:nr, col:nc, type:'C'});
                }
              }
            }
          }
          return recs;
        }
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') < 2 &&
                 TeraFab.Engine.countType(grid, 'R') >= 1 &&
                 TeraFab.Engine.countType(grid, 'C') >= 1;
        },
        text: "로직 블록(T)이 2개 필요해요! 기존 블록들 옆에 하나 더 추가하세요.",
        recommendFn: function(grid) {
          var cells = TeraFab.Engine.getPlacedCells(grid);
          var recs = [];
          var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
          for (var i = 0; i < cells.length; i++) {
            for (var d = 0; d < dirs.length; d++) {
              var nr = cells[i].row + dirs[d][0], nc = cells[i].col + dirs[d][1];
              if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 && !grid[nr][nc]) {
                recs.push({row:nr, col:nc, type:'T'});
              }
            }
          }
          return recs;
        }
      },
      {
        condition: function(grid) {
          return !TeraFab.Engine.hasAdjacentType(grid, 'T', 'R') &&
                 TeraFab.Engine.countType(grid, 'T') >= 1 &&
                 TeraFab.Engine.countType(grid, 'R') >= 1;
        },
        text: "로직 블록(T)과 라우팅(R)이 서로 붙어있어야 해요! 인접하게 배치를 조정해보세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return !TeraFab.Engine.isConnected(grid) && TeraFab.Engine.countPlaced(grid) >= 2;
        },
        text: "블록들이 떨어져 있어요! 모든 블록이 상하좌우로 연결되어야 합니다. 사이에 블록을 추가하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[0]);
        },
        text: "모든 목표 달성! SUBMIT을 눌러 제출하세요. 더 높은 점수를 원하면 블록을 밀집시켜보세요!",
        recommend: []
      }
    ]
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
    _sRankHint: "Dense layout around NPU center with SRAM adjacent",
    // Step-by-step beginner hints
    hints: [
      {
        condition: function(grid) {
          return TeraFab.Engine.countPlaced(grid) === 1; // only NPU locked
        },
        text: "NPU(보라색)가 중앙에 고정되어 있어요. 먼저 SRAM(S)을 NPU 바로 옆에 놓으세요! +20 보너스!",
        recommend: [{row:1,col:2,type:'S'},{row:2,col:1,type:'S'},{row:2,col:3,type:'S'},{row:3,col:2,type:'S'}]
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 1 &&
                 TeraFab.Engine.hasAdjacentType(grid, 'N', 'S') &&
                 TeraFab.Engine.countType(grid, 'T') === 0;
        },
        text: "SRAM 배치 성공! 이제 로직 블록(T) 4개를 배치해야 해요. SRAM이나 컨트롤러 옆이 좋아요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 1 &&
                 !TeraFab.Engine.hasAdjacentType(grid, 'N', 'S');
        },
        text: "SRAM이 NPU 옆에 없어요! NPU(2,2) 바로 상하좌우에 SRAM을 놓아야 보너스를 받아요.",
        recommend: [{row:1,col:2,type:'S'},{row:2,col:1,type:'S'},{row:2,col:3,type:'S'},{row:3,col:2,type:'S'}]
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 2 &&
                 TeraFab.Engine.countType(grid, 'R') === 0;
        },
        text: "로직 블록들을 연결할 라우팅(R)이 필요해요! 블록 사이사이에 배치하세요. 3개 이상 필요합니다.",
        recommend: []
      },
      {
        condition: function(grid) {
          var active = TeraFab.Engine.countType(grid, 'T') + TeraFab.Engine.countType(grid, 'S') + TeraFab.Engine.countType(grid, 'N') + TeraFab.Engine.countType(grid, 'C');
          return active >= 5 && TeraFab.Engine.countHeatPenalty(grid) > 10;
        },
        text: "발열 주의! 활성 블록(T,S,N,C)이 3개 이상 뭉쳐있으면 열이 발생해요. 사이에 라우팅(R)을 끼워 넣으세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return !TeraFab.Engine.isConnected(grid) && TeraFab.Engine.countPlaced(grid) >= 3;
        },
        text: "블록들이 떨어져 있어요! 모든 블록이 상하좌우로 이어져야 합니다. 라우팅(R)으로 연결하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[1]);
        },
        text: "모든 목표 달성! SUBMIT으로 제출하세요. S랭크를 노린다면 블록을 빈틈없이 채워보세요!",
        recommend: []
      }
    ]
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
