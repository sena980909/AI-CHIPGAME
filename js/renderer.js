/**
 * Operation Tera-Fab — DOM Renderer
 * Handles all visual updates: grid, HUD, dialogue, screens.
 */
var TeraFab = window.TeraFab || {};

TeraFab.Renderer = (function() {
  'use strict';

  // ===== Screen Management =====

  function showScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('active');
      screens[i].classList.remove('fade-in');
    }
    var target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      // Re-trigger fade-in animation by forcing reflow
      void target.offsetWidth;
      target.classList.add('fade-in');
    }
  }

  // ===== Grid Rendering =====

  function buildGrid(size, onCellClick) {
    var container = document.getElementById('grid-container');
    container.innerHTML = '';

    var table = document.createElement('table');
    table.className = 'chip-grid size-' + size;

    for (var r = 0; r < size; r++) {
      var tr = document.createElement('tr');
      for (var c = 0; c < size; c++) {
        var td = document.createElement('td');
        td.dataset.row = r;
        td.dataset.col = c;
        td.innerHTML = '<span class="cell-coord">' + r + ',' + c + '</span>';
        td.addEventListener('click', (function(row, col) {
          return function() { onCellClick(row, col); };
        })(r, c));
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    container.appendChild(table);
  }

  function updateCell(row, col, type, locked) {
    var td = document.querySelector(
      '.chip-grid td[data-row="' + row + '"][data-col="' + col + '"]'
    );
    if (!td) return;

    // Clear classes
    td.className = '';
    td.innerHTML = '<span class="cell-coord">' + row + ',' + col + '</span>';

    if (type) {
      var comp = TeraFab.Components[type];
      td.classList.add('placed', 'placed-' + type);
      if (locked) td.classList.add('locked');

      var label = document.createElement('span');
      label.className = 'cell-label';
      label.textContent = type;
      td.insertBefore(label, td.firstChild);

      var name = document.createElement('span');
      name.className = 'cell-name';
      name.textContent = comp ? comp.name : '';
      td.insertBefore(name, td.children[1]);
    }
  }

  function updateGrid(grid, lockedCells, blockedCells) {
    var lockedMap = {};
    if (lockedCells) {
      for (var i = 0; i < lockedCells.length; i++) {
        var lc = lockedCells[i];
        lockedMap[lc.row + ',' + lc.col] = true;
      }
    }

    var blockedMap = {};
    if (blockedCells) {
      for (var i = 0; i < blockedCells.length; i++) {
        var bc = blockedCells[i];
        blockedMap[bc.row + ',' + bc.col] = true;
      }
    }

    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        var key = r + ',' + c;
        if (blockedMap[key]) {
          updateBlockedCell(r, c);
        } else {
          var locked = lockedMap[key] || false;
          updateCell(r, c, grid[r][c], locked);
        }
      }
    }
  }

  function updateBlockedCell(row, col) {
    var td = document.querySelector(
      '.chip-grid td[data-row="' + row + '"][data-col="' + col + '"]'
    );
    if (!td) return;
    td.className = 'blocked';
    td.innerHTML = '<span class="blocked-x">X</span><span class="cell-coord">' + row + ',' + col + '</span>';
  }

  // ===== Toolbar =====

  function buildToolbar(components, selectedTool, onToolSelect) {
    var toolbar = document.getElementById('toolbar');
    toolbar.innerHTML = '<div class="toolbar-title">COMPONENTS</div>';

    var keyNum = 1;
    for (var i = 0; i < components.length; i++) {
      var type = components[i];
      var comp = TeraFab.Components[type];
      if (!comp) continue;

      var btn = document.createElement('div');
      btn.className = 'tool-btn';
      if (selectedTool === type) btn.classList.add('selected');
      btn.dataset.type = type;

      btn.innerHTML =
        '<div class="tool-icon comp-' + type + '">' + type + '</div>' +
        '<span>' + comp.name + '</span>' +
        '<span class="tool-key">' + keyNum + '</span>';

      btn.addEventListener('click', (function(t) {
        return function() { onToolSelect(t); };
      })(type));

      toolbar.appendChild(btn);
      keyNum++;
    }

    // Eraser tool
    var eraser = document.createElement('div');
    eraser.className = 'tool-btn';
    if (selectedTool === 'ERASER') eraser.classList.add('selected');
    eraser.dataset.type = 'ERASER';
    eraser.innerHTML =
      '<div class="tool-icon" style="background:#555">✕</div>' +
      '<span>지우개</span>' +
      '<span class="tool-key">E</span>';
    eraser.addEventListener('click', function() { onToolSelect('ERASER'); });
    toolbar.appendChild(eraser);
  }

  function updateToolbarSelection(selectedTool) {
    var btns = document.querySelectorAll('.tool-btn');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].dataset.type === selectedTool) {
        btns[i].classList.add('selected');
      } else {
        btns[i].classList.remove('selected');
      }
    }
  }

  // ===== PPA Display =====

  function updatePPA(result, level) {
    var perfVal = document.getElementById('ppa-perf-val');
    var powerVal = document.getElementById('ppa-power-val');
    var areaVal = document.getElementById('ppa-area-val');
    var totalVal = document.getElementById('ppa-total-val');

    var perfBar = document.getElementById('ppa-perf-bar');
    var powerBar = document.getElementById('ppa-power-bar');
    var areaBar = document.getElementById('ppa-area-bar');

    if (perfVal) perfVal.textContent = result.performance;
    if (powerVal) powerVal.textContent = result.power;
    if (areaVal) areaVal.textContent = result.area;
    if (totalVal) totalVal.textContent = result.total;

    if (perfBar) perfBar.style.width = result.performance + '%';
    if (powerBar) powerBar.style.width = result.power + '%';
    if (areaBar) areaBar.style.width = result.area + '%';
  }

  // ===== Objectives Display =====

  function updateObjectives(objResults) {
    var list = document.getElementById('obj-list');
    if (!list) return;
    list.innerHTML = '';

    for (var i = 0; i < objResults.length; i++) {
      var obj = objResults[i];
      var li = document.createElement('li');
      li.className = 'obj-item' + (obj.passed ? ' passed' : '');

      li.innerHTML =
        '<span class="obj-check">' + (obj.passed ? '✓' : '') + '</span>' +
        '<span>' + obj.desc + '</span>';

      list.appendChild(li);
    }
  }

  // ===== Component Info =====

  function updateCompInfo(type) {
    var info = document.getElementById('comp-info');
    if (!info) return;

    if (!type || type === 'ERASER') {
      if (type === 'ERASER') {
        info.innerHTML = '<div class="comp-info-name">지우개 모드</div>셀을 클릭하면 컴포넌트를 제거합니다.';
      } else {
        info.innerHTML = '컴포넌트를 선택하세요';
      }
      return;
    }

    var comp = TeraFab.Components[type];
    if (!comp) return;

    info.innerHTML =
      '<div class="comp-info-name" style="color:' + comp.color + '">[' + type + '] ' + comp.name + '</div>' +
      comp.desc + '<br><br>' +
      '<span style="color:var(--green)">성능: ' + comp.perf + '</span> · ' +
      '<span style="color:var(--orange)">전력: ' + comp.power + '</span>';
  }

  // ===== HUD =====

  function updateHUD(level) {
    var hudLevel = document.getElementById('hud-level');
    var hudTitle = document.getElementById('hud-title');
    if (hudLevel) hudLevel.textContent = level.id === 0 ? 'TUTORIAL' : 'Lv.' + level.id;
    if (hudTitle) hudTitle.textContent = level.name;
  }

  // ===== Dialogue =====

  var _typeTimer = null;
  var _typeCallback = null;
  var _fullText = '';
  var _typeComplete = false;

  function showDialogue(entry, onComplete) {
    showScreen('dialogue-screen');

    var speaker = document.getElementById('dialogue-speaker');
    var portrait = document.getElementById('dialogue-portrait');
    var textEl = document.getElementById('dialogue-text');

    if (speaker) speaker.textContent = entry.speaker || '';
    if (portrait) portrait.textContent = entry.portrait || '';
    if (textEl) textEl.textContent = '';

    _fullText = entry.text || '';
    _typeComplete = false;
    _typeCallback = onComplete;

    // Typing effect
    if (_typeTimer) clearInterval(_typeTimer);
    var idx = 0;
    _typeTimer = setInterval(function() {
      if (idx < _fullText.length) {
        textEl.textContent += _fullText[idx];
        idx++;
      } else {
        clearInterval(_typeTimer);
        _typeTimer = null;
        _typeComplete = true;
      }
    }, 15);
  }

  /** Stop typing timer (used by skip all) */
  function skipTyping() {
    if (_typeTimer) {
      clearInterval(_typeTimer);
      _typeTimer = null;
    }
    _typeComplete = true;
    _typeCallback = null;
  }

  /** Skip to full text or advance if already complete. Returns true if advancing. */
  function advanceDialogue() {
    if (!_typeComplete) {
      // Skip typing
      if (_typeTimer) {
        clearInterval(_typeTimer);
        _typeTimer = null;
      }
      var textEl = document.getElementById('dialogue-text');
      if (textEl) textEl.textContent = _fullText;
      _typeComplete = true;
      return false; // not advancing yet
    }
    // Already complete — trigger callback
    if (_typeCallback) {
      var cb = _typeCallback;
      _typeCallback = null;
      cb();
    }
    return true;
  }

  // ===== Result Screen =====

  function showResult(evalResult, level, rankGated) {
    showScreen('result-screen');

    var rankEl = document.getElementById('result-rank');
    var resPerf = document.getElementById('res-perf');
    var resPower = document.getElementById('res-power');
    var resArea = document.getElementById('res-area');
    var resTotal = document.getElementById('res-total');
    var title = document.getElementById('result-title');
    var gateMsg = document.getElementById('rank-gate-msg');
    var nextBtn = document.getElementById('btn-next-level');

    if (title) title.textContent = 'Lv.' + level.id + ' EVALUATION COMPLETE';

    // Rank
    if (rankEl) {
      rankEl.textContent = evalResult.rank;
      rankEl.className = 'result-rank rank-' + evalResult.rank;
    }

    // Rank gate UI
    if (rankGated) {
      if (gateMsg) {
        gateMsg.textContent = 'RANK ' + level.minRank + ' 이상 필요! 다시 도전하세요.';
        gateMsg.classList.remove('hidden');
      }
      if (nextBtn) nextBtn.classList.add('hidden');
    } else {
      if (gateMsg) gateMsg.classList.add('hidden');
      if (nextBtn) nextBtn.classList.remove('hidden');
    }

    // Animate scores counting up
    _animateCount(resPerf, 0, evalResult.performance, 600);
    _animateCount(resPower, 0, evalResult.power, 600);
    _animateCount(resArea, 0, evalResult.area, 600);
    _animateCount(resTotal, 0, evalResult.total, 800);
  }

  function _animateCount(el, from, to, duration) {
    if (!el) return;
    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ===== Victory Screen =====

  function showVictory(stats) {
    showScreen('victory-screen');

    var container = document.getElementById('victory-stats');
    if (!container) return;
    container.innerHTML = '';

    for (var i = 0; i < stats.length; i++) {
      var div = document.createElement('div');
      div.className = 'victory-stat';
      div.innerHTML =
        '<div class="victory-stat-label">' + stats[i].label + '</div>' +
        '<div class="victory-stat-value">' + stats[i].value + '</div>';
      container.appendChild(div);
    }
  }

  // ===== Toast Notification =====

  var _toastTimer = null;
  function showToast(text, type) {
    var el = document.getElementById('toast');
    if (!el) return;
    if (_toastTimer) clearTimeout(_toastTimer);
    el.textContent = text;
    el.classList.remove('success');
    if (type === 'success') el.classList.add('success');
    el.classList.add('show');
    var duration = type === 'success' ? 1500 : 3000;
    _toastTimer = setTimeout(function() {
      el.classList.remove('show');
      el.classList.remove('success');
    }, duration);
  }

  // ===== Hint System =====

  function showHint(text) {
    var bar = document.getElementById('hint-bar');
    var textEl = document.getElementById('hint-text');
    if (!bar || !textEl) return;

    bar.classList.add('active');
    textEl.textContent = text;
  }

  function clearHintHighlights() {
    var cells = document.querySelectorAll('.chip-grid td.hint-highlight');
    for (var i = 0; i < cells.length; i++) {
      cells[i].classList.remove('hint-highlight');
    }
  }

  function highlightCells(positions) {
    clearHintHighlights();
    if (!positions || positions.length === 0) return;

    for (var i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var td = document.querySelector(
        '.chip-grid td[data-row="' + pos.row + '"][data-col="' + pos.col + '"]'
      );
      if (td && !td.classList.contains('placed')) {
        td.classList.add('hint-highlight');
      }
    }
  }

  function resetHintBar() {
    var bar = document.getElementById('hint-bar');
    var textEl = document.getElementById('hint-text');
    if (bar) bar.classList.remove('active');
    if (textEl) textEl.textContent = '힌트를 보려면 HINT 버튼을 누르세요 [H]';
    clearHintHighlights();
  }

  // ===== Heat Map Overlay =====

  function updateHeatMap(heatMap) {
    if (!heatMap) return;
    for (var r = 0; r < heatMap.length; r++) {
      for (var c = 0; c < heatMap[r].length; c++) {
        var td = document.querySelector(
          '.chip-grid td[data-row="' + r + '"][data-col="' + c + '"]'
        );
        if (!td) continue;
        // Remove previous heat classes
        td.classList.remove('heat-0', 'heat-1', 'heat-2', 'heat-3');
        if (heatMap[r][c] > 0) {
          td.classList.add('heat-' + heatMap[r][c]);
        }
      }
    }
  }

  // ===== Tutorial Overlay =====

  function setHudButtonEnabled(id, enabled) {
    var btn = document.getElementById(id);
    if (!btn) return;
    if (enabled) {
      btn.classList.remove('disabled');
    } else {
      btn.classList.add('disabled');
    }
  }

  function showTutorialOverlay(config) {
    var overlay = document.getElementById('tutorial-overlay');
    var bubble = document.getElementById('tutorial-bubble');
    var textEl = document.getElementById('tutorial-bubble-text');
    var counter = document.getElementById('tutorial-step-counter');
    var hintEl = document.getElementById('tutorial-bubble-hint');
    var skipBtn = document.getElementById('btn-tutorial-skip');

    if (!overlay || !bubble) return;

    // Clear previous spotlights
    _clearSpotlights();

    overlay.classList.remove('hidden');

    // Set bubble text
    if (textEl) textEl.textContent = config.text || '';
    if (counter) counter.textContent = 'STEP ' + config.stepNum + '/' + config.totalSteps;
    if (hintEl) hintEl.textContent = config.clickToAdvance ? '[CLICK]' : '';

    // Spotlight target
    if (config.spotlight) {
      _applySpotlight(config.spotlight);
    }

    // Bubble click handler
    if (bubble._tutHandler) {
      bubble.removeEventListener('click', bubble._tutHandler);
    }
    bubble._tutHandler = function(e) {
      e.stopPropagation();
      if (config.onBubbleClick) config.onBubbleClick();
    };
    bubble.addEventListener('click', bubble._tutHandler);

    // Skip button handler
    if (skipBtn) {
      if (skipBtn._tutHandler) {
        skipBtn.removeEventListener('click', skipBtn._tutHandler);
      }
      skipBtn._tutHandler = function(e) {
        e.stopPropagation();
        if (config.onSkip) config.onSkip();
      };
      skipBtn.addEventListener('click', skipBtn._tutHandler);
    }

    // Prevent overlay clicks from going through (except to spotlighted elements)
    if (overlay._tutHandler) {
      overlay.removeEventListener('click', overlay._tutHandler);
    }
    overlay._tutHandler = function(e) {
      if (e.target === overlay) {
        e.stopPropagation();
      }
    };
    overlay.addEventListener('click', overlay._tutHandler);
  }

  function hideTutorialOverlay() {
    var overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.classList.add('hidden');
    _clearSpotlights();

    // Re-enable all HUD buttons
    setHudButtonEnabled('btn-hint', true);
    setHudButtonEnabled('btn-undo', true);
    setHudButtonEnabled('btn-clear', true);
    setHudButtonEnabled('btn-submit', true);
  }

  function _clearSpotlights() {
    var spots = document.querySelectorAll('.tutorial-interactable');
    for (var i = 0; i < spots.length; i++) {
      spots[i].classList.remove('tutorial-interactable');
    }
  }

  function _applySpotlight(target) {
    if (target === 'grid') {
      var grid = document.getElementById('grid-container');
      if (grid) grid.classList.add('tutorial-interactable');
    } else if (target === 'toolbar') {
      var toolbar = document.getElementById('toolbar');
      if (toolbar) toolbar.classList.add('tutorial-interactable');
    } else if (target === 'ppa') {
      // Spotlight the PPA section (first panel-section in info-panel)
      var panels = document.querySelectorAll('.info-panel .panel-section');
      if (panels.length > 0) panels[0].classList.add('tutorial-interactable');
    } else if (target === 'objectives') {
      var panels2 = document.querySelectorAll('.info-panel .panel-section');
      if (panels2.length > 1) panels2[1].classList.add('tutorial-interactable');
    } else if (target === 'submit') {
      var btn = document.getElementById('btn-submit');
      if (btn) btn.classList.add('tutorial-interactable');
    } else if (target === 'cell_1_1') {
      var td = document.querySelector('.chip-grid td[data-row="1"][data-col="1"]');
      if (td) td.classList.add('tutorial-interactable');
    } else if (target === 'adjacent_cells') {
      // Spotlight cells adjacent to center (1,1)
      var adjCoords = [[0,1],[1,0],[1,2],[2,1]];
      for (var i = 0; i < adjCoords.length; i++) {
        var cell = document.querySelector(
          '.chip-grid td[data-row="' + adjCoords[i][0] + '"][data-col="' + adjCoords[i][1] + '"]'
        );
        if (cell && !cell.classList.contains('placed')) {
          cell.classList.add('tutorial-interactable');
        }
      }
    }
  }

  // ===== PUBLIC API =====
  return {
    showScreen: showScreen,
    buildGrid: buildGrid,
    updateCell: updateCell,
    updateGrid: updateGrid,
    buildToolbar: buildToolbar,
    updateToolbarSelection: updateToolbarSelection,
    updatePPA: updatePPA,
    updateObjectives: updateObjectives,
    updateCompInfo: updateCompInfo,
    updateHUD: updateHUD,
    showDialogue: showDialogue,
    advanceDialogue: advanceDialogue,
    skipTyping: skipTyping,
    showResult: showResult,
    showVictory: showVictory,
    showToast: showToast,
    showHint: showHint,
    clearHintHighlights: clearHintHighlights,
    highlightCells: highlightCells,
    resetHintBar: resetHintBar,
    updateHeatMap: updateHeatMap,
    setHudButtonEnabled: setHudButtonEnabled,
    showTutorialOverlay: showTutorialOverlay,
    hideTutorialOverlay: hideTutorialOverlay
  };

})();
