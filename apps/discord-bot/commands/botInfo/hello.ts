import {
  CommandInteraction,
  Events,
  Message,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Command, MyClient, SlashCommand } from "../../type";

export const basic: Command = {
  name: "hello",
  description: "Hello!",
  args: false,
  aliases: ["hi"],
  execute(message: Message, args: string[], client: MyClient) {
    (message.channel as TextChannel).send(`Hi, ${message.author.username}!`);
    client.on(Events.InteractionCreate, (c) => {});
  },
};

export const slash: SlashCommand = {
  data: new SlashCommandBuilder().setName("hello").setDescription("Hello!"),
  execute(interaction: CommandInteraction) {
    interaction.reply(`Hi, ${interaction.user.username}`);
  },
};
