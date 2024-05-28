import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ChevronDown, WalletCards } from "lucide-react";

export default function BalanceDrop() {
  return (
    <DropdownMenu className={"w-fit"}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={"rounded-none rounded-l-lg pr-2"}>
          $ 10,000.00 <ChevronDown size={16} className="ml-1.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"w-fit"}>
        <div className="flex justify-center items-center flex-col gap-2 py-1.5">
          <DropdownMenuItem className={"w-full flex justify-between items-center px-2 text-center"}>
            <span>$ 123231</span>
            <span className="w-1/4">INR</span>
          </DropdownMenuItem>
          <DropdownMenuItem className={"w-full flex justify-between items-center px-2 text-center"}>
            <span>$ 122</span>
            <span className="w-1/4">BTC</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className={"flex items-center justify-center gap-1 px-0 py-0.5"}>
          <Button variant="outline" className={"px-4 border-none"}>
            <WalletCards size={16} className="mr-2 h-4 w-4" />
            Wallet Settings
          </Button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
