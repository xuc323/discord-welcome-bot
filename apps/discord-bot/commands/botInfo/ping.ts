import { Message, SlashCommandBuilder } from "discord.js";
import { Command, SlashCommand } from "../../type";

export const basic: Command = {
  name: "ping",
  description: "Return bot's latency in ms.",
  args: false,
  execute(message, args, client) {
    // create ping
    const ping = client.ws.ping;
    // send the placeholder
    message.channel.send("Pinging...").then((sent) => {
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
  execute(interaction) {
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
