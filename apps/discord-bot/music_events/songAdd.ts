import { Queue, Song } from "@jadestudios/discord-music-player";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "songAdd",
  execute(client: MyClient, queue: Queue<QueueData>, song: Song) {
    queue.data?.msgChannel.send(
      `**${song.name}** has been added to the queue.\n${song.url}`
    );
    console.log(
      `[${queue.guild.name} | ${queue.guild.id} | ${song.requestedBy?.tag}]: ${song} ${song.url}`
    );
  },
};
