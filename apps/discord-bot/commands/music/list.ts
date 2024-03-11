import { Message } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "list",
  description: "(dev)",
  args: false,
  execute(message: Message, args: string[], client: MyClient) {
    message.channel.send(
      "This command is currently under development, check back later!"
    );
  },
};
