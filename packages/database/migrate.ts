import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import "dotenv/config";

const main = async () => {
  const sql = new Client(process.env.DATABASE_URL);

  await sql.connect();

  const db = drizzle(sql);

  try {
    console.log("Start migration process...");

    await migrate(db, {
      migrationsFolder: "./config/migrations",
    });

    console.log("Migration successful");
  } catch (err) {
    console.log(err);
  } finally {
    console.log("Closing connection...");
    await sql.end();
  }
};

main();
