import { defineConfig } from 'astro/config';
import { astroImageTools } from "astro-imagetools";
// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [image({
    serviceEntryPoint: '@astrojs/image/sharp'
  }), astroImageTools, react(), compress()],
  output: "server",
  adapter: netlify()
});