import https from 'https';

const log = console.log;

const BASE_URL = 'https://mathgameswithbaddrawings.com/api/gameplay';
const CLIENT_CODE =  'AUTOUSER';

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
  gameSettings?: P;
  gameKey?: string;
  lastSeenMillis: number = 0;
  clientCode: string = CLIENT_CODE;
  pollingInterval?: ReturnType<typeof setInterval>;

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
    this.pollingInterval = setInterval(this.checkStatus.bind(this), 1000);
  }

  handleRequestBody(body: G) {
    this.lastSeenMillis = body.lastSeenMillis;
    this.lastState = body.gameState;
    this.gameSettings = body.gameSettings;

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
    log(`Sent move.`);
  }

  stopPolling() {
    clearInterval(this.pollingInterval);
  }

  getPlayerIndex() {
    return this.gameSettings?.players.map(p => p.owner).indexOf(this.clientCode);
  }

  abstract getMove(): A;
}

export async function getGameType(gameKey: string): Promise<string> {
  const queryUrl = `${BASE_URL}/query?gameKey=${gameKey}&clientCode=${CLIENT_CODE}`;
  const response = await fetch(queryUrl);
  return (await response.json()).gameType;
}

export function getGameKey(url: string): string {
  return url.split('/')[4];
}
