export type SongStatus = "ready" | "generating" | "failed";

export type Song = {
  id: string;
  title: string;
  prompt: string;
  style: string;
  lyrics: string;
  instrumental: boolean;
  audioUrl: string;
  duration: number;
  seed: number;
  model: string;
  demo: boolean;
  liked: boolean;
  createdAt: number;
  parentId?: string;
  action?: "create" | "extend" | "remix" | "cover";
  status: SongStatus;
};

export type GenerateInput = {
  mode: "simple" | "custom";
  prompt: string;
  style: string;
  lyrics: string;
  instrumental: boolean;
  duration: number;
  weirdness: number;
  parentId?: string;
  action?: "create" | "extend" | "remix" | "cover";
  falKey?: string;
};
