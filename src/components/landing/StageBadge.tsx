export type Stage = "emerging" | "rising" | "peaking" | "saturated";

export const STAGE_COLORS: Record<Stage, string> = {
  emerging: "#2F8F62",
  rising: "#2D6C8F",
  peaking: "#C27A1A",
  saturated: "#94A0A5",
};

const STAGES: Record<Stage, { label: string; text: string; bg: string }> = {
  emerging:  { label: "Emerging",  text: "#1C6B47", bg: "#E6F2EB" },
  rising:    { label: "Rising",    text: "#1F5675", bg: "#E8F1F6" },
  peaking:   { label: "Peaking",   text: "#8A520C", bg: "#FBF1DF" },
  saturated: { label: "Saturated", text: "#4F5D63", bg: "#F0EDE6" },
};

export default function StageBadge({ stage }: { stage: Stage }) {
  const s = STAGES[stage];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium" style={{ color: s.text, background: s.bg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
      {s.label}
    </span>
  );
}
