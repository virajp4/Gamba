"use client";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BalanceBox from "./BalanceBox";
import ProfileDrop from "./ProfileDrop";
import LoginDialog from "../dialogs/LoginDialog";
import SignupDialog from "../dialogs/SignupDialog";
import useAuthStore from "../../stores/useAuthStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const isLogin = user !== null;

  return (
    <nav className="max-w-screen-xl mx-auto fixed inset-x-0 top-0 z-50 shadow-sm bg-black h-16 flex justify-center items-center">
      <div className="w-full mx-auto sm:px-8">
        <div className="flex justify-evenly sm:justify-between h-14 items-center">
          <Link className="flex items-center" href="/">
            <MountainIcon className="h-6 w-6 mx-1 sm:mx-0 sm:mr-2" />
            <span className="hidden sm:block">Gamba</span>
          </Link>
          {isLogin && (
            <>
              <BalanceBox />
              <ProfileDrop />
            </>
          )}
          {!isLogin && (
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger
                  className={
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  }
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </DialogTrigger>
                <LoginDialog />
              </Dialog>
              <Dialog>
                <DialogTrigger
                  className={
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
                  }
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </DialogTrigger>
                <SignupDialog />
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
