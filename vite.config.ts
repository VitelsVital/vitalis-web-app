import { defineConfig, type Plugin } from "vite";
import { resolve } from "path";
import fs from "fs";

const cleanUrlPages: Record<string, string> = {
  "/": "/index.html",
  "/work": "/work/index.html",
  "/about": "/about/index.html",
  "/contact": "/contact/index.html",
  "/archive": "/archive/index.html",
};

function cleanUrlPagesPlugin(): Plugin {
  return {
    name: "clean-url-pages",

    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const pathname = req.url.split("?")[0];

        const page = cleanUrlPages[pathname];

        if (!page) {
          next();
          return;
        }

        const filePath = resolve(process.cwd(), `.${page}`);

        if (!fs.existsSync(filePath)) {
          next();
          return;
        }

        req.url = page;

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [cleanUrlPagesPlugin()],

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
