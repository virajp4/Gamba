"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import SideCard from "@/components/casino/dragon/SideCard";
import Towers from "@/components/casino/dragon/Towers";

import useFetch from "@/lib/useFetch";
import useAuthStore from "@/stores/useAuthStore";
import useUserStore from "@/stores/useUserStore";

const difficultyLevels = ["Easy", "Medium", "Hard", "Expert", "Master"];
const columns = { Easy: 4, Medium: 3, Hard: 2, Expert: 3, Master: 4 };

export default function Dragon() {
  const user = useAuthStore((state) => state.user);
  const getCurrentAmount = useUserStore((state) => state.getCurrentAmount);
  const transactWallet = useUserStore((state) => state.transactWallet);
  const wallet = useUserStore((state) => state.wallet);
  const currentWalletType = useUserStore((state) => state.currentWalletType);
  const { fetchWithAuth, loading } = useFetch();
  const { toast } = useToast();

  const [gameData, setGameData] = useState({
    amount: 0,
    payoutMultiplier: 0,
    payout: 0,
    dragonId: null,
    difficulty: "Medium",
    currentRound: 0,
    tilesCorrect: [],
    tilesSelected: [],
    isValid: true,
    loadingTile: null,
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

  const handleDifficultyChange = (e) => {
    setGameData((prev) => ({
      ...prev,
      difficulty: e,
      tilesSelected: [],
      currentRound: 0,
      payoutMultiplier: 0,
      payout: 0,
      tilesCorrect: [],
      active: false,
      dragonId: null,
    }));
  };

  const handleStartDragon = async () => {
    if (loading) return;
    const userId = user.userId;
    const data = await fetchWithAuth("/api/dragon", {
      method: "POST",
      body: JSON.stringify({
        amount: gameData.amount,
        difficulty: gameData.difficulty,
        userId,
      }),
    });
    const id = data;
    transactWallet(-gameData.amount);
    setGameData((prev) => ({
      ...prev,
      dragonId: id,
      tilesSelected: [],
      currentRound: 0,
      payoutMultiplier: 0,
      payout: 0,
      tilesCorrect: [],
      active: true,
    }));
  };

  const handleCashout = async () => {
    if (loading) return;
    if (gameData.payoutMultiplier === 0) return;
    const data = await fetchWithAuth(`/api/dragon/${gameData.dragonId}`, {
      method: "GET",
    });
    const { tilesCorrect, payout } = data;
    transactWallet(payout);
    toast({
      title: "Dayum!",
      description: `You won $${payout} (${gameData.payoutMultiplier}x).`,
    });
    setGameData((prev) => ({ ...prev, dragonId: null, tilesCorrect, payoutMultiplier: 0, payout: 0, currentRound: null, active: false }));
  };

  const handleClickTower = async (val) => {
    if (loading) return;
    if (gameData.dragonId === null) return;
    if (gameData.tilesSelected.length > 0 && gameData.tilesSelected.includes(val)) return;

    setGameData((prev) => ({ ...prev, loadingTile: val }));
    const data = await fetchWithAuth(`/api/dragon/${gameData.dragonId}`, {
      method: "POST",
      body: JSON.stringify({
        value: val,
        currentRound: gameData.currentRound,
        playedRounds: gameData.tilesSelected,
      }),
    });
    const { payoutMultiplier, payout, tilesCorrect } = data;
    if (payoutMultiplier === 0) {
      setGameData((prev) => ({
        ...prev,
        payout: 0,
        payoutMultiplier: 0,
        dragonId: null,
        tilesCorrect,
        loadingTile: null,
        currentRound: null,
        tilesSelected: [...prev.tilesSelected, val],
        active: false,
      }));
    } else {
      if (gameData.tilesSelected.length + 1 === 9) {
        transactWallet(payout);
        toast({
          title: "Wow, just wow!",
          description: `You won $${payout} (${gameData.payoutMultiplier}x).`,
        });
        setGameData((prev) => ({
          ...prev,
          payout: 0,
          payoutMultiplier: 0,
          dragonId: null,
          tilesCorrect,
          loadingTile: null,
          currentRound: null,
          tilesSelected: [...prev.tilesSelected, val],
          active: false,
        }));
      } else {
        setGameData((prev) => ({
          ...prev,
          payoutMultiplier,
          payout,
          loadingTile: null,
          currentRound: prev.currentRound + 1,
          tilesCorrect,
          tilesSelected: [...prev.tilesSelected, val],
        }));
      }
    }
  };
  return (
    <div className="m-5">
      <div className="md:h-[80vh] flex justify-center items-center flex-col md:flex-row gap-4">
        <div className="md:h-full min-w-[240px] md:w-1/4 order-2 md:order-1 bg-zinc-950 rounded-l-xl">
          <SideCard
            difficultyLevels={difficultyLevels}
            gameData={gameData}
            onAmountChange={handleAmountChange}
            onDifficultyChange={handleDifficultyChange}
            onPlayDragon={handleStartDragon}
            onCashout={handleCashout}
          />
        </div>
        <div className="h-full w-full md:w-3/4 order-1 md:order-2 sm:px-2">
          <div className="h-full w-full flex flex-col justify-center items-center">
            <div className={`max-w-[600px] aspect-1 w-full h-full grid grid-rows-9 grid-cols-${columns[gameData.difficulty]} gap-1 sm:gap-2`}>
              <Towers columns={columns[gameData.difficulty]} onClickTile={handleClickTower} {...gameData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
