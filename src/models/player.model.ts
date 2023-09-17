import { Player } from "typedeck";
import { BagarreHand } from "./index";

export class BagarrePlayer extends Player {
  public lost: boolean = false;
  constructor(name: string = "", hand = new BagarreHand()) {
    super(name, hand);
  }

  public addToScore(score: number = 1): this {
    this.score += score;
    return this;
  }

  public hasLost(score: number) {
    this.lost = score <= 0;
    return this.lost;
  }
}
