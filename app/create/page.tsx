"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CreateStudio } from "@/components/CreateStudio";

function CreateInner() {
  const params = useSearchParams();
  const style = params.get("style") || "";
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return <CreateStudio preset={style ? { style } : undefined} />;
}

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreateInner />
    </Suspense>
  );
}
