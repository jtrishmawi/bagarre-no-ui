import { useActor } from "@xstate/react";
import { useContext } from "react";
// import { BagarreHand } from "../../models";
import { GameStateContext } from "./context";

export const useGameMachine = () => {
  const machine = useGameMachineState();
  // const hand = machine[0].context.players[0]?.getHand() as BagarreHand;
  // console.log("useGameMachine - state:", machine[0].value, {
  //   currentPlayer: machine[0].context.currentPlayer,
  //   players: machine[0].context.players,
  //   deck: machine[0].context.deck || "none",
  //   currentPlayerName:
  //     machine[0].context.players[machine[0].context.currentPlayer]?.name ||
  //     "none",
  //   defenseCard: hand?.defenseCard || "none",
  //   attackCards: hand?.attackCards || "none",
  //   keptCards: hand?.keptCards || "none",
  // });
  return machine;
};

export const useGameMachineState = () => useActor(useContext(GameStateContext));
