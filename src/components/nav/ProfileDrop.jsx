"use client";
import { useState } from "react";
import { User, Wallet, Vault, Trophy, LineChart, ReceiptText, LogOut, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";

import { supabase } from "@/lib/supabase";
import WalletDialog from "../dialogs/WalletDialog";
import VipDialog from "../dialogs/VipDialog";

export default function ProfileDrop() {
  const [openDialog, setOpenDialog] = useState("");
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  function changeDialog(dialog) {
    setOpenDialog(dialog);
  }

  function closeDialog() {
    setOpenDialog("");
  }

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error", error.message);
    setSession(null);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex gap-1">
            <User />
            <span className="hidden sm:block">Profile</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"mt-2"}>
          <div className="flex gap-1 flex-col">
            <DropdownMenuItem className={"flex justify-start items-center cursor-pointer"} onClick={() => changeDialog("wallet")}>
              <Wallet size={16} className="mr-2 h-4 w-4" />
              Wallet
            </DropdownMenuItem>
            <DropdownMenuItem className={"flex justify-start items-center cursor-pointer"} onClick={() => changeDialog("vault")}>
              <Vault size={16} className="mr-2 h-4 w-4" />
              Vault
            </DropdownMenuItem>
            <DropdownMenuItem className={"flex justify-start items-center cursor-pointer"} onClick={() => changeDialog("vip")}>
              <Trophy size={16} className="mr-2 h-4 w-4" />
              VIP
            </DropdownMenuItem>
            <DropdownMenuItem className={"flex justify-start items-center cursor-pointer"} onClick={() => changeDialog("stats")}>
              <LineChart size={16} className="mr-2 h-4 w-4" />
              Statistics
            </DropdownMenuItem>
            <DropdownMenuItem className={"flex justify-start items-center cursor-pointer"}>
              <ReceiptText size={16} className="mr-2 h-4 w-4" />
              Transactions
            </DropdownMenuItem>
            <DropdownMenuItem className={"flex justify-start items-center cursor-pointer"}>
              <Settings size={16} className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className={"flex justify-start items-center cursor-pointer"} onClick={handleLogOut}>
              <LogOut size={16} className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {openDialog === "wallet" && (
        <Dialog open={true} onOpenChange={closeDialog}>
          <WalletDialog />
        </Dialog>
      )}
      {openDialog === "vault" && <Dialog open={true} onOpenChange={closeDialog}></Dialog>}
      {openDialog === "vip" && (
        <Dialog open={true} onOpenChange={closeDialog}>
          <VipDialog />
        </Dialog>
      )}
    </>
  );
}
