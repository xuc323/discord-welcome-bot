import { GuildChannelResolvable, Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";
import { DMPError } from "@jadestudios/discord-music-player";

export const basic: Command = {
  name: "play",
  description: "Play the music by name or url.",
  aliases: ["p"],
  args: true,
  usage: "[song name or url]",
  async execute(message: Message, args: string[], client: MyClient) {
    // create queue if not exists, otherwise get the queue
    const queue = client.player!.createQueue(message.guild!.id, {
      data: {
        msgChannel: message.channel,
      },
    });
    try {
      await queue.join(message.member?.voice.channel as GuildChannelResolvable);
    } catch (err: any) {
      const error: DMPError = err;
      console.log(error);
      return (message.channel as TextChannel).send(error.message);
    }
    if (queue.connection?.channel != message.member?.voice.channel) {
      // the user is not in the same voice channel as the bot
      return (message.channel as TextChannel).send(
        `Music is playing in ${queue.connection?.channel}. Join or wait for it to finish.`
      );
    }
    // the user is in the same voice channel as the bot
    // add music to the queue
    try {
      await queue.play(args.join(" "), { requestedBy: message.author });
    } catch (err: any) {
      const error: Error = err;
      console.log(`MUSIC PLAY ERROR: ${err}`);
      (message.channel as TextChannel).send(error.message);
    }
  },
};
