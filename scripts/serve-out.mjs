// Máy chủ tĩnh tối giản để xem và kiểm thử thư mục out/ giống cách Hostinger phục vụ:
// "/muc/" → out/muc/index.html; tệp có thật thì trả tệp; không có thì trả out/404.html với mã 404.
// Dùng: node scripts/serve-out.mjs [cổng]   (mặc định 4173)
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".xml": "application/xml; charset=utf-8",
};

function resolveFile(root, urlPath) {
  let path;
  try {
    path = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  const safe = normalize(path).replace(/^([/\\])+/, "");
  const full = resolve(root, safe);
  if (full !== root && !full.startsWith(root + sep)) return null;
  if (existsSync(full) && statSync(full).isFile()) return full;
  const index = join(full, "index.html");
  if (existsSync(index)) return index;
  const html = `${full}.html`;
  if (existsSync(html)) return html;
  return null;
}

export function startServer({ dir = "out", port = 4173 } = {}) {
  const root = resolve(dir);
  if (!existsSync(root)) throw new Error(`Chưa có thư mục ${dir}/. Chạy "npm run build" trước.`);
  const server = createServer((req, res) => {
    const file = resolveFile(root, req.url || "/");
    const status = file ? 200 : 404;
    const target = file || join(root, "404.html");
    if (!existsSync(target)) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("404");
      return;
    }
    res.writeHead(status, { "content-type": TYPES[extname(target)] || "application/octet-stream" });
    createReadStream(target).pipe(res);
  });
  return new Promise((done) => {
    server.listen(port, "127.0.0.1", () => {
      const address = server.address();
      done({ server, url: `http://127.0.0.1:${address.port}` });
    });
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] || 4173);
  const { url } = await startServer({ port });
  console.log(`Đang phục vụ out/ tại ${url} (Ctrl+C để dừng)`);
}
