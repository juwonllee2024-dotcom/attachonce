import { cp, mkdir, rm } from "node:fs/promises";
import { build } from "esbuild";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

await build({
  bundle: true,
  entryPoints: ["src/content.ts"],
  outfile: "dist/content.js",
  format: "iife",
  platform: "browser",
  target: "chrome114",
  sourcemap: false,
});

await build({
  bundle: true,
  entryPoints: ["src/popup.ts"],
  outfile: "dist/popup.js",
  format: "iife",
  platform: "browser",
  target: "chrome114",
  sourcemap: false,
});

await cp("manifest.json", "dist/manifest.json");
await cp("popup.html", "dist/popup.html");
console.log("Built dist/");
