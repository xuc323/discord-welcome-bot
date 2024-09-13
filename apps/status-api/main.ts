import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import song from "./route/songs";

const app = new Hono();

app.use(logger());
app.use(prettyJSON());
app.route("/songs", song);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
