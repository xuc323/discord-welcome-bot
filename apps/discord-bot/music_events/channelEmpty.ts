import { PlayerEventNames, Queue } from "@repo/music-player";
import { MyClient, PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.channelEmpty> = {
  name: PlayerEventNames.channelEmpty,
  execute(client: MyClient, queue: Queue) {
    queue.messageChannel.send("Everyone left the Voice Channel, queue ended.");
  },
};
