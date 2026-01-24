import index from "./index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/icons/*": async (req) => {
      const path = new URL(req.url).pathname;
      const file = Bun.file(`./src/static${path}`);
      if (await file.exists()) {
        return new Response(file);
      }
      return new Response("Not found", { status: 404 });
    },
  },
  development: {
    hmr: true,
    console: false,
  },
});

console.log(`Server running at http://localhost:${server.port}`);
