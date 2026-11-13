import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { suppliers } from "@/lib/suppliers-data";
import { safeHref } from "@/lib/safeUrl";

const Suppliers = () => (
  <div className="mk-page min-h-screen">
    <Navbar variant="light" />

    <section className="pt-32 md:pt-36 pb-24 mk-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center mb-14">
        <div className="mk-pill">Sourcing</div>
        <h1 className="mk-h2 mt-6">Where to source</h1>
        <p className="mk-lead mt-5">Popular sourcing marketplaces for TikTok Shop sellers. These are platforms, not vetted suppliers: always check reviews, order a sample and confirm specs before buying in bulk.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((s, i) => (
          <motion.div key={s.name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="mk-card flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(16,24,40,0.05),0_20px_40px_-20px_rgba(16,24,40,0.2)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F5F6] text-[22px]">{s.emoji}</div>
            <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">{s.name}</h3>
            <dl className="mt-4 mb-6 space-y-2 border-t mk-divider pt-4 text-[13px]">
              <div className="flex justify-between gap-4"><dt className="mk-muted">Category</dt><dd className="text-right text-[#2A2C30]">{s.category}</dd></div>
              <div className="flex justify-between gap-4"><dt className="mk-muted">Shipping</dt><dd className="text-right text-[#2A2C30]">{s.shipping}</dd></div>
              <div className="flex justify-between gap-4"><dt className="mk-muted">Min. order</dt><dd className="text-right text-[#2A2C30]">{s.minOrder}</dd></div>
            </dl>
            <a href={safeHref(s.url)} target="_blank" rel="noopener noreferrer"
              className="mt-auto inline-flex h-10 items-center justify-center rounded-full bg-[#F1F1F3] px-4 text-[14px] font-medium text-[#0B0B0C] transition-colors hover:bg-[#E6E6E9]">
              Visit {s.name} →
            </a>
          </motion.div>
        ))}
      </div>
    </section>

    <Footer variant="light" />
  </div>
);

export default Suppliers;
