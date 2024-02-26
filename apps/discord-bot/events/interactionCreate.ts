import { Events, Interaction } from "discord.js";
import { Event, MyClient } from "../type";

export const event: Event = {
  name: Events.InteractionCreate,
  execute(client: MyClient, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.slashCommands?.get(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      command.execute(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "There was an error trying to execute that command..",
        ephemeral: true,
      });
    }
  },
};
