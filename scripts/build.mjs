import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const assets = join(dist, "assets");
const server = join(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
await mkdir(server, { recursive: true });

const publicExtensions = new Set([".css", ".html", ".js", ".svg", ".png", ".txt", ".xml"]);
const privateEmployeePages = new Set(["employee-login.html", "employee-dashboard.html"]);
const entries = await readdir(root, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isFile() && publicExtensions.has(extname(entry.name)) && !privateEmployeePages.has(entry.name)) {
    await cp(join(root, entry.name), join(assets, entry.name));
  }
}

const homepageAssets = join(assets, "assets", "homepage");
await mkdir(homepageAssets, { recursive: true });
for (const file of [
  "tv-head-hero.webp",
  "tv-head-stage-02.webp",
  "tv-head-stage-03.webp",
  "tv-head-stage-04.webp",
  "tv-head-deconstructed.webp",
  "new-media-social-preview.jpg",
]) {
  await cp(join(root, "assets", "homepage", file), join(homepageAssets, file));
}

const [workerSource, loginHtml, dashboardHtml] = await Promise.all([
  readFile(join(root, "worker", "index.js"), "utf8"),
  readFile(join(root, "employee-login.html"), "utf8"),
  readFile(join(root, "employee-dashboard.html"), "utf8"),
]);
const compiledWorker = workerSource
  .replace("const EMPLOYEE_LOGIN_HTML = '';", `const EMPLOYEE_LOGIN_HTML = ${JSON.stringify(loginHtml)};`)
  .replace("const EMPLOYEE_DASHBOARD_HTML = '';", `const EMPLOYEE_DASHBOARD_HTML = ${JSON.stringify(dashboardHtml)};`);
await writeFile(join(server, "index.js"), compiledWorker, "utf8");
