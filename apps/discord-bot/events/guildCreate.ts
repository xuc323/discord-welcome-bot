import { Events, Guild } from "discord.js";
import { Event, MyClient } from "../type";

export const event: Event = {
  name: Events.GuildCreate,
  execute(client: MyClient, guild: Guild) {
    guild.systemChannel?.send(
      "Thanks for inviting me to your server!\nCommands start with `!`. Type `!help` for more information."
    );
  },
};
