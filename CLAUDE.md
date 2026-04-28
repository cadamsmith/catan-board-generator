# 🎲 catan-board-generator: claude.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## project overview

A static, no-build-step web app that generates randomized Catan board layouts. Open `src/index.html` directly in a browser — there is no dev server, bundler, or package manager.

## running the app

Open `src/index.html` in a browser. No installation or build step required.

## architecture

All logic lives in two files:

- **`src/main.js`** — Single-file vanilla JS. Contains all game logic and rendering.
- **`src/index.html`** — Bootstrap 5 UI with a `<canvas id="board">` for rendering.
- **`src/main.css`** — Parchment/wood theme styles on top of Bootstrap.

### board generation flow

1. `generateBoard()` reads the `#game-type` select, calls `getBoardConfig()` to get the game config (tile counts, number tokens, harbors), then calls `processConfig()` and `drawGrid()`.
2. `processConfig(config)` — shuffles hex tiles, number tokens, and harbors; populates `config.hexes[j][i]` with `{ type, numberToken, coordinates, harbor }` objects using the `baseMap` 2D array as a template.
3. `drawGrid(width, height)` — renders all hexes to the canvas using flat-top hex geometry. Hex radius is calculated to fit the canvas.

### baseMap format

`baseMap` is a 2D array in each config (`getBase34Config`, `getBase56Config`):
- `1` = land hex tile
- `0` = empty (water/nothing drawn)
- `'h0'`–`'h5'` = harbor tile; the number is the edge orientation (0–5) indicating which hex side faces land

### hex geometry

Hexagons are pointy-topped, drawn with a `sin/cos` loop. Vertices start at the bottom and go clockwise. The grid uses odd-r offset coordinates (odd rows shift right by half a hex). The `MATH_CONSTANTS` object holds precomputed values (`SQRT_3`, `SQRT_3_OVER_2`, `SIXTY_DEGREES`).

### enum pattern

`enumValue(name)` creates frozen objects with a `toString()` — used for `GAME_TYPES`, `RESOURCES`, `HEX_TYPES`, and `DEV_CARD_TYPES`. Compare with `===`.

### balance scoring

After each board generation, `computeBalanceScore(config)` computes 6 metrics and returns a normalized `{ overall, metrics }` object:

1. **Resource Distribution** — how evenly each resource type is spread across 3 symmetry axes
2. **Resource Clustering** — penalizes same-type hexes sharing an edge
3. **Probability Distribution** — how evenly pip weight is distributed across the 3 axes
4. **Number Clustering** — penalizes same-number tokens on adjacent hexes
5. **Probability Per Resource** — each resource's pip total should be proportional to its tile count
6. **Harbor Balance** — penalizes specific resource harbors adjacent to their matching resource type

Raw scores are normalized using empirical p5/p95 ranges stored in `METRIC_RANGES` (keyed by game type, determined via 1000-board calibration runs). Normalized scores map to letter grades (A/B/C/D) per metric and Poor/Fair/Good/Excellent overall. To recalibrate, temporarily restore `window.runCalibration` and run it in the browser console.

`getLandNeighbors(col, row, config)` returns the up-to-6 land hex neighbors using odd-r offset coordinate math — reuse this whenever adjacency is needed.

## key behaviors

- Spacebar, the "Regenerate Board" button, or tapping the canvas (mobile) regenerates the board.
- Zoom controls (+ / -) apply a canvas `scale()` transform without regenerating.
- Canvas width and height resize responsively via `ResizeObserver`; height is capped at `min(width * 0.9, innerHeight * 0.55)`.
- 6 and 8 number tokens render with a pink background (`#FFA8B5`) to highlight high-probability tiles.
- The settings panel (game type select, card counts, resource probabilities, and balance score) is collapsible on mobile via a toggle button in the header.
- Resource probability tiles show the true roll probability per resource (sum of unique token probabilities).
- Balance score and resource probability sections are hidden until the first board is generated.

## ui / theme

- Parchment background (`#faf3e0`) and wood-brown border (`#5D3A1A`) applied to both the settings card and board canvas via `box-shadow`.
- Card count tiles use the same colors as their corresponding hex tile types.
- Playfair Display (Google Fonts) is used for the page title.
- `toDisplayName(value)` converts `SCREAMING_SNAKE_CASE` enum names to Title Case for display.
