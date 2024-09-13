import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

export class Database {
  private _postgres: NodePgDatabase;

  constructor(url?: string, cert?: string) {
    const pool = new Pool({
      connectionString: url,
      ssl: {
        rejectUnauthorized: true,
        ca: cert,
      },
    });

    pool.on("error", (err) => {
      console.log("ERR:", err);
    });

    this._postgres = drizzle(pool);
  }

  public get postgres() {
    return this._postgres;
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
