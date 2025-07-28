import { Action, Game, RandomGamePlayer, Settings, State } from "./game";
import { CARDINAL_DIRECTIONS, Direction, isNotNull } from "./util";

export class TurningPointSettings extends Settings {
  gridSize: string = '4x4';
}

export class TurningPointAction extends Action {
  constructor(
    public row: number,
    public col: number,
    public dir: Direction
  ) { super(); }
}

export class TurningPointState extends State<TurningPointAction> {
  grid: Direction[][] = [];

  getAvailableMoves(playerIndex: number): TurningPointAction[] {
    return CARDINAL_DIRECTIONS.flatMap(direction => {
      return this.grid.flatMap((row, r) => {
        return row.map((value, c) => {
          return (value === null) ? {
            row: r,
            col: c,
            dir: direction
          } : null;
        })
      })
    }).filter(isNotNull);
  }
}

export class TurningPointGame extends Game<TurningPointSettings, TurningPointState, TurningPointAction> { }

export class RandomTurningPointPlayer extends RandomGamePlayer<TurningPointGame, TurningPointSettings, TurningPointState, TurningPointAction> { }
