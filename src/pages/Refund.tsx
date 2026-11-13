import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Refund = () => (
  <div className="mk-page min-h-screen">
    <Navbar variant="light" />
    <section className="pt-32 md:pt-36 pb-24 max-w-[720px] mx-auto px-5 md:px-8">
      <div className="mk-pill">Legal</div>
      <h1 className="mk-h2 mt-6 mb-10">Refund Policy</h1>
      <div className="space-y-5 text-[15px] leading-relaxed text-[#55595F]">
        <p><strong className="font-medium text-[#0B0B0C]">Last updated:</strong> February 26, 2026</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">7-Day Money Back Guarantee</h2>
        <p>We offer a full refund within <strong className="font-medium text-[#0B0B0C]">7 days</strong> of your initial subscription purchase. If you're not satisfied with TikProfitPro for any reason, contact us within 7 days and we'll process a complete refund — no questions asked.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">How to Request a Refund</h2>
        <p>Email <a href="mailto:support@tikprofitpro.shop" className="font-medium text-[#0B0B0C] underline underline-offset-4">support@tikprofitpro.shop</a> with your account email and the reason for your refund request. Refunds are typically processed within 3–5 business days.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">After 7 Days</h2>
        <p>After the 7-day window, refunds are not available. However, you can <strong className="font-medium text-[#0B0B0C]">cancel your subscription at any time</strong> and retain access to paid features until the end of your current billing period. No further charges will occur after cancellation.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">Exceptions</h2>
        <p>If you experience a technical issue that prevents you from using the Service, we may offer a prorated refund or credit at our discretion, regardless of the 7-day window.</p>

        <p className="pt-4">Questions? Reach out at <a href="mailto:support@tikprofitpro.shop" className="font-medium text-[#0B0B0C] underline underline-offset-4">support@tikprofitpro.shop</a>.</p>
      </div>
    </section>
    <Footer variant="light" />
  </div>
);

export default Refund;
