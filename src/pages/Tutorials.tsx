import { PlayCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  videoId: string;
}

const tutorials: TutorialVideo[] = [
  {
    id: "getting-started",
    title: "How to Use TikProfitPro",
    description: "Watch how to find winning products in under 2 minutes.",
    videoId: "lWwx4ZflJyU",
  },
];

function TutorialsContent() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-4 text-center">
        <div className="mk-pill"><PlayCircle className="h-3.5 w-3.5" /> Video guides</div>
        <h1 className="text-[34px] md:text-[48px] leading-[1.05] font-semibold tracking-[-0.04em] text-foreground">Tutorials</h1>
        <p className="text-[16px] md:text-[17px] leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          Learn how to get the most out of TikProfitPro with our video guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="rounded-2xl overflow-hidden border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-24px_rgba(16,24,40,0.18)]"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${tutorial.videoId}?rel=0&modestbranding=1`}
                title={tutorial.title}
                className="absolute inset-0 w-full h-full"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="border-t border-border p-5 md:p-6 space-y-1">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">{tutorial.title}</h2>
              <p className="text-sm text-muted-foreground">{tutorial.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground py-4">
        More tutorials coming soon.
      </div>
    </div>
  );
}

export default function Tutorials() {
  const { user } = useAuth();

  if (user) {
    return (
      <Layout>
        <TutorialsContent />
      </Layout>
    );
  }

  return (
    <div className="mk-page min-h-screen flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-28 md:pt-32 pb-20 px-5 md:px-8">
        <TutorialsContent />
      </main>
      <Footer variant="light" />
    </div>
  );
}
