import { Hono } from "hono";
import { stream } from "hono/streaming";

const song = new Hono();

song.get("/", (c) => {
  return c.json({ status: "ok" });
});

song.get("/stream", (c) => {
  return stream(c, async (stm) => {
    stm.onAbort(() => {
      console.log("Aborted!");
    });

    await stm.write("Hello");

    await stm.sleep(1000);

    await stm.write(" World!");
  });
});

export default song;
