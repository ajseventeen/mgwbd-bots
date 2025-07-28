import { RandomFlowerDandelionsPlayer, RandomWindDandelionsPlayer } from './dandelions';
import readline from 'node:readline';
import { RandomSequenciumPlayer } from './sequencium';
import { Action, Game, GamePlayer, Player, Settings, State, getGameKey, getGameType } from './game';
import { RandomPropheciesPlayer } from './prophecies';

type AnyGamePlayer = GamePlayer<Game<Settings, State, Action>, Settings, State, Action>;
const players: Record<string, Record<string, AnyGamePlayer>> = {
  sequencium: {
    random_player: new RandomSequenciumPlayer()
  },
  dandelions: {
    random_wind_player: new RandomWindDandelionsPlayer(),
    random_flower_player: new RandomFlowerDandelionsPlayer()
  },
  prophecies: {
    random_player: new RandomPropheciesPlayer()
  }
};

function parseInt(value: string, default_: number = 0) {
  try {
    return Number.parseInt(value);
  } catch {
    return default_;
  }
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
    const pos = parseInt(position, 1) - 1;
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

