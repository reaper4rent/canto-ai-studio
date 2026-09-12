import { coverStyle } from "@/lib/covers";

export function Cover({
  id,
  title,
  className = ""
}: {
  id: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={coverStyle(id)}
    >
      <div className="absolute bottom-2 left-2 right-2 text-[10px] font-medium tracking-wide text-white/80 truncate">
        {title}
      </div>
    </div>
  );
}
