import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDistDir = path.join(rootDir, "apps", "public-app", "dist");
const hubDistDir = path.join(rootDir, "apps", "control-hub", "dist");
const outputDir = path.join(rootDir, "dist-same-origin");

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.join(outputDir, "hub"), { recursive: true });

await cp(publicDistDir, outputDir, { recursive: true });
await cp(hubDistDir, path.join(outputDir, "hub"), { recursive: true });

console.log(`Assembled same-origin bundle at ${outputDir}`);
