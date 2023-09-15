import { useInterpret } from "@xstate/react";
import { ReactNode, createContext } from "react";
import { InterpreterFrom } from "xstate";
import jeuDeBagarreMachine from "./index";

export const GameStateContext = createContext(
  {} as InterpreterFrom<typeof jeuDeBagarreMachine>
);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const gameService = useInterpret(jeuDeBagarreMachine);

  return (
    <GameStateContext.Provider value={gameService}>
      {children}
    </GameStateContext.Provider>
  );
};
