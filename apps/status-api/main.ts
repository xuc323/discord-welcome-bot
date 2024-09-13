import { serve } from "@hono/node-server";
import { Hono } from "hono";
import song from "./route/songs";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(prettyJSON());
app.route("/songs", song);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
