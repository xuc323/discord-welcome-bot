import { Events } from "discord.js";
import { Event, MyClient } from "../type";

export const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute(client: MyClient) {
    console.log(`Bot is online! Logged in as ${client.user?.tag}!`);
  },
};
