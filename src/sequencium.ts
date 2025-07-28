import { Action, Game, GamePlayer, RandomGamePlayer, Settings, State } from "./game";
import { chooseRandom, isNotNull } from "./util";

export class SequenciumSettings extends Settings {
  doubleMoves: boolean = false;
  gridSize: number = 6;
}

class Cell {
  constructor(
    public from: string,
    public playerIndex: number,
    public value: number
  ) {}
}

export class SequenciumState extends State {
  static Cell = class {
    constructor(
      public from: string,
      public playerIndex: number,
      public value: number
    ) {}
  }

  grid: (Cell | null)[][] = [];
}

export class SequenciumAction extends Action {
  constructor(
    public colFrom: number,
    public colTo: number,
    public rowFrom: number,
    public rowTo: number,
    public playerIndex: number
  ) { super(); }
}

export class SequenciumGame extends Game<SequenciumSettings, SequenciumState, SequenciumAction> {}

export class RandomSequenciumPlayer extends RandomGamePlayer<SequenciumGame, SequenciumSettings, SequenciumState, SequenciumAction> {
  getAvailableMoves(): SequenciumAction[] {
    const playerIndex = this.getPlayerIndex();
    const grid = this.lastState?.grid;
    if (!grid || !playerIndex) {
      throw new Error('grid is not defined.');
    }
    const moves = grid.flatMap((row, r) => {
      return row
        .map((value, c) => ({value, c}))
        .filter(item => item.value === null && (this.neighborsOf(r, item.c)
                                                                                                .filter(isNotNull)
                                                                                                .map(x => x.playerIndex).includes(playerIndex)))
                                                                                                .map(item => [r, item.c]);
    });
    return moves.map(move => {
      const source = this.getBestNeighbor(move);
      return {
        rowFrom: source[0],
        colFrom: source[1],
        rowTo: move[0],
        colTo: move[1],
        playerIndex
      }
    });
  }

  getNeighborCoords(r: number, c: number): number[][] {
    const grid = this.lastState?.grid;
    if (!grid) {
      throw new Error('grid is not defined.');
    }
    let neighbors = [];

    if (r > 0) {
      if (c > 0) {
        neighbors.push([r-1, c-1]);
      }
      neighbors.push([r-1, c]);
      if (c < grid[r-1].length - 1) {
        neighbors.push([r-1, c+1]);
      }
    }
    if (c > 0) {
      neighbors.push([r, c-1]);
    }
    neighbors.push([r, c]);
    if (c < grid[r].length - 1) {
      neighbors.push([r, c+1]);
    }
    if (r < grid.length - 1) {
      if (c > 0) {
        neighbors.push([r+1, c-1]);
      }
      neighbors.push([r+1, c]);
      if (c < grid[r+1].length - 1) {
        neighbors.push([r+1, c+1]);
      }
    }
    return neighbors;

  }

  neighborsOf(r: number, c: number): (Cell | null)[] {
    const grid = this.lastState?.grid;
    if (!grid) {
      throw new Error('grid is not defined.');
    }
    return this.getNeighborCoords(r, c).map(pair => grid[pair[0]][pair[1]]);
  }

  getBestNeighbor(move: number[]): number[] {
    const grid = this.lastState?.grid;
    if (!grid) {
      throw new Error('grid is not defined.');
    }
    return this.getNeighborCoords(move[0], move[1])
      .filter(pair => grid[pair[0]][pair[1]]?.playerIndex === this.getPlayerIndex())
      .reduce((prev, cur) => {
        if (prev.length === 0) {
          return cur;
        }
        const prevVal = grid[prev[0]][prev[1]]?.value ?? -1;
        const  curVal = grid[cur[0]][cur[1]]?.value ?? -1;
        return curVal > prevVal ? cur : prev;
      }, [])
  }
}
