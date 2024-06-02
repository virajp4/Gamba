import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GameCards({ title, description, link }) {
  return (
    <Card className={"lg:hover:translate-y-5 md:hover:translate-y-3 sm:hover:translate-y-1.5 transition-all duration-150 cursor-pointer"}>
      <Link href={link}>
        <CardHeader className={"p-3 pt-4 pb-1 text-center"}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className={"flex items-center justify-center pb-2 px-3"}>
          <Button variant="link">
            Play {title}
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
