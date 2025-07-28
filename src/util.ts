export enum Direction {
  NORTH = 'N',
  NORTHEAST = 'NE',
  EAST = 'E',
  SOUTHEAST = 'SE',
  SOUTH = 'S',
  SOUTHWEST = 'SW',
  WEST = 'W',
  NORTHWEST = 'NW'
}

export const ALL_DIRECTIONS = Object.values(Direction);
export const CARDINAL_DIRECTIONS = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST
];

export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

export function chooseRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}
