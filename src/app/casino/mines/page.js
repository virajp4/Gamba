"use client";
import { useState, useEffect } from "react";

import SideCard from "@/components/casino/mines/SideCard";
import Mine from "@/components/casino/mines/Mine";

import useAuthStore from "@/stores/useAuthStore";
import useUserStore from "@/stores/useUserStore";

const mineVals = Array.from({ length: 25 }, (_, index) => ({
  value: index + 1,
  label: index + 1,
}));

export default function Mines() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const getCurrentAmount = useUserStore((state) => state.getCurrentAmount);
  const transactWallet = useUserStore((state) => state.transactWallet);
  const wallet = useUserStore((state) => state.wallet);
  const currentWalletType = useUserStore((state) => state.currentWalletType);

  const [gameData, setGameData] = useState({
    minesId: null,
    amount: 0,
    payoutMultiplier: 0,
    payout: 0,
    rounds: [],
    minesCount: 1,
    mines: [],
    isValid: true,
  });

  useEffect(() => {
    async function fetchData() {
      const balance = getCurrentAmount();
      if (gameData.amount > balance) setGameData((prev) => ({ ...prev, isValid: false }));
      else setGameData((prev) => ({ ...prev, isValid: true }));
    }
    fetchData();
  }, [wallet, currentWalletType]);

  const handleAmountChange = (e, val = -1) => {
    if (gameData.minesId) return;
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

  const handleMinesChange = (e) => {
    setGameData((prev) => ({ ...prev, minesCount: e }));
  };

  const handleStartMines = async () => {
    const userId = user.userId;
    const data = await fetch("/api/mines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        amount: gameData.amount,
        minesCount: gameData.minesCount,
        userId,
      }),
    });
    const id = await data.json();
    transactWallet(-gameData.amount);
    setGameData((prev) => ({ ...prev, minesId: id, mines: [], rounds: [], payout: 0, payoutMultiplier: 0 }));
  };

  const handleCashout = async () => {
    const data = await fetch(`/api/mines/${gameData.minesId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const { mines, rounds, payout } = await data.json();
    transactWallet(payout);
    setGameData((prev) => ({ ...prev, minesId: null, rounds, mines, payoutMultiplier: 0 }));
  };

  const handleClickMine = async (val) => {
    if (gameData.minesId === null) return;
    if (gameData.rounds.length > 0 && gameData.rounds.includes(val)) return;
    const data = await fetch(`/api/mines/${gameData.minesId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        amount: gameData.amount,
        minesCount: gameData.minesCount,
        value: val,
      }),
    });
    const { payoutMultiplier, payout, rounds, mines } = await data.json();
    if (payout === 0) {
      setGameData((prev) => ({ ...prev, payout: 0, payoutMultiplier: 0, minesId: null, rounds, mines }));
    } else {
      if (rounds.length + gameData.minesCount === 25) {
        transactWallet(payout);
        setGameData((prev) => ({ ...prev, payout: 0, payoutMultiplier: 0, minesId: null, rounds, mines }));
      } else {
        setGameData((prev) => ({ ...prev, payoutMultiplier, rounds, payout }));
      }
    }
  };

  return (
    <div className="m-5">
      <div className="h-[80vh] flex justify-center items-center flex-col md:flex-row gap-4">
        <div className="md:h-full min-w-[240px] md:w-1/4 order-2 md:order-1 bg-zinc-950 rounded-l-xl">
          <SideCard
            mineVals={mineVals.slice(0, -1)}
            gameData={gameData}
            onAmountChange={handleAmountChange}
            onMinesChange={handleMinesChange}
            onPlayMines={handleStartMines}
            onCashout={handleCashout}
          />
        </div>
        <div className="h-full w-full md:w-3/4 order-1 md:order-2">
          <div className="h-full w-full flex flex-col justify-center items-center">
            <div className="max-w-[600px] w-full h-full grid grid-rows-5 grid-cols-5 gap-2">
              {mineVals.map((mine) => (
                <Mine key={mine.value} value={mine.value} onClickMine={handleClickMine} rounds={gameData.rounds} mines={gameData.mines} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
