import { BagarreGameType, BagarrePlayer } from "../../../models";
import { MAX_PLAYER_PER_DECK } from "../constants";

export function startGame(_: GameMachineContext, event: StartGameEvent) {
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

  return {
    deck,
    players,
  };
}
