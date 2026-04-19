# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static, no-build-step web app that generates randomized Catan board layouts. Open `src/index.html` directly in a browser — there is no dev server, bundler, or package manager.

## Running the App

Open `src/index.html` in a browser. No installation or build step required.

## Architecture

All logic lives in two files:

- **`src/main.js`** — Single-file vanilla JS. Contains all game logic and rendering.
- **`src/index.html`** — Bootstrap 5 UI with a `<canvas id="board">` for rendering.
- **`src/main.css`** — Parchment/wood theme styles on top of Bootstrap.

### Board generation flow

1. `generateBoard()` reads the `#game-type` select, calls `getBoardConfig()` to get the game config (tile counts, number tokens, harbors), then calls `processConfig()` and `drawGrid()`.
2. `processConfig(config)` — shuffles hex tiles, number tokens, and harbors; populates `config.hexes[j][i]` with `{ type, numberToken, coordinates, harbor }` objects using the `baseMap` 2D array as a template.
3. `drawGrid(width, height)` — renders all hexes to the canvas using flat-top hex geometry. Hex radius is calculated to fit the canvas.

### baseMap format

`baseMap` is a 2D array in each config (`getBase34Config`, `getBase56Config`):
- `1` = land hex tile
- `0` = empty (water/nothing drawn)
- `'h0'`–`'h5'` = harbor tile; the number is the edge orientation (0–5) indicating which hex side faces land

### Hex geometry

Hexagons are flat-topped, drawn with a `sin/cos` loop starting from the top vertex. The `MATH_CONSTANTS` object holds precomputed values (`SQRT_3`, `SQRT_3_OVER_2`, `SIXTY_DEGREES`).

### Enum pattern

`enumValue(name)` creates frozen objects with a `toString()` — used for `GAME_TYPES`, `RESOURCES`, `HEX_TYPES`, and `DEV_CARD_TYPES`. Compare with `===`.

## Key Behaviors

- Spacebar, the "Regenerate Board" button, or tapping the canvas (mobile) regenerates the board.
- Zoom controls (+ / -) apply a canvas `scale()` transform without regenerating.
- Canvas width and height resize responsively via `ResizeObserver`; height is capped at `min(width * 0.9, innerHeight * 0.55)`.
- 6 and 8 number tokens render with a pink background (`#FFA8B5`) to highlight high-probability tiles.
- The settings panel (game type select + card counts) is collapsible on mobile via a toggle button in the header.

## UI / Theme

- Parchment background (`#faf3e0`) and wood-brown border (`#5D3A1A`) applied to both the settings card and board canvas via `box-shadow`.
- Card count tiles use the same colors as their corresponding hex tile types.
- Playfair Display (Google Fonts) is used for the page title.
- `toDisplayName(value)` converts `SCREAMING_SNAKE_CASE` enum names to Title Case for display.
