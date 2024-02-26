import { Events } from "discord.js";
import { Event, MyClient } from "../type";

export const event: Event = {
  name: Events.Error,
  execute(client: MyClient, error: Error) {
    console.log(`BOT ERROR: ${error}`);
  },
};
