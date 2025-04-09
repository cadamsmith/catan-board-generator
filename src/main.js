const GAME_TYPES = {
  BASE_3_4: enumValue("BASE_3_4"),
  BASE_5_6: enumValue("BASE_5_6"),
};

const RESOURCES = {
  BRICK: enumValue("BRICK"),
  LUMBER: enumValue("LUMBER"),
  ORE: enumValue("ORE"),
  GRAIN: enumValue("GRAIN"),
  WOOL: enumValue("WOOL"),
  ANY: enumValue("ANY"),
};

const HEX_TYPES = {
  HILLS: enumValue("HILLS"),
  FOREST: enumValue("FOREST"),
  MOUNTAINS: enumValue("MOUNTAINS"),
  FIELDS: enumValue("FIELDS"),
  PASTURE: enumValue("PASTURE"),
  DESERT: enumValue("DESERT"),
};

const DEV_CARD_TYPES = {
  KNIGHT: enumValue("KNIGHT"),
  ROAD_BUILDING: enumValue("ROAD_BUILDING"),
  YEAR_OF_PLENTY: enumValue("YEAR_OF_PLENTY"),
  MONOPOLY: enumValue("MONOPOLY"),
  VICTORY_POINT: enumValue("VICTORY_POINT"),
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

ctx.font = "16px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

const padding = 30;

let config;

document.querySelector("#generate-board-btn").addEventListener("click", () => {
  if (document.querySelector("#base34").checked) {
    config = getBoardConfig(GAME_TYPES.BASE_3_4);
  } else {
    config = getBoardConfig(GAME_TYPES.BASE_5_6);
  }

  init(config);

  displayResourceCardCounts(config);
  displayDevCardCounts(config);

  document.querySelector(".wizard-steps").classList.add("page-2");
});

document.querySelector(".prev-step-btn").addEventListener("click", () => {
  document.querySelector(".wizard-steps").classList.remove("page-2");
});

function displayResourceCardCounts(config) {
  const resourceCardCounts = config.resourceCardCounts;
  const wrapperElement = document.getElementById("resource-card-counts");

  for (let i = 0; i < resourceCardCounts.length; i++) {
    const resourceCardCount = resourceCardCounts[i];

    const resourceCardCountElement = wrapperElement.querySelector(
      `[data-id="${resourceCardCount.resource}"]`
    );

    resourceCardCountElement.textContent = `${resourceCardCount.resource}: ${resourceCardCount.count}`;
  }
}

function displayDevCardCounts(config) {
  const devCardCounts = config.devCardCounts;
  const wrapperElement = document.getElementById("dev-card-counts");

  for (let i = 0; i < devCardCounts.length; i++) {
    const devCardCount = devCardCounts[i];

    const devCardCountElement = wrapperElement.querySelector(
      `[data-id="${devCardCount.type}"]`
    );

    devCardCountElement.textContent = `${devCardCount.type}: ${devCardCount.count}`;
  }
}
/**
 * Initializes the board
 * @param {Object} config - The configuration object
 */
function init(config) {
  processConfig(config);

  drawGrid(config.width, config.height);
}

/**
 * Returns the configuration object for the given game type
 * @param {string} gameType - The game type
 * @returns {Object} The configuration object
 */
function getBoardConfig(gameType) {
  switch (gameType) {
    case GAME_TYPES.BASE_3_4:
      return getBase34Config();
    case GAME_TYPES.BASE_5_6:
      return getBase56Config();
    default:
      throw new Error(`Invalid game type: ${gameType}`);
  }
}

/**
 * Returns the configuration object for the base 3-5 player game type
 * @returns {Object} The configuration object
 */
function getBase34Config() {
  const harborCounts = [
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

  const resourceCardCounts = [
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

  const hexTileCounts = [
    {
      type: HEX_TYPES.HILLS,
      count: 3,
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

  const devCardCounts = [
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

  const baseMap = [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
  ];

  const config = {
    hexTileCounts,
    number_tokens: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
    harborCounts,
    resourceCardCounts,
    devCardCounts,
    baseMap,
  };

  return config;
}

/**
 * Returns the configuration object for the base 5-6 player game type
 * @returns {Object} The configuration object
 */
function getBase56Config() {
  const harborCounts = [
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

  const resourceCardCounts = [
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

  const hexTileCounts = [
    {
      type: HEX_TYPES.HILLS,
      count: 5,
    },
    {
      type: HEX_TYPES.FOREST,
      count: 6,
    },
    {
      type: HEX_TYPES.MOUNTAINS,
      count: 5,
    },
    {
      type: HEX_TYPES.FIELDS,
      count: 6,
    },
    {
      type: HEX_TYPES.PASTURE,
      count: 6,
    },
    {
      type: HEX_TYPES.DESERT,
      count: 2,
    },
  ];

  const devCardCounts = [
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

  const baseMap = [
    [0, 0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0]
  ];

  const numberTokens = [
    2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6,
    8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12
  ];

  const config = {
    hexTileCounts,
    number_tokens: numberTokens,
    harborCounts,
    resourceCardCounts,
    devCardCounts,
    baseMap,
  };

  return config;
}

/**
 * Processes the configuration object, initializing the board state
 * @param {Object} config - The configuration object
 */
function processConfig(config) {
  const { baseMap } = config;

  // determine the dimensions of the hex grid
  config.width = Math.max(...baseMap.map((row) => row.length));
  config.height = baseMap.length;

  // Create array of hex tiles and shuffle them
  const hexTiles = shuffleHexTiles(config.hexTileCounts);
  const numberTokens = shuffle(config.number_tokens);

  // make empty 2d hexes array (height x width)
  config.hexes = [];
  for (let i = 0; i < config.height; i++) {
    config.hexes[i] = [];
  }

  for (let j = 0; j < config.height; j++) {
    for (let i = 0; i < config.width; i++) {
      let hexType = "";

      if (baseMap[j].length > i && baseMap[j][i] === 1) {
        hexType = hexTiles.pop();
      }

      let numberToken = -1;
      if (hexType && hexType !== HEX_TYPES.DESERT) {
        numberToken = numberTokens.pop();
      }

      config.hexes[j].push({
        type: hexType,
        numberToken,
        coordinates: [i, j],
      });
    }
  }

  console.log(config.hexes);
}

/**
 * flattens hex tiles counts into a single array and shuffles them
 * @param {Object[]} hexTileCounts - The hex tile counts
 * @returns {string[]} The shuffled hex tiles
 */
function shuffleHexTiles(hexTileCounts) {
  // flatten the hex tiles so we can randomly select from them
  let hexTiles = [];
  for (let i = 0; i < hexTileCounts.length; i++) {
    const hexTile = hexTileCounts[i];
    const hexType = hexTile.type;
    const hexCount = hexTile.count;

    hexTiles.push(...Array(hexCount).fill(hexType));
  }

  // randomly shuffle the hex tiles
  return shuffle(hexTiles);
}

/**
 * Draws a grid of hexagons of given width and height
 * @param {number} width - How many hexagons wide the grid is
 * @param {number} height - How many hexagons tall the grid is
 */
function drawGrid(width, height) {
  document.getElementById("canvas-container").classList.remove("d-none");

  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#A8E0FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const r = calculateHexRadius(width, height);

  const gridMeasures = calculateGridMeasures(width, height, r);
  const leftOffset = padding + (getCanvasWidth() - gridMeasures.width) / 2;
  const topOffset = padding + (getCanvasHeight() - gridMeasures.height) / 2;

  const topLeft = [
    leftOffset + r * MATH_CONSTANTS.SQRT_3_OVER_2,
    topOffset + r,
  ];
  console.log(topLeft);

  const center = [...topLeft];

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const hexData = config.hexes[j][i];

      const fillColor = getHexFillColor(hexData.type);

      const points = drawHexagon(center[0], center[1], r, fillColor);

      hexData.points = points;
      hexData.center = center;

      if (hexData.numberToken != -1) {
        ctx.beginPath();
        ctx.arc(center[0], center[1], 20, 0, 2 * Math.PI);
        ctx.stroke();

        // fill circle
        ctx.fillStyle = getNumberTokenColor(hexData.numberToken);
        ctx.fill();

        // write coords in the center of the hexagon
        ctx.fillStyle = "#000";
        ctx.fillText(hexData.numberToken, center[0], center[1]);
      }

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

function getHexFillColor(hexType) {
  switch (hexType) {
    case HEX_TYPES.HILLS:
      return "#A4553C";
    case HEX_TYPES.FOREST:
      return "#326C42";
    case HEX_TYPES.MOUNTAINS:
      return "#74777F";
    case HEX_TYPES.FIELDS:
      return "#CEA322";
    case HEX_TYPES.PASTURE:
      return "#77B336";
    case HEX_TYPES.DESERT:
      return "#A09055";
    default:
      return "#A8E0FF";
  }
}

function getNumberTokenColor(numberToken) {
  if (numberToken === 6 || numberToken === 8) {
    return "#FFA8B5";
  }

  return "#fff";
}

/**
 * Draws a hexagon at the given coordinates with the given radius
 * @param {number} x - The x coordinate of the center of the hexagon
 * @param {number} y - The y coordinate of the center of the hexagon
 * @param {number} r - The radius of the hexagon
 * @returns {number[][]} The coordinates of the 6 hexagon points
 */
function drawHexagon(x, y, r, fillColor) {
  const points = [];

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = MATH_CONSTANTS.SIXTY_DEGREES * i;

    const point = [x + r * Math.sin(angle), y + r * Math.cos(angle)];

    points.push(point);

    ctx.lineTo(point[0], point[1]);
  }

  ctx.closePath();
  ctx.fillStyle = fillColor;
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
    gridWidth = (r * MATH_CONSTANTS.SQRT_3 * (2 * width + 1)) / 2;
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

function shuffle(arr) {
  return arr
    .map((v) => ({ val: v, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map((o) => o.val);
}

function enumValue(name) {
  return Object.freeze({ toString: () => name });
}
