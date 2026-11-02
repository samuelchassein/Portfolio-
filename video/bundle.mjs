// Inline assets.js into a single self-contained showreel.html.
import { readFileSync, writeFileSync } from "node:fs";
const src = readFileSync("showreel.src.html", "utf8"), assets = readFileSync("assets.js", "utf8");
writeFileSync("showreel.html", src.replace('<script src="assets.js"></script>', () => `<script>${assets}</script>`));
console.log("showreel.html", (readFileSync("showreel.html").length / 1e6).toFixed(1), "Mo");
