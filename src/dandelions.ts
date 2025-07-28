import { Action, Game, GamePlayer, RandomGamePlayer, Settings, State } from "./game";
import { ALL_DIRECTIONS, Direction } from "./util";

function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

function chooseRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

export class DandelionsSettings extends Settings {
  doublePlanting: boolean = false;
  gridSize: string = '5by5';
}

export class DandelionsState extends State<DandelionsAction> {
  compass: { directions: Direction[] } = { directions: [] };
  grid: (string | null)[][] = [];

  getAvailableMoves(playerIndex: number): DandelionsAction[] {
    if (playerIndex === 0) {
      let moves = this.grid.flatMap((row, r) => {
        return row.map((val, c) => val ? null : [r, c]).filter(isNotNull);
      }).filter(isNotNull);
      if (!moves) {
        throw new Error("No available moves!");
      }
      return moves.map(m => ({
        grid: {
          row: m[0],
          col: m[1]
        }
      }));
    } else if (playerIndex === 1) {
      return ALL_DIRECTIONS.filter(d => !this.compass.directions.includes(d)).map(direction => ({
        compass: direction
      }));
    }
    throw new Error('Dandelions only supports two players.');
  }
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

type DandelionsGame = Game<DandelionsSettings, DandelionsState, DandelionsAction>;

// export class DandelionsGame extends Game<DandelionsSettings, DandelionsState, DandelionsAction> { }

export class RandomWindDandelionsPlayer extends RandomGamePlayer<DandelionsGame, DandelionsSettings, DandelionsState, DandelionsAction> { }

export class RandomFlowerDandelionsPlayer extends RandomGamePlayer<DandelionsGame, DandelionsSettings, DandelionsState, DandelionsAction> { }
