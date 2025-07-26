import https from 'https';

const log = console.log;

const BASE_URL = 'https://mathgameswithbaddrawings.com/api/gameplay';

enum GamePhase {
  SETUP = 1,
  PLAYING = 2,
  FINISHED = 3
}

export interface IPlayer {
  name: string;
  owner: string | null;
  playerType: string;
  style: string;
}

export abstract class Player implements IPlayer {
  name = '';
  owner = null;
  playerType = 'human';
  style = 'A';
}

export interface ISettings {
  players: IPlayer[];
}

export abstract class Settings implements ISettings {
  players: IPlayer[] = [];
}

export interface IState {
  activePlayerIndex: number | null;
  lastMove: any;
}

export abstract class State implements IState {
  activePlayerIndex = null;
  lastMove = null;
}

export interface IAction { }

export abstract class Action implements IAction { }

export interface IGame<
  P extends ISettings,
  S extends IState,
  A extends IAction
> {
  gamePhase: GamePhase;
  gameSettings: P;
  gameState: S;
  gameType: string;
  lastSeenMillis: number;
}

export abstract class Game<
  P extends ISettings,
  S extends IState,
  A extends IAction
> implements IGame<P, S, A> {
  gamePhase = 1;
  gameType = 'unknown';
  lastSeenMillis = 0;

  constructor(
    public gameSettings: P,
    public gameState: S
  ) { }
}

export abstract class GamePlayer<
  G extends Game<P, S, A>,
  P extends Settings,
  S extends State,
  A extends Action
> {
  lastState?: S;
  gameKey?: string;
  lastSeenMillis: number = 0;
  clientCode: string = 'AUTOUSER';

  async joinGame(gameKey: string, inPosition: number = 1) {
    this.gameKey = gameKey;
    const url = `${BASE_URL}/query?gameKey=${gameKey}&clientCode=${this.clientCode}`;
    const response = await fetch(url);
    const body: G = await response.json();
    this.handleRequestBody(body);

    let newPlayers = structuredClone(body.gameSettings.players);
    newPlayers[inPosition] = {
      playerType: 'human',
      owner: this.clientCode,
      name: 'Computer Player',
      style: 'B'
    }

    const data = JSON.stringify({
      gameKey: gameKey,
      gameSettings: {
        ...body.gameSettings,
        players: newPlayers
      }
    });

    const postResponse = await fetch(`${BASE_URL}/setsettings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    log(`Joined game with key: ${this.gameKey}`);
    await this.checkStatus();
  }

  handleRequestBody(body: G) {
    this.lastSeenMillis = body.lastSeenMillis;
    this.lastState = body.gameState;

    switch (body.gamePhase) {
      case GamePhase.SETUP:
        break;
      case GamePhase.PLAYING:
        if (body.gameState.activePlayerIndex !== null &&
            body.gameSettings.players[body.gameState.activePlayerIndex]?.owner === this.clientCode) {
          log('It\'s my turn, thinking...');
          setTimeout(this.sendMove.bind(this), 1000);
        }
        break;
      case GamePhase.FINISHED:
        break;
    }
  }

  async checkStatus() {
    const query = `?gameKey=${this.gameKey}&lastSeenMillis=${this.lastSeenMillis}&clientCode=${this.clientCode}`;
    const response = await fetch(`${BASE_URL}/poll${query}`);
    try {
      this.handleRequestBody(await response.json());
    } catch (e) { }
    setTimeout(this.checkStatus.bind(this), 1000);
  }

  async sendMove() {
    const move = this.getMove();
    const postData = JSON.stringify({
      clientCode: this.clientCode,
      gameKey: this.gameKey,
      action: move
    });

    await fetch(`${BASE_URL}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: postData
    });
    log(`Sent move: ${move}`);
  }

  abstract getMove(): A;
}

