import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Terms = () => (
  <div className="mk-page min-h-screen">
    <Navbar variant="light" />
    <section className="pt-32 md:pt-36 pb-24 max-w-[720px] mx-auto px-5 md:px-8">
      <div className="mk-pill">Legal</div>
      <h1 className="mk-h2 mt-6 mb-10">Terms of Service</h1>
      <div className="space-y-5 text-[15px] leading-relaxed text-[#55595F]">
        <p><strong className="font-medium text-[#0B0B0C]">Last updated:</strong> February 26, 2026</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">1. Acceptance of Terms</h2>
        <p>By accessing or using TikProfitPro ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">2. Service Description</h2>
        <p>TikProfitPro is a TikTok Shop product research tool that provides trending product data, virality scores, profit calculators, and supplier matching to help e-commerce sellers identify profitable products.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">3. Accounts</h2>
        <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity under your account.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">4. Payments & Billing</h2>
        <p>Paid subscriptions are processed through LemonSqueezy. By subscribing, you authorize recurring charges at the selected plan rate. You may cancel your subscription at any time, and access will continue until the end of the current billing period.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">5. Cancellation</h2>
        <p>You may cancel your subscription at any time. Upon cancellation, you retain access to paid features until the end of your current billing cycle. No partial refunds are issued for unused time except as described in our Refund Policy.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">6. Intellectual Property</h2>
        <p>All content, data, branding, and software on TikProfitPro are owned by TikProfitPro or its licensors. You may not reproduce, distribute, or create derivative works without written permission.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">7. Limitation of Liability</h2>
        <p>TikProfitPro is provided "as is." We do not guarantee specific sales outcomes or product performance. In no event shall TikProfitPro be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">8. Governing Law</h2>
        <p>These terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of Delaware.</p>

        <h2 className="pt-6 text-[19px] font-semibold tracking-[-0.02em] text-[#0B0B0C]">9. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>

        <p className="pt-4">For questions, contact <a href="mailto:support@tikprofitpro.shop" className="font-medium text-[#0B0B0C] underline underline-offset-4">support@tikprofitpro.shop</a>.</p>
      </div>
    </section>
    <Footer variant="light" />
  </div>
);

export default Terms;
