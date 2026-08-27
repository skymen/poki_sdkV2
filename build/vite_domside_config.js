import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../generated",
    rollupOptions: {
      preserveEntrySignatures: false,
      input: {
        domside: "../template/domside.js",
      },
      output: {
        entryFileNames: "[name].js",
        // C3 loads DOM-side scripts as classic <script> tags, so every
        // addon's domside.js shares one global scope. Without this wrapper
        // the bundle's minified top-level declarations (const F, const z, ...)
        // collide with other addons' and throw a redeclaration SyntaxError.
        format: "iife",
      },
    },
  },
});
