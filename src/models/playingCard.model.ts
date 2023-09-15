import { PlayingCard, Suit, CardName } from "typedeck";

export class BagarrePlayingCard extends PlayingCard {
  public value: number;

  constructor(cardName: CardName, suit: Suit, value: number) {
    super(cardName, suit);
    this.value = value;
  }

  public toImageUrl() {
    return `${import.meta.env.BASE_URL}cards/card-${Suit[
      this.suit
    ].toLowerCase()}-${this.cardName + 1}.png`;
  }
}
