import { Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "math",
  description: "Perform math calculation. (+-*/%^)",
  args: true,
  usage: "[num1] [operator] [num2]",
  execute(message: Message, args: string[], client: MyClient) {
    if (args.length != 3) {
      return (message.channel as TextChannel).send(
        `Please follow the format: \`${this.usage}\``
      );
    }

    const num1 = Number(args[0]);
    const num2 = Number(args[2]);

    if ((!num1 && num1 != 0) || (!num2 && num2 != 0)) {
      return (message.channel as TextChannel).send("Only numbers are allowed.");
    }

    switch (args[1]) {
      case "+":
        (message.channel as TextChannel).send(
          `${args[0]} + ${args[2]} = ${num1 + num2}`
        );
        break;
      case "-":
        (message.channel as TextChannel).send(
          `${args[0]} - ${args[2]} = ${num1 - num2}`
        );
        break;
      case "*":
        (message.channel as TextChannel).send(
          `${args[0]} * ${args[2]} = ${num1 * num2}`
        );
        break;
      case "/":
        (message.channel as TextChannel).send(
          `${args[0]} / ${args[2]} = ${num1 / num2}`
        );
        break;
      case "%":
        (message.channel as TextChannel).send(
          `${args[0]} % ${args[2]} = ${num1 % num2}`
        );
        break;
      case "^":
        (message.channel as TextChannel).send(
          `${args[0]} ^ ${args[2]} = ${Math.pow(num1, num2)}`
        );
        break;
      default:
        (message.channel as TextChannel).send("Unknown operator.");
        break;
    }
  },
};
