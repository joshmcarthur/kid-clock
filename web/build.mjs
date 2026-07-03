import * as esbuild from "esbuild";
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";

function logSize(path) {
  const bytes = statSync(path).size;
  const gzipBytes = gzipSync(readFileSync(path), { level: 9 }).length;
  console.log(
    `built ${path} (${bytes.toLocaleString()} bytes, ${gzipBytes.toLocaleString()} gzip bytes)`,
  );
}

const jsOptions = {
  entryPoints: ["web/src/main.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  jsx: "automatic",
  jsxImportSource: "preact",
  outfile: "kid-clock-app.js",
  legalComments: "none",
  treeShaking: true,
  drop: ["console", "debugger"],
  target: ["es2018"],
};

const cssOptions = {
  entryPoints: ["web/src/app.css"],
  minify: true,
  outfile: "kid-clock-app.css",
};

const watch = process.argv.includes("--watch");

if (watch) {
  const [jsCtx, cssCtx] = await Promise.all([
    esbuild.context(jsOptions),
    esbuild.context(cssOptions),
  ]);
  await Promise.all([jsCtx.watch(), cssCtx.watch()]);
  console.log("watching web/src → kid-clock-app.{js,css}");
} else {
  await Promise.all([esbuild.build(jsOptions), esbuild.build(cssOptions)]);
  logSize("kid-clock-app.js");
  logSize("kid-clock-app.css");
}
