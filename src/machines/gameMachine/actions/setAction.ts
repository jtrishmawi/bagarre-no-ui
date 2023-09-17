export function setAction(_: GameMachineContext, event: SelectActionEvent) {
  const currentPlayerAction = {
    action: event.value.action,
    card: event.value.card,
  };
  return { currentPlayerAction };
}
