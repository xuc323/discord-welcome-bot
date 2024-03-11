import { EmbedBuilder, Message } from "discord.js";
import { Command, MyClient } from "../../type";
import { selectRecentSongsInGuildOrderByRequestTime } from "@repo/database";

export const basic: Command = {
  name: "recent",
  description: "Print the songs played previously. (Up to 25, default is 5)",
  args: false,
  usage: "[number of songs]",
  execute(message: Message, args: string[], client: MyClient) {
    // create an embed message
    const emb = new EmbedBuilder()
      .setTitle(`Recently played songs for ${message.guild!.name}`)
      .setThumbnail(message.guild!.iconURL());

    // if no args or args is not number, default to 5, otherwise use args
    const limit = (args[0] && Number(args[0])) || 5;
    if (limit > 25) {
      // set limit to 25 because that's what discord allows
      return message.channel.send("The limit is 25.");
    }

    selectRecentSongsInGuildOrderByRequestTime(
      client.postgres!,
      BigInt(message.guild!.id),
      limit
    )
      .then((songs) => {
        // get whichever is smaller
        const len = songs.length > limit ? limit : songs.length;
        for (let i = 0; i < len; i++) {
          const song = songs.at(i);
          emb.addFields([
            {
              name: `#${i + 1}`,
              value: `**Name: **${song?.name}\n**Author: **${song?.author}\n**Url: **${song?.url}\n**Requested By: **<@${song?.userId}>\n**Requested At: **${song?.requestedOn}\n`,
            },
          ]);
        }
        emb.setFooter({ text: `Count: ${songs.length}` });
        message.channel.send({ embeds: [emb] });
      })
      .catch((err: Error) => {
        message.channel.send(
          "Failed to fetch recently played songs. Try again later..."
        );
        console.log(err);
      });
  },
};
