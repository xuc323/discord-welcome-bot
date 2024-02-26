import { Playlist, Queue } from "@jadestudios/discord-music-player";
import { TextChannel } from "discord.js";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "playlistAdd",
  execute(client: MyClient, queue: Queue<QueueData>, playlist: Playlist) {
    (queue.data?.msgChannel as TextChannel).send(
      `**${playlist.name}** has been added to the queue.\n${playlist.url}`
    );
    console.log(
      `[${queue.guild.name} | ${queue.guild.id} | ${playlist.songs[0]?.requestedBy?.tag}]: ${playlist} ${playlist.url}`
    );
  },
};
