import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { desc, eq } from "drizzle-orm";
import { requests, songs, users } from "./config";

export class Database {
  private db: NodePgDatabase;

  constructor(url?: string) {
    const pool = new Pool({
      connectionString: url,
    });

    this.db = drizzle(pool);
  }

  async selectAllSongsOrderByTime() {
    const data = await this.db
      .select({
        name: songs.name,
        url: songs.url,
        author: songs.author,
        requestedOn: requests.date,
      })
      .from(requests)
      .leftJoin(songs, eq(requests.suid, songs.suid))
      .orderBy(desc(requests.date));

    return data;
  }

  async insertSongRequest(
    username: string,
    discriminator: string,
    userId: bigint
  ) {
    await this.db.transaction(async (tx) => {
      await tx.insert(users).values({
        username: username,
        discriminator: discriminator,
        userId: userId,
      });
    });
  }
}
