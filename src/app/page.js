import { MoveRight } from "lucide-react";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import VipDialog from "@/components/dialogs/VipDialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="h-64 flex items-center justify-center">
        <div className="md:w-1/2">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold">Welcome back, Choges</h1>
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
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="h-80 sm:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className={"h-fit"}>
            <CardHeader className={"flex flex-col gap-1"}>
              <CardTitle>Casino</CardTitle>
              <CardDescription>"The gambler who expects to lose is the happiest person at the track. Think about it."</CardDescription>
            </CardHeader>
            <CardContent>
              <p>"If anybody ever gives you 10,000-1 odds on anything you take it.</p>
              <p>If John Cougar Mellencamp ever wins an Oscar I'm gonna be a very rich dude."</p>
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
              <CardDescription>"Nobody has ever bet enough on a winning horse. Time to change that."</CardDescription>
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
