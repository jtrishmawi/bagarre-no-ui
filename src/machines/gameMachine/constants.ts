export const initialContext: GameMachineContext = {
  currentPlayer: -1,
  players: [],
  deck: null,
  currentPlayerAction: null,
  winner: null,
  selectedTargetPlayer: null,
};

export const MAX_PLAYER_PER_DECK = 8;
