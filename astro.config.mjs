import { defineConfig } from 'astro/config';
import { astroImageTools } from "astro-imagetools";
// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [image({
    serviceEntryPoint: '@astrojs/image/sharp'
  }), astroImageTools],
  output: "server",
  adapter: vercel()
});