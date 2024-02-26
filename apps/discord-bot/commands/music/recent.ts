import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "recent",
  description:
    "(dev) Print the songs played previously. (Up to 25, default is 5)",
  args: false,
  usage: "[number of songs]",
  execute(message: Message, args: string[], client: MyClient) {
    return (message.channel as TextChannel).send(
      "This command is currently under development, check back later!"
    );
    // // create an embed message
    // const emb = new EmbedBuilder()
    //   .setTitle(`Recently played songs for ${message.guild.name}`)
    //   .setThumbnail(message.guild.iconURL());

    // // if no args or args is not number, default to 5, otherwise use args
    // const limit = (args[0] && Number(args[0])) || 5;
    // if (limit > 25) {
    //   // set limit to 25 because that's what discord allows
    //   return message.channel.send("The limit is 25.");
    // }

    // client.postgres?
    //   .getRecentSongs(message.guild.id, limit)
    //   .then((songs) => {
    //     // get whichever is smaller
    //     const len = songs.rows.length > limit ? limit : songs.rows.length;
    //     for (let i = 0; i < len; i++) {
    //       const song = songs.rows[i];
    //       emb.addFields([
    //         {
    //           name: `#${i + 1}`,
    //           value: `**Name: **${song.name}\n**Author: **${song.author}\n**Url: **${song.url}\n**Requested By: **<@${song.id}>\n**Requested At: **${song.date}\n`,
    //         },
    //       ]);
    //     }
    //     emb.setFooter({ text: `Count: ${songs.rows.length}` });
    //     message.channel.send({ embeds: [emb] });
    //   })
    //   .catch((err) => {
    //     message.channel.send(err.message);
    //     console.log(err);
    //   });
  },
};
