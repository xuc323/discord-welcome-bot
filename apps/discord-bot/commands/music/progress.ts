import { DMPError } from "@jadestudios/discord-music-player";
import { Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "progress",
  description: "Create a progress bar for the current song.",
  aliases: ["prog"],
  args: false,
  execute(message: Message, args: string[], client: MyClient) {
    // check if the queue exists
    const queue = client.player!.getQueue(message.guild!.id);
    if (queue) {
      // the queue exists
      try {
        const bar = queue.createProgressBar();
        if (bar) {
          (message.channel as TextChannel).send(
            `${queue.nowPlaying?.name}\n${bar.prettier}`
          );
        } else {
          (message.channel as TextChannel).send(
            "ERROR: Failed to create progress bar. Try again later."
          );
        }
      } catch (err) {
        const error = err as DMPError;
        (message.channel as TextChannel).send(error.message);
      }
    } else {
      // the queue doesn't exist
      (message.channel as TextChannel).send(
        `WARNING: Queue is empty, can't perform \`${this.name}\`.`
      );
    }
  },
};
