import { PlayerEventNames } from "@repo/music-player";
import { PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.error> = {
  name: PlayerEventNames.error,
  execute(client, error, queue) {
    queue.messageChannel.send(`ERROR: an unknown error occured..`);
    console.log(
      `[${queue.guild.name} | ${queue.guild.id}]: MUSIC EVENT ERROR: ${error}`
    );
  },
};
