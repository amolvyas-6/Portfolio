import type { PersonalDetails, SocialLink } from "@/data/portfolio";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface ContactSectionProps {
  details: PersonalDetails;
  socialLinks: SocialLink[];
}

export const ContactSection = ({
  details,
  socialLinks,
}: ContactSectionProps) => {
  return (
    <section className="py-20 md:py-28" id="contact">
      <div className="panel relative overflow-hidden p-6 sm:p-8 md:p-10">
        <div className="pointer-events-none absolute -left-12 top-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 right-2 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="space-y-4">
            <p className="eyebrow">Contact</p>
            <h2 className="section-title max-w-[20ch] text-balance">
              Interested in building something together?
            </h2>
            <p className="section-lead max-w-[55ch]">
              If you’re looking for someone who can bridge product clarity with
              technical rigor, I’d love to collaborate.
            </p>
          </div>

          <div className="self-center space-y-3 rounded-[1.75rem] border border-border/70 bg-background/70 p-5 md:p-6">
            <p className="eyebrow">Links</p>

            <div className="space-y-2">
              {details.email && (
                <a
                  href={`mailto:${details.email}`}
                  className="flex min-h-11 items-center justify-between rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-sm text-foreground/84 transition-colors hover:border-accent/45 hover:bg-accent/5 hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {details.email}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Email
                  </span>
                </a>
              )}

              {socialLinks.map((socialLink) => {
                const Icon = socialLink.id === "github" ? FaGithub : FaLinkedin;

                return (
                  <a
                    key={socialLink.id}
                    href={socialLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-between rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-sm text-foreground/84 transition-colors hover:border-accent/45 hover:bg-accent/5 hover:text-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {socialLink.platform}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Open
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
