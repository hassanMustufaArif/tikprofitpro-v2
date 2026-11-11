import SectionWrapper from "@/components/landing/SectionWrapper";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";

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
    <SectionWrapper id="faq" className="!max-w-[1200px] !px-5 md:!px-8 pb-20 md:pb-28">
      <div className="grid gap-10 md:grid-cols-[1fr,1.5fr] md:gap-16">
        <div>
          <h2 className="mk-h2">Good questions,<br /><span className="mk-soft-line">answered.</span></h2>
          <p className="mk-lead mt-5 max-w-sm">Can't find your answer? The tutorials walk through every feature.</p>
        </div>
        <Accordion type="single" collapsible className="border-t border-[#E6E1D7]">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-[#E6E1D7]">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-6 py-5 text-left text-[15px] md:text-[16px] font-medium text-[#1A2A31] transition-colors hover:text-[#214F5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#214F5E] focus-visible:ring-offset-2 rounded-sm">
                  {faq.q}
                  <Plus className="h-4 w-4 shrink-0 text-[#5B6A70] transition-transform duration-200 group-data-[state=open]:rotate-45" aria-hidden />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="max-w-[60ch] pb-5 text-[15px] leading-relaxed text-[#4A5A61]">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionWrapper>
  );
}
