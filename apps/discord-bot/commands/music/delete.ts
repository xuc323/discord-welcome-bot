import { Message } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "delete",
  description: "Remove the music from the queue.",
  aliases: ["remove", "d"],
  args: true,
  usage: "[music number]",
  isLive: false,
  execute(message: Message, args: string[], client: MyClient) {
    // check if the queue exists
    const queue = client.player!.getQueue(message.guild!.id);
    if (queue) {
      // the queue exists
      if (queue.connection?.channel != message.member?.voice.channel) {
        // the user is not in the same voice channel as the bot
        return message.channel.send(
          `Music is playing in ${queue.connection?.channel}. Join or wait for it to finish.`
        );
      }

      // now user is in the same voice channel
      const num = Number(args[0]);
      if (!num && num != 0) {
        return message.channel.send(
          "ERROR: The argument can only be a number."
        );
      }

      // index is always >= 1
      if (num < 1) {
        return message.channel.send(
          "ERROR: Song number can only be greater than 1."
        );
      }

      try {
        // remove function might throw exception
        const song = queue.remove(num - 1);
        if (song) {
          message.channel.send(`Song ${song.name} is removed from the queue.`);
        } else {
          message.channel.send(
            `ERROR: Can't remove the song at index \`${num}\`. Try again later.`
          );
        }
      } catch (err: any) {
        const error: Error = err;
        message.channel.send(error.message);
      }
    } else {
      // the queue doesn't exist
      message.channel.send(
        `WARNING: Queue is empty, can't perform \`${this.name}\`.`
      );
    }
  },
};
