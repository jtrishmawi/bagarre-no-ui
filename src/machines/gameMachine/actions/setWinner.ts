export function setWinner(context: GameMachineContext) {
  return { winner: context.players.findIndex((player) => !player.lost) };
}
