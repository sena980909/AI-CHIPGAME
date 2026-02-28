/**
 * Operation Tera-Fab — Tutorial System
 * Interactive 13-step guided tutorial on a 3x3 grid.
 */
var TeraFab = window.TeraFab || {};

TeraFab.Tutorial = (function() {
  'use strict';

  // ===== TUTORIAL LEVEL (self-contained) =====
  var TUTORIAL_LEVEL = {
    id: 0,
    name: "튜토리얼",
    subtitle: "기본 조작 학습",
    gridSize: 3,
    components: ['T', 'C', 'R'],
    locked: [],
    weights: { performance: 0.40, power: 0.30, area: 0.30 },
    ranks: { S: 75, A: 60, B: 40, C: 0 },
    objectives: [
      {
        id: 'tut_T',
        desc: '로직 블록(T) 1개 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'T') >= 1;
        }
      },
      {
        id: 'tut_R',
        desc: '라우팅(R) 1개 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'R') >= 1;
        }
      },
      {
        id: 'tut_C',
        desc: '컨트롤러(C) 1개 배치',
        check: function(grid) {
          return TeraFab.Engine.countType(grid, 'C') >= 1;
        }
      }
    ],
    hints: []
  };

  // ===== 13 TUTORIAL STEPS =====
  var STEPS = [
    // Step 1: welcome
    {
      id: 'welcome',
      dialogue: [
        {
          speaker: "CANON MARCO",
          portrait: "🛸",
          text: "잠깐! 첫 미션 전에 기본 조작을 알려줄게.\n걱정 마, 금방 끝나!"
        }
      ],
      hintText: null,
      spotlight: null,
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'dialogue_end'
    },
    // Step 2: explain_grid
    {
      id: 'explain_grid',
      dialogue: null,
      hintText: null,
      bubbleText: "이게 바로 칩 다이야.\n3×3 격자 위에 컴포넌트를 배치하면 돼.\n각 칸에 하나씩 놓을 수 있어.",
      spotlight: 'grid',
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'bubble_click'
    },
    // Step 3: explain_toolbar
    {
      id: 'explain_toolbar',
      dialogue: null,
      hintText: null,
      bubbleText: "왼쪽이 도구 모음이야.\n여기서 배치할 컴포넌트를 선택해.\n숫자 키로도 선택 가능!",
      spotlight: 'toolbar',
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'bubble_click'
    },
    // Step 4: select_tool_T
    {
      id: 'select_tool_T',
      dialogue: null,
      hintText: "도구 모음에서 [T] 로직 블록을 클릭하세요! (또는 숫자 1키)",
      bubbleText: "좋아, 직접 해보자!\n도구 모음에서 [T] 로직 블록을 선택해봐.\n클릭하거나 키보드 1을 눌러!",
      spotlight: 'toolbar',
      allowedTools: ['T'],
      allowedCells: null,
      allowSubmit: false,
      trigger: 'tool_selected_T'
    },
    // Step 5: place_T_center
    {
      id: 'place_T_center',
      dialogue: null,
      hintText: "가운데 칸 (1,1)을 클릭해서 로직 블록을 배치하세요!",
      bubbleText: "잘했어! 이제 가운데 칸(1,1)을 클릭해서\n로직 블록을 배치해봐.\n중앙이 가장 유리한 위치야!",
      spotlight: 'cell_1_1',
      allowedTools: ['T'],
      allowedCells: [[1,1]],
      allowSubmit: false,
      trigger: 'cell_placed_1_1'
    },
    // Step 6: explain_ppa
    {
      id: 'explain_ppa',
      dialogue: null,
      hintText: null,
      bubbleText: "오른쪽에 PPA 메트릭이 보이지?\n\nPerformance — 성능 점수\nPower — 전력 효율 점수\nArea — 면적 효율 점수\n\n이 세 점수의 합이 최종 등급을 결정해!",
      spotlight: 'ppa',
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'bubble_click'
    },
    // Step 7: select_tool_R
    {
      id: 'select_tool_R',
      dialogue: null,
      hintText: "도구 모음에서 [R] 라우팅을 선택하세요!",
      bubbleText: "이번엔 [R] 라우팅을 선택해봐.\n라우팅은 블록 사이의 데이터 통로야!",
      spotlight: 'toolbar',
      allowedTools: ['R'],
      allowedCells: null,
      allowSubmit: false,
      trigger: 'tool_selected_R'
    },
    // Step 8: place_R_adjacent
    {
      id: 'place_R_adjacent',
      dialogue: null,
      hintText: "로직 블록(T) 바로 옆 칸에 라우팅(R)을 배치하세요!",
      bubbleText: "로직 블록 바로 옆에 라우팅을 놓아봐!\n인접하면 데이터 경로가 최적화돼서\n+10 시너지 보너스를 받아!",
      spotlight: 'adjacent_cells',
      allowedTools: ['R'],
      allowedCells: [[0,1],[1,0],[1,2],[2,1]],
      allowSubmit: false,
      trigger: 'cell_placed_adjacent'
    },
    // Step 9: explain_adjacency
    {
      id: 'explain_adjacency',
      dialogue: null,
      hintText: null,
      bubbleText: "봤지? PPA 점수가 올라갔어!\n블록을 인접하게 배치하면 시너지 보너스:\n\n  T↔R 인접: +10 (데이터 경로 최적화)\n  C↔T 인접: +5 (버스 연결)\n\n나중에 더 강력한 조합도 배우게 될 거야!\n이 보너스가 S랭크의 비결이지.",
      spotlight: 'ppa',
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'bubble_click'
    },
    // Step 10: place_C
    {
      id: 'place_C',
      dialogue: null,
      hintText: "[C] 컨트롤러를 선택하고 빈 인접 셀에 배치하세요!",
      bubbleText: "마지막 블록! [C] 컨트롤러를 선택하고\n기존 블록 옆 빈 칸에 배치해봐.\n모든 블록이 연결되어야 해!",
      spotlight: 'toolbar',
      allowedTools: ['C'],
      allowedCells: null, // computed dynamically
      allowSubmit: false,
      trigger: 'cell_placed_C'
    },
    // Step 11: explain_objectives
    {
      id: 'explain_objectives',
      dialogue: null,
      hintText: null,
      bubbleText: "오른쪽 아래에 OBJECTIVES가 보여?\n모든 목표에 체크가 들어와야\nSUBMIT 할 수 있어.\n\n지금 다 달성했으니 제출 가능!",
      spotlight: 'objectives',
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'bubble_click'
    },
    // Step 12: submit_tutorial
    {
      id: 'submit_tutorial',
      dialogue: null,
      hintText: "SUBMIT 버튼을 눌러 설계를 제출하세요!",
      bubbleText: "목표를 모두 달성했어!\n이제 오른쪽 위 SUBMIT 버튼을 눌러봐!",
      spotlight: 'submit',
      allowedTools: null,
      allowedCells: null,
      allowSubmit: true,
      trigger: 'submitted'
    },
    // Step 13: celebration
    {
      id: 'celebration',
      dialogue: null,
      hintText: null,
      bubbleText: null,
      spotlight: null,
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'celebration_click'
    },
    // Step 14: tutorial_complete
    {
      id: 'tutorial_complete',
      dialogue: [
        {
          speaker: "CANON MARCO",
          portrait: "🎉",
          text: "완벽해! 기본 조작은 마스터했군.\n\n이제 진짜 미션을 시작하자!\n더 복잡한 칩이 기다리고 있어..."
        }
      ],
      hintText: null,
      spotlight: null,
      allowedTools: null,
      allowedCells: null,
      allowSubmit: false,
      trigger: 'dialogue_end'
    }
  ];

  // ===== STATE =====
  var _active = false;
  var _stepIndex = 0;
  var _onComplete = null;
  var _grid = null; // reference to game grid

  // ===== PUBLIC: START / ADVANCE / SKIP =====

  function start(onComplete) {
    _active = true;
    _stepIndex = 0;
    _onComplete = onComplete;

    // Reset dynamic state from previous run
    for (var i = 0; i < STEPS.length; i++) {
      if (STEPS[i].id === 'place_C') {
        STEPS[i].allowedCells = null;
      }
    }

    runStep();
  }

  function skip() {
    if (!_active) return;
    _active = false;
    _stepIndex = 0;
    TeraFab.Renderer.hideTutorialOverlay();
    // Remove celebration overlay if present
    var celeb = document.getElementById('tutorial-celebration');
    if (celeb) celeb.remove();
    localStorage.setItem('terafab_tutorial_done', '1');
    if (_onComplete) {
      var cb = _onComplete;
      _onComplete = null;
      cb();
    }
  }

  function advance() {
    if (!_active) return;
    _stepIndex++;
    if (_stepIndex >= STEPS.length) {
      // Tutorial complete
      _active = false;
      TeraFab.Renderer.hideTutorialOverlay();
      localStorage.setItem('terafab_tutorial_done', '1');
      if (_onComplete) {
        var cb = _onComplete;
        _onComplete = null;
        cb();
      }
      return;
    }
    runStep();
  }

  function runStep() {
    var step = STEPS[_stepIndex];
    if (!step) return;

    // If step has dialogue, play it first, then show bubble/spotlight
    if (step.dialogue) {
      TeraFab.Game.playTutorialDialogue(step.dialogue, function() {
        if (step.trigger === 'dialogue_end') {
          advance();
        } else {
          showStepUI(step);
        }
      });
      return;
    }

    showStepUI(step);
  }

  function showCelebration() {
    // Evaluate the tutorial grid
    var grid = TeraFab.Game.getState().grid;
    var evalResult = TeraFab.Engine.evaluate(grid, TUTORIAL_LEVEL);

    // Hide tutorial overlay if visible
    TeraFab.Renderer.hideTutorialOverlay();
    TeraFab.Renderer.clearHintHighlights();

    // Create celebration overlay
    var gameScreen = document.getElementById('game-screen');
    var overlay = document.createElement('div');
    overlay.className = 'tutorial-complete-overlay';
    overlay.id = 'tutorial-celebration';
    overlay.innerHTML =
      '<div class="tutorial-complete-title">TUTORIAL COMPLETE</div>' +
      '<div class="tutorial-complete-rank">' + evalResult.rank + '</div>' +
      '<div class="tutorial-complete-score">SCORE: <span>' + evalResult.total + '</span></div>' +
      '<div class="tutorial-complete-msg">[클릭하여 계속]</div>';
    gameScreen.appendChild(overlay);

    overlay.addEventListener('click', function handler() {
      overlay.removeEventListener('click', handler);
      overlay.remove();
      advance();
    });
  }

  function showStepUI(step) {
    // Ensure game screen is visible (after dialogue steps switch away)
    TeraFab.Renderer.showScreen('game-screen');

    // Restore PLAYING phase (dialogue changes it to DIALOGUE)
    TeraFab.Game.getState().phase = 'PLAYING';

    // Handle celebration step specially
    if (step.id === 'celebration') {
      showCelebration();
      return;
    }

    // Update hint bar
    if (step.hintText) {
      TeraFab.Renderer.showHint(step.hintText);
    }

    // Disable all HUD buttons except what's needed
    TeraFab.Renderer.setHudButtonEnabled('btn-hint', false);
    TeraFab.Renderer.setHudButtonEnabled('btn-undo', false);
    TeraFab.Renderer.setHudButtonEnabled('btn-clear', false);
    TeraFab.Renderer.setHudButtonEnabled('btn-submit', step.allowSubmit === true);

    // Compute dynamic allowed cells for step 10
    if (step.id === 'place_C' && !step.allowedCells) {
      step.allowedCells = getAdjacentEmptyCells();
    }

    // Highlight allowed cells
    if (step.allowedCells && step.allowedCells.length > 0) {
      var recs = [];
      for (var i = 0; i < step.allowedCells.length; i++) {
        recs.push({ row: step.allowedCells[i][0], col: step.allowedCells[i][1] });
      }
      TeraFab.Renderer.highlightCells(recs);
    } else {
      TeraFab.Renderer.clearHintHighlights();
    }

    // Show tutorial overlay/bubble
    if (step.bubbleText) {
      // Count only bubble steps for the counter (skip dialogue-only steps)
      var bubbleNum = 0, bubbleTotal = 0;
      for (var s = 0; s < STEPS.length; s++) {
        if (STEPS[s].bubbleText) {
          bubbleTotal++;
          if (s <= _stepIndex) bubbleNum++;
        }
      }
      TeraFab.Renderer.showTutorialOverlay({
        text: step.bubbleText,
        spotlight: step.spotlight,
        stepNum: bubbleNum,
        totalSteps: bubbleTotal,
        clickToAdvance: step.trigger === 'bubble_click',
        onBubbleClick: function() {
          if (step.trigger === 'bubble_click') {
            advance();
          }
        },
        onSkip: skip
      });
    } else {
      TeraFab.Renderer.hideTutorialOverlay();
    }
  }

  /** Get empty cells adjacent to any placed cell */
  function getAdjacentEmptyCells() {
    var grid = TeraFab.Game.getState().grid;
    if (!grid) return [];
    var result = [];
    var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    var seen = {};
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        if (grid[r][c]) {
          for (var d = 0; d < dirs.length; d++) {
            var nr = r + dirs[d][0], nc = c + dirs[d][1];
            var key = nr + ',' + nc;
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && !grid[nr][nc] && !seen[key]) {
              seen[key] = true;
              result.push([nr, nc]);
            }
          }
        }
      }
    }
    return result;
  }

  // ===== GUARD FUNCTIONS (called by game.js) =====

  function canSelectTool(type) {
    if (!_active) return true;
    var step = STEPS[_stepIndex];
    if (!step || !step.allowedTools) return false;
    return step.allowedTools.indexOf(type) >= 0;
  }

  function canClickCell(row, col) {
    if (!_active) return true;
    var step = STEPS[_stepIndex];
    if (!step) return false;

    // For step 10 (place_C), dynamically compute allowed cells
    var cells = step.allowedCells;
    if (!cells) return false;

    for (var i = 0; i < cells.length; i++) {
      if (cells[i][0] === row && cells[i][1] === col) return true;
    }
    return false;
  }

  function canSubmit() {
    if (!_active) return true;
    var step = STEPS[_stepIndex];
    return step && step.allowSubmit === true;
  }

  function canUndo() {
    if (!_active) return true;
    return false; // undo disabled during tutorial
  }

  function canClear() {
    if (!_active) return true;
    return false; // clear disabled during tutorial
  }

  function canShowHint() {
    if (!_active) return true;
    return false; // hints are managed by tutorial
  }

  // ===== EVENT NOTIFICATIONS (called by game.js) =====

  // Success feedback messages (randomized)
  var _successMsgs = ['좋아!', '완벽!', '바로 그거야!', '잘했어!', '훌륭해!'];
  function _showSuccess(msg) {
    TeraFab.Renderer.showToast(msg || _successMsgs[Math.floor(Math.random() * _successMsgs.length)], 'success');
  }

  function onToolSelected(type) {
    if (!_active) return;
    var step = STEPS[_stepIndex];
    if (!step) return;

    if (step.trigger === 'tool_selected_T' && type === 'T') {
      _showSuccess();
      advance();
    } else if (step.trigger === 'tool_selected_R' && type === 'R') {
      _showSuccess();
      advance();
    } else if (step.id === 'place_C' && type === 'C') {
      // For step 10: after selecting C, hide overlay so grid is clickable
      step.allowedCells = getAdjacentEmptyCells();
      TeraFab.Renderer.hideTutorialOverlay();
      if (step.hintText) {
        TeraFab.Renderer.showHint(step.hintText);
      }
      // Highlight allowed cells
      var recs = [];
      for (var i = 0; i < step.allowedCells.length; i++) {
        recs.push({ row: step.allowedCells[i][0], col: step.allowedCells[i][1] });
      }
      TeraFab.Renderer.highlightCells(recs);
    }
  }

  function onCellPlaced(row, col, type) {
    if (!_active) return;
    var step = STEPS[_stepIndex];
    if (!step) return;

    if (step.trigger === 'cell_placed_1_1' && row === 1 && col === 1) {
      _showSuccess('첫 블록 배치 성공!');
      advance();
    } else if (step.trigger === 'cell_placed_adjacent') {
      _showSuccess('시너지 보너스 +10!');
      advance();
    } else if (step.trigger === 'cell_placed_C' && type === 'C') {
      _showSuccess('모든 블록 배치 완료!');
      advance();
    }
  }

  function onSubmitted() {
    if (!_active) return;
    var step = STEPS[_stepIndex];
    if (step && step.trigger === 'submitted') {
      _showSuccess('설계 제출 완료!');
      advance();
    }
  }

  // ===== GETTERS =====

  function isActive() { return _active; }

  function getLevel() { return TUTORIAL_LEVEL; }

  function isDone() {
    return localStorage.getItem('terafab_tutorial_done') === '1';
  }

  function clearDone() {
    localStorage.removeItem('terafab_tutorial_done');
  }

  // ===== PUBLIC API =====
  return {
    LEVEL: TUTORIAL_LEVEL,
    start: start,
    skip: skip,
    advance: advance,
    isActive: isActive,
    getLevel: getLevel,
    isDone: isDone,
    clearDone: clearDone,
    canSelectTool: canSelectTool,
    canClickCell: canClickCell,
    canSubmit: canSubmit,
    canUndo: canUndo,
    canClear: canClear,
    canShowHint: canShowHint,
    onToolSelected: onToolSelected,
    onCellPlaced: onCellPlaced,
    onSubmitted: onSubmitted
  };

})();
