import { Database } from "@repo/database";

export const postgres = new Database(process.env.DATABASE_URL);
