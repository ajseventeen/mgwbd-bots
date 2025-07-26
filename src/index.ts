import { FlowerDandelionsGamePlayer, WindDandelionsGamePlayer } from './dandelions';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MAIN_MENU = `
===========
 MAIN MENU
===========

What would you like to do?

[c]onnect to a game

Enter choice or 'q' to quit: `

const CONNECT_MENU = `
=========
 CONNECT
=========

Enter the game link: `

const CONNECT_POSITION = `What position would you like to take? (default is 2): `

function connect() {
  rl.question(CONNECT_MENU, gameLink => {
    const gameKey = gameLink.split('/')[4];
    rl.question(CONNECT_POSITION, position => {
      let pos: number;
      try {
        pos = Number.parseInt(position) - 1;
      } catch {
        pos = 1;
      }
      const player = pos === 0 ? new FlowerDandelionsGamePlayer() : new WindDandelionsGamePlayer();
      player.joinGame(gameKey, pos);
    });
  });
}

rl.question(MAIN_MENU, answer => {
  switch (answer) {
    case 'c':
      connect();
  }
})

