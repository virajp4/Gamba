import { useState, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";

export default function SideCard({ gameData, onAmountChange, onMinesChange, onPlayMines, mineVals, onCashout }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function playGame() {
    setLoading(true);
    await onPlayMines();
    setLoading(false);
  }

  function openPopover() {
    if (gameData.minesId) return;
    else setOpen((prev) => !prev);
  }

  return (
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
                onChange={onAmountChange}
                readOnly={gameData.minesId || loading}
              />
              <Button variant="outline" onClick={() => onAmountChange(null, 0.5)}>
                ½
              </Button>
              <Button variant="outline" onClick={() => onAmountChange(null, 2)}>
                2x
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <Label htmlFor="minesCount">Mines</Label>
            <Popover open={open} onOpenChange={openPopover}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                  {gameData["minesCount"]}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandEmpty>No mine found.</CommandEmpty>
                    <CommandGroup>
                      {mineVals.map((mine) => (
                        <CommandItem
                          key={mine.value}
                          value={mine.value}
                          onSelect={(currentValue) => {
                            onMinesChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", gameData["minesCount"] == mine.value ? "opacity-100" : "opacity-0")} />
                          {mine.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {gameData.payoutMultiplier > 0 && (
            <div className="flex gap-2 flex-col">
              <Label>Total Profit ({gameData.payoutMultiplier}x) </Label>
              <Input type="number" id="profit" name="profit" value={gameData["payout"]} placeholder="0.00" disabled />
            </div>
          )}
          {!gameData.minesId && (
            <Button disabled={loading} onClick={playGame} className="transition-all duration-150">
              {loading ? "Loading..." : "Bet"}
            </Button>
          )}
          {gameData.minesId && (
            <Button className="transition-all duration-150" onClick={onCashout}>
              Cashout
            </Button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
