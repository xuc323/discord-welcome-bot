const { build } = require("esbuild");

build({
  entryPoints: ["./main.ts"],
  bundle: true,
  platform: "node",
  outdir: "dist",
  packages: "external",
}).then(() => console.log("⚡ Bundle is complete! ⚡"));
