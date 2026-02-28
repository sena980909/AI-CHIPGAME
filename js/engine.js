/**
 * Operation Tera-Fab — PPA Calculation Engine
 * Pure computation module. No DOM access.
 */
var TeraFab = window.TeraFab || {};

TeraFab.Engine = (function() {
  'use strict';

  // Direction vectors for adjacency (4-connected)
  var DIRS = [[-1,0],[1,0],[0,-1],[0,1]];

  // ===== UTILITY FUNCTIONS =====

  /** Count cells of a given type in the grid */
  function countType(grid, type) {
    var count = 0;
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === type) count++;
      }
    }
    return count;
  }

  /** Count all non-empty cells */
  function countPlaced(grid) {
    var count = 0;
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        if (grid[r][c]) count++;
      }
    }
    return count;
  }

  /** Get all non-empty cell positions */
  function getPlacedCells(grid) {
    var cells = [];
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        if (grid[r][c]) cells.push({row: r, col: c, type: grid[r][c]});
      }
    }
    return cells;
  }

  /** Check if position is valid */
  function inBounds(grid, r, c) {
    return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
  }

  /** Get adjacent cells of a position */
  function getNeighbors(grid, r, c) {
    var neighbors = [];
    for (var d = 0; d < DIRS.length; d++) {
      var nr = r + DIRS[d][0];
      var nc = c + DIRS[d][1];
      if (inBounds(grid, nr, nc) && grid[nr][nc]) {
        neighbors.push({row: nr, col: nc, type: grid[nr][nc]});
      }
    }
    return neighbors;
  }

  /** BFS: Check if all placed components are connected */
  function isConnected(grid) {
    var cells = getPlacedCells(grid);
    if (cells.length <= 1) return true;

    var size = grid.length;
    var visited = [];
    for (var r = 0; r < size; r++) {
      visited[r] = [];
      for (var c = 0; c < size; c++) {
        visited[r][c] = false;
      }
    }

    // BFS from first placed cell
    var queue = [cells[0]];
    visited[cells[0].row][cells[0].col] = true;
    var count = 0;

    while (queue.length > 0) {
      var cur = queue.shift();
      count++;
      for (var d = 0; d < DIRS.length; d++) {
        var nr = cur.row + DIRS[d][0];
        var nc = cur.col + DIRS[d][1];
        if (inBounds(grid, nr, nc) && !visited[nr][nc] && grid[nr][nc]) {
          visited[nr][nc] = true;
          queue.push({row: nr, col: nc});
        }
      }
    }

    return count === cells.length;
  }

  /** Check if any cell of typeA is adjacent to any cell of typeB */
  function hasAdjacentType(grid, typeA, typeB) {
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === typeA) {
          var neighbors = getNeighbors(grid, r, c);
          for (var n = 0; n < neighbors.length; n++) {
            if (neighbors[n].type === typeB) return true;
          }
        }
      }
    }
    return false;
  }

  /** Count adjacency pairs between two types */
  function countAdjPairs(grid, typeA, typeB) {
    var count = 0;
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === typeA) {
          var neighbors = getNeighbors(grid, r, c);
          for (var n = 0; n < neighbors.length; n++) {
            if (neighbors[n].type === typeB) count++;
          }
        }
      }
    }
    // Each pair counted once (A-B), not double-counting if typeA === typeB
    if (typeA === typeB) return count / 2;
    return count;
  }

  /** BFS shortest path distance between two cell types. Returns Infinity if not reachable. */
  function bfsDistance(grid, typeA, typeB) {
    if (typeA === typeB) return 0;

    var size = grid.length;
    var startCells = [];
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (grid[r][c] === typeA) startCells.push({row: r, col: c});
      }
    }
    if (startCells.length === 0) return Infinity;

    var visited = [];
    for (var r2 = 0; r2 < size; r2++) {
      visited[r2] = [];
      for (var c2 = 0; c2 < size; c2++) {
        visited[r2][c2] = false;
      }
    }

    var queue = [];
    for (var s = 0; s < startCells.length; s++) {
      queue.push({row: startCells[s].row, col: startCells[s].col, dist: 0});
      visited[startCells[s].row][startCells[s].col] = true;
    }

    while (queue.length > 0) {
      var cur = queue.shift();
      for (var d = 0; d < DIRS.length; d++) {
        var nr = cur.row + DIRS[d][0];
        var nc = cur.col + DIRS[d][1];
        if (inBounds(grid, nr, nc) && !visited[nr][nc] && grid[nr][nc]) {
          if (grid[nr][nc] === typeB) return cur.dist + 1;
          visited[nr][nc] = true;
          queue.push({row: nr, col: nc, dist: cur.dist + 1});
        }
      }
    }

    return Infinity;
  }

  /** Count thermal hotspots: groups of 3+ active (non-R) IP blocks in adjacent cluster.
   *  Routing acts as thermal via — cells with R neighbor get penalty halved. */
  function countHeatPenalty(grid) {
    var size = grid.length;
    var penalty = 0;

    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (grid[r][c] && grid[r][c] !== 'R') {
          // Count active (non-R) neighbors
          var activeNeighbors = 0;
          var hasRoutingNeighbor = false;
          for (var d = 0; d < DIRS.length; d++) {
            var nr = r + DIRS[d][0];
            var nc = c + DIRS[d][1];
            if (inBounds(grid, nr, nc) && grid[nr][nc]) {
              if (grid[nr][nc] === 'R') {
                hasRoutingNeighbor = true;
              } else {
                activeNeighbors++;
              }
            }
          }
          // Penalty if 2+ active neighbors (makes 3+ cluster with self)
          if (activeNeighbors >= 2) {
            var pen = (activeNeighbors - 1) * 1;
            // R acts as thermal via: halve penalty if routing is adjacent
            if (hasRoutingNeighbor) pen = Math.ceil(pen * 0.5);
            penalty += pen;
          }
        }
      }
    }
    return penalty;
  }

  // ===== PPA CALCULATION =====

  /**
   * Calculate Performance score (0-100)
   * - BFS shortest paths between key components
   * - Data throughput based on component count
   * - Adjacency synergy bonuses
   */
  function calcPerformance(grid, level) {
    var placed = countPlaced(grid);
    var size = grid.length;
    var totalCells = size * size;

    if (placed === 0) return 0;

    var score = 0;

    // 1. Data throughput (base score from placed components) — 30 points max
    var throughput = 0;
    var cells = getPlacedCells(grid);
    for (var i = 0; i < cells.length; i++) {
      var comp = TeraFab.Components[cells[i].type];
      if (comp) throughput += comp.perf;
    }
    var maxThroughput = totalCells * 1.5; // theoretical max
    score += Math.min(30, (throughput / maxThroughput) * 40);

    // 2. Adjacency synergy bonuses — 40 points max
    var synergy = 0;
    // SRAM ↔ NPU: +20 per pair (on-chip bandwidth maximization)
    synergy += countAdjPairs(grid, 'S', 'N') * 20;
    // Logic Block ↔ Routing: +10 per pair (data path optimization)
    synergy += countAdjPairs(grid, 'T', 'R') * 10;
    // I/O Controller ↔ Logic Block: +5 per pair (bus interface)
    synergy += countAdjPairs(grid, 'C', 'T') * 5;
    // I/O Controller ↔ SRAM: +5 per pair (memory-mapped I/O)
    synergy += countAdjPairs(grid, 'C', 'S') * 5;

    var maxSynergy = size === 3 ? 40 : 100;
    score += Math.min(40, (synergy / maxSynergy) * 40);

    // 3. Connectivity / path efficiency — 30 points max
    if (isConnected(grid)) {
      score += 15; // base connectivity bonus

      // Shorter paths between key types = better
      var pathBonus = 0;
      if (countType(grid, 'T') > 0 && countType(grid, 'C') > 0) {
        var distTC = bfsDistance(grid, 'T', 'C');
        if (distTC < Infinity) pathBonus += Math.max(0, 5 - distTC) * 2;
      }
      if (countType(grid, 'S') > 0 && countType(grid, 'N') > 0) {
        var distSN = bfsDistance(grid, 'S', 'N');
        if (distSN < Infinity) pathBonus += Math.max(0, 5 - distSN) * 3;
      }
      score += Math.min(15, pathBonus);
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * Calculate Power score (0-100)
   * Lower power = higher score
   * - Dynamic power from active components
   * - Static power from filled cells
   * - Routing capacitance
   * - Heat penalty from dense clusters
   */
  function calcPower(grid, level) {
    var placed = countPlaced(grid);
    var size = grid.length;

    if (placed === 0) return 0;

    // Calculate raw power consumption
    var dynamicPower = 0;
    var cells = getPlacedCells(grid);
    for (var i = 0; i < cells.length; i++) {
      var comp = TeraFab.Components[cells[i].type];
      if (comp) dynamicPower += comp.power;
    }

    // Static power: baseline per filled cell
    var staticPower = placed * 0.3;

    // Routing capacitance: each routing adjacent to another routing adds wire cap
    var routingCap = countAdjPairs(grid, 'R', 'R') * 0.5;

    // Heat penalty
    var heatPen = countHeatPenalty(grid);

    var totalPower = dynamicPower + staticPower + routingCap + heatPen;

    // Normalize: lower power = higher score
    // Expected range: for 3x3 ~3-15, for 5x5 ~5-40
    var maxExpected = size === 3 ? 20 : 50;
    var minExpected = size === 3 ? 1 : 2;

    // Score: 100 when power is at or below minExpected, 0 when at maxExpected
    var normalized = 1 - ((totalPower - minExpected) / (maxExpected - minExpected));
    var score = Math.round(normalized * 100);

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate Area score (0-100)
   * - Utilization (50%): ratio of filled cells to total
   * - Compactness (30%): how tightly packed components are
   * - Dead space penalty (20%): enclosed empty cells surrounded by components
   */
  function calcArea(grid, level) {
    var placed = countPlaced(grid);
    var size = grid.length;
    var totalCells = size * size;

    if (placed === 0) return 0;

    // 1. Utilization (50 points max)
    // Realistic die utilization targets: 55-89% for 3x3, 48-76% for 5x5
    var utilRatio = placed / totalCells;
    var optimalMin = size === 3 ? 0.55 : 0.48;
    var optimalMax = size === 3 ? 0.89 : 0.76;
    var utilScore;
    if (utilRatio >= optimalMin && utilRatio <= optimalMax) {
      utilScore = 50;
    } else if (utilRatio < optimalMin) {
      utilScore = (utilRatio / optimalMin) * 40;
    } else {
      utilScore = 50 - ((utilRatio - optimalMax) / (1 - optimalMax)) * 20;
    }

    // 2. Compactness (30 points max)
    // Measure: average number of neighbors per placed cell
    var totalNeighbors = 0;
    var cells = getPlacedCells(grid);
    for (var i = 0; i < cells.length; i++) {
      totalNeighbors += getNeighbors(grid, cells[i].row, cells[i].col).length;
    }
    var avgNeighbors = placed > 0 ? totalNeighbors / placed : 0;
    var maxAvgNeighbors = Math.min(4, placed - 1); // theoretical max
    if (maxAvgNeighbors <= 0) maxAvgNeighbors = 1;
    var compactScore = Math.min(30, (avgNeighbors / maxAvgNeighbors) * 35);

    // 3. Dead space (20 points max)
    // Count empty cells fully enclosed by placed cells (all 4 neighbors are placed or OOB)
    var deadSpace = 0;
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (!grid[r][c]) {
          var allBlocked = true;
          for (var d = 0; d < DIRS.length; d++) {
            var nr = r + DIRS[d][0];
            var nc = c + DIRS[d][1];
            if (inBounds(grid, nr, nc) && !grid[nr][nc]) {
              allBlocked = false;
              break;
            }
          }
          if (allBlocked) deadSpace++;
        }
      }
    }
    var deadPenalty = deadSpace * 5;
    var deadScore = Math.max(0, 20 - deadPenalty);

    var score = Math.round(utilScore + compactScore + deadScore);
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate total PPA score with level-specific weights
   * Returns { performance, power, area, total, rank }
   */
  function evaluate(grid, level) {
    var perf = calcPerformance(grid, level);
    var power = calcPower(grid, level);
    var area = calcArea(grid, level);

    var w = level.weights;
    var total = Math.round(perf * w.performance + power * w.power + area * w.area);

    var rank = 'C';
    if (total >= level.ranks.S) rank = 'S';
    else if (total >= level.ranks.A) rank = 'A';
    else if (total >= level.ranks.B) rank = 'B';

    return {
      performance: perf,
      power: power,
      area: area,
      total: total,
      rank: rank
    };
  }

  /**
   * Check all objectives for a level
   * Returns array of { id, desc, passed }
   */
  function checkObjectives(grid, level) {
    var results = [];
    for (var i = 0; i < level.objectives.length; i++) {
      var obj = level.objectives[i];
      results.push({
        id: obj.id,
        desc: obj.desc,
        passed: obj.check(grid)
      });
    }
    return results;
  }

  /** Check if all objectives are met */
  function allObjectivesMet(grid, level) {
    for (var i = 0; i < level.objectives.length; i++) {
      if (!level.objectives[i].check(grid)) return false;
    }
    return true;
  }

  // ===== TEST SUITE =====
  function _runTests() {
    var pass = 0;
    var fail = 0;

    function assert(condition, msg) {
      if (condition) {
        pass++;
        console.log('  ✓ ' + msg);
      } else {
        fail++;
        console.error('  ✗ ' + msg);
      }
    }

    console.log('=== TeraFab Engine Tests ===');

    // Test 1: countType
    console.log('\n[countType]');
    var g1 = [['T','C','T'],['R',null,null],[null,null,null]];
    assert(countType(g1, 'T') === 2, 'Count T=2');
    assert(countType(g1, 'C') === 1, 'Count C=1');
    assert(countType(g1, 'R') === 1, 'Count R=1');
    assert(countType(g1, 'S') === 0, 'Count S=0');

    // Test 2: isConnected
    console.log('\n[isConnected]');
    var g2a = [['T','C','T'],['R',null,null],[null,null,null]];
    assert(isConnected(g2a) === true, 'Connected: T-C-T row + R below');
    var g2b = [['T',null,'T'],[null,null,null],[null,null,'R']];
    assert(isConnected(g2b) === false, 'Disconnected: isolated cells');
    var g2c = [[null,null,null],[null,'T',null],[null,null,null]];
    assert(isConnected(g2c) === true, 'Single cell = connected');

    // Test 3: hasAdjacentType
    console.log('\n[hasAdjacentType]');
    var g3 = [['T','R',null],[null,null,null],[null,null,null]];
    assert(hasAdjacentType(g3, 'T', 'R') === true, 'T adj to R');
    assert(hasAdjacentType(g3, 'T', 'C') === false, 'T not adj to C');

    // Test 4: Performance scoring
    console.log('\n[Performance]');
    var lv1 = TeraFab.Levels[0];
    var g4 = [['T','C','T'],['R',null,null],[null,null,null]];
    var perf4 = calcPerformance(g4, lv1);
    assert(perf4 > 0, 'Perf > 0 for valid layout: ' + perf4);
    assert(perf4 <= 100, 'Perf <= 100: ' + perf4);

    // Test 5: Power scoring
    console.log('\n[Power]');
    var power4 = calcPower(g4, lv1);
    assert(power4 > 0, 'Power > 0: ' + power4);
    assert(power4 <= 100, 'Power <= 100: ' + power4);

    // Test 6: Area scoring
    console.log('\n[Area]');
    var area4 = calcArea(g4, lv1);
    assert(area4 > 0, 'Area > 0: ' + area4);
    assert(area4 <= 100, 'Area <= 100: ' + area4);

    // Test 7: Full evaluation
    console.log('\n[evaluate]');
    var eval4 = evaluate(g4, lv1);
    assert(eval4.total > 0, 'Total > 0: ' + eval4.total);
    assert(['S','A','B','C'].indexOf(eval4.rank) >= 0, 'Valid rank: ' + eval4.rank);
    console.log('  Result:', JSON.stringify(eval4));

    // Test 8: Objectives check
    console.log('\n[objectives]');
    var objs = checkObjectives(g4, lv1);
    assert(objs.length === lv1.objectives.length, 'All objectives checked');
    for (var i = 0; i < objs.length; i++) {
      console.log('  ' + (objs[i].passed ? '✓' : '✗') + ' ' + objs[i].desc);
    }

    // Test 9: Heat penalty
    console.log('\n[heatPenalty]');
    var gHot = [['T','T','T'],['T','T',null],[null,null,null]];
    var heat = countHeatPenalty(gHot);
    assert(heat > 0, 'Heat penalty for dense T cluster: ' + heat);
    var gCool = [['T',null,'T'],[null,null,null],['T',null,null]];
    var coolHeat = countHeatPenalty(gCool);
    assert(coolHeat === 0, 'No heat for spread out: ' + coolHeat);

    // Test 10: Lv2 with NPU center
    console.log('\n[Lv2 Layout]');
    var lv2 = TeraFab.Levels[1];
    var g5 = [
      [null, null, 'R', null, null],
      [null, 'T',  'S', 'T',  null],
      ['R',  'S',  'N', 'C',  'R'],
      [null, 'T',  'C', 'T',  null],
      [null, null, 'R', null, null]
    ];
    var eval5 = evaluate(g5, lv2);
    console.log('  Lv2 Result:', JSON.stringify(eval5));
    assert(eval5.total > 0, 'Lv2 total > 0: ' + eval5.total);
    var allMet = allObjectivesMet(g5, lv2);
    assert(allMet === true, 'Lv2 all objectives met: ' + allMet);

    console.log('\n=== Results: ' + pass + ' passed, ' + fail + ' failed ===');
    return { pass: pass, fail: fail };
  }

  // ===== PUBLIC API =====
  return {
    countType: countType,
    countPlaced: countPlaced,
    getPlacedCells: getPlacedCells,
    getNeighbors: getNeighbors,
    isConnected: isConnected,
    hasAdjacentType: hasAdjacentType,
    countAdjPairs: countAdjPairs,
    bfsDistance: bfsDistance,
    countHeatPenalty: countHeatPenalty,
    calcPerformance: calcPerformance,
    calcPower: calcPower,
    calcArea: calcArea,
    evaluate: evaluate,
    checkObjectives: checkObjectives,
    allObjectivesMet: allObjectivesMet,
    _runTests: _runTests
  };

})();
