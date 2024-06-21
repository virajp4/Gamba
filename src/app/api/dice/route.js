import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

import { createDiceGame } from "@/lib/db";

export async function POST(request) {
  const authHeader = await request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let { amount, payoutMultiplier, target, condition, userId } = await request.json();

  try {
    const result = (Math.random() * 100).toFixed(2);
    await createDiceGame(userId, amount, payoutMultiplier, target, condition, result);

    let isWin = false;

    if (condition === "Over" && result >= target) isWin = true;
    else if (condition === "Under" && result <= target) isWin = true;

    return NextResponse.json({ result, isWin });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
