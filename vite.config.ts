import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { personalDetails, socialLinks } from "./src/data/portfolio";

const siteUrl = personalDetails.website ?? "";

const htmlMeta = (): Plugin => ({
  name: "html-meta-from-data",
  transformIndexHtml: {
    order: "pre",
    handler(html) {
      const description = `${personalDetails.headline}. Based in ${personalDetails.location}.`;
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: personalDetails.name,
        jobTitle: personalDetails.role,
        url: siteUrl,
        address: personalDetails.location,
        sameAs: socialLinks.map((s) => s.url),
      };
      const values: Record<string, string> = {
        TITLE: `${personalDetails.name} | ${personalDetails.role}`,
        DESCRIPTION: description,
        SITE_URL: siteUrl,
        JSON_LD: JSON.stringify(jsonLd),
      };
      return html.replace(/%([A-Z_]+)%/g, (m, key: string) => values[key] ?? m);
    },
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), htmlMeta()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  // Relative base works for both the GitHub Pages sub-path and a custom domain.
  base: "./",
});
