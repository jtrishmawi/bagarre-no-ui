import { BagarrePlayer } from "../../../models";

export function setNextPlayer(context: GameMachineContext) {
  function getNextPlayer(players: BagarrePlayer[], pos = 0) {
    if (pos === -1) return 0;
    const currentPlayer = (pos + 1) % players.length;
    if (players[currentPlayer].lost) return getNextPlayer(players, pos + 1);
    return currentPlayer;
  }

  return {
    currentPlayer: getNextPlayer(context.players, context.currentPlayer),
  };
}
