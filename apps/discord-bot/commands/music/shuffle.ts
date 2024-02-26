import { DMPError } from "@jadestudios/discord-music-player";
import { Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "shuffle",
  description: "Shuffle the queue.",
  aliases: ["shuf"],
  args: false,
  execute(message: Message, args: string[], client: MyClient) {
    // check if the queue exists
    const queue = client.player!.getQueue(message.guild!.id);
    if (queue) {
      // the queue exists
      if (queue.connection?.channel != message.member?.voice.channel) {
        // the user is not in the same voice channel as the bot
        return (message.channel as TextChannel).send(
          `Music is playing in ${queue.connection?.channel}. Join or wait for it to finish.`
        );
      }

      // the user is in the same voice channel as the bot
      try {
        const songs = queue.shuffle();
        if (songs) {
          (message.channel as TextChannel).send(
            "MUSIC STATUS: Queue is now shuffled!"
          );
        } else {
          (message.channel as TextChannel).send(
            "ERROR: Failed to shuffle the queue. Try again later."
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
