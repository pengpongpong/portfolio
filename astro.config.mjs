import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import aws from "astro-sst";
import sitemap from "@astrojs/sitemap";

const {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  SANITY_API_VERSION,
  DOMAIN
} = loadEnv(process.env.NODE_ENV, process.cwd(), "");

const sanityConfig = {
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true
};


// https://astro.build/config
export default defineConfig({
  integrations: [react(), sanity(sanityConfig), sitemap({
    changefreq: "yearly",
    lastmod: new Date()
  })],
  site: DOMAIN,
  output: "server",
  adapter: aws(),
});