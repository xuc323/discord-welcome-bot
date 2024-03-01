import { relations } from "drizzle-orm";
import { requests, users } from "../schemas";

export const userRequestRelation = relations(users, ({ many }) => ({
  requests: many(requests),
}));
