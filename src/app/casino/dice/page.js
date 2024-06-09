"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function page() {
  const [gameData, setGameData] = useState({
    amount: 10.5,
    payoutMultiplier: 1.98,
    target: 50.0,
    condition: "Over",
    profit: 0,
    winChance: 50.0,
    isValid: true,
  });

  const updateGameData = (newData) => {
    const { amount, payoutMultiplier, target, condition } = { ...gameData, ...newData };

    const winChance = condition === "Over" ? 100 - target : target;
    const profit = amount * payoutMultiplier - amount;
    const newPayoutMultiplier = (99 / winChance).toFixed(4);

    setGameData({
      ...gameData,
      ...newData,
      winChance,
      profit: profit.toFixed(2),
      payoutMultiplier: newData.payoutMultiplier !== undefined ? payoutMultiplier : newPayoutMultiplier,
    });
  };

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    updateGameData({ amount });
  };

  const changeAmount = (val) => {
    const amount = val === 0 ? gameData.amount / 2 : gameData.amount * 2;
    updateGameData({ amount });
  };

  const handleMultChange = (e) => {
    const newMultiplier = parseFloat(e.target.value);
    const newWinChance = (99 / newMultiplier).toFixed(2);
    const newTarget = gameData.condition === "Over" ? 100 - newWinChance : newWinChance;

    updateGameData({
      payoutMultiplier: newMultiplier,
      winChance: parseFloat(newWinChance),
      target: parseFloat(newTarget),
      isValid: newMultiplier >= 1.0102 && newMultiplier <= 9900,
    });
  };

  const handleTargetFlip = () => {
    const condition = gameData.condition === "Over" ? "Under" : "Over";
    const target = 100 - gameData.target;
    updateGameData({ condition, target });
  };

  const handleWinChange = (e) => {
    const newWinChance = parseFloat(e.target.value);
    const newMultiplier = (99 / newWinChance).toFixed(4);
    const newTarget = gameData.condition === "Over" ? 100 - newWinChance : newWinChance;

    updateGameData({
      winChance: newWinChance,
      payoutMultiplier: parseFloat(newMultiplier),
      target: parseFloat(newTarget),
      isValid: newWinChance >= 0.01 && newWinChance <= 98,
    });
  };

  const changeTarget = (vals) => {
    const target = gameData.condition === "Over" ? 100 - vals[0] : vals[0];
    updateGameData({ target: target.toFixed(2) });
  };

  return (
    <div className="m-5">
      <div className="h-[80vh] flex justify-center items-center flex-col md:flex-row gap-4">
        <div className="h-full min-w-[240px] md:w-1/4 order-2 md:order-1 bg-zinc-950 rounded-l-xl">
          <Tabs defaultValue="manual" className="flex justify-center items-center flex-col p-3 gap-3">
            <TabsList>
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="auto">Automatic</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <div className="grid items-center gap-5">
                <div className="flex gap-2 flex-col">
                  <Label htmlFor="amount">Bet Amount ($) </Label>
                  <div className="flex items-center space-x-0.5">
                    <Input
                      type="number"
                      step="0.01"
                      id="amount"
                      name="amount"
                      min={0.0}
                      value={parseFloat(gameData["amount"])}
                      onChange={handleAmountChange}
                    />
                    <Button variant="outline" onClick={() => changeAmount(0)}>
                      ½
                    </Button>
                    <Button variant="outline" onClick={() => changeAmount(2)}>
                      2x
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-col">
                  <Label>Profit on Win ($) </Label>
                  <Input type="number" id="profit" name="profit" value={gameData["profit"]} placeholder="0.00" disabled />
                </div>
                <Button disabled={!gameData.isValid}>Bet</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="h-3/4 md:h-full w-full md:w-3/4 order-1 md:order-2">
          <div className="h-3/4 flex flex-col justify-center items-center">
            <Slider value={[gameData.winChance]} max={99.99} min={2} step={1} onValueChange={changeTarget} inverted={gameData.condition === "Over"} />
          </div>
          <div className="h-1/4 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex gap-2 flex-col">
                <Label htmlFor="mult">Multiplier</Label>
                <Input
                  type="number"
                  step="0.0001"
                  id="payoutMultiplier"
                  name="payoutMultiplier"
                  placeholder="0.00"
                  value={gameData["payoutMultiplier"]}
                  onChange={handleMultChange}
                />
              </div>
              <div className="flex gap-2 flex-col">
                <Label htmlFor="target">Roll {gameData.condition}</Label>
                <Button variant="outline" onClick={handleTargetFlip} className="p-3 flex justify-between items-center">
                  {gameData["target"]}
                  <RotateCcw />
                </Button>
              </div>
              <div className="flex gap-2 flex-col">
                <Label htmlFor="win">Win Chance</Label>
                <Input type="number" step="0.01" id="winChance" name="winChance" value={gameData["winChance"]} onChange={handleWinChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
