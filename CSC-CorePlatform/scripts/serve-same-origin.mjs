import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist-same-origin");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function resolveCandidate(requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0]);
  if (decoded === "/") {
    return path.join(distDir, "index.html");
  }

  const normalized = decoded.replace(/^\/+/, "");
  return path.join(distDir, normalized);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveFilePath(candidatePath) {
  if (!(await fileExists(candidatePath))) {
    return null;
  }

  const details = await stat(candidatePath);
  if (details.isDirectory()) {
    const indexPath = path.join(candidatePath, "index.html");
    return (await fileExists(indexPath)) ? indexPath : null;
  }

  return candidatePath;
}

const server = http.createServer(async (req, res) => {
  const candidate = resolveCandidate(req.url || "/");
  let filePath = await resolveFilePath(candidate);

  if (!filePath) {
    if ((req.url || "/").startsWith("/hub")) {
      filePath = path.join(distDir, "hub", "index.html");
    } else {
      filePath = path.join(distDir, "index.html");
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
  createReadStream(filePath).pipe(res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Same-origin local server running at http://localhost:${port}`);
  console.log(`Public app: http://localhost:${port}/`);
  console.log(`Control hub: http://localhost:${port}/hub/`);
});
