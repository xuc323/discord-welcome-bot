import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const songs = pgTable("songs", {
  suid: uuid("suid").defaultRandom().primaryKey(),
  name: text("name"),
  url: text("url").unique().notNull(),
  author: text("author"),
});
