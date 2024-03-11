import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

export enum PermissionEnum {
  NULL,
  READ,
  READANDWRITE,
}

export class Database {
  public postgres: NodePgDatabase;
  public readonly permission;

  constructor(url: string, perm: PermissionEnum = PermissionEnum.NULL) {
    const pool = new Pool({
      connectionString: url,
    });

    pool.on("error", (err) => {
      console.log(err);
    });

    this.postgres = drizzle(pool);
    this.permission = perm;
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
