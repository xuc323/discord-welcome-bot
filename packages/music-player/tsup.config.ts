import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "esnext",
  format: ["cjs", "esm"],
  dts: true,
  minifyWhitespace: true,
  minifySyntax: true,
});
