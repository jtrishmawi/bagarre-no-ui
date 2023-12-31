import { useContext } from "react";
import { GameStateContext } from "../context";

export const useGameStateContext = () => useContext(GameStateContext);
