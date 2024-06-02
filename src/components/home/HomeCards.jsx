"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomeCards() {
  const user = useAuthStore((state) => state.user);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(user ? true : false);
  }, [user]);

  return (
    <div className="sm:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card className={"h-fit"}>
        <CardHeader className={"flex flex-col gap-1"}>
          <CardTitle>Casino</CardTitle>
          <CardDescription>&quot;The gambler who expects to lose is the happiest person at the track. Think about it.&quot;</CardDescription>
        </CardHeader>
        <CardContent>
          <p>&quot;If anybody ever gives you 10,000-1 odds on anything you take it.</p>
          <p>If John Cougar Mellencamp ever wins an Oscar I&apos;m gonna be a very rich dude.&quot;</p>
          <p className="mt-2">- Kevin from the Office</p>
        </CardContent>
        {isAuth && (
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/casino">Go Big</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
      <Card className={"h-fit"}>
        <CardHeader className={"flex flex-col gap-1"}>
          <CardTitle>Sports</CardTitle>
          <CardDescription>&quot;Nobody has ever bet enough on a winning horse. Time to change that.&quot;</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The only difference between a winner and a loser is the one who makes sports bets.</p>
        </CardContent>
        {isAuth && (
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/sports">Go Home</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
