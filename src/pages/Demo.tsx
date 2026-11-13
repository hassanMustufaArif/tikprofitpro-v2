import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const DEMO_VIDEO_ID = "lWwx4ZflJyU";

export default function Demo() {
  return (
    <div className="mk-page min-h-screen flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-32 md:pt-36 pb-24 px-5 md:px-8">
        <div className="max-w-[920px] mx-auto space-y-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mk-pill">Product demo</div>
            <h1 className="mk-h2 mt-6">See TikProfitPro in action</h1>
            <p className="mk-lead mt-5">
              A short product walkthrough: how to spot winning TikTok Shop products,
              check virality scores, match suppliers and work out real profit.
            </p>
          </div>

          <div
            className="rounded-[28px] overflow-hidden border border-[#E9E9EC] bg-[#F5F5F6] p-2 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_32px_64px_-32px_rgba(16,24,40,0.25)]"
          >
            <div className="relative w-full overflow-hidden rounded-[22px]" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?rel=0&modestbranding=1`}
                title="TikProfitPro product demo"
                className="absolute inset-0 w-full h-full"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="mk-btn-primary"
            >
              Start for Free
            </Link>
            <Link
              to="/tutorials"
              className="mk-btn-secondary"
            >
              Browse Tutorials
            </Link>
          </div>
        </div>
      </main>
      <Footer variant="light" />
    </div>
  );
}
