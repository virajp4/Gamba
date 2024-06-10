import { RotateCcw} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function BottomCard({ gameData, handleMultChange, handleTargetFlip, handleWinChange }) {
  return (
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
          {parseFloat(gameData["target"]).toFixed(2)}
          <RotateCcw size={16} />
        </Button>
      </div>
      <div className="flex gap-2 flex-col">
        <Label htmlFor="win">Win Chance</Label>
        <Input type="number" step="0.01" id="winChance" name="winChance" value={gameData["winChance"]} onChange={handleWinChange} />
      </div>
    </div>
  );
}
