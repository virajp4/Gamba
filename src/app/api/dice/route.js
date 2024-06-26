import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    const { error } = await supabase
      .from("diceGames")
      .insert({ diceUserId: userId, amount, payoutMultiplier, target, condition, result })
      .select("result")
      .single();

    if (error) {
      console.error("Error creating dice game", error);
    }

    let isWin = false;

    if (condition === "Over" && result >= target) isWin = true;
    else if (condition === "Under" && result <= target) isWin = true;

    return NextResponse.json({ result, isWin });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
