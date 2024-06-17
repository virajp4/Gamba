"use client";
import { useEffect, useState } from "react";

import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import useUserStore from "@/stores/useUserStore";
import useAuthStore from "@/stores/useAuthStore";
import { updateLastDepositTime, getLastDepositTime, updateDailyDepositLimit, getDailyDepositLimit } from "@/lib/db";

export default function WalletDialog() {
  const wallet = useUserStore((state) => state.wallet);
  const transactWallet = useUserStore((state) => state.transactWallet);
  const user = useAuthStore((state) => state.user);

  const [limit, setLimit] = useState(10000);
  const [countdown, setCountdown] = useState(`0h 0m`);

  useEffect(() => {
    let interval;

    async function fetchLimit() {
      if (!user) return;

      const lastTime = await getLastDepositTime(user.userId);
      const currentTime = new Date();
      const lastReset = new Date(lastTime);

      if (currentTime - lastReset > 86400000) {
        await updateLastDepositTime(user.userId, currentTime);
        await updateDailyDepositLimit(user.userAuthId, 10000);
        setLimit(10000);
      } else {
        const currLimit = await getDailyDepositLimit(user.userAuthId);
        setLimit(currLimit);
      }
    }

    async function calculateCountdown() {
      if (!user) return;

      const lastTime = await getLastDepositTime(user.userId);
      const nextReset = new Date(lastTime);
      nextReset.setDate(nextReset.getDate() + 1);
      nextReset.setHours(0, 0, 0, 0);

      const currentTime = new Date();
      const timeDiff = nextReset - currentTime;

      if (timeDiff > 0) {
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown("Refill available");
      }
    }

    if (user) {
      fetchLimit();
      interval = setInterval(calculateCountdown, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [wallet, user]);

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lets deposit some money, shall we?</DialogTitle>
          <DialogDescription>
            <span className="flex flex-col items-center justify-center gap-3">
              <span>Its easy to deposit money, just click the buttons below and go degen mode.</span>
              <span className="grid grid-cols-3 gap-3">
                <Button variant="secondary" onClick={() => transactWallet(500, "deposit")} disabled={limit < 500}>
                  +500
                </Button>
                <Button variant="secondary" onClick={() => transactWallet(1000, "deposit")} disabled={limit < 1000}>
                  +1000
                </Button>
                <Button variant="secondary" onClick={() => transactWallet(5000, "deposit")} disabled={limit < 5000}>
                  +5000
                </Button>
              </span>
              <span className="flex flex-col gap-1 text-center">
                <span>Daily Deposit Amount Left: ${limit}</span>
                <span>Refill Available in: {countdown}</span>
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </>
  );
}
