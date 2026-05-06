import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import postcssPxtorem from "postcss-pxtorem";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    devSourcemap: true,
    postcss: {
      plugins: mode === "production" ? [autoprefixer(), postcssPxtorem({})] : [],
    },
  },
  optimizeDeps: {
    entries: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es", "umd"],
      name: "DiPlanung Style",
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "bootstrap", "@popperjs/core", "moment", "vue-datepicker-next"],
      output: {
        globals: {
          vue: "Vue",
          bootstrap: "bootstrap",
          "@popperjs/core": "@popperjs/core",
          moment: "moment",
          "vue-datepicker-next": "DatePicker",
        },
      },
    },
  },
  test: {
    root: "",
    coverage: {
      include: ["src"],
      exclude: ["**/*.stories.{js,ts}", "**/index.{ts,js}"],
    },
    globals: true,
    environment: "jsdom",
    resolveSnapshotPath: (testPath, snapExtension) => {
      const transformedPath = testPath
        .replace(/\/components\/.*?\//, "/components/")
        .replace("/src/components/", "/tests/__snapshots__/");

      return transformedPath + snapExtension;
    },
  },
}));
