import { Queue } from "@jadestudios/discord-music-player";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "queueEnd",
  execute(client: MyClient, queue: Queue<QueueData>) {
    queue.data?.msgChannel.send("The queue has ended.");
  },
};
