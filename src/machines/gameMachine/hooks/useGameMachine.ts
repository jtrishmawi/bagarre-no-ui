import { useActor } from "@xstate/react";
import { useGameStateContext } from "./index";

export const useGameMachine = () => useActor(useGameStateContext());
