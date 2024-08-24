import { Message } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "list",
  description: "(dev)",
  args: false,
  isLive: false,
  execute(message: Message, args: string[], client: MyClient) {},
};
