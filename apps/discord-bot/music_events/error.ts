import { Queue } from "@jadestudios/discord-music-player";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "error",
  execute(client: MyClient, error: string, queue: Queue<QueueData>) {
    queue.data?.msgChannel.send(`ERROR: an unknown error occured..`);
    console.log(
      `[${queue.guild.name} | ${queue.guild.id}]: MUSIC EVENT ERROR: ${error}`
    );
  },
};
