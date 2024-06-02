import { MoveRight } from "lucide-react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

import VipDialog from "@/components/dialogs/VipDialog";

const vipRanks = ["Plastic", "Iron", "Gold", "Platinum", "Diamond"];

const vipRankColors = {
  Plastic: "text-stone-400",
  Iron: "text-slate-400",
  Gold: "text-amber-400",
  Platinum: "text-cyan-600",
  Diamond: "text-fuchsia-600",
  Degen: "text-rose-600",
};

export default function VipProgressBar({ user }) {
  const currentRankIndex = vipRanks.indexOf(user.userVipRank);
  const nextRank = currentRankIndex < vipRanks.length - 1 ? vipRanks[currentRankIndex + 1] : "Degen";

  return (
    <>
      <h1 className="text-2xl font-bold">Welcome back, {user.userUsername}</h1>
      <Dialog>
        <div className="flex items-center justify-between gap-2">
          <DialogTrigger className={"flex items-center justify-start gap-2 hover:translate-x-3 transition-all ease-in-out group"}>
            <p className="text-sm sm:text-md">View VIP Progress</p>
            <MoveRight className="opacity-75 group-hover:opacity-100 scale-75 sm:scale-100" />
          </DialogTrigger>
          <span className="text-sm">{user.userVipLevel}%</span>
        </div>
        <VipDialog />
      </Dialog>
      <div className="flex flex-col gap-1.5">
        <Progress value={user.userVipLevel} />
        <div className="flex justify-between items-center">
          <p className={`text-sm font-semibold ${vipRankColors[user.userVipRank]}`}>{user.userVipRank}</p>
          <p className={`text-sm font-semibold ${vipRankColors[nextRank]}`}>{nextRank}</p>
        </div>
      </div>
    </>
  );
}
