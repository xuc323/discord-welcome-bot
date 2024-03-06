import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", {
  guid: uuid("guid").defaultRandom().primaryKey(),
  guildId: bigint("guild_id", { mode: "bigint" }).unique().notNull(),
  name: text("name").notNull(),
});
