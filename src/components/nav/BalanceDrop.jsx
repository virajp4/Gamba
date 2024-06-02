"use client";
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
import { useEffect } from "react";

import useUserStore from "@/stores/useUserStore";

export default function BalanceDrop() {
  const fetchWallet = useUserStore((state) => state.fetchWallet);
  const wallet = useUserStore((state) => state.wallet);
  const currentWalletType = useUserStore((state) => state.currentWalletType);
  const setCurrentWalletType = useUserStore((state) => state.setCurrentWalletType);

  useEffect(() => {
    async function fetchData() {
      await fetchWallet();
    }
    fetchData();
  }, []);

  return (
    <DropdownMenu className={"w-fit"}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={"rounded-none rounded-l-lg pr-2"}>
          $ {wallet[currentWalletType]} <ChevronDown size={16} className="ml-1.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"w-fit"}>
        <div className="flex justify-center items-center flex-col gap-2 py-1.5">
          <DropdownMenuItem className={"w-full flex justify-between items-center px-2 text-center cursor-pointer"} onClick={() => setCurrentWalletType("local")}>
            <span>$ {wallet.local}</span>
            <span className="w-1/4">USD</span>
          </DropdownMenuItem>
          <DropdownMenuItem className={"w-full flex justify-between items-center px-2 text-center cursor-pointer"} onClick={() => setCurrentWalletType("bitcoin")}>
            <span>$ {wallet.bitcoin}</span>
            <span className="w-1/4">BTC</span>
          </DropdownMenuItem>
          <DropdownMenuItem className={"w-full flex justify-between items-center px-2 text-center cursor-pointer"} onClick={() => setCurrentWalletType("ethereum")}>
            <span>$ {wallet.ethereum}</span>
            <span className="w-1/4">ETH</span>
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
