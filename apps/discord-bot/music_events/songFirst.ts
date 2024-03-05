import { Queue, Song } from "@jadestudios/discord-music-player";
import { TextChannel } from "discord.js";
import { MyClient, PlayerEvent, QueueData } from "../type";
import { insertSongRequestWithTransaction } from "@repo/database";

export const event: PlayerEvent = {
  name: "songFirst",
  execute(client: MyClient, queue: Queue<QueueData>, song: Song) {
    (queue.data?.msgChannel as TextChannel).send(
      `Started playing **${song}**.`
    );

    insertSongRequestWithTransaction(client.postgres!, {
      guildId: BigInt(queue.guild.id),
      guildName: queue.guild.name,
      songUrl: song.url,
      songAuthor: song.author,
      songName: song.name,
      userId: BigInt(song.requestedBy!.id),
      username: song.requestedBy!.username,
      discriminator: song.requestedBy!.discriminator,
    });
  },
};
