import { Queue, Song } from "@jadestudios/discord-music-player";
import { MyClient, PlayerEvent, QueueData } from "../type";
import { insertSongRequestWithTransaction } from "@repo/database";

export const event: PlayerEvent = {
  name: "songChanged",
  execute(
    client: MyClient,
    queue: Queue<QueueData>,
    newSong: Song,
    oldSong: Song
  ) {
    queue.data?.msgChannel.send(`**${newSong}** is now playing.`);

    insertSongRequestWithTransaction(client.postgres!, {
      guildId: BigInt(queue.guild.id),
      guildName: queue.guild.name,
      songUrl: newSong.url,
      songAuthor: newSong.author,
      songName: newSong.name,
      userId: BigInt(newSong.requestedBy!.id),
      username: newSong.requestedBy!.username,
      discriminator: newSong.requestedBy!.discriminator,
    });
  },
};
