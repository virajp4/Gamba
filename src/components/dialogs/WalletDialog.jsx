"use client";
import { useEffect, useState, useCallback } from "react";

import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import useUserStore from "@/stores/useUserStore";
import useAuthStore from "@/stores/useAuthStore";
import { getDailyDepositLimit } from "@/lib/db";

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
      const currLimit = await getDailyDepositLimit(user.userAuthId);
      setLimit(currLimit);
    }

    function calculateCountdown() {
      if (!user) return;

      const currentTime = new Date();
      const nextReset = new Date();
      nextReset.setDate(nextReset.getDate() + 1);
      nextReset.setHours(0, 0, 0, 0);

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
      calculateCountdown();
      interval = setInterval(calculateCountdown, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  const handleTransact = useCallback(
    async (amount) => {
      await transactWallet(amount, "deposit");
      setLimit((prevLimit) => prevLimit - amount);
    },
    [transactWallet]
  );

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lets deposit some money, shall we?</DialogTitle>
          <DialogDescription>
            <span className="flex flex-col items-center justify-center gap-3">
              <span>Its easy to deposit money, just click the buttons below and go degen mode.</span>
              <span className="grid grid-cols-3 gap-3">
                <Button variant="secondary" onClick={() => handleTransact(500, "deposit")} disabled={limit < 500}>
                  +500
                </Button>
                <Button variant="secondary" onClick={() => handleTransact(1000, "deposit")} disabled={limit < 1000}>
                  +1000
                </Button>
                <Button variant="secondary" onClick={() => handleTransact(5000, "deposit")} disabled={limit < 5000}>
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
