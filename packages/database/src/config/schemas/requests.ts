import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { guilds, songs, users } from ".";

export const requests = pgTable("requests", {
  guid: uuid("guid")
    .notNull()
    .references(() => guilds.guid, { onDelete: "restrict" }),
  suid: uuid("suid")
    .notNull()
    .references(() => songs.suid, { onDelete: "restrict" }),
  uuid: uuid("uuid")
    .notNull()
    .references(() => users.uuid, { onDelete: "restrict" }),
  date: timestamp("date", {
    mode: "date",
    withTimezone: true,
    precision: 6,
  }).defaultNow(),
});
