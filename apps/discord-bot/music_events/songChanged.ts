import { Queue, Song } from "@jadestudios/discord-music-player";
import { TextChannel } from "discord.js";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "songChanged",
  execute(
    client: MyClient,
    queue: Queue<QueueData>,
    newSong: Song,
    oldSong: Song
  ) {
    (queue.data?.msgChannel as TextChannel).send(
      `**${newSong}** is now playing.`
    );
  },
};
