import { PlayerEventNames } from "@repo/music-player";
import { PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.songChanged> = {
  name: PlayerEventNames.songChanged,
  execute(client, queue, oldSong, newSong) {
    queue.messageChannel.send(`**${newSong}** is now playing.`);
  },
};
