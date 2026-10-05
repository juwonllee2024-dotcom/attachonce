import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.PORT || 4175);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = createServer(async (request, response) => {
  try {
    const requestPath = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`).pathname;
    const relativePath = requestPath === "/" ? "examples/demo.html" : requestPath.replace(/^\/+/, "");
    const filePath = normalize(join(root, relativePath));
    const relativeToRoot = relative(root, filePath);
    if (relativeToRoot.startsWith("..") || relativeToRoot.includes(`..${normalize("/")}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream" });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`AttachOnce demo: http://127.0.0.1:${port}`);
});
