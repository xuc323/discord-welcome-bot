import { Player, PlayerEvents } from "@jadestudios/discord-music-player";
import {
  Client,
  Collection,
  CommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import Database from "./database";

export interface MyClient extends Client {
  player?: Player;
  postgres?: Database;
  commands?: Collection<string, Command>;
  slashCommands?: Collection<string, SlashCommand>;
}

export interface Command {
  readonly name: string;
  readonly description: string;
  readonly args?: boolean;
  readonly aliases?: string[];
  readonly usage?: string;
  execute: (message: Message, args: string[], client: MyClient) => any;
}

export interface SlashCommand {
  readonly data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => any;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: (client: MyClient, ...args: any[]) => any;
}

export interface PlayerEvent {
  name: keyof PlayerEvents;
  execute: (client: MyClient, ...args: any[]) => any;
}

export type QueueData = {
  msgChannel: Message["channel"];
};
