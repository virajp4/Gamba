import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const calculateMultiplier = (minesCount, diamonds, betAmount) => {
  const n = 25;
  const x = 25 - minesCount;

  const factorial = (number) => {
    let value = number;
    for (let i = number; i > 1; i--) {
      value *= i - 1;
    }
    return value;
  };

  const combination = (n, d) => {
    if (n === d) return 1;
    return factorial(n) / (factorial(d) * factorial(n - d));
  };

  const first = combination(n, diamonds);
  const second = combination(x, diamonds);
  let result = 0.99 * (first / second);
  result = Math.round(result * 100) / 100;

  let win = betAmount * result;
  win = Math.round(win * 100000000) / 100000000;

  return {
    multiplier: result,
    winAmount: win,
  };
};

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

  const minesId = params.minesId;
  const { data, error: minesError } = await supabase.from("mineGames").select("mines, rounds, payout").eq("minesId", minesId).single();
  if (minesError) {
    return NextResponse.json({ message: minesError.message }, { status: 500 });
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

  const minesId = params.minesId;
  const { amount, minesCount, value } = await request.json();

  const { data, error: minesError } = await supabase.from("mineGames").select("mines, rounds").eq("minesId", minesId).single();
  if (minesError) {
    return NextResponse.json({ message: minesError.message }, { status: 500 });
  }
  const mines = data.mines;
  const rounds = data.rounds;
  
  if (mines.includes(value)) {
    const { error } = await supabase
      .from("mineGames")
      .update({ rounds: [...rounds, value], payout: 0 })
      .eq("minesId", minesId);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ payoutMultiplier: 0, payout:0, mines, rounds: [...rounds, value] });
  } else {
    const diamonds = rounds.length + 1;
    const { multiplier, winAmount } = calculateMultiplier(minesCount, diamonds, amount);
    const { error } = await supabase
      .from("mineGames")
      .update({ rounds: [...rounds, value], payout: winAmount})
      .eq("minesId", minesId);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({
      payoutMultiplier: multiplier,
      payout: winAmount,
      rounds: [...rounds, value],
      mines: [],
    });
  }
}
