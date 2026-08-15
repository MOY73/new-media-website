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
const privateEmployeePages = new Set(["employee-login.html", "employee-dashboard.html", "client-login.html", "client-portal.html", "contact-application.html"]);
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
  "tv-head-open-hands.webp",
  "new-media-social-preview.jpg",
  "new-media-social-preview-v2.png",
  "new-media-social-preview-v3.png",
]) {
  await cp(join(root, "assets", "homepage", file), join(homepageAssets, file));
}

const teamLibraryAssets = join(assets, "assets", "team-library");
await mkdir(teamLibraryAssets, { recursive: true });
for (const file of await readdir(join(root, "assets", "team-library"))) {
  await cp(join(root, "assets", "team-library", file), join(teamLibraryAssets, file));
}

const workAssets = join(assets, "assets", "work");
await mkdir(workAssets, { recursive: true });
for (const file of await readdir(join(root, "assets", "work"))) {
  await cp(join(root, "assets", "work", file), join(workAssets, file));
}

const socialAssets = join(assets, "assets", "social");
await mkdir(socialAssets, { recursive: true });
for (const file of await readdir(join(root, "assets", "social"))) {
  await cp(join(root, "assets", "social", file), join(socialAssets, file));
}

const internalAssets = join(assets, "assets", "internal");
await mkdir(internalAssets, { recursive: true });
await cp(join(root, "data", "makkah-business-leads-batch-1.json"), join(internalAssets, "makkah-business-leads-batch-1.json"));

const [workerSource, loginHtml, dashboardHtml, clientLoginHtml, clientPortalHtml, contactApplicationHtml] = await Promise.all([
  readFile(join(root, "worker", "index.js"), "utf8"),
  readFile(join(root, "employee-login.html"), "utf8"),
  readFile(join(root, "employee-dashboard.html"), "utf8"),
  readFile(join(root, "client-login.html"), "utf8"),
  readFile(join(root, "client-portal.html"), "utf8"),
  readFile(join(root, "contact-application.html"), "utf8"),
]);
const compiledWorker = workerSource
  .replace("const EMPLOYEE_LOGIN_HTML = '';", `const EMPLOYEE_LOGIN_HTML = ${JSON.stringify(loginHtml)};`)
  .replace("const EMPLOYEE_DASHBOARD_HTML = '';", `const EMPLOYEE_DASHBOARD_HTML = ${JSON.stringify(dashboardHtml)};`)
  .replace("const CLIENT_LOGIN_HTML = '';", `const CLIENT_LOGIN_HTML = ${JSON.stringify(clientLoginHtml)};`)
  .replace("const CLIENT_PORTAL_HTML = '';", `const CLIENT_PORTAL_HTML = ${JSON.stringify(clientPortalHtml)};`)
  .replace("const CONTACT_APPLICATION_HTML = '';", `const CONTACT_APPLICATION_HTML = ${JSON.stringify(contactApplicationHtml)};`);
await writeFile(join(server, "index.js"), compiledWorker, "utf8");
