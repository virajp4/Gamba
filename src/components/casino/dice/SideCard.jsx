import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SideCard({ gameData, onAmountChange, onPlayDice }) {
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
              <Input type="number" step="0.01" id="amount" name="amount" min={0.0} value={parseFloat(gameData["amount"])} onChange={onAmountChange} />
              <Button variant="outline" onClick={() => onAmountChange(null, 0.5)}>
                ½
              </Button>
              <Button variant="outline" onClick={() => onAmountChange(null, 2)}>
                2x
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <Label>Profit on Win ($) </Label>
            <Input type="number" id="profit" name="profit" value={gameData["profit"]} placeholder="0.00" disabled />
          </div>
          <Button disabled={!gameData.isValid} onClick={onPlayDice} className='transition-all duration-150'>
            Bet
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
