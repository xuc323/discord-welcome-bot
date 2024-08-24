import { PlayerEventNames, Queue, Song } from "@repo/music-player";
import { MyClient, PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.songAdd> = {
  name: PlayerEventNames.songAdd,
  execute(client: MyClient, queue: Queue, song: Song) {
    queue.messageChannel.send(
      `**${song.name}** has been added to the queue.\n${song.url}`
    );
    console.log(
      `[${queue.guild.name} | ${queue.guild.id} | ${song.requestedBy?.tag}]: ${song} ${song.url}`
    );
  },
};
