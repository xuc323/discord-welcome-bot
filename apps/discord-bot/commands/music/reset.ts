import { Message, TextChannel } from "discord.js";
import { DMPError, RepeatMode } from "@jadestudios/discord-music-player";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "reset",
  description: "Reset to not looping.",
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
        const status = queue.setRepeatMode(RepeatMode.DISABLED); // set repeat mode to NONE
        if (status) {
          (message.channel as TextChannel).send(
            "MUSIC STATUS: Canceled looping!"
          );
        } else {
          (message.channel as TextChannel).send(
            "ERROR: Failed to set. Try again later."
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
