import { STAGES, STAGE_COLORS, type Stage } from "@/components/landing/StageBadge";
import { normalizeStage } from "@/lib/productFormat";

/**
 * App-wide stage pill. Uses the landing page's StageBadge colours for the four life-cycle stages
 * (emerging green, rising blue, peaking orange, saturated grey), so the app and the marketing
 * page speak the same language. Stored v1 values go through normalizeStage (hot→emerging,
 * pass→saturated); "watch" (peaking or unknown, can't tell) keeps its own label in peaking orange.
 */
type Look = { label: string; text: string; bg: string; dot: string };
const fromLanding = (s: Stage, label?: string): Look => ({ label: label ?? STAGES[s].label, text: STAGES[s].text, bg: STAGES[s].bg, dot: STAGE_COLORS[s] });

export const STAGE_LOOK: Record<string, Look> = {
  emerging: fromLanding("emerging"),
  rising: fromLanding("rising"),
  peaking: fromLanding("peaking"),
  saturated: fromLanding("saturated"),
  watch: fromLanding("peaking", "Watch"),
  stable: fromLanding("saturated", "Stable"),
  unknown: fromLanding("saturated", "New data"),
};

export const stageLabel = (key: string) => (STAGE_LOOK[key] ?? STAGE_LOOK.unknown).label;

export default function StagePill({ phase }: { phase?: string }) {
  const s = STAGE_LOOK[normalizeStage(phase)] ?? STAGE_LOOK.unknown;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium whitespace-nowrap" style={{ color: s.text, background: s.bg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}
