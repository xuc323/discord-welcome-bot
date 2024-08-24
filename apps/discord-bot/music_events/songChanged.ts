import { PlayerEventNames, Queue, Song } from "@repo/music-player";
import { MyClient, PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.songChanged> = {
  name: PlayerEventNames.songChanged,
  execute(client: MyClient, queue: Queue, oldSong: Song, newSong: Song) {
    queue.messageChannel.send(`**${newSong}** is now playing.`);
  },
};
