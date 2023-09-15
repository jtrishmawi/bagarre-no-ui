import { Player } from "typedeck";
import { BagarreHand } from "./index";

export class BagarrePlayer extends Player {
  public lost: boolean = false;
  constructor(name: string = "", hand = new BagarreHand()) {
    super(name, hand);
  }

  public hasLost(game: boolean = true) {
    this.lost = game;
  }
}
