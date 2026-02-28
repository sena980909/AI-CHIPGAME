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
    }
    var target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      target.classList.add('fade-in');
    }
  }

  // ===== Grid Rendering =====

  function buildGrid(size, onCellClick) {
    var container = document.getElementById('grid-container');
    container.innerHTML = '';

    var table = document.createElement('table');
    table.className = 'chip-grid';

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

  function updateGrid(grid, lockedCells) {
    var lockedMap = {};
    if (lockedCells) {
      for (var i = 0; i < lockedCells.length; i++) {
        var lc = lockedCells[i];
        lockedMap[lc.row + ',' + lc.col] = true;
      }
    }

    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        var isLocked = lockedMap[r + ',' + c] || false;
        updateCell(r, c, grid[r][c], isLocked);
      }
    }
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
    if (hudLevel) hudLevel.textContent = 'Lv.' + level.id;
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

  function showResult(evalResult, level) {
    showScreen('result-screen');

    var rankEl = document.getElementById('result-rank');
    var resPerf = document.getElementById('res-perf');
    var resPower = document.getElementById('res-power');
    var resArea = document.getElementById('res-area');
    var resTotal = document.getElementById('res-total');
    var title = document.getElementById('result-title');

    if (title) title.textContent = 'Lv.' + level.id + ' EVALUATION COMPLETE';

    // Rank
    if (rankEl) {
      rankEl.textContent = evalResult.rank;
      rankEl.className = 'result-rank rank-' + evalResult.rank;
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
    showResult: showResult,
    showVictory: showVictory
  };

})();
