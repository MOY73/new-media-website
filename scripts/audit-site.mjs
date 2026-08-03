import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const files = (await readdir(root)).filter((name) => name.endsWith(".html"));
const problems = [];
const preferencesSource = await readFile(join(root, "site-preferences.js"), "utf8");

for (const sharedAsset of ["site-chrome.css", "site-chrome.js"]) {
  try {
    await readFile(join(root, sharedAsset), "utf8");
  } catch {
    problems.push(`missing shared site chrome asset: ${sharedAsset}`);
  }
  if (!preferencesSource.includes(`/${sharedAsset}`)) {
    problems.push(`site-preferences.js does not load ${sharedAsset}`);
  }
}

function translationBlocks(source) {
  const match = source.match(/\bar\s*:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*en\s*:\s*\{([\s\S]*?)\n\s*\}\s*\n?\s*};/);
  return match ? { ar: match[1], en: match[2] } : null;
}

for (const file of files) {
  const source = await readFile(join(root, file), "utf8");
  const required = [
    ["shared preference loader", source.includes('src="/site-preferences.js"')],
    ["shared typography and footer styles", source.includes('href="/site-fixes.css"')],
    ["language selector", source.includes('id="langBtn"')],
    ["theme selector", source.includes('id="themeBtn"')],
    ["copyright notice", source.includes("جميع الحقوق محفوظة لدى New Media")],
  ];

  for (const [feature, present] of required) {
    if (!present) problems.push(`${file}: missing ${feature}`);
  }

  const keys = [...source.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
  const blocks = translationBlocks(source);

  if (keys.length && !blocks) {
    problems.push(`${file}: translation dictionaries could not be read`);
    continue;
  }

  for (const key of new Set(keys)) {
    const keyPattern = new RegExp(`(?:^|[,\\n])\\s*${key}\\s*:`, "m");
    if (!keyPattern.test(blocks.ar)) problems.push(`${file}: Arabic is missing ${key}`);
    if (!keyPattern.test(blocks.en)) problems.push(`${file}: English is missing ${key}`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} pages: shared chrome, translation, theme persistence, and copyright are present everywhere.`);
}
