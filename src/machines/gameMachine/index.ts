import { assign, createMachine } from "xstate";
import {
  applyActionOnTarget,
  setAction,
  setNextPlayer,
  setTarget,
  setWinner,
  startGame,
} from "./actions";
import { initialContext } from "./constants";

const jeuDeBagarreMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCswFcAiYBCBDKuAToWAHSwAuRFAxAMoAqAggEoMD6A4kwLICiAbQAMAXUSgADgHtYASwqypAO3EgAHogCMANiGkAnIf0AOIaf0AWCwHZjAZgA0IAJ5bDpaxcPHT1zUOshACYAVgBfMKdUTBx8IhJSAGMACykZMCZEhWUaAGEACQB5Qro+diZchgBJQoA5YTEkEGk5bJUmjQQLY20DIM0eizsA41tNCydXBCDg0iCvE19-QKDjCKj0LDwCYjIUtNgMrMUlPKKSsorquoFNRskZeRPVTu7e-X7B4dsxiZdEOwWEIeILaEI2fR2fwzIQWdYgaJbOK7JKpdIMIgwWgFYqldjMFicPgMBqqFpPZQvRCWd5CbRBWwWbQ+QaTRAzIJzBY+ALLYJrSIIzaxHYJXASCQAG2cmTahSUGMIWJopKa5LaVIQmkB1lImlCsKEmmsgWsoLZCDs4NIPX0nlWhiBQUs8MRIvie2SYESAGsAOqyU6qh6tZ4dLQhZmkOyrOxQgb6ELGC12emkISpiwMww6RMCjYxbYe1He-2BlV3MmPDXhrWR4zR2Px4x5i2rCzR7R21P+bohGbhQVuosopRgNQUAAKktwzjAhBoDAAqixauxJwAZJgATT4GGDzWrYdAnU09cb9mbrf+CGMmlIISET7PMcTSf1EUFSikEDgqmHyIkFWoaUrWAC02gWmBwJGLBcGGHYrrCiOCSUNQwEUu0J6IFmbZBJydpgtYIQJo+1j6EhhaAZ6BxHDWIaYZqMYESE8Z2MYkY9n8UyaO4NhgvWd70hmiFDsh1GorRipYhh9HqIg5F2KQQJQqxnjasEIR4cC-EhMRpEBBRYlUaKZDilKMrHMo8rSWAFCyce8lauMehGpG9ofBYmiaCmwydnaZiPpCZ5BJRSKmSWvoBlhh4gTFp5WJynwtvoZ5dtoZopqxNpdmazLGhy9hhe6o7jlOM5zoQDmgdhWrWHY+jKcYQJ+GYXm5m2JrpqmqbGKCqaecVKFkGASgQNV8VaPVjXdC1-jNd5Xa+cCrHaEMQh6RmOafmEQA */
  id: "jeuDeBagarre",
  initial: "start",
  context: initialContext,
  tsTypes: {} as import("./index.typegen").Typegen0,
  states: {
    start: {
      on: {
        START_GAME: {
          actions: assign(startGame),
          target: "chooseAction",
        },
      },
    },
    chooseAction: {
      entry: assign(setNextPlayer),
      on: {
        CHOOSE_ACTION: [
          {
            cond: (_, event) => event.value.action !== "KEEP",
            target: "chooseTarget",
          },
          {
            target: "applyActionOnTarget",
          },
        ],
      },
      exit: assign(setAction),
    },
    chooseTarget: {
      on: {
        CHOOSE_TARGET: {
          actions: assign(setTarget),
          target: "applyActionOnTarget",
        },
      },
    },
    applyActionOnTarget: {
      entry: assign(applyActionOnTarget),
      always: "checkWin",
    },
    checkWin: {
      always: [
        {
          cond: (context) => {
            const remainingPlayers = context.players.filter(
              (player) => !player.lost
            );
            return remainingPlayers.length === 1;
          },
          target: "end",
        },
        { target: "nextPlayer" },
      ],
    },
    nextPlayer: {
      on: {
        TURN_PLAYED: {
          target: "chooseAction",
        },
      },
    },
    end: {
      entry: assign(setWinner),
      type: "final",
    },
  },
});

export default jeuDeBagarreMachine;
