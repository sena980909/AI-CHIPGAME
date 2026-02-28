/**
 * Operation Tera-Fab — Game Controller
 * State machine, events, game loop, save/load.
 */
var TeraFab = window.TeraFab || {};

TeraFab.Game = (function() {
  'use strict';

  var Engine = TeraFab.Engine;
  var Renderer = TeraFab.Renderer;
  var Levels = TeraFab.Levels;
  var Story = TeraFab.Story;

  // ===== STATE =====
  var state = {
    phase: 'TITLE', // TITLE, DIALOGUE, PLAYING, EVALUATING, RESULTS, VICTORY
    currentLevel: 0, // index into Levels array
    grid: null,
    selectedTool: null,
    undoStack: [],
    dialogueQueue: [],
    dialogueIndex: 0,
    dialogueNextPhase: null,
    levelResults: [] // store results for each completed level
  };

  // ===== GRID MANAGEMENT =====

  function createGrid(size) {
    var grid = [];
    for (var r = 0; r < size; r++) {
      grid[r] = [];
      for (var c = 0; c < size; c++) {
        grid[r][c] = null;
      }
    }
    return grid;
  }

  function cloneGrid(grid) {
    var clone = [];
    for (var r = 0; r < grid.length; r++) {
      clone[r] = grid[r].slice();
    }
    return clone;
  }

  function isLocked(row, col) {
    var level = Levels[state.currentLevel];
    if (!level.locked) return false;
    for (var i = 0; i < level.locked.length; i++) {
      if (level.locked[i].row === row && level.locked[i].col === col) return true;
    }
    return false;
  }

  // ===== GAME FLOW =====

  function init() {
    // Load save if exists
    loadProgress();

    // Bind events
    bindEvents();

    // Start at title
    if (state.phase === 'TITLE') {
      Renderer.showScreen('title-screen');
    } else {
      // Resume from saved state
      resumeState();
    }
  }

  function startGame() {
    state.phase = 'DIALOGUE';
    state.currentLevel = 0;
    state.levelResults = [];
    playDialogue('intro', function() {
      startLevelBriefing();
    });
  }

  function startLevelBriefing() {
    var lvIdx = state.currentLevel;
    var seqKey = 'lv' + (lvIdx + 1) + '_briefing';
    playDialogue(seqKey, function() {
      startPlaying();
    });
  }

  function startPlaying() {
    state.phase = 'PLAYING';
    var level = Levels[state.currentLevel];

    // Init grid
    state.grid = createGrid(level.gridSize);
    state.undoStack = [];
    state.selectedTool = level.components[0];

    // Place locked cells
    if (level.locked) {
      for (var i = 0; i < level.locked.length; i++) {
        var lc = level.locked[i];
        state.grid[lc.row][lc.col] = lc.type;
      }
    }

    // Render
    Renderer.showScreen('game-screen');
    Renderer.updateHUD(level);
    Renderer.buildGrid(level.gridSize, onCellClick);
    Renderer.buildToolbar(level.components, state.selectedTool, onToolSelect);
    Renderer.updateGrid(state.grid, level.locked);
    Renderer.updateCompInfo(state.selectedTool);
    refreshPPA();

    // Auto-show first hint for beginners
    setTimeout(function() { showHint(); }, 300);

    saveProgress();
  }

  function submitDesign() {
    if (state.phase !== 'PLAYING') return;

    var level = Levels[state.currentLevel];
    var objResults = Engine.checkObjectives(state.grid, level);
    Renderer.updateObjectives(objResults);

    // Check if all objectives met
    var allMet = Engine.allObjectivesMet(state.grid, level);
    if (!allMet) {
      // Show failed objectives
      for (var i = 0; i < objResults.length; i++) {
        if (!objResults[i].passed) {
          objResults[i].failed = true;
        }
      }
      // Re-render with failed state
      var list = document.getElementById('obj-list');
      if (list) {
        var items = list.querySelectorAll('.obj-item');
        for (var j = 0; j < items.length; j++) {
          if (!objResults[j].passed) {
            items[j].classList.add('failed');
            items[j].querySelector('.obj-check').textContent = '✗';
          }
        }
      }
      return;
    }

    // Evaluate PPA
    state.phase = 'EVALUATING';
    var evalResult = Engine.evaluate(state.grid, level);

    state.levelResults.push({
      level: level.id,
      result: evalResult
    });

    saveProgress();

    // Show result
    Renderer.showResult(evalResult, level);
    state.phase = 'RESULTS';
  }

  function nextLevel() {
    var lvIdx = state.currentLevel;
    var seqKey = 'lv' + (lvIdx + 1) + '_complete';

    playDialogue(seqKey, function() {
      if (state.currentLevel + 1 < Levels.length) {
        // Next level
        state.currentLevel++;
        startLevelBriefing();
      } else {
        // Game complete
        showEnding();
      }
    });
  }

  function showEnding() {
    playDialogue('ending', function() {
      showVictory();
    });
  }

  function showVictory() {
    state.phase = 'VICTORY';
    var stats = [];
    for (var i = 0; i < state.levelResults.length; i++) {
      var lr = state.levelResults[i];
      stats.push({
        label: 'Lv.' + lr.level + ' SCORE',
        value: lr.result.total
      });
      stats.push({
        label: 'Lv.' + lr.level + ' RANK',
        value: lr.result.rank
      });
    }
    Renderer.showVictory(stats);
    clearSave();
  }

  // ===== DIALOGUE SYSTEM =====

  function playDialogue(sequenceKey, onComplete) {
    var seq = Story.sequences[sequenceKey];
    if (!seq || seq.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    state.phase = 'DIALOGUE';
    state.dialogueQueue = seq;
    state.dialogueIndex = 0;
    state.dialogueNextPhase = onComplete;

    showNextDialogue();
  }

  function showNextDialogue() {
    if (state.dialogueIndex >= state.dialogueQueue.length) {
      state.dialogueQueue = [];
      if (state.dialogueNextPhase) {
        state.dialogueNextPhase();
      }
      return;
    }

    var entry = state.dialogueQueue[state.dialogueIndex];
    Renderer.showDialogue(entry, function() {
      state.dialogueIndex++;
      showNextDialogue();
    });
  }

  // ===== CELL INTERACTION =====

  function onCellClick(row, col) {
    if (state.phase !== 'PLAYING') return;
    if (isLocked(row, col)) return;

    var tool = state.selectedTool;
    var currentValue = state.grid[row][col];

    if (tool === 'ERASER') {
      if (currentValue) {
        // Save undo state
        state.undoStack.push(cloneGrid(state.grid));
        state.grid[row][col] = null;
      }
    } else if (tool) {
      if (currentValue === tool) {
        // Toggle off if same type
        state.undoStack.push(cloneGrid(state.grid));
        state.grid[row][col] = null;
      } else {
        state.undoStack.push(cloneGrid(state.grid));
        state.grid[row][col] = tool;
      }
    }

    // Cap undo stack
    if (state.undoStack.length > 50) {
      state.undoStack.shift();
    }

    var level = Levels[state.currentLevel];
    Renderer.updateGrid(state.grid, level.locked);
    refreshPPA();
    saveProgress();
  }

  function onToolSelect(type) {
    state.selectedTool = type;
    Renderer.updateToolbarSelection(type);
    Renderer.updateCompInfo(type);
  }

  function undo() {
    if (state.phase !== 'PLAYING') return;
    if (state.undoStack.length === 0) return;

    state.grid = state.undoStack.pop();
    var level = Levels[state.currentLevel];
    Renderer.updateGrid(state.grid, level.locked);
    refreshPPA();
    saveProgress();
  }

  function clearGrid() {
    if (state.phase !== 'PLAYING') return;

    var level = Levels[state.currentLevel];
    state.undoStack.push(cloneGrid(state.grid));
    state.grid = createGrid(level.gridSize);

    // Re-place locked cells
    if (level.locked) {
      for (var i = 0; i < level.locked.length; i++) {
        var lc = level.locked[i];
        state.grid[lc.row][lc.col] = lc.type;
      }
    }

    Renderer.updateGrid(state.grid, level.locked);
    refreshPPA();
    saveProgress();
  }

  function refreshPPA() {
    var level = Levels[state.currentLevel];
    var evalResult = Engine.evaluate(state.grid, level);
    Renderer.updatePPA(evalResult, level);

    var objResults = Engine.checkObjectives(state.grid, level);
    Renderer.updateObjectives(objResults);

    // Clear hint highlights when grid changes
    Renderer.clearHintHighlights();
  }

  // ===== HINT SYSTEM =====

  function showHint() {
    if (state.phase !== 'PLAYING') return;

    var level = Levels[state.currentLevel];
    if (!level.hints) return;

    // Find the first matching hint
    for (var i = 0; i < level.hints.length; i++) {
      var hint = level.hints[i];
      if (hint.condition(state.grid)) {
        Renderer.showHint(hint.text);

        // Get recommended cells
        var recs = hint.recommend || [];
        if (hint.recommendFn) {
          recs = hint.recommendFn(state.grid);
        }
        if (recs.length > 0) {
          Renderer.highlightCells(recs);
          // Also auto-select the recommended tool
          if (recs[0].type) {
            onToolSelect(recs[0].type);
          }
        }
        return;
      }
    }

    // Fallback generic hint
    Renderer.showHint("블록을 배치하고 오른쪽 목표(OBJECTIVES)를 모두 달성하면 SUBMIT!");
  }

  // ===== EVENT BINDING =====

  function bindEvents() {
    // Title start button
    document.getElementById('btn-start').addEventListener('click', function() {
      if (state.phase === 'TITLE') startGame();
    });

    // Dialogue click to advance
    document.getElementById('dialogue-screen').addEventListener('click', function() {
      if (state.phase === 'DIALOGUE') {
        Renderer.advanceDialogue();
      }
    });

    // HUD buttons
    document.getElementById('btn-hint').addEventListener('click', showHint);
    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-clear').addEventListener('click', clearGrid);
    document.getElementById('btn-submit').addEventListener('click', submitDesign);

    // Result next button
    document.getElementById('btn-next-level').addEventListener('click', function() {
      if (state.phase === 'RESULTS') nextLevel();
    });

    // Victory restart
    document.getElementById('btn-restart').addEventListener('click', function() {
      clearSave();
      state.phase = 'TITLE';
      state.currentLevel = 0;
      state.levelResults = [];
      Renderer.showScreen('title-screen');
    });

    // Keyboard
    document.addEventListener('keydown', function(e) {
      // Dialogue advance
      if (state.phase === 'DIALOGUE') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          Renderer.advanceDialogue();
        }
        return;
      }

      // Title start
      if (state.phase === 'TITLE') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      // Results continue
      if (state.phase === 'RESULTS') {
        if (e.key === 'Enter') {
          e.preventDefault();
          nextLevel();
        }
        return;
      }

      if (state.phase !== 'PLAYING') return;

      var level = Levels[state.currentLevel];

      // Number keys 1-5 for component selection
      var keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= level.components.length) {
        onToolSelect(level.components[keyNum - 1]);
        return;
      }

      // E for eraser
      if (e.key === 'e' || e.key === 'E') {
        onToolSelect('ERASER');
        return;
      }

      // H for hint
      if (e.key === 'h' || e.key === 'H') {
        showHint();
        return;
      }

      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      // Enter for submit
      if (e.key === 'Enter') {
        e.preventDefault();
        submitDesign();
        return;
      }
    });
  }

  // ===== SAVE / LOAD =====

  var SAVE_KEY = 'terafab_save';

  function saveProgress() {
    try {
      var data = {
        phase: state.phase,
        currentLevel: state.currentLevel,
        grid: state.grid,
        levelResults: state.levelResults
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch(e) { /* silent */ }
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && data.phase === 'PLAYING' && data.grid) {
        state.phase = data.phase;
        state.currentLevel = data.currentLevel || 0;
        state.grid = data.grid;
        state.levelResults = data.levelResults || [];
      }
    } catch(e) { /* silent */ }
  }

  function resumeState() {
    if (state.phase === 'PLAYING' && state.grid) {
      var level = Levels[state.currentLevel];
      state.selectedTool = level.components[0];
      state.undoStack = [];

      Renderer.showScreen('game-screen');
      Renderer.updateHUD(level);
      Renderer.buildGrid(level.gridSize, onCellClick);
      Renderer.buildToolbar(level.components, state.selectedTool, onToolSelect);
      Renderer.updateGrid(state.grid, level.locked);
      Renderer.updateCompInfo(state.selectedTool);
      refreshPPA();
    } else {
      state.phase = 'TITLE';
      Renderer.showScreen('title-screen');
    }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
  }

  // ===== INIT ON DOM READY =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===== PUBLIC API =====
  return {
    getState: function() { return state; },
    restart: function() {
      clearSave();
      state.phase = 'TITLE';
      state.currentLevel = 0;
      state.levelResults = [];
      Renderer.showScreen('title-screen');
    }
  };

})();
