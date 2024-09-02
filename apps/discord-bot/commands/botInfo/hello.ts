import { SlashCommandBuilder } from "discord.js";
import { Command, SlashCommand } from "../../type";

export const basic: Command = {
  name: "hello",
  description: "Hello!",
  args: false,
  aliases: ["hi"],
  execute(message, args, client) {
    message.channel.send(`Hi, ${message.author.username}!`);
  },
};

export const slash: SlashCommand = {
  data: new SlashCommandBuilder().setName("hello").setDescription("Hello!"),
  execute(interaction) {
    interaction.reply(`Hi, ${interaction.user.username}`);
  },
};
