const { build } = require("esbuild");

build({
  entryPoints: ["./main.ts"],
  bundle: true,
  platform: "node",
  outdir: "./build",
  packages: "external",
  minify: true,
  sourcemap: true,
});
