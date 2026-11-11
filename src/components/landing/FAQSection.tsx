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
    a: "TikProfitPro is a TikTok Shop research tool that tracks trending products, scores their virality, searches Alibaba and AliExpress for similar supplier listings, and calculates your profit margin after TikTok fees.",
  },
  {
    q: "How do I find Alibaba suppliers for TikTok Shop products?",
    a: "Click Suppliers on any trending product and TikProfitPro shows the top 3 Alibaba or AliExpress search results for it (Amazon is in beta), then estimates your margin after TikTok's referral fee and creator commission. Check each listing, order a sample and confirm specs with the supplier before buying in bulk.",
  },
  {
    q: "How is TikTok Shop profit margin calculated?",
    a: "Profit = Selling Price minus product cost, shipping, TikTok's referral fee (6% for most US categories, 5% for select jewelry and pre-owned), creator commission and ad cost. In the US, payment processing is included in the referral fee, so there is no separate 2.9% charge. Margin = Profit divided by Selling Price.",
  },
  {
    q: "How much does TikProfitPro cost?",
    a: "TikProfitPro has a free plan (top 10 products and 5 sourcing credits a month). Pro is $39/month and includes the full list of trending products, product search, 50 sourcing credits a month and the profit calculator.",
  },
];

export default function FAQSection() {
  return (
    <SectionWrapper className="!max-w-[1200px] !px-5 md:!px-8 pb-20 md:pb-28">
      <div className="grid gap-10 md:grid-cols-[1fr,1.6fr]">
      <div>
        <h2 className="mk-h2">Questions, answered</h2>
        <p className="mk-lead mt-4">Can't find your answer? The tutorials walk through every feature.</p>
      </div>
      <div>
        <Accordion type="single" collapsible className="divide-y divide-[#ECECEE] border-y border-[#ECECEE]">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-0"
            >
              <AccordionTrigger className="py-5 text-[15px] md:text-[16px] font-medium text-left text-[#0B0B0C] hover:no-underline [&>svg]:text-[#6B6F76]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed pb-5" style={{ color: "#55595F" }}>
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
