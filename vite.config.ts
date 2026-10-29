import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { seo } from "./plugins/seo";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  // Served from the root of the custom domain (amolvyas.is-a.dev).
  base: "/",
});
