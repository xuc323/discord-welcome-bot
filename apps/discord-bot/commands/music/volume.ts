import { Command } from "../../type";

export const basic: Command = {
  name: "volume",
  description: "Display or adjust the volume of the music.",
  aliases: ["v"],
  args: false,
  usage: "[volume number]",
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
      const vol = args[0] && Number(args[0]);
      if (vol) {
        if (vol > 200 || vol < 0) {
          return message.channel.send("WARNING: Volume range 0-200.");
        }
        try {
          const status = queue.setVolume(vol);
          if (status) {
            message.channel.send(`MUSIC STATUS: Volume set to ${vol}%.`);
          } else {
            message.channel.send(
              "ERROR: Failed to set volume. Try again later."
            );
          }
        } catch (err: any) {
          const error: Error = err;
          message.channel.send(error.message);
        }
      } else {
        message.channel.send(`MUSIC STATUS: Volume at ${queue.volume}%.`);
      }
    } else {
      // the queue doesn't exist
      message.channel.send(
        `WARNING: Queue is empty, can't perform \`${this.name}\`.`
      );
    }
  },
};
