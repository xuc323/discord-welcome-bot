import { Events } from "discord.js";
import { Event } from "../type";

export const event: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute(client, _client) {
    console.log(`Bot is online! Logged in as ${client.user?.tag}!`);
  },
};
