import { useCallback, useState } from "react";
import { Cursor } from "@/components/chrome/Cursor";
import { Header } from "@/components/chrome/Header";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { ThemeProvider } from "@/components/chrome/ThemeProvider";
import { Loader } from "@/components/loader/Loader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { FlipScene } from "@/components/sections/FlipScene";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { ScrollTrigger } from "@/lib/gsap";
import { willPlayIntro } from "@/lib/scroll";

export default function App() {
  const [ready, setReady] = useState(!willPlayIntro);
  const [loading, setLoading] = useState(willPlayIntro);

  const onDone = useCallback(() => {
    setLoading(false);
    ScrollTrigger.refresh();
  }, []);
  const onReveal = useCallback(() => setReady(true), []);

  return (
    <ThemeProvider>
      <SmoothScroll />
      <a
        href="#main"
        className="fixed top-2 left-2 z-[120] -translate-y-20 rounded-full bg-accent px-4 py-2 text-accent-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <ScrollProgress />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero ready={ready} />
        <About />
        <Experience />
        <FlipScene>
          <Work />
          <Contact />
          <Footer />
        </FlipScene>
      </main>
      <Cursor />
      {loading && <Loader onReveal={onReveal} onDone={onDone} />}
    </ThemeProvider>
  );
}
