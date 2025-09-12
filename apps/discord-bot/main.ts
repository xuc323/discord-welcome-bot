import { Database } from "@repo/database";
import { Player, PlayerEventNames } from "@repo/music-player";
import {
  ActivityType,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import "dotenv/config";
import BotCommands from "./commands";
import BotEvents from "./events";
import BotMusicEvents from "./music_events";
import { Command, Event, MyClient, PlayerEvent, SlashCommand } from "./type";

/**
 * START CREATING BOT CLIENT
 */
// create an instance of a discord client
const client: MyClient = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  presence: {
    activities: [{ name: "| !help for help", type: ActivityType.Watching }],
    status: "online",
  },
});

// register commands
client.commands = new Collection();
client.slashCommands = new Collection();
BotCommands.forEach(
  ({ basic, slash }: { basic: Command; slash?: SlashCommand }) => {
    client.commands?.set(basic.name, basic);
    if (slash) {
      client.slashCommands?.set(slash.data.name, slash);
    }
  }
);

// register events
BotEvents.forEach((e) => {
  const event = e.event as Event<keyof ClientEvents>;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
});

// create an instance of music player by passing in discord client and attach to bot client
client.player = new Player(client);

// register music events
BotMusicEvents.forEach((e) => {
  const event = e.event as PlayerEvent<PlayerEventNames>;
  client.player?.on(event.name, (...args) => event.execute(client, ...args));
});

// create an instance of database and attach to bot client
client.postgres = new Database(process.env.POSTGRES_URL);

// after everything, log in using token
client.login(process.env.DISCORD_TOKEN);
