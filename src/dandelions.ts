import { Action, Game, GamePlayer, Settings, State } from "./game";

function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

function chooseRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

enum Direction {
  NORTH = 'N',
  NORTHEAST = 'NE',
  EAST = 'E',
  SOUTHEAST = 'SE',
  SOUTH = 'S',
  SOUTHWEST = 'SW',
  WEST = 'W',
  NORTHWEST = 'NW'
}

const ALL_DIRECTIONS = Object.values(Direction);

export class DandelionsSettings extends Settings {
  doublePlanting: boolean = false;
  gridSize: string = '5by5';
}

export class DandelionsState extends State {
  compass: { directions: Direction[] } = { directions: [] };
  grid: (string | null)[][] = [];
}

export class WindDandelionsAction extends Action {
  constructor(public compass: Direction) { super(); }
}

export class FlowerDandelionsAction extends Action {
  constructor(public grid: { row: number, col: number }) {
    super();
  }
}

type DandelionsAction = WindDandelionsAction | FlowerDandelionsAction;

export class DandelionsGame extends Game<DandelionsSettings, DandelionsState, DandelionsAction> { }

export class RandomWindDandelionsPlayer extends GamePlayer<DandelionsGame, DandelionsSettings, DandelionsState, DandelionsAction> {
  getMove(): DandelionsAction {
    const availableMoves = ALL_DIRECTIONS.filter(d => !this.lastState?.compass.directions.includes(d))
    const move = availableMoves.splice(Math.floor(Math.random() * availableMoves.length), 1)[0];
    return {
      compass: move
    };
  }
}

export class RandomFlowerDandelionsPlayer extends GamePlayer<DandelionsGame, DandelionsSettings, DandelionsState, DandelionsAction> {
  getMove(): DandelionsAction {
    let moves = this.lastState?.grid.flatMap((row, r) => {
      return row.map((val, c) => val ? null : [r, c]).filter(isNotNull);
    }).filter(isNotNull);
    if (!moves) {
      throw new Error("No available moves!");
    }
    const move = chooseRandom(moves);
    return {
      grid: {
        row: move[0],
        col: move[1]
      }
    };
  }
}
