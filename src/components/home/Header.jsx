"use client";
import { useState, useEffect } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import useAuthStore from "@/stores/useAuthStore";
import LoginDialog from "../dialogs/LoginDialog";
import SignupDialog from "../dialogs/SignupDialog";
import VipProgressBar from "./VipProgressBar";

export default function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [user]);

  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        user ? (
          <>
            <Skeleton className="h-9 w-64 rounded-md" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full rounded-xl" />
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center gap-2">
              <Skeleton className="h-7 w-52 rounded-md" />
              <Skeleton className="h-4 w-56 rounded-md" />
            </div>
            <div className="flex gap-3 justify-center items-center">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </>
        )
      ) : user ? (
        <VipProgressBar user={user} />
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-center">Welcome to Gamba</h1>
            <p className="text-sm text-zinc-400 text-center">Experience the thrill, skip the losses.</p>
          </div>
          <div className="flex gap-3 justify-center items-center">
            <Dialog>
              <DialogTrigger
                className={
                  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                }
              >
                Login
              </DialogTrigger>
              <LoginDialog />
            </Dialog>
            <Dialog>
              <DialogTrigger
                className={
                  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                }
              >
                Sign up
              </DialogTrigger>
              <SignupDialog />
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
}
