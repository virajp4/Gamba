import React from "react";
import { Gem, Bomb } from "lucide-react";

import { cn } from "@/lib/utils";

export default function Mine({ onClickMine, value, rounds, mines = [] }) {
  const isMine = mines.length > 0 ? mines.includes(value) : false;
  let isRound = rounds.length > 0 && !isMine ? rounds.includes(value) : false;
  if (mines.length > 0 && !isMine) isRound = true;

  return (
    <button
      className={cn("bg-slate-700 rounded-md hover:bg-slate-500 hover:-translate-y-0.5 transition-all duration-150", {
        "bg-green-800 hover:bg-green-800 cursor-default": isRound,
        "bg-red-800 hover:bg-red-800 cursor-default": isMine,
      })}
      onClick={() => {
        if (!isRound || !isMine) return onClickMine(value);
      }}
    >
      <div className="flex items-center justify-center">
        {isRound && <Gem size={50} />}
        {isMine && <Bomb size={50} />}
      </div>
    </button>
  );
}
