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
    ranks: { S: 75, A: 60, B: 40, C: 0 },
    minRank: null, // no gate for Lv1
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
    ranks: { S: 70, A: 55, B: 35, C: 0 },
    minRank: null, // no gate for Lv2
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
        id: 'io_edge',
        desc: '컨트롤러(C) 1개 이상 가장자리 배치',
        check: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C' && (r === 0 || r === size - 1 || c === 0 || c === size - 1)) {
                return true;
              }
            }
          }
          return false;
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
    _sRankHint: "Dense layout around NPU center with SRAM adjacent, C on edges",
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
          if (TeraFab.Engine.countType(grid, 'C') === 0) return false;
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C' && (r === 0 || r === size-1 || c === 0 || c === size-1)) return false;
            }
          }
          return true; // has C but none on edge
        },
        text: "컨트롤러(C)가 내부에 있어요! 실제 칩처럼 I/O는 다이 가장자리(행/열 0 또는 4)에 놓아야 합니다.",
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
  },

  // ===== LEVEL 3: 4x4, Thermal Management =====
  {
    id: 3,
    name: "열 관리 설계",
    subtitle: "듀얼 NPU 발열 제어",
    gridSize: 4,
    components: ['T', 'S', 'N', 'C', 'R'],
    locked: [
      { row: 1, col: 1, type: 'N' },
      { row: 2, col: 2, type: 'N' }
    ],
    blocked: [],
    weights: { performance: 0.35, power: 0.35, area: 0.30 },
    ranks: { S: 72, A: 58, B: 38, C: 0 },
    minRank: 'B',
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 3개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 3;
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
        id: 'min_R',
        desc: '라우팅(R) 2개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 2;
        }
      },
      {
        id: 'npu_adj',
        desc: '모든 NPU에 SRAM이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S');
        }
      },
      {
        id: 'thermal_ok',
        desc: '발열 패널티 8 이하',
        check: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) <= 8;
        }
      },
      {
        id: 'io_edge',
        desc: '컨트롤러(C) 1개 이상 가장자리 배치',
        check: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C' && (r === 0 || r === size - 1 || c === 0 || c === size - 1)) {
                return true;
              }
            }
          }
          return false;
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
    _sRankHint: "NPU diagonal with SRAM adjacent, R as thermal buffer between NPUs",
    hints: [
      {
        condition: function(grid) {
          return TeraFab.Engine.countPlaced(grid) === 2; // only 2 NPUs locked
        },
        text: "듀얼 NPU가 대각선으로 고정되어 있어요. 각 NPU 옆에 SRAM(S)을 하나씩 놓으세요!",
        recommend: [{row:0,col:1,type:'S'},{row:1,col:2,type:'S'},{row:2,col:1,type:'S'},{row:3,col:2,type:'S'}]
      },
      {
        condition: function(grid) {
          return !TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S') &&
                 TeraFab.Engine.countType(grid, 'S') >= 1;
        },
        text: "아직 모든 NPU에 SRAM이 인접하지 않아요! 각 NPU(1,1)과 (2,2) 옆에 S를 놓으세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) > 8;
        },
        text: "발열이 너무 높아요! 활성 블록 사이에 라우팅(R)을 끼워 열을 분산시키세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') < 2 &&
                 TeraFab.Engine.countType(grid, 'S') >= 2;
        },
        text: "라우팅(R)이 2개 이상 필요해요. NPU 사이에 R을 놓으면 열 차단 효과도 있어요!",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[2]);
        },
        text: "모든 목표 달성! SUBMIT으로 제출하세요!",
        recommend: []
      }
    ]
  },

  // ===== LEVEL 4: 6x6, Multi-zone Architecture =====
  {
    id: 4,
    name: "멀티존 아키텍처",
    subtitle: "금지구역 우회 + 대칭 메모리",
    gridSize: 6,
    components: ['T', 'S', 'N', 'C', 'R'],
    locked: [
      { row: 2, col: 2, type: 'N' },
      { row: 2, col: 3, type: 'N' },
      { row: 0, col: 0, type: 'C' },
      { row: 5, col: 5, type: 'C' }
    ],
    blocked: [
      { row: 3, col: 0 },
      { row: 4, col: 0 },
      { row: 4, col: 1 }
    ],
    weights: { performance: 0.30, power: 0.35, area: 0.35 },
    ranks: { S: 68, A: 52, B: 32, C: 0 },
    minRank: 'B',
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 6개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 6;
        }
      },
      {
        id: 'min_S',
        desc: 'SRAM(S) 4개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 4;
        }
      },
      {
        id: 'min_R',
        desc: '라우팅(R) 4개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 4;
        }
      },
      {
        id: 'npu_adj',
        desc: '모든 NPU에 SRAM이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S');
        }
      },
      {
        id: 'thermal_ok',
        desc: '발열 패널티 12 이하',
        check: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) <= 12;
        }
      },
      {
        id: 'io_edge',
        desc: '컨트롤러(C) 1개 이상 가장자리 배치',
        check: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C' && (r === 0 || r === size - 1 || c === 0 || c === size - 1)) {
                return true;
              }
            }
          }
          return false;
        }
      },
      {
        id: 'connected',
        desc: '모든 컴포넌트가 연결됨',
        check: function(grid) {
          return TeraFab.Engine.isConnected(grid);
        }
      },
      {
        id: 'sram_symmetry',
        desc: 'NPU 클러스터 기준 좌우 또는 상하 SRAM 대칭',
        check: function(grid) {
          // NPU cluster center is between (2,2) and (2,3), so center col = 2.5, center row = 2
          // Check left-right symmetry around col 2.5
          var sramCells = [];
          for (var r = 0; r < grid.length; r++) {
            for (var c = 0; c < grid[r].length; c++) {
              if (grid[r][c] === 'S') sramCells.push({row: r, col: c});
            }
          }
          if (sramCells.length < 4) return false;

          // LR symmetry around col 2.5: mirror of col c is 5-c
          var lrOk = true;
          for (var i = 0; i < sramCells.length; i++) {
            var mirrorCol = 5 - sramCells[i].col;
            var found = false;
            for (var j = 0; j < sramCells.length; j++) {
              if (sramCells[j].row === sramCells[i].row && sramCells[j].col === mirrorCol) {
                found = true;
                break;
              }
            }
            if (!found) { lrOk = false; break; }
          }
          if (lrOk) return true;

          // TB symmetry around row 2.5: mirror of row r is 5-r
          var tbOk = true;
          for (var i2 = 0; i2 < sramCells.length; i2++) {
            var mirrorRow = 5 - sramCells[i2].row;
            var found2 = false;
            for (var j2 = 0; j2 < sramCells.length; j2++) {
              if (sramCells[j2].row === mirrorRow && sramCells[j2].col === sramCells[i2].col) {
                found2 = true;
                break;
              }
            }
            if (!found2) { tbOk = false; break; }
          }
          return tbOk;
        }
      }
    ],
    _sRankHint: "SRAM symmetric around NPU cluster, route around blocked zone",
    hints: [
      {
        condition: function(grid) {
          return TeraFab.Engine.countPlaced(grid) === 4; // only locked cells
        },
        text: "NPU 2개와 C 2개가 고정되어 있어요. 빨간 X는 금지구역! 먼저 NPU 옆에 SRAM을 놓으세요.",
        recommend: [{row:1,col:2,type:'S'},{row:1,col:3,type:'S'},{row:3,col:2,type:'S'},{row:3,col:3,type:'S'}]
      },
      {
        condition: function(grid) {
          return !TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S') &&
                 TeraFab.Engine.countType(grid, 'S') >= 1;
        },
        text: "모든 NPU에 SRAM이 인접해야 해요! (2,2)와 (2,3) 각각 옆에 S를 놓으세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 4 &&
                 TeraFab.Engine.countType(grid, 'T') < 6;
        },
        text: "로직 블록(T) 6개가 필요해요! NPU 클러스터 주변에 배치하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) > 12;
        },
        text: "발열이 12를 초과했어요! 블록 사이에 라우팅(R)을 넣어 열을 분산하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[3]);
        },
        text: "모든 목표 달성! SUBMIT으로 제출하세요!",
        recommend: []
      }
    ]
  },

  // ===== LEVEL 5: 7x7, Full SoC =====
  {
    id: 5,
    name: "최종 통합 설계",
    subtitle: "풀 SoC: I/O링 + 대역폭 + 타이밍",
    gridSize: 7,
    components: ['T', 'S', 'N', 'C', 'R'],
    locked: [
      { row: 2, col: 3, type: 'N' },
      { row: 3, col: 2, type: 'N' },
      { row: 3, col: 3, type: 'N' },
      { row: 3, col: 4, type: 'N' },
      { row: 0, col: 3, type: 'C' },
      { row: 6, col: 3, type: 'C' },
      { row: 3, col: 0, type: 'C' },
      { row: 3, col: 6, type: 'C' }
    ],
    blocked: [
      { row: 0, col: 0 },
      { row: 0, col: 6 },
      { row: 6, col: 0 },
      { row: 6, col: 6 }
    ],
    weights: { performance: 0.35, power: 0.30, area: 0.35 },
    ranks: { S: 65, A: 50, B: 30, C: 0 },
    minRank: 'B',
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 8개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 8;
        }
      },
      {
        id: 'min_S',
        desc: 'SRAM(S) 6개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 6;
        }
      },
      {
        id: 'min_R',
        desc: '라우팅(R) 5개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 5;
        }
      },
      {
        id: 'npu_adj',
        desc: '모든 NPU에 SRAM이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S');
        }
      },
      {
        id: 'thermal_ok',
        desc: '발열 패널티 15 이하',
        check: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) <= 15;
        }
      },
      {
        id: 'connected',
        desc: '모든 컴포넌트가 연결됨',
        check: function(grid) {
          return TeraFab.Engine.isConnected(grid);
        }
      },
      {
        id: 'io_timing',
        desc: '모든 C에서 T까지 3홉 이내 (I/O 타이밍)',
        check: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C') {
                var dist = TeraFab.Engine.bfsDistanceFromCell(grid, r, c, 'T');
                if (dist > 3) return false;
              }
            }
          }
          return true;
        }
      },
      {
        id: 'memory_bw',
        desc: 'NPU 인접 SRAM 4개 이상 (메모리 대역폭)',
        check: function(grid) {
          return TeraFab.Engine.countAdjacentToType(grid, 'N', 'S') >= 4;
        }
      },
      {
        id: 'utilization',
        desc: '활용률 40% 이상',
        check: function(grid) {
          var size = grid.length;
          // Subtract blocked cells from total
          var totalUsable = size * size - 4; // 4 blocked corners
          var placed = TeraFab.Engine.countPlaced(grid);
          return (placed / totalUsable) >= 0.40;
        }
      }
    ],
    _sRankHint: "Dense ring around NPU cluster, SRAM adjacent to all NPUs, C connected via T within 3 hops",
    hints: [
      {
        condition: function(grid) {
          return TeraFab.Engine.countPlaced(grid) === 8; // only locked cells
        },
        text: "NPU 4개가 중앙에, C 4개가 십자 외곽에 고정. 코너는 금지구역! 먼저 NPU 옆에 SRAM을 놓으세요.",
        recommend: [{row:2,col:2,type:'S'},{row:2,col:4,type:'S'},{row:4,col:2,type:'S'},{row:4,col:3,type:'S'},{row:4,col:4,type:'S'}]
      },
      {
        condition: function(grid) {
          return !TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S') &&
                 TeraFab.Engine.countType(grid, 'S') >= 1;
        },
        text: "모든 NPU에 SRAM이 인접해야 해요! 각 NPU 옆에 S를 배치하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countAdjacentToType(grid, 'N', 'S') < 4 &&
                 TeraFab.Engine.countType(grid, 'S') >= 4;
        },
        text: "NPU 인접 SRAM이 4개 미만이에요! SRAM을 NPU 바로 옆에 더 배치하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) > 15;
        },
        text: "발열이 15를 초과했어요! 라우팅(R)을 열 차단벽으로 활용하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[4]);
        },
        text: "모든 목표 달성! SUBMIT으로 최종 설계를 제출하세요!",
        recommend: []
      }
    ]
  },

  // ===== LEVEL 6: 8x8, Power Budget =====
  {
    id: 6,
    name: "전력 예산 설계",
    subtitle: "파워 버짓 제약 하의 대규모 설계",
    gridSize: 8,
    components: ['T', 'S', 'N', 'C', 'R'],
    locked: [
      { row: 3, col: 3, type: 'N' },
      { row: 3, col: 4, type: 'N' },
      { row: 4, col: 3, type: 'N' },
      { row: 4, col: 4, type: 'N' },
      { row: 0, col: 3, type: 'C' },
      { row: 0, col: 4, type: 'C' },
      { row: 7, col: 3, type: 'C' },
      { row: 7, col: 4, type: 'C' }
    ],
    blocked: [
      { row: 0, col: 0 },
      { row: 0, col: 7 },
      { row: 7, col: 0 },
      { row: 7, col: 7 },
      { row: 1, col: 0 }
    ],
    weights: { performance: 0.30, power: 0.40, area: 0.30 },
    ranks: { S: 62, A: 48, B: 28, C: 0 },
    minRank: 'B',
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 10개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 10;
        }
      },
      {
        id: 'min_S',
        desc: 'SRAM(S) 6개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 6;
        }
      },
      {
        id: 'min_R',
        desc: '라우팅(R) 6개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 6;
        }
      },
      {
        id: 'npu_adj',
        desc: '모든 NPU에 SRAM이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S');
        }
      },
      {
        id: 'thermal_ok',
        desc: '발열 패널티 18 이하',
        check: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) <= 18;
        }
      },
      {
        id: 'connected',
        desc: '모든 컴포넌트가 연결됨',
        check: function(grid) {
          return TeraFab.Engine.isConnected(grid);
        }
      },
      {
        id: 'io_edge',
        desc: '컨트롤러(C) 1개 이상 가장자리 배치',
        check: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C' && (r === 0 || r === size - 1 || c === 0 || c === size - 1)) {
                return true;
              }
            }
          }
          return false;
        }
      },
      {
        id: 'power_budget',
        desc: '총 전력 소비 55 이하 (전력 예산)',
        check: function(grid) {
          return TeraFab.Engine.calcTotalPower(grid) <= 55;
        }
      }
    ],
    _sRankHint: "Efficient placement around NPU cluster, minimize unnecessary components",
    hints: [
      {
        condition: function(grid) {
          return TeraFab.Engine.countPlaced(grid) === 8;
        },
        text: "2×2 NPU 클러스터가 중앙에, C 4개가 상하에 고정. 코너는 금지! NPU 옆에 SRAM을 놓으세요.",
        recommend: [{row:2,col:3,type:'S'},{row:2,col:4,type:'S'},{row:5,col:3,type:'S'},{row:5,col:4,type:'S'}]
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.calcTotalPower(grid) > 55;
        },
        text: "전력 예산 초과! 불필요한 고전력 블록을 줄이고 라우팅(R)으로 대체하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) > 18;
        },
        text: "발열이 18을 초과! 활성 블록 사이에 라우팅을 끼워넣어 열을 분산하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return !TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S') &&
                 TeraFab.Engine.countType(grid, 'S') >= 1;
        },
        text: "모든 NPU에 SRAM이 인접해야 해요! 4개 NPU 각각 옆에 S를 놓으세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[5]);
        },
        text: "모든 목표 달성! SUBMIT으로 제출하세요!",
        recommend: []
      }
    ]
  },

  // ===== LEVEL 7: 8x8, Critical Path =====
  {
    id: 7,
    name: "크리티컬 패스 제어",
    subtitle: "신호 지연 최소화 설계",
    gridSize: 8,
    components: ['T', 'S', 'N', 'C', 'R'],
    locked: [
      { row: 2, col: 3, type: 'N' },
      { row: 2, col: 4, type: 'N' },
      { row: 5, col: 3, type: 'N' },
      { row: 5, col: 4, type: 'N' },
      { row: 0, col: 0, type: 'C' },
      { row: 0, col: 7, type: 'C' },
      { row: 7, col: 0, type: 'C' },
      { row: 7, col: 7, type: 'C' },
      { row: 3, col: 3, type: 'S' },
      { row: 4, col: 4, type: 'S' }
    ],
    blocked: [
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 3, col: 0 },
      { row: 4, col: 7 }
    ],
    weights: { performance: 0.40, power: 0.30, area: 0.30 },
    ranks: { S: 60, A: 46, B: 26, C: 0 },
    minRank: 'B',
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 12개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 12;
        }
      },
      {
        id: 'min_S',
        desc: 'SRAM(S) 6개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 6;
        }
      },
      {
        id: 'min_R',
        desc: '라우팅(R) 8개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 8;
        }
      },
      {
        id: 'npu_adj',
        desc: '모든 NPU에 SRAM이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S');
        }
      },
      {
        id: 'thermal_ok',
        desc: '발열 패널티 18 이하',
        check: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) <= 18;
        }
      },
      {
        id: 'connected',
        desc: '모든 컴포넌트가 연결됨',
        check: function(grid) {
          return TeraFab.Engine.isConnected(grid);
        }
      },
      {
        id: 'io_timing',
        desc: '모든 C에서 T까지 3홉 이내',
        check: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C') {
                var dist = TeraFab.Engine.bfsDistanceFromCell(grid, r, c, 'T');
                if (dist > 3) return false;
              }
            }
          }
          return true;
        }
      },
      {
        id: 'max_diameter',
        desc: '크리티컬 패스(최대 경로) 8홉 이하',
        check: function(grid) {
          return TeraFab.Engine.maxBfsDistance(grid) <= 8;
        }
      },
      {
        id: 'utilization',
        desc: '활용률 40% 이상',
        check: function(grid) {
          var size = grid.length;
          var totalUsable = size * size - 6;
          var placed = TeraFab.Engine.countPlaced(grid);
          return (placed / totalUsable) >= 0.40;
        }
      }
    ],
    _sRankHint: "Dense central corridor connecting NPU pairs, T near all C within 3 hops",
    hints: [
      {
        condition: function(grid) {
          return TeraFab.Engine.countPlaced(grid) === 10;
        },
        text: "NPU가 상하로 분리! SRAM 2개 고정, C는 코너에. 먼저 나머지 NPU 옆에 SRAM을 놓으세요.",
        recommend: [{row:2,col:2,type:'S'},{row:5,col:5,type:'S'},{row:1,col:3,type:'S'},{row:6,col:4,type:'S'}]
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.maxBfsDistance(grid) > 8 &&
                 TeraFab.Engine.countPlaced(grid) > 15;
        },
        text: "크리티컬 패스가 8홉을 초과! 블록들을 더 밀집시키고 중앙으로 연결하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C') {
                var dist = TeraFab.Engine.bfsDistanceFromCell(grid, r, c, 'T');
                if (dist > 3) return true;
              }
            }
          }
          return false;
        },
        text: "I/O 타이밍 위반! 코너 C에서 T까지 3홉 이내여야 해요. C 근처에 T를 배치하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) > 18;
        },
        text: "발열 초과! 라우팅(R)으로 열을 분산시키세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[6]);
        },
        text: "모든 목표 달성! SUBMIT으로 제출하세요!",
        recommend: []
      }
    ]
  },

  // ===== LEVEL 8: 9x9, Ultimate SoC =====
  {
    id: 8,
    name: "최종 병기: 테라팹",
    subtitle: "전 메카닉 통합 — 궁극의 SoC",
    gridSize: 9,
    components: ['T', 'S', 'N', 'C', 'R'],
    locked: [
      { row: 3, col: 3, type: 'N' },
      { row: 3, col: 4, type: 'N' },
      { row: 4, col: 3, type: 'N' },
      { row: 4, col: 4, type: 'N' },
      { row: 4, col: 5, type: 'N' },
      { row: 5, col: 4, type: 'N' },
      { row: 0, col: 4, type: 'C' },
      { row: 8, col: 4, type: 'C' },
      { row: 4, col: 0, type: 'C' },
      { row: 4, col: 8, type: 'C' },
      { row: 3, col: 5, type: 'S' },
      { row: 5, col: 3, type: 'S' }
    ],
    blocked: [
      { row: 0, col: 0 },
      { row: 0, col: 8 },
      { row: 8, col: 0 },
      { row: 8, col: 8 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 8, col: 7 },
      { row: 7, col: 8 }
    ],
    weights: { performance: 0.35, power: 0.30, area: 0.35 },
    ranks: { S: 58, A: 44, B: 24, C: 0 },
    minRank: 'B',
    objectives: [
      {
        id: 'min_T',
        desc: '로직 블록(T) 14개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 14;
        }
      },
      {
        id: 'min_S',
        desc: 'SRAM(S) 8개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'S') >= 8;
        }
      },
      {
        id: 'min_R',
        desc: '라우팅(R) 10개 이상 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 10;
        }
      },
      {
        id: 'npu_adj',
        desc: '모든 NPU에 SRAM이 인접해야 함',
        check: function(grid) {
          return TeraFab.Engine.allOfTypeHaveAdjacentType(grid, 'N', 'S');
        }
      },
      {
        id: 'thermal_ok',
        desc: '발열 패널티 20 이하',
        check: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) <= 20;
        }
      },
      {
        id: 'connected',
        desc: '모든 컴포넌트가 연결됨',
        check: function(grid) {
          return TeraFab.Engine.isConnected(grid);
        }
      },
      {
        id: 'io_timing',
        desc: '모든 C에서 T까지 4홉 이내',
        check: function(grid) {
          var size = grid.length;
          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              if (grid[r][c] === 'C') {
                var dist = TeraFab.Engine.bfsDistanceFromCell(grid, r, c, 'T');
                if (dist > 4) return false;
              }
            }
          }
          return true;
        }
      },
      {
        id: 'memory_bw',
        desc: 'NPU 인접 SRAM 6개 이상 (메모리 대역폭)',
        check: function(grid) {
          return TeraFab.Engine.countAdjacentToType(grid, 'N', 'S') >= 6;
        }
      },
      {
        id: 'power_budget',
        desc: '총 전력 소비 75 이하',
        check: function(grid) {
          return TeraFab.Engine.calcTotalPower(grid) <= 75;
        }
      },
      {
        id: 'utilization',
        desc: '활용률 45% 이상',
        check: function(grid) {
          var size = grid.length;
          var totalUsable = size * size - 8;
          var placed = TeraFab.Engine.countPlaced(grid);
          return (placed / totalUsable) >= 0.45;
        }
      }
    ],
    _sRankHint: "Dense cross pattern radiating from NPU cluster, SRAM surrounding NPUs, efficient routing",
    hints: [
      {
        condition: function(grid) {
          return TeraFab.Engine.countPlaced(grid) === 12;
        },
        text: "최종 미션! NPU 6개+SRAM 2개 중앙, C 4개 십자 외곽. 코너는 금지! NPU 옆에 SRAM을 더 놓으세요.",
        recommend: [{row:2,col:4,type:'S'},{row:5,col:5,type:'S'},{row:4,col:2,type:'S'},{row:4,col:6,type:'S'}]
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.calcTotalPower(grid) > 75 &&
                 TeraFab.Engine.countPlaced(grid) > 20;
        },
        text: "전력 예산 초과! 고전력 블록을 줄이고 라우팅(R)을 활용하세요. R은 전력 소비가 가장 낮아요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countAdjacentToType(grid, 'N', 'S') < 6 &&
                 TeraFab.Engine.countType(grid, 'S') >= 6;
        },
        text: "NPU 인접 SRAM이 6개 미만! SRAM을 NPU 바로 옆에 더 배치하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.countHeatPenalty(grid) > 20;
        },
        text: "발열 폭주! 블록 밀집도를 낮추고 라우팅으로 열을 분산하세요.",
        recommend: []
      },
      {
        condition: function(grid) {
          return TeraFab.Engine.allObjectivesMet(grid, TeraFab.Levels[7]);
        },
        text: "모든 목표 달성! 최종 설계를 SUBMIT으로 제출하세요!",
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
    desc: '수십억 트랜지스터로 구성된 연산 IP 블록. 데이터를 처리하는 핵심 단위.',
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
    desc: '배선 경로. 컴포넌트 간 데이터를 전달하는 인터커넥트.',
    power: 0.3,
    perf: 0.0
  }
};
