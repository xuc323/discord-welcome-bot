import { GuildChannelResolvable, TextChannel } from "discord.js";
import { Command } from "../../type";

export const basic: Command = {
  name: "playlist",
  description: "Play the music in the playlist by url.",
  aliases: ["pl"],
  args: true,
  usage: "[playlist url]",
  async execute(message, args, client) {
    // create queue if not exists, otherwise get the queue
    const queue = client.player!.createQueue(
      message.guild!.id,
      message.channel as TextChannel
    );

    await queue.join(message.member?.voice.channel as GuildChannelResolvable);
    if (queue.connection?.channel != message.member?.voice.channel) {
      // the user is not in the same voice channel as the bot
      return message.channel.send(
        `Music is playing in ${queue.connection?.channel}. Join or wait for it to finish.`
      );
    }
    // the user is in the same voice channel as the bot
    // add playlist to the queue
    await queue.play(args.join(" ")).catch((err: any) => {
      console.log(`MUSIC PLAY ERROR: ${err}`);
      message.channel.send(err);
    });
  },
};
