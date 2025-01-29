import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../dist/exportStep",
    rollupOptions: {
      preserveEntrySignatures: "strict",
      input: {
        config: "../template/config.js",
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
});
