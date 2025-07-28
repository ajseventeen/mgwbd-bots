import { DandelionsState, RandomFlowerDandelionsPlayer, RandomWindDandelionsPlayer } from './dandelions';
import readline from 'node:readline';
import { HeuristicSequenciumPlayer, RandomSequenciumPlayer, SequenciumState } from './sequencium';
import { Action, Game, GamePlayer, Player, Settings, State, getGameKey, getGameType } from './game';
import { PropheciesState, RandomPropheciesPlayer } from './prophecies';
import { NeighborsState, RandomNeighborsPlayer } from './neighbors';
import { PaperBoxingState, RandomPaperBoxingPlayer } from './paper-boxing';
import { RandomTurningPointPlayer, TurningPointState } from './turning-points';

type AnyGamePlayer = GamePlayer<Game<Settings, State<Action>, Action>, Settings, State<Action>, Action>;

const players: Record<string, Record<string, AnyGamePlayer>> = {
  sequencium: {
    random_player: new RandomSequenciumPlayer(SequenciumState),
    heuristic_player: new HeuristicSequenciumPlayer(SequenciumState)
  },
  dandelions: {
    random_wind_player: new RandomWindDandelionsPlayer(DandelionsState),
    random_flower_player: new RandomFlowerDandelionsPlayer(DandelionsState)
  },
  prophecies: {
    random_player: new RandomPropheciesPlayer(PropheciesState)
  },
  neighbors: {
    random_player: new RandomNeighborsPlayer(NeighborsState)
  },
  'paper-boxing': {
    random_player: new RandomPaperBoxingPlayer(PaperBoxingState)
  },
  'turning-points': {
    random_player: new RandomTurningPointPlayer(TurningPointState)
  }
};

function parseInt(value: string, default_: number = 0) {
  let n: number;
  try {
    n = Number.parseInt(value);
  } catch {
    n = default_;
  }
  if (Number.isNaN(n)) {
    return default_;
  }
  return n;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MAIN_MENU = `
===========
 MAIN MENU
===========

Enter the game link: `

const CONNECT_POSITION = `What position would you like to take? (default is 2): `

function startGame(gameKey: string, player: AnyGamePlayer) {
  rl.question(CONNECT_POSITION, position => {
    const pos = parseInt(position, 2) - 1;
    player.joinGame(gameKey, pos);
  });
}

function getPlayerType(gameKey: string, gameType: keyof typeof players) {
  const prompt = `
What type of player would you like to use? `;
  const choices = players[gameType];
  const choiceKeys: (keyof typeof choices)[] = Object.keys(players[gameType]);
  const choiceList = choiceKeys.map((key, index) => `[${index + 1}] ${key}`).join('\n');
  console.log(choiceList);
  rl.question(prompt, res => {
    const index = parseInt(res, 1) - 1;
    const player = choices[choiceKeys[index]];
    startGame(gameKey, player);
  });
}

rl.question(MAIN_MENU, async answer => {
  const gameKey = getGameKey(answer);
  getPlayerType(gameKey, await getGameType(gameKey));
})

