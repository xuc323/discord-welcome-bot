import { Command } from "../../type";

export const basic: Command = {
  name: "shuffle",
  description: "Shuffle the queue.",
  aliases: ["shuf"],
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

      queue.shuffle();
      message.channel.send("MUSIC STATUS: Queue is now shuffled!");
    } else {
      // the queue doesn't exist
      message.channel.send(
        `WARNING: Queue is empty, can't perform \`${this.name}\`.`
      );
    }
  },
};
