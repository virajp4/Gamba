import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const LEVEL_MAP = {
  Easy: { count: 3, size: 4 },
  Medium: { count: 2, size: 3 },
  Hard: { count: 1, size: 2 },
  Expert: { count: 1, size: 3 },
  Master: { count: 1, size: 4 },
};

function getRandomIndices(size, count) {
  const indices = [];
  while (indices.length < count) {
    const index = Math.floor(Math.random() * size);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices;
}

function generateTiles(difficulty) {
  const { count, size } = LEVEL_MAP[difficulty];
  let totalTiles = Array.from({ length: size * 9 }, (_, i) => i);
  let correctTiles = [];

  for (let row = 0; row < 9; row++) {
    const rowTiles = totalTiles.slice(row * size, (row + 1) * size);
    const correctIndices = getRandomIndices(size, count);
    const rowCorrectTiles = correctIndices.map((index) => rowTiles[index]);
    correctTiles.push(...rowCorrectTiles);
  }

  return correctTiles.reverse();
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

  const { amount, difficulty, userId } = await request.json();
  const tilesCorrect = generateTiles(difficulty);

  const { data, error: insertError } = await supabase.from("dragonGames").insert([
    {
      amount,
      difficulty,
      dragonUserId: userId,
      tilesCorrect,
    },
  ]).select("dragonId").single();

  if (insertError) {
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }
  return NextResponse.json(data["dragonId"]);
}
