import { BagarreHand } from "../../../models";
import { getHandFor } from "../utils";

export function applyActionOnTarget(context: GameMachineContext) {
  const players = [...context.players];
  const currentPlayer = players[context.currentPlayer];
  const currentPlayerHand = currentPlayer.getHand() as BagarreHand;
  const drawnCard = context.currentPlayerAction!.card;

  if (context.currentPlayerAction!.action === "KEEP") {
    currentPlayerHand.keptCards.push(drawnCard);
  } else {
    const targetPlayer = players[context.selectedTargetPlayer!];
    const targetPlayerHand = getHandFor(targetPlayer);

    if (context.currentPlayerAction!.action === "DEFENSE") {
      if (
        currentPlayer.id === targetPlayer.id ||
        drawnCard.value < targetPlayerHand.defenseCard!.value
      ) {
        targetPlayerHand.defenseCard = drawnCard;
      }
    }

    if (context.currentPlayerAction!.action === "ATTACK") {
      const attackValue = currentPlayerHand.keptCards.reduce(
        (total, card) => total + card.value,
        drawnCard.value - targetPlayerHand.defenseCard!.value
      );

      targetPlayerHand.lifePoints -= attackValue;

      currentPlayerHand.keptCards = [];
      targetPlayerHand.keptCards = [];

      if (targetPlayer.hasLost(targetPlayer.lifePoints))
        currentPlayer.addToScore();

      context.deck!.addCardsToBottom([drawnCard]);
      context.deck!.addCardsToBottom(currentPlayerHand.keptCards);
    }
  }

  return { players };
}
