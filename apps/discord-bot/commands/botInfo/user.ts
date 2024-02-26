import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "user",
  description: "Display user info.",
  args: false,
  execute(message: Message, args: string[], client: MyClient) {
    const { createdAt, id, username, tag } = message.author;
    const emb = new EmbedBuilder()
      .setTitle(`User info for \`${username}\``)
      .setThumbnail(message.author.avatarURL())
      .addFields([
        {
          name: "ID ",
          value: id,
        },
        {
          name: "Tag ",
          value: tag,
        },
        {
          name: "Created at ",
          value: createdAt.toString(),
        },
      ]);
    (message.channel as TextChannel).send({ embeds: [emb] });
  },
};
