import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const assets = join(dist, "assets");
const server = join(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
await mkdir(server, { recursive: true });

const publicExtensions = new Set([".html", ".js", ".svg", ".txt", ".xml"]);
const entries = await readdir(root, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isFile() && publicExtensions.has(extname(entry.name))) {
    await cp(join(root, entry.name), join(assets, entry.name));
  }
}

await cp(join(root, "worker", "index.js"), join(server, "index.js"));
