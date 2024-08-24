import { Database } from "@repo/database";
import { Player, PlayerEvents } from "@repo/music-player";
import {
  Client,
  ClientEvents,
  Collection,
  CommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

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
  readonly isLive: boolean;
  execute: (message: Message, args: string[], client: MyClient) => any;
}

export interface SlashCommand {
  readonly data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => any;
}

export interface Event<E extends keyof ClientEvents> {
  name: E;
  once?: boolean;
  execute: (client: MyClient, ...args: ClientEvents[E]) => any;
}

export interface PlayerEvent<E extends keyof PlayerEvents> {
  name: E;
  execute: (client: MyClient, ...args: PlayerEvents[E]) => any;
}
