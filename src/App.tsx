import { SyntheticEvent } from "react";
import { useCurrentPlayer, useGameMachine } from "./machines/gameMachine/hooks";
import { getHandFor } from "./machines/gameMachine/utils";
import { BagarrePlayingCard } from "./models";

import "./App.css";

function App() {
  const [state, send] = useGameMachine();
  const currentPlayer = useCurrentPlayer();

  const startGame = (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      num_players: { value: number };
    };
    send({
      type: "START_GAME",
      value: { num_players: target.num_players.value },
    });
  };

  const selectTarget = (id: string) => {
    const target = state.context.players.findIndex((p) => p.id === id);
    send({ type: "CHOOSE_TARGET", value: { target } });
  };

  const chooseAction = (
    action: GameMachineAction,
    card: BagarrePlayingCard
  ) => {
    send({ type: "CHOOSE_ACTION", value: { action, card } });
  };

  const nextPlayer = () => {
    send("TURN_PLAYED");
  };

  return (
    <div>
      <h1>Jeu de Bagarre</h1>
      {state.matches("start") && (
        <form onSubmit={startGame}>
          <p>
            <input
              type="number"
              name="num_players"
              min="1"
              max="16"
              defaultValue="4"
            />
          </p>
          <button type="submit">Lancez le jeu</button>
        </form>
      )}
      {state.matches("nextPlayer") && (
        <div>
          <h4>{state.context.currentPlayerAction?.action}</h4>
          <div>
            <img src={state.context.currentPlayerAction?.card.toImageUrl()} />
          </div>
          <button onClick={nextPlayer}>Suivant</button>
        </div>
      )}
      {state.matches("chooseAction") && (
        <>
          <h2>C'est le tour de {currentPlayer.name}</h2>
          <button
            onClick={() =>
              chooseAction(
                "DEFENSE",
                state.context.deck!.takeCard() as BagarrePlayingCard
              )
            }
          >
            Defense
          </button>
          <button
            onClick={() =>
              chooseAction(
                "ATTACK",
                state.context.deck!.takeCard() as BagarrePlayingCard
              )
            }
          >
            Attack
          </button>
          <button
            onClick={() =>
              chooseAction(
                "KEEP",
                state.context.deck!.takeCard() as BagarrePlayingCard
              )
            }
          >
            Keep
          </button>
        </>
      )}
      {state.matches("chooseTarget") && (
        <>
          <h2>{currentPlayer.name}, choisis ta cible:</h2>
          {[...state.context.players]
            .sort((a, b) =>
              a.id === currentPlayer.id ? -1 : b.id === currentPlayer.id ? 1 : 0
            )
            .flatMap((player) => {
              if (
                (state.context.currentPlayerAction?.action === "ATTACK" &&
                  player.id === currentPlayer.id) ||
                currentPlayer.lost
              )
                return [];
              return (
                <button key={player.id} onClick={() => selectTarget(player.id)}>
                  {player.id !== currentPlayer.id ? player.name : "Moi meme"}
                </button>
              );
            })}
        </>
      )}
      {state.matches("end") && <h2>Player {state.context.winner} wins!</h2>}
      <div style={{ display: "flex" }}>
        {state.context.players.map((player) => {
          const playerHand = getHandFor(player);
          return (
            <div key={player.id}>
              <h3>
                {player.name}
                {player.lost && <span>"Lost"</span>}
              </h3>
              <p>Score: {player.score}</p>
              <dl>
                <dt>Points de defense ({playerHand.defenseCard?.value})</dt>
                <dd>
                  <img src={playerHand.defenseCard?.toImageUrl()} />
                </dd>
                <dt>Points de vie ({playerHand.lifePoints})</dt>
                <dd>
                  {playerHand.attackCards?.map((card) => (
                    <img
                      key={card.toString()}
                      src={card.toImageUrl()}
                      alt={card.toString()}
                    />
                  ))}
                </dd>
                <dt>Cartes Coffrees</dt>
                <dd>
                  {playerHand.keptCards?.map((card) => (
                    <img
                      key={card.toString()}
                      src={card.toImageUrl()}
                      alt={card.toString()}
                    />
                  ))}
                </dd>
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
