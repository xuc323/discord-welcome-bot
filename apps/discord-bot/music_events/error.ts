import { Queue } from "@jadestudios/discord-music-player";
import { MyClient, PlayerEvent, QueueData } from "../type";
import { TextChannel } from "discord.js";

export const event: PlayerEvent = {
  name: "error",
  execute(client: MyClient, error: string, queue: Queue<QueueData>) {
    (queue.data?.msgChannel as TextChannel).send(
      `ERROR: an unknown error occured..`
    );
    console.log(
      `[${queue.guild.name} | ${queue.guild.id}]: MUSIC EVENT ERROR: ${error}`
    );
  },
};
