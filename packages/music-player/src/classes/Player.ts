import EventEmitter from "node:events";
import { Queue, Song } from "..";
import { Client, Collection, Snowflake } from "discord.js";

/**
 * Define the events might be emitted by the player and the corresponding
 * parameters
 */
export interface PlayerEvents {
  channelEmpty: [queue: Queue];
  songAdd: [queue: Queue, song: Song];
  queueEnd: [queue: Queue];
  queueDestroyed: [queue: Queue];
  songChanged: [queue: Queue, newSong: Song, oldSong: Song];
  songFirst: [queue: Queue, song: Song];
  clientDisconnect: [queue: Queue];
  clientUndeafen: [queue: Queue];
  error: [error: string, queue: Queue];
}

/** Define the types of events */
export interface Player extends EventEmitter {
  /** @param {string} event Dw dw */
  on(event: "channelEmpty", listener: (queue: Queue) => void): this;
  emit(event: "channelEmpty", queue: Queue): boolean;
  on(event: "songAdd", listener: (queue: Queue, song: Song) => void): this;
  emit(event: "channelEmpty", queue: Queue, song: Song): boolean;
  on(event: "queueEnd", listener: (queue: Queue) => void): this;
  emit(event: "queueEnd", queue: Queue): boolean;
}

/**
 * The starting point of the music player. Manages multiples music queues in
 * different guilds. Handles music related evenets
 */
export class Player extends EventEmitter {
  private client: Client;
  private queues: Collection<Snowflake, Queue>;

  constructor(client: Client) {
    super();

    this.client = client;
    this.queues = new Collection();
  }

  public create() {}

  public leave(guildId: Snowflake) {
    this.queues.delete(guildId);
  }
}
