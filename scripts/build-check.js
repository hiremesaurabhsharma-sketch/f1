import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = ["index.html", "src/styles.css", "src/main.js"];

await Promise.all(requiredFiles.map((file) => access(file, constants.R_OK)));

const html = await readFile("index.html", "utf8");
const css = await readFile("src/styles.css", "utf8");
const js = await readFile("src/main.js", "utf8");

const checks = [
  [html.includes("F1 Marketing"), "index.html includes the F1 Marketing brand"],
  [html.includes("./src/styles.css"), "index.html links the stylesheet"],
  [html.includes("./src/main.js"), "index.html links the JavaScript module"],
  [css.includes("@keyframes marquee"), "styles.css includes marquee animation"],
  [css.includes("@keyframes float"), "styles.css includes floating animation"],
  [js.includes("IntersectionObserver"), "main.js includes scroll reveal/counter observers"],
];

const failures = checks.filter(([passed]) => !passed);
if (failures.length) {
  for (const [, message] of failures) console.error(`Missing: ${message}`);
  process.exit(1);
}

console.log("Static build checks passed.");
