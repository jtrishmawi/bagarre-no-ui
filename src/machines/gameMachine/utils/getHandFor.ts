import { BagarreHand, BagarrePlayer } from "../../../models";

export const getHandFor = (player: BagarrePlayer) =>
  player.getHand() as BagarreHand;
