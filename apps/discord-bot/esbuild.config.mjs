import { build } from "esbuild";

build({
  entryPoints: ["./main.ts"],
  bundle: true,
  platform: "node",
  outdir: "dist",
  packages: "external",
  minifyWhitespace: true,
  minifySyntax: true,
}).then(() => console.log("⚡ Bundle is complete! ⚡"));
