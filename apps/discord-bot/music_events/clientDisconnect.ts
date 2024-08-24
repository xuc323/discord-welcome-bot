import { PlayerEventNames, Queue } from "@repo/music-player";
import { MyClient, PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.clientDisconnect> = {
  name: PlayerEventNames.clientDisconnect,
  execute(client: MyClient, queue: Queue) {
    queue.messageChannel.send(
      "I was kicked from the Voice Channel, queue ended."
    );
  },
};
