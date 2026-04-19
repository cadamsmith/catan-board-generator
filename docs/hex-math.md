# Hex Math

This document explains the geometry used to draw the Catan board.

## Reference

The article [**How to implement a Hex Grid**](https://eperezcosano.github.io/hex-grid/) by E. Pérez Cosano was used heavily as a reference during development and is the primary source for the geometric approach described here.

## Flat-top hexagons

The board uses **flat-top** hexagons — two edges are horizontal (top and bottom), and the remaining four edges are angled. A hexagon is defined by its center `(x, y)` and circumradius `r` (center to vertex).

Key derived measurements:

| Value | Formula | Meaning |
|---|---|---|
| Flat width | `r * √3` | Distance between opposite flat edges |
| Full width | `2r` | Distance between opposite vertices |
| Row height step | `3r / 2` | Vertical distance between row centers |

## Vertex coordinates

The 6 vertices are computed by stepping around the center at 60° intervals, starting from the **top** (angle = 0):

```
point[i] = (x + r * sin(i * 60°), y + r * cos(i * 60°))
```

Using `sin` for x and `cos` for y (rather than the usual convention) starts the loop at the top vertex rather than the right, which places the first flat edge at the top — correct for flat-top orientation.

Vertex indices run clockwise from the top-left vertex:

```
    0   1
   /     \
  5       2
   \     /
    4   3
```

## Grid layout

Rows alternate between two x-offsets to produce the characteristic brick-like offset pattern.

- **Even rows** (`j % 2 === 0`): centers start at `topLeft.x + r * (√3 / 2)`
- **Odd rows** (`j % 2 === 1`): centers start at `topLeft.x`

Each hex in a row is spaced `r * √3` apart horizontally (flat-width). Each new row steps `3r / 2` downward.

```
Even row:    ·   ·   ·
Odd row:   ·   ·   ·
Even row:    ·   ·   ·
```

## Fitting the grid to the canvas

`calculateHexRadius(width, height)` finds the largest `r` such that the full grid fits within the canvas (minus `padding` on each side).

**Width constraint** — the grid occupies `r * √3 * (2w + 1) / 2` pixels wide (the odd-row offset adds half a hex-width):

```
r_from_width = canvasWidth / √3 / (w + 0.5)
             = (2 * canvasWidth) / (√3 * (2w + 1))
```

**Height constraint** — `h` rows step `3r/2` each, plus the top half of the first row (`r/2`) and the bottom half of the last (`r/2`), totalling `r * (3h + 1) / 2` pixels tall:

```
r_from_height = (2 * canvasHeight) / (3h + 1)
```

The final radius is `min(r_from_width, r_from_height)` so it satisfies both constraints.

## Harbor quadrilateral

Each harbor tile stores an `orientation` (0–5) matching one of the six edges. The harbor box is a quadrilateral drawn using four of the six hex vertices:

- **Near edge**: vertices `[side]` and `[side + 1]` (the edge facing land)
- **Far points**: midpoints between `[side]` ↔ `[side + 3]` and `[side + 1]` ↔ `[side + 4]`

This creates a trapezoid that sits on the land-facing edge and tapers toward the center of the hex.
