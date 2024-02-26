import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "queue",
  description: "List all songs in the queue. (Up to 25, default is 5)",
  aliases: ["q"],
  args: false,
  usage: "[number of songs]",
  execute(message: Message, args: string[], client: MyClient) {
    // check if the queue exists
    const queue = client.player!.getQueue(message.guild!.id);
    // create an embed message
    const emb = new EmbedBuilder().setTitle(`Queue for ${message.guild!.name}`);

    if (queue) {
      // the queue exists
      // display the voice channel for easy join
      emb.setDescription(`Playing in ${queue.connection?.channel}`);
      // if no args or args is not number, default to 5, otherwise use args
      let limit = (args[0] && Number(args[0])) || 5;
      if (limit > 25) {
        // set limit to 25 because that's what discord allows
        (message.channel as TextChannel).send("The limit is 25.");
        limit = 25;
      } else if (limit < 1) {
        (message.channel as TextChannel).send(
          "Number can't be less than 1. Default to 5.."
        );
        limit = 5;
      }

      // set whichever is smaller
      const len = queue.songs.length > limit ? limit : queue.songs.length;
      for (let i = 0; i < len; i++) {
        const song = queue.songs[i]!;
        if (i === 0) {
          // if it's the first song
          emb.setThumbnail(song.thumbnail).addFields([
            {
              name: "Now Playing",
              value: `**Name:** ${song.name}\n**Author:** ${song.author}\n**Link:** ${song.url}\n**Requested by:** ${song.requestedBy}`,
            },
          ]);
        } else {
          emb.addFields([
            {
              name: `#${i + 1}`,
              value: `**Name:** ${song.name}\n**Author:** ${song.author}\n**Link:** ${song.url}\n**Requested by:** ${song.requestedBy}`,
            },
          ]);
        }
      }
      emb.setFooter({ text: `Music count: ${queue.songs.length}` });
    } else {
      // the queue doesn't exist
      emb.setFooter({ text: "Queue is empty." });
    }
    (message.channel as TextChannel).send({ embeds: [emb] });
  },
};
