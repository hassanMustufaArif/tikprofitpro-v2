import SectionWrapper from "@/components/landing/SectionWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is TikProfitPro?",
    a: "TikProfitPro is a TikTok Shop intelligence tool that tracks 700+ trending products weekly, scores their virality before they peak, matches them with Alibaba suppliers, and calculates your exact profit margin after TikTok fees.",
  },
  {
    q: "How do I find Alibaba suppliers for TikTok Shop products?",
    a: "Click Source on any trending product and TikProfitPro searches Alibaba, AliExpress and Amazon for matching listings, then estimates your margin after TikTok's referral fee and creator commission. Always order a sample and confirm specs with the supplier before buying in bulk.",
  },
  {
    q: "How is TikTok Shop profit margin calculated?",
    a: "Profit = Selling Price minus product cost, shipping, TikTok's referral fee (6% for most US categories, 5% for select jewelry and pre-owned), creator commission and ad cost. In the US, payment processing is included in the referral fee, so there is no separate 2.9% charge. Margin = Profit divided by Selling Price.",
  },
  {
    q: "How much does TikProfitPro cost?",
    a: "TikProfitPro starts at $39/month with a free plan available. The paid plan includes full access to 700+ trending products, virality scores, supplier matching, and profit calculator.",
  },
];

export default function FAQSection() {
  return (
    <SectionWrapper className="pb-16 md:pb-24">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center tracking-tight mb-3">
        Frequently Asked Questions
      </h2>
      <p className="text-center mb-8 md:mb-10 text-sm md:text-base" style={{ color: "#888" }}>
        Everything you need to know about TikProfitPro
      </p>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-white/5 bg-[#111] rounded-2xl px-5 md:px-6 hover:border-[#00ff85]/20 transition-all"
            >
              <AccordionTrigger className="text-sm md:text-base font-semibold text-left hover:no-underline [&>svg]:text-[#00ff85]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionWrapper>
  );
}
