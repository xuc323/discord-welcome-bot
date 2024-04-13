import { Guild, TextChannel } from "discord.js";
import { MyClient } from "../../type";
import { event } from "../../events/guildCreate";

describe("Guild Create event", () => {
  const client = {} as MyClient;
  const channel = { send: jest.fn() } as unknown as TextChannel;
  const guild = { systemChannel: channel } as Guild;

  it("Should send message to system channel", () => {
    event.execute(client, guild);
    expect(channel.send).toHaveBeenCalledTimes(1);
  });
});
