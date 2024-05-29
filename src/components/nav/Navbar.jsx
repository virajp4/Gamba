import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import BalanceBox from "./BalanceBox";
import ProfileDrop from "./ProfileDrop";

export default function Navbar() {
  const isLogin = true;
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
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline" className="text-black">
                <LogIn />
                Sign in
              </Button>
              <Button size="sm">
                <UserPlus />
                Sign up
              </Button>
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
