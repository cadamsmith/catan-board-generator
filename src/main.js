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
};

/**
 * Draws a hexagon at the given coordinates with the given radius
 * @param {number} x - The x coordinate of the center of the hexagon
 * @param {number} y - The y coordinate of the center of the hexagon
 * @param {number} r - The radius of the hexagon
 */
function drawHexagon(x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = MATH_CONSTANTS.SIXTY_DEGREES * i;

    const point = [
      x + r * Math.sin(angle),
      y + r * Math.cos(angle),
    ];

    ctx.lineTo(point[0], point[1]);
  }
  ctx.closePath();
  ctx.stroke();
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
