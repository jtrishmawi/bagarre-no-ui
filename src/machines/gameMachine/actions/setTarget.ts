export function setTarget(_: GameMachineContext, event: SelectPlayerEvent) {
  return { selectedTargetPlayer: event.value.target };
}
