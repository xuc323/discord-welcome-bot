import { Command } from "../../type";

export const basic: Command = {
  name: "math",
  description: "Perform math calculation. (+-*/%^)",
  args: true,
  usage: "[num1] [operator] [num2]",
  execute(message, args, client) {
    if (args.length != 3) {
      return message.channel.send(
        `Please follow the format: \`${this.usage}\``
      );
    }

    const num1 = Number(args[0]);
    const num2 = Number(args[2]);

    if ((!num1 && num1 != 0) || (!num2 && num2 != 0)) {
      return message.channel.send("Only numbers are allowed.");
    }

    let answer: number;

    switch (args[1]) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
      case "/":
        answer = num1 / num2;
        break;
      case "%":
        answer = num1 % num2;
        break;
      case "^":
        answer = Math.pow(num1, num2);
        break;
      default:
        return message.channel.send("Unknown operator.");
    }
    message.channel.send(`${args[0]} ${args[1]} ${args[2]} = ${answer}`);
  },
};
