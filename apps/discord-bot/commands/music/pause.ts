import { Message } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "pause",
  description: "Pause the queue.",
  args: false,
  execute(message, args, client) {
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

      // the user is in the same voice channel as the bot
      try {
        const status = queue.setPaused(true);
        if (status) {
          message.channel.send("MUSIC STATUS: The queue is now paused!");
        } else {
          message.channel.send(
            "ERROR: Failed to pause the queue. Try again later."
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
