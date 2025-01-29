import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../dist/export",
    rollupOptions: {
      preserveEntrySignatures: "strict",
      input: {
        editor: "../template/editor.js",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
