import { useEffect, useRef, useState } from "react";
import { personalDetails, socialLinks } from "@/data/portfolio";
import { SectionTitle } from "@/components/text/SectionTitle";
import { LinkText } from "@/components/ui/LinkText";
import { Magnetic } from "@/components/ui/Magnetic";
import { ResumeButton } from "@/components/ui/ResumeButton";

type Status = "idle" | "copied" | "error";

const MESSAGE: Record<Status, string> = {
  idle: "Click the address to copy it.",
  copied: "Copied to clipboard.",
  error: "Copy failed. Select the address instead.",
};

export function Contact() {
  const email = personalDetails.email;
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y pb-16!">
      <div className="mx-auto max-w-[1600px] page-x">
        <SectionTitle id="contact-title">Contact</SectionTitle>

        {email && (
          <div className="mt-12">
            <Magnetic className="inline-block max-w-full">
              <button
                type="button"
                data-cursor="copy"
                aria-label={`Copy email address ${email}`}
                onClick={copy}
                className="block max-w-full text-left font-display text-[clamp(1.25rem,5.4vw,4.75rem)] leading-tight font-extrabold tracking-tighter break-all transition-colors hover:text-accent-text"
              >
                {email}
              </button>
            </Magnetic>
            <p aria-live="polite" className={status === "error" ? "mt-3 text-alert" : "mt-3 text-muted"}>
              {MESSAGE[status]}
            </p>
          </div>
        )}

        <div className="mt-10">
          <Magnetic className="inline-block">
            <ResumeButton size="lg" />
          </Magnetic>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {email && (
            <li>
              <LinkText href={`mailto:${email}`}>Send an email</LinkText>
            </li>
          )}
          {socialLinks.map((s) => (
            <li key={s.id}>
              <LinkText external href={s.url}>
                {s.platform}
              </LinkText>
            </li>
          ))}
          {personalDetails.website && (
            <li>
              <LinkText external href={personalDetails.website}>
                Website
              </LinkText>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
