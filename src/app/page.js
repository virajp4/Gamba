import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Header from "@/components/home/Header";

export default function Home() {
  return (
    <div className="h-fit">
      <div className="h-64 flex items-center justify-center">
        <div className="md:w-1/2">
          <Header />
        </div>
      </div>

      <div className="flex items-center justify-center flex-wrap">
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
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/casino">Go Big</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className={"h-fit"}>
            <CardHeader className={"flex flex-col gap-1"}>
              <CardTitle>Sports</CardTitle>
              <CardDescription>&quot;Nobody has ever bet enough on a winning horse. Time to change that.&quot;</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The only difference between a winner and a loser is the one who makes sports bets.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/sports">Go Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
