import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../generated",
    rollupOptions: {
      preserveEntrySignatures: "strict",
      input: {
        domside: "../template/domside.js",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
