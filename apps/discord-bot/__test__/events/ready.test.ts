import { MyClient } from "../../type";
import { event } from "../../events/ready";
import { Client } from "discord.js";

describe("Client becomes ready", () => {
  const client = { user: { tag: "test-user-tag" } } as MyClient;
  console.log = jest.fn();

  it("Should log ready and client tag", () => {
    event.execute(client, {} as Client<true>);
    expect(console.log).toHaveBeenCalledWith(
      `Bot is online! Logged in as ${client.user?.tag}!`
    );
  });
});
