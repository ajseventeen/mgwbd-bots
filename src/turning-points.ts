import { Action, Game, RandomGamePlayer, Settings, State } from "./game";
import { CARDINAL_DIRECTIONS, Direction, isNotNull } from "./util";

export class TurningPointSettings extends Settings {
  gridSize: string = '4x4';
}

export class TurningPointState extends State {
  grid: Direction[][] = [];
}

export class TurningPointAction extends Action {
  constructor(
    public row: number,
    public col: number,
    public dir: Direction
  ) { super(); }
}

export class TurningPointGame extends Game<TurningPointSettings, TurningPointState, TurningPointAction> {}

export class RandomTurningPointPlayer extends RandomGamePlayer<TurningPointGame, TurningPointSettings, TurningPointState, TurningPointAction> {
  getAvailableMoves(): TurningPointAction[] {
    const playerIndex = this.getPlayerIndex();
    const state = this.lastState;
    if (playerIndex === undefined || state === undefined) {
      throw new Error("No available moves!");
    }
    return CARDINAL_DIRECTIONS.flatMap(direction => {
      return state.grid.flatMap((row, r) => {
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
