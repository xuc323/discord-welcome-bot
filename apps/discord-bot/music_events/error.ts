import { PlayerEventNames, Queue } from "@repo/music-player";
import { MyClient, PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.error> = {
  name: PlayerEventNames.error,
  execute(client: MyClient, error: string, queue: Queue) {
    queue.messageChannel.send(`ERROR: an unknown error occured..`);
    console.log(
      `[${queue.guild.name} | ${queue.guild.id}]: MUSIC EVENT ERROR: ${error}`
    );
  },
};
