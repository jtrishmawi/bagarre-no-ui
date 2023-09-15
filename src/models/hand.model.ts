import { Hand } from "typedeck";
import { BagarrePlayingCard } from "./index";

export class BagarreHand extends Hand {
  public defenseCard: BagarrePlayingCard | null = null;
  public attackCards: BagarrePlayingCard[] = [];
  public keptCards: BagarrePlayingCard[] = [];
  private _lifePoints: number = 0;

  constructor(cards: BagarrePlayingCard[] = []) {
    super(cards);
  }

  public setCards(cards: BagarrePlayingCard[]): this {
    super.setCards(cards);
    this.defenseCard = cards.find(
      (card) => card.value === Math.min(...cards.map((card) => card.value))
    )!;
    this.attackCards = cards.filter((card) => card !== this.defenseCard);
    this._lifePoints = this.attackCards.reduce(
      (total, card) => total + card.value,
      0
    );
    return this;
  }

  public get lifePoints() {
    return this._lifePoints + this.keptCards.length;
  }

  public set lifePoints(points: number) {
    this._lifePoints = points;
  }
}
