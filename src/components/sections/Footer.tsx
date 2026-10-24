import { personalDetails } from "@/data/portfolio";
import { useClock } from "@/hooks/useClock";
import { scrollToId } from "@/lib/scroll";
import { AsciiWordmark } from "@/components/ascii/AsciiWordmark";

const city = personalDetails.location.split(",")[0];

export function Footer() {
  const time = useClock("Asia/Kolkata");
  return (
    <footer className="mx-auto max-w-[1600px] page-x pb-10">
      <AsciiWordmark />
      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-rule pt-6 text-muted">
        <p>{`© ${new Date().getFullYear()} ${personalDetails.name}`}</p>
        <p>
          {city} <span className="tabular-nums">{time}</span> IST
        </p>
        <button
          type="button"
          data-cursor="top"
          onClick={() => scrollToId("top")}
          className="link-underline py-2 text-ink"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
