import { Message, TextChannel } from "discord.js";
import { Command, MyClient } from "../../type";

export const basic: Command = {
  name: "uptime",
  description: "Display bot's uptime.",
  args: false,
  aliases: ["up"],
  execute(message: Message, args: string[], client: MyClient) {
    // calculate how long the bot has been up
    let str: string[] = [];
    let duration = client.uptime!;

    const msInDay = 1000 * 60 * 60 * 24;
    const days = Math.trunc(duration / msInDay);
    if (days > 0) {
      str.push(days + "d");
      duration = duration - days * msInDay;
    }

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      str.push(hours + "h");
      duration = duration - hours * msInHour;
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      str.push(minutes + "m");
      duration = duration - minutes * msInMinute;
    }

    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      str.push(seconds + "s");
    }

    (message.channel as TextChannel).send(
      `**${client.user?.username}** has been up for ${str.join(" ")}.`
    );
  },
};
