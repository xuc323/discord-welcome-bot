import { Queue, Song } from "@jadestudios/discord-music-player";
import { TextChannel } from "discord.js";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "songFirst",
  execute(client: MyClient, queue: Queue<QueueData>, song: Song) {
    (queue.data?.msgChannel as TextChannel).send(
      `Started playing **${song}**.`
    );
  },
};
