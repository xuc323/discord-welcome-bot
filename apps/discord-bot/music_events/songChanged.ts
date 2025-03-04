import { PlayerEventNames } from "@repo/music-player";
import { MessageFlags } from "discord.js";
import { PlayerEvent } from "../type";

export const event: PlayerEvent<PlayerEventNames.songChanged> = {
  name: PlayerEventNames.songChanged,
  execute(client, queue, oldSong, newSong) {
    queue.messageChannel.send({
      content: `**${newSong}** is now playing.`,
      flags: MessageFlags.SuppressNotifications,
    });
  },
};
