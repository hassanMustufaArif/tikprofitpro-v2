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
    <SectionWrapper className="pb-20 md:pb-28">
      <div className="grid gap-10 md:grid-cols-[1fr,1.6fr]">
      <div>
        <p className="mk-eyebrow mb-3">FAQ</p>
        <h2 className="mk-h2">Questions, answered.</h2>
      </div>
      <div>
        <Accordion type="single" collapsible className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-0"
            >
              <AccordionTrigger className="py-5 text-[15px] md:text-[16px] font-medium text-left text-[#EDEEF0] hover:no-underline [&>svg]:text-[#8A9099]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed pb-5" style={{ color: "#9BA1AB" }}>
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      </div>
    </SectionWrapper>
  );
}
