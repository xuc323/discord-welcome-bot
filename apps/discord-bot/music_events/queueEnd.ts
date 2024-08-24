import { PlayerEventNames, Queue } from "@repo/music-player";
import { MyClient, PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.queueEnd> = {
  name: PlayerEventNames.queueEnd,
  execute(client: MyClient, queue: Queue) {
    queue.messageChannel.send("The queue has ended.");
  },
};
