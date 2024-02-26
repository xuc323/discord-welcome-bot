import { Queue } from "@jadestudios/discord-music-player";
import { TextChannel } from "discord.js";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "queueEnd",
  execute(client: MyClient, queue: Queue<QueueData>) {
    (queue.data?.msgChannel as TextChannel).send("The queue has ended.");
  },
};
