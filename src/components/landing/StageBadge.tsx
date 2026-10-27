export type Stage = "emerging" | "rising" | "peaking" | "saturated";

export const STAGE_COLORS: Record<Stage, string> = {
  emerging: "#12B76A",
  rising: "#2E90FA",
  peaking: "#F79009",
  saturated: "#98A2B3",
};

const STAGES: Record<Stage, { label: string; text: string; bg: string }> = {
  emerging:  { label: "Emerging",  text: "#067647", bg: "#ECFDF3" },
  rising:    { label: "Rising",    text: "#175CD3", bg: "#EFF8FF" },
  peaking:   { label: "Peaking",   text: "#B54708", bg: "#FFFAEB" },
  saturated: { label: "Saturated", text: "#475467", bg: "#F2F4F7" },
};

export default function StageBadge({ stage }: { stage: Stage }) {
  const s = STAGES[stage];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ color: s.text, background: s.bg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
      {s.label}
    </span>
  );
}
