import { Action, Game, GamePlayer, Settings, State } from "./game";
import { chooseRandom, isNotNull } from "./util";

export class PropheciesSettings extends Settings {
  numCols: number = 5;
  numRows: number = 4;
  xProphecies: boolean = false;
}

class Cell {
  constructor(
    public owner: number,
    public value: number,
  ) {}
}

export class PropheciesState extends State {
  grid: (Cell | null)[][] = [];
}

export class PropheciesAction extends Action {
  constructor(
    public col: number,
    public row: number,
    public value: number,
    public owner: number
  ) { super(); }
}

export class PropheciesGame extends Game<PropheciesSettings, PropheciesState, PropheciesAction> {}

export class RandomPropheciesPlayer extends GamePlayer<PropheciesGame, PropheciesSettings, PropheciesState, PropheciesAction> {
  getMove(): PropheciesAction {
    const playerIndex = this.getPlayerIndex();
    const grid = this.lastState?.grid;
    if (!grid || !playerIndex) {
      throw new Error('grid is not defined.');
    }
    const maxValue = Math.max(grid.length, grid[0].length);
    const partialMoves = grid.flatMap((row, r) => {
      return row.map((cell, c) => cell === null ? {
        owner: playerIndex,
        row: r,
        col: c,
      } : null)
      .filter(isNotNull);
    })
    const moves = Array(maxValue + 1).fill(0).map((_, i) => i).flatMap(i => {
      return partialMoves.map(move => ({
        ...move,
        value: i
      }));
    }).filter(move => {
      if (grid[move.row].some(cell => cell?.value === move.value)) {
        return false;
      }
      if (grid.map(row => row[move.col]).some(cell => cell?.value === move.value)) {
        return false;
      }
      return true;
    });
    return chooseRandom(moves);
  }
}
