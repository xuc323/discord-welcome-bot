import { PlayerEventNames } from "@repo/music-player";
import { PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.channelEmpty> = {
  name: PlayerEventNames.channelEmpty,
  execute(client, queue) {
    queue.messageChannel.send("Everyone left the Voice Channel, queue ended.");
  },
};
