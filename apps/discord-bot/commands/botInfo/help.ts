import { Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";
const prefix = process.env.PREFIX ?? "!";

export const basic: Command = {
  name: "help",
  description: "List all commands or info about a specific command.",
  usage: "[command name]",
  aliases: ["h"],
  execute(message: Message, args: string[], client: MyClient) {
    // contains all the commands and descriptions
    const data: string[] = [];
    const { commands } = client;
    if (!args.length) {
      // no args, return all commands
      data.push("Supported commands:\n");
      // construct command string
      data.push(
        commands!
          .map(
            (command: Command) => `**${command.name}** ${command.description}`
          )
          .join("\n")
      );
      data.push(
        `\nYou can send \`${prefix}help ${this.usage}\` to get info of a specific command.`
      );
    } else {
      // args, return the specific command
      const name = args[0]!.toLowerCase();
      // find if the command exists or the aliases exist
      const command =
        commands?.get(name) ||
        commands?.find((c: Command) => {
          if (c.aliases && c.aliases.includes(name)) {
            return true;
          }
          return false;
        });

      if (!command) {
        // the command doesn't exist, send error message to channel
        return (message.channel as TextChannel).send(
          `\`${args[0]}\` is not a valid command. Type \`${prefix}${this.name}\` for more information.`
        );
      }

      // command exists
      data.push(`**Name:** ${command.name}`);
      if (command.aliases) {
        // the command has aliases, include in data
        data.push(`**Aliases:** ${command.aliases.join(", ")}`);
      }
      if (command.description) {
        // the command has description, include in data
        data.push(`**Description:** ${command.description}`);
      }
      if (command.usage) {
        // the command has usage, include in data "command + usage"
        data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
      } else {
        // the command doesn't have usage, include in data "command"
        data.push(`**Usage:** \`${prefix}${command.name}\``);
      }
    }
    // send the message to the channel
    (message.channel as TextChannel).send(data.join("\n"));
  },
};
