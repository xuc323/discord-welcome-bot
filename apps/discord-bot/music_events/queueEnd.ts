import { PlayerEventNames } from "@repo/music-player";
import { PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.queueEnd> = {
  name: PlayerEventNames.queueEnd,
  execute(client, queue) {
    queue.messageChannel.send("The queue has ended.");
  },
};
