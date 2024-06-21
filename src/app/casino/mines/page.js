"use client";

import { useState, useEffect } from "react";

import SideCard from "@/components/casino/mines/SideCard";

import useAuthStore from "@/stores/useAuthStore";
import useUserStore from "@/stores/useUserStore";

export default function page() {
  const user = useAuthStore((state) => state.user);
  const getCurrentAmount = useUserStore((state) => state.getCurrentAmount);
  const transactWallet = useUserStore((state) => state.transactWallet);
  const wallet = useUserStore((state) => state.wallet);
  const currentWalletType = useUserStore((state) => state.currentWalletType);

  const [gameData, setGameData] = useState({
    amount: 0,
    payoutMultiplier: 2,
    target: 50.5,
    condition: "Over",
    profit: 0,
    winChance: 49.5,
    isValid: false,
    result: null,
  });

  const handleAmountChange = (e, val = -1) => {
    const balance = getCurrentAmount();
    let amount;
    if (val === -1) {
      amount = parseFloat(e.target.value);
    } else {
      if (val === 0.5) {
        amount = gameData.amount / 2;
      } else {
        amount = gameData.amount * 2;
      }
      amount = Math.min(amount, balance);
    }

    if (amount > balance) {
      updateGameData({ amount, isValid: false });
    } else {
      updateGameData({ amount, isValid: true });
    }
  };

   const handlePlayMines = async () => {
     const balance = getCurrentAmount();
     if (gameData.amount > balance) {
       updateGameData({ isValid: false });
       return;
     }
     const userId = user?.userId;
     const result = await createDiceGame(userId, gameData.amount, gameData.payoutMultiplier, gameData.target, gameData.condition);
     if (gameData.condition === "Over") {
       if (result >= gameData.target) transactWallet(gameData.profit);
       else transactWallet(-gameData.amount);
     } else {
       if (result <= gameData.target) transactWallet(gameData.profit);
       else transactWallet(-gameData.amount);
     }
     updateGameData({ result });
   };
  return (
    <div className="m-5">
      <div className="h-[80vh] flex justify-center items-center flex-col md:flex-row gap-4">
        <div className="md:h-full min-w-[240px] md:w-1/4 order-2 md:order-1 bg-zinc-950 rounded-l-xl">
          <SideCard gameData={gameData} onAmountChange={handleAmountChange} onPlayDice={handlePlayMines} />
        </div>
        <div className="h-3/4 md:h-full w-full md:w-3/4 order-1 md:order-2">
          <div className="h-3/4 flex flex-col justify-center items-center"></div>
        </div>
      </div>
    </div>
  );
}
