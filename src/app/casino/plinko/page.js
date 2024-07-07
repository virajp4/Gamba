"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import useFetch from "@/lib/useFetch";
import useAuthStore from "@/stores/useAuthStore";
import useUserStore from "@/stores/useUserStore";

import PlinkoBoard from "@/components/casino/plinko/PlinkoBoard";
import SideCard from "@/components/casino/plinko/SideCard";

export default function Plinko() {
  const user = useAuthStore((state) => state.user);
  const getCurrentAmount = useUserStore((state) => state.getCurrentAmount);
  const transactWallet = useUserStore((state) => state.transactWallet);
  const wallet = useUserStore((state) => state.wallet);
  const currentWalletType = useUserStore((state) => state.currentWalletType);
  const { fetchWithAuth, loading } = useFetch();
  const { toast } = useToast();

  const [gameData, setGameData] = useState({
    plinkoId: null,
    amount: 0,
    payoutMultiplier: 0,
    payout: 0,
    isValid: true,
    loadingBall: null,
    path: [],
    risk: "Low",
    rows: 8,
  });

  const handleAmountChange = (e, val = -1) => {
    if (gameData.plinkoId) return;
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
      setGameData((prev) => ({ ...prev, amount, isValid: false }));
    } else {
      setGameData((prev) => ({ ...prev, amount, isValid: true }));
    }
  };

  const handleInputChange = (val, type = "rows") => {
    if (type === "risk") {
      setGameData((prev) => ({ ...prev, risk: val }));
    } else {
      setGameData((prev) => ({ ...prev, rows: val }));
    }
  };

  const playPlinko = () => {
    if (gameData.plinkoId) return;
    if (gameData.amount === 0) return;
    if (!gameData.isValid) return;

    setGameData((prev) => ({ ...prev, loadingBall: true }));
    transactWallet(-gameData.amount);
    fetchWithAuth("/casino/plinko", {
      method: "POST",
      body: JSON.stringify({
        amount: gameData.amount,
        risk: gameData.risk,
        rows: gameData.rows,
      }),
    }).then((res) => {
      setGameData((prev) => ({
        ...prev,
        plinkoId: res.plinkoId,
        payoutMultiplier: res.payoutMultiplier,
        payout: res.payout,
        path: res.path,
      }));
      transactWallet(gameData.payout);
    });
  };

  return (
    <div className="md:h-[80vh] flex justify-center items-center flex-col md:flex-row gap-4">
      <div className="md:h-full min-w-[240px] md:w-1/4 order-2 md:order-1 bg-zinc-950 rounded-l-xl">
        <SideCard gameData={gameData} onAmountChange={handleAmountChange} onInputChange={handleInputChange} playPlinkoGame={playPlinko} />
      </div>

      <div className="h-[55vh] md:h-full w-full md:w-3/4 max-w-[800px] order-1 md:order-2 sm:px-2 pt-5">
        <PlinkoBoard rows={gameData.rows} />
      </div>
    </div>
  );
}
