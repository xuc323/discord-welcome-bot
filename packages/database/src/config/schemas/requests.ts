import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { guilds } from "./guilds";
import { songs } from "./songs";
import { users } from "./users";

export const requests = pgTable("requests", {
  guid: uuid("guid")
    .notNull()
    .references(() => guilds.guid),
  suid: uuid("suid")
    .notNull()
    .references(() => songs.suid),
  uuid: uuid("uuid")
    .notNull()
    .references(() => users.uuid),
  date: timestamp("date").defaultNow(),
});
