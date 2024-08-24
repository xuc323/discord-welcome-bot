import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/config/*"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
});
