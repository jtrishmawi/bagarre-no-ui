interface GameMachineContext {
  currentPlayer: number;
  players: BagarrePlayer[];
  deck: IDeck | null;
  currentPlayerAction: {
    action: GameMachineAction;
    card: BagarrePlayingCard;
  } | null;
  winner: number | null;
  selectedTargetPlayer: number | null;
}

type GameMachineAction = "ATTACK" | "DEFENSE" | "KEEP";

type StartGameEvent = { type: "START_GAME"; value: { num_players: string} };
type SelectPlayerEvent = {
  type: "NEXT_STEP";
  value: { target: number };
};
type SelectActionEvent = {
  type: "NEXT_STEP";
  value: { action: GameMachineAction; card: BagarrePlayingCard };
};
type CheckWinEvent = {
  type: "TURN_PLAYED";
};
