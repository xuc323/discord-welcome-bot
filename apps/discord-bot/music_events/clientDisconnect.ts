import { PlayerEventNames } from "@repo/music-player";
import { PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.clientDisconnect> = {
  name: PlayerEventNames.clientDisconnect,
  execute(client, queue) {
    queue.messageChannel.send(
      "I was kicked from the Voice Channel, queue ended."
    );
  },
};
