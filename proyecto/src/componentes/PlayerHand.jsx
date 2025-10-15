import React from "react";
import { calculateTotal } from "../utils/deckUtils";
import CardDisplay from "./CardDisplay";

export default function PlayerHand({ hand, index, turn, gameOver, hit, nextTurn }) {
  return (
    <div
      className={`p-4 border-2 rounded-xl ${
        turn === index ? "border-yellow-400" : "border-white"
      }`}
    >
      <h2 className="font-bold text-lg">Jugador {index + 1}</h2>
      <div className="flex gap-2 justify-center flex-wrap my-2">
        {hand.map((card, j) => (
          <CardDisplay key={j} card={card} />
        ))}
      </div>
      <p>Total: {calculateTotal(hand)}</p>

      {!gameOver && turn === index && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => hit(index)}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            Pedir
          </button>
          <button
            onClick={nextTurn}
            className="bg-gray-500 px-3 py-1 rounded"
          >
            Plantarse
          </button>
        </div>
      )}
    </div>
  );
}
