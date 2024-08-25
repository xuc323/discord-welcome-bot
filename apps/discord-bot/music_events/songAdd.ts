import { PlayerEventNames } from "@repo/music-player";
import { PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.songAdd> = {
  name: PlayerEventNames.songAdd,
  execute(client, queue, song) {
    queue.messageChannel.send(
      `**${song.name}** has been added to the queue.\n${song.url}`
    );
    console.log(
      `[${queue.guild.name} | ${queue.guild.id} | ${song.requestedBy?.tag}]: ${song} ${song.url}`
    );
  },
};
