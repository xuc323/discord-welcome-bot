import { Queue, Song } from "@jadestudios/discord-music-player";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "songChanged",
  execute(
    client: MyClient,
    queue: Queue<QueueData>,
    newSong: Song,
    oldSong: Song
  ) {
    queue.data?.msgChannel.send(`**${newSong}** is now playing.`);
  },
};
