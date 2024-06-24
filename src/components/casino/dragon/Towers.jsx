import React from "react";
import { Bird, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Towers({ currentRound, columns, onClickTile, loadingTile, tilesSelected, tilesCorrect, active }) {
  const arr = new Array(columns * 9).fill(0);

  const isSelected = (i) => tilesSelected.includes(i);
  const loading = (i) => loadingTile === i;

  function clickButton(i) {
    if (!isCurrentRow(i)) return;
    onClickTile(i);
  }

  function isCurrentRow(i) {
    const rowIndexFromBottom = 8 - Math.floor(i / columns);
    return rowIndexFromBottom === currentRound;
  }

  function isCorrect(i) {
    return tilesCorrect.includes(i);
  }

  const isOver = currentRound === 9 || (active === false && tilesCorrect.length > 0);

  return (
    <>
      {arr.map((_, i) => (
        <button key={i} className={`relative cursor-default`} onClick={() => clickButton(i)}>
          <div
            className={cn("absolute inset-0 z-10 border-2 border-slate-700 rounded-md transition-all duration-150 py-1", {
              "animate-heartbeat hover:bg-slate-700": loading(i),
              "bg-slate-600 hover:bg-slate-800 cursor-pointer border-transparent": isCurrentRow(i) && !isSelected(i),
              hidden: isSelected(i) || isOver,
            })}
          ></div>
          <div
            className={cn("w-full h-full rounded-md flex items-center justify-center py-1", {
              "cursor-default pop-out": isCurrentRow(i),
              "opacity-70": !isSelected(i),
              "border-2 border-slate-700": isOver,
              "border-2 border-green-600": isCorrect(i) && isSelected(i),
              "border-transparent bg-red-700": !isCorrect(i) && isSelected(i),
            })}
          >
            {!isOver ? (
              isSelected(i) ? (
                isCorrect(i) ? (
                  <Bird size={26} color="#22c55e" />
                ) : (
                  <Skull size={26} />
                )
              ) : null
            ) : isCorrect(i) ? (
              <Bird size={26} color="#22c55e" />
            ) : (
              (isSelected(i) && <Skull size={32} />) || null
            )}
          </div>
        </button>
      ))}
    </>
  );
}
