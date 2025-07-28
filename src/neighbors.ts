import { Action, Game, RandomGamePlayer, Settings, State } from "./game";
import { isNotNull } from "./util";

export class NeighborsSettings extends Settings { }

class Die {
  rolled: boolean = false;
  value: number = 0;
}
export class NeighborsState extends State {
  die: Die = new Die();
  grids: number[][][] = [];
  ready: boolean[] = [];
}

export class NeighborsAction extends Action {
  constructor(
    public col: number,
    public row: number,
    public playerIndex: number
  ) { super(); }
}

export class NeighborsGame extends Game<NeighborsSettings, NeighborsState, NeighborsAction> {}

export class RandomNeighborsPlayer extends RandomGamePlayer<NeighborsGame, NeighborsSettings, NeighborsState, NeighborsAction> {
  getAvailableMoves(): NeighborsAction[] {
    const playerIndex = this.getPlayerIndex();
    const grid = this.lastState?.grids[playerIndex ?? 0];
    if (playerIndex === undefined || grid === undefined) {
      throw new Error('grid is not defined.');
    }
    return grid.flatMap((row, r) => {
      return row.map((value, c) => {
        return value === 0 ? {
          row: r,
          col: c,
          playerIndex
        } : null;
      }).filter(isNotNull);
    })
  }

  shouldMove(): boolean {
    const playerIndex = this.getPlayerIndex();
    if (playerIndex === undefined) {
      throw new Error('grid is not defined.');
    }
    return !!(this.lastState &&
              this.lastState.die.rolled &&
              !this.lastState?.ready[playerIndex])
  }
}
