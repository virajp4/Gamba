'use client';
import { useState } from "react";

export default function page() {
  const [gameData, setGameData] = useState({
    amount: 0,
    payoutMultiplier: 0,
    target: 50.5,
    condition: "above",
  });

  function handleInputChange(e) {
    if (e.target.name === "amount" && e.target.value < 0) {
      return;
    }
    if (e.target.name === "payoutMultiplier" && e.target.value < 1.0102) {
      return;
    }
    setGameData({
      ...gameData,
      [e.target.name]: e.target.value,
    });
  }
  
  return (
    <div className="m-5">
      <div className="h-[80vh] flex justify-center items-center flex-col md:flex-row">
        <div className="h-1/4 md:h-full w-full md:w-1/4 order-2 md:order-1 bg-zinc-950 rounded-l-xl">
        </div>
        <div className="h-3/4 md:h-full w-full md:w-3/4 order-1 md:order-2"></div>
      </div>
    </div>
  );
}
