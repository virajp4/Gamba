"use client";
import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider";

import SideCard from "@/components/casino/dice/SideCard";
import BottomCard from "@/components/casino/dice/BottomCard";
import { createDiceGame } from "@/lib/db";
import useAuthStore from "@/stores/useAuthStore";
import useUserStore from "@/stores/useUserStore";
import { isValid, set } from "zod";
import { get } from "react-hook-form";

export default function Dice() {
  const { user } = useAuthStore();
  const { getCurrentAmount, transactWallet } = useUserStore();
  const wallet = useUserStore((state) => state.wallet);
  const currentWalletType = useUserStore((state) => state.currentWalletType);

  const [gameData, setGameData] = useState({
    amount: 100,
    payoutMultiplier: 2,
    target: 50.5,
    condition: "Over",
    profit: 100,
    winChance: 49.5,
    isValid: false,
    result: null,
  });

  useEffect(() => {
    async function fetchData() {
      const balance = getCurrentAmount();
      if (gameData.amount > balance) updateGameData({ isValid: false });
      else updateGameData({ isValid: true });
    }
    fetchData();
  }, [wallet, currentWalletType]);

  const updateGameData = (newData) => {
    const { amount, payoutMultiplier, target, condition } = { ...gameData, ...newData };

    const winChance = condition === "Over" ? 100.0 - target : target;
    const profit = amount * payoutMultiplier - amount;
    const newPayoutMultiplier = (99 / winChance).toFixed(4);

    setGameData({
      ...gameData,
      ...newData,
      winChance: winChance,
      profit: profit.toFixed(2),
      payoutMultiplier: newData.payoutMultiplier !== undefined ? payoutMultiplier : newPayoutMultiplier,
      isValid: newData.isValid && newPayoutMultiplier >= 1.0102 && newPayoutMultiplier <= 9900,
    });
  };

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

  const handleMultChange = (e) => {
    const newMultiplier = parseFloat(e.target.value);
    const newWinChance = (99 / newMultiplier).toFixed(4);
    const newTarget = gameData.condition === "Over" ? 100 - newWinChance : newWinChance;

    updateGameData({
      payoutMultiplier: parseFloat(newMultiplier),
      winChance: parseFloat(newWinChance).toFixed(4),
      target: parseFloat(newTarget),
      isValid: newMultiplier >= 1.0102 && newMultiplier <= 9900,
    });
  };

  const handleTargetFlip = () => {
    const condition = gameData.condition === "Over" ? "Under" : "Over";
    const target = 100 - gameData.target;
    const winChance = gameData.condition === "Over" ? 100.0 - target : target;
    const newPayoutMultiplier = (99 / winChance).toFixed(4);

    updateGameData({ condition, target, isValid: newPayoutMultiplier >= 1.0102 && newPayoutMultiplier <= 9900 });
  };

  const handleWinChange = (e) => {
    const newWinChance = parseFloat(e.target.value);
    const newMultiplier = (99 / newWinChance).toFixed(4);
    const newTarget = gameData.condition === "Over" ? 100 - newWinChance : newWinChance;

    updateGameData({
      winChance: parseFloat(newWinChance),
      payoutMultiplier: parseFloat(newMultiplier),
      target: parseFloat(newTarget),
      isValid: newWinChance >= 0.01 && newWinChance <= 98,
    });
  };

  const changeSlider = (vals) => {
    const target = gameData.condition === "Over" ? 100 - vals[0] : vals[0] - 0.0;
    const winChance = gameData.condition === "Over" ? 100.0 - target : target;
    const newPayoutMultiplier = (99 / winChance).toFixed(4);

    if (newPayoutMultiplier >= 1.0102 && newPayoutMultiplier <= 9900) {
      updateGameData({ target });
    }
  };

  const handlePlayDice = async () => {
    const balance = getCurrentAmount();
    if (gameData.amount > balance) {
      setGameData({ isValid: false });
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
          <SideCard gameData={gameData} onAmountChange={handleAmountChange} onPlayDice={handlePlayDice} />
        </div>
        <div className="h-3/4 md:h-full w-full md:w-3/4 order-1 md:order-2">
          <div className="h-3/4 flex flex-col justify-center items-center">
            <Slider
              value={[gameData.winChance]}
              max={99.99}
              min={2.0}
              step={1}
              onValueChange={changeSlider}
              inverted={gameData.condition === "Over"}
              markerValue={gameData.result}
            />
          </div>
          <div className="h-1/4 flex items-center justify-center">
            <BottomCard
              gameData={gameData}
              handleMultChange={handleMultChange}
              handleTargetFlip={handleTargetFlip}
              handleWinChange={handleWinChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
