import { assign, createMachine } from "xstate";
import { MAX_PLAYER_PER_DECK, initialContext } from "./constants";
import { BagarreGameType, BagarreHand, BagarrePlayer } from "../../models";

function getNextPlayer(players: BagarrePlayer[], pos = 0) {
  if (pos === -1) return 0;
  const currentPlayer = (pos + 1) % players.length;
  if (players[currentPlayer].lost) return getNextPlayer(players, pos + 1);
  return currentPlayer;
}

const jeuDeBagarreMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCswFcAiYBCBDKuAToWAHSwAuRFAxAMoAqAggEoMD6A4kwLICiAbQAMAXUSgADgHtYASwqypAO3EgAHogCMANk2khBgwGYATJqPajQgCzWANCACeWgJwvSAdmtuAHC4CsgVZuJgC+oQ6omDj4RCSkAMYAFlIyYEwJCso0AMIAEgDydHzsTDkMAJIFAHLCYkgg0nJZKg0aCNY+2qQuZj4eRi7aJj6amtb+Ds4IJkImpCbeLn6B-sEB4ZHoWHgExGTJqbDpmYpKuYXFpeVVtZr1kjLyZ6rtnd29mv2Dw6Pjk05EBYfKQJkZNB4TIFDCNNiAojtYvtEik0gwiDBaPkiiVmCxOHwGHVVE1nspXogXEZ-AtRkZ+pp-B5zNofFNELN5otfAEgkI3P44QiYnt4rgJBIADaODItApKdGETE0YkNUktCkIcwmIykfr+MazQJDFzsmbWPTG-ombT8gbWelC7YiuIHJJgBIAawA6rJzqrHs0Xm0tP4JvoPD4oayfEZBoszSM9H5THNI14hB4vE7ortXSiPT6-Sr7iSnhqQ1qwzTM1H-DG4717ICZtS9VSoUNTEYBtptDnEaKyEowGoKAAFSW4RxgQg0BgAVRY1XY44AMkwAJp8DABxrl4OgdqM8O16M+WPx5vTUagtwBIzWPuzbT+MJwpRSCBwVTCvP7Msg3JSsAFptDNMCBxdZFKGoQCyVaI9EGsExExMeYXA8V8TGWJ8vH8IYoP-eJDjSWVD33IDEPUIF0J6NZ+R8JkLRwgFpk0NxQSwtZrDmJ8zEwoikRI1FjkVTF4IrJCEEjZMkwtAjoW0a8OShLjsNw7R8MIiJ4WdYiyHFKUZVOZR5XEsAKEkijjzGbpuMhbRei6bwPETCF9AI3p0M0IQIVtDwhKHAsvV9aj1RsrQLRBIYU16AxI0wxNeNIY0XC+IRuyC-MRzHSdp1nazgOkiEdAWR9AkjIRKo8U0WxcIR9EvB0bAdJidK2XNhLIMAlAgIrqOPZluh1CYmR8aqmVqxNAlIQZwX8UZlhtIxwnCIA */
  id: "jeuDeBagarre",
  initial: "start",
  context: initialContext,
  tsTypes: {} as import("./index.typegen").Typegen0,
  states: {
    start: {
      on: {
        START_GAME: {
          actions: [
            assign((_, event: StartGameEvent) => {
              // Create Deck
              const deck = new BagarreGameType().createDeck({
                extraCards: [],
                numberOfDecks: Math.ceil(
                  parseInt(event.value.num_players, 10) / MAX_PLAYER_PER_DECK
                ),
              });
              deck.shuffle();

              // Create players and deal cards
              const players: BagarrePlayer[] = [];
              for (let i = 0; i < parseInt(event.value.num_players, 10); i++) {
                const player = new BagarrePlayer(`Joueur ${i + 1}`);
                deck!.deal(player.getHand(), 3);
                players.push(player);
              }

              console.log("action dealCards - value:", { deck, players });
              return {
                deck,
                players,
              };
            }),
          ],
          target: "chooseAction",
        },
      },
    },
    chooseAction: {
      entry: assign((context) => {
        return {
          currentPlayer: getNextPlayer(context.players, context.currentPlayer),
        };
      }),
      on: {
        CHOOSE_ACTION: [
          {
            cond: (_, event) => event.value.action !== "KEEP",
            actions: [
              assign((_, event: SelectActionEvent) => {
                const currentPlayerAction = {
                  action: event.value.action,
                  card: event.value.card,
                };
                return { currentPlayerAction };
              }),
            ],
            target: "chooseTarget",
          },
          {
            actions: [
              assign((_, event: SelectActionEvent) => {
                const currentPlayerAction = {
                  action: event.value.action,
                  card: event.value.card,
                };
                return { currentPlayerAction };
              }),
            ],
            target: "applyActionOnTarget",
          },
        ],
      },
    },
    chooseTarget: {
      on: {
        CHOOSE_TARGET: {
          actions: [
            assign((_, event: SelectPlayerEvent) => {
              return { selectedTargetPlayer: event.value.target };
            }),
          ],
          target: "applyActionOnTarget",
        },
      },
    },
    applyActionOnTarget: {
      entry: assign((context) => {
        const players = [...context.players];
        const currentPlayer = players[context.currentPlayer];
        const currentPlayerHand = currentPlayer.getHand() as BagarreHand;
        const drawnCard = context.currentPlayerAction!.card;

        if (context.currentPlayerAction!.action === "DEFENSE") {
          const targetPlayer = players[context.selectedTargetPlayer!];
          const targetPlayerHand = targetPlayer.getHand() as BagarreHand;

          if (
            drawnCard.value < targetPlayerHand.defenseCard!.value ||
            currentPlayer.id === targetPlayer.id
          ) {
            targetPlayerHand.defenseCard = drawnCard;
          }
        } else if (context.currentPlayerAction!.action === "ATTACK") {
          const targetPlayer = players[context.selectedTargetPlayer!];
          if (currentPlayer.id !== targetPlayer.id) {
            const targetPlayerHand = targetPlayer.getHand() as BagarreHand;
            const drawnCardValue = drawnCard.value;
            const keptCardsValue = currentPlayerHand.keptCards.reduce(
              (total, card) => total + card.value,
              0
            );
            currentPlayerHand.keptCards = [];
            const attackValue =
              drawnCardValue +
              keptCardsValue -
              (targetPlayerHand.defenseCard?.value || 0);

            targetPlayerHand.lifePoints -= attackValue;

            targetPlayer.hasLost(targetPlayer.lifePoints <= 0);

            context.deck!.addCardsToBottom([drawnCard]); // return drawn card
            context.deck!.addCardsToBottom(currentPlayerHand.keptCards); // return kept cards
          }
        } else if (context.currentPlayerAction!.action === "KEEP") {
          currentPlayerHand.keptCards.push(drawnCard);
        }

        console.log("action applyPlayerAction - value:", players);
        return { players };
      }),
      always: "checkWin",
    },
    checkWin: {
      always: [
        {
          cond: (context) => {
            const remainingPlayers = context.players.filter(
              (player) => (player.getHand() as BagarreHand).lifePoints > 0
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
      entry: assign((context) => {
        const remainingPlayers = context.players.filter(
          (player) => !player.lost
        );
        if (remainingPlayers.length === 1) {
          return { winner: 0 };
        }
        return { winner: null };
      }),
      type: "final",
    },
  },
});

export default jeuDeBagarreMachine;
