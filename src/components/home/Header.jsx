"use client";
import { MoveRight, LogIn, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import VipDialog from "@/components/dialogs/VipDialog";
import { Button } from "@/components/ui/button";
import LoginDialog from "../dialogs/LoginDialog";
import SignupDialog from "../dialogs/SignupDialog";

import useAuthStore from "@/stores/useAuthStore";

export default function Header() {
  const [user, setUser] = useState(null);
  const data = useAuthStore((state) => state.user);

  useEffect(() => {
    if (data) {
      setUser(data.user_metadata.username);
    } else {
      setUser(null);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      {user && (
        <>
          <h1 className="text-2xl font-bold">Welcome back, {user}</h1>
          <Dialog>
            <div className="flex items-center justify-between gap-2">
              <DialogTrigger className={"flex items-center justify-start gap-2 hover:translate-x-3 transition-all ease-in-out group"}>
                <p className="text-sm sm:text-md">View VIP Progress</p>
                <MoveRight className="opacity-75 group-hover:opacity-100 scale-75 sm:scale-100" />
              </DialogTrigger>
              <span>69.46%</span>
            </div>
            <VipDialog />
          </Dialog>
          <Progress value={69.46} />
        </>
      )}
      {!user && (
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
