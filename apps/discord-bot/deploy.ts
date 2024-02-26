import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { SlashCommand } from "./type";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandFolderPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandFolderPath);
for (const folder of commandFolders) {
  const commandSubFolderPath = path.join(commandFolderPath, folder);
  const commandFiles = fs
    .readdirSync(commandSubFolderPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
  for (const file of commandFiles) {
    const commandFilePath = path.join(commandSubFolderPath, file);
    const command = require(commandFilePath);
    const slash: SlashCommand = command.slash;
    if (slash) {
      commands.push(slash.data.toJSON());
    }
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

console.log(`Started refreshing ${commands.length} application (/) commands.`);

rest
  .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commands,
  })
  .then(() => {
    console.log(`Successfully reloaded application (/) commands.`);
  })
  .catch((error) => {
    console.error(error);
  });
