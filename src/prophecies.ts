import { Action, Game, GamePlayer, RandomGamePlayer, Settings, State } from "./game";
import { chooseRandom, isNotNull } from "./util";

export class PropheciesSettings extends Settings {
  numCols: number = 5;
  numRows: number = 4;
  xProphecies: boolean = false;
}

export class PropheciesAction extends Action {
  constructor(
    public col: number,
    public row: number,
    public value: number,
    public owner: number
  ) { super(); }
}

class Cell {
  constructor(
    public owner: number,
    public value: number,
  ) {}
}

export class PropheciesState extends State<PropheciesAction> {
  grid: (Cell | null)[][] = [];

  getAvailableMoves(playerIndex: number): PropheciesAction[] {
    const grid = this.grid;
    const maxValue = Math.max(grid.length, grid[0].length);
    const partialMoves = grid.flatMap((row, r) => {
      return row.map((cell, c) => cell === null ? {
        owner: playerIndex,
        row: r,
        col: c,
      } : null)
      .filter(isNotNull);
    })
    return Array(maxValue + 1).fill(0).map((_, i) => i).flatMap(i => {
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
  }
}

export class PropheciesGame extends Game<PropheciesSettings, PropheciesState, PropheciesAction> {}

export class RandomPropheciesPlayer extends RandomGamePlayer<PropheciesGame, PropheciesSettings, PropheciesState, PropheciesAction> { }
