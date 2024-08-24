import { RepeatMode } from "@repo/music-player";
import { Message } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "loop",
  description: "Loop the queue.",
  aliases: ["l"],
  args: false,
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

      // the user is in the same voice channel as the bot
      try {
        const status = queue.setRepeatMode(RepeatMode.QUEUE); // set repeat mode to QUEUE
        if (status) {
          message.channel.send("MUSIC STATUS: Now looping the queue!");
        } else {
          message.channel.send(
            "ERROR: Failed to set to loop mode. Try again later."
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
