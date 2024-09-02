import { Command } from "../../type";

export const basic: Command = {
  name: "progress",
  description: "Create a progress bar for the current song.",
  aliases: ["prog"],
  args: false,
  execute(message, args, client) {
    // check if the queue exists
    const queue = client.player!.getQueue(message.guild!.id);
    if (queue) {
      // the queue exists
      try {
        const bar = queue.createProgressBar();
        if (bar) {
          message.channel.send(`${queue.nowPlaying?.name}\n${bar.prettier}`);
        } else {
          message.channel.send(
            "ERROR: Failed to create progress bar. Try again later."
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
