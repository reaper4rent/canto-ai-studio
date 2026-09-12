import { NextRequest, NextResponse } from "next/server";
import { pickDemoTrack } from "@/lib/demo-audio";
import { inventLyrics, inventTitle } from "@/lib/lyrics";

export const runtime = "nodejs";
export const maxDuration = 60;

async function falGenerate(opts: { key: string; tags: string; lyrics: string; duration: number; seed?: number }) {
  const res = await fetch("https://fal.run/fal-ai/ace-step", {
    method: "POST",
    headers: { Authorization: `Key ${opts.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      tags: opts.tags,
      lyrics: opts.lyrics,
      duration: Math.max(15, Math.min(180, opts.duration)),
      number_of_steps: 27,
      seed: opts.seed
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal.ai ${res.status}: ${text.slice(0, 280)}`);
  }
  const json = await res.json();
  return { audioUrl: json.audio?.url as string, seed: (json.seed as number) ?? opts.seed ?? 0 };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const falKey = req.headers.get("x-fal-key")?.trim() || process.env.FAL_KEY || "";
  const prompt = (body.prompt || "").trim();
  const style = (body.style || "").trim() || (body.mode === "simple" ? prompt : "indie pop, warm vocal, live drums");
  const instrumental = Boolean(body.instrumental);
  const duration = Number(body.duration || 60);
  const action = body.action || "create";
  const takes = Math.min(2, Math.max(1, body.takes || 2));
  let lyrics = (body.lyrics || "").trim();
  if (instrumental) lyrics = "[inst]";
  else if (!lyrics) lyrics = inventLyrics(prompt || style, style);
  const titleBase = inventTitle(prompt || lyrics.slice(0, 40), style);
  const songs = [];
  for (let i = 0; i < takes; i++) {
    const id = crypto.randomUUID();
    const title = takes === 2 ? `${titleBase} ${i === 0 ? "A" : "B"}` : titleBase;
    if (falKey) {
      try {
        const out = await falGenerate({
          key: falKey, tags: style, lyrics, duration,
          seed: Math.floor(Math.random() * 1_000_000_000)
        });
        songs.push({ id, title, prompt, style, lyrics: instrumental ? "" : lyrics, instrumental, audioUrl: out.audioUrl, duration, seed: out.seed, model: "ACE-Step (fal.ai)", demo: false, liked: false, createdAt: Date.now() + i, parentId: body.parentId, action, status: "ready" });
        continue;
      } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Generation failed" }, { status: 502 });
      }
    }
    const demo = pickDemoTrack(`${style} ${prompt}`, i);
    songs.push({ id, title, prompt, style, lyrics: instrumental ? "" : lyrics, instrumental, audioUrl: demo.url, duration: demo.duration, seed: Math.floor(Math.random() * 99999), model: "demo preview", demo: true, liked: false, createdAt: Date.now() + i, parentId: body.parentId, action, status: "ready" });
  }
  return NextResponse.json({ songs, engine: falKey ? "ace-step" : "demo" });
}
