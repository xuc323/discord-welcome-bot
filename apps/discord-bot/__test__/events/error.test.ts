import { event } from "../../events/error";
import { MyClient } from "../../type";

describe("Client error event", () => {
  const client = {} as MyClient;
  console.log = jest.fn();

  it("Should log error", () => {
    const error = new Error("Test error...");
    event.execute(client, error);
    expect(console.log).toHaveBeenCalledWith(`BOT ERROR: ${error}`);
  });
});
