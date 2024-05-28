import { User, Wallet, Vault, Trophy, LineChart, ReceiptText, LogOut, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileDrop() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex gap-1">
          <User />
          <span className="hidden sm:block">Profile</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'mt-2'}>
        <div className="flex gap-1 flex-col">
          <DropdownMenuItem>
            <Wallet size={16} className="mr-2 h-4 w-4" />
            Wallet
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Vault size={16} className="mr-2 h-4 w-4" />
            Vault
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trophy size={16} className="mr-2 h-4 w-4" />
            VIP
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LineChart size={16} className="mr-2 h-4 w-4" />
            Statistics
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ReceiptText size={16} className="mr-2 h-4 w-4" />
            Transactions
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings size={16} className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut size={16} className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
