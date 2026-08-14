import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  css: {
    devSourcemap: true,
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        work: resolve(process.cwd(), "work/index.html"),
        about: resolve(process.cwd(), "about/index.html"),
        contact: resolve(process.cwd(), "contact/index.html"),
        archive: resolve(process.cwd(), "archive/index.html"),
      },
    },
  },
});
