import { useSelector } from "@xstate/react";
import { useGameStateContext } from "./index";

export const useCurrentPlayer = () =>
  useSelector(
    useGameStateContext(),
    (state) => state.context.players[state.context.currentPlayer]
  );
