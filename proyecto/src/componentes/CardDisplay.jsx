import React from "react";

export default function CardDisplay({ card }) {
  return (
    <div className="bg-white text-black px-2 py-1 rounded-lg shadow text-center w-10">
      {card.value}
      {card.suit}
    </div>
  );
}
