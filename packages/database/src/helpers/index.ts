import { desc, eq } from "drizzle-orm";
import { Database } from "..";
import { guilds, requests, songs, users } from "../config";

type Guild = { guildId: bigint; guildName: string };

type User = { username: string; discriminator: string; userId: bigint };

type Song = { songName: string; songUrl: string; songAuthor: string };

export async function selectAllSongsOrderByRequestTime(
  db: Database,
  limit: number = 25,
  offset: number = 0
) {
  const data = await db.postgres
    .select({
      name: songs.name,
      url: songs.url,
      author: songs.author,
      requestedOn: requests.date,
    })
    .from(requests)
    .leftJoin(songs, eq(requests.suid, songs.suid))
    .orderBy(desc(requests.date))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function insertSongRequestWithTransaction(
  db: Database,
  data: Guild & Song & User
) {
  // start an insertion transaction
  await db.postgres.transaction(async (tx) => {
    // insert to users table
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

    // insert to guilds table
    const guildRes = await tx
      .insert(guilds)
      .values({ guildId: data.guildId, name: data.guildName })
      .onConflictDoUpdate({
        target: guilds.guildId,
        set: { name: data.guildName },
      })
      .returning({ guid: guilds.guid });

    // insert to songs table
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

    // insert to requests table
    await tx.insert(requests).values({
      guid: guildRes.at(0)!.guid,
      suid: songRes.at(0)!.suid,
      uuid: userRes.at(0)!.uuid,
    });
  });
}

export async function selectRecentSongsInGuildOrderByRequestTime(
  db: Database,
  guildId: bigint,
  limit: number = 5
) {
  const data = await db.postgres
    .select({
      name: songs.name,
      author: songs.author,
      url: songs.url,
      userId: users.userId,
      requestedOn: requests.date,
    })
    .from(requests)
    .innerJoin(guilds, eq(requests.guid, guilds.guid))
    .innerJoin(songs, eq(requests.suid, songs.suid))
    .innerJoin(users, eq(requests.uuid, users.uuid))
    .where(eq(guilds.guildId, guildId))
    .orderBy(desc(requests.date))
    .limit(limit);

  return data;
}
