// import discord.js module
import {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} from "discord.js";
// import file system module
import { readdirSync } from "node:fs";
// import music player module
import { Player } from "@jadestudios/discord-music-player";
// dotenv file
import "dotenv/config";
import { Command, Event, MyClient, PlayerEvent, SlashCommand } from "./type";
// postgres database
import { Database } from "@repo/database";

/**
 * START CREATING BOT CLIENT
 */
// create an instance of a discord client
const client: MyClient = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    activities: [{ name: "| !help for help", type: ActivityType.Watching }],
    status: "online",
  },
});

// register commands
client.commands = new Collection();
client.slashCommands = new Collection();
const commandFiles = readdirSync(`./commands`, {
  recursive: true,
  encoding: "utf-8",
}).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
// dynamically import the commands
for (const file of commandFiles) {
  import(`./commands/${file}`).then(
    ({ basic, slash }: { basic: Command; slash: SlashCommand }) => {
      client.commands?.set(basic.name, basic);
      if (slash) {
        client.slashCommands?.set(slash.data.name, slash);
      }
    }
  );
}

// register events
const eventFiles = readdirSync(`./events`, {
  recursive: true,
  encoding: "utf-8",
}).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const file of eventFiles) {
  // dynamically import the events
  import(`./events/${file}`).then(({ event }: { event: Event<any> }) => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  });
}
/**
 * END CREATING BOT CLIENT
 */

/**
 * START CREATING PLAYER CLIENT
 */
// create an instance of music player by passing in discord client and attach to bot client
client.player = new Player(client, {
  leaveOnEmpty: true,
  leaveOnEnd: false,
  leaveOnStop: false,
  quality: "high",
  timeout: 10 * 60 * 1000,
});

// register music events
const musicEventFiles = readdirSync(`./music_events`, {
  recursive: true,
  encoding: "utf-8",
}).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const file of musicEventFiles) {
  // dynamically import the music events
  import(`./music_events/${file}`).then(({ event }: { event: PlayerEvent }) => {
    client.player?.on(event.name, (...args) => event.execute(client, ...args));
  });
}
/**
 * END CREATING PLAYER CLIENT
 */

/**
 * START CREATING POSTGRES DATABASE CLIENT
 */
// create an instance of database and attach to bot client
client.postgres = new Database(process.env.POSTGRES_URL!);
/**
 * END CREATING POSTGRES DATABASE CLIENT
 */

// after everything, log in using token
client.login(process.env.DISCORD_TOKEN!);
