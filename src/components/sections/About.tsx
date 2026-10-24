import { personalDetails } from "@/data/portfolio";
import { ageFrom } from "@/lib/dates";
import { RevealText } from "@/components/text/RevealText";
import { SectionTitle } from "@/components/text/SectionTitle";
import { SkillsMarquee } from "./SkillsMarquee";

export function About() {
  const age = ageFrom(personalDetails.dob);
  return (
    <section id="about" aria-labelledby="about-title" className="section-y">
      <div className="mx-auto max-w-[1600px] page-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionTitle id="about-title" className="lg:col-span-5">
            About
          </SectionTitle>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <RevealText className="prose-w text-lg">{personalDetails.bio}</RevealText>
            <RevealText className="text-muted">
              {`${age} years old, based in ${personalDetails.location}.`}
            </RevealText>
          </div>
        </div>
      </div>
      <div className="mt-16 lg:mt-24">
        <SkillsMarquee />
      </div>
    </section>
  );
}
