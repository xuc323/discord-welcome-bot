import { bigint, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  username: text("username"),
  discriminator: varchar("discriminator", { length: 8 }),
  userId: bigint("user_id", { mode: "bigint" }).unique().notNull(),
});
