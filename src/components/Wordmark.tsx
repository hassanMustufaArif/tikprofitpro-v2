/** Brand mark for light surfaces: the icon plus a set wordmark (the SVG logo's text is tuned for dark backgrounds). */
export default function Wordmark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/tikprofitpro_icon.svg" alt="" aria-hidden width={size} height={size} style={{ width: size, height: size }} className="shrink-0" />
      <span className="font-semibold tracking-[-0.02em] text-[#1A2A31]" style={{ fontSize: Math.round(size * 0.64) }}>
        TikProfit<span className="text-[#214F5E]">Pro</span>
      </span>
    </span>
  );
}
