import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";

const risks = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const rows = [
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
  { value: 15, label: "15" },
  { value: 16, label: "16" },
];

export default function SideCard({ gameData, onAmountChange, onInputChange, playPlinkoGame }) {
  const [openRisk, setOpenRisk] = useState(false);
  const [openRows, setOpenRows] = useState(false);
  const [loading, setLoading] = useState(false);

  const playGame = async () => {
    setLoading(true);
    await playPlinkoGame();
    setLoading(false);
  };

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
            <Label htmlFor="risk">Risk</Label>
            <Popover open={openRisk} onOpenChange={() => setOpenRisk((prev) => !prev)}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openRisk} className="justify-between">
                  {gameData.risk}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandEmpty>No mine found.</CommandEmpty>
                    <CommandGroup>
                      {risks.map((risk) => (
                        <CommandItem
                          key={risk.value}
                          value={risk.value}
                          onSelect={(currentValue) => {
                            onInputChange(currentValue, "risk");
                            setOpenRisk(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", gameData.risk == risk.value ? "opacity-100" : "opacity-0")} />
                          {risk.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2 flex-col">
            <Label htmlFor="rows">Rows</Label>
            <Popover open={openRows} onOpenChange={() => setOpenRows((prev) => !prev)}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openRows} className="justify-between">
                  {gameData.rows}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandEmpty>No mine found.</CommandEmpty>
                    <CommandGroup>
                      {rows.map((row) => (
                        <CommandItem
                          key={row.value}
                          value={row.value}
                          onSelect={(currentValue) => {
                            onInputChange(parseInt(currentValue), "rows");
                            setOpenRows(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", gameData.rows == row.value ? "opacity-100" : "opacity-0")} />
                          {row.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {!gameData.plinkoId && (
            <Button disabled={loading} onClick={playGame} className="transition-all duration-150">
              {loading ? "Loading..." : "Bet"}
            </Button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
