export type Stage = "emerging" | "rising" | "peaking" | "saturated";

const STAGES: Record<Stage, { label: string; dot: string; text: string; bg: string }> = {
  emerging:  { label: "Emerging",  dot: "#00E676", text: "#5BF0A6", bg: "rgba(0,230,118,0.10)" },
  rising:    { label: "Rising",    dot: "#3B9EFF", text: "#7DBEFF", bg: "rgba(59,158,255,0.10)" },
  peaking:   { label: "Peaking",   dot: "#FFB224", text: "#FFC864", bg: "rgba(255,178,36,0.10)" },
  saturated: { label: "Saturated", dot: "#8A9099", text: "#A6ACB5", bg: "rgba(138,144,153,0.12)" },
};

export default function StageBadge({ stage }: { stage: Stage }) {
  const s = STAGES[stage];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ color: s.text, background: s.bg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}
