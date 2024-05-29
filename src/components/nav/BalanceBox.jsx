import { Wallet } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import BalanceDrop from "./BalanceDrop";
import WalletDialog from "../dialogs/WalletDialog";

export default function BalanceBox() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <BalanceDrop />
        <DialogTrigger
          className={"text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-r-lg text-sm px-3 py-2.5 flex items-center justify-center gap-1"}
        >
          <Wallet size={16} />
          Wallet
        </DialogTrigger>
        <WalletDialog />
      </Dialog>
    </div>
  );
}
