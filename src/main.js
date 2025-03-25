const RESOURCES = makeEnum("Resources", [
  "BRICK",
  "LUMBER",
  "ORE",
  "GRAIN",
  "WOOL",
  "ANY",
]);

const HEX_TYPES = makeEnum("HexTypes", [
  "HILLS",
  "FOREST",
  "MOUNTAINS",
  "FIELDS",
  "PASTURE",
  "DESERT",
]);

const DEV_CARD_TYPES = makeEnum("DevCardTypes", [
  "KNIGHT",
  "ROAD_BUILDING",
  "YEAR_OF_PLENTY",
  "MONOPOLY",
  "VICTORY_POINT",
]);

const harbors = [
  {
    resource: RESOURCES.ANY,
    cost: 3,
    count: 4,
  },
  {
    resource: RESOURCES.LUMBER,
    cost: 2,
  },
  {
    resource: RESOURCES.BRICK,
    cost: 2,
  },
  {
    resource: RESOURCES.WOOL,
    cost: 1,
  },
  {
    resource: RESOURCES.GRAIN,
    cost: 1,
  },
  {
    resource: RESOURCES.ORE,
    cost: 1,
  },
];

const resourceCards = [
  {
    resource: RESOURCES.BRICK,
    count: 19,
  },
  {
    resource: RESOURCES.LUMBER,
    count: 19,
  },
  {
    resource: RESOURCES.WOOL,
    count: 19,
  },
  {
    resource: RESOURCES.GRAIN,
    count: 19,
  },
  {
    resource: RESOURCES.ORE,
    count: 19,
  },
];

const hexTiles = [
  {
    type: HEX_TYPES.HILLS,
    count: 2,
  },
  {
    type: HEX_TYPES.FOREST,
    count: 4,
  },
  {
    type: HEX_TYPES.MOUNTAINS,
    count: 3,
  },
  {
    type: HEX_TYPES.FIELDS,
    count: 4,
  },
  {
    type: HEX_TYPES.PASTURE,
    count: 4,
  },
  {
    type: HEX_TYPES.DESERT,
    count: 1,
  },
];

const devCards = [
  {
    type: DEV_CARD_TYPES.KNIGHT,
    count: 14,
  },
  {
    type: DEV_CARD_TYPES.ROAD_BUILDING,
    count: 2,
  },
  {
    type: DEV_CARD_TYPES.YEAR_OF_PLENTY,
    count: 2,
  },
  {
    type: DEV_CARD_TYPES.MONOPOLY,
    count: 2,
  },
  {
    type: DEV_CARD_TYPES.VICTORY_POINT,
    count: 5,
  },
];

const config = {
  hexTiles,
  number_tokens: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
  harbors,
  resourceCards,
  devCards,
};

const MATH_CONSTANTS = {
  SIXTY_DEGREES: Math.PI / 3,
  SQRT_3_OVER_2: Math.sqrt(3) / 2,
  SQRT_3: Math.sqrt(3),
};

const settings = {
  hexes: [],
};

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const padding = 30;

drawGrid(5, 5);

document.getElementById("generate").addEventListener("click", () => {
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);

  drawGrid(width, height);
});

/**
 * Draws a grid of hexagons of given width and height
 * @param {number} width - How many hexagons wide the grid is
 * @param {number} height - How many hexagons tall the grid is
 */
function drawGrid(width, height) {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#A8E0FF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const r = calculateHexRadius(width, height);

  const gridMeasures = calculateGridMeasures(width, height, r);
  const leftOffset = padding + ((getCanvasWidth() - gridMeasures.width) / 2);
  const topOffset = padding + ((getCanvasHeight() - gridMeasures.height) / 2);

  const topLeft = [leftOffset + r * MATH_CONSTANTS.SQRT_3_OVER_2, topOffset + r];
  console.log(topLeft);

  const center = [...topLeft];

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const points = drawHexagon(center[0], center[1], r);

      const hex = {
        center,
        points,
        coordinates: [i, j]
      };

      settings.hexes.push(hex);

      center[0] += 2 * r * MATH_CONSTANTS.SQRT_3_OVER_2;
    }

    if (j % 2 === 0) {
      center[0] = topLeft[0] + r * MATH_CONSTANTS.SQRT_3_OVER_2;
    } else {
      center[0] = topLeft[0];
    }
    center[1] += (3 * r) / 2;
  }
}

/**
 * Draws a hexagon at the given coordinates with the given radius
 * @param {number} x - The x coordinate of the center of the hexagon
 * @param {number} y - The y coordinate of the center of the hexagon
 * @param {number} r - The radius of the hexagon
 * @returns {number[][]} The coordinates of the 6 hexagon points
 */
function drawHexagon(x, y, r) {
  const points = [];

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = MATH_CONSTANTS.SIXTY_DEGREES * i;

    const point = [x + r * Math.sin(angle), y + r * Math.cos(angle)];

    points.push(point);

    ctx.lineTo(point[0], point[1]);
  }
  ctx.closePath();
  ctx.fillStyle = '#6D466B';
  ctx.fill();
  ctx.stroke();

  return points;
}

/**
 * Calculates the maximum hexagon radius that can fit in the canvas for specified width and height
 * @param {number} width - How many hexagons wide the grid is
 * @param {number} height - How many hexagons tall the grid is
 * @returns {number} The radius of the hexagon
 */
function calculateHexRadius(width, height) {
  let maxHexWidth;
  if (height === 1) {
    maxHexWidth = getCanvasWidth() / width;
  } else {
    maxHexWidth = (2 * getCanvasWidth()) / (width * 2 + 1);
  }

  const maxHexHeight = (4 * getCanvasHeight()) / (3 * height + 1);

  return Math.min(maxHexWidth / MATH_CONSTANTS.SQRT_3, maxHexHeight / 2);
}

/**
 * Calculates the width and height of the grid based on the grid's dimensions and hexagon radius
 * @param {number} width - How many hexagons wide the grid is
 * @param {number} height - How many hexagons tall the grid is
 * @param {number} r - The radius of the hexagon
 * @returns {Object} The width and height of the grid
 */
function calculateGridMeasures(width, height, r) {
  let gridWidth;
  let gridHeight;

  if (height === 1) {
    gridWidth = r * MATH_CONSTANTS.SQRT_3 * width;
  } else {
    gridWidth = r * MATH_CONSTANTS.SQRT_3 * (2 * width + 1) / 2;
  }

  gridHeight = ((3 * height + 1) / 2) * r;

  return { width: gridWidth, height: gridHeight };
}

/**
 * Returns the width of the canvas (minus the padding)
 * @returns {number} The width of the canvas
 */
function getCanvasWidth() {
  return canvas.width - 2 * padding;
}

/**
 * Returns the height of the canvas (minus the padding)
 * @returns {number} The height of the canvas
 */
function getCanvasHeight() {
  return canvas.height - 2 * padding;
}

/**
 * Creates an enum with the given name and values
 * @param {string} name - The name of the enum
 * @param {string[]} values - The values of the enum
 * @returns {Object} The enum
 */
function makeEnum(name, values) {
  const enumValue = (name) => Object.freeze({ toString: () => name });

  return Object.freeze(
    values.reduce(
      (acc, val) => ({
        ...acc,
        [val]: enumValue(`${name}.${val}`),
      }),
      {}
    )
  );
}
