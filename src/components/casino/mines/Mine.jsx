import React from "react";
import { Gem, Bomb } from "lucide-react";

import { cn } from "@/lib/utils";

export default function Mine({ onClickMine, value, rounds, mines = [], loading = false, selectedTiles = [] }) {
  const isMine = mines.length > 0 ? mines.includes(value) : false;
  let isRound = rounds.length > 0 && !isMine ? rounds.includes(value) : false;
  let isNotSelected = true;

  if (mines.length > 0 && !isMine) isRound = true;
  if (selectedTiles.includes(value)) isNotSelected = false;

  return (
    <button
      className="relative"
      onClick={() => {
        if (!isRound || !isMine) return onClickMine(value);
      }}
    >
      <div
        className={cn("absolute inset-0 z-10 bg-slate-700 rounded-md hover:bg-slate-500 transition-all duration-150", {
          "animate-heartbeat hover:bg-slate-700": loading,
          hidden: isRound || isMine,
        })}
      ></div>
      <div
        className={cn("w-full h-full rounded-md flex items-center justify-center", {
          "bg-green-800 cursor-default pop-out": isRound,
          "bg-red-800 cursor-default pop-out": isMine,
          "opacity-60": isNotSelected,
        })}
      >
        {isRound && <Gem className="w-6 h-6 sm:w-14 sm:h-14" />}
        {isMine && <Bomb className="w-6 h-6 sm:w-14 sm:h-14" />}
      </div>
    </button>
  );
}
