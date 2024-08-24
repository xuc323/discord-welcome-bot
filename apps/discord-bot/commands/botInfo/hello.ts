import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { Command, MyClient, SlashCommand } from "../../type";

export const basic: Command = {
  name: "hello",
  description: "Hello!",
  args: false,
  aliases: ["hi"],
  isLive: true,
  execute(message: Message, args: string[], client: MyClient) {
    message.channel.send(`Hi, ${message.author.username}!`);
  },
};

export const slash: SlashCommand = {
  data: new SlashCommandBuilder().setName("hello").setDescription("Hello!"),
  execute(interaction: CommandInteraction) {
    interaction.reply(`Hi, ${interaction.user.username}`);
  },
};
