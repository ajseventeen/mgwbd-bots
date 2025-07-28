import { Action, Game, RandomGamePlayer, Settings, State } from "./game";
import { ALL_DIRECTIONS, Direction } from "./util";

export class PaperBoxingSettings extends Settings {
  height: number = 4;
  width: number = 4;
}

export class PaperBoxingAction extends Action {
  constructor(
    public dir: Direction,
    public playerIndex: number
  ) { super(); }
}

class Cell {
  constructor(
    public value: number,
    public walkedFrom?: Direction
  ) {}
}

class Location {
  row: number = 0;
  col: number = 0;
}

export class PaperBoxingState extends State<PaperBoxingAction> {
  grids: Cell[][][] = [];
  locations: Location[] = [];
  nextLocations: Location[] = [];
  ready: boolean[] = [];

  getAvailableMoves(playerIndex: number): PaperBoxingAction[] {
    const grid = this.grids[playerIndex ?? 0];
    return ALL_DIRECTIONS.filter(direction => {
      const loc = this.locations[playerIndex];
      const target = {
        row: loc.row + (direction.includes('N') ? -1 :
                        direction.includes('S') ? 1 : 0),
        col: loc.col + (direction.includes('W') ? -1 :
                        direction.includes('E') ? 1 : 0),
      };
      return (target.row >= 0 && target.row < grid.length &&
              target.col >= 0 && target.col < grid[target.row].length &&
             grid[target.row][target.col].walkedFrom === undefined &&
             grid[target.row][target.col].value > 0);
    }).map(direction => ({
      dir: direction,
      playerIndex
    }));
  }
}

export class PaperBoxingGame extends Game<PaperBoxingSettings, PaperBoxingState, PaperBoxingAction> { }

export class RandomPaperBoxingPlayer extends RandomGamePlayer<PaperBoxingGame, PaperBoxingSettings, PaperBoxingState, PaperBoxingAction> {
  shouldMove(): boolean {
    const playerIndex = this.getPlayerIndex();
    return !!(this.lastState &&
              playerIndex &&
              !this.lastState.ready[playerIndex])
  }
}
