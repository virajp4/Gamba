import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function generateMines(minesCount) {
  const mines = [];
  for (let i = 0; i < minesCount; i++) {
    let num = Math.floor(Math.random() * 25) + 1;
    if (mines.includes(num)) {
      i--;
      continue;
    }
    mines.push(num);
  }
  return mines;
}

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

  const { amount, minesCount, userId } = await request.json();
  const mines = generateMines(minesCount);

  try {
    const { data } = await supabase
      .from("mineGames")
      .insert([{ amount, minesCount, minesUserId: userId, mines }])
      .select("*")
      .single();
    return NextResponse.json(data["minesId"]);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
