import { Events } from "discord.js";
import { Event } from "../type";

export const event: Event<Events.GuildCreate> = {
  name: Events.GuildCreate,
  execute(client, guild) {
    guild.systemChannel?.send(
      "Thanks for inviting me to your server!\nCommands start with `!`. Type `!help` for more information."
    );
  },
};
