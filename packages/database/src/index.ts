import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

export class Database {
  public postgres: NodePgDatabase;

  constructor(url: string) {
    const pool = new Pool({
      connectionString: url,
    });

    pool.on("error", (err) => {
      console.log(err);
    });

    this.postgres = drizzle(pool);
  }
}

export enum DatabaseErrorEnum {
  NULL,
  PERMISSION,
  NODATA,
  PARAMETER,
}

export class DatabaseError extends Error {
  public readonly reason?: DatabaseErrorEnum;

  constructor(
    message: string,
    reason: DatabaseErrorEnum = DatabaseErrorEnum.NULL
  ) {
    super(message);
    this.name = "DatabaseError";
    this.reason = reason;
  }
}

export * from "./helpers";
export * from "./config";
