import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/config/*"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
    ssl: { rejectUnauthorized: true, ca: process.env.POSTGRES_CA! },
  },
  verbose: true,
  strict: true,
});
