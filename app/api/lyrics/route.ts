import { NextRequest, NextResponse } from "next/server";
import { inventLyrics } from "@/lib/lyrics";

export async function POST(req: NextRequest) {
  const { prompt, style } = (await req.json()) as { prompt?: string; style?: string };
  return NextResponse.json({ lyrics: inventLyrics(prompt || "untitled night", style || "indie") });
}
