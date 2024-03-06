import { bigint, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  username: text("username").notNull(),
  discriminator: varchar("discriminator", { length: 8 }).notNull(),
  userId: bigint("user_id", { mode: "bigint" }).unique().notNull(),
});
