import { DMPError } from "@jadestudios/discord-music-player";
import { Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "seek",
  description: "Fast forward the song.",
  args: true,
  aliases: ["fastforward", "ff"],
  usage: "[time in seconds]",
  async execute(message: Message, args: string[], client: MyClient) {
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
      const time = Number(args[0]);
      if (!time && time != 0) {
        return (message.channel as TextChannel).send(
          "Only numbers are allowed.."
        );
      } else if (time < 0) {
        return (message.channel as TextChannel).send(
          "Time needs to be greater than 0."
        );
      }

      try {
        const status = await queue.seek(time * 1000);
        if (status) {
          (message.channel as TextChannel).send(
            `MUSIC STATUS: Fast forwarded ${time} seconds.`
          );
        } else {
          (message.channel as TextChannel).send(
            "ERROR: Failed to fast forward. Try again later."
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
