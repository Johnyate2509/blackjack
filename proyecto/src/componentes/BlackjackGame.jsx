import React, { useState, useEffect } from "react";
import { createDeck, calculateTotal } from "../utils/deckUtils";
import PlayerHand from "./PlayerHand";
import CardDisplay from "./CardDisplay";

export default function BlackjackGame() {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [dealerHidden, setDealerHidden] = useState(true); // segunda carta oculta
  const [turn, setTurn] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [numPlayers, setNumPlayers] = useState("");

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  // 🔹 Iniciar juego
  const startGame = () => {
    const playersCount = Number(numPlayers);
    if (playersCount < 1 || playersCount > 5) {
      alert("Selecciona entre 1 y 5 jugadores.");
      return;
    }

    let newDeck = [...deck];
    const newPlayers = Array(playersCount)
      .fill(null)
      .map(() => [newDeck.pop(), newDeck.pop()]);

    const dealerHand = [newDeck.pop(), newDeck.pop()];

    setPlayers(newPlayers);
    setDealer(dealerHand);
    setDealerHidden(true); // segunda carta oculta
    setDeck(newDeck);
    setTurn(0);
    setGameOver(false);
  };

  // 🔹 Pedir carta
  const hit = (index) => {
    const newDeck = [...deck];
    const newPlayers = [...players];
    newPlayers[index].push(newDeck.pop());
    setPlayers(newPlayers);
    setDeck(newDeck);
  };

  // 🔹 Pasar turno o revelar tallador
  const nextTurn = () => {
    if (turn + 1 >= players.length) {
      revealDealer();
    } else {
      setTurn(turn + 1);
    }
  };

  // 🔹 Revelar segunda carta y turno del tallador
  const revealDealer = () => {
    setDealerHidden(false);
    dealerPlay();
  };

  const dealerPlay = () => {
    let newDeck = [...deck];
    let dealerHand = [...dealer];

    while (calculateTotal(dealerHand) < 17) {
      dealerHand.push(newDeck.pop());
    }

    setDealer(dealerHand);
    setDeck(newDeck);
    setGameOver(true);
  };

  // 🔹 Calcular resultado de cada jugador
  const determineResult = (playerHand) => {
    const playerTotal = calculateTotal(playerHand);
    const dealerTotal = calculateTotal(dealer);

    if (playerTotal > 21) return "haz perdido (te pasaste)";
    if (dealerTotal > 21) return "ganaste  (tallador se pasó)";
    if (playerTotal > dealerTotal) return "Ganaste";
    if (playerTotal < dealerTotal) return "Pierdes";
    return "Empate";
  };

  // 🔹 Vista inicial: elegir jugadores
  if (players.length === 0 && !gameOver) {
    return (
      <div className="flex flex-col items-center gap-4 mt-10">
        <h2 className="text-xl font-bold">Selecciona cantidad de jugadores</h2>
        <input
          type="number"
          min="1"
          max="5"
          value={numPlayers}
          placeholder="1-5"
          onChange={(e) => setNumPlayers(e.target.value)}
          className="text-black p-2 rounded text-center w-20"
        />
        <button
          onClick={startGame}
          disabled={numPlayers < 1 || numPlayers > 5}
          className={`px-4 py-2 rounded text-white ${
            numPlayers >= 1 && numPlayers <= 5
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Comenzar Juego
        </button>
      </div>
    );
  }

  // 🔹 Vista del juego
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">♠ Blackjack 21</h1>

      {/* 🔹 Tallador */}
      <div className="border-2 border-red-400 rounded-xl p-4 text-center bg-gray-900">
        <h2 className="text-xl font-bold text-red-400">Tallador</h2>
        <div className="flex justify-center gap-2 flex-wrap my-2">
          {dealer.map((card, index) => (
            <CardDisplay
              key={index}
              card={
                dealerHidden && index === 1
                  ? { suit: "❓", value: "?" }
                  : card
              }
            />
          ))}
        </div>
        <p>Total: {dealerHidden ? "?" : calculateTotal(dealer)}</p>
      </div>

      {/* 🔹 Jugadores */}
<div className="flex flex-wrap justify-center gap-4">
  {players.map((hand, index) => (
    <div
      key={index}
      className="flex flex-col items-center border-2 border-gray-700 p-4 rounded-xl bg-gray-800"
    >
      <PlayerHand
        hand={hand}
        index={index}
        turn={turn}
        gameOver={gameOver}
        hit={hit}
        nextTurn={nextTurn}
      />
      {gameOver && (
        <p className="mt-2 font-semibold text-yellow-300 text-center">
          Resultado: {determineResult(hand)}
        </p>
      )}
    </div>
  ))}
</div>

      {/* 🔹 Botón reinicio */}
      {gameOver && (
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold text-green-400">¡Fin del juego!</h2>
          <button
            onClick={() => {
              setPlayers([]);
              setDealer([]);
              setDealerHidden(true);
              setNumPlayers("");
              setDeck(createDeck());
            }}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mt-2"
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
