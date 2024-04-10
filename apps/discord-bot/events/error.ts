import { Events } from "discord.js";
import { Event } from "../type";

export const event: Event<Events.Error> = {
  name: Events.Error,
  execute(client, error) {
    console.log(`BOT ERROR: ${error}`);
  },
};
