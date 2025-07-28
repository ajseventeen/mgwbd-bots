# Math Games with Bad Drawings Computer Players

This project allows users to include computer players when playing games on the
[Math Games with Bad Drawings site](https://mathgameswithbaddrawings.com/games).

## Quickstart

1. Clone this repository locally
2. `npm install` to install dependencies.
3. Start a game on [the website](https://mathgameswithbaddrawings.com/games),
   and switch into "Party" mode.
4. Copy the share link from the website.
5. `npm run start` to start the application.
6. Paste the share link from the website and press Enter.
7. Select the type of player you would like to use by entering its number and
   pressing Enter.
8. Select the seat number where you would like your computer player to sit.
9. Return to the website, select the available seat, and enjoy!

## Rationale

Most of the games on Math Games with Bad Drawings are designed for two or more
players. Consequently, players who do not have a real opponent must play against
themselves. While this is not inherently a problem, there is a real possibility
that some users may not want to play both sides of the game. This project
provides an alternative, allowing the user to play against a computer player as
easily as possible.

## Methods

This project reverse-engineers some of the functionality of the website, using
HTTP requests constructed to be similar to those from the website. The computer
player will poll the API to monitor the game status, and respond with a move
whenever the computer player detects that its turn is up. The polling frequency
is calibrated to match the website, so there is no more load on the server than
there would be from a player using the website.

## Types of Players

To begin, every game has a random player available. This player will simply
select a random move from the set of all available moves. Obviously, these
players will not generally perform well, but they provide a starting point for
playing against automated players.

There is also a generic type for heuristic players. This player uses a
custom-defined heuristic function to analyze each possible move, and selects
randomly from among the moves with the highest value. One simple implementation
is provided in the heuristic_player for Sequencium, where the computer player
will simply always make the move resulting in the highest possible value in the
new cell.

If you would like to create a heuristic player based on your own heuristic
function, simply extend the `HeuristicGamePlayer` class and define `analyzeMove`
according to the defined interface. See the existing
[HeuristicSequenciumPlayer](./src/sequencium.ts#L118) for an example.

## Future Improvements

This is still a work in progress, and will be subject to change at any time.
Some possible improvements that I'm considering:

- Create a web server version of the application. Ideally, this would run on a
  publicly-available domain, and give less tech-savvy users a way to play
  against computer players.
- Add additional player types. There are a number of already-existing
  generalized algorithms for computer players (see [General game
  playing](https://en.wikipedia.org/wiki/General_game_playing)). Adding some
  of these players would significantly expand the entertainment value of the
  computer players.
- More robust error messages. Any attempts at illegal moves or issues with
  configurations will fail silently, which can sometimes be confusing.
- Unit tests to make future development safer.
- Any suggestions or requests!
