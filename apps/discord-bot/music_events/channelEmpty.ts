import { Queue } from "@jadestudios/discord-music-player";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "channelEmpty",
  execute(client: MyClient, queue: Queue<QueueData>) {
    queue.data?.msgChannel.send(
      "Everyone left the Voice Channel, queue ended."
    );
  },
};
