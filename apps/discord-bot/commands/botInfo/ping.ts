import {
  CommandInteraction,
  Message,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Command, MyClient, SlashCommand } from "../../type";

export const basic: Command = {
  name: "ping",
  description: "Return bot's latency in ms.",
  args: false,
  execute(message: Message, args: string[], client: MyClient) {
    // create ping
    const ping = client.ws.ping;
    // send the placeholder
    (message.channel as TextChannel).send("Pinging...").then((sent) => {
      // modify the message with latency status
      sent.edit(
        `Websocket heartbeat: ${ping}ms.\nRoundtrip latency: ${
          sent.createdTimestamp - message.createdTimestamp
        }ms.`
      );
    });
  },
};

export const slash: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returen latency in miliseconds."),
  execute(interaction: CommandInteraction) {
    const ping = interaction.client.ws.ping;
    interaction
      .reply({ content: "Pinging...", fetchReply: true })
      .then((message: Message) => {
        interaction.editReply(
          `Websocket heartbeat: ${ping}ms.\nRoundtrip latency: ${
            message.createdTimestamp - interaction.createdTimestamp
          }ms.`
        );
      })
      .catch((err) => console.error(err));
  },
};
