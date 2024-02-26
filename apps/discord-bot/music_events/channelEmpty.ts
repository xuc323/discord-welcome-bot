import { Queue } from "@jadestudios/discord-music-player";
import { TextChannel } from "discord.js";
import { MyClient, PlayerEvent, QueueData } from "../type";

export const event: PlayerEvent = {
  name: "channelEmpty",
  execute(client: MyClient, queue: Queue<QueueData>) {
    (queue.data?.msgChannel as TextChannel).send(
      "Everyone left the Voice Channel, queue ended."
    );
  },
};
