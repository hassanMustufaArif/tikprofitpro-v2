import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { suppliers } from "@/lib/suppliers-data";
import { safeHref } from "@/lib/safeUrl";

const Suppliers = () => (
  <div className="min-h-screen" style={{ background: "#080808", color: "#e8e8e8" }}>
    <Navbar />

    <section className="pt-32 pb-24 max-w-5xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Where to Source</h1>
        <p style={{ color: "#888" }}>Popular sourcing marketplaces for TikTok Shop sellers. These are platforms, not vetted suppliers: always check reviews, order a sample and confirm specs before buying in bulk.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((s, i) => (
          <motion.div key={s.name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl border border-white/5 bg-[#111] hover:border-[#00ff85]/20 transition-all">
            <div className="text-3xl mb-3">{s.emoji}</div>
            <h3 className="font-bold text-lg mb-1">{s.name}</h3>
            <div className="space-y-1 mb-4">
              <p className="text-xs" style={{ color: "#888" }}>Category: {s.category}</p>
              <p className="text-xs" style={{ color: "#888" }}>Shipping: {s.shipping}</p>
              <p className="text-xs" style={{ color: "#888" }}>Min Order: {s.minOrder}</p>
            </div>
            <a href={safeHref(s.url)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline" style={{ color: "#00ff85" }}>
              Visit {s.name} →
            </a>
          </motion.div>
        ))}
      </div>
    </section>

    <Footer />
  </div>
);

export default Suppliers;
