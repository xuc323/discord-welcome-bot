import { Database } from "@repo/database";

export const postgres = new Database(process.env.POSTGRES_URL!);
