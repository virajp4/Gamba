import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const multipliers = {
  Easy: [1.31, 1.74, 2.32, 3.1, 4.13, 5.51, 7.34, 9.79, 13.05],
  Medium: [1.47, 2.21, 3.31, 4.96, 7.44, 11.16, 16.74, 25.11, 37.67],
  Hard: [1.96, 3.92, 7.84, 15.68, 31.36, 62.72, 125.44, 250.88, 501.76],
  Expert: [2.94, 8.82, 26.46, 79.38, 238.14, 714.42, 2143.26, 6429.78, 19289.34],
  Master: [3.92, 15.68, 62.72, 250.88, 1003.52, 4014.08, 16056.32, 64225.28, 256901.12],
};

function calculateMultiplier(difficulty, currentRound, betAmount) {
  const multiplier = multipliers[difficulty][currentRound];
  const winAmount = betAmount * multiplier;
  return {
    multiplier,
    winAmount,
  };
}

export async function GET(request, { params }) {
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

  const dragonId = params.dragonId;
  const { data, error: dragonError } = await supabase
    .from("dragonGames")
    .select("payout, tilesCorrect")
    .eq("dragonId", dragonId)
    .single();
  if (dragonError) {
    return NextResponse.json({ message: dragonError.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request, { params }) {
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

  const dragonId = params.dragonId;
  const { value, currentRound, playedRounds } = await request.json();

  const { data: dragonData, error: insertError } = await supabase
    .from("dragonGames")
    .update({ currentRound, playedRounds })
    .select("amount, difficulty, tilesCorrect")
    .eq("dragonId", dragonId)
    .single();

  if (insertError) {
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }

  const { amount, difficulty, tilesCorrect } = dragonData;

  if (tilesCorrect.includes(value)) {
    const { multiplier, winAmount } = calculateMultiplier(difficulty, currentRound, amount);
    const { error } = await supabase.from("dragonGames").update({ currentRound, payout: winAmount }).eq("dragonId", dragonId);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ payoutMultiplier: multiplier, payout: winAmount, tilesCorrect: [...playedRounds, value] });
  } else {
    const { error } = await supabase.from("dragonGames").update({ payout: 0 }).eq("dragonId", dragonId);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ payoutMultiplier: 0, payout: 0, tilesCorrect });
  }
}
