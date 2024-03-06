import { desc, eq } from "drizzle-orm";
import { Database, DatabaseError, DatabaseErrorEnum, PermissionEnum } from "..";
import { guilds, requests, songs, users } from "../config";

type Guild = { guildId: bigint; guildName: string };

type User = { username: string; discriminator: string; userId: bigint };

type Song = { songName: string; songUrl: string; songAuthor: string };

export async function selectAllSongsOrderByRequestTime(db: Database) {
  if (db.permission === PermissionEnum.NULL) {
    throw new DatabaseError(
      `You need ${
        PermissionEnum[PermissionEnum.READ]
      } permission to execute this function.`,
      DatabaseErrorEnum.PERMISSION
    );
  }

  const data = await db.postgres
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

export async function insertSongRequestWithTransaction(
  db: Database,
  data: Guild & Song & User
) {
  if (db.permission === PermissionEnum.NULL) {
    throw new DatabaseError(
      `You need ${
        PermissionEnum[PermissionEnum.READANDWRITE]
      } permission to execute this function.`,
      DatabaseErrorEnum.PERMISSION
    );
  }

  await db.postgres.transaction(async (tx) => {
    const userRes = await tx
      .insert(users)
      .values({
        username: data.username,
        userId: data.userId,
        discriminator: data.discriminator,
      })
      .onConflictDoUpdate({
        target: users.userId,
        set: { username: data.username, discriminator: data.discriminator },
      })
      .returning({ uuid: users.uuid });

    const guildRes = await tx
      .insert(guilds)
      .values({ guildId: data.guildId, name: data.guildName })
      .onConflictDoUpdate({
        target: guilds.guildId,
        set: { name: data.guildName },
      })
      .returning({ guid: guilds.guid });

    const songRes = await tx
      .insert(songs)
      .values({
        name: data.songName,
        url: data.songUrl,
        author: data.songAuthor,
      })
      .onConflictDoUpdate({
        target: songs.url,
        set: { name: data.songName, author: data.songAuthor },
      })
      .returning({ suid: songs.suid });

    await tx.insert(requests).values({
      guid: guildRes.at(0)!.guid,
      suid: songRes.at(0)!.suid,
      uuid: userRes.at(0)!.uuid,
    });
  });
}
