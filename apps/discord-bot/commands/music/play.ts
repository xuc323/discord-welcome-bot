import { GuildChannelResolvable, TextChannel } from "discord.js";
import { Command } from "../../type";

export const basic: Command = {
  name: "play",
  description: "Play the music by name or url.",
  aliases: ["p"],
  args: true,
  usage: "[song name or url]",
  isLive: true,
  async execute(message, args, client) {
    // create queue if not exists, otherwise get the queue
    const queue = client.player!.createQueue(
      message.guild!.id,
      message.channel as TextChannel
    );

    try {
      await queue.join(message.member?.voice.channel as GuildChannelResolvable);
    } catch (err: any) {
      const error: Error = err;
      console.log(`Connection Join Error: ${error}`);
      return message.channel.send(error.message);
    }
    if (queue.connection?.channel != message.member?.voice.channel) {
      // the user is not in the same voice channel as the bot
      return message.channel.send(
        `Music is playing in ${queue.connection?.channel}. Join or wait for it to finish.`
      );
    }

    // the user is in the same voice channel as the bot
    // add music to the queue
    try {
      await queue.play(args.join(" "), { requestedBy: message.author });
    } catch (err: any) {
      const error: Error = err;
      console.log(`Music Play Error: ${err}`);
      message.channel.send(error.message);
    }
  },
};
