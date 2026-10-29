import type { Plugin } from "vite";
import { keySkills, personalDetails, socialLinks } from "../src/data/portfolio";

const OG_IMAGE = { path: "og.png", width: 2113, height: 1135 };

/** Injects SEO tags into index.html and emits sitemap.xml, robots.txt and CNAME from portfolio data. */
export function seo(): Plugin {
  const origin = (personalDetails.website ?? "").replace(/\/+$/, "");
  const siteUrl = `${origin}/`;
  const title = `${personalDetails.name} | ${personalDetails.role}`;
  const description = `${personalDetails.headline}. Based in ${personalDetails.location}.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: personalDetails.name,
        description,
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}#person`,
        name: personalDetails.name,
        jobTitle: personalDetails.role,
        url: siteUrl,
        image: `${siteUrl}${OG_IMAGE.path}`,
        email: personalDetails.email ? `mailto:${personalDetails.email}` : undefined,
        address: personalDetails.location,
        knowsAbout: keySkills.map((s) => s.name),
        sameAs: socialLinks.map((s) => s.url),
      },
    ],
  };

  const values: Record<string, string> = {
    TITLE: title,
    DESCRIPTION: description,
    AUTHOR: personalDetails.name,
    SITE_URL: siteUrl,
    OG_IMAGE: `${siteUrl}${OG_IMAGE.path}`,
    OG_IMAGE_WIDTH: String(OG_IMAGE.width),
    OG_IMAGE_HEIGHT: String(OG_IMAGE.height),
    OG_IMAGE_ALT: `${personalDetails.name}, ${personalDetails.role}`,
    JSON_LD: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
    NOSCRIPT: [
      `<h1>${personalDetails.name}</h1>`,
      `<p>${description}</p>`,
      `<ul>${[
        ...(personalDetails.email ? [`<li><a href="mailto:${personalDetails.email}">Email</a></li>`] : []),
        ...socialLinks.map((s) => `<li><a href="${s.url}">${s.platform}</a></li>`),
      ].join("")}</ul>`,
    ].join(""),
  };

  return {
    name: "portfolio-seo",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replace(/%([A-Z_]+)%/g, (m, key: string) => values[key] ?? m),
    },
    generateBundle() {
      const emit = (fileName: string, source: string) => this.emitFile({ type: "asset", fileName, source });
      emit(
        "sitemap.xml",
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>\n</urlset>\n`,
      );
      emit("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
      emit("CNAME", `${new URL(siteUrl).hostname}\n`);
    },
  };
}
