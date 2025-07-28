import { Action, Game, RandomGamePlayer, Settings, State } from "./game";
import { isNotNull } from "./util";

export class NeighborsSettings extends Settings { }

export class NeighborsAction extends Action {
  constructor(
    public col: number,
    public row: number,
    public playerIndex: number
  ) { super(); }
}

class Die {
  rolled: boolean = false;
  value: number = 0;
}

export class NeighborsState extends State<NeighborsAction> {
  die: Die = new Die();
  grids: number[][][] = [];
  ready: boolean[] = [];

  getAvailableMoves(playerIndex: number): NeighborsAction[] {
    const grid = this.grids[playerIndex ?? 0];
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
}

export class NeighborsGame extends Game<NeighborsSettings, NeighborsState, NeighborsAction> {}

export class RandomNeighborsPlayer extends RandomGamePlayer<NeighborsGame, NeighborsSettings, NeighborsState, NeighborsAction> {
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
